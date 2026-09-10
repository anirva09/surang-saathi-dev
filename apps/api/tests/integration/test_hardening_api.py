from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import app


client = TestClient(app)
REPO_ROOT = Path(__file__).resolve().parents[4]


EXPECTED_GOLDEN_WORKFLOW_PATHS = {
    "/api/v1/dashboard/summary",
    "/api/v1/hazards",
    "/api/v1/hazards/{hazard_id}",
    "/api/v1/hazards/{hazard_id}/acknowledge",
    "/api/v1/hazards/{hazard_id}/review",
    "/api/v1/hazards/{hazard_id}/evidence",
    "/api/v1/corrective-actions",
    "/api/v1/corrective-actions/{action_id}",
    "/api/v1/corrective-actions/{action_id}/resolve",
    "/api/v1/audit/events",
    "/api/v1/audit/verify",
    "/api/v1/risk/mines/{mine_id}",
    "/api/v1/risk/mines/{mine_id}/recalculate",
}


def test_configured_frontend_origin_gets_cors_preflight_headers() -> None:
    response = client.options(
        "/api/v1/hazards",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200, response.text
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert "GET" in response.headers["access-control-allow-methods"]


def test_settings_parse_comma_separated_cors_origins() -> None:
    settings = Settings(
        cors_allowed_origins=(
            "http://localhost:3000, https://portal.example.gov.in, "
        )
    )

    assert settings.cors_origins == [
        "http://localhost:3000",
        "https://portal.example.gov.in",
    ]


def test_unknown_route_uses_stable_error_envelope() -> None:
    response = client.get("/api/v1/route-that-does-not-exist")

    assert response.status_code == 404
    body = response.json()
    assert body["error"] == {
        "code": "NOT_FOUND",
        "message": "Not Found",
        "status": 404,
    }
    # Preserve FastAPI's legacy detail field while the frontend migrates.
    assert body["detail"] == "Not Found"


def test_request_validation_uses_stable_error_envelope() -> None:
    response = client.post("/api/v1/hazards", json={})

    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert body["error"]["message"] == "Request validation failed"
    assert body["error"]["status"] == 422
    assert isinstance(body["error"]["details"], list)
    assert body["error"]["details"]
    assert body["detail"] == body["error"]["details"]


def test_openapi_exposes_the_golden_workflow_contract() -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200, response.text
    document = response.json()
    paths = set(document["paths"])
    assert EXPECTED_GOLDEN_WORKFLOW_PATHS <= paths
    assert document["info"]["title"] == "Surang Saathi API"

    schemas = document["components"]["schemas"]
    for required_schema in (
        "HazardCreateIn",
        "HazardDetailOut",
        "EvidenceUploadOut",
        "AuditVerificationOut",
        "RiskSnapshotOut",
    ):
        assert required_schema in schemas


def test_compose_defines_container_safe_api_service() -> None:
    compose = (REPO_ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    dockerfile = REPO_ROOT / "apps" / "api" / "Dockerfile"
    env_example = (REPO_ROOT / ".env.example").read_text(encoding="utf-8")

    assert dockerfile.is_file()
    dockerfile_text = dockerfile.read_text(encoding="utf-8")
    assert "FROM python:3.12-slim" in dockerfile_text
    assert "uvicorn" in dockerfile_text

    assert "\n  api:\n" in compose
    assert "postgres:5432" in compose
    assert "minio:9000" in compose
    assert "alembic upgrade head" in compose
    assert '"${API_PORT:-8000}:8000"' in compose
    assert "CORS_ALLOWED_ORIGINS" in compose
    assert "CORS_ALLOWED_ORIGINS=" in env_example
