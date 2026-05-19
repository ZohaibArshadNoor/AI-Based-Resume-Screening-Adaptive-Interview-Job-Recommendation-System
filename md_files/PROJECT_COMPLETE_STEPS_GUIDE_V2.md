# 🎓 AI Resume Screening System — Complete Project Guide V2
### MERN Stack + FastAPI/Python ML | 3 Members | Full Coverage: Backend + Frontend + Data Mining

---

## 📋 Table of Contents

1. [Project Overview & Current State](#1-project-overview--current-state)
2. [Team Division of Work](#2-team-division-of-work)
3. [Datasets — Free & Public](#3-datasets--free--public)
4. [All Package Installs](#4-all-package-installs)
5. [PHASE 1 — Bug Fixes (All Members Start Here)](#5-phase-1--bug-fixes-all-members-start-here)
6. [PHASE 2 — ML: Skills Dataset & Extractor Upgrade](#6-phase-2--ml-skills-dataset--extractor-upgrade)
7. [PHASE 3 — ML: Train All 3 Models](#7-phase-3--ml-train-all-3-models)
8. [PHASE 4 — ML: Upgrade Skill Matcher](#8-phase-4--ml-upgrade-skill-matcher)
9. [PHASE 5 — ML: Question Generator & Answer Evaluator](#9-phase-5--ml-question-generator--answer-evaluator)
10. [PHASE 6 — ML: Job Scraper & Recommender](#10-phase-6--ml-job-scraper--recommender)
11. [PHASE 7 — ML: FastAPI App — Complete app.py](#11-phase-7--ml-fastapi-app--complete-apppy)
12. [PHASE 8 — ML: EDA & Model Comparison Notebooks](#12-phase-8--ml-eda--model-comparison-notebooks)
13. [PHASE 9 — BACKEND: Missing Models (MongoDB Schemas)](#13-phase-9--backend-missing-models-mongodb-schemas)
14. [PHASE 10 — BACKEND: All Controllers](#14-phase-10--backend-all-controllers)
15. [PHASE 11 — BACKEND: All Routes + Wire index.js](#15-phase-11--backend-all-routes--wire-indexjs)
16. [PHASE 12 — BACKEND: Resume Controller ML Integration](#16-phase-12--backend-resume-controller-ml-integration)
17. [PHASE 13 — FRONTEND: Project Setup & Auth Context](#17-phase-13--frontend-project-setup--auth-context)
18. [PHASE 14 — FRONTEND: Login & Register Pages](#18-phase-14--frontend-login--register-pages)
19. [PHASE 15 — FRONTEND: Dashboard Page](#19-phase-15--frontend-dashboard-page)
20. [PHASE 16 — FRONTEND: Resume Upload Page](#20-phase-16--frontend-resume-upload-page)
21. [PHASE 17 — FRONTEND: Interview Page](#21-phase-17--frontend-interview-page)
22. [PHASE 18 — FRONTEND: Job Recommendations Page](#22-phase-18--frontend-job-recommendations-page)
23. [PHASE 19 — FRONTEND: Results Page](#23-phase-19--frontend-results-page)
24. [PHASE 20 — FRONTEND: Reusable Components](#24-phase-20--frontend-reusable-components)
25. [PHASE 21 — FRONTEND: App.jsx + Routing](#25-phase-21--frontend-appjsx--routing)
26. [Final End-to-End Checklist](#26-final-end-to-end-checklist)

---

## 1. Project Overview & Current State

### Architecture Summary
```
resume-interview-system/
├── client/          ← React + Tailwind (FRONTEND)
├── server/          ← Node.js + Express + MongoDB (BACKEND)
└── ml_service/      ← Python + FastAPI (DATA MINING / ML)
```

### ✅ Already Done
| Area | What's Done |
|---|---|
| Backend | MongoDB connect, Auth (register/login/JWT), Resume upload (Multer) |
| Backend | authController, authMiddleware, uploadMiddleware, User model, Resume model (partial) |
| Backend | authRoutes, resumeRoutes — wired in index.js |
| ML | resume_parser.py (PDF/DOCX/TXT/TEX), skill_extractor.py (basic), skill_matcher.py (basic) |
| ML | train_classifier.py, Logistic Regression trained, tfidf_vectorizer.pkl saved |
| ML | app.py with /extract-skills, /predict-role, /match-job |

### ❌ Not Done / Broken
| Area | What's Missing |
|---|---|
| ML | Name extraction bug (grabs extra words after name) |
| ML | skills.csv has only 38 entries — needs 800+ for all 42 domains |
| ML | Naive Bayes, Random Forest — not trained |
| ML | question_generator.py, answer_evaluator.py — not created |
| ML | job_scraper.py, job_ranker.py, content_filter.py — not created |
| ML | EDA notebook, model comparison notebook — not done |
| Backend | interviewController, jobController, resultController — not created |
| Backend | interviewRoutes, jobRoutes, resultRoutes — not created |
| Backend | Question, Answer, ScrapedJob, Result models — not created |
| Backend | index.js missing 3 route registrations |
| Backend | resumeController doesn't call ML service yet |
| Frontend | ALL pages are empty scaffolds — nothing functional |
| Frontend | AuthContext not wired to real API |
| Frontend | api.js interceptor incomplete |
| Frontend | No routing, no navigation, no connected forms |

---

## 2. Team Division of Work

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GROUP WORK DIVISION                           │
├─────────────┬────────────────────────────────────────────────────────┤
│  MEMBER A   │  DATA MINING (ml_service/)                             │
│             │  Phase 1 (bug fix), Phase 2, 3, 4, 5, 6, 7, 8        │
│             │  Files: resume_parser.py, skill_extractor.py,          │
│             │  skill_matcher.py, question_generator.py,              │
│             │  answer_evaluator.py, job_scraper.py, job_ranker.py,   │
│             │  content_filter.py, train_classifier.py, app.py,       │
│             │  EDA.ipynb, model_comparison.ipynb                     │
├─────────────┼────────────────────────────────────────────────────────┤
│  MEMBER B   │  BACKEND (server/)                                     │
│             │  Phase 9, 10, 11, 12                                   │
│             │  Files: All models (Question, Answer, Result,          │
│             │  ScrapedJob), All controllers (interview, job,         │
│             │  result, resume updated), All routes, index.js         │
├─────────────┼────────────────────────────────────────────────────────┤
│  MEMBER C   │  FRONTEND (client/)                                    │
│             │  Phase 13, 14, 15, 16, 17, 18, 19, 20, 21             │
│             │  Files: AuthContext, api.js, Login, Register,          │
│             │  Dashboard, ResumeUpload, Interview,                   │
│             │  JobRecommendations, Results, all components,          │
│             │  App.jsx routing                                        │
└─────────────┴────────────────────────────────────────────────────────┘

PARALLEL WORK PLAN:
  Day 1  → All:     Phase 1 (bug fix review)
           A:       Phase 2 (dataset + skill extractor)
           B:       Phase 9 (MongoDB models)
           C:       Phase 13 (setup + AuthContext)

  Day 2  → A:       Phase 3 (train models)
           B:       Phase 10 (controllers)
           C:       Phase 14 (Login + Register)

  Day 3  → A:       Phase 4 + 5 (matcher + Q&A)
           B:       Phase 11 + 12 (routes + ML integration)
           C:       Phase 15 + 16 (Dashboard + ResumeUpload)

  Day 4  → A:       Phase 6 + 7 (scraper + full app.py)
           B:       Test all API endpoints with Postman
           C:       Phase 17 + 18 (Interview + Jobs)

  Day 5  → A:       Phase 8 (notebooks)
           B:       Fix any backend bugs from testing
           C:       Phase 19 + 20 + 21 (Results + components + routing)

  Day 6  → All:     End-to-end testing + bug fixes
```

---

## 3. Datasets — Free & Public

| # | Dataset | Purpose | Link |
|---|---|---|---|
| 1 | UpdatedResumeDataSet (13K, 42 categories) | Train LR / NB / RF | https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset |
| 2 | Job Description Dataset (20K postings) | Job recommender | https://www.kaggle.com/datasets/ravindrasinghrana/job-description-dataset |
| 3 | O*NET Skills Database | Authoritative skills | https://www.onetcenter.org/database.html#individual-files |
| 4 | RemoteOK Public API | Live job scraping | https://remoteok.com/api (no key needed) |

**Download Dataset 1 (Kaggle CLI):**
```bash
pip install kaggle --break-system-packages
# Put your kaggle.json in ~/.kaggle/
kaggle datasets download -d gauravduttakiit/resume-dataset -p ml_service/data/raw/
unzip ml_service/data/raw/resume-dataset.zip -d ml_service/data/raw/
# Rename the file to: Resume-Classification-Dataset.csv
```

**Download Dataset 2:**
```bash
kaggle datasets download -d ravindrasinghrana/job-description-dataset -p ml_service/data/raw/
unzip ml_service/data/raw/job-description-dataset.zip -d ml_service/data/raw/
# File will be: job_descriptions.csv
```

---

## 4. All Package Installs

### Python (ml_service/) — install once
```bash
cd ml_service
pip install fastapi uvicorn python-multipart pdfplumber python-docx \
    scikit-learn pandas numpy joblib spacy requests \
    jupyter matplotlib seaborn --break-system-packages
python -m spacy download en_core_web_sm
```

**ml_service/requirements.txt:**
```
fastapi==0.115.0
uvicorn==0.30.0
python-multipart==0.0.9
pdfplumber==0.11.4
python-docx==1.1.2
scikit-learn==1.5.2
pandas==2.2.3
numpy==1.26.4
joblib==1.4.2
spacy==3.7.6
requests==2.32.3
matplotlib==3.9.2
seaborn==0.13.2
jupyter==1.1.1
```

### Node.js (server/) — install once
```bash
cd server
npm install axios form-data
```

**server/package.json dependencies (full):**
```json
{
  "dependencies": {
    "axios": "^1.7.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "form-data": "^4.0.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.2",
    "multer": "^2.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

### React (client/) — install once
```bash
cd client
npm install react-router-dom axios recharts
```

---

## 5. PHASE 1 — Bug Fixes (All Members Start Here)

**Who:** Member A fixes the ML file. Members B & C review to understand the issue.

### Bug: Name Extraction (resume_parser.py)

**Problem:** `extract_name()` picks up "Zohaib Arshad Noor Technical Project" because the heuristic only checks `len < 40` and `>= 2 words`. Many resumes have the job title on the same line or immediately after the name with no separator.

**Fix — Replace `extract_name` in `ml_service/services/resume_parser.py`:**

```python
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Words that appear in resume headers but are NOT part of a name
NON_NAME_KEYWORDS = {
    "resume", "curriculum", "vitae", "cv", "profile", "summary",
    "objective", "technical", "project", "manager", "engineer",
    "developer", "analyst", "consultant", "specialist", "lead",
    "senior", "junior", "intern", "fresher", "contact", "phone",
    "email", "address", "linkedin", "github", "portfolio",
    "university", "college", "institute", "school", "bachelor",
    "master", "bsc", "msc", "btech", "mtech", "skills", "experience",
    "references", "declaration", "objective", "career", "work",
}

def extract_name(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    for line in lines[:8]:
        words = line.split()
        # Real names are 2 to 4 words
        if not (2 <= len(words) <= 4):
            continue
        # No digits in a name
        if any(ch.isdigit() for ch in line):
            continue
        # No special characters except hyphens/dots (Al-Farooq, S.M. Hassan)
        if any(ch in line for ch in ["@", "/", "|", ":", "(", ")", "+", ","]):
            continue
        # Line must be short
        if len(line) > 40:
            continue
        # No non-name keywords
        line_lower = line.lower()
        if any(kw in line_lower for kw in NON_NAME_KEYWORDS):
            continue
        # All words must start with uppercase (names are capitalized)
        if all(w[0].isupper() for w in words if w):
            return line

    # Fallback: spaCy NER on first 400 chars
    doc = nlp(text[:400])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name_words = ent.text.strip().split()
            if 2 <= len(name_words) <= 4:
                return ent.text.strip()

    return None
```

**Test it:**
```bash
# run from ml_service/ folder
python -c "
from services.resume_parser import extract_text, extract_name
text = extract_text('path/to/your_resume.pdf')
print('NAME:', extract_name(text))
print('TEXT PREVIEW:', text[:200])
"
```

---

## 6. PHASE 2 — ML: Skills Dataset & Extractor Upgrade

**Who:** Member A

### Step 2.1 — Build a comprehensive skills.csv

**Create `ml_service/data/build_skills_from_dataset.py`:**

```python
"""
Mines top TF-IDF terms from each of the 42 resume categories
and merges them with a seed list of 200+ known skills.
Output: ml_service/data/raw/skills.csv  (~800-1200 rows)

Run:  python ml_service/data/build_skills_from_dataset.py
"""
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATASET  = BASE_DIR / "raw" / "Resume-Classification-Dataset.csv"
OUTPUT   = BASE_DIR / "raw" / "skills.csv"

# Comprehensive seed list covering all 42 resume domains
SEED_SKILLS = [
    # Programming Languages
    "Python","Java","C++","C#","JavaScript","TypeScript","Ruby","Go","Swift",
    "Kotlin","PHP","R","MATLAB","Scala","Rust","Perl","Dart","Haskell",
    # Web Frontend
    "React","Angular","Vue.js","Next.js","HTML","CSS","Tailwind CSS","Bootstrap",
    "SASS","jQuery","Redux","Webpack","Babel",
    # Web Backend
    "Node.js","Express.js","Django","Flask","FastAPI","Spring Boot","ASP.NET",
    "Laravel","Ruby on Rails","GraphQL","REST API","WebSockets","gRPC",
    # Databases
    "MySQL","PostgreSQL","MongoDB","Redis","SQLite","Oracle","Cassandra",
    "Elasticsearch","Firebase","DynamoDB","MariaDB","CouchDB","Neo4j",
    # Cloud & DevOps
    "AWS","Azure","GCP","Docker","Kubernetes","CI/CD","Jenkins","GitHub Actions",
    "Terraform","Linux","Bash","Ansible","Nginx","Apache",
    # Data Science & ML
    "Machine Learning","Deep Learning","TensorFlow","PyTorch","Keras",
    "Scikit-learn","Pandas","NumPy","Matplotlib","Seaborn","Tableau",
    "Power BI","Data Analysis","NLP","Computer Vision","OpenCV","XGBoost",
    "LightGBM","BERT","Transformers","Hugging Face","LLM","CUDA",
    # Data Engineering
    "Apache Spark","Hadoop","Kafka","Airflow","ETL","Data Warehousing",
    "Snowflake","BigQuery","Hive","dbt","Databricks",
    # Mobile
    "Android","iOS","React Native","Flutter","Xamarin","Swift","Kotlin",
    # Finance & Accounting
    "Financial Analysis","Accounting","Bookkeeping","QuickBooks","SAP","ERP",
    "Tax","Auditing","GAAP","Financial Modeling","Bloomberg","Risk Management",
    "Portfolio Management","Tally","IFRS","Valuation","Excel","VBA",
    # Civil & Mechanical Engineering
    "AutoCAD","SolidWorks","MATLAB","Structural Analysis","Revit","Civil 3D",
    "Project Management","Construction Management","Surveying",
    "Finite Element Analysis","STAAD.Pro","ETABS","ANSYS","CAD","BIM",
    # Electrical Engineering
    "PLC","SCADA","Electrical Design","Circuit Design","PCB Design",
    "Embedded Systems","Arduino","Raspberry Pi","VHDL","Verilog",
    # Blockchain
    "Solidity","Ethereum","Smart Contracts","Web3.js","Hyperledger",
    "DeFi","NFT","Cryptography","Blockchain","Truffle","Hardhat",
    # Marketing & Business
    "SEO","Google Analytics","Digital Marketing","Content Marketing",
    "Social Media","Market Research","CRM","Salesforce","HubSpot",
    "Email Marketing","PPC","Facebook Ads","Google Ads",
    # HR
    "Recruitment","Talent Acquisition","HRMS","Payroll","Training",
    "Performance Management","SAP HR","Workday",
    # Healthcare
    "Electronic Health Records","EHR","HIPAA","Clinical Research",
    "Medical Coding","ICD-10","Patient Care","Pharmacology","CPR",
    # Legal
    "Legal Research","Contract Drafting","Litigation","Compliance",
    "Corporate Law","Intellectual Property",
    # Design
    "Figma","Photoshop","Illustrator","UI/UX","Adobe XD","InDesign",
    "Sketch","Wireframing","Prototyping","User Research",
    # General Tech
    "Git","GitHub","Agile","Scrum","JIRA","Confluence",
    "Data Structures","Algorithms","OOP","Microservices",
    "API Integration","Unit Testing","Selenium","Postman","TDD",
    "System Design","Design Patterns",
]

print(f"Loading dataset from {DATASET}...")
df = pd.read_csv(DATASET)
text_col = "Resume" if "Resume" in df.columns else "Text"
df = df.dropna(subset=[text_col, "Category"])
print(f"  {len(df)} resumes | {df['Category'].nunique()} categories")

def clean(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

print("Mining top terms per category via TF-IDF...")
mined_terms = set()
for category, group in df.groupby("Category"):
    docs = group[text_col].apply(clean).tolist()
    if len(docs) < 3:
        continue
    try:
        vec = TfidfVectorizer(ngram_range=(1, 2), max_features=80,
                               stop_words="english", min_df=2)
        vec.fit(docs)
        mined_terms.update(vec.get_feature_names_out())
    except Exception as e:
        print(f"  Skipping {category}: {e}")

# Combine seed + mined
seed_lower_map = {s.lower(): s for s in SEED_SKILLS}
all_skills = set(s.lower() for s in SEED_SKILLS) | mined_terms
output = sorted([seed_lower_map.get(s, s.title()) for s in all_skills])

pd.DataFrame({"Skill": output}).to_csv(OUTPUT, index=False)
print(f"\n✅ skills.csv saved with {len(output)} entries → {OUTPUT}")
```

**Run:**
```bash
cd ml_service
python data/build_skills_from_dataset.py
```

---

### Step 2.2 — Upgrade skill_extractor.py

**Replace `ml_service/services/skill_extractor.py`:**

```python
"""
Upgraded skill extractor using spaCy PhraseMatcher.
Much faster and more accurate than regex loop over 1000+ skills.
"""
import pandas as pd
import spacy
from pathlib import Path

BASE_DIR    = Path(__file__).resolve().parent.parent
SKILLS_FILE = BASE_DIR / "data" / "raw" / "skills.csv"

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


class SkillExtractor:

    def __init__(self):
        self.matcher, self.skill_map = self._build_matcher()

    def _build_matcher(self):
        from spacy.matcher import PhraseMatcher
        df        = pd.read_csv(SKILLS_FILE)
        skills    = [str(s).strip() for s in df["Skill"].dropna()]
        skill_map = {s.lower(): s for s in skills}

        matcher  = PhraseMatcher(nlp.vocab, attr="LOWER")
        patterns = list(nlp.pipe(skills))
        matcher.add("SKILLS", patterns)
        return matcher, skill_map

    def extract_skills(self, resume_text: str) -> list:
        doc     = nlp(resume_text[:10_000])
        matches = self.matcher(doc)
        found   = set()
        for _, start, end in matches:
            span_text = doc[start:end].text.lower()
            original  = self.skill_map.get(span_text, span_text.title())
            found.add(original)
        return sorted(found)
```

---

## 7. PHASE 3 — ML: Train All 3 Models

**Who:** Member A

**Replace `ml_service/models/train_classifier.py`:**

```python
"""
Trains Logistic Regression, Naive Bayes, and Random Forest
on 13K resume dataset (42 categories).
Saves all models + shared TF-IDF vectorizer.

Run from ml_service/:  python models/train_classifier.py
"""
import pandas as pd, re, joblib, json
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR     = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "data" / "raw" / "Resume-Classification-Dataset.csv"
MODEL_DIR    = BASE_DIR / "models" / "saved"
PROCESSED    = BASE_DIR / "data" / "processed"
MODEL_DIR.mkdir(exist_ok=True)
PROCESSED.mkdir(parents=True, exist_ok=True)

# ── Load ──────────────────────────────────────────────────────────────────
print("Loading dataset...")
df       = pd.read_csv(DATASET_PATH)
text_col = "Resume" if "Resume" in df.columns else "Text"
df       = df.dropna(subset=["Category", text_col])
print(f"  {len(df)} rows | {df['Category'].nunique()} categories")

# ── Clean ─────────────────────────────────────────────────────────────────
def clean(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

df["clean"] = df[text_col].apply(clean)

# ── Split ─────────────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    df["clean"], df["Category"],
    test_size=0.2, random_state=42, stratify=df["Category"]
)

# ── Vectorize ─────────────────────────────────────────────────────────────
print("Fitting TF-IDF (10K features, bigrams)...")
tfidf = TfidfVectorizer(
    stop_words="english", max_features=10_000,
    ngram_range=(1, 2), sublinear_tf=True
)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf  = tfidf.transform(X_test)

joblib.dump(tfidf, MODEL_DIR / "tfidf_vectorizer.pkl")
# Save skill index for fast lookup
json.dump(
    {t: i for i, t in enumerate(tfidf.get_feature_names_out())},
    open(PROCESSED / "skill_index.json", "w")
)
print("  Saved tfidf_vectorizer.pkl + skill_index.json")

results = {}

# ── Model 1: Logistic Regression ──────────────────────────────────────────
print("\nTraining Logistic Regression...")
lr = LogisticRegression(max_iter=1000, C=1.0, solver="lbfgs")
lr.fit(X_train_tfidf, y_train)
lr_acc = accuracy_score(y_test, lr.predict(X_test_tfidf))
results["Logistic Regression"] = lr_acc
joblib.dump(lr, MODEL_DIR / "logistic_model.pkl")
joblib.dump(lr, MODEL_DIR / "resume_classifier.pkl")  # backward compat
print(f"  Accuracy: {lr_acc*100:.2f}%")
print(classification_report(y_test, lr.predict(X_test_tfidf), zero_division=0))

# ── Model 2: Naive Bayes ──────────────────────────────────────────────────
print("\nTraining Multinomial Naive Bayes...")
nb = MultinomialNB(alpha=0.1)
nb.fit(X_train_tfidf, y_train)
nb_acc = accuracy_score(y_test, nb.predict(X_test_tfidf))
results["Naive Bayes"] = nb_acc
joblib.dump(nb, MODEL_DIR / "naive_bayes_model.pkl")
print(f"  Accuracy: {nb_acc*100:.2f}%")
print(classification_report(y_test, nb.predict(X_test_tfidf), zero_division=0))

# ── Model 3: Random Forest ────────────────────────────────────────────────
print("\nTraining Random Forest (may take 3-5 min)...")
rf = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)
rf.fit(X_train_tfidf, y_train)
rf_acc = accuracy_score(y_test, rf.predict(X_test_tfidf))
results["Random Forest"] = rf_acc
joblib.dump(rf, MODEL_DIR / "random_forest_model.pkl")
print(f"  Accuracy: {rf_acc*100:.2f}%")
print(classification_report(y_test, rf.predict(X_test_tfidf), zero_division=0))

# ── Summary ───────────────────────────────────────────────────────────────
print("\n" + "="*50)
print("MODEL SUMMARY")
print("="*50)
for name, acc in sorted(results.items(), key=lambda x: -x[1]):
    print(f"  {name:<25} {acc*100:.2f}%  {'█'*int(acc*30)}")
print("\nAll models saved to models/saved/")
```

**Run:**
```bash
cd ml_service
python models/train_classifier.py
```

---

## 8. PHASE 4 — ML: Upgrade Skill Matcher

**Who:** Member A

**Replace `ml_service/services/skill_matcher.py`:**

```python
"""
Upgraded skill matcher — returns match %, matched skills,
missing skills, and extra skills (for SkillGapCard.jsx).
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional


class SkillMatcher:

    def calculate_match(
        self,
        resume_text:    str,
        job_description: str,
        resume_skills:  Optional[list] = None,
        job_skills:     Optional[list] = None,
    ) -> dict:

        # TF-IDF cosine between full resume and JD text
        vectorizer = TfidfVectorizer(stop_words="english")
        mat        = vectorizer.fit_transform([resume_text, job_description])
        score      = cosine_similarity(mat[0:1], mat[1:2])[0][0]
        match_pct  = round(float(score * 100), 2)

        # Skill gap analysis
        resume_set = set(s.lower() for s in (resume_skills or []))
        jd_set     = set(s.lower() for s in (job_skills   or []))

        # If no explicit JD skill list, find resume skills mentioned in JD text
        if not jd_set and job_description:
            jd_lower = job_description.lower()
            jd_set   = {s for s in resume_set if s in jd_lower}

        matched = sorted(resume_set & jd_set)
        missing = sorted(jd_set  - resume_set)
        extra   = sorted(resume_set - jd_set)

        return {
            "match_percentage": match_pct,
            "matched_skills":   [s.title() for s in matched],
            "missing_skills":   [s.title() for s in missing],
            "extra_skills":     [s.title() for s in extra],
        }
```

---

## 9. PHASE 5 — ML: Question Generator & Answer Evaluator

**Who:** Member A

### question_generator.py

**Create `ml_service/services/question_generator.py`:**

```python
"""
Generates interview questions based on detected skills + predicted role.
"""
import random
from typing import Optional

QUESTION_BANK = {
    "python": {
        "easy":   ["What are Python's key data types?",
                   "Explain the difference between a list and a tuple.",
                   "What is a virtual environment in Python and why use one?"],
        "medium": ["Explain Python's GIL and how it affects multithreading.",
                   "What are decorators in Python? Write a simple example.",
                   "How does Python's garbage collection work?"],
        "hard":   ["How would you optimize a Python function processing 10M records?",
                   "Explain metaclasses in Python with a use case.",
                   "Design a context manager from scratch."],
    },
    "machine learning": {
        "easy":   ["What is the difference between supervised and unsupervised learning?",
                   "Explain overfitting and how to prevent it.",
                   "What is a confusion matrix?"],
        "medium": ["Explain bias-variance tradeoff with an example.",
                   "How does gradient descent work? What are its variants?",
                   "What is cross-validation and why is it used?"],
        "hard":   ["Design an ML pipeline for a real-time fraud detection system.",
                   "Explain the math behind Support Vector Machines.",
                   "How would you handle a 1:1000 class imbalance?"],
    },
    "sql": {
        "easy":   ["What is the difference between WHERE and HAVING?",
                   "Explain JOIN types with examples."],
        "medium": ["Write a query to find the second highest salary.",
                   "Explain window functions in SQL with an example."],
        "hard":   ["Design a database schema for an e-commerce platform.",
                   "Explain ACID properties and their role in transactions."],
    },
    "react": {
        "easy":   ["What is JSX and how does it differ from HTML?",
                   "Explain the difference between props and state."],
        "medium": ["Explain React's useEffect with dependency array examples.",
                   "What is Context API? When would you use it over Redux?"],
        "hard":   ["How would you optimize a React app with 500+ components?",
                   "Explain code splitting and lazy loading in React."],
    },
    "node.js": {
        "easy":   ["What is the event loop in Node.js?",
                   "What is the difference between require() and import?"],
        "medium": ["How do you handle async errors in Express?",
                   "Explain middleware in Express.js."],
        "hard":   ["Design a scalable REST API with rate limiting and caching.",
                   "How would you handle 10,000 concurrent WebSocket connections?"],
    },
    "docker": {
        "easy":   ["What is the difference between a Docker image and a container?",
                   "What is a Dockerfile?"],
        "medium": ["How does Docker networking work?",
                   "What is Docker Compose and when would you use it?"],
        "hard":   ["Design a multi-container production deployment with health checks."],
    },
    "aws": {
        "easy":   ["What is EC2? What is S3?",
                   "What is the difference between RDS and DynamoDB?"],
        "medium": ["Explain IAM roles and policies.",
                   "How does auto-scaling work in AWS?"],
        "hard":   ["Design a highly available 3-tier architecture on AWS.",
                   "How would you implement a serverless data pipeline?"],
    },
    "data analysis": {
        "easy":   ["What is the difference between mean, median, and mode?",
                   "What tools do you use for data analysis?"],
        "medium": ["How do you handle missing data in a dataset?",
                   "Explain the difference between correlation and causation."],
        "hard":   ["Design an end-to-end analytics pipeline for a retail business.",
                   "How would you A/B test a new feature on a website?"],
    },
    "_generic": {
        "easy":   ["Describe your experience with {skill}.",
                   "What projects have you worked on using {skill}?"],
        "medium": ["What challenges have you faced while working with {skill}?",
                   "How do you stay updated with developments in {skill}?"],
        "hard":   ["Design a production system heavily using {skill}.",
                   "Describe a complex problem you solved using {skill}."],
    },
}

ROLE_DIFFICULTY = {
    "data science": "hard", "machine learning": "hard", "devops": "hard",
    "cybersecurity": "hard", "database administrator": "hard",
    "software engineer": "medium", "web developer": "medium",
    "backend developer": "medium", "frontend developer": "medium",
    "data analyst": "medium", "business analyst": "medium",
    "_default": "medium",
}


class QuestionGenerator:

    def generate(self, skills: list, predicted_role: Optional[str] = None,
                 n_questions: int = 5) -> list:
        difficulty = "medium"
        if predicted_role:
            for key, diff in ROLE_DIFFICULTY.items():
                if key in predicted_role.lower():
                    difficulty = diff
                    break

        questions  = []
        used       = set()

        for skill in skills:
            sk = skill.lower()
            bank = QUESTION_BANK.get(sk, QUESTION_BANK["_generic"])
            pool = bank.get(difficulty, bank.get("medium", []))
            if pool and sk not in used:
                q = random.choice(pool).replace("{skill}", skill)
                questions.append({"skill": skill, "question": q, "difficulty": difficulty})
                used.add(sk)
            if len(questions) >= n_questions:
                break

        # Pad with generics if needed
        while len(questions) < n_questions:
            pool   = QUESTION_BANK["_generic"].get(difficulty, [])
            skill  = skills[len(questions) % max(len(skills), 1)] if skills else "your field"
            q      = random.choice(pool).replace("{skill}", skill) if pool else f"Tell us about {skill}."
            questions.append({"skill": skill, "question": q, "difficulty": difficulty})

        return questions[:n_questions]
```

### answer_evaluator.py

**Create `ml_service/services/answer_evaluator.py`:**

```python
"""
Evaluates candidate answers using TF-IDF cosine similarity
against an ideal answer (if provided) or heuristic scoring.
"""
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ideal answers for questions in the bank (expand as needed)
IDEAL_ANSWERS = {
    "what is the difference between supervised and unsupervised learning?":
        "Supervised learning uses labeled data to train a model to predict outputs. "
        "Examples: classification, regression. Unsupervised learning finds patterns "
        "in unlabeled data. Examples: clustering, dimensionality reduction.",
    "explain overfitting and how to prevent it.":
        "Overfitting occurs when a model learns noise in training data and performs "
        "poorly on new data. Prevention: cross-validation, regularization (L1/L2), "
        "dropout, pruning, more training data.",
    "what is a confusion matrix?":
        "A confusion matrix is a table showing true positives, true negatives, "
        "false positives, and false negatives. It is used to evaluate classification "
        "model performance through metrics like precision, recall, and F1 score.",
}


def _clean(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


class AnswerEvaluator:

    def evaluate(self, question: str, candidate_answer: str,
                 ideal_answer: str = None) -> dict:

        if not candidate_answer or not candidate_answer.strip():
            return {"score": 0, "grade": "Needs Improvement",
                    "feedback": "No answer was provided."}

        ideal = ideal_answer or IDEAL_ANSWERS.get(question.lower().strip())

        if ideal:
            try:
                vec   = TfidfVectorizer()
                mat   = vec.fit_transform([_clean(candidate_answer), _clean(ideal)])
                sim   = cosine_similarity(mat[0:1], mat[1:2])[0][0]
                score = round(float(sim) * 100)
            except Exception:
                score = 0
        else:
            # Heuristic: length + lexical diversity
            words  = candidate_answer.split()
            length = min(len(words) / 80 * 60, 60)
            unique = (len(set(words)) / max(len(words), 1)) * 40
            score  = round(length + unique)

        return {
            "score":    min(score, 100),
            "grade":    self._grade(score),
            "feedback": self._feedback(score),
        }

    def _grade(self, s):
        if s >= 80: return "Excellent"
        if s >= 60: return "Good"
        if s >= 40: return "Fair"
        return "Needs Improvement"

    def _feedback(self, s):
        if s >= 80: return "Great answer! You demonstrated strong understanding."
        if s >= 60: return "Good answer. Consider adding more technical detail."
        if s >= 40: return "Fair attempt. Include key concepts and specific examples."
        return "Needs more depth. Review the topic and include technical terms."
```

---

## 10. PHASE 6 — ML: Job Scraper & Recommender

**Who:** Member A

### job_scraper.py

**Create `ml_service/services/job_scraper.py`:**

```python
"""
Fetches jobs from RemoteOK public API (no key needed).
Falls back to local job_descriptions.csv for offline demo.
"""
import requests
import pandas as pd
from pathlib import Path

REMOTEOK_URL = "https://remoteok.com/api"
BASE_DIR     = Path(__file__).resolve().parent.parent
JOB_CSV      = BASE_DIR / "data" / "raw" / "job_descriptions.csv"


def _from_remoteok(query: str = "", limit: int = 30) -> list:
    try:
        resp = requests.get(REMOTEOK_URL,
                            headers={"User-Agent": "ResumeScreener/1.0"}, timeout=10)
        resp.raise_for_status()
        data = [j for j in resp.json() if isinstance(j, dict) and j.get("position")]
        if query:
            q = query.lower()
            data = [j for j in data
                    if q in j.get("position","").lower()
                    or q in " ".join(j.get("tags",[])).lower()]
        return [{
            "title":       j.get("position", "Unknown"),
            "company":     j.get("company", "Unknown"),
            "location":    j.get("location", "Remote"),
            "link":        j.get("url", ""),
            "description": j.get("description", ""),
            "skills":      j.get("tags", []),
            "salary":      j.get("salary", "Not specified"),
            "source":      "RemoteOK",
        } for j in data[:limit]]
    except Exception as e:
        print(f"RemoteOK failed: {e}")
        return []


def _from_local(query: str = "", limit: int = 30) -> list:
    if not JOB_CSV.exists():
        return []
    try:
        df = pd.read_csv(JOB_CSV).dropna(subset=["Job Title"])
        if query:
            df = df[df["Job Title"].str.lower().str.contains(query.lower(), na=False)]
        result = []
        for _, row in df.head(limit).iterrows():
            result.append({
                "title":       row.get("Job Title", ""),
                "company":     row.get("Company", "Unknown"),
                "location":    row.get("location", "Not specified"),
                "link":        row.get("Job Portal", ""),
                "description": row.get("Job Description", ""),
                "skills":      str(row.get("skills","")).split(","),
                "salary":      row.get("Salary Range", "Not specified"),
                "source":      "Dataset",
            })
        return result
    except Exception as e:
        print(f"Local dataset failed: {e}")
        return []


def scrape_jobs(query: str = "", limit: int = 30) -> list:
    jobs = _from_remoteok(query, limit)
    if not jobs:
        print("Falling back to local dataset...")
        jobs = _from_local(query, limit)
    return jobs
```

### job_ranker.py

**Create `ml_service/recommender/job_ranker.py`:**

```python
"""
Ranks jobs by cosine similarity between candidate skills and job text.
"""
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _clean(text: str) -> str:
    text = str(text).lower()
    return re.sub(r"[^a-zA-Z0-9\s]", " ", text)


def rank_jobs(candidate_skills: list, jobs: list, top_n: int = 10) -> list:
    if not jobs or not candidate_skills:
        return jobs[:top_n]

    candidate_str = _clean(" ".join(candidate_skills))
    scored = []
    for job in jobs:
        job_text = _clean(
            job.get("description","") + " " + " ".join(job.get("skills",[]))
        )
        try:
            vec   = TfidfVectorizer(stop_words="english")
            mat   = vec.fit_transform([candidate_str, job_text])
            score = cosine_similarity(mat[0:1], mat[1:2])[0][0]
        except Exception:
            score = 0.0
        scored.append({**job, "match_score": round(float(score) * 100, 2)})

    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:top_n]
```

### content_filter.py

**Create `ml_service/recommender/content_filter.py`:**

```python
"""Removes duplicate and very low-score jobs."""

def filter_jobs(jobs: list, min_score: float = 0.0) -> list:
    seen    = set()
    result  = []
    for job in jobs:
        key = (job.get("title","").lower().strip(),
               job.get("company","").lower().strip())
        if key in seen or job.get("match_score", 100) < min_score:
            continue
        seen.add(key)
        result.append(job)
    return result
```

---

## 11. PHASE 7 — ML: FastAPI App — Complete app.py

**Who:** Member A

**Replace `ml_service/app.py` completely:**

```python
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, joblib
from pathlib import Path

from ml_service.services.resume_parser    import (extract_text, extract_email,
                                                   extract_phone, extract_name)
from ml_service.services.skill_extractor  import SkillExtractor
from ml_service.services.skill_matcher    import SkillMatcher
from ml_service.services.question_generator import QuestionGenerator
from ml_service.services.answer_evaluator   import AnswerEvaluator
from ml_service.services.job_scraper        import scrape_jobs
from ml_service.recommender.job_ranker      import rank_jobs
from ml_service.recommender.content_filter  import filter_jobs

BASE_DIR         = Path(__file__).resolve().parent
MODEL_DIR        = BASE_DIR / "models" / "saved"

# Load models at startup
classifier_model = joblib.load(MODEL_DIR / "resume_classifier.pkl")
tfidf_vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")

skill_extractor    = SkillExtractor()
skill_matcher      = SkillMatcher()
question_generator = QuestionGenerator()
answer_evaluator   = AnswerEvaluator()

app = FastAPI(title="AI Resume Screening ML Service", version="2.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def save_file(file: UploadFile) -> str:
    os.makedirs("temp", exist_ok=True)
    path = os.path.join("temp", file.filename)
    with open(path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    return path


@app.get("/")
async def root():
    return {"message": "AI Resume Screening ML Service Running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}


# ── 1. Extract Skills ─────────────────────────────────────────────────────
@app.post("/extract-skills")
async def extract_skills_api(file: UploadFile = File(...)):
    try:
        path = save_file(file)
        text = extract_text(path)
        os.remove(path)
        return {
            "file_name": file.filename,
            "name":      extract_name(text),
            "email":     extract_email(text),
            "phone":     extract_phone(text),
            "skills":    skill_extractor.extract_skills(text),
        }
    except Exception as e:
        return {"error": str(e)}


# ── 2. Predict Role ───────────────────────────────────────────────────────
@app.post("/predict-role")
async def predict_role(role: str = Form(...), file: UploadFile = File(...)):
    try:
        path = save_file(file)
        text = extract_text(path)
        os.remove(path)
        vec        = tfidf_vectorizer.transform([text])
        prediction = classifier_model.predict(vec)[0]
        probs      = classifier_model.predict_proba(vec)[0]
        confidence = float(max(probs))
        return {
            "file_name":      file.filename,
            "selected_role":  role,
            "predicted_role": prediction,
            "match":          role.lower().strip() == prediction.lower().strip(),
            "confidence":     round(confidence * 100, 2),
        }
    except Exception as e:
        return {"error": str(e)}


# ── 3. Match Job ──────────────────────────────────────────────────────────
@app.post("/match-job")
async def match_job(job_description: str = Form(...), file: UploadFile = File(...)):
    try:
        path   = save_file(file)
        text   = extract_text(path)
        os.remove(path)
        skills = skill_extractor.extract_skills(text)
        result = skill_matcher.calculate_match(
            resume_text=text, job_description=job_description,
            resume_skills=skills
        )
        return {"file_name": file.filename, "skills": skills, **result}
    except Exception as e:
        return {"error": str(e)}


# ── 4. Generate Questions ─────────────────────────────────────────────────
@app.post("/generate-questions")
async def generate_questions(
    file:           UploadFile = File(...),
    predicted_role: str        = Form(""),
    n_questions:    int        = Form(5),
):
    try:
        path      = save_file(file)
        text      = extract_text(path)
        os.remove(path)
        skills    = skill_extractor.extract_skills(text)
        questions = question_generator.generate(
            skills=skills, predicted_role=predicted_role, n_questions=n_questions
        )
        return {"questions": questions, "skills_used": skills}
    except Exception as e:
        return {"error": str(e)}


# ── 5. Evaluate Answer ────────────────────────────────────────────────────
@app.post("/evaluate-answer")
async def evaluate_answer(
    question:         str = Form(...),
    candidate_answer: str = Form(...),
    ideal_answer:     str = Form(""),
):
    try:
        result = answer_evaluator.evaluate(
            question=question,
            candidate_answer=candidate_answer,
            ideal_answer=ideal_answer or None,
        )
        return result
    except Exception as e:
        return {"error": str(e)}


# ── 6. Job Recommendations ────────────────────────────────────────────────
@app.post("/job-recommendations")
async def job_recommendations(
    file:  UploadFile = File(...),
    query: str        = Form(""),
    top_n: int        = Form(10),
):
    try:
        path   = save_file(file)
        text   = extract_text(path)
        os.remove(path)
        skills = skill_extractor.extract_skills(text)
        jobs   = scrape_jobs(query=query or (skills[0] if skills else ""), limit=50)
        ranked = rank_jobs(skills, jobs, top_n=top_n * 2)
        final  = filter_jobs(ranked)[:top_n]
        return {"candidate_skills": skills, "jobs": final, "total_found": len(jobs)}
    except Exception as e:
        return {"error": str(e)}
```

**Start the ML service:**
```bash
cd ml_service
uvicorn app:app --reload --port 8000
```

---

## 12. PHASE 8 — ML: EDA & Model Comparison Notebooks

**Who:** Member A  
**Files:** `ml_service/notebooks/EDA.ipynb`, `ml_service/notebooks/model_comparison.ipynb`

### EDA.ipynb — paste cell by cell into Jupyter

```python
# Cell 1 — Load & Inspect
import pandas as pd, matplotlib.pyplot as plt, seaborn as sns

df = pd.read_csv("../data/raw/Resume-Classification-Dataset.csv")
text_col = "Resume" if "Resume" in df.columns else "Text"
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Nulls:\n{df.isnull().sum()}")
df.head(3)
```

```python
# Cell 2 — Class Distribution
cat_counts = df["Category"].value_counts()
plt.figure(figsize=(14,7))
sns.barplot(x=cat_counts.values, y=cat_counts.index, palette="Blues_d")
plt.title("Resume Category Distribution — 42 Classes", fontsize=14)
plt.xlabel("Number of Resumes")
plt.tight_layout()
plt.savefig("../data/eda_class_dist.png", dpi=150)
plt.show()
print(cat_counts)
```

```python
# Cell 3 — Text Length Distribution
import re

def clean(t):
    t = str(t).lower()
    t = re.sub(r"http\S+","",t)
    t = re.sub(r"[^a-zA-Z0-9\s]"," ",t)
    return re.sub(r"\s+"," ",t).strip()

df["clean"]      = df[text_col].apply(clean)
df["word_count"] = df["clean"].apply(lambda x: len(x.split()))

fig, axes = plt.subplots(1,2,figsize=(14,5))
df["word_count"].hist(bins=40, color="steelblue", ax=axes[0])
axes[0].set_title("Resume Word Count Distribution")
df.groupby("Category")["word_count"].mean().sort_values().plot(
    kind="barh", color="teal", ax=axes[1])
axes[1].set_title("Avg Word Count by Category")
plt.tight_layout()
plt.savefig("../data/eda_word_count.png", dpi=150)
plt.show()
```

```python
# Cell 4 — Duplicate & Balance Check
print(f"Duplicates: {df.duplicated().sum()}")
print(f"Class imbalance — min: {cat_counts.min()}, max: {cat_counts.max()}")
print(f"Imbalance ratio: {cat_counts.max()/cat_counts.min():.2f}x")
```

```python
# Cell 5 — Top Keywords Per Category (sample 5 categories)
from sklearn.feature_extraction.text import TfidfVectorizer

for cat in df["Category"].value_counts().head(5).index:
    docs = df[df["Category"]==cat]["clean"].tolist()
    vec  = TfidfVectorizer(stop_words="english", max_features=10)
    vec.fit(docs)
    print(f"\n{cat}: {', '.join(vec.get_feature_names_out())}")
```

### model_comparison.ipynb

```python
# Cell 1 — Setup
import joblib, pandas as pd, re, matplotlib.pyplot as plt
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, ConfusionMatrixDisplay

BASE = Path("../")
df   = pd.read_csv(BASE / "data/raw/Resume-Classification-Dataset.csv")
text_col = "Resume" if "Resume" in df.columns else "Text"
df   = df.dropna(subset=["Category", text_col])

def clean(t):
    t = str(t).lower()
    t = re.sub(r"http\S+","",t)
    t = re.sub(r"[^a-zA-Z0-9\s]"," ",t)
    return re.sub(r"\s+"," ",t).strip()

df["clean"] = df[text_col].apply(clean)
_, X_test, _, y_test = train_test_split(df["clean"], df["Category"],
                                         test_size=0.2, random_state=42,
                                         stratify=df["Category"])
tfidf        = joblib.load(BASE / "models/saved/tfidf_vectorizer.pkl")
X_test_tfidf = tfidf.transform(X_test)
```

```python
# Cell 2 — Compare All Models
models = {
    "Logistic Regression": BASE / "models/saved/logistic_model.pkl",
    "Naive Bayes":         BASE / "models/saved/naive_bayes_model.pkl",
    "Random Forest":       BASE / "models/saved/random_forest_model.pkl",
}
rows = []
for name, path in models.items():
    if not path.exists(): continue
    m     = joblib.load(path)
    preds = m.predict(X_test_tfidf)
    rows.append({
        "Model":      name,
        "Accuracy":   f"{accuracy_score(y_test, preds)*100:.2f}%",
        "F1 (macro)": f"{f1_score(y_test, preds, average='macro', zero_division=0)*100:.2f}%",
    })
print(pd.DataFrame(rows).to_string(index=False))

# Bar chart
accs = {r["Model"]: float(r["Accuracy"].strip("%")) for r in rows}
plt.figure(figsize=(8,4))
plt.bar(accs.keys(), accs.values(), color=["#3B82F6","#10B981","#F59E0B"])
plt.ylim(60,100)
plt.title("Model Accuracy Comparison")
plt.ylabel("Accuracy (%)")
plt.tight_layout()
plt.savefig(BASE / "data/model_comparison.png", dpi=150)
plt.show()
```

```python
# Cell 3 — Confusion Matrix of Best Model
best_name  = max(accs, key=accs.get)
best_model = joblib.load(models[best_name])
preds      = best_model.predict(X_test_tfidf)
labels     = sorted(df["Category"].unique())

fig, ax = plt.subplots(figsize=(20,18))
cm      = confusion_matrix(y_test, preds, labels=labels)
ConfusionMatrixDisplay(cm, display_labels=labels).plot(
    ax=ax, xticks_rotation=90, cmap="Blues", colorbar=False)
ax.set_title(f"Confusion Matrix — {best_name} (Best Model)")
plt.tight_layout()
plt.savefig(BASE / "data/confusion_matrix.png", dpi=150)
plt.show()
```

---

## 13. PHASE 9 — BACKEND: Missing Models (MongoDB Schemas)

**Who:** Member B

### server/models/Question.js
```javascript
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    jobRole:      { type: String, default: '' },
    questionText: { type: String, required: true },
    difficulty:   { type: String, enum: ['easy','medium','hard'], default: 'medium' },
    skill:        { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
```

### server/models/Answer.js
```javascript
import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
    answerText: { type: String, required: true },
    score:      { type: Number, default: 0 },
    grade:      { type: String, default: '' },
    feedback:   { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Answer', AnswerSchema);
```

### server/models/Result.js
```javascript
import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeScore:    { type: Number, default: 0 },
    interviewScore: { type: Number, default: 0 },
    feedback:       { type: String, default: '' },
    predictedRole:  { type: String, default: '' },
    extractedSkills:{ type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Result', ResultSchema);
```

### server/models/ScrapedJob.js
```javascript
import mongoose from 'mongoose';

const ScrapedJobSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    company:     { type: String, default: '' },
    location:    { type: String, default: '' },
    link:        { type: String, default: '' },
    description: { type: String, default: '' },
    skills:      { type: [String], default: [] },
    matchScore:  { type: Number, default: 0 },
    salary:      { type: String, default: '' },
    source:      { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('ScrapedJob', ScrapedJobSchema);
```

### Update server/models/Resume.js (add predictedRole + rawText)
```javascript
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName:        { type: String, required: true },
    filePath:        { type: String, required: true },
    extractedSkills: { type: [String], default: [] },
    resumeScore:     { type: Number, default: 0 },
    rawText:         { type: String, default: '' },
    predictedRole:   { type: String, default: '' },
    name:            { type: String, default: '' },
    email:           { type: String, default: '' },
    phone:           { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Resume', ResumeSchema);
```

---

## 14. PHASE 10 — BACKEND: All Controllers

**Who:** Member B

### server/controllers/resumeController.js (updated — calls ML service)
```javascript
import Resume from '../models/Resume.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Call ML service to extract skills and info
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const mlRes = await axios.post(`${ML_URL}/extract-skills`, formData, {
            headers: formData.getHeaders(),
        });

        const { name, email, phone, skills } = mlRes.data;

        // Call predict-role
        const roleForm = new FormData();
        roleForm.append('file', fs.createReadStream(req.file.path));
        roleForm.append('role', req.body.role || 'Unknown');

        const roleRes = await axios.post(`${ML_URL}/predict-role`, roleForm, {
            headers: roleForm.getHeaders(),
        });

        const predictedRole = roleRes.data.predicted_role || '';
        const confidence    = roleRes.data.confidence || 0;

        // Save to MongoDB
        const resume = await Resume.create({
            userId:          req.user.id,
            fileName:        req.file.filename,
            filePath:        req.file.path,
            extractedSkills: skills || [],
            rawText:         '',
            predictedRole,
            name:  name  || '',
            email: email || '',
            phone: phone || '',
            resumeScore: confidence,
        });

        res.status(201).json({
            message: 'Resume uploaded and analyzed successfully',
            resume,
            extracted: { name, email, phone, skills, predictedRole, confidence },
        });

    } catch (error) {
        console.error('Resume upload error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user.id })
            .sort({ createdAt: -1 }).limit(5);
        res.status(200).json({ resumes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### server/controllers/interviewController.js
```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import Answer from '../models/Answer.js';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const generateQuestions = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Resume file required' });

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));
        formData.append('predicted_role', req.body.predictedRole || '');
        formData.append('n_questions', req.body.nQuestions || '5');

        const mlRes = await axios.post(`${ML_URL}/generate-questions`, formData, {
            headers: formData.getHeaders(),
        });

        // Clean up uploaded file
        fs.unlink(req.file.path, () => {});

        res.status(200).json(mlRes.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitAnswer = async (req, res) => {
    try {
        const { question, answerText, idealAnswer } = req.body;

        if (!question || !answerText) {
            return res.status(400).json({ message: 'question and answerText are required' });
        }

        // Evaluate via ML service
        const params = new URLSearchParams();
        params.append('question', question);
        params.append('candidate_answer', answerText);
        if (idealAnswer) params.append('ideal_answer', idealAnswer);

        const evalRes = await axios.post(`${ML_URL}/evaluate-answer`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { score, grade, feedback } = evalRes.data;

        const answer = await Answer.create({
            userId:    req.user.id,
            answerText,
            score,
            grade,
            feedback,
        });

        res.status(201).json({ answer, score, grade, feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnswerHistory = async (req, res) => {
    try {
        const answers = await Answer.find({ userId: req.user.id })
            .sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ answers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### server/controllers/jobController.js
```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import ScrapedJob from '../models/ScrapedJob.js';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const getRecommendations = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Resume file required' });

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));
        formData.append('query',  req.body.query  || '');
        formData.append('top_n', req.body.topN   || '10');

        const mlRes = await axios.post(`${ML_URL}/job-recommendations`, formData, {
            headers: formData.getHeaders(),
        });

        fs.unlink(req.file.path, () => {});

        const jobs = mlRes.data.jobs || [];

        // Save top 5 to DB
        for (const job of jobs.slice(0, 5)) {
            await ScrapedJob.findOneAndUpdate(
                { title: job.title, company: job.company },
                { ...job, matchScore: job.match_score },
                { upsert: true, new: true }
            );
        }

        res.status(200).json(mlRes.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const jobs = await ScrapedJob.find().sort({ matchScore: -1 }).limit(20);
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### server/controllers/resultController.js
```javascript
import Result from '../models/Result.js';

export const saveResult = async (req, res) => {
    try {
        const { resumeScore, interviewScore, feedback, predictedRole, extractedSkills } = req.body;

        const result = await Result.create({
            userId: req.user.id,
            resumeScore:     resumeScore     || 0,
            interviewScore:  interviewScore  || 0,
            feedback:        feedback        || '',
            predictedRole:   predictedRole   || '',
            extractedSkills: extractedSkills || [],
        });

        res.status(201).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user.id })
            .sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

---

## 15. PHASE 11 — BACKEND: All Routes + Wire index.js

**Who:** Member B

### server/routes/resumeRoutes.js
```javascript
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadResume, getResumes } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/my',      authMiddleware, getResumes);

export default router;
```

### server/routes/interviewRoutes.js
```javascript
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { generateQuestions, submitAnswer, getAnswerHistory }
    from '../controllers/interviewController.js';

const router = express.Router();

router.post('/generate', authMiddleware, upload.single('resume'), generateQuestions);
router.post('/answer',   authMiddleware, submitAnswer);
router.get('/history',   authMiddleware, getAnswerHistory);

export default router;
```

### server/routes/jobRoutes.js
```javascript
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { getRecommendations, getSavedJobs } from '../controllers/jobController.js';

const router = express.Router();

router.post('/recommendations', authMiddleware, upload.single('resume'), getRecommendations);
router.get('/saved',            authMiddleware, getSavedJobs);

export default router;
```

### server/routes/resultRoutes.js
```javascript
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { saveResult, getHistory } from '../controllers/resultController.js';

const router = express.Router();

router.post('/save',    authMiddleware, saveResult);
router.get('/history',  authMiddleware, getHistory);

export default router;
```

### server/index.js (complete, final version)
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes      from './routes/authRoutes.js';
import resumeRoutes    from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import jobRoutes       from './routes/jobRoutes.js';
import resultRoutes    from './routes/resultRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth',      authRoutes);
app.use('/api/resume',    resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/jobs',      jobRoutes);
app.use('/api/results',   resultRoutes);

app.get('/', (req, res) => res.send('AI Resume Screening API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### server/.env (add ML service URL)
```
MONGO_URI=mongodb://localhost:27017/resume_screening
JWT_SECRET=your_secret_key_here
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

---

## 16. PHASE 12 — BACKEND: Test All Endpoints with Postman

**Who:** Member B (after Phase 11 is done)

Test these endpoints in order:

| # | Method | URL | Body | Expected |
|---|---|---|---|---|
| 1 | POST | `localhost:5000/api/auth/register` | `{name, email, password}` | `{token, user}` |
| 2 | POST | `localhost:5000/api/auth/login` | `{email, password}` | `{token, user}` |
| 3 | POST | `localhost:5000/api/resume/upload` | form-data: `resume` (file) | `{resume, extracted}` |
| 4 | GET  | `localhost:5000/api/resume/my` | — | `{resumes:[...]}` |
| 5 | POST | `localhost:5000/api/interview/generate` | form-data: `resume` (file) | `{questions:[...]}` |
| 6 | POST | `localhost:5000/api/interview/answer` | `{question, answerText}` | `{score, grade, feedback}` |
| 7 | POST | `localhost:5000/api/jobs/recommendations` | form-data: `resume` (file) | `{jobs:[...]}` |
| 8 | GET  | `localhost:5000/api/jobs/saved` | — | `{jobs:[...]}` |
| 9 | POST | `localhost:5000/api/results/save` | `{resumeScore, interviewScore}` | `{result}` |
| 10| GET  | `localhost:5000/api/results/history` | — | `{results:[...]}` |

> All protected routes need `Authorization: Bearer <token>` header.

---

## 17. PHASE 13 — FRONTEND: Project Setup & Auth Context

**Who:** Member C

### client/src/services/api.js (complete)
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

### client/src/context/AuthContext.jsx (complete)
```jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [token,   setToken]   = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser  = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### client/src/components/ProtectedRoute.jsx (complete)
```jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
}
```

---

## 18. PHASE 14 — FRONTEND: Login & Register Pages

**Who:** Member C

### client/src/pages/Login.jsx
```jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login }   = useContext(AuthContext);
    const navigate    = useNavigate();
    const [form, setForm]     = useState({ email: '', password: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                        flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
                <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600
                                    rounded-xl p-3 mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={form.email}
                            onChange={handleChange} required
                            placeholder="you@example.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3
                                       focus:outline-none focus:border-blue-400 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" value={form.password}
                            onChange={handleChange} required
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3
                                       focus:outline-none focus:border-blue-400 text-sm" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl
                                   hover:bg-blue-700 disabled:opacity-50 transition font-semibold">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
```

### client/src/pages/Register.jsx
```jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const { register }  = useContext(AuthContext);
    const navigate      = useNavigate();
    const [form, setForm]     = useState({ name: '', email: '', password: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                        flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
                <p className="text-gray-500 text-sm mb-6">Start your interview preparation</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600
                                    rounded-xl p-3 mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Zohaib Arshad' },
                        { label: 'Email',     name: 'email', type: 'email', placeholder: 'you@example.com' },
                        { label: 'Password',  name: 'password', type: 'password', placeholder: '••••••••' },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input type={type} name={name} value={form[name]}
                                onChange={handleChange} required placeholder={placeholder}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3
                                           focus:outline-none focus:border-blue-400 text-sm" />
                        </div>
                    ))}
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl
                                   hover:bg-blue-700 disabled:opacity-50 transition font-semibold">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
```

---

## 19. PHASE 15 — FRONTEND: Dashboard Page

**Who:** Member C

### client/src/pages/Dashboard.jsx
```jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CARDS = [
    { title: 'Upload Resume',      desc: 'Parse your resume and extract skills automatically',  path: '/upload',    emoji: '📄', color: 'blue'   },
    { title: 'Practice Interview', desc: 'Get AI-generated questions based on your skills',     path: '/interview', emoji: '🎤', color: 'purple' },
    { title: 'Job Matches',        desc: 'Find jobs that match your skill profile',             path: '/jobs',      emoji: '💼', color: 'green'  },
    { title: 'My Results',         desc: 'View your scores and session history',                path: '/results',   emoji: '📊', color: 'orange' },
];

const COLOR_MAP = {
    blue:   'border-blue-100   hover:border-blue-300   bg-blue-50',
    purple: 'border-purple-100 hover:border-purple-300 bg-purple-50',
    green:  'border-green-100  hover:border-green-300  bg-green-50',
    orange: 'border-orange-100 hover:border-orange-300 bg-orange-50',
};

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate         = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <span className="font-semibold text-gray-800">Resume Screener</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button onClick={logout}
                        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg
                                   hover:bg-red-100 transition">
                        Logout
                    </button>
                </div>
            </header>

            {/* Body */}
            <main className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Hello, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-500 mt-2">
                        What would you like to work on today?
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {CARDS.map(card => (
                        <button key={card.path}
                            onClick={() => navigate(card.path)}
                            className={`text-left p-6 rounded-2xl border-2 transition-all duration-200
                                        hover:shadow-md ${COLOR_MAP[card.color]}`}>
                            <div className="text-4xl mb-4">{card.emoji}</div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
```

---

## 20. PHASE 16 — FRONTEND: Resume Upload Page

**Who:** Member C

### client/src/pages/ResumeUpload.jsx
```jsx
import { useState, useContext } from 'react';
import { useNavigate }          from 'react-router-dom';
import api                      from '../services/api';
import { AuthContext }          from '../context/AuthContext';

const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

export default function ResumeUpload() {
    const { user }     = useContext(AuthContext);
    const navigate     = useNavigate();
    const [file, setFile]         = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [result, setResult]     = useState(null);
    const [error, setError]       = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            // 1. Save to backend (MongoDB)
            const nodeForm = new FormData();
            nodeForm.append('resume', file);
            await api.post('/resume/upload', nodeForm);

            // 2. Get rich analysis from ML service
            const mlForm = new FormData();
            mlForm.append('file', file);
            const mlRes  = await fetch(`${ML_URL}/extract-skills`, {
                method: 'POST', body: mlForm,
            });
            const data = await mlRes.json();
            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Analysis failed. Is the ML service running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">

                {/* Back button */}
                <button onClick={() => navigate('/')}
                    className="text-blue-600 text-sm mb-6 hover:underline flex items-center gap-1">
                    ← Back to Dashboard
                </button>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Resume</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Supports PDF, DOCX, TXT — max 5MB
                </p>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
                                ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-300'}`}>
                    <div className="text-5xl mb-3">📄</div>
                    {file ? (
                        <p className="font-medium text-gray-700">{file.name}</p>
                    ) : (
                        <>
                            <p className="font-medium text-gray-700">Drag & drop your resume here</p>
                            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                        </>
                    )}
                    <input id="file-input" type="file" accept=".pdf,.docx,.txt"
                        className="hidden" onChange={e => setFile(e.target.files[0])} />
                </div>

                <button onClick={handleAnalyze} disabled={!file || loading}
                    className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                               hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
                </button>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600
                                    rounded-xl p-4 text-sm">{error}</div>
                )}

                {/* Results */}
                {result && (
                    <div className="mt-6 space-y-4">
                        {/* Profile Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-700 mb-4">📋 Extracted Profile</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium text-gray-800">{result.name || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-gray-800">{result.email || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-medium text-gray-800">{result.phone || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-700 mb-4">
                                🎯 Skills Found ({result.skills?.length || 0})
                            </h2>
                            {result.skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {result.skills.map(s => (
                                        <span key={s}
                                            className="bg-blue-50 text-blue-700 text-sm
                                                       px-3 py-1 rounded-full border border-blue-100">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No skills detected. Try a more detailed resume.</p>
                            )}
                        </div>

                        {/* CTA */}
                        <button onClick={() => navigate('/interview')}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl
                                       font-semibold hover:bg-purple-700 transition">
                            🎤 Start Interview Practice →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
```

---

## 21. PHASE 17 — FRONTEND: Interview Page

**Who:** Member C

### client/src/pages/Interview.jsx
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

export default function Interview() {
    const navigate    = useNavigate();
    const [step, setStep]         = useState('upload');   // upload | questions | results
    const [file, setFile]         = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers]   = useState({});
    const [evalResults, setEvalResults] = useState({});
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const generateQuestions = async () => {
        if (!file) return;
        setLoading(true); setError('');
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('predicted_role', '');
            form.append('n_questions', '5');
            const res  = await fetch(`${ML_URL}/generate-questions`, { method:'POST', body: form });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setQuestions(data.questions || []);
            setStep('questions');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitAll = async () => {
        setLoading(true);
        const results = {};
        for (const q of questions) {
            try {
                const form = new URLSearchParams();
                form.append('question', q.question);
                form.append('candidate_answer', answers[q.question] || '');
                const res  = await fetch(`${ML_URL}/evaluate-answer`, {
                    method: 'POST', body: form
                });
                results[q.question] = await res.json();
            } catch {
                results[q.question] = { score: 0, grade: 'Error', feedback: 'Evaluation failed.' };
            }
        }
        setEvalResults(results);

        // Save to backend
        const scores  = Object.values(results).map(r => r.score || 0);
        const avgScore = scores.reduce((a,b)=>a+b,0) / (scores.length||1);
        try {
            await api.post('/results/save', { interviewScore: Math.round(avgScore), resumeScore: 0 });
        } catch {}

        setStep('results');
        setLoading(false);
    };

    const DIFF_COLOR = { easy:'bg-green-100 text-green-700', medium:'bg-yellow-100 text-yellow-700', hard:'bg-red-100 text-red-700' };
    const GRADE_COLOR = { Excellent:'bg-green-50 border-green-200 text-green-700', Good:'bg-blue-50 border-blue-200 text-blue-700', Fair:'bg-yellow-50 border-yellow-200 text-yellow-700', 'Needs Improvement':'bg-red-50 border-red-200 text-red-700' };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/')}
                    className="text-blue-600 text-sm mb-6 hover:underline">← Dashboard</button>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">🎤 Interview Practice</h1>

                {/* STEP 1 — Upload */}
                {step === 'upload' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-gray-600 mb-4">
                            Upload your resume to generate personalized interview questions.
                        </p>
                        <input type="file" accept=".pdf,.docx,.txt"
                            onChange={e => setFile(e.target.files[0])}
                            className="w-full border border-dashed border-gray-300 rounded-xl
                                       p-4 cursor-pointer text-gray-500 hover:border-blue-400 mb-4" />
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                        <button onClick={generateQuestions} disabled={!file || loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                                       hover:bg-blue-700 disabled:opacity-40 transition">
                            {loading ? '⏳ Generating...' : '🚀 Generate Questions'}
                        </button>
                    </div>
                )}

                {/* STEP 2 — Questions */}
                {step === 'questions' && (
                    <div className="space-y-4">
                        <p className="text-gray-500 text-sm">{questions.length} questions generated. Answer them all then submit.</p>
                        {questions.map((q, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex gap-2 mb-3">
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{q.skill}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
                                </div>
                                <p className="font-medium text-gray-800 mb-3">Q{i+1}. {q.question}</p>
                                <textarea
                                    value={answers[q.question] || ''}
                                    onChange={e => setAnswers(prev=>({...prev,[q.question]:e.target.value}))}
                                    placeholder="Type your answer here..."
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm
                                               focus:outline-none focus:border-blue-400 resize-none"
                                />
                            </div>
                        ))}
                        <button onClick={submitAll} disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold
                                       hover:bg-green-700 disabled:opacity-40 transition">
                            {loading ? '⏳ Evaluating...' : '✅ Submit All Answers'}
                        </button>
                    </div>
                )}

                {/* STEP 3 — Results */}
                {step === 'results' && (
                    <div className="space-y-4">
                        {/* Overall Score */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                            <p className="text-gray-500 text-sm mb-1">Overall Score</p>
                            <p className="text-5xl font-bold text-blue-600">
                                {Math.round(
                                    Object.values(evalResults).reduce((a,b)=>a+(b.score||0),0) /
                                    Math.max(Object.values(evalResults).length,1)
                                )}
                                <span className="text-2xl text-gray-400">/100</span>
                            </p>
                        </div>

                        {questions.map((q, i) => {
                            const ev = evalResults[q.question] || {};
                            return (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <p className="font-medium text-gray-800 mb-2">Q{i+1}. {q.question}</p>
                                    <p className="text-gray-500 text-sm mb-3 italic">
                                        Your answer: {answers[q.question] || '(no answer)'}
                                    </p>
                                    {ev.grade && (
                                        <div className={`border rounded-xl p-3 text-sm ${GRADE_COLOR[ev.grade] || ''}`}>
                                            <strong>{ev.grade}</strong> — {ev.score}/100
                                            <p className="mt-1">{ev.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <button onClick={() => navigate('/')}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
```

---

## 22. PHASE 18 — FRONTEND: Job Recommendations Page

**Who:** Member C

### client/src/pages/JobRecommendations.jsx
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

export default function JobRecommendations() {
    const navigate    = useNavigate();
    const [file, setFile]     = useState(null);
    const [query, setQuery]   = useState('');
    const [jobs, setJobs]     = useState([]);
    const [skills, setSkills] = useState([]);
    const [total, setTotal]   = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');

    const fetchJobs = async () => {
        if (!file) return;
        setLoading(true); setError('');
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('query', query);
            form.append('top_n', '10');
            const res  = await fetch(`${ML_URL}/job-recommendations`, { method:'POST', body: form });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setJobs(data.jobs   || []);
            setSkills(data.candidate_skills || []);
            setTotal(data.total_found || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (s) =>
        s >= 60 ? 'text-green-600' : s >= 30 ? 'text-yellow-600' : 'text-red-400';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/')} className="text-blue-600 text-sm mb-6 hover:underline">
                    ← Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">💼 Job Recommendations</h1>
                <p className="text-gray-500 text-sm mb-6">Upload your resume to find matching jobs</p>

                {/* Search Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="Search role (optional, e.g. Python Developer)"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm
                                       focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <input type="file" accept=".pdf,.docx,.txt"
                        onChange={e => setFile(e.target.files[0])}
                        className="w-full border border-dashed border-gray-300 rounded-xl p-3
                                   cursor-pointer text-gray-500 text-sm mb-4" />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <button onClick={fetchJobs} disabled={!file || loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                                   hover:bg-blue-700 disabled:opacity-40 transition">
                        {loading ? '🔍 Searching...' : '🔍 Find Jobs'}
                    </button>
                </div>

                {/* Your Skills */}
                {skills.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Your detected skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span key={s} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-100">{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Job Cards */}
                {jobs.length > 0 && (
                    <>
                        <p className="text-sm text-gray-400 mb-4">
                            Showing {jobs.length} of {total} jobs found
                        </p>
                        <div className="space-y-4">
                            {jobs.map((job, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                                            <p className="text-gray-500 text-sm mt-0.5">
                                                {job.company} · {job.location}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-bold ${scoreColor(job.match_score)}`}>
                                                {job.match_score}%
                                            </p>
                                            <p className="text-xs text-gray-400">match</p>
                                        </div>
                                    </div>

                                    {job.salary && job.salary !== 'Not specified' && (
                                        <p className="text-sm text-gray-600 mb-2">💰 {job.salary}</p>
                                    )}

                                    {job.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {job.skills.slice(0,6).map(s => (
                                                <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{job.source}</span>
                                        {job.link && (
                                            <a href={job.link} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-600 text-sm hover:underline font-medium">
                                                View Job →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
```

---

## 23. PHASE 19 — FRONTEND: Results Page

**Who:** Member C

### client/src/pages/Results.jsx
```jsx
import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import api                     from '../services/api';

export default function Results() {
    const navigate           = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/results/history')
            .then(r => setResults(r.data.results || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const avg = (arr) => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={()=>navigate('/')} className="text-blue-600 text-sm mb-6 hover:underline">
                    ← Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 My Results</h1>

                {/* Summary Stats */}
                {results.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-2xl p-5 text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {avg(results.map(r => r.interviewScore))}%
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Avg Interview Score</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-5 text-center">
                            <p className="text-3xl font-bold text-green-600">{results.length}</p>
                            <p className="text-sm text-gray-500 mt-1">Sessions Completed</p>
                        </div>
                    </div>
                )}

                {results.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-gray-600 font-medium">No results yet</p>
                        <p className="text-gray-400 text-sm mt-1">Complete an interview session to see your scores here.</p>
                        <button onClick={()=>navigate('/interview')}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition">
                            Start Interview
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((r, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-400">
                                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                                            weekday:'long', year:'numeric', month:'short', day:'numeric'
                                        })}
                                    </p>
                                    {r.predictedRole && (
                                        <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                                            {r.predictedRole}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{r.resumeScore || 0}%</p>
                                        <p className="text-xs text-gray-500 mt-1">Resume Score</p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-green-600">{Math.round(r.interviewScore || 0)}%</p>
                                        <p className="text-xs text-gray-500 mt-1">Interview Score</p>
                                    </div>
                                </div>
                                {r.extractedSkills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-4">
                                        {r.extractedSkills.slice(0,8).map(s=>(
                                            <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
```

---

## 24. PHASE 20 — FRONTEND: Reusable Components

**Who:** Member C

### client/src/components/Navbar.jsx
```jsx
import { useContext }   from 'react';
import { useNavigate }  from 'react-router-dom';
import { AuthContext }  from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate         = useNavigate();

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center">
            <button onClick={() => navigate('/')}
                className="flex items-center gap-2 font-semibold text-gray-800 hover:text-blue-600 transition">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">AI</span>
                Resume Screener
            </button>
            <div className="flex items-center gap-4">
                {[
                    { label:'Upload', path:'/upload' },
                    { label:'Interview', path:'/interview' },
                    { label:'Jobs', path:'/jobs' },
                    { label:'Results', path:'/results' },
                ].map(link => (
                    <button key={link.path}
                        onClick={() => navigate(link.path)}
                        className="text-sm text-gray-600 hover:text-blue-600 transition">
                        {link.label}
                    </button>
                ))}
                <button onClick={logout}
                    className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                    Logout
                </button>
            </div>
        </nav>
    );
}
```

### client/src/components/SkillGapCard.jsx
```jsx
export default function SkillGapCard({ matched = [], missing = [], extra = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Skill Gap Analysis</h3>
            {matched.length > 0 && (
                <div>
                    <p className="text-xs text-green-600 font-medium mb-2">✅ Matched Skills ({matched.length})</p>
                    <div className="flex flex-wrap gap-1">
                        {matched.map(s=><span key={s} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded border border-green-100">{s}</span>)}
                    </div>
                </div>
            )}
            {missing.length > 0 && (
                <div>
                    <p className="text-xs text-red-500 font-medium mb-2">❌ Missing Skills ({missing.length})</p>
                    <div className="flex flex-wrap gap-1">
                        {missing.map(s=><span key={s} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded border border-red-100">{s}</span>)}
                    </div>
                </div>
            )}
        </div>
    );
}
```

### client/src/components/ScoreChart.jsx
```jsx
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export default function ScoreChart({ scores = [] }) {
    if (!scores.length) return null;
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={scores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" fill="#3B82F6" fillOpacity={0.4} stroke="#3B82F6" />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
```

---

## 25. PHASE 21 — FRONTEND: App.jsx + Routing

**Who:** Member C

### client/src/App.jsx (complete, final)
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import ProtectedRoute       from './components/ProtectedRoute';
import Login                from './pages/Login';
import Register             from './pages/Register';
import Dashboard            from './pages/Dashboard';
import ResumeUpload         from './pages/ResumeUpload';
import Interview            from './pages/Interview';
import JobRecommendations   from './pages/JobRecommendations';
import Results              from './pages/Results';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/upload" element={
                        <ProtectedRoute><ResumeUpload /></ProtectedRoute>
                    } />
                    <Route path="/interview" element={
                        <ProtectedRoute><Interview /></ProtectedRoute>
                    } />
                    <Route path="/jobs" element={
                        <ProtectedRoute><JobRecommendations /></ProtectedRoute>
                    } />
                    <Route path="/results" element={
                        <ProtectedRoute><Results /></ProtectedRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
```

### client/src/main.jsx (ensure this is correct)
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:8000
```

---

## 26. Final End-to-End Checklist

```
═══════════════════════════════════════════════════════════════
              FINAL PROJECT CHECKLIST
═══════════════════════════════════════════════════════════════

MEMBER A — DATA MINING (ml_service/)
  ☐ Phase 1  — extract_name bug fixed in resume_parser.py
  ☐ Phase 2  — build_skills_from_dataset.py run → skills.csv has 800+ entries
  ☐ Phase 2  — skill_extractor.py upgraded to PhraseMatcher
  ☐ Phase 3  — train_classifier.py run → 3 .pkl files in models/saved/
  ☐ Phase 3  — Accuracy of each model verified (LR ~85%+, NB ~80%+, RF ~85%+)
  ☐ Phase 4  — skill_matcher.py returns matched/missing/extra skills
  ☐ Phase 5  — question_generator.py created + tested
  ☐ Phase 5  — answer_evaluator.py created + tested
  ☐ Phase 6  — job_scraper.py fetches from RemoteOK (or local CSV fallback)
  ☐ Phase 6  — job_ranker.py + content_filter.py created
  ☐ Phase 7  — app.py complete with all 6 endpoints
  ☐ Phase 7  — uvicorn starts with no errors: uvicorn app:app --reload --port 8000
  ☐ Phase 8  — EDA.ipynb: class distribution, word count, keyword charts saved
  ☐ Phase 8  — model_comparison.ipynb: accuracy bar chart + confusion matrix saved

MEMBER B — BACKEND (server/)
  ☐ Phase 9  — Question.js, Answer.js, Result.js, ScrapedJob.js created
  ☐ Phase 9  — Resume.js updated with predictedRole, name, email, phone fields
  ☐ Phase 10 — resumeController.js calls ML service /extract-skills + /predict-role
  ☐ Phase 10 — interviewController.js calls ML service /generate-questions + /evaluate-answer
  ☐ Phase 10 — jobController.js calls ML service /job-recommendations
  ☐ Phase 10 — resultController.js saves + fetches results
  ☐ Phase 11 — interviewRoutes.js, jobRoutes.js, resultRoutes.js created
  ☐ Phase 11 — index.js registers all 5 route groups
  ☐ Phase 11 — server/.env has MONGO_URI, JWT_SECRET, ML_SERVICE_URL
  ☐ Phase 12 — All 10 Postman tests pass with correct responses
  ☐         — npm run dev starts with no errors on port 5000

MEMBER C — FRONTEND (client/)
  ☐ Phase 13 — api.js has JWT interceptor + 401 redirect
  ☐ Phase 13 — AuthContext provides user, login, register, logout
  ☐ Phase 13 — ProtectedRoute redirects unauthenticated users
  ☐ Phase 14 — Login.jsx: form submits, errors shown, redirects on success
  ☐ Phase 14 — Register.jsx: form submits, validation, redirects on success
  ☐ Phase 15 — Dashboard.jsx: 4 cards, user name shown, logout works
  ☐ Phase 16 — ResumeUpload.jsx: drag/drop, file upload, skills shown, name extracted correctly
  ☐ Phase 17 — Interview.jsx: 3 steps (upload → questions → results) work end-to-end
  ☐ Phase 18 — JobRecommendations.jsx: file upload, jobs listed with match scores
  ☐ Phase 19 — Results.jsx: history loads, scores displayed
  ☐ Phase 20 — Navbar.jsx, SkillGapCard.jsx, ScoreChart.jsx created
  ☐ Phase 21 — App.jsx: all routes defined, protected routes enforce auth
  ☐         — client/.env has VITE_API_URL and VITE_ML_URL
  ☐         — npm run dev starts with no errors on port 5173

ALL MEMBERS — END-TO-END TEST
  ☐ All 3 servers running simultaneously:
      uvicorn app:app --reload --port 8000    (ML)
      npm run dev   (from server/)  port 5000  (Backend)
      npm run dev   (from client/)  port 5173  (Frontend)
  ☐ Register a new user
  ☐ Login → lands on Dashboard
  ☐ Upload resume → name extracted correctly (no extra words)
  ☐ Skills shown (from 42 domains, not just 38 tech skills)
  ☐ Go to Interview → generate questions → answer → submit → see scores
  ☐ Go to Jobs → upload resume → job list appears with match %
  ☐ Go to Results → previous session score visible
  ☐ Logout → redirected to login
  ☐ Try accessing /upload without login → redirected to /login

═══════════════════════════════════════════════════════════════
```

---

### Quick Start Commands (run in 3 terminals)

```bash
# Terminal 1 — ML Service
cd ml_service
uvicorn app:app --reload --port 8000

# Terminal 2 — Backend
cd server
npm run dev

# Terminal 3 — Frontend
cd client
npm run dev
```

---

*AI Resume Screening System — Complete Project Guide V2*
*Covers: Frontend (React) + Backend (Node.js/Express/MongoDB) + Data Mining (Python/FastAPI/scikit-learn)*
*3 Members | MERN + ML Stack*
