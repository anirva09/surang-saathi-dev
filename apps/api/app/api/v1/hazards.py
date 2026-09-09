from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import HazardDetailOut, HazardListResponse
from app.core.database import get_db
from app.modules.hazards.service import get_hazard_detail, list_hazards


router = APIRouter(tags=["hazards"])


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
