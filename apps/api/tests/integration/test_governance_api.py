from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import delete, select, update

from app.core.database import SessionLocal
from app.main import app
from app.modules.audit.model import AuditEvent
from app.modules.audit.service import append_audit_event
from app.modules.corrective_actions.model import CorrectiveAction
from app.modules.hazards.model import Hazard
from app.modules.mines.model import Mine
from app.modules.risk.model import RiskSnapshot
from app.seed.run import seed


client = TestClient(app)
RUN_ID = uuid4().hex[:10].upper()
TEST_MINE_ID = f"MINE-RISK-{RUN_ID}"
TEST_HAZARD_ID = f"HZRD-RISK-{RUN_ID}"
TEST_ACTION_ID = f"ACT-RISK-{RUN_ID}"
TEST_AUDIT_ENTITY_ID = f"VERIFY-{RUN_ID}"
_created_audit_ids: list[str] = []
_created_risk_ids: list[str] = []
_original_test_event_payload: dict | None = None


def _cleanup() -> None:
    with SessionLocal() as session:
        if _created_risk_ids:
            session.execute(
                delete(AuditEvent).where(AuditEvent.entity_id.in_(_created_risk_ids))
            )
        if _created_audit_ids:
            session.execute(
                delete(AuditEvent).where(AuditEvent.id.in_(_created_audit_ids))
            )
        if _created_risk_ids:
            session.execute(
                delete(RiskSnapshot).where(RiskSnapshot.id.in_(_created_risk_ids))
            )
        session.execute(
            delete(CorrectiveAction).where(CorrectiveAction.id == TEST_ACTION_ID)
        )
        session.execute(delete(Hazard).where(Hazard.id == TEST_HAZARD_ID))
        session.execute(delete(Mine).where(Mine.id == TEST_MINE_ID))
        session.commit()


def setup_module() -> None:
    global _original_test_event_payload
    seed()

    with SessionLocal() as session:
        session.add(
            Mine(
                id=TEST_MINE_ID,
                code=TEST_MINE_ID,
                name="Governance Risk Test Mine",
                area_name="Integration Test Area",
            )
        )
        session.flush()
        session.add(
            Hazard(
                id=TEST_HAZARD_ID,
                mine_id=TEST_MINE_ID,
                title="Controlled governance test hazard",
                description="Used only to verify live MRI inputs.",
                severity="HIGH",
                lifecycle_status="OPEN",
                location_name="Test Gallery",
                reported_by_user_id="USR-RKUMAR",
                assigned_to_user_id="USR-MSHARMA",
                sync_state="SYNCED",
                geofence_state="SERVER_PENDING",
                captured_at=datetime.now(timezone.utc) - timedelta(hours=1),
                synced_at=datetime.now(timezone.utc),
            )
        )
        session.flush()
        session.add(
            CorrectiveAction(
                id=TEST_ACTION_ID,
                hazard_id=TEST_HAZARD_ID,
                description="Controlled overdue action for MRI verification.",
                assigned_to_user_id="USR-MSHARMA",
                due_at=datetime.now(timezone.utc) - timedelta(days=1),
                status="OPEN",
            )
        )

        first = append_audit_event(
            session,
            entity_type="INTEGRATION_TEST",
            entity_id=TEST_AUDIT_ENTITY_ID,
            event_type="VERIFY_CHAIN_A",
            actor_id="USR-MSHARMA",
            payload={"step": 1, "label": "chain-a"},
        )
        second = append_audit_event(
            session,
            entity_type="INTEGRATION_TEST",
            entity_id=TEST_AUDIT_ENTITY_ID,
            event_type="VERIFY_CHAIN_B",
            actor_id="USR-MSHARMA",
            payload={"step": 2, "label": "chain-b"},
        )
        _created_audit_ids.extend([first.id, second.id])
        _original_test_event_payload = dict(first.payload_json)
        session.commit()


def teardown_module() -> None:
    _cleanup()


def test_audit_verify_reports_valid_chain() -> None:
    response = client.get("/api/v1/audit/verify")

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["valid"] is True
    assert body["totalEvents"] >= 2
    assert body["checkedEvents"] == body["totalEvents"]
    assert body["firstInvalidSequence"] is None
    assert body["firstInvalidEventId"] is None
    assert body["reason"] is None
    assert body["headHash"] is not None


def test_audit_events_can_be_filtered_by_entity() -> None:
    response = client.get(
        "/api/v1/audit/events",
        params={"entityType": "INTEGRATION_TEST", "entityId": TEST_AUDIT_ENTITY_ID},
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["total"] == 2
    assert [item["eventType"] for item in body["items"]] == [
        "VERIFY_CHAIN_B",
        "VERIFY_CHAIN_A",
    ]
    assert all(item["eventHash"] for item in body["items"])


def test_audit_verify_detects_tampered_payload_and_recovers() -> None:
    assert _original_test_event_payload is not None
    first_event_id = _created_audit_ids[0]

    with SessionLocal() as session:
        session.execute(
            update(AuditEvent)
            .where(AuditEvent.id == first_event_id)
            .values(payload_json={"step": 999, "label": "tampered"})
        )
        session.commit()

    broken = client.get("/api/v1/audit/verify")
    assert broken.status_code == 200, broken.text
    body = broken.json()
    assert body["valid"] is False
    assert body["firstInvalidEventId"] == first_event_id
    assert body["reason"] == "EVENT_HASH_MISMATCH"

    with SessionLocal() as session:
        session.execute(
            update(AuditEvent)
            .where(AuditEvent.id == first_event_id)
            .values(payload_json=_original_test_event_payload)
        )
        session.commit()

    recovered = client.get("/api/v1/audit/verify")
    assert recovered.status_code == 200
    assert recovered.json()["valid"] is True


def test_risk_recalculate_uses_live_overdue_count_and_explicit_external_inputs() -> None:
    response = client.post(
        f"/api/v1/risk/mines/{TEST_MINE_ID}/recalculate",
        json={
            "actorId": "USR-MSHARMA",
            "gasBreaches30d": 2,
            "inspectionCoveragePercent": 80,
        },
    )

    assert response.status_code == 201, response.text
    body = response.json()
    _created_risk_ids.append(body["riskSnapshotId"])

    assert body["mineId"] == TEST_MINE_ID
    assert body["score"] == 25.83
    assert body["level"] == "LOW"

    factors = {factor["name"]: factor for factor in body["factors"]}
    overdue = factors["Overdue Corrective Actions"]
    gas = factors["Gas Threshold Breaches (30d)"]
    coverage = factors["Inspection Coverage vs Target"]

    assert overdue["currentValue"] == 1
    assert overdue["source"] == "POSTGRESQL"
    assert gas["currentValue"] == 2
    assert gas["source"] == "REQUEST"
    assert coverage["currentValue"] == "80%"
    assert coverage["source"] == "REQUEST"


def test_latest_risk_and_dashboard_use_newest_persisted_snapshot() -> None:
    latest = client.get(f"/api/v1/risk/mines/{TEST_MINE_ID}")
    assert latest.status_code == 200, latest.text
    latest_body = latest.json()
    assert latest_body["riskSnapshotId"] == _created_risk_ids[-1]
    assert latest_body["score"] == 25.83

    dashboard = client.get(
        "/api/v1/dashboard/summary",
        params={"mineId": TEST_MINE_ID},
    )
    assert dashboard.status_code == 200, dashboard.text
    assert dashboard.json()["risk"]["score"] == 25.83


def test_recalculate_can_reuse_last_known_external_observations() -> None:
    response = client.post(
        f"/api/v1/risk/mines/{TEST_MINE_ID}/recalculate",
        json={"actorId": "USR-MSHARMA"},
    )

    assert response.status_code == 201, response.text
    body = response.json()
    _created_risk_ids.append(body["riskSnapshotId"])
    assert body["score"] == 25.83

    factors = {factor["name"]: factor for factor in body["factors"]}
    assert factors["Gas Threshold Breaches (30d)"]["currentValue"] == 2
    assert factors["Gas Threshold Breaches (30d)"]["source"] == "LAST_KNOWN"
    assert factors["Inspection Coverage vs Target"]["currentValue"] == "80%"
    assert factors["Inspection Coverage vs Target"]["source"] == "LAST_KNOWN"


def test_risk_unknown_mine_returns_404() -> None:
    latest = client.get("/api/v1/risk/mines/MINE-NOT-FOUND")
    assert latest.status_code == 404

    recalculate = client.post(
        "/api/v1/risk/mines/MINE-NOT-FOUND/recalculate",
        json={
            "actorId": "USR-MSHARMA",
            "gasBreaches30d": 1,
            "inspectionCoveragePercent": 90,
        },
    )
    assert recalculate.status_code == 404
