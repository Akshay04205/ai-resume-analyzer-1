from pydantic import BaseModel, ConfigDict, Field


class ScoreBreakdown(BaseModel):
    matched_count: int = Field(default=0, ge=0)
    required_count: int = Field(default=0, ge=0)
    keyword_coverage: int = Field(default=0, ge=0, le=100)
    formatting_score: int = Field(default=0, ge=0, le=100)
    impact_score: int = Field(default=0, ge=0, le=100)
    overall_score: int = Field(default=0, ge=0, le=100)


class AnalysisResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    candidate_name: str | None = Field(default=None)
    email: str | None = Field(default=None)
    phone: str | None = Field(default=None)
    skills: list[str] = Field(default_factory=list)
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    ats_score: int = Field(default=0, ge=0, le=100)
    suggestions: list[str] = Field(default_factory=list)
    summary: str = Field(default="")
    experience_highlights: list[str] = Field(default_factory=list)
    required_skills: list[str] = Field(default_factory=list)
    score_breakdown: ScoreBreakdown = Field(default_factory=ScoreBreakdown)
    resume_excerpt: str = Field(default="")
    model_used: str = Field(default="heuristic")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
