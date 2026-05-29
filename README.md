<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-4B0082?style=for-the-badge&logo=graphql&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-FF6600?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/FAISS-0467DF?style=for-the-badge&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">🧠 Agentic Document Intelligence Engine</h1>

<p align="center">
  <strong>Enterprise-grade Agentic RAG system with multi-agent orchestration, strict guardrails, hybrid retrieval, and a production-ready Next.js frontend.</strong>
</p>

<p align="center">
  <em>Think: ChatGPT Enterprise × Perplexity × NotebookLM — but for your own documents.</em>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Multi-Agent Pipeline](#-multi-agent-pipeline)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Authentication & RBAC](#-authentication--rbac)
- [Guardrails & Security](#-guardrails--security)
- [Retrieval Pipeline](#-retrieval-pipeline)
- [Evaluation & Observability](#-evaluation--observability)
- [Frontend Architecture](#-frontend-architecture)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

The **Agentic Document Intelligence Engine** is a production-grade GenAI application that enables users to upload documents (PDF, DOCX, TXT) and query them using a multi-agent Retrieval-Augmented Generation (RAG) pipeline. Every response is verified, evaluated, and protected by multiple layers of guardrails — making it suitable for enterprise, research, and compliance-sensitive environments.

Unlike simple RAG chatbots, this system employs an **agentic architecture** where specialized AI agents (Planner, Retriever, Synthesizer, Verifier) collaborate through a LangGraph state machine, each contributing to a more accurate, grounded, and trustworthy final answer.

---

## ✨ Key Features

| Category | Feature | Description |
|---|---|---|
| 🤖 **Agentic RAG** | Multi-Agent Orchestration | LangGraph-powered pipeline with Planner → Retriever → Synthesizer → Verifier agents |
| 🛡️ **Guardrails** | Input & Output Validation | Prompt injection detection, jailbreak prevention, sensitive data leakage filtering |
| 🔍 **Hybrid Retrieval** | Dense + BM25 + Reranking | FAISS vector search combined with BM25 lexical search and cross-encoder reranking |
| 🧠 **Memory** | Session-Aware Chat | Conversation history per session with context-enhanced queries |
| 📊 **Evaluation** | Response Quality Metrics | Groundedness scoring, hallucination risk assessment, retrieval quality measurement |
| 📡 **Observability** | Pipeline Monitoring | Per-agent latency tracking, pipeline health reporting, risk-level assessment |
| 🔐 **Authentication** | JWT + RBAC | Role-based access control (Admin, Researcher, Viewer) with bcrypt password hashing |
| 🌊 **Streaming** | Real-Time Responses | Server-sent streaming endpoint for word-by-word response delivery |
| 📝 **Citations** | Source Attribution | Every answer includes source documents and chunk IDs for full traceability |
| 🎯 **Confidence** | Scoring System | LLM-verified confidence scores (0–1) with color-coded visual indicators |
| 🎨 **Frontend** | Production UI | Next.js 14 with glassmorphism design, dark mode, animations, and responsive layout |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js 14)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Login   │ │   Chat   │ │  Upload  │ │Analytics │ │  Admin   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│         │            │            │            │            │       │
│         └────────────┴────────────┴────────────┴────────────┘       │
│                              │  REST / Streaming                    │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (FastAPI)                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │  JWT Auth       │  │  CORS          │  │  Route Guards (RBAC)  │ │
│  └────────────────┘  └────────────────┘  └────────────────────────┘ │
│         │                                          │                 │
│    /auth/login       /upload      /query      /query/stream         │
│         │               │           │              │                 │
└─────────┼───────────────┼───────────┼──────────────┼─────────────────┘
          │               │           │              │
          │               ▼           ▼              ▼
          │   ┌──────────────────────────────────────────────┐
          │   │          QUERY SERVICE                       │
          │   │  ┌────────────┐  ┌───────────┐  ┌─────────┐ │
          │   │  │  Memory    │  │ Evaluator │  │ Monitor │ │
          │   │  └────────────┘  └───────────┘  └─────────┘ │
          │   └──────────────┬───────────────────────────────┘
          │                  │
          │                  ▼
          │   ┌──────────────────────────────────────────────┐
          │   │      AGENT ORCHESTRATOR (LangGraph)          │
          │   │                                              │
          │   │  Input         Planner       Retriever       │
          │   │  Guardrails ──→ Agent ──────→ Agent          │
          │   │   │                            │             │
          │   │   │ (blocked)    Output ←──── Synthesizer    │
          │   │   └──→ END      Guardrails     Agent         │
          │   │                   │                          │
          │   │                   ├──→ Verifier Agent ──→ END│
          │   │                   └──→ END (blocked)         │
          │   └──────────────────────────────────────────────┘
          │                        │
          │                        ▼
          │   ┌──────────────────────────────────────────────┐
          │   │           RETRIEVAL ENGINE                    │
          │   │  ┌───────────┐  ┌───────┐  ┌──────────────┐ │
          │   │  │  FAISS    │  │ BM25  │  │  Reranker    │ │
          │   │  │  (Dense)  │  │(Lexical)│ │(CrossEncoder)│ │
          │   │  └───────────┘  └───────┘  └──────────────┘ │
          │   └──────────────────────────────────────────────┘
          │                        │
          │                        ▼
          │   ┌──────────────────────────────────────────────┐
          │   │              VECTOR STORE                     │
          │   │  ┌─────────────────────────────────────────┐ │
          │   │  │  FAISS Index + Document Metadata (PKL)  │ │
          │   │  └─────────────────────────────────────────┘ │
          │   └──────────────────────────────────────────────┘
          │
          └──→ Returns JWT Token
```

---

## 🤖 Multi-Agent Pipeline

The core intelligence is powered by a **LangGraph state machine** that routes queries through specialized agents with conditional guardrail gates:

```
┌─────────────────┐     ┌─────────┐     ┌───────────┐     ┌──────────────┐
│ INPUT GUARDRAILS │────▶│ PLANNER │────▶│ RETRIEVER │────▶│ SYNTHESIZER  │
│                 │     │  AGENT  │     │   AGENT   │     │    AGENT     │
│ • Injection     │     │         │     │           │     │              │
│   detection     │     │ Breaks  │     │ Dense     │     │ Generates    │
│ • Jailbreak     │     │ query   │     │ + BM25    │     │ grounded     │
│   prevention    │     │ into    │     │ + Rerank  │     │ answer from  │
│ • Secret leak   │     │ sub-    │     │           │     │ context      │
│   protection    │     │ queries │     │           │     │              │
└────────┬────────┘     └─────────┘     └───────────┘     └──────┬───────┘
         │ (blocked)                                              │
         ▼                                                        ▼
      ┌──────┐                                         ┌──────────────────┐
      │ END  │                                         │ OUTPUT GUARDRAILS│
      └──────┘                                         │                  │
                                                       │ • Prompt leak    │
                                                       │   detection      │
                                                       │ • Secret data    │
                                                       │   filtering      │
                                                       └────────┬─────────┘
                                                                │
                                          (blocked)             │ (passed)
                                             ▼                  ▼
                                          ┌──────┐    ┌──────────────────┐
                                          │ END  │    │ VERIFIER AGENT   │
                                          └──────┘    │                  │
                                                      │ LLM evaluates   │
                                                      │ if answer is     │
                                                      │ grounded in      │
                                                      │ context          │
                                                      │                  │
                                                      │ Returns:         │
                                                      │ • Verdict        │
                                                      │ • Confidence     │
                                                      │ • Notes          │
                                                      └────────┬─────────┘
                                                               │
                                                               ▼
                                                           ┌──────┐
                                                           │ END  │
                                                           └──────┘
```

### Agent Descriptions

| Agent | Role | LLM | Output |
|-------|------|-----|--------|
| **Input Guardrails** | Pre-validates user queries against injection, jailbreak, and secret-leak patterns | Rule-based | `is_safe`, `blocked_reason` |
| **Planner Agent** | Decomposes complex queries into focused sub-queries for targeted retrieval | Groq LLM | `sub_queries: List[str]` |
| **Retriever Agent** | Executes hybrid search (Dense + BM25) with cross-encoder reranking | Embedding Model + BM25 + CrossEncoder | `retrieved_docs`, `context`, `citations` |
| **Synthesizer Agent** | Generates a grounded answer strictly from retrieved context | Groq LLM (streaming) | `draft_answer` |
| **Output Guardrails** | Validates generated output against prompt leak and sensitive data patterns | Rule-based | `is_safe`, `blocked_reason` |
| **Verifier Agent** | Evaluates groundedness, hallucination, and completeness of the draft answer | Groq LLM (temp=0) | `confidence_score`, `verification_notes` |

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance async API framework |
| **LangChain** | LLM chain composition and prompt engineering |
| **LangGraph** | Multi-agent state machine orchestration |
| **Groq** | Ultra-fast LLM inference (Llama-based models) |
| **FAISS** | Facebook AI Similarity Search for dense retrieval |
| **BM25 (rank_bm25)** | Lexical/keyword-based retrieval |
| **CrossEncoder (sentence-transformers)** | Neural reranking (`ms-marco-MiniLM-L-6-v2`) |
| **PyJWT (python-jose)** | JWT token generation and validation |
| **Passlib + bcrypt** | Secure password hashing |
| **Pydantic** | Schema validation and serialization |
| **Loguru** | Structured logging |
| **PyPDF / python-docx** | Document parsing (PDF, DOCX) |

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router and SSR |
| **TypeScript** | Type-safe development |
| **TailwindCSS 3** | Utility-first CSS with custom design system |
| **Framer Motion** | Physics-based animations |
| **Zustand** | Lightweight state management |
| **React Markdown + remark-gfm** | Rich markdown rendering in chat |
| **Lucide React** | Professional icon system |
| **clsx + tailwind-merge** | Conditional class composition |

---

## 📁 Project Structure

```
Agentic-Document-Intelligence-Engine/
│
├── backend/
│   ├── app/
│   │   ├── agents/                    # Multi-agent system
│   │   │   ├── orchestrator.py        # LangGraph workflow engine
│   │   │   ├── planner_agent.py       # Query decomposition
│   │   │   ├── retriever_agent.py     # Hybrid search execution
│   │   │   ├── synthesizer_agent.py   # Context-grounded answer generation
│   │   │   ├── verifier_agent.py      # Groundedness verification
│   │   │   └── summarizer_agent.py    # Document summarization
│   │   │
│   │   ├── api/                       # API layer
│   │   │   ├── routes.py              # REST + streaming endpoints
│   │   │   ├── dependencies.py        # Dependency injection
│   │   │   └── middleware.py          # Request middleware
│   │   │
│   │   ├── auth/                      # Authentication & authorization
│   │   │   ├── auth.py                # Login endpoint & user store
│   │   │   ├── security.py            # JWT encode/decode + bcrypt
│   │   │   ├── dependencies.py        # Token extraction middleware
│   │   │   ├── roles.py               # UserRole enum (Admin, Researcher, Viewer)
│   │   │   └── permissions.py         # RBAC permission matrix
│   │   │
│   │   ├── core/                      # Configuration & schemas
│   │   │   ├── config.py              # Pydantic settings (from .env)
│   │   │   ├── schemas.py             # Request/Response Pydantic models
│   │   │   └── constants.py           # Application constants
│   │   │
│   │   ├── evaluation/                # Response quality evaluation
│   │   │   ├── evaluator.py           # Evaluation orchestrator
│   │   │   ├── metrics.py             # Groundedness & hallucination metrics
│   │   │   ├── hallucination_metrics.py
│   │   │   └── rag_eval.py            # RAG-specific evaluation
│   │   │
│   │   ├── graph/                     # LangGraph state definition
│   │   │   ├── state.py               # AgentState TypedDict
│   │   │   ├── nodes.py               # Graph node definitions
│   │   │   ├── edges.py               # Graph edge routing
│   │   │   └── workflow.py            # Workflow compilation
│   │   │
│   │   ├── guardrails/                # Security guardrails
│   │   │   ├── input_guardrails.py    # Pre-processing query validation
│   │   │   ├── output_guardrails.py   # Post-processing response validation
│   │   │   ├── security_rules.py      # Regex-based threat detection engine
│   │   │   ├── prompt_injection.py    # Injection pattern library
│   │   │   ├── hallucination_filter.py
│   │   │   ├── confidence_scoring.py
│   │   │   └── output_validator.py
│   │   │
│   │   ├── memory/                    # Session & conversation memory
│   │   │   ├── chat_memory.py         # In-memory chat history store
│   │   │   └── session_manager.py     # Global memory singleton
│   │   │
│   │   ├── observability/             # Pipeline monitoring
│   │   │   ├── monitor.py             # Observability report generator
│   │   │   └── metrics.py             # Latency & health metrics
│   │   │
│   │   ├── prompts/                   # Agent prompt templates
│   │   │   ├── planner_prompt.py
│   │   │   ├── retriever_prompt.py
│   │   │   ├── synthesizer_prompt.py
│   │   │   ├── summarizer_prompt.py
│   │   │   └── verifier_prompt.py
│   │   │
│   │   ├── retrieval/                 # Hybrid retrieval engine
│   │   │   ├── retriever.py           # Dense + BM25 + Rerank orchestration
│   │   │   ├── vector_store.py        # FAISS index management
│   │   │   ├── embeddings.py          # Embedding model wrapper
│   │   │   └── reranker.py            # CrossEncoder reranking
│   │   │
│   │   ├── services/                  # Business logic services
│   │   │   ├── query_service.py       # Main query orchestration service
│   │   │   ├── document_processor.py  # PDF/DOCX parsing + chunking
│   │   │   └── ingestion_service.py   # Document ingestion pipeline
│   │   │
│   │   ├── utils/                     # Shared utilities
│   │   │   ├── logger.py              # Loguru configuration
│   │   │   ├── tracing.py             # Agent trace helper
│   │   │   └── helpers.py             # General helpers
│   │   │
│   │   └── main.py                    # FastAPI application entry point
│   │
│   ├── tests/                         # Integration tests
│   ├── test_*.py                      # Unit tests (20+ test files)
│   ├── .env                           # Backend environment variables
│   └── requirements.txt               # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── layout.tsx             # Root layout (Inter font, AuthProvider)
│   │   │   ├── page.tsx               # Landing page (Hero + Features + Architecture)
│   │   │   ├── globals.css            # Design system (glassmorphism, gradients)
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Authentication page
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx         # Protected shell (sidebar + topnav)
│   │   │       ├── page.tsx           # Chat interface (default route)
│   │   │       ├── upload/page.tsx    # Document upload (drag & drop)
│   │   │       ├── analytics/page.tsx # Pipeline analytics dashboard
│   │   │       ├── settings/page.tsx  # User settings & preferences
│   │   │       └── admin/page.tsx     # Admin panel (RBAC-gated)
│   │   │
│   │   ├── components/                # Reusable components
│   │   │   ├── chat/                  # Chat system
│   │   │   │   ├── ChatInterface.tsx  # Full chat with streaming toggle
│   │   │   │   ├── MessageBubble.tsx  # User/AI message rendering
│   │   │   │   ├── StreamingText.tsx  # Markdown + blinking cursor
│   │   │   │   ├── AgentTracePanel.tsx # Visual pipeline tracker
│   │   │   │   ├── CitationViewer.tsx # Source attribution cards
│   │   │   │   ├── ConfidenceBadge.tsx # Color-coded confidence
│   │   │   │   └── EvaluationPanel.tsx # Groundedness & hallucination bars
│   │   │   │
│   │   │   ├── landing/               # Marketing / Landing page
│   │   │   │   ├── Hero.tsx           # Hero section with CTA
│   │   │   │   ├── Features.tsx       # Feature grid
│   │   │   │   └── Architecture.tsx   # System architecture showcase
│   │   │   │
│   │   │   ├── layout/                # Shell components
│   │   │   │   ├── Sidebar.tsx        # RBAC-filtered navigation
│   │   │   │   └── TopNav.tsx         # User info + role badge + logout
│   │   │   │
│   │   │   ├── ui/                    # UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   │
│   │   │   └── upload/
│   │   │       └── DropZone.tsx       # Drag & drop file upload
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # JWT auth state, auto-logout, RBAC
│   │   │
│   │   ├── hooks/
│   │   │   └── useStreamingQuery.ts   # ReadableStream consumer with abort
│   │   │
│   │   ├── services/
│   │   │   └── api.ts                 # Typed API client (fetch-based)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts              # Complete TypeScript type definitions
│   │   │
│   │   └── lib/
│   │       └── utils.ts              # cn() utility (clsx + tailwind-merge)
│   │
│   ├── tailwind.config.ts            # Custom design tokens & animations
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── package.json                  # Frontend dependencies
│
├── docs/
│   ├── api_docs.md                   # API documentation
│   ├── architecture.png              # Architecture diagram
│   └── workflow.png                  # Workflow diagram
│
├── data/                             # Document uploads & vector indices
├── Dockerfile                        # Container configuration
├── docker-compose.yml                # Multi-service orchestration
├── requirements.txt                  # Root Python dependencies
├── .gitignore                        # Comprehensive gitignore
└── README.md                         # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+
- **Groq API Key** — [Get one free at groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Agentic-Document-Intelligence-Engine.git
cd Agentic-Document-Intelligence-Engine
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create `backend/.env`:

```env
APP_NAME=Agentic Document Intelligence Engine
DEBUG=True

# LLM
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile

# Vector DB
CHROMA_DB_PATH=data/vector_db

# Chunking
MAX_CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Retrieval
TOP_K_RESULTS=5

# Auth
SECRET_KEY=your_secret_key_here
```

### 4. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `APP_NAME` | ✅ | Application display name | `Agentic Document Intelligence Engine` |
| `DEBUG` | ❌ | Enable debug mode | `True` |
| `GROQ_API_KEY` | ✅ | Groq API key for LLM inference | `gsk_...` |
| `MODEL_NAME` | ✅ | LLM model identifier | `llama-3.3-70b-versatile` |
| `CHROMA_DB_PATH` | ✅ | Path to vector database directory | `data/vector_db` |
| `MAX_CHUNK_SIZE` | ✅ | Maximum characters per document chunk | `1000` |
| `CHUNK_OVERLAP` | ✅ | Overlap between consecutive chunks | `200` |
| `TOP_K_RESULTS` | ✅ | Number of retrieval results | `5` |
| `SECRET_KEY` | ✅ | JWT signing secret | `your-secret-key` |

---

## 📡 API Reference

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "app_name": "Agentic Document Intelligence Engine"
}
```

---

### Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

### Upload Document

```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <document.pdf>
```

**Response:**
```json
{
  "filename": "document.pdf",
  "status": "uploaded",
  "chunks_created": 42
}
```

> **Permission Required:** `upload` (Admin only)

---

### Query Document

```http
POST /query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "What are the main topics covered?",
  "session_id": "session-001"
}
```

**Response:**
```json
{
  "answer": "The document covers...",
  "confidence_score": 0.92,
  "citations": [
    { "source": "document.pdf", "chunk_id": 3 },
    { "source": "document.pdf", "chunk_id": 7 }
  ],
  "reasoning": "VERDICT: grounded\nCONFIDENCE: 0.92\nNOTES: ...",
  "agent_trace": [
    { "agent": "input_guardrails", "status": "passed", "timestamp": "..." },
    { "agent": "planner", "status": "completed", "timestamp": "..." },
    { "agent": "retriever", "status": "completed", "timestamp": "..." },
    { "agent": "synthesizer", "status": "completed", "timestamp": "..." },
    { "agent": "output_guardrails", "status": "passed", "timestamp": "..." },
    { "agent": "verifier", "status": "completed", "timestamp": "..." }
  ],
  "evaluation": {
    "groundedness": 0.92,
    "hallucination_risk": 0.08,
    "retrieval_quality": 0.40,
    "answer_completeness": 0.66
  },
  "observability": {
    "latency_ms": 1234.56,
    "agent_timings": { ... },
    "pipeline_health": "healthy",
    "risk_level": "low"
  }
}
```

> **Permission Required:** `query` (All roles)

---

### Streaming Query

```http
POST /query/stream
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Summarize the document",
  "session_id": "session-001"
}
```

**Response:** `text/plain` stream (word-by-word)

> **Permission Required:** `query` (All roles)

---

## 🔐 Authentication & RBAC

The system implements a **three-tier role-based access control** model:

| Role | Permissions | Description |
|---|---|---|
| 🔴 **Admin** | `upload`, `query`, `delete`, `manage_users` | Full system access |
| 🟡 **Researcher** | `query`, `view_citations` | Query access with citation visibility |
| 🟢 **Viewer** | `query` | Read-only query access |

### Default Credentials (Development)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `researcher` | `research123` | Researcher |
| `viewer` | `viewer123` | Viewer |

### Security Implementation

- **Password Storage:** bcrypt with automatic salting via `passlib`
- **Token Format:** JWT (HS256) with 60-minute expiration
- **Token Payload:** `{ sub: username, role: role, exp: timestamp }`
- **Route Protection:** Dependency injection with `require_permission()` guards
- **Frontend:** Auto-logout timer with localStorage token persistence

---

## 🛡️ Guardrails & Security

### Input Guardrails (Pre-Processing)

Intercepts and blocks malicious queries **before** they reach the agent pipeline:

| Protection | Pattern Examples | Action |
|---|---|---|
| **Prompt Injection** | `"ignore previous instructions"`, `"reveal hidden prompt"`, `"act as admin"` | Block + log |
| **Jailbreak** | `"DAN mode"`, `"bypass restrictions"`, `"do anything now"` | Block + log |
| **Secret Leakage** | API keys (`sk-...`), `password=...`, `token=...` | Block + log |
| **Empty/Invalid** | Queries < 2 characters | Block |

### Output Guardrails (Post-Processing)

Validates LLM-generated responses **before** returning to the user:

| Protection | Description | Action |
|---|---|---|
| **System Prompt Leak** | Detects if the LLM accidentally exposed system instructions | Block + sanitize |
| **Sensitive Data Leak** | Detects API keys, passwords, or tokens in generated output | Block + sanitize |

### Security Architecture

```
User Query
    │
    ▼
┌────────────────────┐
│  Input Guardrails  │──── Blocked? ──▶ "Request blocked by security policy."
│  (Regex Engine)    │
└────────┬───────────┘
         │ Safe
         ▼
    [Agent Pipeline]
         │
         ▼
┌────────────────────┐
│  Output Guardrails │──── Blocked? ──▶ "Response blocked by security policies."
│  (Regex Engine)    │
└────────┬───────────┘
         │ Safe
         ▼
    [Verifier Agent]
         │
         ▼
    Final Response
```

---

## 🔍 Retrieval Pipeline

The system uses a **three-stage hybrid retrieval** strategy for maximum recall and precision:

### Stage 1: Dense Retrieval (FAISS)

- **Embedding Model:** HuggingFace sentence-transformers
- **Index Type:** `IndexFlatL2` (L2/Euclidean distance)
- **Storage:** Local FAISS index + pickled document metadata
- Captures **semantic similarity** between query and document chunks

### Stage 2: BM25 Lexical Retrieval

- **Algorithm:** BM25Okapi (from `rank_bm25`)
- **Tokenization:** Whitespace-based lowercased tokens
- Captures **exact keyword matches** that dense embeddings might miss

### Stage 3: Cross-Encoder Reranking

- **Model:** `cross-encoder/ms-marco-MiniLM-L-6-v2`
- **Method:** Jointly encodes (query, document) pairs for precise relevance scoring
- Reranks the **merged results** from Dense + BM25 for final top-k selection

### Retrieval Flow

```
Query ──▶ ┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
          │ Dense Search │────▶│                 │     │              │
          │   (FAISS)    │     │   Merge &       │────▶│  Reranker    │──▶ Top-K
          └─────────────┘     │   Deduplicate   │     │ (CrossEncoder│    Results
Query ──▶ ┌─────────────┐     │                 │     │              │
          │ BM25 Search  │────▶│                 │     └──────────────┘
          │  (Lexical)   │     └─────────────────┘
          └─────────────┘
```

---

## 📊 Evaluation & Observability

### Response Evaluation Metrics

Every query response includes automated quality metrics:

| Metric | Formula | Range | Description |
|---|---|---|---|
| **Groundedness** | `confidence_score` | 0.0 – 1.0 | How well the answer is supported by retrieved context |
| **Hallucination Risk** | `1.0 - confidence_score` | 0.0 – 1.0 | Probability of fabricated information |
| **Retrieval Quality** | `min(citations_count × 0.2, 1.0)` | 0.0 – 1.0 | Quality of retrieved evidence |
| **Answer Completeness** | `(confidence + retrieval_quality) / 2` | 0.0 – 1.0 | Overall response completeness |

### Observability Dashboard

Real-time pipeline monitoring for every query:

| Metric | Description |
|---|---|
| **Total Latency (ms)** | End-to-end pipeline execution time |
| **Agent Timings** | Per-agent execution duration breakdown |
| **Pipeline Health** | Overall system health status |
| **Risk Level** | `low` (≥0.85) · `medium` (≥0.65) · `high` (<0.65) based on confidence |

---

## 🎨 Frontend Architecture

### Design System

- **Theme:** Dark mode with glassmorphism effects
- **Typography:** Inter (Google Fonts)
- **Color Palette:** CSS variable-based with blue primary, emerald success, amber warning, red danger
- **Animations:** Framer Motion with spring physics, fade-in, slide-up, and pulse effects
- **Glass Effects:** `backdrop-blur-xl` with semi-transparent backgrounds

### Page Structure

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | Landing Page | Public | Hero, Features, Architecture showcase |
| `/login` | Auth Page | Public | Glassmorphic login with demo credentials |
| `/dashboard` | Chat Interface | Protected | Full chat with streaming, citations, evaluation |
| `/dashboard/upload` | Upload Page | Admin | Drag & drop document upload with validation |
| `/dashboard/analytics` | Analytics | Protected | Pipeline performance metrics |
| `/dashboard/settings` | Settings | Protected | User preferences & configuration |
| `/dashboard/admin` | Admin Panel | Admin | Health check, permissions matrix, system management |

### Chat Features

- **Streaming Toggle:** Switch between standard and real-time streaming responses
- **Message Bubbles:** Differentiated User/AI bubbles with expandable metadata
- **Agent Trace Panel:** Visual pipeline tracker showing each agent's status and timing
- **Citation Viewer:** Collapsible source cards with document names and chunk IDs
- **Confidence Badge:** Color-coded indicator (green/yellow/red) with numerical score
- **Evaluation Panel:** Progress bars for groundedness, hallucination risk, and retrieval quality
- **Suggested Prompts:** Pre-built query templates for quick start
- **Markdown Support:** Full markdown rendering with GitHub Flavored Markdown support

---

## 🧪 Testing

The project includes **20+ unit test files** covering all major subsystems:

```bash
# Run all tests
cd backend
python -m pytest test_*.py -v

# Run specific test suites
python -m pytest test_guardrails.py -v      # Security guardrails
python -m pytest test_security.py -v        # JWT authentication
python -m pytest test_retriever.py -v       # Retrieval pipeline
python -m pytest test_orchestrator.py -v    # Agent orchestration
python -m pytest test_evaluator.py -v       # Evaluation metrics
python -m pytest test_observability.py -v   # Observability
python -m pytest test_memory.py -v          # Session memory
python -m pytest test_vector.py -v          # Vector store
```

### Test Coverage Areas

| Test File | Coverage Area |
|---|---|
| `test_guardrails.py` | Input/Output guardrail rules |
| `test_security.py` | JWT creation, decoding, password hashing |
| `test_roles.py` | RBAC role enumeration |
| `test_schema.py` | Pydantic schema validation |
| `test_config.py` | Settings loading |
| `test_retriever.py` | Hybrid retrieval pipeline |
| `test_retriever_agent.py` | Retriever agent execution |
| `test_vector.py` | FAISS index creation, save, load, search |
| `test_embeddings.py` | Embedding model |
| `test_orchestrator.py` | Full agent pipeline |
| `test_planner.py` | Query decomposition |
| `test_synthesizer.py` | Answer generation |
| `test_verifier_agent.py` | Groundedness verification |
| `test_evaluator.py` | Evaluation metrics |
| `test_metrics.py` | Metric calculations |
| `test_observability.py` | Observability monitoring |
| `test_memory.py` | Chat memory store |
| `test_query_service.py` | End-to-end query service |
| `test_doc_processor.py` | Document parsing |
| `test_logger.py` | Logging configuration |

---

## 🗺️ Roadmap

- [ ] **Persistent Vector Store** — PostgreSQL + pgvector for production-grade storage
- [ ] **Multi-Document Support** — Cross-document querying and citation linking
- [ ] **User Management API** — Admin endpoints for user CRUD operations
- [ ] **WebSocket Streaming** — Replace SSE with bi-directional WebSocket
- [ ] **Document Versioning** — Track and query specific document versions
- [ ] **Export & Share** — Export chat sessions as PDF/Markdown
- [ ] **OAuth 2.0 / SAML** — Enterprise SSO integration
- [ ] **Rate Limiting** — Token bucket rate limiting per user/role
- [ ] **Caching Layer** — Redis-based semantic cache for repeated queries
- [ ] **Deployment** — AWS/GCP Terraform configs with CI/CD pipeline

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `refactor:` | Code refactoring |
| `test:` | Adding/updating tests |
| `chore:` | Maintenance tasks |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ using FastAPI, LangChain, LangGraph, Groq, and Next.js</strong>
</p>

<p align="center">
  <em>If you found this project useful, consider giving it a ⭐</em>
</p>
