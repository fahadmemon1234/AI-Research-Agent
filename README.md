# AI Knowledge Assistant

An advanced, multi-user AI research agent that allows users to upload documents (PDF, TXT, DOCX) and ask questions about their content using Retrieval-Augmented Generation (RAG) with Google's Gemini LLM.

## Features

- **Multi-user support**: Secure authentication with JWT tokens
- **Document management**: Upload, index, and manage documents (PDF, TXT, DOCX)
- **Intelligent search**: RAG-powered Q&A with source citations
- **Real-time chat**: Streaming responses with WebSocket integration
- **Chat history**: Persistent conversation history per user
- **Dashboard**: View document stats and usage analytics

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with pgvector extension (hosted on Neon)
- **LLM Integration**: Google Generative AI SDK with Gemini models
- **RAG Framework**: LlamaIndex for document processing
- **Authentication**: JWT with bcrypt password hashing

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Bootstrap 5 for responsive UI
- **State Management**: React Context API
- **API Communication**: Axios with interceptors

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Access to Google Gemini API (API key required)
- Neon Postgres account with pgvector extension enabled

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values:
   - `DATABASE_URL`: Your Neon Postgres connection string
   - `PGVECTOR_DB_URL`: Same as DATABASE_URL for now
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SECRET_KEY`: A random secret key for JWT signing

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your actual values:
   - `NEXT_PUBLIC_API_BASE_URL`: Base URL for your backend API (e.g., http://localhost:8000/api)
   - `NEXT_PUBLIC_WS_URL`: WebSocket URL for real-time chat (e.g., ws://localhost:8000/ws)

### Running the Application

1. **Backend**: From the `backend` directory:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**: From the `frontend` directory:
   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API docs: http://localhost:8000/docs
   - Backend API: http://localhost:8000/api

## Architecture

### Backend Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── routes/      # API route definitions
│   │       └── utils.py     # API response utilities
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic schemas for request/response validation
│   ├── services/            # Business logic services
│   ├── database/            # Database configuration
│   ├── core/                # Core utilities (auth, config, logging)
│   ├── utils/               # Utility functions
│   └── tasks/               # Background tasks
```

### Frontend Structure
```
frontend/
├── app/                     # Next.js App Router pages
│   ├── auth/
│   ├── upload/
│   ├── chat/
│   └── dashboard/
├── components/              # Reusable React components
├── lib/                     # Utilities and API client
└── styles/                  # CSS styles
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Authenticate user and return JWT
- `GET /api/v1/auth/me` - Get current user info (requires auth)

### Documents
- `POST /api/v1/documents/upload` - Upload a document (requires auth)
- `GET /api/v1/documents` - List user's documents (requires auth)
- `DELETE /api/v1/documents/{id}` - Delete a document (requires auth)

### Queries
- `POST /api/v1/query` - Submit a query against user's documents (requires auth)

### Chats
- `GET /api/v1/chats` - List user's chat sessions (requires auth)
- `GET /api/v1/chats/{id}/messages` - Get messages for a chat session (requires auth)

### Analytics
- `GET /api/v1/analytics/stats` - Get user's usage statistics (requires auth)

## Security

- JWT-based authentication for all protected routes
- Passwords are hashed using bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- Safe handling of file uploads with type and size validation

## Deployment

### Backend (Render/Fly.io)
1. Create a new web service
2. Set environment variables as described in setup
3. Use the provided requirements.txt for dependencies
4. Set the start command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Import the project into Vercel
2. Set environment variables in the Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `out`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.