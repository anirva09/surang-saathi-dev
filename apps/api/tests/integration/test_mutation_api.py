from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy import delete, select

from app.core.database import SessionLocal
from app.main import app
from app.modules.audit.hashing import calculate_event_hash
from app.modules.audit.model import AuditEvent
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.hazards.model import Hazard
from app.seed.run import seed


client = TestClient(app)
TEST_HAZARD_ID = "HZRD-TEST-MUT-001"
TEST_ACTION_ID = "ACT-TEST-MUT-001"


def _cleanup() -> None:
    with SessionLocal() as session:
        session.execute(
            delete(AuditEvent).where(
                (AuditEvent.entity_id == TEST_HAZARD_ID)
                | (AuditEvent.entity_id == TEST_ACTION_ID)
            )
        )
        session.execute(
            delete(CorrectiveAction).where(CorrectiveAction.id == TEST_ACTION_ID)
        )
        session.execute(delete(Hazard).where(Hazard.id == TEST_HAZARD_ID))
        session.commit()


def setup_module() -> None:
    seed()
    _cleanup()


def teardown_module() -> None:
    _cleanup()


def test_golden_workflow_mutations_append_audit_chain() -> None:
    captured_at = datetime.now(timezone.utc) - timedelta(minutes=10)

    create_hazard = client.post(
        "/api/v1/hazards",
        json={
            "hazardId": TEST_HAZARD_ID,
            "mineId": "MINE-03",
            "title": "Test roof-bolt deformation",
            "description": "Controlled integration-test hazard for mutation workflow.",
            "severity": "MEDIUM",
            "locationName": "Test Gallery",
            "reportedByUserId": "USR-RKUMAR",
            "assignedToUserId": "USR-MSHARMA",
            "capturedAt": captured_at.isoformat(),
            "actorId": "USR-RKUMAR",
        },
    )
    assert create_hazard.status_code == 201, create_hazard.text
    assert create_hazard.json()["hazardId"] == TEST_HAZARD_ID
    assert create_hazard.json()["syncState"] == "SYNCED"
    assert create_hazard.json()["geofenceState"] == "SERVER_PENDING"

    acknowledge = client.post(
        f"/api/v1/hazards/{TEST_HAZARD_ID}/acknowledge",
        json={"actorId": "USR-MSHARMA"},
    )
    assert acknowledge.status_code == 200, acknowledge.text
    assert acknowledge.json()["status"] == "ACKNOWLEDGED"

    review = client.post(
        f"/api/v1/hazards/{TEST_HAZARD_ID}/review",
        json={
            "actorId": "USR-MSHARMA",
            "severity": "HIGH",
            "status": "ESCALATED",
            "assignedToUserId": "USR-MSHARMA",
        },
    )
    assert review.status_code == 200, review.text
    assert review.json()["severity"] == "HIGH"
    assert review.json()["status"] == "ESCALATED"

    due_at = datetime.now(timezone.utc) + timedelta(days=1)
    create_action = client.post(
        "/api/v1/corrective-actions",
        json={
            "actionId": TEST_ACTION_ID,
            "hazardId": TEST_HAZARD_ID,
            "description": "Replace the test roof bolt and re-inspect.",
            "assignedToUserId": "USR-MSHARMA",
            "dueAt": due_at.isoformat(),
            "actorId": "USR-MSHARMA",
        },
    )
    assert create_action.status_code == 201, create_action.text
    assert create_action.json()["actionId"] == TEST_ACTION_ID
    assert create_action.json()["status"] == "OPEN"

    update_action = client.patch(
        f"/api/v1/corrective-actions/{TEST_ACTION_ID}",
        json={
            "actorId": "USR-MSHARMA",
            "status": "ACKNOWLEDGED",
            "description": "Replace the test roof bolt, torque-check, and re-inspect.",
        },
    )
    assert update_action.status_code == 200, update_action.text
    assert update_action.json()["status"] == "ACKNOWLEDGED"
    assert update_action.json()["acknowledgedAt"] is not None

    resolve_action = client.post(
        f"/api/v1/corrective-actions/{TEST_ACTION_ID}/resolve",
        json={"actorId": "USR-MSHARMA"},
    )
    assert resolve_action.status_code == 200, resolve_action.text
    assert resolve_action.json()["status"] == "RESOLVED"
    assert resolve_action.json()["resolvedAt"] is not None

    hazard_after_resolution = client.get(f"/api/v1/hazards/{TEST_HAZARD_ID}")
    assert hazard_after_resolution.status_code == 200
    assert hazard_after_resolution.json()["status"] == "RESOLVED"

    with SessionLocal() as session:
        events = session.scalars(
            select(AuditEvent)
            .where(
                (AuditEvent.entity_id == TEST_HAZARD_ID)
                | (AuditEvent.entity_id == TEST_ACTION_ID)
            )
            .order_by(AuditEvent.sequence.asc())
        ).all()

    assert [event.event_type for event in events] == [
        "HAZARD_CREATED",
        "HAZARD_ACKNOWLEDGED",
        "HAZARD_REVIEWED",
        "CORRECTIVE_ACTION_CREATED",
        "CORRECTIVE_ACTION_UPDATED",
        "CORRECTIVE_ACTION_RESOLVED",
        "HAZARD_RESOLVED",
    ]

    for index, event in enumerate(events):
        material = {
            "id": event.id,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "event_type": event.event_type,
            "actor_id": event.actor_id,
            "payload": event.payload_json,
        }
        assert calculate_event_hash(material, event.previous_hash) == event.event_hash
        if index > 0:
            assert event.previous_hash == events[index - 1].event_hash


def test_duplicate_hazard_id_returns_409() -> None:
    payload = {
        "hazardId": TEST_HAZARD_ID,
        "mineId": "MINE-03",
        "title": "Duplicate",
        "description": "Duplicate should conflict.",
        "severity": "LOW",
        "locationName": "Test Gallery",
        "reportedByUserId": "USR-RKUMAR",
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "actorId": "USR-RKUMAR",
    }

    first = client.post("/api/v1/hazards", json=payload)
    if first.status_code == 201:
        second = client.post("/api/v1/hazards", json=payload)
        assert second.status_code == 409
    else:
        assert first.status_code == 409


def test_mutation_unknown_resources_return_404() -> None:
    acknowledge = client.post(
        "/api/v1/hazards/HZRD-MISSING/acknowledge",
        json={"actorId": "USR-MSHARMA"},
    )
    assert acknowledge.status_code == 404

    resolve = client.post(
        "/api/v1/corrective-actions/ACT-MISSING/resolve",
        json={"actorId": "USR-MSHARMA"},
    )
    assert resolve.status_code == 404
