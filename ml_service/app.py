from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import joblib

from pathlib import Path

from services.resume_parser import (
    extract_text,
    extract_email,
    extract_phone,
    extract_name
)

from services.skill_extractor import SkillExtractor
from services.skill_matcher import SkillMatcher
from services.job_agent import run_job_agent          # ← UNCOMMENTED + FIXED PATH

from pydantic import BaseModel

import json
from services.groq_agent import chat_with_agent, generate_ats_score

skill_extractor = SkillExtractor()
skill_matcher = SkillMatcher()

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "saved" / "resume_classifier.pkl"

VECTORIZER_PATH = BASE_DIR / "models" / "saved" / "tfidf_vectorizer.pkl"


classifier_model = joblib.load(MODEL_PATH)

tfidf_vectorizer = joblib.load(VECTORIZER_PATH)


app = FastAPI(
    title="AI Resume Screening ML Service",
    description="ML microservice for resume parsing, classification, and job recommendations",
    version="2.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():

    return {
        "message": "AI Resume Screening ML Service Running"
    }


@app.get("/health")
async def health():

    return {
        "status": "healthy"
    }


def save_file(file: UploadFile):

    temp_dir = "temp"

    os.makedirs(temp_dir, exist_ok=True)

    temp_path = os.path.join(
        temp_dir,
        file.filename
    )

    with open(temp_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return temp_path


@app.post("/extract-skills")
async def extract_skills_api(
    file: UploadFile = File(...)
):

    try:

        temp_path = save_file(file)

        extracted_text = extract_text(temp_path)

        os.remove(temp_path)

        email = extract_email(extracted_text)

        phone = extract_phone(extracted_text)

        name = extract_name(extracted_text)

        skills = skill_extractor.extract_skills(
            extracted_text
        )

        return {

            "file_name": file.filename,

            "email": email,

            "phone": phone,

            "name": name,

            "skills": skills,
            
            "extracted_text": extracted_text
        }

    except Exception as error:

        return {
            "error": str(error)
        }

        
@app.post("/match-job")
async def match_job(
    job_description: str,
    file: UploadFile = File(...)
):

    try:

        temp_path = save_file(file)

        extracted_text = extract_text(temp_path)

        os.remove(temp_path)

        match_percentage = skill_matcher.calculate_match(
            extracted_text,
            job_description
        )

        extracted_skills = skill_extractor.extract_skills(
            extracted_text
        )

        return {
            "file_name": file.filename,
            "match_percentage": match_percentage,
            "skills": extracted_skills
        }

    except Exception as error:

        return {
            "error": str(error)
        }
        
@app.post("/predict-role")
async def predict_role(

    role: str = Form(...),

    file: UploadFile = File(...)

):

    try:

        temp_path = save_file(file)

        extracted_text = extract_text(temp_path)

        os.remove(temp_path)

        transformed_text = tfidf_vectorizer.transform(
            [extracted_text]
        )

        prediction = classifier_model.predict(
            transformed_text
        )[0]

        probabilities = classifier_model.predict_proba(
            transformed_text
        )[0]

        confidence = float(max(probabilities))

        role_match = (
            role.lower().strip()
            ==
            prediction.lower().strip()
        )

        return {

            "file_name": file.filename,

            "selected_role": role,

            "predicted_role": prediction,

            "match": role_match,

            "confidence": round(
                confidence * 100,
                2
            )
        }

    except Exception as error:

        return {
            "error": str(error)
        }        

        
# ── Agent: Chat Turn ──────────────────────────────────────────────────────────
@app.post("/agent/chat")
async def agent_chat(
    file:            UploadFile = File(None),
    job_description: str = Form(...),
    candidate_name:  str = Form("Candidate"),
    role:            str = Form(""),
    messages_json:   str = Form("[]"),
    resume_text:     str = Form(""),
):
    try:
        messages              = json.loads(messages_json)
        extracted_resume_text = resume_text
        resume_skills         = []

        if file and file.filename:
            path                  = save_file(file)
            extracted_resume_text = extract_text(path)
            os.remove(path)
            resume_skills         = skill_extractor.extract_skills(extracted_resume_text)
        elif resume_text:
            resume_skills = skill_extractor.extract_skills(resume_text)

        result = chat_with_agent(
            messages        = messages,
            resume_text     = extracted_resume_text,
            job_description = job_description,
            candidate_name  = candidate_name,
            role            = role,
            resume_skills   = resume_skills,
        )

        return {
            **result,
            "resume_text":   extracted_resume_text,
            "resume_skills": resume_skills,
        }

    except Exception as e:
        return {"error": str(e), "reply": "Technical issue. Please try again.", "is_complete": False}


# ── Agent: ATS Score ──────────────────────────────────────────────────────────
@app.post("/agent/ats-score")
async def agent_ats_score(
    conversation_json:  str = Form("[]"),
    resume_text:        str = Form(""),
    job_description:    str = Form(""),
    resume_skills_json: str = Form("[]"),
    role:               str = Form(""),
):
    try:
        conversation  = json.loads(conversation_json)
        resume_skills = json.loads(resume_skills_json)

        if not conversation:
            return {"error": "No conversation found", "ats_score": 0}

        result = generate_ats_score(
            conversation    = conversation,
            resume_text     = resume_text,
            job_description = job_description,
            resume_skills   = resume_skills,
            role            = role,
        )
        return result

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


# ──────────────────────────────────────────────────────────────────────────────
# ─────────────────────────── Agent: Job Search ────────────────────────────────
# ──────────────────────────────────────────────────────────────────────────────

class JobSearchRequest(BaseModel):
    job_role: str
    job_description: str
    user_skills: list[str] = []
    max_results: int = 8


@app.post("/find-jobs")
async def find_jobs(req: JobSearchRequest):
    """
    Job Recommendation Agent.

    Accepts:
      - job_role:        The role the candidate is applying for
      - job_description: Full text of the job ad they are targeting
      - user_skills:     Skills extracted from their resume (optional)
      - max_results:     How many ranked jobs to return (default 8, max 20)

    Returns:
      Ranked list of real live job listings from LinkedIn, Rozee.pk, and Indeed.
      Every job includes a direct URL to the actual job posting.
    """
    try:
        jobs = run_job_agent(
            job_role=req.job_role,
            job_description=req.job_description,
            user_skills=req.user_skills,
            max_results=req.max_results,
        )

        if not jobs:
            return {
                "status": "success",
                "count": 0,
                "jobs": [],
                "message": "No matching jobs found. Try a broader role title."
            }

        return {
            "status": "success",
            "count": len(jobs),
            "jobs": jobs,
            "message": f"Found {len(jobs)} relevant jobs from LinkedIn, Rozee.pk, and Indeed."
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "jobs": []
        }