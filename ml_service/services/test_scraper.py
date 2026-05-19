"""
test_scraper.py
---------------
Run this file FIRST to verify the scraper works on your local machine
before integrating it into the full FastAPI app.

Usage:
    cd ml_service/
    python test_scraper.py

What it tests:
    1. query_builder — generates search queries (with or without Gemini)
    2. scrapers      — actually hits LinkedIn, Rozee.pk, Indeed and returns real jobs
    3. ranker        — scores and sorts the results
    4. Full pipeline — run_job_agent end-to-end

Results are printed to terminal with URLs you can open in your browser.
"""

import json
from query_builder import build_search_queries
from scrapers import scrape_linkedin, scrape_rozee, scrape_indeed, scrape_all_portals
from ranker import rank_with_tfidf
from job_agent import run_job_agent

# ── SAMPLE INPUT ─────────────────────────────────────────────────────────────
# Paste any real job description here for testing

SAMPLE_ROLE = "Backend Software Engineer"

SAMPLE_DESCRIPTION = """
We are looking for a Backend Software Engineer with strong experience in Python
and FastAPI to join our growing engineering team. The ideal candidate will have:

- 2+ years of experience building REST APIs with Python (FastAPI or Django)
- Solid understanding of MongoDB and database design
- Experience with JWT authentication and role-based access control
- Familiarity with machine learning model integration
- Good knowledge of Git, Docker, and agile development practices
- Strong problem-solving skills and ability to work in a team

Responsibilities:
- Design and build scalable RESTful APIs
- Integrate ML models into the backend pipeline
- Write clean, well-documented code
- Participate in code reviews and sprint planning

Location: Karachi or Remote | Full-time | Fresh/Junior candidates welcome
"""

SAMPLE_SKILLS = ["Python", "FastAPI", "MongoDB", "Docker", "Git"]


def separator(label: str):
    print(f"\n{'─'*60}")
    print(f"  {label}")
    print(f"{'─'*60}")


def test_query_builder():
    separator("TEST 1: Query Builder")
    queries = build_search_queries(SAMPLE_ROLE, SAMPLE_DESCRIPTION)
    print(json.dumps(queries, indent=2))
    return queries


def test_individual_scrapers(queries: dict):
    separator("TEST 2a: Rozee.pk Scraper")
    rozee_jobs = scrape_rozee(queries.get("rozee", f"{SAMPLE_ROLE} Pakistan"), max_results=5)
    print(f"Jobs found: {len(rozee_jobs)}")
    for j in rozee_jobs:
        print(f"  ✓ {j['title']} @ {j['company']} | {j['location']}")
        print(f"    URL: {j['url']}")

    separator("TEST 2b: LinkedIn Scraper")
    li_jobs = scrape_linkedin(queries.get("linkedin", f"{SAMPLE_ROLE} Pakistan"), max_results=5)
    print(f"Jobs found: {len(li_jobs)}")
    for j in li_jobs:
        print(f"  ✓ {j['title']} @ {j['company']} | {j['location']}")
        print(f"    URL: {j['url']}")

    separator("TEST 2c: Indeed Scraper")
    indeed_jobs = scrape_indeed(queries.get("indeed", SAMPLE_ROLE), max_results=5)
    print(f"Jobs found: {len(indeed_jobs)}")
    for j in indeed_jobs:
        print(f"  ✓ {j['title']} @ {j['company']} | {j['location']}")
        print(f"    URL: {j['url']}")

    return rozee_jobs + li_jobs + indeed_jobs


def test_ranker(raw_jobs: list):
    separator("TEST 3: TF-IDF Ranker (no API key needed)")
    ranked = rank_with_tfidf(raw_jobs, SAMPLE_DESCRIPTION, top_n=8)
    print(f"Ranked {len(ranked)} jobs:")
    for i, j in enumerate(ranked, 1):
        print(f"  {i}. [{j['relevance_score']}%] {j['title']} @ {j['company']} ({j['source']})")
        print(f"     URL: {j['url']}")
        print(f"     Reason: {j['reason']}")
    return ranked


def test_full_pipeline():
    separator("TEST 4: Full Pipeline (run_job_agent)")
    print("This runs all 3 steps end-to-end...")
    results = run_job_agent(
        job_role=SAMPLE_ROLE,
        job_description=SAMPLE_DESCRIPTION,
        user_skills=SAMPLE_SKILLS,
        max_results=8,
    )

    separator("FINAL RESULTS")
    print(f"Total jobs returned: {len(results)}\n")
    for i, job in enumerate(results, 1):
        print(f"{i}. [{job['relevance_score']}%] {job['title']}")
        print(f"   Company:  {job['company']}")
        print(f"   Location: {job['location']}")
        print(f"   Source:   {job['source']}")
        print(f"   URL:      {job['url']}")
        print(f"   Posted:   {job.get('posted_date','N/A')}")
        print(f"   Reason:   {job.get('reason','')}")
        print()

    # Save results to JSON for inspection
    with open("test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Results also saved to test_results.json")


if __name__ == "__main__":
    print("Job Scraper — Local Test")
    print("========================")
    print("Running on your LOCAL MACHINE, hitting real job portals.\n")

    # Run all tests in sequence
    queries = test_query_builder()
    raw_jobs = test_individual_scrapers(queries)

    if raw_jobs:
        test_ranker(raw_jobs)
    else:
        print("\n[!] No jobs scraped — check your internet connection.")
        print("    LinkedIn/Rozee/Indeed may block the request from this IP.")
        print("    Try running with a VPN or from a different network.")

    test_full_pipeline()
