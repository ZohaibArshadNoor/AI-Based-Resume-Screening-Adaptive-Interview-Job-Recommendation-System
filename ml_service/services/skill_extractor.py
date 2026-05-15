import pandas as pd
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SKILLS_FILE = BASE_DIR / "data" / "raw" / "skills.csv"


class SkillExtractor:

    def __init__(self):
        self.skills_db = self.load_skills()

    def load_skills(self):
        df = pd.read_csv(SKILLS_FILE)

        # Keep ORIGINAL casing for output
        skills = [str(skill).strip() for skill in df["Skill"].dropna().tolist()]

        # Create mapping for fast matching (normalized → original)
        self.skill_map = {skill.lower(): skill for skill in skills}

        return list(self.skill_map.keys())  # normalized skills only

    def clean_text(self, text):
        text = text.lower()
        text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text

    def extract_skills(self, resume_text):

        cleaned_text = self.clean_text(resume_text)

        extracted_skills = set()

        for skill in self.skills_db:

            pattern = r"\b" + re.escape(skill) + r"\b"

            if re.search(pattern, cleaned_text):
                # convert back to ORIGINAL format using mapping
                extracted_skills.add(self.skill_map[skill])

        return sorted(list(extracted_skills))