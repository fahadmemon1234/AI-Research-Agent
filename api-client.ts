// api-client.ts - Updated API client with proper file upload handling for TypeScript

interface ApiResponse<T = any> {
  code: string;
  message: string;
  data?: T;
  status: string;
}

interface DocumentUploadResponse {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  user_id: number;
  upload_date: string;
  status: string;
  processed_at: string | null;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || 'http://localhost:8000/api/v1';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  // Set token in localStorage and update instance
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  // Remove token from localStorage and instance
  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  // Get token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  // Generic request method with JWT authentication
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
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
      let data: any;
      
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
  async uploadFile<T = DocumentUploadResponse>(
    endpoint: string, 
    file: File, 
    additionalData: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append any additional fields if needed
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    // For file uploads, don't set Content-Type header (browser will set it with boundary)
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for multipart/form-data
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
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
      let data: any;
      
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
  async login(email: string, password: string): Promise<ApiResponse<{access_token: string, token_type: string}>> {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.data && response.data.access_token) {
        this.setToken(response.data.access_token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout method
  logout(): void {
    this.removeToken();
  }

  // Get user stats
  async getUserStats(): Promise<ApiResponse<any>> {
    return this.request('/analytics/stats');
  }

  // Get user documents
  async getUserDocuments(page: number = 1, limit: number = 10): Promise<ApiResponse<{documents: any[]}>> {
    return this.request(`/documents?page=${page}&limit=${limit}`);
  }

  // Upload document
  async uploadDocument(file: File): Promise<ApiResponse<DocumentUploadResponse>> {
    return this.uploadFile('/documents/upload', file);
  }

  // Delete document
  async deleteDocument(documentId: number): Promise<ApiResponse<void>> {
    return this.request(`/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/auth/me');
  }
}

// Example usage in React with TypeScript
import { useState, useCallback } from 'react';

interface UseDocumentUploadReturn {
  uploadDocument: (file: File) => Promise<ApiResponse<DocumentUploadResponse>>;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

const useDocumentUpload = (): UseDocumentUploadReturn => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (file: File) => {
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
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate progress (real progress tracking would require more complex implementation)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await apiClient.uploadDocument(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => setUploadProgress(0), 1000);
      
      return result;
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadDocument, uploading, uploadProgress, error };
};

export { ApiClient, useDocumentUpload };
export type { ApiResponse, DocumentUploadResponse, UseDocumentUploadReturn };