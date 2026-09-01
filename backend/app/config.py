import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Samadhan Jharkhand AI Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-for-jharkhand-samadhan-sih-prototype-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./samadhan.db"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None

    # AI & ML
    LLM_API_KEY: Optional[str] = None
    EMBEDDING_API_KEY: Optional[str] = None

    # Services
    MAPBOX_TOKEN: Optional[str] = None
    EMAIL_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
