# FIX: Axios Document Upload 400 Error

## Problem
Your TypeScript frontend is using Axios for document uploads, but getting 400 Bad Request errors. This happens because Axios is not properly configured for file uploads with multipart/form-data.

## Root Cause
Axios is likely sending the request with `Content-Type: application/json` instead of allowing the browser to set the proper `multipart/form-data` content type with boundary.

## Solution

### 1. Updated api-client.ts (Provided)
I've created a new `api-client.ts` file that properly handles file uploads with the following features:

- Dedicated `uploadFile()` method for file uploads
- Proper FormData handling
- Correct header configuration for multipart requests
- TypeScript type safety

### 2. If You Want to Fix Your Existing Axios Implementation

If you prefer to keep your existing Axios-based implementation, here's how to fix it:

```typescript
// In your existing api-client.ts file, update the uploadDocument method:

async uploadDocument(file: File) {
  // Create FormData object
  const formData = new FormData();
  formData.append('file', file);
  
  // Don't set Content-Type header - let browser set it automatically
  const config = {
    headers: {
      'Authorization': `Bearer ${this.getToken()}`,
      // DON'T SET Content-Type for multipart/form-data
      // The browser will set it with the proper boundary
    }
  };

  try {
    const response = await axios.post(
      `${this.baseURL}/documents/upload`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
```

### 3. Key Points for File Uploads

1. **Use FormData**: Always wrap your file in a FormData object
2. **Don't set Content-Type**: Let the browser set the content type with boundary
3. **Include Authorization header**: JWT token is still required
4. **Allowed file types**: Only .pdf, .txt, .docx are accepted

### 4. Example Usage in React Component

```tsx
import { useState } from 'react';
import { ApiClient } from './api-client'; // Use the new client

const DocumentUploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const apiClient = new ApiClient();
    setUploading(true);
    setMessage('');

    try {
      const result = await apiClient.uploadDocument(file);
      setMessage('Upload successful!');
      console.log('Upload result:', result);
    } catch (error: any) {
      setMessage(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.txt,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
```

### 5. Alternative Axios Fix (if keeping Axios)

If you want to stick with Axios, make sure your upload function looks like this:

```typescript
// Correct Axios implementation for file uploads
async uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${this.baseURL}/documents/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          // Important: Don't set Content-Type header
          // Let the browser set it to multipart/form-data with boundary
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
```

## Why This Fixes the 400 Error

The 400 error occurs because:
1. Your current implementation might be setting `Content-Type: application/json` for file uploads
2. The backend expects `multipart/form-data` with proper boundary
3. The backend validates the file type and rejects requests with wrong content type

By using FormData and not setting the Content-Type header, the browser automatically sets the correct `multipart/form-data` content type with the proper boundary for file uploads.

Use the new `api-client.ts` file I provided, or apply these fixes to your existing implementation to resolve the 400 error.