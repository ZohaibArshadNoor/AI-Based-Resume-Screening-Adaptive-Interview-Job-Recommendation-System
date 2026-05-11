# AI-Based Resume Screening, Adaptive Interview & Job Recommendation System
## Complete Project Guide — Version 2 (with Job Scraping Module)

---

# SECTION 1: PROJECT OVERVIEW

This is a full-stack MERN application extended with a Python FastAPI microservice for all ML and data mining work. The system has four major functional modules:

1. **Resume Module** — User uploads a PDF resume. The system extracts raw text, identifies skills using NLP, and scores the resume.
2. **Interview Module** — Based on extracted skills, the system adaptively generates interview questions, accepts answers, and evaluates them using ML models.
3. **Job Scraping & Recommendation Module** *(NEW)* — Based on the user's resume skills AND interview performance, the system scrapes live job listings from online portals and ranks/recommends them to the user using similarity scoring.
4. **Dashboard & Results Module** — Aggregates all scores, scraped job suggestions, and personalized feedback into a unified user dashboard with history tracking.

**Tech Stack Summary:**
- Frontend: React.js + Tailwind CSS (Vite)
- Backend: Node.js + Express.js (REST API)
- Database: MongoDB (via Mongoose)
- ML/Scraping Service: Python + FastAPI
- Communication: Backend ↔ ML Service via internal HTTP (axios)

---

# SECTION 2: COMPLETE FOLDER STRUCTURE

```
resume-interview-system/
│
├── client/                              ← FRONTEND (React + Tailwind)
│   ├── public/
│   │   └── index.html                   ← HTML entry point, mounts React root
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg                 ← Static brand logo
│   │   │
│   │   ├── components/                  ← Reusable UI pieces
│   │   │   ├── Navbar.jsx               ← Top navigation bar with auth state
│   │   │   ├── ProtectedRoute.jsx       ← Redirects unauthenticated users
│   │   │   ├── ResumeUploader.jsx       ← Drag-and-drop PDF upload widget
│   │   │   ├── SkillGapCard.jsx         ← Shows missing vs matched skills
│   │   │   ├── QuestionCard.jsx         ← Single interview Q&A card
│   │   │   ├── FeedbackCard.jsx         ← Displays AI feedback per answer
│   │   │   ├── ScoreChart.jsx           ← Bar/radar chart for scores
│   │   │   └── JobCard.jsx              ← [NEW] Card showing a scraped job listing
│   │   │
│   │   ├── pages/                       ← Full-page route components
│   │   │   ├── Login.jsx                ← Login form, calls /api/auth/login
│   │   │   ├── Register.jsx             ← Register form, calls /api/auth/register
│   │   │   ├── Dashboard.jsx            ← Home after login, nav to all modules
│   │   │   ├── ResumeUpload.jsx         ← Resume upload flow + skill display
│   │   │   ├── Interview.jsx            ← Interview session (questions + answers)
│   │   │   ├── JobRecommendations.jsx   ← [NEW] Shows scraped + ranked jobs
│   │   │   └── Results.jsx              ← Final score summary + history
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          ← Global auth state (user, token, login/logout)
│   │   │
│   │   ├── services/
│   │   │   └── api.js                   ← Axios instance with JWT interceptor
│   │   │
│   │   ├── App.jsx                      ← Route definitions, AuthProvider wrapper
│   │   └── main.jsx                     ← ReactDOM.render entry point
│   │
│   ├── .env                             ← VITE_API_URL=http://localhost:5000/api
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                              ← BACKEND (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js                        ← Mongoose connection setup
│   │
│   ├── controllers/                     ← Business logic per resource
│   │   ├── authController.js            ← register(), login() with bcrypt + JWT
│   │   ├── resumeController.js          ← uploadResume() → calls ML service
│   │   ├── interviewController.js       ← getQuestions(), submitAnswer()
│   │   ├── jobController.js             ← [NEW] triggerScrape(), getSavedJobs()
│   │   └── resultController.js          ← saveResult(), getHistory()
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js            ← JWT verification on protected routes
│   │   └── uploadMiddleware.js          ← Multer config for PDF file upload
│   │
│   ├── models/                          ← MongoDB collection schemas
│   │   ├── User.js                      ← name, email, password (hashed)
│   │   ├── Resume.js                    ← userId, extractedSkills, resumeScore, rawText
│   │   ├── Question.js                  ← jobRole, questionText, difficulty
│   │   ├── Answer.js                    ← userId, questionId, answerText, score
│   │   ├── ScrapedJob.js                ← [NEW] title, company, link, skills, matchScore
│   │   └── Result.js                    ← userId, resumeScore, interviewScore, feedback
│   │
│   ├── routes/                          ← Express routers
│   │   ├── authRoutes.js                ← POST /register, POST /login
│   │   ├── resumeRoutes.js              ← POST /upload (protected)
│   │   ├── interviewRoutes.js           ← GET /questions, POST /answer (protected)
│   │   ├── jobRoutes.js                 ← [NEW] POST /scrape, GET /recommendations
│   │   └── resultRoutes.js              ← POST /save, GET /history (protected)
│   │
│   ├── uploads/                         ← Temp folder for uploaded PDF files
│   ├── .env
│   ├── package.json
│   └── index.js                         ← App entry: middleware, routes, server start
│
├── ml_service/                          ← ML + SCRAPING MICROSERVICE (Python + FastAPI)
│   │
│   ├── data/
│   │   ├── raw/
│   │   │   ├── resume_dataset.csv       ← Kaggle resume dataset (download manually)
│   │   │   └── job_descriptions.csv     ← Kaggle job description dataset
│   │   └── processed/
│   │       ├── tfidf_matrix.pkl         ← Saved TF-IDF matrix (after training)
│   │       └── skill_index.json         ← Skill→index mapping for fast lookup
│   │
│   ├── models/
│   │   ├── saved/
│   │   │   ├── logistic_model.pkl       ← Trained Logistic Regression classifier
│   │   │   ├── naive_bayes_model.pkl    ← Trained Naive Bayes classifier
│   │   │   ├── random_forest_model.pkl  ← [NEW] Trained Random Forest classifier
│   │   │   └── tfidf_vectorizer.pkl     ← Fitted TF-IDF vectorizer (shared)
│   │   ├── train_classifier.py          ← Trains + saves all models with CV
│   │   └── evaluate_models.py           ← Loads saved models, prints comparison table
│   │
│   ├── notebooks/
│   │   ├── EDA.ipynb                    ← Dataset exploration, class distribution
│   │   └── model_comparison.ipynb       ← Side-by-side accuracy/F1 charts
│   │
│   ├── services/
│   │   ├── resume_parser.py             ← pdfplumber: PDF → raw text string
│   │   ├── skill_extractor.py           ← spaCy NER + keyword matching → skill list
│   │   ├── skill_matcher.py             ← TF-IDF + Cosine Similarity scoring
│   │   ├── question_generator.py        ← Skill-aware adaptive question bank
│   │   ├── answer_evaluator.py          ← Cosine similarity answer scoring
│   │   └── job_scraper.py               ← [NEW] Scrapes jobs from LinkedIn/Indeed
│   │
│   ├── recommender/
│   │   ├── job_ranker.py                ← [NEW] Ranks scraped jobs by skill match
│   │   └── content_filter.py           ← [NEW] Filters irrelevant/duplicate jobs
│   │
│   ├── app.py                           ← FastAPI app: all endpoints defined here
│   ├── requirements.txt
│   └── .env                             ← MONGO_URI (optional), scraping config
│
└── README.md
```

---

# SECTION 3: FILE-BY-FILE EXPLANATION

This section explains the purpose and responsibility of every single file in the project.

---

## A. CLIENT (Frontend)

### `client/public/index.html`
The single HTML file that the browser loads. React injects the entire application into `<div id="root">`. You generally never edit this file.

### `client/src/main.jsx`
The JavaScript entry point. It imports `App.jsx` and renders it into the `#root` div. Also wraps the app in `StrictMode` for development warnings.

### `client/src/App.jsx`
Defines all URL routes using `react-router-dom`. Maps each path (e.g., `/upload`, `/interview`, `/jobs`) to a page component. Also wraps the entire app in `AuthProvider` so every component can access auth state. Protected pages are wrapped in `ProtectedRoute`.

### `client/src/context/AuthContext.jsx`
A React Context that stores the currently logged-in user and their JWT token in both component state and `localStorage`. Provides `login()` and `logout()` functions. Any component can call `useAuth()` to access this.

### `client/src/services/api.js`
A pre-configured Axios instance pointing to `http://localhost:5000/api`. Has a **request interceptor** that automatically attaches the JWT token from localStorage to every request's `Authorization` header. All API calls in the app go through this file.

### `client/src/components/Navbar.jsx`
Top navigation bar rendered on every page. Shows the app logo, user's name if logged in, and a Logout button. Uses `useAuth()` to read user state and call `logout()`.

### `client/src/components/ProtectedRoute.jsx`
A wrapper component. If the user is not logged in (no token/user in context), it redirects them to `/login`. Used in `App.jsx` to protect all authenticated pages.

### `client/src/components/ResumeUploader.jsx`
Drag-and-drop file input widget specifically for PDF files. Handles file validation (type check, size limit) before allowing upload. Used inside `ResumeUpload.jsx`.

### `client/src/components/SkillGapCard.jsx`
Receives two lists — skills the user has and skills required for a job — and visually displays matched skills (green) vs. missing skills (red). Used on the Job Recommendations page.

### `client/src/components/QuestionCard.jsx`
Renders a single interview question with a textarea for the answer and a Submit button. Displays the AI score and feedback after submission. Used inside `Interview.jsx`.

### `client/src/components/FeedbackCard.jsx`
Displays the per-question feedback returned from the ML service after answer evaluation. Shows score out of 100 and a text suggestion.

### `client/src/components/ScoreChart.jsx`
A recharts bar or radar chart showing Resume Score, Interview Score, and Overall Score side by side. Used on the Results page.

### `client/src/components/JobCard.jsx` *(NEW)*
Displays a single scraped job listing. Shows job title, company name, location, match score (as a percentage bar), required skills, and a "View Job" link that opens the original listing in a new tab.

### `client/src/pages/Login.jsx`
Login form with email and password fields. On submit, calls `POST /api/auth/login`, receives `{ token, user }`, calls `login()` from context, then navigates to the Dashboard.

### `client/src/pages/Register.jsx`
Registration form. Calls `POST /api/auth/register`, handles the same token/user flow as Login, then redirects to Dashboard.

### `client/src/pages/Dashboard.jsx`
The home screen after login. Shows the user's name and four navigation cards: Upload Resume, Start Interview, Job Recommendations, View Results. Acts as the control hub of the application.

### `client/src/pages/ResumeUpload.jsx`
Lets the user pick a PDF and upload it. On upload, calls `POST /api/resume/upload` (which internally calls the ML service). Displays the resume score and a list of extracted skill badges after a successful response.

### `client/src/pages/Interview.jsx`
The interview session page. Either reads the user's skills from the resume result (stored in state or fetched from API) or lets the user type them manually. Calls the ML service to generate questions. For each question, renders a `QuestionCard`, collects answers, and sends them for evaluation one by one.

### `client/src/pages/JobRecommendations.jsx` *(NEW)*
Calls `POST /api/jobs/scrape` with the user's skills and interview score. Polls or awaits the response, then renders a ranked list of `JobCard` components. Includes a filter/sort UI (by match score, location, role). This is the primary demo page for the new module.

### `client/src/pages/Results.jsx`
Fetches the user's most recent result from `GET /api/results/history`. Displays Resume Score, Interview Score, and Overall Score using `ScoreChart`. Shows the AI feedback paragraph. Also shows a mini-list of top 3 job recommendations from the last scrape.

---

## B. SERVER (Backend)

### `server/index.js`
The Express app entry point. Connects to MongoDB, sets up CORS, JSON body parsing, and registers all route files. Starts the HTTP server on the configured port.

### `server/config/db.js`
Contains the single `connectDB()` function that calls `mongoose.connect()`. Called once at startup in `index.js`. Exits the process if connection fails.

### `server/middleware/authMiddleware.js`
Express middleware that reads the `Authorization: Bearer <token>` header, verifies the JWT using `JWT_SECRET`, and attaches `{ id }` to `req.user`. Any route that uses this middleware requires a valid token.

### `server/middleware/uploadMiddleware.js`
Multer configuration. Sets the upload destination to `./uploads/`, generates a timestamped filename, restricts file type to PDF, and enforces a 5MB size limit.

### `server/models/User.js`
Mongoose schema for users. Fields: `name`, `email` (unique), `password` (hashed), `timestamps`. The raw password is never stored — it's hashed by `authController` before saving.

### `server/models/Resume.js`
Stores the result of each resume analysis. Fields: `userId` (reference to User), `extractedSkills` (array of strings), `resumeScore` (number), `rawText` (full extracted text for re-processing).

### `server/models/Question.js`
Stores interview questions. Fields: `jobRole`, `questionText`, `difficulty` (easy/medium/hard). These can be seeded from a static list or generated dynamically. The model is used to persist questions shown to users.

### `server/models/Answer.js`
Stores each user's submitted answer. Fields: `userId`, `questionId`, `answerText`, `score` (returned by ML service). Enables history tracking and per-session score aggregation.

### `server/models/ScrapedJob.js` *(NEW)*
Stores scraped job listings for each user session. Fields: `userId`, `title`, `company`, `location`, `jobUrl`, `requiredSkills` (array), `matchScore` (float 0–100), `scrapedAt` (timestamp). TTL index can be set so old entries auto-delete after 24 hours.

### `server/models/Result.js`
Final aggregated result per session. Fields: `userId`, `resumeScore`, `interviewScore`, `overallScore`, `feedback` (string), `timestamp`. Used to build the user's history.

### `server/controllers/authController.js`
`register()`: Checks for duplicate email, hashes password with bcrypt, saves User, signs and returns JWT.
`login()`: Finds user by email, compares password with bcrypt, signs and returns JWT.

### `server/controllers/resumeController.js`
`uploadResume()`: Receives the uploaded PDF file via Multer. Sends the file to the Python ML service at `POST /parse-resume` using Axios + FormData. Receives `{ skills, score, raw_text }`. Saves a Resume document. Returns result to frontend. Deletes the temp file afterward.

### `server/controllers/interviewController.js`
`getQuestions()`: Takes a list of skills from query params, forwards to ML service at `POST /generate-questions`. Returns question list.
`submitAnswer()`: Takes `{ questionId, answerText }`, calls ML service at `POST /evaluate-answer`. Saves the Answer document. Returns `{ score, feedback }`.

### `server/controllers/jobController.js` *(NEW)*
`triggerScrape()`: Receives user's skill list and interview score from the request body. Calls ML service at `POST /scrape-jobs`. ML service scrapes jobs and returns ranked results. Saves them to `ScrapedJob` collection. Returns the ranked list.
`getSavedJobs()`: Fetches the user's most recent set of `ScrapedJob` documents from MongoDB for display without re-scraping.

### `server/controllers/resultController.js`
`saveResult()`: Aggregates resume score + average interview score, generates a feedback string, saves a Result document.
`getHistory()`: Returns all Result documents for the logged-in user, sorted by most recent.

### `server/routes/authRoutes.js`
Maps `POST /api/auth/register` → `authController.register` and `POST /api/auth/login` → `authController.login`.

### `server/routes/resumeRoutes.js`
Maps `POST /api/resume/upload` → `uploadMiddleware` → `resumeController.uploadResume`. Auth-protected.

### `server/routes/interviewRoutes.js`
Maps `GET /api/interview/questions` → `interviewController.getQuestions` and `POST /api/interview/answer` → `interviewController.submitAnswer`. Both auth-protected.

### `server/routes/jobRoutes.js` *(NEW)*
Maps `POST /api/jobs/scrape` → `jobController.triggerScrape` and `GET /api/jobs/recommendations` → `jobController.getSavedJobs`. Both auth-protected.

### `server/routes/resultRoutes.js`
Maps `POST /api/results/save` → `resultController.saveResult` and `GET /api/results/history` → `resultController.getHistory`. Both auth-protected.

### `server/uploads/`
Temporary folder where Multer stores uploaded PDFs. Files are deleted by the controller after being forwarded to the ML service. This folder should be in `.gitignore`.

---

## C. ML SERVICE (Python + FastAPI)

### `ml_service/app.py`
The FastAPI entry point. Imports and registers all route handlers. Includes CORS middleware so the Node backend (and optionally the frontend) can call it. Each endpoint calls the appropriate service function.

Key endpoints:
- `POST /parse-resume` — file upload → text + skills + score
- `POST /generate-questions` — skills list → question list
- `POST /evaluate-answer` — question + answer → score + feedback
- `POST /scrape-jobs` *(NEW)* — skills + interview score → ranked job list

### `ml_service/services/resume_parser.py`
Uses `pdfplumber` to open the uploaded PDF file and extract text page by page. Returns a single concatenated string. Handles multi-column layouts and empty pages gracefully.

### `ml_service/services/skill_extractor.py`
Takes the raw resume text and extracts skills in two ways:
1. **Keyword matching** against a curated list of ~100 tech/domain skills
2. **spaCy NER** to catch organization names, product names, and tools not in the keyword list

Returns a deduplicated list of skills found.

### `ml_service/services/skill_matcher.py`
Takes resume text and a job description text. Vectorizes both using TF-IDF and computes cosine similarity. Returns a match score from 0–100. This is the core algorithm for the resume scoring feature.

### `ml_service/services/question_generator.py`
Maps each extracted skill to a pool of questions stored in a dictionary. Randomly selects questions proportional to the user's skill set. Supports difficulty levels (easy/medium/hard) so the system can adapt based on the user's resume score — higher score → harder questions.

### `ml_service/services/answer_evaluator.py`
For each question, compares the user's answer to a reference ideal answer using TF-IDF cosine similarity. Returns a score (0–100) and a categorical feedback string. Falls back to a partial credit score if no reference answer exists.

### `ml_service/services/job_scraper.py` *(NEW)*
The core of the new module. Uses `requests` + `BeautifulSoup` to scrape job listings. Targets:
- **LinkedIn Jobs** (public search, no login required for basic listings)
- **Indeed** (via search URL parameters)

Accepts a list of skills and a job role keyword. Builds a search URL, fetches the HTML, parses job cards (title, company, location, link), and returns a list of raw job objects. Rate-limited with random delays to avoid blocking.

```python
# Example usage inside the file:
# jobs = scrape_jobs(skills=["python", "react"], role="software engineer", max_results=10)
```

> **Note for lab demo:** If live scraping is blocked during demo, the scraper has a `use_mock=True` fallback that returns a static JSON of 10 realistic job listings.

### `ml_service/recommender/job_ranker.py` *(NEW)*
Takes the list of raw scraped job objects and the user's skill list + interview score. For each job:
1. Extracts required skills from the job description (same skill extractor)
2. Computes skill overlap score (Jaccard similarity)
3. Weights the score by interview performance (higher interview score boosts ranking)
4. Returns jobs sorted by final weighted score, descending

### `ml_service/recommender/content_filter.py` *(NEW)*
Filters out:
- Duplicate job listings (same title + company)
- Jobs with 0% skill overlap
- Listings that are clearly not relevant (intern-only for a senior search, etc.)

Applied before ranking so `job_ranker.py` only sees clean, relevant data.

### `ml_service/models/train_classifier.py`
Loads the resume dataset CSV. Fits a TF-IDF vectorizer on resume text. Trains three classifiers (Logistic Regression, Naive Bayes, Random Forest) using 5-fold cross-validation. Prints accuracy and F1 scores. Saves all models and the vectorizer as `.pkl` files.

### `ml_service/models/evaluate_models.py`
Loads the saved `.pkl` models and runs them on a held-out test set. Prints a comparison table with Accuracy, Precision, Recall, F1 for each model. Used during the Data Mining lab demo to justify model selection.

### `ml_service/notebooks/EDA.ipynb`
Jupyter notebook for Exploratory Data Analysis on the resume dataset. Contains:
- Class distribution bar chart (how many resumes per job category)
- Word clouds per category
- Skill frequency histograms
- Missing value analysis

### `ml_service/notebooks/model_comparison.ipynb`
Side-by-side comparison of model performance using charts. Shows CV scores per fold, average accuracy, and confusion matrices. This is your visual evidence for the Data Mining lab.

### `ml_service/data/raw/resume_dataset.csv`
Downloaded from Kaggle. Contains ~2400 resumes labeled by job category (e.g., "Data Science", "Web Development"). Used to train the resume classifier.

### `ml_service/data/raw/job_descriptions.csv`
Downloaded from Kaggle. Contains job postings with required skills. Used for testing the skill matcher and as ground truth for the job recommender.

### `ml_service/data/processed/tfidf_matrix.pkl`
The pre-computed TF-IDF matrix saved after training. Allows faster inference without re-vectorizing the corpus every time.

### `ml_service/data/processed/skill_index.json`
A JSON dictionary mapping skill names to their index in the TF-IDF feature space. Used for fast skill lookup in the recommender.

### `ml_service/requirements.txt`
Lists all Python dependencies. Install with: `pip install -r requirements.txt --break-system-packages`

---

# SECTION 4: DATA FLOW (How Everything Connects)

```
User (Browser)
    │
    ▼
client/ (React)
    │  HTTP via api.js (Axios + JWT)
    ▼
server/ (Express API — Port 5000)
    │  Mongoose
    ▼
MongoDB (resume_system DB)
    │
    │  Also: server → ml_service via internal HTTP (axios)
    ▼
ml_service/ (FastAPI — Port 8000)
    │
    ├── resume_parser.py      (PDF → text)
    ├── skill_extractor.py    (text → skills)
    ├── skill_matcher.py      (resume vs job → score)
    ├── question_generator.py (skills → questions)
    ├── answer_evaluator.py   (answer → score)
    └── job_scraper.py        (skills → live jobs)  ← NEW
         └── job_ranker.py   (jobs → ranked list)   ← NEW
```

**Example flow for Job Recommendation:**
1. User completes interview → Results page shows "Find Matching Jobs" button
2. React calls `POST /api/jobs/scrape` with `{ skills, interviewScore }`
3. Express controller calls `POST http://localhost:8000/scrape-jobs`
4. FastAPI calls `job_scraper.py` → fetches live listings from LinkedIn/Indeed
5. `content_filter.py` cleans duplicates and irrelevant listings
6. `job_ranker.py` scores each job against the user's skills and interview score
7. Ranked list returns to Express → saved in `ScrapedJob` MongoDB collection → sent to React
8. React renders `JobCard` components sorted by match score

---

# SECTION 5: MEMBER MODULE DIVISION

Each member owns one complete vertical — they can independently explain and demo their slice of the system.

### Member 1 — Keyan Majid (Team Lead)
**Domain: Backend API + Resume Processing**
Files owned:
- `server/` — entire backend
- `ml_service/services/resume_parser.py`
- `ml_service/services/skill_extractor.py`
- `ml_service/services/skill_matcher.py`

**Demo script:** Start MongoDB + server. Register a user. Upload a PDF resume. Show the Postman API call to `/api/resume/upload`. Show MongoDB Compass with the saved Resume document. Explain JWT auth flow.

---

### Member 2 — Zohaib Arshad Noor
**Domain: Data Mining / ML + Job Scraping**
Files owned:
- `ml_service/models/train_classifier.py`
- `ml_service/models/evaluate_models.py`
- `ml_service/services/question_generator.py`
- `ml_service/services/answer_evaluator.py`
- `ml_service/services/job_scraper.py`        ← NEW
- `ml_service/recommender/job_ranker.py`       ← NEW
- `ml_service/recommender/content_filter.py`   ← NEW
- `ml_service/notebooks/`
- `ml_service/data/`

**Demo script:** Open `EDA.ipynb` and walk through dataset charts. Run `train_classifier.py` live — show 5-fold CV results printing. Open `evaluate_models.py` — show model comparison table. Then show FastAPI Swagger at `:8000/docs`. Call `/scrape-jobs` with a sample payload and show ranked job results returned.

---

### Member 3 — Ifrahim Yousuf
**Domain: Frontend (React)**
Files owned:
- `client/` — entire frontend

**Demo script:** Show the full user journey in the browser: Register → Login → Upload Resume (show skill badges appear) → Start Interview (answer 3 questions, see scores) → Job Recommendations page (show ranked job cards with match %) → Results page (show score chart and history).

---

# SECTION 6: ML MODELS — RECOMMENDATIONS FOR DATA MINING LAB

The original proposal listed Logistic Regression and Naive Bayes. Here are all recommended models with justification for this specific project:

## Models to Use

### 1. Logistic Regression (Original — Keep)
**Use case:** Resume category classification (classify a resume as "Data Science", "Web Dev", etc.)
**Why:** Fast, interpretable, works well with TF-IDF text features.
**In code:** `sklearn.linear_model.LogisticRegression`

### 2. Multinomial Naive Bayes (Original — Keep)
**Use case:** Same resume classification task
**Why:** Designed for text frequency data (TF-IDF output). Fast training, good baseline for comparison.
**In code:** `sklearn.naive_bayes.MultinomialNB`

### 3. Random Forest Classifier *(NEW — Add)*
**Use case:** Answer quality classification (classify an answer as "Good", "Partial", "Weak")
**Why:** Handles non-linear feature relationships better than LR/NB. More robust to noisy text. Excellent for demonstrating ensemble methods in the lab.
**In code:** `sklearn.ensemble.RandomForestClassifier`

### 4. TF-IDF + Cosine Similarity (Already present — Core algorithm)
**Use case:** Resume-to-job matching, answer evaluation
**Why:** This is the backbone of the recommender. It is a data mining technique (text similarity mining) and must be demonstrated. Very visual for a lab demo.
**In code:** `sklearn.feature_extraction.text.TfidfVectorizer` + `sklearn.metrics.pairwise.cosine_similarity`

### 5. Jaccard Similarity *(NEW — Add for Job Ranker)*
**Use case:** Skill-set overlap between user's skills and job's required skills
**Why:** Set-based similarity. Simple to explain ("how many skills match out of total unique skills"). Complements cosine similarity nicely for the recommender module. Shows you used multiple similarity metrics — strong for Data Mining lab.
**Formula:** `|A ∩ B| / |A ∪ B|` — no library needed, pure Python.

### 6. KNN Classifier *(Optional — Add if needed for equal weightage with CSC-460)*
**Use case:** Classify a user's interview performance level (Beginner/Intermediate/Expert) based on answer scores
**Why:** You already used KNN in your CSC-460 assignment on Iris/Titanic. Using it here ties your academic and project work together. Easy to explain.
**In code:** `sklearn.neighbors.KNeighborsClassifier`

## Suggested Model Comparison Table for Demo

| Model | Task | CV Accuracy | F1 Score |
|---|---|---|---|
| Logistic Regression | Resume Classification | ~85-90% | ~0.87 |
| Naive Bayes | Resume Classification | ~80-85% | ~0.82 |
| Random Forest | Answer Scoring | ~78-84% | ~0.80 |
| KNN (k=5) | Performance Level | ~75-80% | ~0.77 |
| TF-IDF Cosine | Resume-Job Match | N/A (similarity) | — |
| Jaccard | Skill Overlap | N/A (similarity) | — |

---

# SECTION 7: MONGODB COLLECTIONS SUMMARY

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | name, email, password | Authentication |
| `resumes` | userId, extractedSkills, resumeScore, rawText | Resume analysis results |
| `questions` | jobRole, questionText, difficulty | Interview question bank |
| `answers` | userId, questionId, answerText, score | Per-answer records |
| `scrapedjobs` | userId, title, company, jobUrl, matchScore | Live job recommendations |
| `results` | userId, resumeScore, interviewScore, feedback | Final aggregated result per session |

---

# SECTION 8: COMPLETE SETUP COMMANDS

```bash
# 1. Clone/init the repo
mkdir resume-interview-system && cd resume-interview-system
git init

# 2. Backend
mkdir server && cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken multer cors dotenv axios form-data
cd ..

# 3. Frontend
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom recharts
npm install -D tailwindcss @tailwindcss/vite
cd ..

# 4. ML Service
mkdir ml_service && cd ml_service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn scikit-learn pandas pdfplumber spacy \
            python-multipart joblib numpy requests beautifulsoup4 lxml
python -m spacy download en_core_web_sm
cd ..
```

---

# SECTION 9: RUNNING THE PROJECT

```bash
# Terminal 1 — MongoDB
mongod

# Terminal 2 — Node Backend
cd server
node index.js
# → http://localhost:5000

# Terminal 3 — Python ML Service
cd ml_service
source venv/bin/activate
uvicorn app:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI — show in demo)

# Terminal 4 — React Frontend
cd client
npm run dev
# → http://localhost:5173
```

---

# SECTION 10: DEMO SCRIPTS FOR EACH LAB

## Web Engineering Lab (Keyan leads backend, Ifrahim leads frontend)
1. Start all four terminals
2. Open browser at `localhost:5173`
3. Register new user → show JWT token in localStorage (DevTools → Application)
4. Upload a PDF resume → show skill badges extracted
5. Navigate to Interview page → complete a 3-question session
6. Navigate to Job Recommendations → show ranked job cards
7. Open Postman — show `POST /api/auth/login`, `POST /api/resume/upload`, `GET /api/jobs/recommendations` as REST API evidence
8. Open MongoDB Compass — show `users`, `resumes`, `scrapedjobs` collections live

## Data Mining Lab (Zohaib leads)
1. Open `notebooks/EDA.ipynb` in Jupyter → walk through class distribution chart and word cloud
2. Run `python models/train_classifier.py` in terminal → show 5-fold CV printing live
3. Open `notebooks/model_comparison.ipynb` → show bar chart comparing model accuracies
4. Open browser at `localhost:8000/docs` (FastAPI Swagger)
5. Call `POST /scrape-jobs` with `{"skills": ["python", "machine learning"], "interview_score": 72}` → show ranked JSON response
6. Explain TF-IDF vectorization visually using the EDA notebook
7. Explain Jaccard similarity for skill matching with a whiteboard example

---

# SECTION 11: QUICK CHECKLIST BEFORE DEMO

- [ ] MongoDB running (`mongod`)
- [ ] `server/.env` has correct MONGO_URI and JWT_SECRET
- [ ] `ml_service/data/raw/resume_dataset.csv` downloaded from Kaggle
- [ ] `python train_classifier.py` run at least once (creates `.pkl` files)
- [ ] `job_scraper.py` tested with mock mode (`use_mock=True`) as fallback
- [ ] At least one test user registered in the system before the demo
- [ ] Sample resume PDF ready to upload
- [ ] GitHub repo has three branches: `keyan/backend`, `zohaib/ml`, `ifrahim/frontend`
- [ ] MongoDB Compass installed for visual DB demo
- [ ] Postman collection exported for API demo

---

# SECTION 12: .gitignore

```
# Node
node_modules/
server/uploads/
*.env

# Python
ml_service/venv/
ml_service/__pycache__/
ml_service/models/saved/*.pkl
ml_service/data/raw/*.csv
*.pyc

# Misc
.DS_Store
dist/
```
