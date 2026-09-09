from uuid import uuid4

from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.modules.audit.hashing import calculate_event_hash
from app.modules.audit.model import AuditEvent


AUDIT_ADVISORY_LOCK_KEY = 7247241


def append_audit_event(
    session: Session,
    *,
    entity_type: str,
    entity_id: str,
    event_type: str,
    actor_id: str | None,
    payload: dict,
) -> AuditEvent:
    session.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": AUDIT_ADVISORY_LOCK_KEY})
    session.flush()

    previous = session.scalar(
        select(AuditEvent)
        .order_by(AuditEvent.sequence.desc())
        .limit(1)
    )
    previous_hash = previous.event_hash if previous is not None else None

    event_id = f"AUD-{uuid4().hex}"
    material = {
        "id": event_id,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "event_type": event_type,
        "actor_id": actor_id,
        "payload": payload,
    }
    event_hash = calculate_event_hash(material, previous_hash)

    event = AuditEvent(
        id=event_id,
        entity_type=entity_type,
        entity_id=entity_id,
        event_type=event_type,
        actor_id=actor_id,
        payload_json=payload,
        previous_hash=previous_hash,
        event_hash=event_hash,
    )
    session.add(event)
    session.flush()
    return event


def list_audit_events(
    session: Session,
    *,
    entity_type: str | None,
    entity_id: str | None,
    limit: int,
    offset: int,
) -> dict:
    statement = select(AuditEvent)
    count_statement = select(func.count()).select_from(AuditEvent)

    conditions = []
    if entity_type is not None:
        conditions.append(AuditEvent.entity_type == entity_type)
    if entity_id is not None:
        conditions.append(AuditEvent.entity_id == entity_id)

    if conditions:
        statement = statement.where(*conditions)
        count_statement = count_statement.where(*conditions)

    total = session.scalar(count_statement) or 0
    events = session.scalars(
        statement
        .order_by(AuditEvent.sequence.desc())
        .limit(limit)
        .offset(offset)
    ).all()

    return {
        "items": [
            {
                "sequence": event.sequence,
                "id": event.id,
                "entity_type": event.entity_type,
                "entity_id": event.entity_id,
                "event_type": event.event_type,
                "actor_id": event.actor_id,
                "payload": event.payload_json,
                "previous_hash": event.previous_hash,
                "event_hash": event.event_hash,
                "created_at": event.created_at,
            }
            for event in events
        ],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def verify_audit_chain(session: Session) -> dict:
    events = session.scalars(
        select(AuditEvent).order_by(AuditEvent.sequence.asc())
    ).all()

    expected_previous_hash: str | None = None

    for index, event in enumerate(events, start=1):
        if event.previous_hash != expected_previous_hash:
            return {
                "valid": False,
                "total_events": len(events),
                "checked_events": index,
                "head_hash": events[-1].event_hash if events else None,
                "first_invalid_sequence": event.sequence,
                "first_invalid_event_id": event.id,
                "reason": "PREVIOUS_HASH_MISMATCH",
            }

        material = {
            "id": event.id,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "event_type": event.event_type,
            "actor_id": event.actor_id,
            "payload": event.payload_json,
        }
        expected_event_hash = calculate_event_hash(material, expected_previous_hash)

        if event.event_hash != expected_event_hash:
            return {
                "valid": False,
                "total_events": len(events),
                "checked_events": index,
                "head_hash": events[-1].event_hash if events else None,
                "first_invalid_sequence": event.sequence,
                "first_invalid_event_id": event.id,
                "reason": "EVENT_HASH_MISMATCH",
            }

        expected_previous_hash = event.event_hash

    return {
        "valid": True,
        "total_events": len(events),
        "checked_events": len(events),
        "head_hash": events[-1].event_hash if events else None,
        "first_invalid_sequence": None,
        "first_invalid_event_id": None,
        "reason": None,
    }
