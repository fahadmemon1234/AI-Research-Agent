// Updated API client with proper file upload handling
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:8000/api/v1';
    this.token = localStorage.getItem('access_token');
  }

  // Set token in localStorage and update instance
  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Remove token from localStorage and instance
  removeToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Generic request method with JWT authentication
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        this.removeToken();
        window.dispatchEvent(new Event('unauthorized'));
        throw new Error('Unauthorized: Please log in again');
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Special method for file uploads (multipart/form-data)
  async uploadFile(endpoint, file, additionalData = {}) {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append any additional fields if needed
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    // For file uploads, don't set Content-Type header (browser will set it with boundary)
    const config = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for multipart/form-data
      headers: {
        'Authorization': `Bearer ${this.token}`,
      }
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.removeToken();
        window.dispatchEvent(new Event('unauthorized'));
        throw new Error('Unauthorized: Please log in again');
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  // Login method
  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.data && response.data.access_token) {
        this.setToken(response.data.access_token);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout method
  logout() {
    this.removeToken();
  }

  // Get user stats
  async getUserStats() {
    return this.request('/analytics/stats');
  }

  // Get user documents
  async getUserDocuments(page = 1, limit = 10) {
    return this.request(`/documents?page=${page}&limit=${limit}`);
  }

  // Upload document
  async uploadDocument(file) {
    return this.uploadFile('/documents/upload', file);
  }

  // Delete document
  async deleteDocument(documentId) {
    return this.request(`/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  // Get current user profile
  async getCurrentUser() {
    return this.request('/auth/me');
  }
}

// Example usage in React component
const useDocumentUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const uploadDocument = async (file) => {
    const apiClient = new ApiClient();
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type before upload
    const allowedTypes = ['.pdf', '.txt', '.docx'];
    const fileExt = '.' + file.name.toLowerCase().split('.').pop();
    
    if (!allowedTypes.includes(fileExt)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // For now, just pass the file directly
      // In a more advanced implementation, you could add progress tracking
      const result = await apiClient.uploadDocument(file);
      setUploadProgress(100);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading, uploadProgress };
};

// Example React component using the upload hook
const DocumentUploadComponent = () => {
  const { uploadDocument, uploading, uploadProgress } = useDocumentUpload();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    try {
      const result = await uploadDocument(selectedFile);
      setMessage('Document uploaded successfully!');
      console.log('Upload result:', result);
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <h3>Upload Document</h3>
      <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
      <button onClick={handleUpload} disabled={uploading || !selectedFile}>
        {uploading ? `Uploading... (${uploadProgress}%)` : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export { ApiClient, useDocumentUpload, DocumentUploadComponent };