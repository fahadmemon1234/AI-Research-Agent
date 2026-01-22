from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"

class DocumentBase(BaseModel):
    filename: str
    file_path: str
    file_size: int
    mime_type: Optional[str] = None
    pages_count: Optional[int] = None
    metadata: Optional[str] = None  # JSON string

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    status: Optional[DocumentStatus] = None
    processed_at: Optional[datetime] = None

class DocumentInDB(DocumentBase):
    id: int
    user_id: int
    upload_date: datetime
    status: DocumentStatus
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentResponse(DocumentInDB):
    pass

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]