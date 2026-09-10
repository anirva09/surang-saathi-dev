from app.core.config import Settings


def test_settings_accept_explicit_development_values() -> None:
    settings = Settings(
        app_env="development",
        api_host="0.0.0.0",
        api_port=8000,
        database_url="postgresql+psycopg://surang:surang@localhost:5432/surang_saathi",
        minio_endpoint="localhost:9000",
        minio_access_key="surang",
        minio_secret_key="surang-dev-secret",
        minio_secure=False,
        minio_bucket="surang-saathi-evidence",
    )

    assert settings.app_env == "development"
    assert settings.api_port == 8000
    assert settings.minio_bucket == "surang-saathi-evidence"
