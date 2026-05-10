import re
from collections import OrderedDict

from app.models import AnalysisResponse
from app.services.profile import normalize_candidate_name


SKILL_VOCABULARY = [
    "python", "java", "c++", "javascript", "typescript", "react", "next.js", "node.js",
    "fastapi", "django", "flask", "sql", "mysql", "postgresql", "mongodb", "redis",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "machine learning",
    "deep learning", "nlp", "computer vision", "data analysis", "data visualization",
    "power bi", "tableau", "excel", "aws", "gcp", "azure", "docker", "kubernetes",
    "git", "github", "ci/cd", "rest api", "graphql", "linux", "oop", "html", "css",
    "tailwind css", "framer motion", "three.js", "streamlit", "langchain", "openai api",
]


def heuristic_resume_analysis(resume_text: str, job_description: str) -> AnalysisResponse:
    normalized_resume = _normalize_text(resume_text)
    normalized_jd = _normalize_text(job_description)

    required_skills = _extract_skills(normalized_jd)
    resume_skills = _extract_skills(normalized_resume)
    matched_skills = [skill for skill in required_skills if skill in resume_skills]
    missing_skills = [skill for skill in required_skills if skill not in resume_skills]

    if required_skills:
        ats_score = round((len(matched_skills) / len(required_skills)) * 100)
    else:
        ats_score = min(100, max(35, len(resume_skills) * 5))

    email = _extract_email(resume_text)
    phone = _extract_phone(resume_text)
    candidate_name = normalize_candidate_name(_extract_candidate_name(resume_text), resume_text, email)

    suggestions = _build_suggestions(ats_score, missing_skills, resume_text, matched_skills)
    highlights = _extract_highlights(resume_text)
    summary = _build_summary(ats_score, matched_skills, missing_skills)
    formatting_score = _estimate_formatting_score(resume_text)
    impact_score = _estimate_impact_score(resume_text)
    score_breakdown = {
        "matched_count": len(matched_skills),
        "required_count": len(required_skills),
        "keyword_coverage": ats_score,
        "formatting_score": formatting_score,
        "impact_score": impact_score,
        "overall_score": round((ats_score * 0.7) + (formatting_score * 0.15) + (impact_score * 0.15)),
    }

    return AnalysisResponse(
        candidate_name=candidate_name,
        email=email,
        phone=phone,
        skills=resume_skills,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        ats_score=ats_score,
        suggestions=suggestions,
        summary=summary,
        experience_highlights=highlights,
        required_skills=required_skills,
        score_breakdown=score_breakdown,
        resume_excerpt=resume_text[:700].strip(),
        model_used="heuristic",
    )


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.lower()).strip()


def _extract_skills(text: str) -> list[str]:
    found = OrderedDict()
    for skill in SKILL_VOCABULARY:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text):
            found[skill] = True
    return list(found.keys())


def _extract_candidate_name(text: str) -> str | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return lines[0] if lines else None


def _extract_email(text: str) -> str | None:
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return match.group(0) if match else None


def _extract_phone(text: str) -> str | None:
    match = re.search(r"(\+?\d[\d\s\-()]{8,}\d)", text)
    return match.group(0).strip() if match else None


def _extract_highlights(text: str) -> list[str]:
    lines = [line.strip("-• ").strip() for line in text.splitlines() if line.strip()]
    scored = [line for line in lines if any(token in line.lower() for token in ["built", "developed", "created", "improved", "designed", "implemented", "led"])]
    return scored[:4]


def _build_summary(score: int, matched_skills: list[str], missing_skills: list[str]) -> str:
    if score >= 80:
        return "Strong overall alignment with the target role and a good ATS-ready keyword match."
    if score >= 60:
        return f"Decent match with the role, with strongest alignment around {', '.join(matched_skills[:3]) or 'core technical skills'}."
    if missing_skills:
        return f"Partial fit for the role. The biggest gaps are {', '.join(missing_skills[:3])}."
    return "Resume shows some relevant experience but needs stronger role-specific alignment."


def _build_suggestions(score: int, missing_skills: list[str], resume_text: str, matched_skills: list[str]) -> list[str]:
    suggestions: list[str] = []
    if missing_skills:
        suggestions.append(f"Add or strengthen evidence for these JD keywords: {', '.join(missing_skills[:5])}.")
    if score < 75:
        suggestions.append("Rewrite the summary section to align more directly with the target job title and responsibilities.")
    if not re.search(r"\b\d+%|\b\d+\+|\b\d+\s*(users|projects|models|pipelines|apis)\b", resume_text.lower()):
        suggestions.append("Add measurable outcomes such as accuracy gains, latency reduction, users served, or project impact.")
    if matched_skills:
        suggestions.append(f"Move your strongest matching skills earlier in the resume: {', '.join(matched_skills[:4])}.")
    suggestions.append("Tailor at least one project bullet to directly mirror the job description language.")
    return suggestions[:5]


def _estimate_formatting_score(text: str) -> int:
    sections = ["experience", "education", "skills", "projects", "summary"]
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    section_hits = sum(1 for section in sections if re.search(rf"\b{section}\b", text.lower()))
    has_contacts = 1 if _extract_email(text) and _extract_phone(text) else 0
    has_bullets = 1 if any(line.startswith(("-", "•")) for line in lines) else 0
    return min(100, (section_hits * 14) + (has_contacts * 20) + (has_bullets * 10))


def _estimate_impact_score(text: str) -> int:
    lowered = text.lower()
    quantified_bullets = len(re.findall(r"\b\d+%|\b\d+\+|\b\d+\s*(users|projects|models|pipelines|apis|clients|hours)\b", lowered))
    action_verbs = len(re.findall(r"\b(built|developed|created|improved|designed|implemented|optimized|led|launched)\b", lowered))
    return min(100, (quantified_bullets * 18) + min(action_verbs, 5) * 8 + 20)
