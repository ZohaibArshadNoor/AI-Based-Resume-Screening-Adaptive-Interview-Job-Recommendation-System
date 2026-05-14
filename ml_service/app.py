from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(



    title="AI Resume Screening ML Service",

    description="ML microservice for resume parsing, interview evaluation, and job recommendation",

    version="1.0.0"

)



app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)



@app.get("/health")

async def health_check():

    return {

        "status": "ML service running"

    }



@app.get("/")

async def root():

    return {

        "message": "Welcome to AI Resume Screening ML Service"

    }