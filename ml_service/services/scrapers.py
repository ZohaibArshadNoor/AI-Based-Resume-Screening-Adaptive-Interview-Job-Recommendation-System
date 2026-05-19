"""
scrapers.py
-----------
Three independent scrapers — LinkedIn, Rozee.pk, Indeed.
Each returns a list of job dicts with REAL direct URLs to the job posting.

Technique used per portal:
  LinkedIn → Hidden guest API (no login required):
             /jobs-guest/jobs/api/seeMoreJobPostings/search
             Returns HTML fragments; each card has a real linkedin.com/jobs/view/... link

  Rozee.pk → Public search page with requests + BeautifulSoup
             Each card links directly to /job/<slug>/<id>

  Indeed   → Public search page; job IDs extracted and canonical URLs built:
             https://www.indeed.com/viewjob?jk=<job_id>

All scrapers:
  - Rotate User-Agent headers
  - Add random delays between requests
  - Return [] on any error (never crash the parent process)
  - Deduplicate by (title, company) before returning
"""

import re
import time
import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlencode, quote_plus


# ── HEADERS ──────────────────────────────────────────────────────────────────

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
]


def _headers(referer: str = "") -> dict:
    h = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
    }
    if referer:
        h["Referer"] = referer
    return h


def _delay(min_s: float = 1.5, max_s: float = 3.5):
    time.sleep(random.uniform(min_s, max_s))


def _get(url: str, referer: str = "", timeout: int = 12) -> requests.Response | None:
    try:
        resp = requests.get(url, headers=_headers(referer), timeout=timeout)
        if resp.status_code == 200:
            return resp
        print(f"[Scraper] HTTP {resp.status_code} for {url[:80]}")
        return None
    except Exception as e:
        print(f"[Scraper] Request error: {e}")
        return None


# ── LINKEDIN ─────────────────────────────────────────────────────────────────

def scrape_linkedin(query: str, max_results: int = 8) -> list[dict]:
    """
    Uses LinkedIn's hidden guest jobs API — no login required.
    Returns jobs with real linkedin.com/jobs/view/... URLs.

    The API paginates in steps of 25. We fetch page 0 (jobs 0–24).
    Each HTML fragment returned by the API contains <li> elements
    with class='base-card' holding title, company, location, and a direct URL.

    Supports &f_TPR=r86400 filter = jobs posted in last 24 hours (fresh daily).
    """
    jobs = []
    try:
        params = {
            "keywords": query,
            "location": "Pakistan",
            "start": 0,
            "f_TPR": "r604800",   # past 7 days — change to r86400 for last 24h only
            "sortBy": "DD",       # sort by date descending (newest first)
        }
        base_url = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
        url = f"{base_url}?{urlencode(params)}"

        resp = _get(url, referer="https://www.linkedin.com/jobs/")
        if not resp:
            return []

        soup = BeautifulSoup(resp.text, "lxml")
        cards = soup.find_all("div", class_="base-card")

        if not cards:
            # Try alternate selector (LinkedIn occasionally changes classes)
            cards = soup.find_all("li")

        for card in cards[:max_results]:
            title_el = card.find("h3", class_="base-search-card__title")
            company_el = card.find("h4", class_="base-search-card__subtitle")
            location_el = card.find("span", class_="job-search-card__location")
            link_el = card.find("a", class_="base-card__full-link")
            date_el = card.find("time")

            title = title_el.get_text(strip=True) if title_el else None
            company = company_el.get_text(strip=True) if company_el else None
            location = location_el.get_text(strip=True) if location_el else "Pakistan"
            # LinkedIn links look like: https://www.linkedin.com/jobs/view/job-title-at-company-1234567890?...
            # We strip tracking params and keep the clean canonical URL
            raw_link = link_el.get("href", "") if link_el else ""
            link = raw_link.split("?")[0] if raw_link else ""
            posted = date_el.get("datetime", "") if date_el else ""

            if title and link:
                jobs.append({
                    "title": title,
                    "company": company or "N/A",
                    "location": location,
                    "url": link,
                    "source": "LinkedIn",
                    "posted_date": posted,
                    "description_snippet": "",
                })

        _delay()
        print(f"[LinkedIn] Found {len(jobs)} jobs for query: {query!r}")

    except Exception as e:
        print(f"[LinkedIn] Scraper error: {e}")

    return jobs


# ── ROZEE.PK ─────────────────────────────────────────────────────────────────

def scrape_rozee(query: str, max_results: int = 8) -> list[dict]:
    """
    Scrapes Rozee.pk public job search.
    URL format: https://www.rozee.pk/job/jsearch/q/<query>/fpn/0
    Each job card links to: https://www.rozee.pk/job/<slug>/<id>

    Rozee.pk is Pakistan's largest job board — very relevant for your users.
    Jobs here are posted daily and page refreshes with new listings every 24h.
    """
    jobs = []
    try:
        # Rozee uses URL segments, not query params
        encoded_query = quote_plus(query).replace("+", "%20")
        url = f"https://www.rozee.pk/job/jsearch/q/{encoded_query}/fpn/0"

        resp = _get(url, referer="https://www.rozee.pk/")
        if not resp:
            return []

        soup = BeautifulSoup(resp.text, "lxml")

        # Rozee.pk job cards sit inside .fjlisting or .job-listing containers
        # Primary selector — works as of 2025
        cards = soup.select("div.fjlisting div.job")
        if not cards:
            cards = soup.select(".job-listing-container .job")
        if not cards:
            # Broader fallback
            cards = soup.select("div[class*='job'][data-id]")

        for card in cards[:max_results]:
            title_el = card.select_one("h3 a, h2 a, .jtitle a")
            company_el = card.select_one(".cname, .company-name, span.comp")
            location_el = card.select_one(".loc, .location, span[class*='loc']")
            snippet_el = card.select_one(".jdesc, .job-desc, p.desc")
            date_el = card.select_one(".date, time, .posted")

            title = title_el.get_text(strip=True) if title_el else None
            raw_href = title_el.get("href", "") if title_el else ""
            # Ensure absolute URL
            if raw_href and not raw_href.startswith("http"):
                link = f"https://www.rozee.pk{raw_href}"
            else:
                link = raw_href

            company = company_el.get_text(strip=True) if company_el else "N/A"
            location = location_el.get_text(strip=True) if location_el else "Pakistan"
            snippet = snippet_el.get_text(strip=True)[:200] if snippet_el else ""
            posted = date_el.get_text(strip=True) if date_el else ""

            if title and link:
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "url": link,
                    "source": "Rozee.pk",
                    "posted_date": posted,
                    "description_snippet": snippet,
                })

        _delay()
        print(f"[Rozee] Found {len(jobs)} jobs for query: {query!r}")

    except Exception as e:
        print(f"[Rozee] Scraper error: {e}")

    return jobs


# ── INDEED ───────────────────────────────────────────────────────────────────

def scrape_indeed(query: str, location: str = "Pakistan", max_results: int = 8) -> list[dict]:
    """
    Scrapes Indeed job search results.
    Indeed encodes each job as a data-jk attribute (job key).
    We build the canonical URL: https://www.indeed.com/viewjob?jk=<job_key>

    Filter: fromage=7 = jobs posted in the last 7 days (fresh results).
    Change to fromage=1 for last 24 hours only.
    """
    jobs = []
    try:
        params = {
            "q": query,
            "l": location,
            "sort": "date",       # newest first
            "fromage": "7",       # posted in last 7 days
            "limit": "15",
        }
        url = f"https://www.indeed.com/jobs?{urlencode(params)}"

        resp = _get(url, referer="https://www.indeed.com/")
        if not resp:
            return []

        soup = BeautifulSoup(resp.text, "lxml")

        # Primary: job cards with data-jk attribute
        cards = soup.select("div[data-jk]")
        if not cards:
            cards = soup.select("div.job_seen_beacon")
        if not cards:
            cards = soup.select("div.tapItem")

        for card in cards[:max_results]:
            job_key = card.get("data-jk", "")
            title_el = card.select_one("h2.jobTitle span[title], h2.jobTitle a span, h2 a span")
            company_el = card.select_one("[data-testid='company-name'], span.companyName, .companyInfo span")
            location_el = card.select_one("[data-testid='text-location'], div.companyLocation, span.companyLocation")
            snippet_el = card.select_one("[data-testid='job-snippet'], div.job-snippet, ul.jobCardShelfContainer")
            date_el = card.select_one("span.date, [data-testid='myJobsStateDate']")

            title = title_el.get_text(strip=True) if title_el else None
            company = company_el.get_text(strip=True) if company_el else "N/A"
            location = location_el.get_text(strip=True) if location_el else location
            snippet = snippet_el.get_text(strip=True)[:200] if snippet_el else ""
            posted = date_el.get_text(strip=True) if date_el else ""

            # Build the canonical direct URL using job key
            if job_key:
                link = f"https://www.indeed.com/viewjob?jk={job_key}"
            else:
                # Try anchor href fallback
                anchor = card.select_one("h2 a[href]")
                raw = anchor.get("href", "") if anchor else ""
                link = f"https://www.indeed.com{raw}" if raw.startswith("/") else raw

            if title and link:
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "url": link,
                    "source": "Indeed",
                    "posted_date": posted,
                    "description_snippet": snippet,
                })

        _delay()
        print(f"[Indeed] Found {len(jobs)} jobs for query: {query!r}")

    except Exception as e:
        print(f"[Indeed] Scraper error: {e}")

    return jobs


# ── AGGREGATE ────────────────────────────────────────────────────────────────

def scrape_all_portals(
    queries: dict,
    max_per_source: int = 8,
) -> list[dict]:
    """
    Runs all three scrapers using the portal-specific queries.

    Args:
        queries: dict with keys 'linkedin', 'rozee', 'indeed'
                 (output of query_builder.build_search_queries)
        max_per_source: max jobs per portal

    Returns:
        Combined deduplicated list of job dicts, all with real URLs.
    """
    all_jobs = []

    # Rozee first — most reliable for Pakistan-based users
    if queries.get("rozee"):
        rozee_jobs = scrape_rozee(queries["rozee"], max_results=max_per_source)
        all_jobs.extend(rozee_jobs)

    _delay(1, 2)

    # LinkedIn guest API — real-time, no login
    if queries.get("linkedin"):
        li_jobs = scrape_linkedin(queries["linkedin"], max_results=max_per_source)
        all_jobs.extend(li_jobs)

    _delay(1, 2)

    # Indeed
    if queries.get("indeed"):
        indeed_jobs = scrape_indeed(queries["indeed"], max_results=max_per_source)
        all_jobs.extend(indeed_jobs)

    # Deduplicate by (title.lower, company.lower)
    seen = set()
    unique = []
    for job in all_jobs:
        key = (job["title"].lower().strip(), job["company"].lower().strip())
        if key not in seen and job.get("url"):
            seen.add(key)
            unique.append(job)

    print(f"[Scraper] Total unique jobs collected: {len(unique)}")
    return unique
