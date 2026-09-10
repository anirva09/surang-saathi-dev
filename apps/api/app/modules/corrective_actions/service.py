from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.v1.schemas import CorrectiveActionCreateIn, CorrectiveActionUpdateIn
from app.domain.enums import LifecycleStatus
from app.modules.audit.service import append_audit_event
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.hazards.model import Hazard
from app.modules.hazards.mutations import MutationConflictError, MutationNotFoundError
from app.modules.users.model import User


def _require_user(session: Session, user_id: str) -> User:
    user = session.get(User, user_id)
    if user is None:
        raise MutationNotFoundError(f"User {user_id} not found")
    return user


def _serialize_action(session: Session, action: CorrectiveAction) -> dict:
    assignee = session.get(User, action.assigned_to_user_id)
    return {
        "action_id": action.id,
        "description": action.description,
        "status": action.status,
        "due_at": action.due_at,
        "assigned_to": (
            {
                "id": assignee.id,
                "name": assignee.name,
                "role": assignee.role,
            }
            if assignee is not None
            else None
        ),
        "acknowledged_at": action.acknowledged_at,
        "resolved_at": action.resolved_at,
    }


def create_corrective_action(session: Session, data: CorrectiveActionCreateIn) -> dict:
    if session.get(CorrectiveAction, data.action_id) is not None:
        raise MutationConflictError("Corrective action already exists")

    hazard = session.get(Hazard, data.hazard_id)
    if hazard is None:
        raise MutationNotFoundError("Hazard not found")
    if hazard.lifecycle_status == LifecycleStatus.RESOLVED.value:
        raise MutationConflictError("Cannot add action to resolved hazard")

    _require_user(session, data.assigned_to_user_id)
    _require_user(session, data.actor_id)

    action = CorrectiveAction(
        id=data.action_id,
        hazard_id=data.hazard_id,
        description=data.description,
        assigned_to_user_id=data.assigned_to_user_id,
        due_at=data.due_at,
        status=LifecycleStatus.OPEN.value,
    )
    session.add(action)
    session.flush()

    append_audit_event(
        session,
        entity_type="CORRECTIVE_ACTION",
        entity_id=action.id,
        event_type="CORRECTIVE_ACTION_CREATED",
        actor_id=data.actor_id,
        payload={
            "hazardId": action.hazard_id,
            "description": action.description,
            "assignedToUserId": action.assigned_to_user_id,
            "dueAt": action.due_at.isoformat(),
            "status": action.status,
        },
    )
    session.commit()
    return _serialize_action(session, action)


def update_corrective_action(
    session: Session,
    action_id: str,
    data: CorrectiveActionUpdateIn,
) -> dict:
    action = session.get(CorrectiveAction, action_id)
    if action is None:
        raise MutationNotFoundError("Corrective action not found")
    _require_user(session, data.actor_id)
    if action.status == LifecycleStatus.RESOLVED.value:
        raise MutationConflictError("Resolved corrective action cannot be changed")

    if data.description is not None:
        action.description = data.description
    if data.assigned_to_user_id is not None:
        _require_user(session, data.assigned_to_user_id)
        action.assigned_to_user_id = data.assigned_to_user_id
    if data.due_at is not None:
        action.due_at = data.due_at
    if data.status is not None:
        action.status = data.status
        if data.status == LifecycleStatus.ACKNOWLEDGED.value and action.acknowledged_at is None:
            action.acknowledged_at = datetime.now(timezone.utc)

    append_audit_event(
        session,
        entity_type="CORRECTIVE_ACTION",
        entity_id=action.id,
        event_type="CORRECTIVE_ACTION_UPDATED",
        actor_id=data.actor_id,
        payload={
            "description": action.description,
            "assignedToUserId": action.assigned_to_user_id,
            "dueAt": action.due_at.isoformat(),
            "status": action.status,
            "acknowledgedAt": (
                action.acknowledged_at.isoformat() if action.acknowledged_at is not None else None
            ),
        },
    )
    session.commit()
    return _serialize_action(session, action)


def resolve_corrective_action(session: Session, action_id: str, actor_id: str) -> dict:
    action = session.get(CorrectiveAction, action_id)
    if action is None:
        raise MutationNotFoundError("Corrective action not found")
    _require_user(session, actor_id)
    if action.status == LifecycleStatus.RESOLVED.value:
        raise MutationConflictError("Corrective action is already resolved")

    now = datetime.now(timezone.utc)
    action.status = LifecycleStatus.RESOLVED.value
    action.resolved_at = now

    append_audit_event(
        session,
        entity_type="CORRECTIVE_ACTION",
        entity_id=action.id,
        event_type="CORRECTIVE_ACTION_RESOLVED",
        actor_id=actor_id,
        payload={
            "hazardId": action.hazard_id,
            "status": action.status,
            "resolvedAt": now.isoformat(),
        },
    )

    unresolved_actions = session.scalar(
        select(func.count())
        .select_from(CorrectiveAction)
        .where(
            CorrectiveAction.hazard_id == action.hazard_id,
            CorrectiveAction.id != action.id,
            CorrectiveAction.status != LifecycleStatus.RESOLVED.value,
        )
    ) or 0

    hazard = session.get(Hazard, action.hazard_id)
    if hazard is not None and unresolved_actions == 0:
        hazard.lifecycle_status = LifecycleStatus.RESOLVED.value
        append_audit_event(
            session,
            entity_type="HAZARD",
            entity_id=hazard.id,
            event_type="HAZARD_RESOLVED",
            actor_id=actor_id,
            payload={
                "status": hazard.lifecycle_status,
                "resolvedByCorrectiveActionId": action.id,
            },
        )

    session.commit()
    return _serialize_action(session, action)
