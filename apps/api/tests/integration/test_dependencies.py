from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.modules.evidence.storage import create_minio_client, ensure_evidence_bucket


def test_postgis_extension_is_available() -> None:
    with engine.connect() as connection:
        value = connection.execute(text("SELECT PostGIS_Version()" )).scalar_one()

    assert value


def test_minio_evidence_bucket_exists_after_bootstrap() -> None:
    settings = get_settings()
    client = create_minio_client()

    ensure_evidence_bucket(client)

    assert client.bucket_exists(settings.minio_bucket)
