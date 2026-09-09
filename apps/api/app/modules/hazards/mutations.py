from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.api.v1.schemas import HazardCreateIn, HazardReviewIn
from app.domain.enums import GeofenceState, LifecycleStatus, SyncState
from app.modules.audit.service import append_audit_event
from app.modules.hazards.model import Hazard
from app.modules.hazards.service import get_hazard_detail
from app.modules.mines.model import Mine
from app.modules.users.model import User


class MutationNotFoundError(Exception):
    pass


class MutationConflictError(Exception):
    pass


def _require_user(session: Session, user_id: str) -> User:
    user = session.get(User, user_id)
    if user is None:
        raise MutationNotFoundError(f"User {user_id} not found")
    return user


def create_hazard(session: Session, data: HazardCreateIn) -> dict:
    if session.get(Hazard, data.hazard_id) is not None:
        raise MutationConflictError("Hazard already exists")

    if session.get(Mine, data.mine_id) is None:
        raise MutationNotFoundError("Mine not found")

    _require_user(session, data.reported_by_user_id)
    _require_user(session, data.actor_id)
    if data.assigned_to_user_id is not None:
        _require_user(session, data.assigned_to_user_id)

    now = datetime.now(timezone.utc)
    hazard = Hazard(
        id=data.hazard_id,
        mine_id=data.mine_id,
        title=data.title,
        description=data.description,
        severity=data.severity.value,
        lifecycle_status=LifecycleStatus.OPEN.value,
        location_name=data.location_name,
        reported_by_user_id=data.reported_by_user_id,
        assigned_to_user_id=data.assigned_to_user_id,
        sync_state=SyncState.SYNCED.value,
        geofence_state=GeofenceState.SERVER_PENDING.value,
        captured_at=data.captured_at,
        synced_at=now,
    )
    session.add(hazard)
    session.flush()

    append_audit_event(
        session,
        entity_type="HAZARD",
        entity_id=hazard.id,
        event_type="HAZARD_CREATED",
        actor_id=data.actor_id,
        payload={
            "mineId": hazard.mine_id,
            "title": hazard.title,
            "severity": hazard.severity,
            "status": hazard.lifecycle_status,
            "locationName": hazard.location_name,
            "reportedByUserId": hazard.reported_by_user_id,
            "assignedToUserId": hazard.assigned_to_user_id,
            "syncState": hazard.sync_state,
            "geofenceState": hazard.geofence_state,
            "capturedAt": hazard.captured_at.isoformat(),
        },
    )
    session.commit()
    result = get_hazard_detail(session, hazard.id)
    assert result is not None
    return result


def acknowledge_hazard(session: Session, hazard_id: str, actor_id: str) -> dict:
    hazard = session.get(Hazard, hazard_id)
    if hazard is None:
        raise MutationNotFoundError("Hazard not found")
    _require_user(session, actor_id)
    if hazard.lifecycle_status == LifecycleStatus.RESOLVED.value:
        raise MutationConflictError("Resolved hazard cannot be acknowledged")

    hazard.lifecycle_status = LifecycleStatus.ACKNOWLEDGED.value
    append_audit_event(
        session,
        entity_type="HAZARD",
        entity_id=hazard.id,
        event_type="HAZARD_ACKNOWLEDGED",
        actor_id=actor_id,
        payload={"status": hazard.lifecycle_status},
    )
    session.commit()
    result = get_hazard_detail(session, hazard.id)
    assert result is not None
    return result


def review_hazard(session: Session, hazard_id: str, data: HazardReviewIn) -> dict:
    hazard = session.get(Hazard, hazard_id)
    if hazard is None:
        raise MutationNotFoundError("Hazard not found")
    _require_user(session, data.actor_id)
    if hazard.lifecycle_status == LifecycleStatus.RESOLVED.value:
        raise MutationConflictError("Resolved hazard cannot be reviewed")

    if data.severity is not None:
        hazard.severity = data.severity.value
    if data.status is not None:
        hazard.lifecycle_status = data.status
    if data.assigned_to_user_id is not None:
        _require_user(session, data.assigned_to_user_id)
        hazard.assigned_to_user_id = data.assigned_to_user_id

    append_audit_event(
        session,
        entity_type="HAZARD",
        entity_id=hazard.id,
        event_type="HAZARD_REVIEWED",
        actor_id=data.actor_id,
        payload={
            "severity": hazard.severity,
            "status": hazard.lifecycle_status,
            "assignedToUserId": hazard.assigned_to_user_id,
        },
    )
    session.commit()
    result = get_hazard_detail(session, hazard.id)
    assert result is not None
    return result
