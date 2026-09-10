from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.core.readiness import check_readiness
from app.modules.evidence.storage import ensure_evidence_bucket


configure_logging()
logger = logging.getLogger(__name__)
settings = get_settings()


HTTP_ERROR_CODES = {
    status.HTTP_400_BAD_REQUEST: "BAD_REQUEST",
    status.HTTP_404_NOT_FOUND: "NOT_FOUND",
    status.HTTP_409_CONFLICT: "CONFLICT",
    status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: "PAYLOAD_TOO_LARGE",
    status.HTTP_415_UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
    status.HTTP_422_UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    status.HTTP_503_SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
}


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        ensure_evidence_bucket()
    except Exception:
        logger.exception("Evidence bucket bootstrap failed")

    yield


app = FastAPI(
    title="Surang Saathi API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    _: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    error_code = HTTP_ERROR_CODES.get(exc.status_code, f"HTTP_{exc.status_code}")
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    body = {
        "error": {
            "code": error_code,
            "message": message,
            "status": exc.status_code,
        },
        # Backward compatibility for existing clients/tests using FastAPI's detail field.
        "detail": exc.detail,
    }
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(body),
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    details = jsonable_encoder(exc.errors())
    body = {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "status": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "details": details,
        },
        # Preserve the default FastAPI detail shape during frontend migration.
        "detail": details,
    }
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=body,
    )


app.include_router(api_v1_router)


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
