from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    """
    Central configuration settings for the application.
    Values are loaded automatically from .env
    """

    # App Configurations
    APP_NAME: str
    DEBUG: bool = False

    # LLM Configuration
    GROQ_API_KEY: str
    MODEL_NAME: str

    # Vector Database
    CHROMA_DB_PATH: str

    # Chunking Configuration
    MAX_CHUNK_SIZE: int
    CHUNK_OVERLAP: int

    # Retrieval Configuration
    TOP_K_RESULTS: int

    class Config:
        env_file = BASE_DIR /".env"
        case_sensitive = True

@lru_cache
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    Prevents reloading env repeatedly.
    """
    return Settings()


settings = get_settings()