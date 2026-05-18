import os
import json
import google.generativeai as genai
from services.job_scraper import scrape_all
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])


# ── TOOL DEFINITION ──────────────────────────────────────────────────────────
# This is the function Gemini will call as a tool
def scrape_jobs_tool(search_query: str) -> str:
    """
    Scrape job listings from the web based on a search query.
    Returns a JSON string of job listings.
    """
    jobs = scrape_all(search_query, use_mock=False)
    return json.dumps(jobs)


# Tool schema for Gemini function calling
TOOLS = [
    {
        "function_declarations": [
            {
                "name": "scrape_jobs_tool",
                "description": (
                    "Search and scrape live job listings from job portals "
                    "(LinkedIn, Indeed, Rozee.pk) using the given search query. "
                    "Call this to find real job postings matching a role or skills."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_query": {
                            "type": "string",
                            "description": "Search query to find relevant job listings. E.g. 'Python developer Karachi'",
                        }
                    },
                    "required": ["search_query"],
                },
            }
        ]
    }
]

# Map tool name to actual Python function
TOOL_FUNCTIONS = {
    "scrape_jobs_tool": scrape_jobs_tool,
}


# ── MAIN AGENT FUNCTION ───────────────────────────────────────────────────────
def run_job_agent(
    job_role: str,
    job_description: str,
    user_skills: list[str] | None = None,
    max_results: int = 6,
    use_mock: bool = False,
) -> list[dict]:
    """
    Run the Gemini agent to find jobs matching the given role and description.

    Args:
        job_role: e.g. "Software Engineer"
        job_description: the job description the user is applying for / interested in
        user_skills: optional list of user's skills from resume
        max_results: how many jobs to return
        use_mock: if True, skips real scraping (for demo / testing)

    Returns:
        List of ranked job dicts with keys:
        title, company, location, url, source, description_snippet, relevance_score, reason
    """

    # If mock mode, bypass Gemini and return filtered mock data
    if use_mock:
        from services.job_scraper import MOCK_JOBS
        return _format_mock_results(MOCK_JOBS, max_results)

    skills_text = ", ".join(user_skills) if user_skills else "not specified"

    # System prompt — gives Gemini its identity and task
    system_prompt = f"""
You are a job recommendation agent. Your job is to find the most relevant job listings
for a candidate based on their target job role and a reference job description.

Candidate details:
- Target role: {job_role}
- Known skills: {skills_text}

Your workflow:
1. Analyze the job description to extract 3-5 core skills and responsibilities.
2. Generate 2-3 smart search queries targeting different aspects of the role.
3. Call the scrape_jobs_tool for each query to collect listings.
4. Evaluate ALL collected listings against the reference job description.
5. Return ONLY the top {max_results} most relevant listings as a JSON array.

Each result object must have these exact keys:
- title: job title string
- company: company name string
- location: location string
- url: direct link to job posting
- source: which portal (LinkedIn / Indeed / Rozee.pk)
- description_snippet: short description of the role
- relevance_score: integer 0-100 (how well it matches the reference description)
- reason: 1 sentence explaining why this job is relevant

Return ONLY valid JSON. No markdown, no code blocks, no extra text.
Output format: [{{"title": "...", "company": "...", ...}}, ...]
"""

    user_message = f"""
Reference Job Description:
\"\"\"
{job_description}
\"\"\"

Find the top {max_results} most similar jobs available online right now.
"""

    # Initialize Gemini model with function calling
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        tools=TOOLS,
        system_instruction=system_prompt,
    )

    chat = model.start_chat()
    response = chat.send_message(user_message)

    # Agentic loop — keep calling tools until Gemini finishes
    max_tool_rounds = 5
    rounds = 0

    while rounds < max_tool_rounds:
        rounds += 1
        tool_calls_made = False

        for candidate in response.candidates:
            for part in candidate.content.parts:
                if hasattr(part, "function_call") and part.function_call:
                    tool_calls_made = True
                    fn_name = part.function_call.name
                    fn_args = dict(part.function_call.args)

                    print(f"[Agent] Calling tool: {fn_name}({fn_args})")

                    if fn_name in TOOL_FUNCTIONS:
                        result = TOOL_FUNCTIONS[fn_name](**fn_args)
                    else:
                        result = json.dumps({"error": f"Unknown tool: {fn_name}"})

                    # Send tool result back to Gemini
                    response = chat.send_message(
                        genai.protos.Content(
                            parts=[
                                genai.protos.Part(
                                    function_response=genai.protos.FunctionResponse(
                                        name=fn_name,
                                        response={"result": result},
                                    )
                                )
                            ]
                        )
                    )

        if not tool_calls_made:
            break  # Gemini has finished — extract final answer

    # Extract the final text response (should be JSON)
    final_text = ""
    for candidate in response.candidates:
        for part in candidate.content.parts:
            if hasattr(part, "text") and part.text:
                final_text += part.text

    # Parse JSON from Gemini's response
    jobs = _parse_jobs_from_response(final_text, max_results)
    return jobs


def _parse_jobs_from_response(text: str, max_results: int) -> list[dict]:
    """Extract and validate the JSON array from Gemini's final response."""
    import re

    # Try to find a JSON array in the response
    text = text.strip()

    # Remove markdown code blocks if present
    text = re.sub(r"```(?:json)?", "", text).strip()
    text = text.rstrip("`").strip()

    try:
        data = json.loads(text)
        if isinstance(data, list):
            return _validate_jobs(data[:max_results])
        if isinstance(data, dict) and "jobs" in data:
            return _validate_jobs(data["jobs"][:max_results])
    except json.JSONDecodeError:
        # Try to extract array from mixed content
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
                return _validate_jobs(data[:max_results])
            except Exception:
                pass

    print(f"[Agent] Could not parse response as JSON. Raw text: {text[:300]}")
    return []


def _validate_jobs(jobs: list) -> list[dict]:
    """Ensure every job has required fields."""
    required = ["title", "company", "location", "url", "source",
                 "description_snippet", "relevance_score", "reason"]
    validated = []
    for job in jobs:
        if not isinstance(job, dict):
            continue
        for field in required:
            if field not in job:
                job[field] = "N/A" if field != "relevance_score" else 50
        validated.append(job)
    return validated


def _format_mock_results(mock_jobs: list, max_results: int) -> list[dict]:
    """Format mock jobs with dummy relevance scores for demo."""
    import random
    results = []
    for i, job in enumerate(mock_jobs[:max_results]):
        results.append({
            **job,
            "relevance_score": random.randint(60, 95),
            "reason": "Matches your target role and required skills.",
        })
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results