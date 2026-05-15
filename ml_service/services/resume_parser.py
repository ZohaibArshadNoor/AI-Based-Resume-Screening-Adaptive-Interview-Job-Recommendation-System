import pdfplumber
from docx import Document
import os
import re

def parse_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def parse_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text

def parse_txt(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        return file.read()

def parse_tex(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        return file.read()

def extract_text(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return parse_pdf(file_path)
    elif extension == ".docx":
        return parse_docx(file_path)
    elif extension == ".txt":
        return parse_txt(file_path)
    elif extension == ".tex":
        return parse_tex(file_path)
    else:
        raise Exception(f"Unsupported file type: {extension}")
    
def extract_email(text):

    match = re.search(
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        text
    )

    return match.group(0) if match else None


def extract_phone(text):
    match = re.search(
        r"(\+92[\s-]?\d{3}[\s-]?\d{7}|0\d{10,11})",
        text
    )
    return match.group(0) if match else None


def extract_name(text):

    lines = text.split("\n")

    for line in lines[:5]:

        cleaned = line.strip()

        if (
            len(cleaned.split()) >= 2
            and len(cleaned) < 40
            and not any(char.isdigit() for char in cleaned)
        ):
            return cleaned

    return None 