# Quickstart Guide: AI Knowledge Assistant

**Feature**: 001-ai-knowledge-assistant
**Created**: 2026-01-21
**Status**: Draft

## Prerequisites

- Python 3.11+
- Node.js 18+
- Access to Google Gemini API (API key)
- Neon Postgres account with pgvector extension enabled

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-ai-research-agent
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

### 4. Database Setup
```bash
# Make sure you have Neon Postgres connection string
# Run migrations to set up tables
cd backend
python -m alembic upgrade head
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
PGVECTOR_DB_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
SECRET_KEY="your-secret-key-for-jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
NEXT_PUBLIC_WS_URL="ws://localhost:8000/ws"
```

## Running the Application

### 1. Start Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Backend API: http://localhost:8000/api

## Basic Usage Flow

1. Register a new account or log in
2. Upload a document (PDF, TXT, or DOCX)
3. Wait for document processing to complete
4. Ask questions about your document in the chat interface
5. View responses with source citations