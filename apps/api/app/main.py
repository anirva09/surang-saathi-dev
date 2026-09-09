from fastapi import FastAPI, Response, status

from app.core.logging import configure_logging
from app.core.readiness import check_readiness


configure_logging()

app = FastAPI(
    title="Surang Saathi API",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "surang-saathi-api",
    }


@app.get("/ready")
def ready(response: Response) -> dict[str, str]:
    result = check_readiness()

    if result["status"] != "ready":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return result
