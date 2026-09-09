from app.seed.constants import DEMO_MINE_ID, HERO_HAZARD_ID, MANAGER_NAME, REPORTER_NAME


def test_canonical_seed_identity_is_locked() -> None:
    assert DEMO_MINE_ID == "MINE-03"
    assert HERO_HAZARD_ID == "HZRD-2026-442"
    assert MANAGER_NAME == "M. Sharma"
    assert REPORTER_NAME == "Rajesh Kumar (Sirdar)"
