from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import AnalysisResponse, HealthResponse
from app.services.analysis import heuristic_resume_analysis
from app.services.hf_analysis import hf_resume_analysis
from app.services.llm import llm_resume_analysis
from app.services.parser import extract_resume_text


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Resume analyzer API with structured ATS scoring and AI suggestions.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=dict)
async def root() -> dict:
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
    )


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
) -> AnalysisResponse:
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    file_bytes = await resume.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded resume file is empty.")

    try:
        resume_text = extract_resume_text(resume.filename or "resume.txt", file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not parse the uploaded resume.") from exc

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="No readable text could be extracted from the resume.")

    if settings.enable_hf_model:
        try:
            return hf_resume_analysis(resume_text, job_description)
        except Exception:
            pass

    if settings.openai_api_key:
        try:
            return llm_resume_analysis(resume_text, job_description)
        except Exception:
            if not settings.allow_llm_fallback:
                raise HTTPException(status_code=502, detail="LLM analysis failed and fallback is disabled.")

    return heuristic_resume_analysis(resume_text, job_description)
