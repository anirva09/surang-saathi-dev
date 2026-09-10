from minio import Minio

from app.core.config import get_settings


def create_minio_client() -> Minio:
    settings = get_settings()

    return Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=settings.minio_secure,
    )


def ensure_evidence_bucket(client: Minio | None = None) -> None:
    settings = get_settings()
    storage = client or create_minio_client()

    if not storage.bucket_exists(settings.minio_bucket):
        storage.make_bucket(settings.minio_bucket)
