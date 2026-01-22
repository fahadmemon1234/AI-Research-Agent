from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum
import json

class DocumentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"

class DocumentBase(BaseModel):
    filename: str
    file_path: str
    file_size: int
    mime_type: Optional[str] = None
    pages_count: Optional[int] = None
    document_metadata: Optional[str] = None  # JSON string

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

    model_config = ConfigDict(from_attributes=True)

class DocumentResponse(DocumentInDB):
    pass

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]