# API Contracts: AI Knowledge Assistant

**Feature**: 001-ai-knowledge-assistant
**Created**: 2026-01-21
**Status**: Design

## Authentication API

### POST /api/auth/register
Register a new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created)**:
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2026-01-21T10:00:00Z"
}
```

**Errors**:
- 400: Invalid input (malformed email, weak password)
- 409: Email already exists

### POST /api/auth/login
Authenticate user and return JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "jwt-token-string",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Errors**:
- 401: Invalid credentials

### GET /api/auth/me
Get current user information (requires authentication)

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2026-01-21T10:00:00Z"
}
```

**Errors**:
- 401: Invalid or expired token

## Document Management API

### POST /api/documents/upload
Upload a document for processing

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request**:
```
FormData with file field
```

**Response (202 Accepted)**:
```json
{
  "id": "uuid-string",
  "filename": "document.pdf",
  "file_size": 1024000,
  "status": "pending",
  "upload_date": "2026-01-21T10:00:00Z"
}
```

**Errors**:
- 401: Unauthorized
- 413: File too large
- 400: Unsupported file type

### GET /api/documents
List user's documents

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": "uuid-string",
    "filename": "document.pdf",
    "file_size": 1024000,
    "status": "ready",
    "upload_date": "2026-01-21T10:00:00Z",
    "pages_count": 10
  }
]
```

### DELETE /api/documents/{id}
Delete a document

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (204 No Content)**

**Errors**:
- 401: Unauthorized
- 404: Document not found

## Query & Chat API

### POST /api/query
Submit a query against user's documents

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request**:
```json
{
  "query": "What is the company's annual revenue?",
  "session_id": "optional-session-uuid"
}
```

**Response (200 OK)**:
```json
{
  "response": "The company's annual revenue is $1.2 billion.",
  "sources": [
    {
      "document_id": "uuid-string",
      "document_name": "annual_report_2025.pdf",
      "page": 12,
      "excerpt": "Annual revenue for 2025 was $1.2 billion..."
    }
  ],
  "session_id": "new-or-existing-session-uuid"
}
```

### WebSocket /ws/chat
Streaming chat interface with real-time responses

**Headers**:
```
Authorization: Bearer {access_token}
```

**Messages**:
- Client sends: `{"type": "query", "query": "question text", "session_id": "optional"}
- Server responds: `{"type": "stream", "content": "partial response", "is_complete": false}`
- Server responds: `{"type": "complete", "sources": [...], "session_id": "...", "is_complete": true}`

## Chat Session API

### GET /api/chats
List user's chat sessions

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": "uuid-string",
    "title": "Revenue Questions",
    "created_at": "2026-01-21T10:00:00Z",
    "updated_at": "2026-01-21T11:00:00Z"
  }
]
```

### GET /api/chats/{id}/messages
Get messages for a specific chat session

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": "uuid-string",
    "sender_type": "user",
    "content": "What is the company's annual revenue?",
    "created_at": "2026-01-21T10:30:00Z"
  },
  {
    "id": "uuid-string",
    "sender_type": "ai",
    "content": "The company's annual revenue is $1.2 billion.",
    "created_at": "2026-01-21T10:30:05Z",
    "source_documents": [
      {
        "document_id": "uuid-string",
        "document_name": "annual_report_2025.pdf",
        "page": 12
      }
    ]
  }
]
```

## Analytics API

### GET /api/analytics/stats
Get user's usage statistics

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
{
  "total_documents": 5,
  "total_queries": 42,
  "last_query_date": "2026-01-21T10:00:00Z",
  "top_documents": [
    {
      "id": "uuid-string",
      "name": "annual_report_2025.pdf",
      "query_count": 15
    }
  ]
}
```