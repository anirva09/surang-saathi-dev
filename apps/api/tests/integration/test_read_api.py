from fastapi.testclient import TestClient

from app.main import app
from app.seed.run import seed


client = TestClient(app)


def setup_module() -> None:
    seed()


def test_dashboard_summary_is_database_backed() -> None:
    response = client.get("/api/v1/dashboard/summary", params={"mineId": "MINE-03"})

    assert response.status_code == 200
    body = response.json()

    assert body["mine"]["id"] == "MINE-03"
    assert body["mine"]["name"] == "Demo Mine 03"
    assert body["risk"]["score"] == 74.2
    assert body["risk"]["level"] == "HIGH"
    assert body["kpis"]["openHazards"] >= 1
    assert body["kpis"]["highRiskHazards"] >= 1
    assert body["kpis"]["overdueCorrectiveActions"] >= 1
    assert body["kpis"]["conflictedHazards"] >= 1


def test_hazard_list_returns_seeded_hero_hazard() -> None:
    response = client.get("/api/v1/hazards", params={"mineId": "MINE-03"})

    assert response.status_code == 200
    body = response.json()

    assert body["total"] >= 1
    hero = next(item for item in body["items"] if item["hazardId"] == "HZRD-2026-442")
    assert hero["severity"] == "HIGH"
    assert hero["status"] == "ESCALATED"
    assert hero["syncState"] == "CONFLICT"
    assert hero["geofenceState"] == "CONFLICT"
    assert hero["evidenceCount"] == 1
    assert hero["correctiveActionCount"] == 1
    assert hero["reportedBy"]["name"] == "Rajesh Kumar (Sirdar)"
    assert hero["assignedTo"]["name"] == "M. Sharma"


def test_hazard_detail_returns_evidence_and_corrective_action() -> None:
    response = client.get("/api/v1/hazards/HZRD-2026-442")

    assert response.status_code == 200
    body = response.json()

    assert body["hazardId"] == "HZRD-2026-442"
    assert body["title"] == "Roof support damage observed"
    assert len(body["evidence"]) == 1
    assert body["evidence"][0]["evidenceId"] == "EVD-HZRD-442-001"
    assert len(body["correctiveActions"]) == 1
    assert body["correctiveActions"][0]["actionId"] == "ACT-2026-118"


def test_hazard_detail_returns_404_for_unknown_hazard() -> None:
    response = client.get("/api/v1/hazards/HZRD-NOT-FOUND")
    assert response.status_code == 404


def test_dashboard_returns_404_for_unknown_mine() -> None:
    response = client.get("/api/v1/dashboard/summary", params={"mineId": "MINE-NOT-FOUND"})
    assert response.status_code == 404
