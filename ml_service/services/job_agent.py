"""
job_agent.py
------------
Main orchestrator for the job recommendation pipeline.

Flow:
  1. query_builder.py  → Gemini reads role+description → generates portal-specific search queries
  2. scrapers.py       → Runs LinkedIn, Rozee.pk, Indeed scrapers in sequence → real job URLs
  3. ranker.py         → Gemini (or TF-IDF fallback) ranks jobs by relevance → top N returned

This is the ONLY file you need to import in app.py.
Call: run_job_agent(job_role, job_description, max_results=8)
"""

from services.query_builder import build_search_queries
from services.scrapers import scrape_all_portals
from services.ranker import rank_with_gemini


def run_job_agent(
    job_role: str,
    job_description: str,
    user_skills: list[str] | None = None,
    max_results: int = 8,
) -> list[dict]:
    """
    Full pipeline: role + description → ranked real job listings with direct URLs.

    Args:
        job_role:        e.g. "Backend Software Engineer"
        job_description: Full text of the job ad the candidate is applying for
        user_skills:     Optional list from resume (not used in search, logged only)
        max_results:     How many ranked jobs to return (default 8)

    Returns:
        List of dicts, each containing:
          title            str   — Job title
          company          str   — Company name
          location         str   — City / country
          url              str   — DIRECT link to the job posting (not homepage)
          source           str   — "LinkedIn" | "Rozee.pk" | "Indeed"
          posted_date      str   — When posted (if available)
          description_snippet str — Short text from the listing
          relevance_score  int   — 0-100 match score vs your job description
          reason           str   — 1-sentence explanation from Gemini
    """
    print(f"\n{'='*60}")
    print(f"[Agent] Starting job search")
    print(f"[Agent] Role: {job_role}")
    print(f"[Agent] Skills: {user_skills}")
    print(f"{'='*60}\n")

    # ── STEP 1: Build smart search queries ───────────────────────────────────
    print("[Agent] Step 1: Building search queries via Gemini...")
    queries = build_search_queries(job_role, job_description)
    print(f"[Agent] Queries → {queries}")

    # ── STEP 2: Scrape all portals ────────────────────────────────────────────
    print("\n[Agent] Step 2: Scraping job portals...")
    raw_jobs = scrape_all_portals(queries, max_per_source=max(max_results, 8))
    print(f"[Agent] Raw jobs collected: {len(raw_jobs)}")

    if not raw_jobs:
        print("[Agent] WARNING: No jobs scraped from any portal.")
        return []

    # ── STEP 3: Rank by relevance ─────────────────────────────────────────────
    print(f"\n[Agent] Step 3: Ranking {len(raw_jobs)} jobs by relevance...")
    ranked = rank_with_gemini(
        jobs=raw_jobs,
        job_role=job_role,
        job_description=job_description,
        top_n=max_results,
    )
    print(f"[Agent] Final ranked results: {len(ranked)}")

    # ── Log summary ───────────────────────────────────────────────────────────
    print("\n[Agent] Results summary:")
    for i, job in enumerate(ranked, 1):
        print(f"  {i}. [{job['relevance_score']}%] {job['title']} @ {job['company']} ({job['source']})")
        print(f"     URL: {job['url']}")

    return ranked
