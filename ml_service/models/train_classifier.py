import pandas as pd
import re
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = BASE_DIR / "data" / "raw" / "Resume-Classification-Dataset.csv"

MODEL_SAVE_PATH = BASE_DIR / "models" / "saved" / "resume_classifier.pkl"


def clean_text(text):

    text = str(text).lower()

    # remove line breaks
    text = re.sub(r"\r\n", " ", text)
    text = re.sub(r"\n", " ", text)

    # remove extra spaces
    text = re.sub(r"\s+", " ", text)

    # remove weird characters
    text = re.sub(r"[^a-zA-Z0-9+#./ ]", " ", text)

    return text.strip()


print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(df.columns)
print(df.isnull().sum())

# Remove rows with missing values
df = df.dropna(subset=["Category", "Text"])

print("Cleaning dataset...")

df["CleanedText"] = df["Text"].apply(clean_text)

X = df["CleanedText"]

y = df["Category"]

print("Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Building pipeline...")

model_pipeline = Pipeline([

    (
        "tfidf",
        TfidfVectorizer(
            stop_words="english",
            max_features=5000
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])

print("Training model...")

model_pipeline.fit(X_train, y_train)

print("Evaluating model...")

predictions = model_pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"\nAccuracy: {accuracy:.4f}\n")

print(classification_report(y_test, predictions))

print("Saving model...")

joblib.dump(model_pipeline, MODEL_SAVE_PATH)

print(f"Model saved at: {MODEL_SAVE_PATH}")