import hashlib
import io
import re
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.domain.enums import GeofenceState, SyncState
from app.modules.audit.service import append_audit_event
from app.modules.evidence.model import HazardEvidence
from app.modules.evidence.storage import create_minio_client, ensure_evidence_bucket
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.users.model import User


MAX_EVIDENCE_BYTES = 10 * 1024 * 1024
_SAFE_FILENAME = re.compile(r"[^A-Za-z0-9._-]+")


class EvidenceNotFoundError(Exception):
    pass


class EvidenceConflictError(Exception):
    pass


class EvidenceValidationError(Exception):
    pass


class EvidenceStorageError(Exception):
    pass


def _safe_file_name(file_name: str) -> str:
    leaf = file_name.replace("\\", "/").split("/")[-1].strip()
    if not leaf:
        leaf = "evidence.bin"
    safe = _SAFE_FILENAME.sub("_", leaf)
    return safe[:255]


def _server_geofence_state(
    session: Session,
    mine: Mine,
    *,
    latitude: float,
    longitude: float,
) -> str:
    if mine.boundary is None:
        return GeofenceState.SERVER_PENDING.value

    point = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)
    covered = session.scalar(
        select(func.ST_Covers(Mine.boundary, point)).where(Mine.id == mine.id)
    )
    return (
        GeofenceState.SERVER_VERIFIED.value
        if bool(covered)
        else GeofenceState.OUTSIDE_GEOFENCE.value
    )


def _hazard_geofence_state(local_state: str, server_state: str) -> str:
    if server_state == GeofenceState.SERVER_PENDING.value:
        return server_state

    local_says_inside = local_state == GeofenceState.LOCAL_VALID.value
    server_says_inside = server_state == GeofenceState.SERVER_VERIFIED.value

    if local_says_inside != server_says_inside:
        return GeofenceState.CONFLICT.value
    return server_state


def upload_hazard_evidence(
    session: Session,
    *,
    hazard_id: str,
    evidence_id: str,
    actor_id: str,
    file_name: str,
    mime_type: str,
    contents: bytes,
    captured_at: datetime,
    latitude: float,
    longitude: float,
    accuracy_meters: float,
    local_geofence_state: str,
    client_sha256: str | None,
) -> dict:
    hazard = session.get(Hazard, hazard_id)
    if hazard is None:
        raise EvidenceNotFoundError("Hazard not found")

    actor = session.get(User, actor_id)
    if actor is None:
        raise EvidenceNotFoundError(f"User {actor_id} not found")

    mine = session.get(Mine, hazard.mine_id)
    if mine is None:
        raise EvidenceNotFoundError("Mine not found")

    if session.get(HazardEvidence, evidence_id) is not None:
        raise EvidenceConflictError("Evidence already exists")

    if not contents:
        raise EvidenceValidationError("Evidence file is empty")
    if len(contents) > MAX_EVIDENCE_BYTES:
        raise EvidenceValidationError("Evidence file exceeds the 10 MiB limit")

    safe_name = _safe_file_name(file_name)
    digest = hashlib.sha256(contents).hexdigest()
    normalized_client_hash = client_sha256.lower() if client_sha256 is not None else None
    now = datetime.now(timezone.utc)

    if normalized_client_hash is not None and normalized_client_hash != digest:
        hazard.sync_state = SyncState.CONFLICT.value
        hazard.synced_at = now
        append_audit_event(
            session,
            entity_type="EVIDENCE",
            entity_id=evidence_id,
            event_type="EVIDENCE_HASH_MISMATCH",
            actor_id=actor_id,
            payload={
                "hazardId": hazard.id,
                "fileName": safe_name,
                "fileSize": len(contents),
                "clientSha256": normalized_client_hash,
                "serverSha256": digest,
                "syncState": hazard.sync_state,
            },
        )
        session.commit()
        raise EvidenceConflictError("Evidence SHA-256 does not match client hash")

    server_state = _server_geofence_state(
        session,
        mine,
        latitude=latitude,
        longitude=longitude,
    )
    hazard_geofence_state = _hazard_geofence_state(
        local_geofence_state,
        server_state,
    )

    object_key = f"hazards/{hazard.id}/{evidence_id}/{safe_name}"
    settings = get_settings()
    storage = create_minio_client()

    try:
        ensure_evidence_bucket(storage)
        storage.put_object(
            settings.minio_bucket,
            object_key,
            io.BytesIO(contents),
            len(contents),
            content_type=mime_type,
            metadata={
                "sha256": digest,
                "hazard-id": hazard.id,
                "evidence-id": evidence_id,
            },
        )
    except Exception as exc:
        session.rollback()
        raise EvidenceStorageError("Evidence object storage is unavailable") from exc

    evidence = HazardEvidence(
        id=evidence_id,
        hazard_id=hazard.id,
        object_key=object_key,
        file_name=safe_name,
        mime_type=mime_type,
        file_size=len(contents),
        sha256=digest,
        latitude=Decimal(str(latitude)),
        longitude=Decimal(str(longitude)),
        accuracy_meters=Decimal(str(accuracy_meters)),
        captured_at=captured_at,
        local_geofence_state=local_geofence_state,
        server_geofence_state=server_state,
    )
    session.add(evidence)

    hazard.sync_state = SyncState.SYNCED.value
    hazard.geofence_state = hazard_geofence_state
    hazard.synced_at = now

    append_audit_event(
        session,
        entity_type="EVIDENCE",
        entity_id=evidence.id,
        event_type="EVIDENCE_UPLOADED",
        actor_id=actor_id,
        payload={
            "hazardId": hazard.id,
            "objectKey": object_key,
            "fileName": safe_name,
            "mimeType": mime_type,
            "fileSize": len(contents),
            "sha256": digest,
            "latitude": latitude,
            "longitude": longitude,
            "accuracyMeters": accuracy_meters,
            "localGeofenceState": local_geofence_state,
            "serverGeofenceState": server_state,
            "hazardGeofenceState": hazard_geofence_state,
            "syncState": hazard.sync_state,
            "capturedAt": captured_at.isoformat(),
        },
    )

    try:
        session.commit()
    except Exception:
        session.rollback()
        try:
            storage.remove_object(settings.minio_bucket, object_key)
        except Exception:
            pass
        raise

    return {
        "evidence_id": evidence.id,
        "hazard_id": hazard.id,
        "file_name": evidence.file_name,
        "mime_type": evidence.mime_type,
        "file_size": evidence.file_size,
        "sha256": evidence.sha256,
        "hash_verified": normalized_client_hash is None or normalized_client_hash == digest,
        "latitude": evidence.latitude,
        "longitude": evidence.longitude,
        "accuracy_meters": evidence.accuracy_meters,
        "captured_at": evidence.captured_at,
        "local_geofence_state": evidence.local_geofence_state,
        "server_geofence_state": evidence.server_geofence_state,
        "hazard_sync_state": hazard.sync_state,
        "hazard_geofence_state": hazard.geofence_state,
    }
