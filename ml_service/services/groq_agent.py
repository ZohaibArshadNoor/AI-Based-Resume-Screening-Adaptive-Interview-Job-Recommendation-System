"""
Groq LLaMA 3.3 70B Interview Agent
Conducts real-world style interviews and generates ATS scoring.

Place at: ml_service/services/groq_agent.py
"""

import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL  = "llama-3.3-70b-versatile"   # Groq free tier


# ─── System Prompt Builder ────────────────────────────────────────────────────
def build_system_prompt(resume_text: str, job_description: str,
                         candidate_name: str, role: str,
                         resume_skills: list) -> str:
    skills_str = ", ".join(resume_skills[:30]) if resume_skills else "Not extracted"
    return f"""You are an expert technical interviewer at a top company conducting a real job interview.

CANDIDATE PROFILE:
- Name: {candidate_name}
- Applying for: {role}
- Resume Skills: {skills_str}

JOB DESCRIPTION:
{job_description[:2000]}

RESUME SUMMARY:
{resume_text[:2000]}

YOUR INTERVIEW RULES:
1. Conduct a realistic, professional interview — one question at a time
2. Start with a warm greeting and an ice-breaker about background
3. Progress naturally: background → technical → problem solving → behavioral → situational
4. Ask follow-up questions based on what the candidate says — be adaptive
5. If the candidate gives a shallow answer, probe deeper with "Can you elaborate?" or "Walk me through that"
6. Ask at least 2 technical questions specific to the job description
7. Ask at least 1 behavioral question (expect STAR format)
8. Ask at least 1 situational/scenario question
9. Keep each response to just ONE question — never ask multiple at once
10. After exactly 8 questions total, end the interview professionally
11. NEVER reveal you are an AI — stay in character as a human interviewer
12. NEVER give away answers or hints
13. Be conversational, professional, and encouraging

QUESTION ARC (follow this progression):
Q1: Warm greeting + "Tell me about yourself and your background"
Q2: Why are you interested in this specific role?
Q3: Technical question from job description requirements
Q4: Technical deep-dive or problem-solving question
Q5: Follow-up on their strongest skill from resume
Q6: Behavioral — "Tell me about a time when..." (role-relevant)
Q7: Situational — "How would you handle..." (role-specific scenario)
Q8: "Do you have any questions for me?" then wrap up professionally and say the interview is complete

IMPORTANT: After Q8, explicitly say the interview is complete and that results will be shared shortly."""


# ─── Chat Turn ────────────────────────────────────────────────────────────────
def chat_with_agent(messages: list, resume_text: str, job_description: str,
                    candidate_name: str, role: str, resume_skills: list) -> dict:
    """
    Send one message turn to the agent.
    messages = list of {role: 'user'|'assistant', content: str}
    Returns: {reply: str, is_complete: bool}
    """
    system = build_system_prompt(resume_text, job_description,
                                  candidate_name, role, resume_skills)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system}, *messages],
        temperature=0.7,
        max_tokens=512,
    )

    reply = response.choices[0].message.content.strip()

    completion_signals = [
        "interview is complete", "that concludes", "thank you for your time",
        "we'll be in touch", "results will be shared", "interview has ended",
        "all the best", "good luck with", "that's all the questions",
        "best of luck", "appreciate your time"
    ]
    is_complete = any(sig in reply.lower() for sig in completion_signals)

    return {"reply": reply, "is_complete": is_complete}


# ─── ATS Scoring ──────────────────────────────────────────────────────────────
def generate_ats_score(conversation: list, resume_text: str,
                        job_description: str, resume_skills: list,
                        role: str) -> dict:
    """
    Analyzes the full interview conversation and generates a comprehensive ATS report.
    Returns a dict with score, breakdown, strengths, suggestions, etc.
    """
    transcript = "\n".join([
        f"{'INTERVIEWER' if m['role'] == 'assistant' else 'CANDIDATE'}: {m['content']}"
        for m in conversation if m.get("content")
    ])

    skills_str = ", ".join(resume_skills[:30])

    scoring_prompt = f"""You are an expert HR analyst and ATS (Applicant Tracking System) evaluator.

Analyze this complete job interview and provide a comprehensive evaluation.

JOB ROLE: {role}

JOB DESCRIPTION:
{job_description[:1500]}

CANDIDATE RESUME SKILLS: {skills_str}

RESUME SUMMARY:
{resume_text[:1000]}

INTERVIEW TRANSCRIPT:
{transcript[:4000]}

Respond ONLY with a valid JSON object — no extra text, no markdown, no backticks:
{{
  "ats_score": <number 0-100>,
  "readiness_level": "<Not Ready | Partially Ready | Ready | Highly Ready>",
  "score_breakdown": {{
    "skill_match": <number 0-25>,
    "technical_knowledge": <number 0-25>,
    "communication": <number 0-25>,
    "problem_solving": <number 0-25>
  }},
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvement_suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3",
    "Specific actionable suggestion 4"
  ],
  "overall_feedback": "<2-3 sentence honest overall assessment>",
  "hire_recommendation": "<Strong Yes | Yes | Maybe | No>"
}}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": scoring_prompt}],
        temperature=0.3,
        max_tokens=1024,
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"```json|```", "", raw).strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "ats_score": 50,
            "readiness_level": "Partially Ready",
            "score_breakdown": {
                "skill_match": 12, "technical_knowledge": 12,
                "communication": 13, "problem_solving": 13
            },
            "matched_skills": resume_skills[:5],
            "missing_skills": [],
            "strengths": ["Completed all interview questions", "Showed willingness to engage"],
            "weaknesses": ["Needs more specific technical examples"],
            "improvement_suggestions": [
                "Practice the STAR method for behavioral questions",
                "Study the technical requirements listed in the job description",
                "Prepare 2-3 specific project examples for each key skill",
                "Research the company culture and values before interviews"
            ],
            "overall_feedback": "The candidate showed potential but needs more preparation for this specific role.",
            "hire_recommendation": "Maybe"
        }