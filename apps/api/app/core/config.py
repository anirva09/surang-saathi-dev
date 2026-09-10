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
    cors_allowed_origins: str = (
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    database_url: str = (
        "postgresql+psycopg://surang_saathi:change-me-local-only@localhost:55432/surang_saathi"
    )

    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "surang_saathi"
    minio_secret_key: str = "change-me-local-only"
    minio_secure: bool = False
    minio_bucket: str = "surang-saathi-evidence"

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_allowed_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
