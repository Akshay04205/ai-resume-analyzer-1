from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI-Enhanced Resume Analyzer API"
    app_version: str = "1.0.0"
    frontend_origin: str = "http://localhost:5173"

    enable_hf_model: bool = True
    hf_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    allow_llm_fallback: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
