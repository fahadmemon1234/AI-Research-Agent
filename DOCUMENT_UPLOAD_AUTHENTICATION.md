# AI Research Agent API Authentication Guide

This guide explains how to properly authenticate when using the AI Research Agent API endpoints that require authentication.

## Authentication Flow

Several API endpoints require authentication via JWT tokens, including:
- `/api/v1/documents/upload` - Upload Document
- `/api/v1/documents/` - List Documents  
- `/api/v1/documents/{document_id}` - Delete Document
- `/api/v1/analytics/stats` - Get User Stats
- `/api/v1/chats/` - Create/List Chat Sessions
- `/api/v1/chats/{session_id}/messages` - Get Chat Messages
- `/api/v1/auth/me` - Get/Update User Profile

Follow these steps to successfully use these endpoints:

### Step 1: Register/Login to Get JWT Token

Before accessing any protected endpoints, you need to authenticate and receive a JWT token:

```bash
# Register a new user (if you don't have an account)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password",
    "first_name": "Your",
    "last_name": "Name"
  }'

# Login to get JWT token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

### Step 2: Use Token with Protected Endpoints

Use the received token to access protected endpoints:

#### Upload Document:
```bash
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -F "file=@/path/to/your/document.pdf"
```

#### List Documents:
```bash
curl -X GET "http://localhost:8000/api/v1/documents?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Get Analytics Stats:
```bash
curl -X GET http://localhost:8000/api/v1/analytics/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Using Python Requests

```python
import requests

# Login to get token
login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
    "email": "your-email@example.com",
    "password": "your-password"
})

if login_response.status_code == 200:
    token = login_response.json()["data"]["access_token"]
    
    # Example: Upload document with token
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    with open("/path/to/your/document.pdf", "rb") as file:
        files = {"file": file}
        upload_response = requests.post(
            "http://localhost:8000/api/v1/documents/upload",
            files=files,
            headers=headers
        )
        
        if upload_response.status_code == 201:
            print("Document uploaded successfully!")
        else:
            print(f"Upload failed: {upload_response.status_code} - {upload_response.text}")
    
    # Example: List documents
    list_response = requests.get(
        "http://localhost:8000/api/v1/documents?page=1&limit=10",
        headers=headers
    )
    
    if list_response.status_code == 200:
        print("Documents retrieved successfully!")
    else:
        print(f"List failed: {list_response.status_code} - {list_response.text}")
    
    # Example: Get analytics stats
    stats_response = requests.get(
        "http://localhost:8000/api/v1/analytics/stats",
        headers=headers
    )
    
    if stats_response.status_code == 200:
        print("Stats retrieved successfully!")
    else:
        print(f"Stats failed: {stats_response.status_code} - {stats_response.text}")
else:
    print("Login failed")
```

## Common Issues and Solutions

### Issue: 401 Unauthorized Error
**Cause**: Missing or invalid JWT token in the Authorization header.
**Solution**: 
1. Ensure you're logged in and have a valid JWT token
2. Verify the Authorization header format: `Authorization: Bearer YOUR_TOKEN_HERE`
3. Check that the token hasn't expired (default expiration is 30 minutes)

### Issue: Invalid File Type Error
**Cause**: Attempting to upload a file type that is not supported.
**Solution**: Only PDF, TXT, and DOCX files are currently supported.

### Issue: Account Inactive
**Cause**: Your account may have been deactivated.
**Solution**: Contact the administrator to reactivate your account.

## Troubleshooting Tips

1. **Verify your token**: Decode your JWT token at jwt.io to ensure it's valid and not expired
2. **Check server logs**: Look at the backend logs for more detailed error information
3. **Validate file format**: Ensure your document is in one of the accepted formats (PDF, TXT, DOCX)
4. **Network connectivity**: Ensure your client can reach the API server

## Comprehensive Testing Tool

A comprehensive API client tool has been provided at `api_client_tool.py` to help you test all authenticated endpoints with proper authentication.