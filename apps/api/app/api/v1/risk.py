from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import RiskRecalculateIn, RiskSnapshotOut
from app.core.database import get_db
from app.modules.mines.model import Mine
from app.modules.risk.service import (
    RiskNotFoundError,
    RiskValidationError,
    get_latest_risk_snapshot,
    recalculate_mine_risk,
    serialize_risk_snapshot,
)


router = APIRouter(tags=["risk"])


@router.get(
    "/risk/mines/{mine_id}",
    response_model=RiskSnapshotOut,
    response_model_by_alias=True,
)
def latest_mine_risk(
    mine_id: str,
    session: Session = Depends(get_db),
) -> dict:
    if session.get(Mine, mine_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mine not found",
        )

    snapshot = get_latest_risk_snapshot(session, mine_id)
    if snapshot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk snapshot not found",
        )
    return serialize_risk_snapshot(snapshot)


@router.post(
    "/risk/mines/{mine_id}/recalculate",
    response_model=RiskSnapshotOut,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
def recalculate_mine_risk_route(
    mine_id: str,
    data: RiskRecalculateIn,
    session: Session = Depends(get_db),
) -> dict:
    try:
        return recalculate_mine_risk(
            session,
            mine_id=mine_id,
            actor_id=data.actor_id,
            gas_breaches_30d=data.gas_breaches_30d,
            inspection_coverage_percent=data.inspection_coverage_percent,
        )
    except RiskNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except RiskValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
