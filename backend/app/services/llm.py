import json

from openai import OpenAI

from app.config import settings
from app.models import AnalysisResponse
from app.services.profile import normalize_candidate_name


def build_analysis_prompt(resume_text: str, job_description: str) -> str:
    return f"""
You are an expert ATS resume analyzer for a college demonstration project.

Your task:
1. Extract candidate profile information from the resume.
2. Extract important required skills from the job description.
3. Compare the resume against the job description.
4. Calculate ATS score using this exact logic:
   - required_skills = unique required skills from JD
   - matched_skills = skills present in both resume and JD
   - ats_score = round((len(matched_skills) / len(required_skills)) * 100)
5. Build a small score_breakdown object:
   - matched_count = len(matched_skills)
   - required_count = len(required_skills)
   - keyword_coverage = ats_score
   - formatting_score = 0 to 100 based on clear sections, contact details, and readable ATS structure
   - impact_score = 0 to 100 based on quantified outcomes and strong action verbs
   - overall_score = rounded weighted score using 70% keyword_coverage, 15% formatting_score, 15% impact_score
6. Give concise, helpful suggestions.

Return STRICT JSON only with this exact schema:
{{
  "candidate_name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "skills": ["skill"],
  "matched_skills": ["skill"],
  "missing_skills": ["skill"],
  "ats_score": 0,
  "suggestions": ["suggestion"],
  "summary": "short summary",
  "experience_highlights": ["highlight"],
  "required_skills": ["skill"],
  "score_breakdown": {{
    "matched_count": 0,
    "required_count": 0,
    "keyword_coverage": 0,
    "formatting_score": 0,
    "impact_score": 0,
    "overall_score": 0
  }},
  "resume_excerpt": "short excerpt"
}}

Rules:
- Output valid JSON only. No markdown.
- Keep skills lowercase.
- Do not invent experience that is not visible in the resume.
- Set candidate_name to the person's actual name only. Do not use degree names, course names, institute names, or section headers as candidate_name.
- If the name is not clearly visible, return null for candidate_name.
- Keep suggestions practical and concise.
- Keep experience_highlights to 2 to 4 bullet-style statements.
- Keep ats_score and score_breakdown.keyword_coverage identical.
- If required_skills is empty, set ats_score to 0 and explain the limitation in summary.
- Do not include any keys outside the schema.

Resume:
\"\"\"{resume_text[:12000]}\"\"\"

Job Description:
\"\"\"{job_description[:8000]}\"\"\"
""".strip()


def llm_resume_analysis(resume_text: str, job_description: str) -> AnalysisResponse:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    client = OpenAI(
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )

    prompt = build_analysis_prompt(resume_text, job_description)
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You produce strict JSON for resume analysis."},
            {"role": "user", "content": prompt},
        ],
    )

    raw = response.choices[0].message.content or "{}"
    parsed = json.loads(raw)
    validated = AnalysisResponse(**parsed)
    validated.candidate_name = normalize_candidate_name(validated.candidate_name, resume_text, validated.email)
    validated.model_used = settings.openai_model
    return validated
