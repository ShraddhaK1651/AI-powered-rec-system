"""
FastAPI AI Service for Academic & Career Guidance System
Exposes Content-Based Recommendation Engine & RAG Institutional Assistant
"""

import os
import uvicorn
from io import BytesIO
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from recommendation_engine import RecommendationEngine
from rag_engine import RAGEngine

# Try PDF extractors
try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

app = FastAPI(
    title="AI Guidance Engine API",
    description="Python FastAPI Microservice for Content-Based Filtering & RAG Institutional Q&A",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
rec_engine = RecommendationEngine()
rag_engine = RAGEngine(persist_dir=os.getenv("CHROMA_PERSIST_DIR", "./chroma_db"))

# Pydantic Request Models
class StudentProfilePayload(BaseModel):
    name: Optional[str] = "Student"
    semester: Optional[int] = 5
    cgpa: Optional[float] = 7.5
    skills: List[str] = []
    programming_languages: List[str] = []
    interests: List[str] = []
    preferred_roles: List[str] = []
    target_role: Optional[str] = "Software Engineer"
    career_goals: Optional[str] = ""

class RecommendRequest(BaseModel):
    student_profile: StudentProfilePayload
    courses: Optional[List[Dict[str, Any]]] = []
    skills: Optional[List[Dict[str, Any]]] = []
    projects: Optional[List[Dict[str, Any]]] = []
    careers: Optional[List[Dict[str, Any]]] = []
    top_k: Optional[int] = 5

class SkillGapRequest(BaseModel):
    student_profile: StudentProfilePayload
    career: Dict[str, Any]

class RAGQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    similarity_threshold: Optional[float] = 0.35

class RAGDirectIngestRequest(BaseModel):
    doc_id: str
    filename: str
    text: str
    page_map: Optional[Dict[int, str]] = None

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Guidance Microservice",
        "gemini_active": bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")),
        "chroma_docs_count": len(rag_engine.list_documents())
    }

# ----------------- Recommendation Endpoints ----------------- #

@app.post("/api/recommend/all")
def recommend_all(req: RecommendRequest):
    """Generates recommendations across courses, skills, capstone projects, and career paths."""
    profile_dict = req.student_profile.model_dump()
    top_k = req.top_k or 5

    rec_courses = rec_engine.recommend_courses(profile_dict, req.courses or [], top_k)
    rec_skills = rec_engine.recommend_skills(profile_dict, req.skills or [], top_k)
    rec_projects = rec_engine.recommend_projects(profile_dict, req.projects or [], top_k)
    rec_careers = rec_engine.recommend_careers(profile_dict, req.careers or [], top_k)

    return {
        "student_profile": profile_dict,
        "recommendations": {
            "courses": rec_courses,
            "skills": rec_skills,
            "projects": rec_projects,
            "careers": rec_careers
        }
    }

@app.post("/api/recommend/courses")
def recommend_courses_endpoint(req: RecommendRequest):
    profile_dict = req.student_profile.model_dump()
    return rec_engine.recommend_courses(profile_dict, req.courses or [], req.top_k or 5)

@app.post("/api/recommend/skills")
def recommend_skills_endpoint(req: RecommendRequest):
    profile_dict = req.student_profile.model_dump()
    return rec_engine.recommend_skills(profile_dict, req.skills or [], req.top_k or 5)

@app.post("/api/recommend/projects")
def recommend_projects_endpoint(req: RecommendRequest):
    profile_dict = req.student_profile.model_dump()
    return rec_engine.recommend_projects(profile_dict, req.projects or [], req.top_k or 5)

@app.post("/api/recommend/careers")
def recommend_careers_endpoint(req: RecommendRequest):
    profile_dict = req.student_profile.model_dump()
    return rec_engine.recommend_careers(profile_dict, req.careers or [], req.top_k or 5)

@app.post("/api/recommend/skill-gap")
def skill_gap_endpoint(req: SkillGapRequest):
    profile_dict = req.student_profile.model_dump()
    return rec_engine.analyze_skill_gap(profile_dict, req.career)

# ----------------- RAG Chatbot & Document Ingestion ----------------- #

@app.post("/api/rag/ingest-text")
def ingest_text_endpoint(req: RAGDirectIngestRequest):
    res = rag_engine.ingest_document(
        doc_id=req.doc_id,
        filename=req.filename,
        text=req.text,
        page_map=req.page_map
    )
    return res

@app.post("/api/rag/upload-document")
async def upload_document_endpoint(
    doc_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Accepts PDF or TXT file, parses text, and passes it into the vector database."""
    filename = file.filename
    content_bytes = await file.read()
    
    # Check file size (e.g., 10MB limit)
    if len(content_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

    full_text = ""
    page_map = {}

    if filename.lower().endswith(".pdf"):
        if not HAS_PYPDF:
            raise HTTPException(status_code=500, detail="PDF parser library (pypdf) is not available.")
        try:
            reader = pypdf.PdfReader(BytesIO(content_bytes))
            for idx, page in enumerate(reader.pages):
                extracted = page.extract_text() or ""
                if extracted.strip():
                    page_map[idx + 1] = extracted
                    full_text += f"\n--- Page {idx + 1} ---\n" + extracted
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {e}")
    elif filename.lower().endswith((".txt", ".md", ".csv")):
        try:
            full_text = content_bytes.decode("utf-8", errors="replace")
            page_map[1] = full_text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to decode text file: {e}")
    else:
        raise HTTPException(status_code=400, detail="Unsupported document format. Please upload PDF or TXT files.")

    if not full_text.strip():
        raise HTTPException(status_code=400, detail="Document appears to be empty or contains no extractable text.")

    res = rag_engine.ingest_document(
        doc_id=doc_id,
        filename=filename,
        text=full_text,
        page_map=page_map
    )
    return res

@app.post("/api/rag/query")
def rag_query_endpoint(req: RAGQueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    return rag_engine.query_rag(
        query=req.query,
        top_k=req.top_k or 5,
        similarity_threshold=req.similarity_threshold or 0.35
    )

@app.get("/api/rag/documents")
def list_documents_endpoint():
    return rag_engine.list_documents()

@app.delete("/api/rag/documents/{doc_id}")
def delete_document_endpoint(doc_id: str):
    res = rag_engine.delete_document(doc_id)
    return res

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Python AI Service on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
