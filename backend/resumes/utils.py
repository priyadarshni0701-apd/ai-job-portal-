import re
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .skills_data import SKILL_KEYWORDS


# ─────────────────────────────────────────────
#  PDF TEXT EXTRACTION
# ─────────────────────────────────────────────

def extract_text_from_pdf(file_path):
    """Extract all text from a PDF file."""
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"[PDF Extraction Error] {e}")
    return text.strip()


# ─────────────────────────────────────────────
#  SKILL EXTRACTION
# ─────────────────────────────────────────────

def extract_skills_from_text(text):
    """
    Match skill keywords from the master list against
    the extracted resume text. Case-insensitive.
    """
    if not text:
        return []

    text_lower = text.lower()
    found_skills = []

    for skill in SKILL_KEYWORDS:
        # Use word boundary matching for accurate detection
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill.title())

    # Deduplicate while preserving order
    seen = set()
    unique_skills = []
    for s in found_skills:
        if s.lower() not in seen:
            seen.add(s.lower())
            unique_skills.append(s)

    return unique_skills


# ─────────────────────────────────────────────
#  AI MATCH PERCENTAGE (Cosine Similarity)
# ─────────────────────────────────────────────

def calculate_match_percentage(user, job):
    """
    Compare extracted resume skills against job required skills
    using TF-IDF cosine similarity.
    Returns a float between 0.0 and 100.0
    """
    try:
        resume = user.resumes.filter(is_active=True).latest("uploaded_at")
        resume_skills = resume.extracted_skills

        if not resume_skills or not job.required_skills:
            return 0.0

        resume_text = " ".join(resume_skills).lower()
        job_text = " ".join(job.required_skills).lower()

        # TF-IDF Vectorizer
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([resume_text, job_text])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

        percentage = round(float(similarity) * 100, 2)
        return min(percentage, 100.0)

    except Exception as e:
        print(f"[Match Error] {e}")
        return 0.0


# ─────────────────────────────────────────────
#  RECOMMENDED JOBS FOR A SEEKER
# ─────────────────────────────────────────────

def get_recommended_jobs(user, jobs_queryset, top_n=10):
    """
    Score and rank all active jobs for a seeker
    based on cosine similarity with their resume.
    Returns list of dicts: {job, match_percentage}
    """
    try:
        resume = user.resumes.filter(is_active=True).latest("uploaded_at")
        resume_skills = resume.extracted_skills

        if not resume_skills:
            return []

        resume_text = " ".join(resume_skills).lower()
        results = []

        for job in jobs_queryset:
            if not job.required_skills:
                continue
            job_text = " ".join(job.required_skills).lower()
            try:
                vectorizer = TfidfVectorizer()
                vectors = vectorizer.fit_transform([resume_text, job_text])
                similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
                match_pct = round(float(similarity) * 100, 2)
            except Exception:
                match_pct = 0.0

            results.append({"job": job, "match_percentage": match_pct})

        # Sort by match descending
        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return results[:top_n]

    except Exception as e:
        print(f"[Recommendation Error] {e}")
        return []