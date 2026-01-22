#!/usr/bin/env python3
"""
Test script to verify that datetime serialization issue is fixed
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from datetime import datetime
from backend.app.schemas.document import DocumentResponse
from backend.app.models.document import Document, DocumentStatus
from unittest.mock import Mock

def test_datetime_serialization():
    print("Testing datetime serialization fix...")

    # Create a mock document object similar to what would come from the database
    mock_document = Mock(spec=Document)
    mock_document.id = 1
    mock_document.user_id = 1
    mock_document.filename = "test.pdf"
    mock_document.file_path = "/uploads/1/test.pdf"
    mock_document.file_size = 1024
    mock_document.upload_date = datetime.now()
    mock_document.status = DocumentStatus.READY
    mock_document.mime_type = "application/pdf"
    mock_document.pages_count = 10
    mock_document.document_metadata = '{"author": "test", "pages": 10}'
    mock_document.processed_at = datetime.now()

    try:
        # Try to create a DocumentResponse from the mock document
        # This should previously have failed with the datetime serialization error
        document_response = DocumentResponse.from_orm(mock_document)

        # Try to convert to dict which would trigger JSON serialization
        response_dict = document_response.model_dump()

        # Try to serialize to JSON which would be what happens in the API response
        import json
        json_str = json.dumps(response_dict)

        print("✅ SUCCESS: Datetime serialization works correctly!")
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

        print("✅ Datetime fields are properly formatted as ISO strings")
        return True

    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_datetime_serialization()
    if success:
        print("\n🎉 The datetime serialization issue has been fixed!")
    else:
        print("\n💥 The datetime serialization issue still exists!")