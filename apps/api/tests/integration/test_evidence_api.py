import hashlib
from datetime import datetime, timezone

from fastapi.testclient import TestClient
from sqlalchemy import delete, select, text

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.main import app
from app.modules.audit.hashing import calculate_event_hash
from app.modules.audit.model import AuditEvent
from app.modules.evidence.model import HazardEvidence
from app.modules.evidence.storage import create_minio_client, ensure_evidence_bucket
from app.modules.hazards.model import Hazard
from app.seed.run import seed


client = TestClient(app)
TEST_HAZARD_ID = "HZRD-TEST-EVD-001"
VERIFIED_EVIDENCE_ID = "EVD-TEST-VERIFIED-001"
OUTSIDE_EVIDENCE_ID = "EVD-TEST-OUTSIDE-001"
MISMATCH_EVIDENCE_ID = "EVD-TEST-MISMATCH-001"
TEST_EVIDENCE_IDS = (
    VERIFIED_EVIDENCE_ID,
    OUTSIDE_EVIDENCE_ID,
    MISMATCH_EVIDENCE_ID,
)
TEST_BOUNDARY_WKT = (
    "POLYGON(("
    "86.400000 23.700000,"
    "86.500000 23.700000,"
    "86.500000 23.800000,"
    "86.400000 23.800000,"
    "86.400000 23.700000"
    "))"
)
_original_boundary_ewkt: str | None = None


def _object_key(evidence_id: str, file_name: str) -> str:
    return f"hazards/{TEST_HAZARD_ID}/{evidence_id}/{file_name}"


def _remove_test_objects() -> None:
    settings = get_settings()
    storage = create_minio_client()
    ensure_evidence_bucket(storage)
    for evidence_id, file_name in (
        (VERIFIED_EVIDENCE_ID, "boundary.jpg"),
        (OUTSIDE_EVIDENCE_ID, "outside.jpg"),
        (MISMATCH_EVIDENCE_ID, "mismatch.jpg"),
    ):
        try:
            storage.remove_object(
                settings.minio_bucket,
                _object_key(evidence_id, file_name),
            )
        except Exception:
            pass


def _cleanup() -> None:
    _remove_test_objects()
    with SessionLocal() as session:
        session.execute(
            delete(AuditEvent).where(
                (AuditEvent.entity_id == TEST_HAZARD_ID)
                | (AuditEvent.entity_id.in_(TEST_EVIDENCE_IDS))
            )
        )
        session.execute(
            delete(HazardEvidence).where(
                HazardEvidence.id.in_(TEST_EVIDENCE_IDS)
            )
        )
        session.execute(delete(Hazard).where(Hazard.id == TEST_HAZARD_ID))
        session.commit()


def setup_module() -> None:
    global _original_boundary_ewkt
    seed()
    _cleanup()

    with SessionLocal() as session:
        _original_boundary_ewkt = session.scalar(
            text("SELECT ST_AsEWKT(boundary) FROM mines WHERE id = 'MINE-03'")
        )
        session.execute(
            text(
                "UPDATE mines "
                "SET boundary = ST_GeomFromText(:boundary, 4326) "
                "WHERE id = 'MINE-03'"
            ),
            {"boundary": TEST_BOUNDARY_WKT},
        )
        session.add(
            Hazard(
                id=TEST_HAZARD_ID,
                mine_id="MINE-03",
                title="Evidence integration test hazard",
                description="Controlled hazard for evidence verification tests.",
                severity="HIGH",
                lifecycle_status="OPEN",
                location_name="Test Gallery",
                reported_by_user_id="USR-RKUMAR",
                assigned_to_user_id="USR-MSHARMA",
                sync_state="QUEUED",
                geofence_state="SERVER_PENDING",
                captured_at=datetime.now(timezone.utc),
                synced_at=None,
            )
        )
        session.commit()


def teardown_module() -> None:
    _cleanup()
    with SessionLocal() as session:
        if _original_boundary_ewkt is None:
            session.execute(
                text("UPDATE mines SET boundary = NULL WHERE id = 'MINE-03'")
            )
        else:
            session.execute(
                text(
                    "UPDATE mines "
                    "SET boundary = ST_GeomFromEWKT(:boundary) "
                    "WHERE id = 'MINE-03'"
                ),
                {"boundary": _original_boundary_ewkt},
            )
        session.commit()


def _upload(
    *,
    evidence_id: str,
    file_name: str,
    contents: bytes,
    latitude: float,
    longitude: float,
    local_state: str = "LOCAL_VALID",
    client_sha256: str | None = None,
):
    data = {
        "evidenceId": evidence_id,
        "actorId": "USR-RKUMAR",
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "latitude": str(latitude),
        "longitude": str(longitude),
        "accuracyMeters": "4.5",
        "localGeofenceState": local_state,
    }
    if client_sha256 is not None:
        data["clientSha256"] = client_sha256

    return client.post(
        f"/api/v1/hazards/{TEST_HAZARD_ID}/evidence",
        data=data,
        files={"file": (file_name, contents, "image/jpeg")},
    )


def test_boundary_point_is_server_verified_and_object_is_stored() -> None:
    contents = b"surang-saathi-boundary-evidence"
    digest = hashlib.sha256(contents).hexdigest()

    response = _upload(
        evidence_id=VERIFIED_EVIDENCE_ID,
        file_name="boundary.jpg",
        contents=contents,
        latitude=23.700000,
        longitude=86.400000,
        client_sha256=digest,
    )

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["evidenceId"] == VERIFIED_EVIDENCE_ID
    assert body["hazardId"] == TEST_HAZARD_ID
    assert body["sha256"] == digest
    assert body["hashVerified"] is True
    assert body["serverGeofenceState"] == "SERVER_VERIFIED"
    assert body["hazardGeofenceState"] == "SERVER_VERIFIED"
    assert body["hazardSyncState"] == "SYNCED"

    settings = get_settings()
    storage = create_minio_client()
    stored = storage.stat_object(
        settings.minio_bucket,
        _object_key(VERIFIED_EVIDENCE_ID, "boundary.jpg"),
    )
    assert stored.size == len(contents)

    with SessionLocal() as session:
        evidence = session.get(HazardEvidence, VERIFIED_EVIDENCE_ID)
        hazard = session.get(Hazard, TEST_HAZARD_ID)
        assert evidence is not None
        assert evidence.sha256 == digest
        assert evidence.server_geofence_state == "SERVER_VERIFIED"
        assert hazard is not None
        assert hazard.geofence_state == "SERVER_VERIFIED"
        assert hazard.sync_state == "SYNCED"


def test_server_outside_result_marks_local_valid_disagreement_as_conflict() -> None:
    contents = b"surang-saathi-outside-evidence"
    digest = hashlib.sha256(contents).hexdigest()

    response = _upload(
        evidence_id=OUTSIDE_EVIDENCE_ID,
        file_name="outside.jpg",
        contents=contents,
        latitude=24.000000,
        longitude=87.000000,
        local_state="LOCAL_VALID",
        client_sha256=digest,
    )

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["serverGeofenceState"] == "OUTSIDE_GEOFENCE"
    assert body["hazardGeofenceState"] == "CONFLICT"
    assert body["hazardSyncState"] == "SYNCED"

    with SessionLocal() as session:
        evidence = session.get(HazardEvidence, OUTSIDE_EVIDENCE_ID)
        hazard = session.get(Hazard, TEST_HAZARD_ID)
        assert evidence is not None
        assert evidence.server_geofence_state == "OUTSIDE_GEOFENCE"
        assert hazard is not None
        assert hazard.geofence_state == "CONFLICT"


def test_client_hash_mismatch_is_rejected_and_audited() -> None:
    contents = b"surang-saathi-hash-mismatch"

    response = _upload(
        evidence_id=MISMATCH_EVIDENCE_ID,
        file_name="mismatch.jpg",
        contents=contents,
        latitude=23.750000,
        longitude=86.450000,
        client_sha256="f" * 64,
    )

    assert response.status_code == 409, response.text

    with SessionLocal() as session:
        assert session.get(HazardEvidence, MISMATCH_EVIDENCE_ID) is None
        hazard = session.get(Hazard, TEST_HAZARD_ID)
        assert hazard is not None
        assert hazard.sync_state == "CONFLICT"

        event = session.scalar(
            select(AuditEvent).where(
                AuditEvent.entity_id == MISMATCH_EVIDENCE_ID,
                AuditEvent.event_type == "EVIDENCE_HASH_MISMATCH",
            )
        )
        assert event is not None
        material = {
            "id": event.id,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "event_type": event.event_type,
            "actor_id": event.actor_id,
            "payload": event.payload_json,
        }
        assert calculate_event_hash(material, event.previous_hash) == event.event_hash


def test_unknown_hazard_returns_404() -> None:
    response = client.post(
        "/api/v1/hazards/HZRD-MISSING/evidence",
        data={
            "evidenceId": "EVD-MISSING-001",
            "actorId": "USR-RKUMAR",
            "capturedAt": datetime.now(timezone.utc).isoformat(),
            "latitude": "23.75",
            "longitude": "86.45",
            "accuracyMeters": "5",
            "localGeofenceState": "LOCAL_VALID",
        },
        files={"file": ("missing.jpg", b"missing", "image/jpeg")},
    )
    assert response.status_code == 404


def test_invalid_coordinates_are_rejected_before_storage() -> None:
    response = _upload(
        evidence_id="EVD-INVALID-COORDS",
        file_name="invalid.jpg",
        contents=b"invalid-coordinates",
        latitude=95.0,
        longitude=86.45,
    )
    assert response.status_code == 422
