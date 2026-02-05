# Fixing 401 Authentication and CORS Errors

This guide explains how to fix the 401 authentication errors for `/api/v1/analytics/stats` and `/api/v1/documents` endpoints, as well as potential CORS issues.

## Problem 1: 401 Unauthorized Error

The 401 error occurs because both endpoints require authentication via a JWT token in the Authorization header.

### Solution: Proper Authentication

#### Option 1: Using the Test Script
Run the test script to verify both endpoints work with proper authentication:

```bash
python test_both_endpoints.py
```

This script will:
1. Login to get a JWT token
2. Use the token to access `/api/v1/analytics/stats`
3. Use the token to access `/api/v1/documents`

#### Option 2: Manual cURL Commands
```bash
# First, login to get a token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "password": "your-password"}'

# Use the received token for analytics/stats
curl -X GET http://localhost:8000/api/v1/analytics/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Use the received token for documents
curl -X GET "http://localhost:8000/api/v1/documents?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Option 3: Using Python Requests
```python
import requests

# Login to get token
login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
    "email": "your-email@example.com",
    "password": "your-password"
})

if login_response.status_code == 200:
    token = login_response.json()["data"]["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Access analytics/stats
    stats_response = requests.get("http://localhost:8000/api/v1/analytics/stats", headers=headers)
    print(f"Stats response: {stats_response.status_code}")
    
    # Access documents
    docs_response = requests.get("http://localhost:8000/api/v1/documents?page=1&limit=10", headers=headers)
    print(f"Documents response: {docs_response.status_code}")
```

## Problem 2: CORS Error (if encountered)

If you encounter a CORS error like:
> "Access to XMLHttpRequest at 'http://localhost:8000/api/v1/documents?page=1&limit=10' from origin 'http://localhost:3000' has been blocked by CORS policy"

### Solution: Backend Configuration

Ensure your backend's CORS configuration in `backend/app/main.py` looks like this:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware with specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Important: Expose the Authorization header
    expose_headers=["Authorization"]
)
```

### Frontend JavaScript Solution

When making requests from the frontend, ensure you're including credentials and proper headers:

```javascript
// frontend_api_example.js contains a complete example
const response = await fetch('http://localhost:8000/api/v1/documents?page=1&limit=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${yourJwtToken}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include'  // Important for including credentials
});
```

## Testing Both Endpoints

1. Make sure your backend server is running:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. Run the test script:
   ```bash
   python test_both_endpoints.py
   ```

3. Follow the prompts to login and test both endpoints

## Common Issues and Fixes

### Issue: Token Expiration
JWT tokens expire after 30 minutes by default. If you get 401 errors after a period of inactivity, log in again to get a fresh token.

### Issue: Incorrect Header Format
Make sure your Authorization header follows the format: `Authorization: Bearer YOUR_JWT_TOKEN_HERE`

### Issue: Backend Not Running
Ensure your backend server is running on `http://localhost:8000` before making requests.

### Issue: Frontend-Origin CORS
If using from a browser, ensure your backend CORS settings allow requests from your frontend origin.

## Files Created

- `test_both_endpoints.py` - Python script to test both endpoints with proper authentication
- `frontend_api_example.js` - JavaScript example for frontend API calls
- `backend/app/main.py.cors_fix` - Fixed version of main.py with improved CORS handling (if needed)