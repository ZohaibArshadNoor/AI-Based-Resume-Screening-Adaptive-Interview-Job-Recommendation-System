# AI-Based Resume Screening & Adaptive Interview Evaluation System
## Complete Project Guide

---

## 1. FOLDER STRUCTURE

```
resume-interview-system/
│
├── client/                          ← React Frontend (Web Engineering Lab)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResumeUploader.jsx
│   │   │   ├── SkillGapCard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   └── ScoreChart.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── JobMatch.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Results.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          ← Node.js/Express Backend (Web Engineering Lab)
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   ├── interviewController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Job.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── resultRoutes.js
│   ├── uploads/                     ← Temp storage for uploaded resumes
│   ├── .env
│   ├── package.json
│   └── index.js
│
├── ml_service/                      ← Python ML Service (Data Mining Lab)
│   ├── data/
│   │   ├── raw/
│   │   │   ├── resume_dataset.csv       ← Dataset reference
│   │   │   └── job_descriptions.csv     ← Dataset reference
│   │   └── processed/
│   │       ├── tfidf_matrix.pkl
│   │       └── skill_index.json
│   ├── models/
│   │   ├── saved/
│   │   │   ├── logistic_model.pkl
│   │   │   ├── naive_bayes_model.pkl
│   │   │   └── tfidf_vectorizer.pkl
│   │   ├── train_classifier.py          ← Model training script
│   │   └── evaluate_models.py           ← Cross-validation & metrics
│   ├── notebooks/
│   │   ├── EDA.ipynb                    ← Exploratory Data Analysis
│   │   └── model_comparison.ipynb       ← Compare models
│   ├── services/
│   │   ├── resume_parser.py             ← PDF text extraction
│   │   ├── skill_extractor.py           ← NLP skill extraction
│   │   ├── skill_matcher.py             ← TF-IDF + Cosine Similarity
│   │   ├── question_generator.py        ← Adaptive question logic
│   │   └── answer_evaluator.py          ← ML-based answer scoring
│   ├── app.py                           ← FastAPI entry point
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 2. MEMBER MODULE DIVISION (Equal Weightage)

### Member 1 — Keyan Majid (Team Lead)
**Domain: Backend API + Resume Parsing**
- `server/` — entire backend (Node.js + Express + MongoDB)
- `ml_service/services/resume_parser.py`
- `ml_service/services/skill_extractor.py`
- `ml_service/services/skill_matcher.py`
- **Demonstrates:** User auth flow, resume upload → parsing → skill extraction → job match API

### Member 2 — Zohaib Arshad Noor
**Domain: Data Mining / ML Pipeline**
- `ml_service/models/train_classifier.py`
- `ml_service/models/evaluate_models.py`
- `ml_service/services/question_generator.py`
- `ml_service/services/answer_evaluator.py`
- `ml_service/notebooks/`
- `ml_service/data/`
- **Demonstrates:** Model training, cross-validation results, live answer evaluation scoring

### Member 3 — Ifrahim Yousuf
**Domain: Frontend (React)**
- `client/` — entire frontend
- **Demonstrates:** Full UI walkthrough: register → upload resume → job select → interview session → results dashboard

---

## 3. DATASETS (Free, No Account Needed)

| Dataset | Use | Link |
|---|---|---|
| Resume Dataset (Kaggle) | Training skill classifier | https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset |
| Job Description Dataset | Job-skill matching | https://www.kaggle.com/datasets/ravindrasinghrana/job-description-dataset |
| UpdatedResumeDataSet.csv | Backup resume training data | Already on Kaggle (search: "resume screening dataset") |

> Save downloaded CSVs to `ml_service/data/raw/`

---

## 4. STEP-BY-STEP SETUP GUIDE

---

### PHASE 1: Project Initialization

```bash
mkdir resume-interview-system
cd resume-interview-system
git init
```

---

### PHASE 2: Backend Setup (Member 1)

```bash
mkdir server && cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken multer cors dotenv pdfparse
```

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_system
JWT_SECRET=your_secret_key_here
ML_SERVICE_URL=http://localhost:8000
```

**server/index.js**
```js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
```

**server/config/db.js**
```js
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
```

**server/models/User.js**
```js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
```

**server/models/Resume.js**
```js
const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  extractedSkills: [String],
  resumeScore: Number,
  rawText: String,
}, { timestamps: true });
module.exports = mongoose.model('Resume', ResumeSchema);
```

**server/models/Result.js**
```js
const mongoose = require('mongoose');
const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeScore: Number,
  interviewScore: Number,
  feedback: String,
}, { timestamps: true });
module.exports = mongoose.model('Result', ResultSchema);
```

**server/middleware/authMiddleware.js**
```js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
```

**server/controllers/authController.js**
```js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
```

**server/routes/authRoutes.js**
```js
const router = require('express').Router();
const { register, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
module.exports = router;
```

**server/controllers/resumeController.js**
```js
const axios = require('axios');
const Resume = require('../models/Resume');

exports.uploadResume = async (req, res) => {
  try {
    // Send file to Python ML service
    const FormData = require('form-data');
    const fs = require('fs');
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));

    const mlRes = await axios.post(
      `${process.env.ML_SERVICE_URL}/parse-resume`,
      form,
      { headers: form.getHeaders() }
    );

    const { skills, score, raw_text } = mlRes.data;
    const resume = await Resume.create({
      userId: req.user.id,
      extractedSkills: skills,
      resumeScore: score,
      rawText: raw_text,
    });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
```

**server/middleware/uploadMiddleware.js**
```js
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
```

**server/routes/resumeRoutes.js**
```js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume } = require('../controllers/resumeController');
router.post('/upload', auth, upload.single('resume'), uploadResume);
module.exports = router;
```

---

### PHASE 3: ML Service Setup (Member 2)

```bash
cd ../ml_service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn scikit-learn pandas pdfplumber spacy python-multipart joblib
python -m spacy download en_core_web_sm
```

**ml_service/requirements.txt**
```
fastapi
uvicorn
scikit-learn
pandas
pdfplumber
spacy
python-multipart
joblib
numpy
```

**ml_service/services/resume_parser.py**
```python
import pdfplumber

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()
```

**ml_service/services/skill_extractor.py**
```python
import spacy

nlp = spacy.load("en_core_web_sm")

SKILL_KEYWORDS = [
    "python", "java", "javascript", "react", "node.js", "mongodb", "sql",
    "machine learning", "deep learning", "nlp", "tensorflow", "scikit-learn",
    "html", "css", "git", "docker", "aws", "data analysis", "pandas", "numpy"
]

def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found = [skill for skill in SKILL_KEYWORDS if skill in text_lower]
    return list(set(found))
```

**ml_service/services/skill_matcher.py**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_match_score(resume_text: str, job_description: str) -> float:
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, job_description])
    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return round(float(score) * 100, 2)
```

**ml_service/services/question_generator.py**
```python
import random

QUESTION_BANK = {
    "python": [
        "Explain list comprehensions in Python.",
        "What is the difference between a list and a tuple?",
        "How does Python's GIL work?"
    ],
    "machine learning": [
        "What is overfitting and how do you prevent it?",
        "Explain bias-variance tradeoff.",
        "What is cross-validation?"
    ],
    "javascript": [
        "What is event bubbling in JavaScript?",
        "Explain closures with an example.",
        "What is the difference between == and ===?"
    ],
    "react": [
        "What are React hooks?",
        "Explain the component lifecycle.",
        "What is the virtual DOM?"
    ],
    "sql": [
        "What is the difference between INNER JOIN and LEFT JOIN?",
        "Explain normalization.",
        "What are indexes and why are they used?"
    ],
    "default": [
        "Describe a challenging project you worked on.",
        "How do you approach debugging a complex problem?",
        "What is your development process for a new feature?"
    ]
}

def generate_questions(skills: list, num_questions: int = 5) -> list:
    questions = []
    for skill in skills:
        skill_lower = skill.lower()
        if skill_lower in QUESTION_BANK:
            questions.extend(QUESTION_BANK[skill_lower])
    if not questions:
        questions = QUESTION_BANK["default"]
    random.shuffle(questions)
    return questions[:num_questions]
```

**ml_service/services/answer_evaluator.py**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

IDEAL_ANSWERS = {
    "Explain list comprehensions in Python.":
        "List comprehensions provide a concise way to create lists using a single line with optional conditions and iteration.",
    "What is overfitting and how do you prevent it?":
        "Overfitting occurs when a model learns noise from training data. Prevention includes regularization, cross-validation, dropout, and more data.",
    "What are React hooks?":
        "React hooks are functions that let you use state and other React features in functional components. Examples: useState, useEffect.",
}

def evaluate_answer(question: str, user_answer: str) -> dict:
    ideal = IDEAL_ANSWERS.get(question, "")
    if not ideal or not user_answer.strip():
        return {"score": 50, "feedback": "Answer recorded. No reference available for auto-scoring."}

    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([user_answer, ideal])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    score = round(similarity * 100)

    if score >= 70:
        feedback = "Good answer! You covered the key points."
    elif score >= 40:
        feedback = "Partial answer. Try to include more technical detail."
    else:
        feedback = "Needs improvement. Review the topic and try again."

    return {"score": score, "feedback": feedback}
```

**ml_service/models/train_classifier.py**
```python
import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib, os

# Load dataset (download from Kaggle and place in data/raw/)
df = pd.read_csv("../data/raw/resume_dataset.csv")

# Expected columns: 'Resume_str', 'Category'
X = df['Resume_str'].fillna("")
y = df['Category']

# Logistic Regression Pipeline
lr_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', LogisticRegression(max_iter=1000))
])

# Naive Bayes Pipeline
nb_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', MultinomialNB())
])

# 5-Fold Cross Validation (same as CSC-460 assignment)
lr_scores = cross_val_score(lr_pipeline, X, y, cv=5, scoring='accuracy')
nb_scores = cross_val_score(nb_pipeline, X, y, cv=5, scoring='accuracy')

print(f"Logistic Regression - CV Accuracy: {lr_scores.mean():.4f} ± {lr_scores.std():.4f}")
print(f"Naive Bayes         - CV Accuracy: {nb_scores.mean():.4f} ± {nb_scores.std():.4f}")

# Train final models on full data
lr_pipeline.fit(X, y)
nb_pipeline.fit(X, y)

os.makedirs("saved", exist_ok=True)
joblib.dump(lr_pipeline, "saved/logistic_model.pkl")
joblib.dump(nb_pipeline, "saved/naive_bayes_model.pkl")
print("Models saved.")
```

**ml_service/app.py**
```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.resume_parser import extract_text_from_pdf
from services.skill_extractor import extract_skills
from services.skill_matcher import compute_match_score
from services.question_generator import generate_questions
from services.answer_evaluator import evaluate_answer
import shutil, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    text = extract_text_from_pdf(path)
    skills = extract_skills(text)
    score = len(skills) * 5  # simple scoring: 5 pts per skill found
    os.remove(path)
    return {"skills": skills, "score": min(score, 100), "raw_text": text}

@app.post("/match-job")
async def match_job(data: dict):
    score = compute_match_score(data["resume_text"], data["job_description"])
    return {"match_score": score}

@app.post("/generate-questions")
async def get_questions(data: dict):
    questions = generate_questions(data["skills"])
    return {"questions": questions}

@app.post("/evaluate-answer")
async def eval_answer(data: dict):
    result = evaluate_answer(data["question"], data["answer"])
    return result

# Run: uvicorn app:app --reload --port 8000
```

---

### PHASE 4: Frontend Setup (Member 3)

```bash
cd ../client
npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom tailwindcss @tailwindcss/vite
```

**tailwind.config.js**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**client/src/services/api.js**
```js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
```

**client/src/context/AuthContext.jsx**
```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**client/src/App.jsx**
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobMatch from './pages/JobMatch';
import Interview from './pages/Interview';
import Results from './pages/Results';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

**client/src/pages/Login.jsx**
```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <input className="w-full border p-2 rounded mb-4" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full border p-2 rounded mb-4" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="text-center mt-4 text-sm">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}
```

**client/src/pages/Register.jsx**
```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>
        <input className="w-full border p-2 rounded mb-4" placeholder="Full Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border p-2 rounded mb-4" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full border p-2 rounded mb-4" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
        <p className="text-center mt-4 text-sm">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}
```

**client/src/pages/Dashboard.jsx**
```jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const cards = [
    { label: 'Upload Resume', path: '/upload', color: 'bg-blue-500' },
    { label: 'Match Jobs', path: '/jobs', color: 'bg-green-500' },
    { label: 'Start Interview', path: '/interview', color: 'bg-purple-500' },
    { label: 'View Results', path: '/results', color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-gray-500 mb-8">AI Resume & Interview Evaluation System</p>
      <div className="grid grid-cols-2 gap-6">
        {cards.map(c => (
          <Link to={c.path} key={c.path}
            className={`${c.color} text-white rounded-xl p-6 text-xl font-semibold hover:opacity-90 transition`}>
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**client/src/pages/ResumeUpload.jsx**
```jsx
import { useState } from 'react';
import API from '../services/api';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Select a PDF file first');
    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    try {
      const { data } = await API.post('/resume/upload', formData);
      setResult(data);
    } catch (err) {
      alert('Upload failed: ' + err.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
        className="block mb-4 border p-2 rounded w-full" />
      <button onClick={handleUpload} disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-50 border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3">Analysis Result</h3>
          <p><strong>Resume Score:</strong> {result.resumeScore}/100</p>
          <p className="mt-2"><strong>Extracted Skills:</strong></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.extractedSkills.map(s => (
              <span key={s} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**client/src/pages/Interview.jsx**
```jsx
import { useState } from 'react';
import axios from 'axios';

const ML_URL = 'http://localhost:8000';

export default function Interview() {
  const [skills, setSkills] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    const skillList = skills.split(',').map(s => s.trim());
    const { data } = await axios.post(`${ML_URL}/generate-questions`, { skills: skillList });
    setQuestions(data.questions);
    setLoading(false);
  };

  const submitAnswer = async (q) => {
    const { data } = await axios.post(`${ML_URL}/evaluate-answer`, {
      question: q, answer: answers[q] || ''
    });
    setScores(prev => ({ ...prev, [q]: data }));
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Interview Session</h2>
      <div className="flex gap-4 mb-6">
        <input className="flex-1 border p-2 rounded" placeholder="Enter skills e.g. python, react, sql"
          value={skills} onChange={e => setSkills(e.target.value)} />
        <button onClick={loadQuestions} disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          {loading ? 'Loading...' : 'Generate Questions'}
        </button>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="mb-6 bg-gray-50 border rounded-xl p-5">
          <p className="font-semibold mb-2">Q{i + 1}: {q}</p>
          <textarea rows={3} className="w-full border p-2 rounded mb-3"
            placeholder="Type your answer..."
            onChange={e => setAnswers(prev => ({ ...prev, [q]: e.target.value }))} />
          <button onClick={() => submitAnswer(q)}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            Submit Answer
          </button>
          {scores[q] && (
            <div className="mt-3 text-sm">
              <span className="font-semibold">Score: {scores[q].score}/100 — </span>
              <span className="text-gray-600">{scores[q].feedback}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**client/src/pages/Results.jsx**
```jsx
export default function Results() {
  // In production: fetch from API using userId
  const mockResult = {
    resumeScore: 72,
    interviewScore: 65,
    feedback: "Strong Python and React skills. Work on system design and SQL concepts."
  };

  const avg = Math.round((mockResult.resumeScore + mockResult.interviewScore) / 2);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Your Results</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Resume Score', val: mockResult.resumeScore, color: 'text-blue-600' },
          { label: 'Interview Score', val: mockResult.interviewScore, color: 'text-purple-600' },
          { label: 'Overall', val: avg, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 border rounded-xl p-5 text-center">
            <p className={`text-4xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <h3 className="font-semibold mb-2">💡 Feedback & Suggestions</h3>
        <p className="text-gray-700">{mockResult.feedback}</p>
      </div>
    </div>
  );
}
```

**client/src/components/Navbar.jsx**
```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">ResumeAI</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm">{user.name}</span>
            <button onClick={logout} className="bg-white text-blue-600 px-3 py-1 rounded text-sm">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 5. RUNNING THE PROJECT

```bash
# Terminal 1 — MongoDB
mongod

# Terminal 2 — Backend
cd server && node index.js

# Terminal 3 — ML Service
cd ml_service && uvicorn app:app --reload --port 8000

# Terminal 4 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- ML Service: http://localhost:8000/docs (Swagger UI auto-generated)

---

## 6. WHAT TO SHOW IN EACH LAB

### Web Engineering Lab (Member 3 leads demo)
- Register → Login (JWT auth)
- Upload resume PDF → show extracted skills
- Navigate through all pages
- Show React components, routing, Tailwind UI
- Show API calls via browser DevTools Network tab

### Data Mining Lab (Member 2 leads demo)
- Open `notebooks/EDA.ipynb` — show dataset exploration
- Run `train_classifier.py` — show 5-fold cross-validation output
- Show TF-IDF vectorizer logic
- Live demo: enter skills → generate questions → submit answers → show ML scoring
- Explain Logistic Regression vs Naive Bayes accuracy

---

## 7. QUICK CHECKLIST

- [ ] MongoDB installed and running locally
- [ ] Node.js v18+ installed
- [ ] Python 3.10+ with venv
- [ ] Resume dataset CSV downloaded from Kaggle into `ml_service/data/raw/`
- [ ] Run `train_classifier.py` before the Data Mining demo
- [ ] Test resume upload with a sample PDF before the Web Engineering demo
- [ ] Push everything to GitHub (one repo, three branches — one per member)
```
