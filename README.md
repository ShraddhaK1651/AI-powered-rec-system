# AI-Powered Personalized Academic and Career Guidance System
## VII-Semester Computer Science & Engineering Major Project

![Project Status](https://img.shields.io/badge/Status-Complete-emerald)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TailwindCSS-indigo)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Mongoose-green)
![AI Service](https://img.shields.io/badge/AI%20Microservice-Python%20%7C%20FastAPI%20%7C%20ChromaDB%20%7C%20LangChain-blue)
![Embeddings](https://img.shields.io/badge/Embeddings-sentence--transformers%2Fall--MiniLM--L6--v2-orange)

An intelligent, multi-tier web application built to solve academic misalignment and career skill gaps for engineering students. The platform replaces static departmental portals and ungrounded chatbots with **content-based recommendation algorithms**, **quantitative skill-gap roadmaps**, and an **institution-grounded Retrieval-Augmented Generation (RAG) assistant**.

---

## 1. System Architecture Overview

The system employs a 3-tier decoupled microservice architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER (React 19 + Vite)                   │
│   • Tailwind CSS (Navy & Indigo SaaS Aesthetic)  • Lucide React Icons  │
│   • Recharts Competency Radar & Skill Gauges    • Axios JWT Client     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (Port 5000)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API TIER (Node.js + Express)               │
│   • MVC Architecture (Controllers, Routes, Models, Middleware)         │
│   • JWT Auth & Role-Based Guarding ('student' vs 'admin')              │
│   • MongoDB with Mongoose (Atlas support + Embedded Memory Fallback)   │
│   • Multer Document Ingestion Pipeline (PDF / TXT, max 10MB)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Internal HTTP / JSON (Port 8000)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  AI & RAG MICROSERVICE (Python FastAPI)                │
│   • Content-Based Multi-Factor Recommendation Engine (Scikit-Learn)    │
│   • Vector Embeddings (sentence-transformers/all-MiniLM-L6-v2)         │
│   • Persistent Vector Database (ChromaDB)                              │
│   • LangChain Grounded Orchestrator & Google Gemini Integration        │
│   • Deterministic Extractive Grounding Fallback (Offline Viva Support) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Modules & Technical Specifications

### A. Explainable Content-Based Recommendation Engine
Unlike black-box or random recommenders, EduPath AI implements an explainable multi-factor scoring formula:

$$\text{Overall Score} = w_1 \cdot \text{Skill Match} + w_2 \cdot \text{Interest Match} + w_3 \cdot \text{Career Match} + w_4 \cdot \text{Academic Match}$$

- **Skill Match ($w_1 = 0.40$):** Cosine similarity between student skill tokens and course/project competency requirements.
- **Interest Match ($w_2 = 0.30$):** Semantic alignment between student domain interests and course tags.
- **Career Match ($w_3 = 0.20$):** Alignment against the student's chosen career path.
- **Academic Match ($w_4 = 0.10$):** CGPA threshold verification and semester eligibility checks.
- **Deterministic Ranking:** Consistent tie-breaking ensures identical inputs yield deterministic results.

Recommendations are generated across 4 distinct categories:
1. **Academic Courses & Electives:** Title, code, credits, minimum CGPA, prerequisites, component scores, and explanation.
2. **High-Priority Skills:** Acquired vs missing skills, priority rating, and curated learning documentation.
3. **Capstone Projects:** Problem statements, full technology stacks, difficulty ratings, and evaluation outcomes.
4. **Career Paths:** Salary bands, YoY growth velocity, and prerequisite skill checklists.

### B. Quantitative Skill-Gap Analysis & 12-Week Roadmap
- Compares student verified skills against standard industry roles (Full Stack Developer, ML Engineer, Cloud Solutions Architect, Cybersecurity Analyst).
- Categorizes missing skills into **High-Priority Immediate Gaps**, **Secondary Applied Competencies**, and **Recommended Skills**.
- Generates a sequential **3-Phase 12-Week Bridge Roadmap**:
  - *Phase 1 (Weeks 1-4):* Core Fundamentals & Immediate Gaps.
  - *Phase 2 (Weeks 5-8):* Applied Tooling & Frameworks.
  - *Phase 3 (Weeks 9-12):* Capstone Portfolio & Production Readiness.

### C. RAG-Based Academic AI Assistant
Answers student questions strictly grounded on official institutional documents (syllabus, academic regulations, elective circulars, and capstone rules):
- **Document Chunking:** `RecursiveCharacterTextSplitter` configured for **800 characters** with **150 characters overlap**.
- **Vector Storage:** Persistent ChromaDB collection indexed with `all-MiniLM-L6-v2`.
- **Retrieval Threshold:** Top-$K = 5$ chunks filtered with a cosine similarity threshold ($\ge 0.35$).
- **Anti-Hallucination Safeguard:** If insufficient institutional evidence exists, the assistant explicitly states:
  > *"The available institutional documents do not provide enough information to answer this question. Please consult your academic coordinator."*
- **Structured Source Citations:** Every response includes verifiable citations (Document Name, Page Number, Relevance Score %, and excerpt snippet).

### D. Administrator Console
- Restricted to users with the `admin` role.
- Upload PDF / TXT documents into the RAG vector store with automatic chunking.
- View document inventory, chunk counts, and file sizes.
- **Vector Pruning:** Deleting a document removes its metadata and purges its vector embeddings from ChromaDB.

---

## 3. Seeded Accounts for Evaluation & Viva

The application includes an auto-bootstrap mechanism that seeds demonstration accounts on first launch:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@institution.edu` | `Student@12345` | Arjun Sharma • Sem 6 • CGPA 8.40 • Target: Full Stack Developer |
| **Administrator** | `admin@institution.edu` | `Admin@12345` | System Academic Administrator • Knowledge Base Manager |

*Both login screens include a "Fill Credentials" one-click button for rapid examiner demonstration.*

---

## 4. Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- npm (v9+)

### Step-by-Step Launch

#### 1. Start Python AI Microservice (Port 8000)
```powershell
cd "c:\AI powered rec system\ai-service"
# Install dependencies if not already installed:
# pip install -r requirements.txt
python main.py
```
*Health Check:* `http://127.0.0.1:8000/health`

#### 2. Start Node.js Express Backend (Port 5000)
```powershell
cd "c:\AI powered rec system\server"
# Install dependencies if not already installed:
# npm install
npm start
```
*Base API:* `http://localhost:5000/api`  
*Zero-Config Database:* If `MONGODB_URI` is not specified in `.env`, the server automatically initializes an embedded MongoDB in-memory server with pre-seeded data.

#### 3. Start React Vite Frontend (Port 5173)
```powershell
cd "c:\AI powered rec system\client"
# Install dependencies if not already installed:
# npm install
npm run dev
```
*Open in Browser:* `http://localhost:5173/`

---

## 5. Environment Variables Configuration

### `server/.env`
```env
PORT=5000
NODE_ENV=development
# Leave blank for embedded MongoDB Memory Server or supply MongoDB Atlas URI:
MONGODB_URI=
JWT_SECRET=academic_career_guidance_system_jwt_secret_2026_super_secure
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://127.0.0.1:8000
ADMIN_EMAIL=admin@institution.edu
ADMIN_PASSWORD=Admin@12345
```

### `ai-service/.env`
```env
PORT=8000
CHROMA_PERSIST_DIR=./chroma_db
# Optional Google Gemini API key for conversational RAG responses:
GEMINI_API_KEY=
```

---

## 6. Project Viva Voce & Technical Defense Q&A

### Q1: Why use Content-Based Filtering over Collaborative Filtering here?
> **Answer:** College students and elective catalogs suffer severely from the **cold-start problem** (sparse interaction matrices and new students with zero historical rating history). Content-based filtering represents student profiles and courses in a continuous feature vector space, enabling immediate, explainable recommendations using cosine similarity and prerequisite logic from day one.

### Q2: How is the RAG pipeline protected against hallucinations?
> **Answer:** 
> 1. Chunks retrieved from ChromaDB undergo a **cosine similarity threshold check** ($\ge 0.35$). If no chunks meet the threshold, generation is aborted with a grounded negative disclaimer.
> 2. System prompt instructions explicitly forbid assuming unstated university policies.
> 3. An extractive grounded synthesizer verifies that statements directly cite specific pages and clauses of uploaded documents.

### Q3: Why separate the Python AI service from the Node.js API?
> **Answer:** Modern vector databases (ChromaDB), embedding models (`sentence-transformers`), and numeric packages (`scikit-learn`, `numpy`) have mature native Python implementations. Running Python FastAPI as an independent AI microservice allows horizontal scaling, while Node.js/Express efficiently handles high-concurrency client requests, JWT sessions, and MongoDB transactions.

### Q4: How is data persisted when deleting institutional documents?
> **Answer:** The admin deletion endpoint executes a 2-phase deletion: first, it purges all vector chunks matching `doc_id` in ChromaDB via the Python service, and second, it removes the document record from MongoDB `DocumentMetadata`.

---

## 7. Production Deployment Instructions

- **Frontend (Vercel):** Build output directory `client/dist`. Set `VITE_API_URL` to the deployed backend URL.
- **Node.js Backend (Render):** Build command `npm install`, start command `npm start`. Set `MONGODB_URI` pointing to MongoDB Atlas.
- **Python AI Service (Render / Railway):** Build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Configure persistent disk for `chroma_db/`.
