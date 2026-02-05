# JWT Authentication Guide for AI Research Agent

This guide explains how to properly implement JWT authentication with your existing backend API.

## Current Backend Setup

Your backend is already properly configured with:

1. **JWT Authentication Middleware** (`app/core/auth_middleware.py`)
2. **Token Creation/Verification** (`app/core/auth.py`)
3. **Protected Endpoints**:
   - `/api/v1/analytics/stats` - User statistics
   - `/api/v1/documents` - User documents
   - `/api/v1/auth/me` - Current user profile
4. **Login Endpoint**: `/api/v1/auth/login`

## Frontend Implementation

### 1. API Client with JWT Support

The `ApiClient` class handles JWT authentication automatically:

```javascript
// Import the API client
import { apiClient } from './api-client';

// Login and store token
const loginResult = await apiClient.login('user@example.com', 'password');
if (loginResult.success) {
  console.log('Login successful!');
}

// The client automatically attaches the Authorization header to subsequent requests
const stats = await apiClient.getUserStats(); // Will include Bearer token
```

### 2. React Integration

Use the provided React components and context:

```jsx
import { AuthProvider, useAuth, Dashboard, Login } from './auth-components';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
```

## Testing Your Authentication

### 1. Manual Testing

1. Start your backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Open the demo HTML file in your browser:
   ```
   ai_research_agent_demo.html
   ```

3. Register a test user at `/api/v1/auth/register`
4. Login using the form
5. Access protected endpoints like `/analytics/stats` and `/documents`

### 2. Automated Testing

Run the test script:
```bash
python test_auth.py
```

## Troubleshooting Common Issues

### Issue 1: 401 Unauthorized on Protected Endpoints

**Cause**: Authorization header not being sent correctly

**Solution**: Verify your API client is properly configured:

```javascript
// Correct way to send JWT token
fetch('/api/v1/analytics/stats', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json'
  }
});
```

### Issue 2: CORS Errors

**Cause**: Frontend origin not allowed by backend

**Solution**: Update CORS settings in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"]
)
```

### Issue 3: Token Expiration

**Cause**: JWT token has expired

**Solution**: Implement token refresh mechanism or redirect to login:

```javascript
// Check token expiration before making requests
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (e) {
    return true;
  }
}
```

## Security Best Practices

1. **Never expose JWT secrets in frontend code**
2. **Use HTTPS in production**
3. **Set appropriate token expiration times**
4. **Sanitize and validate all inputs**
5. **Implement rate limiting for auth endpoints**

## Environment Variables

Make sure your `.env` file contains:

```env
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Production Deployment Notes

1. Change the `SECRET_KEY` to a strong, random value
2. Set `allow_origins` to specific domains (not ["*"])
3. Use HTTPS for all connections
4. Consider using httpOnly cookies instead of localStorage for tokens
5. Implement proper logging and monitoring

## Document Upload Specifics

When uploading documents, make sure to:

1. **Use multipart/form-data** content type (handled automatically by the updated API client)
2. **Send the file in the 'file' field**
3. **Include JWT token in Authorization header**
4. **Only upload allowed file types** (.pdf, .txt, .docx)

Example:
```javascript
// Using the updated API client
const apiClient = new ApiClient();
const fileInput = document.querySelector('#file-input');
const file = fileInput.files[0];

// This will properly format the request as multipart/form-data
const result = await apiClient.uploadDocument(file);
```

## Additional Resources

- [FastAPI Security Documentation](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://jwt.io/introduction/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)