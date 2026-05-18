import pandas as pd
import re
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = (
    BASE_DIR.parent / "data" / "raw" / "Resume-Classification-Dataset.csv"
)

MODEL_DIR = BASE_DIR / "saved"

MODEL_DIR.mkdir(exist_ok=True)


print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(df.columns)

print(df.isnull().sum())


# REMOVE NULLS
df = df.dropna(subset=["Category", "Text"])


def clean_resume(text):

    text = str(text).lower()

    text = re.sub(r"http\\S+", " ", text)

    text = re.sub(r"www\\S+", " ", text)

    text = re.sub(r"[^a-zA-Z0-9+# ]", " ", text)

    text = re.sub(r"\\s+", " ", text)

    return text.strip()


print("Cleaning dataset...")

df["Cleaned_Resume"] = df["Text"].apply(clean_resume)


X = df["Cleaned_Resume"]

y = df["Category"]


print("Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


print("Creating TF-IDF vectorizer...")

tfidf_vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)


print("Transforming text into vectors...")

X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)

X_test_tfidf = tfidf_vectorizer.transform(X_test)


print("Training Logistic Regression model...")

classifier_model = LogisticRegression(
    max_iter=1000
)

classifier_model.fit(
    X_train_tfidf,
    y_train
)


print("Predicting...")

predictions = classifier_model.predict(X_test_tfidf)


accuracy = accuracy_score(
    y_test,
    predictions
)

print(f"Accuracy: {accuracy * 100:.2f}%")

print(classification_report(
    y_test,
    predictions
))


print("Saving model...")

joblib.dump(
    classifier_model,
    MODEL_DIR / "resume_classifier.pkl"
)

print("Saving TF-IDF vectorizer...")

joblib.dump(
    tfidf_vectorizer,
    MODEL_DIR / "tfidf_vectorizer.pkl"
)

print("Training complete.")