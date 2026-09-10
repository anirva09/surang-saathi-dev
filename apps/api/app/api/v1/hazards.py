from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import (
    HazardAcknowledgeIn,
    HazardCreateIn,
    HazardDetailOut,
    HazardListResponse,
    HazardReviewIn,
)
from app.core.database import get_db
from app.modules.hazards.mutations import (
    MutationConflictError,
    MutationNotFoundError,
    acknowledge_hazard,
    create_hazard,
    review_hazard,
)
from app.modules.hazards.service import get_hazard_detail, list_hazards


router = APIRouter(tags=["hazards"])


def _translate_mutation_error(exc: Exception) -> HTTPException:
    if isinstance(exc, MutationNotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.get(
    "/hazards",
    response_model=HazardListResponse,
    response_model_by_alias=True,
)
def hazards(
    mine_id: str | None = Query(default=None, alias="mineId"),
    severity: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_db),
) -> dict:
    return list_hazards(
        session,
        mine_id=mine_id,
        severity=severity,
        status_filter=status_filter,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/hazards",
    response_model=HazardDetailOut,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
def create_hazard_endpoint(
    body: HazardCreateIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return create_hazard(session, body)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc


@router.post(
    "/hazards/{hazard_id}/acknowledge",
    response_model=HazardDetailOut,
    response_model_by_alias=True,
)
def acknowledge_hazard_endpoint(
    hazard_id: str,
    body: HazardAcknowledgeIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return acknowledge_hazard(session, hazard_id, body.actor_id)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc


@router.post(
    "/hazards/{hazard_id}/review",
    response_model=HazardDetailOut,
    response_model_by_alias=True,
)
def review_hazard_endpoint(
    hazard_id: str,
    body: HazardReviewIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return review_hazard(session, hazard_id, body)
    except (MutationNotFoundError, MutationConflictError) as exc:
        session.rollback()
        raise _translate_mutation_error(exc) from exc


@router.get(
    "/hazards/{hazard_id}",
    response_model=HazardDetailOut,
    response_model_by_alias=True,
)
def hazard_detail(
    hazard_id: str,
    session: Session = Depends(get_db),
) -> dict:
    result = get_hazard_detail(session, hazard_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hazard not found",
        )
    return result
