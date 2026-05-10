import re
from functools import lru_cache
import json
from pathlib import Path
import time

from app.config import settings
from app.models import AnalysisResponse
from app.services.analysis import (
    _build_suggestions,
    _estimate_formatting_score,
    _estimate_impact_score,
    _extract_email,
    _extract_highlights,
    _extract_phone,
    _extract_skills,
    _normalize_text,
)
from app.services.profile import normalize_candidate_name


def _debug_log(hypothesis_id: str, location: str, message: str, data: dict) -> None:
    # region agent log
    payload = {
        "sessionId": "6fe10d",
        "runId": "initial",
        "hypothesisId": hypothesis_id,
        "location": location,
        "message": message,
        "data": data,
        "timestamp": int(time.time() * 1000),
    }
    try:
        with Path("/Users/bakhtiarsiddiqui/Desktop/ai resume analyzer/.cursor/debug-6fe10d.log").open("a", encoding="utf-8") as file:
            file.write(json.dumps(payload) + "\n")
    except Exception:
        pass
    # endregion


@lru_cache(maxsize=1)
def _load_embedding_stack():
    try:
        from sentence_transformers import SentenceTransformer, util

        model = SentenceTransformer(settings.hf_model_name)
        _debug_log(
            "H5",
            "backend/app/services/hf_analysis.py:_load_embedding_stack",
            "HF model loaded",
            {"hf_model_name": settings.hf_model_name},
        )
        return model, util
    except Exception as exc:
        _debug_log(
            "H5",
            "backend/app/services/hf_analysis.py:_load_embedding_stack",
            "HF model load failed",
            {"error_type": type(exc).__name__, "error": str(exc)},
        )
        raise


def hf_resume_analysis(resume_text: str, job_description: str) -> AnalysisResponse:
    model, util = _load_embedding_stack()

    normalized_resume = _normalize_text(resume_text)
    normalized_jd = _normalize_text(job_description)

    required_skills = _extract_skills(normalized_jd)
    resume_skills = _extract_skills(normalized_resume)
    matched_skills = [skill for skill in required_skills if skill in resume_skills]
    missing_skills = [skill for skill in required_skills if skill not in resume_skills]
    ats_score = round((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0

    email = _extract_email(resume_text)
    phone = _extract_phone(resume_text)
    candidate_name = normalize_candidate_name(None, resume_text, email)

    resume_segments = _build_resume_segments(resume_text)
    semantic_alignment = _compute_semantic_alignment(model, util, job_description, resume_text)
    experience_highlights = _rank_relevant_highlights(model, util, job_description, resume_segments)
    if not experience_highlights:
        experience_highlights = _extract_highlights(resume_text)

    formatting_score = _estimate_formatting_score(resume_text)
    impact_score = _estimate_impact_score(resume_text)
    overall_score = round((ats_score * 0.55) + (formatting_score * 0.15) + (impact_score * 0.15) + (semantic_alignment * 0.15))

    summary = _build_hf_summary(ats_score, semantic_alignment, matched_skills, missing_skills)
    suggestions = _build_suggestions(ats_score, missing_skills, resume_text, matched_skills)
    if semantic_alignment < 55:
        suggestions.insert(0, "Add role-specific phrases from the job description so the resume aligns better semantically with the target role.")

    return AnalysisResponse(
        candidate_name=candidate_name,
        email=email,
        phone=phone,
        skills=resume_skills,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        ats_score=ats_score,
        suggestions=suggestions[:5],
        summary=summary,
        experience_highlights=experience_highlights[:4],
        required_skills=required_skills,
        score_breakdown={
            "matched_count": len(matched_skills),
            "required_count": len(required_skills),
            "keyword_coverage": ats_score,
            "formatting_score": formatting_score,
            "impact_score": impact_score,
            "overall_score": max(0, min(100, overall_score)),
        },
        resume_excerpt=resume_text[:700].strip(),
        model_used=settings.hf_model_name,
    )


def _build_resume_segments(text: str) -> list[str]:
    raw_segments = []
    for line in text.splitlines():
        line = re.sub(r"\s+", " ", line).strip(" -•\t")
        if 20 <= len(line) <= 240:
            raw_segments.append(line)

    for sentence in re.split(r"(?<=[.!?])\s+", text):
        sentence = re.sub(r"\s+", " ", sentence).strip()
        if 30 <= len(sentence) <= 240:
            raw_segments.append(sentence)

    seen = set()
    segments = []
    for segment in raw_segments:
        key = segment.lower()
        if key not in seen:
            seen.add(key)
            segments.append(segment)
    return segments[:60]


def _compute_semantic_alignment(model, util, job_description: str, resume_text: str) -> int:
    jd_embedding = model.encode(job_description, convert_to_tensor=True)
    resume_embedding = model.encode(resume_text[:4000], convert_to_tensor=True)
    similarity = float(util.cos_sim(jd_embedding, resume_embedding)[0][0].item())
    return max(0, min(100, round((similarity + 1) * 50)))


def _rank_relevant_highlights(model, util, job_description: str, segments: list[str]) -> list[str]:
    if not segments:
        return []

    jd_embedding = model.encode(job_description, convert_to_tensor=True)
    segment_embeddings = model.encode(segments, convert_to_tensor=True)
    scores = util.cos_sim(jd_embedding, segment_embeddings)[0]

    ranked = sorted(
        zip(segments, scores.tolist()),
        key=lambda item: item[1],
        reverse=True,
    )
    strong_matches = [segment for segment, score in ranked if score >= 0.22]
    return strong_matches[:4]


def _build_hf_summary(score: int, semantic_alignment: int, matched_skills: list[str], missing_skills: list[str]) -> str:
    if score >= 75 and semantic_alignment >= 70:
        return "Strong ATS keyword match with good semantic alignment to the target role."
    if score >= 50 and semantic_alignment >= 60:
        return f"Moderate fit overall, with strongest visible alignment around {', '.join(matched_skills[:3]) or 'core technical skills'}."
    if missing_skills:
        return f"Partial match. The resume has some relevant context, but major gaps remain around {', '.join(missing_skills[:3])}."
    return "The resume has some relevant content, but the role alignment is still weak."
