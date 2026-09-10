import logging

from sqlalchemy import text

from app.core.database import engine
from app.modules.evidence.storage import create_minio_client


logger = logging.getLogger(__name__)


def check_readiness() -> dict[str, str]:
    database = "ok"
    object_storage = "ok"

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        logger.exception("Database readiness check failed")
        database = "unavailable"

    try:
        client = create_minio_client()
        client.list_buckets()
    except Exception:
        logger.exception("Object storage readiness check failed")
        object_storage = "unavailable"

    status = "ready" if database == "ok" and object_storage == "ok" else "degraded"

    return {
        "status": status,
        "database": database,
        "objectStorage": object_storage,
    }
