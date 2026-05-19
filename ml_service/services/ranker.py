"""
ranker.py
---------
Ranks scraped jobs by relevance to the original job description.

Primary:  Gemini 2.0 Flash (google-genai SDK) — intelligent semantic ranking
Fallback: TF-IDF cosine similarity — works with zero API calls, always available
"""

import os
import json
import re
from dotenv import load_dotenv

load_dotenv()


def rank_with_gemini(jobs: list, job_role: str, job_description: str, top_n: int = 8) -> list:
    """
    Sends scraped jobs to Gemini 2.0 Flash for intelligent relevance ranking.
    Returns top_n jobs sorted by relevance_score (0-100) descending.
    Each job gets a 'relevance_score' and 'reason' field added.
    Falls back to TF-IDF ranker if Gemini is unavailable.
    """
    if not jobs:
        return []

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key.startswith("YOUR_"):
        print("[Ranker] No Gemini key — using TF-IDF fallback")
        return rank_with_tfidf(jobs, job_description, top_n)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        # Compact summary of each job for the prompt
        jobs_summary = [
            {
                "index": i,
                "title": job.get("title", ""),
                "company": job.get("company", ""),
                "snippet": job.get("description_snippet", "")[:120],
            }
            for i, job in enumerate(jobs)
        ]

        prompt = (
            f"You are a job matching expert. Score each job below against the reference.\n\n"
            f"Reference Role: {job_role}\n"
            f"Reference Description (first 400 chars):\n\"\"\"\n{job_description[:400]}\n\"\"\"\n\n"
            f"Job Listings:\n{json.dumps(jobs_summary, indent=2)}\n\n"
            "Scoring guide:\n"
            "  85-100: Same role + same tech stack\n"
            "  65-84:  Similar role, overlapping skills\n"
            "  40-64:  Related domain, different focus\n"
            "  0-39:   Different field\n\n"
            "Rules:\n"
            "- Score ALL jobs in the list\n"
            "- Write 1-sentence reason per job\n"
            "- Output ONLY valid JSON array, no markdown, no code fences\n\n"
            'Output: [{"index": 0, "relevance_score": 88, "reason": "..."}, ...]'
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        raw = response.text.strip()
        raw = re.sub(r"```(?:json)?", "", raw).strip().strip("`").strip()
        scores = json.loads(raw)

        score_map = {item["index"]: item for item in scores if "index" in item}

        ranked = []
        for i, job in enumerate(jobs):
            score_data = score_map.get(i, {})
            ranked.append({
                **job,
                "relevance_score": int(score_data.get("relevance_score", 50)),
                "reason": score_data.get("reason", "Relevant to your target role."),
            })

        ranked.sort(key=lambda x: x["relevance_score"], reverse=True)
        print(f"[Ranker] Gemini ranked {len(ranked)} jobs")
        return ranked[:top_n]

    except Exception as e:
        print(f"[Ranker] Gemini error: {e} — using TF-IDF fallback")
        return rank_with_tfidf(jobs, job_description, top_n)


def rank_with_tfidf(jobs: list, job_description: str, top_n: int = 8) -> list:
    """
    Local TF-IDF cosine similarity ranker.
    Zero API calls — always works as fallback.
    Compares each job's text against the full job description.
    """
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        if not jobs:
            return []

        job_texts = [
            f"{j.get('title','')} {j.get('company','')} {j.get('description_snippet','')}"
            for j in jobs
        ]

        corpus = [job_description] + job_texts
        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000, ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform(corpus)
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

        ranked = []
        for i, job in enumerate(jobs):
            score = int(round(float(similarities[i]) * 100))
            score = max(score, 5) if similarities[i] > 0 else 0
            ranked.append({
                **job,
                "relevance_score": score,
                "reason": f"TF-IDF similarity score: {score}% match with your target description.",
            })

        ranked.sort(key=lambda x: x["relevance_score"], reverse=True)
        print(f"[Ranker] TF-IDF ranked {len(ranked)} jobs")
        return ranked[:top_n]

    except ImportError:
        return _keyword_fallback(jobs, job_description, top_n)


def _keyword_fallback(jobs: list, job_description: str, top_n: int) -> list:
    desc_words = set(job_description.lower().split())
    ranked = []
    for job in jobs:
        text = f"{job.get('title','')} {job.get('description_snippet','')}".lower()
        overlap = len(desc_words & set(text.split()))
        score = min(int(overlap * 2), 100)
        ranked.append({
            **job,
            "relevance_score": score,
            "reason": "Matched by keyword overlap with your job description.",
        })
    ranked.sort(key=lambda x: x["relevance_score"], reverse=True)
    return ranked[:top_n]
