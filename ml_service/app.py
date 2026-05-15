from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import joblib

from pathlib import Path

from ml_service.services.resume_parser import (
    extract_text,
    extract_email,
    extract_phone,
    extract_name
)

from ml_service.services.skill_extractor import SkillExtractor

from services.skill_matcher import SkillMatcher

skill_extractor = SkillExtractor()
skill_matcher = SkillMatcher()

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "saved" / "resume_classifier.pkl"

VECTORIZER_PATH = BASE_DIR / "models" / "saved" / "tfidf_vectorizer.pkl"


classifier_model = joblib.load(MODEL_PATH)

tfidf_vectorizer = joblib.load(VECTORIZER_PATH)


app = FastAPI(
    title="AI Resume Screening ML Service",
    description="ML microservice for resume parsing and classification",
    version="1.0.0"
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

            "skills": skills
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