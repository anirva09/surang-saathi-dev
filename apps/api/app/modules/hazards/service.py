from sqlalchemy import func, select
from sqlalchemy.orm import Session, aliased

from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.evidence.model import HazardEvidence
from app.modules.hazards.model import Hazard
from app.modules.users.model import User


def _actor(user: User | None) -> dict | None:
    if user is None:
        return None
    return {
        "id": user.id,
        "name": user.name,
        "role": user.role,
    }


def _base_query():
    reporter = aliased(User)
    assignee = aliased(User)

    evidence_count = (
        select(func.count(HazardEvidence.id))
        .where(HazardEvidence.hazard_id == Hazard.id)
        .correlate(Hazard)
        .scalar_subquery()
    )

    action_count = (
        select(func.count(CorrectiveAction.id))
        .where(CorrectiveAction.hazard_id == Hazard.id)
        .correlate(Hazard)
        .scalar_subquery()
    )

    statement = (
        select(
            Hazard,
            reporter,
            assignee,
            evidence_count.label("evidence_count"),
            action_count.label("action_count"),
        )
        .join(reporter, Hazard.reported_by_user_id == reporter.id)
        .outerjoin(assignee, Hazard.assigned_to_user_id == assignee.id)
    )

    return statement


def _serialize_hazard(row) -> dict:
    hazard, reporter, assignee, evidence_count, action_count = row

    return {
        "hazard_id": hazard.id,
        "mine_id": hazard.mine_id,
        "title": hazard.title,
        "severity": hazard.severity,
        "status": hazard.lifecycle_status,
        "location_name": hazard.location_name,
        "reported_by": _actor(reporter),
        "assigned_to": _actor(assignee),
        "sync_state": hazard.sync_state,
        "geofence_state": hazard.geofence_state,
        "captured_at": hazard.captured_at,
        "synced_at": hazard.synced_at,
        "evidence_count": evidence_count,
        "corrective_action_count": action_count,
    }


def list_hazards(
    session: Session,
    *,
    mine_id: str | None,
    severity: str | None,
    status_filter: str | None,
    limit: int,
    offset: int,
) -> dict:
    statement = _base_query()
    count_statement = select(func.count()).select_from(Hazard)

    conditions = []
    if mine_id is not None:
        conditions.append(Hazard.mine_id == mine_id)
    if severity is not None:
        conditions.append(Hazard.severity == severity.upper())
    if status_filter is not None:
        conditions.append(Hazard.lifecycle_status == status_filter.upper())

    if conditions:
        statement = statement.where(*conditions)
        count_statement = count_statement.where(*conditions)

    total = session.scalar(count_statement) or 0

    rows = session.execute(
        statement.order_by(Hazard.captured_at.desc()).limit(limit).offset(offset)
    ).all()

    return {
        "items": [_serialize_hazard(row) for row in rows],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_hazard_detail(session: Session, hazard_id: str) -> dict | None:
    row = session.execute(
        _base_query().where(Hazard.id == hazard_id)
    ).first()

    if row is None:
        return None

    payload = _serialize_hazard(row)
    hazard = row[0]
    payload["description"] = hazard.description

    evidence_rows = session.scalars(
        select(HazardEvidence)
        .where(HazardEvidence.hazard_id == hazard_id)
        .order_by(HazardEvidence.captured_at.asc())
    ).all()

    payload["evidence"] = [
        {
            "evidence_id": evidence.id,
            "file_name": evidence.file_name,
            "mime_type": evidence.mime_type,
            "file_size": evidence.file_size,
            "sha256": evidence.sha256,
            "latitude": evidence.latitude,
            "longitude": evidence.longitude,
            "accuracy_meters": evidence.accuracy_meters,
            "captured_at": evidence.captured_at,
            "local_geofence_state": evidence.local_geofence_state,
            "server_geofence_state": evidence.server_geofence_state,
        }
        for evidence in evidence_rows
    ]

    action_assignee = aliased(User)
    action_rows = session.execute(
        select(CorrectiveAction, action_assignee)
        .outerjoin(
            action_assignee,
            CorrectiveAction.assigned_to_user_id == action_assignee.id,
        )
        .where(CorrectiveAction.hazard_id == hazard_id)
        .order_by(CorrectiveAction.due_at.asc())
    ).all()

    payload["corrective_actions"] = [
        {
            "action_id": action.id,
            "description": action.description,
            "status": action.status,
            "due_at": action.due_at,
            "assigned_to": _actor(assignee),
        }
        for action, assignee in action_rows
    ]

    return payload
