from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    database_url: str = (
        "postgresql+psycopg://surang_saathi:change-me-local-only@localhost:55432/surang_saathi"
    )

    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "surang_saathi"
    minio_secret_key: str = "change-me-local-only"
    minio_secure: bool = False
    minio_bucket: str = "surang-saathi-evidence"


@lru_cache
def get_settings() -> Settings:
    return Settings()
