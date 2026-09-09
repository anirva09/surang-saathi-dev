from uuid import uuid4

from sqlalchemy import select, text
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
