from app.core.database import Base
from app.modules.audit.model import AuditEvent
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.evidence.model import HazardEvidence
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.risk.model import RiskSnapshot
from app.modules.users.model import User


def test_session_a_tables_are_registered() -> None:
    expected = {
        "mines",
        "users",
        "hazards",
        "hazard_evidence",
        "corrective_actions",
        "audit_events",
        "risk_snapshots",
    }
    assert expected.issubset(set(Base.metadata.tables))


def test_hero_domain_models_have_expected_primary_keys() -> None:
    assert Mine.__table__.primary_key.columns.keys() == ["id"]
    assert User.__table__.primary_key.columns.keys() == ["id"]
    assert Hazard.__table__.primary_key.columns.keys() == ["id"]
    assert HazardEvidence.__table__.primary_key.columns.keys() == ["id"]
    assert CorrectiveAction.__table__.primary_key.columns.keys() == ["id"]
    assert RiskSnapshot.__table__.primary_key.columns.keys() == ["id"]
    assert AuditEvent.__table__.primary_key.columns.keys() == ["sequence"]
