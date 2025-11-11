from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB Configuration - Atlas Clusters
    MONGODB_CRYPT_URI: str = "mongodb+srv://admin:2410@cluster0.sgir3un.mongodb.net/?appName=Cluster0"
    MONGODB_PARLOR_URI: str = "mongodb+srv://jitrajesh5_db_user:2410@cluster0.kti6y87.mongodb.net/?appName=Cluster0"
    MONGODB_COMEDY_URI: str = "mongodb+srv://Admin:2410@cluster0.zw0g1di.mongodb.net/?appName=Cluster0"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI Configuration
    OPENAI_API_KEY: Optional[str] = None
    
    # Application Configuration
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
