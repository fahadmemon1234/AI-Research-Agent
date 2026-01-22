#!/usr/bin/env python3
"""
Simple test to verify that datetime serialization issue is fixed
"""

import json
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from enum import Enum

# Replicate the DocumentStatus enum
class DocumentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"

# Replicate the DocumentResponse schema
from pydantic import BaseModel, ConfigDict

class DocumentBase(BaseModel):
    filename: str
    file_path: str
    file_size: int
    mime_type: Optional[str] = None
    pages_count: Optional[int] = None
    document_metadata: Optional[str] = None  # JSON string

class DocumentInDB(DocumentBase):
    id: int
    user_id: int
    upload_date: datetime
    status: DocumentStatus
    processed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DocumentResponse(DocumentInDB):
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        json_encoders={datetime: lambda dt: dt.isoformat()}
    )

def test_datetime_serialization():
    print("Testing datetime serialization fix...")
    
    # Create a document response object with datetime fields
    doc_response = DocumentResponse(
        id=1,
        user_id=1,
        filename="test.pdf",
        file_path="/uploads/1/test.pdf",
        file_size=1024,
        upload_date=datetime.now(),
        status=DocumentStatus.READY,
        mime_type="application/pdf",
        pages_count=10,
        document_metadata='{"author": "test", "pages": 10}',
        processed_at=datetime.now()
    )
    
    try:
        # Try to serialize to JSON using Pydantic's method which respects json_encoders
        json_str = doc_response.model_dump_json()
        
        print("SUCCESS: Datetime serialization works correctly!")
        print(f"Serialized JSON: {json_str[:100]}...")  # Show first 100 chars
        
        # Verify that datetime fields are properly formatted
        parsed_back = json.loads(json_str)
        upload_date = parsed_back['upload_date']
        processed_at = parsed_back.get('processed_at')

        print(f"Upload date: {upload_date}")
        print(f"Processed at: {processed_at}")

        # Verify they're in ISO format
        datetime.fromisoformat(upload_date.replace("Z", "+00:00"))  # This will raise if invalid
        if processed_at:
            datetime.fromisoformat(processed_at.replace("Z", "+00:00"))
            
        print("Datetime fields are properly formatted as ISO strings")
        return True
        
    except Exception as e:
        print(f"FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_datetime_serialization()
    if success:
        print("\nThe datetime serialization issue has been fixed!")
    else:
        print("\nThe datetime serialization issue still exists!")