import requests
from bs4 import BeautifulSoup
import time
import random
import re

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def _random_delay():
    time.sleep(random.uniform(1.5, 3.5))


def scrape_indeed(query: str, location: str = "", max_results: int = 8) -> list[dict]:
    """Scrape Indeed for job listings matching query."""
    jobs = []
    try:
        loc = location.replace(" ", "+") if location else ""
        q = query.replace(" ", "+")
        url = f"https://www.indeed.com/jobs?q={q}&l={loc}&sort=date&limit=15"
        resp = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, "lxml")

        cards = soup.select("div.job_seen_beacon")
        if not cards:
            cards = soup.select("[data-jk]")

        for card in cards[:max_results]:
            title_el = card.select_one("h2.jobTitle span, h2 a span[title]")
            company_el = card.select_one("[data-testid='company-name'], .companyName")
            location_el = card.select_one("[data-testid='text-location'], .companyLocation")
            snippet_el = card.select_one(".job-snippet, [data-testid='job-snippet']")
            link_el = card.select_one("h2 a[href]")

            title = title_el.get_text(strip=True) if title_el else "N/A"
            company = company_el.get_text(strip=True) if company_el else "N/A"
            loc_text = location_el.get_text(strip=True) if location_el else location
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""
            job_id = card.get("data-jk", "")
            link = f"https://www.indeed.com/viewjob?jk={job_id}" if job_id else "https://indeed.com"

            if title and title != "N/A":
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc_text,
                    "description_snippet": snippet,
                    "url": link,
                    "source": "Indeed",
                })
        _random_delay()
    except Exception as e:
        print(f"[Indeed scraper error] {e}")
    return jobs


def scrape_rozee(query: str, max_results: int = 8) -> list[dict]:
    """Scrape Rozee.pk — Pakistan's primary job portal."""
    jobs = []
    try:
        q = query.replace(" ", "+")
        url = f"https://www.rozee.pk/job/jsearch/q/{q}"
        resp = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, "lxml")

        cards = soup.select(".job-list-item, .jlisting, article.job-item")
        for card in cards[:max_results]:
            title_el = card.select_one("h2 a, h3 a, .job-title a")
            company_el = card.select_one(".company-name, .cname")
            location_el = card.select_one(".location, .jloc")
            snippet_el = card.select_one(".job-description, .jdesc, p")

            title = title_el.get_text(strip=True) if title_el else "N/A"
            link = title_el.get("href", "https://rozee.pk") if title_el else "https://rozee.pk"
            if link and not link.startswith("http"):
                link = "https://www.rozee.pk" + link
            company = company_el.get_text(strip=True) if company_el else "N/A"
            loc_text = location_el.get_text(strip=True) if location_el else "Pakistan"
            snippet = snippet_el.get_text(strip=True)[:200] if snippet_el else ""

            if title and title != "N/A":
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc_text,
                    "description_snippet": snippet,
                    "url": link,
                    "source": "Rozee.pk",
                })
        _random_delay()
    except Exception as e:
        print(f"[Rozee scraper error] {e}")
    return jobs


def scrape_linkedin(query: str, max_results: int = 8) -> list[dict]:
    """Scrape LinkedIn public job search (no login required for listings page)."""
    jobs = []
    try:
        q = query.replace(" ", "%20")
        url = f"https://www.linkedin.com/jobs/search/?keywords={q}&sortBy=DD"
        resp = requests.get(url, headers=HEADERS, timeout=12)
        soup = BeautifulSoup(resp.text, "lxml")

        cards = soup.select("div.base-card, li.jobs-search-results__list-item")
        for card in cards[:max_results]:
            title_el = card.select_one("h3.base-search-card__title, span.screen-reader-text")
            company_el = card.select_one("h4.base-search-card__subtitle, a.hidden-nested-link")
            location_el = card.select_one("span.job-search-card__location")
            link_el = card.select_one("a.base-card__full-link")

            title = title_el.get_text(strip=True) if title_el else "N/A"
            company = company_el.get_text(strip=True) if company_el else "N/A"
            loc_text = location_el.get_text(strip=True) if location_el else "N/A"
            link = link_el.get("href", "https://linkedin.com/jobs") if link_el else "https://linkedin.com/jobs"

            if title and title != "N/A":
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc_text,
                    "description_snippet": "",
                    "url": link,
                    "source": "LinkedIn",
                })
        _random_delay()
    except Exception as e:
        print(f"[LinkedIn scraper error] {e}")
    return jobs


# ── MOCK FALLBACK (use if all scrapers are blocked during demo) ──────────────
MOCK_JOBS = [
    {"title": "Software Engineer – Python", "company": "Systems Ltd", "location": "Karachi, PK",
     "description_snippet": "Backend development using Python and FastAPI. REST APIs, MongoDB.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "Full Stack Developer", "company": "TechVentures PK", "location": "Lahore, PK",
     "description_snippet": "React, Node.js, MongoDB stack. Agile team. 2 years experience.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "ML Engineer", "company": "Arbisoft", "location": "Lahore, PK",
     "description_snippet": "Scikit-learn, TensorFlow, data pipelines. Strong Python skills.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "Data Scientist", "company": "Jazz", "location": "Islamabad, PK",
     "description_snippet": "Statistical modelling, Python, SQL, NLP. Telecom data.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "React Developer", "company": "Meezan Bank", "location": "Karachi, PK",
     "description_snippet": "Frontend development using React, Tailwind, RESTful APIs.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "Backend Engineer – Node.js", "company": "Folio3", "location": "Karachi, PK",
     "description_snippet": "Node.js, Express, PostgreSQL, microservices architecture.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "Junior Software Engineer", "company": "NetSol Technologies", "location": "Lahore, PK",
     "description_snippet": "Fresh graduates, Java/Python, OOP, learning environment.", "url": "https://rozee.pk", "source": "Rozee.pk"},
    {"title": "NLP Research Engineer", "company": "Turing", "location": "Remote",
     "description_snippet": "spaCy, transformers, BERT fine-tuning, text classification.", "url": "https://rozee.pk", "source": "Rozee.pk"},
]


def scrape_all(query: str, use_mock: bool = False) -> list[dict]:
    """Run all scrapers and combine results."""
    if use_mock:
        return MOCK_JOBS

    results = []
    results.extend(scrape_rozee(query, max_results=5))
    results.extend(scrape_indeed(query, max_results=5))
    results.extend(scrape_linkedin(query, max_results=5))

    # Deduplicate by title+company
    seen = set()
    unique = []
    for job in results:
        key = (job["title"].lower(), job["company"].lower())
        if key not in seen:
            seen.add(key)
            unique.append(job)

    return unique