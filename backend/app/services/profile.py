import re


BLOCKED_NAME_TERMS = {
    "resume", "curriculum", "vitae", "bachelor", "master", "science", "engineering",
    "technology", "institute", "university", "college", "education", "experience",
    "project", "projects", "skills", "summary", "objective", "expected", "graduation",
    "coursework", "management", "computer", "artificial", "intelligence", "ai/ml",
}


def normalize_candidate_name(candidate_name: str | None, resume_text: str, email: str | None = None) -> str | None:
    if candidate_name:
        cleaned = _clean_name(candidate_name)
        if _looks_like_person_name(cleaned):
            return cleaned

    inferred_from_resume = _infer_name_from_resume(resume_text)
    if inferred_from_resume:
        return inferred_from_resume

    if email:
        inferred_from_email = _infer_name_from_email(email)
        if inferred_from_email:
            return inferred_from_email

    return None


def _infer_name_from_resume(text: str) -> str | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for line in lines[:12]:
        cleaned = _clean_name(line)
        if _looks_like_person_name(cleaned):
            return cleaned
    return None


def _infer_name_from_email(email: str) -> str | None:
    local_part = email.split("@", 1)[0]
    tokens = [token for token in re.split(r"[^A-Za-z]+", local_part) if token]
    if not tokens:
        return None

    merged = "".join(tokens)
    if len(tokens) == 1:
        token = merged.lower()
        common_surnames = [
            "siddiqui", "sharma", "kumar", "gupta", "singh", "patel", "jain", "verma",
            "khan", "shaikh", "joshi", "mehta", "nair", "iyer", "reddy",
        ]
        for surname in common_surnames:
            if token.endswith(surname) and len(token) > len(surname):
                first = token[: -len(surname)]
                tokens = [first, surname]
                break
        else:
            return None

    candidate = " ".join(token.capitalize() for token in tokens[:3])
    return candidate if _looks_like_person_name(candidate) else None


def _clean_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z\s]", " ", value)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def _looks_like_person_name(value: str | None) -> bool:
    if not value:
        return False

    lowered = value.lower()
    words = re.findall(r"[A-Za-z]+", value)
    if not 2 <= len(words) <= 4:
        return False
    if any(term in lowered for term in BLOCKED_NAME_TERMS):
        return False
    if not all(len(word) > 1 for word in words):
        return False
    if not all(word[0].isupper() for word in words):
        return False
    return True
