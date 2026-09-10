from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1.schemas import AuditEventListResponse, AuditVerificationOut
from app.core.database import get_db
from app.modules.audit.service import list_audit_events, verify_audit_chain


router = APIRouter(tags=["audit"])


@router.get(
    "/audit/events",
    response_model=AuditEventListResponse,
    response_model_by_alias=True,
)
def audit_events(
    entity_type: str | None = Query(default=None, alias="entityType"),
    entity_id: str | None = Query(default=None, alias="entityId"),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
) -> dict:
    return list_audit_events(
        session,
        entity_type=entity_type,
        entity_id=entity_id,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/audit/verify",
    response_model=AuditVerificationOut,
    response_model_by_alias=True,
)
def audit_verify(session: Session = Depends(get_db)) -> dict:
    return verify_audit_chain(session)
