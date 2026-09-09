from datetime import datetime, timezone

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.risk.model import RiskSnapshot


def get_dashboard_summary(session: Session, mine_id: str) -> dict | None:
    mine = session.scalar(select(Mine).where(Mine.id == mine_id))
    if mine is None:
        return None

    active_hazard = Hazard.lifecycle_status != "RESOLVED"

    open_hazards = session.scalar(
        select(func.count())
        .select_from(Hazard)
        .where(Hazard.mine_id == mine_id, active_hazard)
    ) or 0

    high_risk_hazards = session.scalar(
        select(func.count())
        .select_from(Hazard)
        .where(
            Hazard.mine_id == mine_id,
            active_hazard,
            Hazard.severity == "HIGH",
        )
    ) or 0

    now = datetime.now(timezone.utc)

    overdue_corrective_actions = session.scalar(
        select(func.count())
        .select_from(CorrectiveAction)
        .join(Hazard, CorrectiveAction.hazard_id == Hazard.id)
        .where(
            Hazard.mine_id == mine_id,
            CorrectiveAction.due_at < now,
            CorrectiveAction.status != "RESOLVED",
        )
    ) or 0

    conflicted_hazards = session.scalar(
        select(func.count())
        .select_from(Hazard)
        .where(
            Hazard.mine_id == mine_id,
            or_(
                Hazard.sync_state == "CONFLICT",
                Hazard.geofence_state == "CONFLICT",
            ),
        )
    ) or 0

    risk = session.scalar(
        select(RiskSnapshot)
        .where(RiskSnapshot.mine_id == mine_id)
        .order_by(RiskSnapshot.calculated_at.desc(), RiskSnapshot.id.desc())
        .limit(1)
    )

    risk_payload = None
    if risk is not None:
        factors = []
        for factor in risk.factors_json or []:
            factors.append(
                {
                    "name": factor["name"],
                    "weight": factor["weight"],
                    "current_value": factor["currentValue"],
                }
            )

        risk_payload = {
            "score": risk.score,
            "level": risk.level,
            "factors": factors,
        }

    return {
        "mine": {
            "id": mine.id,
            "code": mine.code,
            "name": mine.name,
            "area_name": mine.area_name,
        },
        "risk": risk_payload,
        "kpis": {
            "open_hazards": open_hazards,
            "high_risk_hazards": high_risk_hazards,
            "overdue_corrective_actions": overdue_corrective_actions,
            "conflicted_hazards": conflicted_hazards,
        },
        "as_of": now,
    }
