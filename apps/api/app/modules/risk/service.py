from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.domain.enums import LifecycleStatus
from app.modules.audit.service import append_audit_event
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.risk.model import RiskSnapshot
from app.modules.users.model import User


OVERDUE_ACTIONS_AT_MAX_RISK = 12
GAS_BREACHES_AT_MAX_RISK = 4


@dataclass(frozen=True)
class RiskFactorInput:
    name: str
    weight: float
    score: float


@dataclass(frozen=True)
class ContributingFactor:
    name: str
    weight: float
    score: float
    contribution: float


@dataclass(frozen=True)
class RiskResult:
    score: float
    level: str
    contributing_factors: list[ContributingFactor]


class RiskNotFoundError(Exception):
    pass


class RiskValidationError(Exception):
    pass


def _risk_level(score: float) -> str:
    if score >= 70:
        return "HIGH"
    if score >= 40:
        return "MEDIUM"
    return "LOW"


def calculate_risk_index(
    *,
    overdue_actions_score: float,
    gas_breach_score: float,
    inspection_gap_score: float,
) -> RiskResult:
    inputs = [
        RiskFactorInput("Overdue Corrective Actions", 0.40, overdue_actions_score),
        RiskFactorInput("Gas Threshold Breaches (30d)", 0.35, gas_breach_score),
        RiskFactorInput("Inspection Coverage vs Target", 0.25, inspection_gap_score),
    ]

    factors = [
        ContributingFactor(
            name=factor.name,
            weight=factor.weight,
            score=factor.score,
            contribution=round(factor.score * factor.weight, 2),
        )
        for factor in inputs
    ]

    total = round(sum(factor.contribution for factor in factors), 2)

    return RiskResult(
        score=total,
        level=_risk_level(total),
        contributing_factors=factors,
    )


def get_latest_risk_snapshot(session: Session, mine_id: str) -> RiskSnapshot | None:
    return session.scalar(
        select(RiskSnapshot)
        .where(RiskSnapshot.mine_id == mine_id)
        .order_by(RiskSnapshot.calculated_at.desc(), RiskSnapshot.id.desc())
        .limit(1)
    )


def _find_factor(snapshot: RiskSnapshot | None, name: str) -> dict | None:
    if snapshot is None:
        return None
    for factor in snapshot.factors_json or []:
        if factor.get("name") == name:
            return factor
    return None


def _parse_non_negative_int(value: object, default: int) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return default
    return max(parsed, 0)


def _parse_coverage(value: object, default: float) -> float:
    if isinstance(value, str):
        value = value.strip().removesuffix("%")
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return default
    return min(max(parsed, 0.0), 100.0)


def _score_overdue_actions(count: int) -> float:
    if count <= 0:
        return 0.0
    return round(min(count / OVERDUE_ACTIONS_AT_MAX_RISK, 1.0) * 100.0, 2)


def _score_gas_breaches(count: int) -> float:
    if count <= 0:
        return 0.0
    return round(min(count / GAS_BREACHES_AT_MAX_RISK, 1.0) * 100.0, 2)


def _score_inspection_gap(coverage_percent: float) -> float:
    return round(100.0 - min(max(coverage_percent, 0.0), 100.0), 2)


def serialize_risk_snapshot(snapshot: RiskSnapshot) -> dict:
    factors = []
    for factor in snapshot.factors_json or []:
        factors.append(
            {
                "name": factor.get("name", "Unknown factor"),
                "weight": float(factor.get("weight", 0.0)),
                "current_value": factor.get("currentValue", "unknown"),
                "score": (
                    float(factor["score"])
                    if factor.get("score") is not None
                    else None
                ),
                "contribution": (
                    float(factor["contribution"])
                    if factor.get("contribution") is not None
                    else None
                ),
                "source": factor.get("source", "SEEDED_BASELINE"),
            }
        )

    return {
        "risk_snapshot_id": snapshot.id,
        "mine_id": snapshot.mine_id,
        "score": float(snapshot.score),
        "level": snapshot.level,
        "factors": factors,
        "calculated_at": snapshot.calculated_at,
    }


def recalculate_mine_risk(
    session: Session,
    *,
    mine_id: str,
    actor_id: str,
    gas_breaches_30d: int | None,
    inspection_coverage_percent: float | None,
) -> dict:
    mine = session.get(Mine, mine_id)
    if mine is None:
        raise RiskNotFoundError("Mine not found")

    if session.get(User, actor_id) is None:
        raise RiskNotFoundError(f"User {actor_id} not found")

    latest = get_latest_risk_snapshot(session, mine_id)

    latest_gas = _find_factor(latest, "Gas Threshold Breaches (30d)")
    latest_coverage = _find_factor(latest, "Inspection Coverage vs Target")

    if gas_breaches_30d is None:
        gas_breaches = _parse_non_negative_int(
            latest_gas.get("currentValue") if latest_gas else None,
            0,
        )
        gas_source = "LAST_KNOWN" if latest_gas is not None else "DEFAULT_ZERO"
    else:
        if gas_breaches_30d < 0:
            raise RiskValidationError("Gas breach count cannot be negative")
        gas_breaches = gas_breaches_30d
        gas_source = "REQUEST"

    if inspection_coverage_percent is None:
        coverage = _parse_coverage(
            latest_coverage.get("currentValue") if latest_coverage else None,
            100.0,
        )
        coverage_source = "LAST_KNOWN" if latest_coverage is not None else "DEFAULT_100_PERCENT"
    else:
        if not 0.0 <= inspection_coverage_percent <= 100.0:
            raise RiskValidationError("Inspection coverage must be between 0 and 100")
        coverage = inspection_coverage_percent
        coverage_source = "REQUEST"

    now = datetime.now(timezone.utc)
    overdue_actions = session.scalar(
        select(func.count())
        .select_from(CorrectiveAction)
        .join(Hazard, CorrectiveAction.hazard_id == Hazard.id)
        .where(
            Hazard.mine_id == mine_id,
            CorrectiveAction.due_at < now,
            CorrectiveAction.status != LifecycleStatus.RESOLVED.value,
        )
    ) or 0

    overdue_score = _score_overdue_actions(overdue_actions)
    gas_score = _score_gas_breaches(gas_breaches)
    inspection_gap_score = _score_inspection_gap(coverage)

    result = calculate_risk_index(
        overdue_actions_score=overdue_score,
        gas_breach_score=gas_score,
        inspection_gap_score=inspection_gap_score,
    )

    factor_by_name = {factor.name: factor for factor in result.contributing_factors}
    overdue_factor = factor_by_name["Overdue Corrective Actions"]
    gas_factor = factor_by_name["Gas Threshold Breaches (30d)"]
    inspection_factor = factor_by_name["Inspection Coverage vs Target"]

    factors_json = [
        {
            "name": overdue_factor.name,
            "weight": overdue_factor.weight,
            "currentValue": int(overdue_actions),
            "score": overdue_factor.score,
            "contribution": overdue_factor.contribution,
            "source": "POSTGRESQL",
        },
        {
            "name": gas_factor.name,
            "weight": gas_factor.weight,
            "currentValue": int(gas_breaches),
            "score": gas_factor.score,
            "contribution": gas_factor.contribution,
            "source": gas_source,
        },
        {
            "name": inspection_factor.name,
            "weight": inspection_factor.weight,
            "currentValue": f"{coverage:g}%",
            "score": inspection_factor.score,
            "contribution": inspection_factor.contribution,
            "source": coverage_source,
        },
    ]

    snapshot = RiskSnapshot(
        id=f"MRI-{mine_id}-{uuid4().hex[:20]}",
        mine_id=mine_id,
        score=Decimal(str(result.score)),
        level=result.level,
        factors_json=factors_json,
    )
    session.add(snapshot)
    session.flush()

    append_audit_event(
        session,
        entity_type="RISK_SNAPSHOT",
        entity_id=snapshot.id,
        event_type="RISK_RECALCULATED",
        actor_id=actor_id,
        payload={
            "mineId": mine_id,
            "score": result.score,
            "level": result.level,
            "factors": factors_json,
        },
    )

    session.commit()
    return serialize_risk_snapshot(snapshot)
