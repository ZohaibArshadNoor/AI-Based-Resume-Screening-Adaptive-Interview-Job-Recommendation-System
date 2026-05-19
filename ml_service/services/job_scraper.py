"""
job_scraper.py
Real-time job scraper with direct apply links.
"""

import requests
import time
import random
import re

from bs4 import BeautifulSoup
from typing import List, Dict


# ─────────────────────────────────────────────────────────────
# HEADERS
# ─────────────────────────────────────────────────────────────
HEADERS_LIST = [
    {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": (
            "text/html,application/xhtml+xml,"
            "application/xml;q=0.9,*/*;q=0.8"
        ),
        "Referer": "https://www.google.com/",
    },
    {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) "
            "Version/17.3 Safari/605.1.15"
        ),
        "Accept-Language": "en-GB,en;q=0.9",
    },
]


def _headers():
    return random.choice(HEADERS_LIST)


def _delay():
    time.sleep(random.uniform(1.5, 3.0))


def _clean_url(url: str, base: str = "") -> str:

    if not url:
        return ""

    url = url.strip()

    if url.startswith("http"):
        return url

    if url.startswith("//"):
        return "https:" + url

    if url.startswith("/"):
        return base.rstrip("/") + url

    return base + "/" + url


# ─────────────────────────────────────────────────────────────
# ROZEE SCRAPER
# ─────────────────────────────────────────────────────────────
def scrape_rozee(
    query: str,
    max_results: int = 10
) -> List[Dict]:

    jobs = []

    try:

        q = query.replace(" ", "+")

        url = f"https://www.rozee.pk/job/jsearch/q/{q}"

        response = requests.get(
            url,
            headers=_headers(),
            timeout=15
        )

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(
            response.text,
            "lxml"
        )

        cards = (
            soup.select("div.job-item")
            or soup.select("div.jlisting")
            or soup.select("article.job-listing")
        )

        for card in cards[:max_results]:

            try:

                title_el = (
                    card.select_one("h2 a")
                    or card.select_one("h3 a")
                    or card.select_one("a[href*='/job/']")
                )

                if not title_el:
                    continue

                title = title_el.get_text(strip=True)

                raw_link = title_el.get("href", "")

                direct_link = _clean_url(
                    raw_link,
                    "https://www.rozee.pk"
                )

                company_el = (
                    card.select_one(".company-name")
                    or card.select_one(".cname")
                )

                location_el = (
                    card.select_one(".location")
                    or card.select_one(".jloc")
                )

                snippet_el = (
                    card.select_one("p")
                )

                jobs.append({
                    "title": title,
                    "company": (
                        company_el.get_text(strip=True)
                        if company_el else "Unknown"
                    ),
                    "location": (
                        location_el.get_text(strip=True)
                        if location_el else "Pakistan"
                    ),
                    "description_snippet": (
                        snippet_el.get_text(strip=True)[:250]
                        if snippet_el else ""
                    ),
                    "url": direct_link,
                    "source": "Rozee.pk",
                })

            except Exception:
                continue

        _delay()

    except Exception as error:
        print(f"[Rozee Error] {error}")

    return jobs


# ─────────────────────────────────────────────────────────────
# INDEED SCRAPER
# ─────────────────────────────────────────────────────────────
def scrape_indeed(
    query: str,
    location: str = "",
    max_results: int = 10
) -> List[Dict]:

    jobs = []

    try:

        q = query.replace(" ", "+")

        loc = location.replace(" ", "+")

        url = (
            f"https://www.indeed.com/jobs?"
            f"q={q}&l={loc}"
        )

        response = requests.get(
            url,
            headers=_headers(),
            timeout=15
        )

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(
            response.text,
            "lxml"
        )

        cards = (
            soup.select("div[data-jk]")
            or soup.select("div.tapItem")
        )

        for card in cards[:max_results]:

            try:

                title_el = (
                    card.select_one("h2 span")
                    or card.select_one("h2 a")
                )

                company_el = (
                    card.select_one(
                        "[data-testid='company-name']"
                    )
                    or card.select_one("span.companyName")
                )

                location_el = (
                    card.select_one(
                        "[data-testid='text-location']"
                    )
                    or card.select_one("div.companyLocation")
                )

                snippet_el = (
                    card.select_one(
                        "[data-testid='job-snippet']"
                    )
                )

                job_key = card.get("data-jk", "")

                direct_link = (
                    f"https://www.indeed.com/viewjob?jk={job_key}"
                )

                jobs.append({
                    "title": (
                        title_el.get_text(strip=True)
                        if title_el else ""
                    ),
                    "company": (
                        company_el.get_text(strip=True)
                        if company_el else "Unknown"
                    ),
                    "location": (
                        location_el.get_text(strip=True)
                        if location_el else location
                    ),
                    "description_snippet": (
                        snippet_el.get_text(strip=True)[:250]
                        if snippet_el else ""
                    ),
                    "url": direct_link,
                    "source": "Indeed",
                })

            except Exception:
                continue

        _delay()

    except Exception as error:
        print(f"[Indeed Error] {error}")

    return jobs


# ─────────────────────────────────────────────────────────────
# LINKEDIN SCRAPER
# ─────────────────────────────────────────────────────────────
def scrape_linkedin(
    query: str,
    max_results: int = 10
) -> List[Dict]:

    jobs = []

    try:

        q = query.replace(" ", "%20")

        url = (
            "https://www.linkedin.com/jobs/search/"
            f"?keywords={q}"
        )

        response = requests.get(
            url,
            headers=_headers(),
            timeout=15
        )

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(
            response.text,
            "lxml"
        )

        cards = (
            soup.select("div.base-card")
            or soup.select(
                "li.jobs-search-results__list-item"
            )
        )

        for card in cards[:max_results]:

            try:

                link_el = (
                    card.select_one(
                        "a.base-card__full-link"
                    )
                )

                if not link_el:
                    continue

                title_el = (
                    card.select_one(
                        "h3.base-search-card__title"
                    )
                )

                company_el = (
                    card.select_one(
                        "h4.base-search-card__subtitle"
                    )
                )

                location_el = (
                    card.select_one(
                        "span.job-search-card__location"
                    )
                )

                direct_link = (
                    link_el.get("href", "")
                    .split("?")[0]
                )

                jobs.append({
                    "title": (
                        title_el.get_text(strip=True)
                        if title_el else ""
                    ),
                    "company": (
                        company_el.get_text(strip=True)
                        if company_el else "Unknown"
                    ),
                    "location": (
                        location_el.get_text(strip=True)
                        if location_el else "N/A"
                    ),
                    "description_snippet": "",
                    "url": direct_link,
                    "source": "LinkedIn",
                })

            except Exception:
                continue

        _delay()

    except Exception as error:
        print(f"[LinkedIn Error] {error}")

    return jobs


# ─────────────────────────────────────────────────────────────
# REMOTEOK API
# ─────────────────────────────────────────────────────────────
def scrape_remoteok(
    query: str,
    max_results: int = 10
) -> List[Dict]:

    jobs = []

    try:

        response = requests.get(
            "https://remoteok.com/api",
            headers=_headers(),
            timeout=15
        )

        if response.status_code != 200:
            return []

        data = response.json()

        listings = [
            job for job in data
            if isinstance(job, dict)
            and job.get("position")
        ]

        for job in listings[:max_results]:

            jobs.append({
                "title": job.get(
                    "position",
                    "Unknown"
                ),
                "company": job.get(
                    "company",
                    "Unknown"
                ),
                "location": job.get(
                    "location",
                    "Remote"
                ),
                "description_snippet": re.sub(
                    r"<[^>]+>",
                    "",
                    job.get("description", "")
                )[:250],
                "url": (
                    job.get("apply_url")
                    or job.get("url")
                    or "https://remoteok.com"
                ),
                "source": "RemoteOK",
            })

        _delay()

    except Exception as error:
        print(f"[RemoteOK Error] {error}")

    return jobs


# ─────────────────────────────────────────────────────────────
# MOCK DATA
# ─────────────────────────────────────────────────────────────
MOCK_JOBS = [
    {
        "title": "Python Developer",
        "company": "Systems Ltd",
        "location": "Karachi",
        "description_snippet": (
            "Backend development with FastAPI"
        ),
        "url": "https://www.rozee.pk",
        "source": "Rozee.pk",
    },
    {
        "title": "Machine Learning Engineer",
        "company": "Arbisoft",
        "location": "Lahore",
        "description_snippet": (
            "TensorFlow and NLP pipelines"
        ),
        "url": "https://remoteok.com",
        "source": "RemoteOK",
    },
]


# ─────────────────────────────────────────────────────────────
# MAIN SCRAPER
# ─────────────────────────────────────────────────────────────
def scrape_all(
    query: str,
    use_mock: bool = False,
    max_per_source: int = 5
) -> List[Dict]:

    if use_mock:
        return MOCK_JOBS

    results = []

    results.extend(
        scrape_remoteok(
            query,
            max_results=max_per_source
        )
    )

    results.extend(
        scrape_rozee(
            query,
            max_results=max_per_source
        )
    )

    results.extend(
        scrape_indeed(
            query,
            max_results=max_per_source
        )
    )

    results.extend(
        scrape_linkedin(
            query,
            max_results=max_per_source
        )
    )

    # Remove duplicates
    seen = set()

    unique_jobs = []

    for job in results:

        key = (
            job.get("title", "").lower(),
            job.get("company", "").lower()
        )

        if key not in seen:

            seen.add(key)

            unique_jobs.append(job)

    return unique_jobs