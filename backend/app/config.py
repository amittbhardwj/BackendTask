from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost/survey_db"
    GEMINI_API_KEY: str = "AIzaSyCsYh7xq6tAkEjkNSC-6buFt0w2HT-60lU"
    RATE_LIMIT: int = 100
    
    class Config:
        env_file = ".env"

settings = Settings()