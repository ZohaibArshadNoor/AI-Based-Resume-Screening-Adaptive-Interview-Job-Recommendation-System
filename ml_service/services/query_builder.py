"""
query_builder.py
----------------
Uses Gemini 2.0 Flash to read the job role + job description and generate
smart, targeted search queries for each job portal.

SDK: google-genai (pip install google-genai)
Model: gemini-2.0-flash (free tier)

Get free key at: https://aistudio.google.com/app/apikey
Set in ml_service/.env as: GEMINI_API_KEY=your_key_here
"""

import os
import json
import re
from dotenv import load_dotenv

load_dotenv()


def build_search_queries(job_role: str, job_description: str) -> dict:
    """
    Returns portal-specific search queries derived from the job role + description.
    Uses Gemini if key available, else falls back to keyword extraction.

    Returns:
        {
            "linkedin": "Python FastAPI developer Pakistan",
            "rozee":    "Python backend engineer Pakistan",
            "indeed":   "Python Django developer"
        }
    """
    api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key or api_key.startswith("YOUR_"):
        print("[QueryBuilder] No Gemini key — using keyword fallback")
        return _fallback_queries(job_role, job_description)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        prompt = (
            "You are a job search assistant. Given a job role and job description, "
            "generate 3 short targeted search queries — one each for LinkedIn, Rozee.pk, and Indeed.\n\n"
            "Rules:\n"
            "- Each query: 4-6 words max, include most important skill from description\n"
            "- LinkedIn + Rozee queries: include 'Pakistan'\n"
            "- Output ONLY valid JSON, no markdown, no code fences\n\n"
            f"Job Role: {job_role}\n"
            f"Description (first 500 chars): {job_description[:500]}\n\n"
            'Output: {"linkedin": "...", "rozee": "...", "indeed": "..."}'
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        raw = response.text.strip()
        raw = re.sub(r"```(?:json)?", "", raw).strip().strip("`").strip()
        data = json.loads(raw)

        for key in ("linkedin", "rozee", "indeed"):
            if key not in data or not data[key]:
                data[key] = f"{job_role} Pakistan" if key != "indeed" else job_role

        print(f"[QueryBuilder] Generated: {data}")
        return data

    except Exception as e:
        print(f"[QueryBuilder] Error: {e} — using fallback")
        return _fallback_queries(job_role, job_description)


def _fallback_queries(job_role: str, job_description: str) -> dict:
    """Keyword-based fallback when Gemini is unavailable."""
    tech_keywords = [
        "python", "javascript", "react", "node", "django", "fastapi",
        "machine learning", "data science", "nlp", "sql", "mongodb",
        "java", "spring", "flutter", "android", "devops", "docker",
        "kubernetes", "aws", "azure", "php", "laravel", "typescript",
        "vue", "angular", "tensorflow", "pytorch", "scikit-learn",
    ]
    desc_lower = job_description.lower()
    found = [kw for kw in tech_keywords if kw in desc_lower]
    top_skill = found[0] if found else ""
    base = f"{job_role} {top_skill}".strip()
    return {
        "linkedin": f"{base} Pakistan",
        "rozee": f"{base} Pakistan",
        "indeed": base,
    }
