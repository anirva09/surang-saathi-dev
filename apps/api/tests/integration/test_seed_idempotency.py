from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.modules.hazards.model import Hazard
from app.seed.constants import HERO_HAZARD_ID
from app.seed.run import seed


def test_seed_is_idempotent_for_hero_hazard() -> None:
    seed()
    seed()

    with SessionLocal() as session:
        count = session.scalar(
            select(func.count())
            .select_from(Hazard)
            .where(Hazard.id == HERO_HAZARD_ID)
        )

    assert count == 1
