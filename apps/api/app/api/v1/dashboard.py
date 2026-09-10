from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.schemas import DashboardSummaryOut
from app.core.database import get_db
from app.modules.dashboard.service import get_dashboard_summary


router = APIRouter(tags=["dashboard"])


@router.get(
    "/dashboard/summary",
    response_model=DashboardSummaryOut,
    response_model_by_alias=True,
)
def dashboard_summary(
    mine_id: str = Query(..., alias="mineId", min_length=1),
    session: Session = Depends(get_db),
) -> dict:
    result = get_dashboard_summary(session, mine_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mine not found",
        )
    return result
