from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.post('/parse-resume')
def parse_resume():
    return {'message': 'parse-resume placeholder'}

@app.post('/generate-questions')
def generate_questions():
    return {'message': 'generate-questions placeholder'}

@app.post('/evaluate-answer')
def evaluate_answer():
    return {'message': 'evaluate-answer placeholder'}

@app.post('/scrape-jobs')
def scrape_jobs():
    return {'message': 'scrape-jobs placeholder'}
