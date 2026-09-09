from dataclasses import dataclass


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
