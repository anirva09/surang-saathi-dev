from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.core.database import SessionLocal
from app.domain.enums import GeofenceState, HazardSeverity, LifecycleStatus, SyncState
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.evidence.model import HazardEvidence
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.risk.model import RiskSnapshot
from app.modules.users.model import User
from app.seed.constants import (
    CANONICAL_RISK_LEVEL,
    CANONICAL_RISK_SCORE,
    DEMO_AREA_NAME,
    DEMO_MINE_ID,
    DEMO_MINE_NAME,
    HERO_HAZARD_ID,
    HERO_HAZARD_LOCATION,
    HERO_HAZARD_TITLE,
    MANAGER_EMPLOYEE_CODE,
    MANAGER_ID,
    MANAGER_NAME,
    MANAGER_ROLE,
    REPORTER_EMPLOYEE_CODE,
    REPORTER_ID,
    REPORTER_NAME,
    REPORTER_ROLE,
)

SEED_NOW = datetime(2026, 9, 10, 8, 30, tzinfo=timezone.utc)
SYNCED_AT = datetime(2026, 9, 7, 8, 45, tzinfo=timezone.utc)


def _exists(session, model, entity_id: str) -> bool:
    return session.scalar(
        select(model).where(model.id == entity_id)
    ) is not None


def seed() -> None:
    with SessionLocal() as session:
        if not _exists(session, Mine, DEMO_MINE_ID):
            session.add(
                Mine(
                    id=DEMO_MINE_ID,
                    code=DEMO_MINE_ID,
                    name=DEMO_MINE_NAME,
                    area_name=DEMO_AREA_NAME,
                )
            )

        if not _exists(session, User, MANAGER_ID):
            session.add(
                User(
                    id=MANAGER_ID,
                    employee_code=MANAGER_EMPLOYEE_CODE,
                    name=MANAGER_NAME,
                    role=MANAGER_ROLE,
                )
            )

        if not _exists(session, User, REPORTER_ID):
            session.add(
                User(
                    id=REPORTER_ID,
                    employee_code=REPORTER_EMPLOYEE_CODE,
                    name=REPORTER_NAME,
                    role=REPORTER_ROLE,
                )
            )

        session.flush()

        if not _exists(session, Hazard, HERO_HAZARD_ID):
            session.add(
                Hazard(
                    id=HERO_HAZARD_ID,
                    mine_id=DEMO_MINE_ID,
                    title=HERO_HAZARD_TITLE,
                    description=(
                        "Visible deformation and damage observed in roof support. "
                        "Area requires manager review and corrective action."
                    ),
                    severity=HazardSeverity.HIGH.value,
                    lifecycle_status=LifecycleStatus.ESCALATED.value,
                    location_name=HERO_HAZARD_LOCATION,
                    reported_by_user_id=REPORTER_ID,
                    assigned_to_user_id=MANAGER_ID,
                    sync_state=SyncState.CONFLICT.value,
                    geofence_state=GeofenceState.CONFLICT.value,
                    captured_at=SEED_NOW - timedelta(days=3),
                    synced_at=SYNCED_AT,
                )
            )

        session.flush()

        action_id = "ACT-2026-118"
        if not _exists(session, CorrectiveAction, action_id):
            session.add(
                CorrectiveAction(
                    id=action_id,
                    hazard_id=HERO_HAZARD_ID,
                    description=(
                        "Replace damaged roof support and conduct secondary inspection"
                    ),
                    assigned_to_user_id=MANAGER_ID,
                    due_at=SEED_NOW - timedelta(days=2),
                    status=LifecycleStatus.ESCALATED.value,
                )
            )

        evidence_id = "EVD-HZRD-442-001"
        if not _exists(session, HazardEvidence, evidence_id):
            session.add(
                HazardEvidence(
                    id=evidence_id,
                    hazard_id=HERO_HAZARD_ID,
                    object_key=(
                        "hazards/HZRD-2026-442/EVD-HZRD-442-001/"
                        "roof-support-damage.jpg"
                    ),
                    file_name="roof-support-damage.jpg",
                    mime_type="image/jpeg",
                    file_size=248_320,
                    sha256="0" * 64,
                    latitude=None,
                    longitude=None,
                    accuracy_meters=None,
                    captured_at=SEED_NOW - timedelta(days=3),
                    local_geofence_state=GeofenceState.LOCAL_VALID.value,
                    server_geofence_state=GeofenceState.CONFLICT.value,
                )
            )

        risk_id = "MRI-MINE-03-20260910"
        if not _exists(session, RiskSnapshot, risk_id):
            session.add(
                RiskSnapshot(
                    id=risk_id,
                    mine_id=DEMO_MINE_ID,
                    score=CANONICAL_RISK_SCORE,
                    level=CANONICAL_RISK_LEVEL,
                    factors_json=[
                        {
                            "name": "Overdue Corrective Actions",
                            "weight": 0.40,
                            "currentValue": 12,
                        },
                        {
                            "name": "Gas Threshold Breaches (30d)",
                            "weight": 0.35,
                            "currentValue": 4,
                        },
                        {
                            "name": "Inspection Coverage vs Target",
                            "weight": 0.25,
                            "currentValue": "82%",
                        },
                    ],
                )
            )

        session.commit()


if __name__ == "__main__":
    seed()
