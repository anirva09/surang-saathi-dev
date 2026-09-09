from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.domain.enums import HazardSeverity


def to_camel(value: str) -> str:
    head, *tail = value.split("_")
    return head + "".join(part.capitalize() for part in tail)


class ApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class ActorOut(ApiModel):
    id: str
    name: str
    role: str


class MineSummaryOut(ApiModel):
    id: str
    code: str
    name: str
    area_name: str


class RiskFactorOut(ApiModel):
    name: str
    weight: float
    current_value: int | str


class RiskSummaryOut(ApiModel):
    score: float
    level: str
    factors: list[RiskFactorOut]


class DashboardKpisOut(ApiModel):
    open_hazards: int
    high_risk_hazards: int
    overdue_corrective_actions: int
    conflicted_hazards: int


class DashboardSummaryOut(ApiModel):
    mine: MineSummaryOut
    risk: RiskSummaryOut | None
    kpis: DashboardKpisOut
    as_of: datetime


class HazardListItemOut(ApiModel):
    hazard_id: str
    mine_id: str
    title: str
    severity: str
    status: str
    location_name: str
    reported_by: ActorOut
    assigned_to: ActorOut | None
    sync_state: str
    geofence_state: str
    captured_at: datetime
    synced_at: datetime | None
    evidence_count: int
    corrective_action_count: int


class HazardListResponse(ApiModel):
    items: list[HazardListItemOut]
    total: int
    limit: int
    offset: int


class EvidenceOut(ApiModel):
    evidence_id: str
    file_name: str
    mime_type: str
    file_size: int
    sha256: str
    latitude: float | None
    longitude: float | None
    accuracy_meters: float | None
    captured_at: datetime
    local_geofence_state: str
    server_geofence_state: str


class CorrectiveActionOut(ApiModel):
    action_id: str
    description: str
    status: str
    due_at: datetime
    assigned_to: ActorOut | None
    acknowledged_at: datetime | None = None
    resolved_at: datetime | None = None


class HazardDetailOut(HazardListItemOut):
    description: str
    evidence: list[EvidenceOut]
    corrective_actions: list[CorrectiveActionOut]


class HazardCreateIn(ApiModel):
    hazard_id: str = Field(min_length=3, max_length=64)
    mine_id: str = Field(min_length=1, max_length=64)
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=3)
    severity: HazardSeverity
    location_name: str = Field(min_length=1, max_length=255)
    reported_by_user_id: str = Field(min_length=1, max_length=64)
    assigned_to_user_id: str | None = Field(default=None, max_length=64)
    captured_at: datetime
    actor_id: str = Field(min_length=1, max_length=64)


class HazardAcknowledgeIn(ApiModel):
    actor_id: str = Field(min_length=1, max_length=64)


class HazardReviewIn(ApiModel):
    actor_id: str = Field(min_length=1, max_length=64)
    severity: HazardSeverity | None = None
    status: Literal["ACKNOWLEDGED", "ESCALATED"] | None = None
    assigned_to_user_id: str | None = Field(default=None, max_length=64)


class CorrectiveActionCreateIn(ApiModel):
    action_id: str = Field(min_length=3, max_length=64)
    hazard_id: str = Field(min_length=1, max_length=64)
    description: str = Field(min_length=3)
    assigned_to_user_id: str = Field(min_length=1, max_length=64)
    due_at: datetime
    actor_id: str = Field(min_length=1, max_length=64)


class CorrectiveActionUpdateIn(ApiModel):
    actor_id: str = Field(min_length=1, max_length=64)
    description: str | None = Field(default=None, min_length=3)
    assigned_to_user_id: str | None = Field(default=None, max_length=64)
    due_at: datetime | None = None
    status: Literal["OPEN", "ACKNOWLEDGED", "OVERDUE", "ESCALATED"] | None = None


class CorrectiveActionResolveIn(ApiModel):
    actor_id: str = Field(min_length=1, max_length=64)
