from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_service_identity() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "surang-saathi-api",
    }


def test_ready_returns_dependency_state(monkeypatch) -> None:
    monkeypatch.setattr(
        "app.main.check_readiness",
        lambda: {
            "status": "ready",
            "database": "ok",
            "objectStorage": "ok",
        },
    )

    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json()["status"] == "ready"


def test_ready_returns_503_when_dependency_is_unavailable(monkeypatch) -> None:
    monkeypatch.setattr(
        "app.main.check_readiness",
        lambda: {
            "status": "degraded",
            "database": "ok",
            "objectStorage": "unavailable",
        },
    )

    response = client.get("/ready")

    assert response.status_code == 503
    assert response.json()["status"] == "degraded"
