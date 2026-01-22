# Data Model: AI Knowledge Assistant

**Feature**: 001-ai-knowledge-assistant
**Created**: 2026-01-21
**Status**: Design

## Entity Definitions

### User
Represents an authenticated user with access to the knowledge assistant system.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the user
- `email` (String): User's email address (unique, validated)
- `password_hash` (String): BCrypt hash of user's password
- `first_name` (String, optional): User's first name
- `last_name` (String, optional): User's last name
- `is_active` (Boolean): Whether the account is active
- `created_at` (DateTime): Timestamp of account creation
- `updated_at` (DateTime): Timestamp of last update

**Validation Rules**:
- Email must be unique and follow standard email format
- Password must meet minimum strength requirements
- Created/updated timestamps are automatically managed

### Document
Represents an uploaded document that has been processed and stored in the system.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the document
- `user_id` (UUID/Integer): Foreign key to the owning user
- `filename` (String): Original filename
- `file_path` (String): Path to stored file
- `file_size` (Integer): Size of file in bytes
- `upload_date` (DateTime): When document was uploaded
- `status` (Enum): Processing status (pending, processing, ready, failed)
- `mime_type` (String): MIME type of the document
- `pages_count` (Integer, optional): Number of pages (for PDFs)
- `metadata` (JSONB): Additional metadata extracted from document
- `processed_at` (DateTime, optional): When processing completed

**Relationships**:
- Belongs to one User
- Has many Chunks

**Validation Rules**:
- User must be authenticated to create document
- File size must be within system limits (e.g., < 100MB)
- Status transitions must follow logical sequence

### Chunk
Represents a semantically coherent segment of a document that has been converted to vector embeddings.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the chunk
- `doc_id` (UUID/Integer): Foreign key to the parent document
- `chunk_text` (Text): The actual text content of the chunk
- `embedding` (Vector): Vector embedding representation of the text
- `chunk_index` (Integer): Sequential position of chunk in document
- `char_start_idx` (Integer): Starting character index in original document
- `char_end_idx` (Integer): Ending character index in original document
- `metadata` (JSONB): Additional metadata about the chunk
- `created_at` (DateTime): When chunk was created

**Relationships**:
- Belongs to one Document
- Belongs to one User (through Document)

**Validation Rules**:
- Embedding dimension must match model specification (e.g., 768 for Gemini embeddings)
- Text content must not exceed maximum token limit
- Chunk index must be sequential within document

### ChatSession
Represents a conversation session between a user and the AI assistant.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the chat session
- `user_id` (UUID/Integer): Foreign key to the owning user
- `title` (String): Automatically generated or user-defined title
- `created_at` (DateTime): When session was created
- `updated_at` (DateTime): When session was last updated
- `is_archived` (Boolean): Whether session is archived

**Relationships**:
- Belongs to one User
- Has many Messages

**Validation Rules**:
- User must be authenticated to access session
- Title should be auto-generated from first few messages if not provided

### Message
Represents a single message in a chat session, either from the user or the AI.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the message
- `chat_session_id` (UUID/Integer): Foreign key to the parent chat session
- `sender_type` (Enum): Who sent the message (user, ai)
- `content` (Text): The actual message content
- `created_at` (DateTime): When message was created
- `source_documents` (JSONB): List of documents referenced in AI response
- `token_count` (Integer): Number of tokens in the message
- `response_time_ms` (Integer, optional): How long AI took to respond (for AI messages)

**Relationships**:
- Belongs to one ChatSession
- Belongs to one User (through ChatSession)

**Validation Rules**:
- Content must not be empty
- Sender type must be either 'user' or 'ai'

## State Transitions

### Document Status Transitions
- `pending` → `processing`: When document upload completes
- `processing` → `ready`: When vector embedding and indexing completes
- `processing` → `failed`: When an error occurs during processing
- `ready` → `deleted`: When user deletes document (soft delete)

## Indexes and Performance Considerations

### Required Indexes
- User.email (unique index for authentication)
- Document.user_id (foreign key index)
- Chunk.doc_id (foreign key index)
- Chunk.embedding (IVFFlat/pgvector index for similarity search)
- ChatSession.user_id (foreign key index)
- Message.chat_session_id (foreign key index)

### Performance Notes
- Vector similarity searches will use pgvector's IVFFlat index
- Metadata queries may benefit from GIN indexes on JSONB columns
- Consider partitioning tables by user_id for very large deployments