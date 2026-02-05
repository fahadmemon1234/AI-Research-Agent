// Example JavaScript code for frontend to handle API calls with proper authentication
// This addresses both the 401 authentication error and potential CORS issues

class ApiClient {
  constructor(baseURL = 'http://localhost:8000/api/v1') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('jwt_token'); // Store token in localStorage
  }

  // Method to login and store the token
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        this.token = data.data.access_token;
        localStorage.setItem('jwt_token', this.token); // Store token
        return { success: true, token: this.token };
      } else {
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Method to make authenticated requests
  async makeAuthenticatedRequest(endpoint, options = {}) {
    // Ensure we have a token
    if (!this.token) {
      throw new Error('No authentication token available. Please login first.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for handling credentials
    };

    try {
      const response = await fetch(url, config);
      
      // If we get a 401, it might mean the token expired
      if (response.status === 401) {
        // Optionally try to refresh token or redirect to login
        localStorage.removeItem('jwt_token');
        throw new Error('Authentication failed. Please login again.');
      }
      
      return response;
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  // Get user analytics stats
  async getUserStats() {
    try {
      const response = await this.makeAuthenticatedRequest('/analytics/stats');
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: error.message };
    }
  }

  // List user documents
  async listDocuments(page = 1, limit = 10) {
    try {
      const response = await this.makeAuthenticatedRequest(`/documents?page=${page}&limit=${limit}`);
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('Error listing documents:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload a document
  async uploadDocument(file) {
    // For file uploads, we need to handle the Content-Type differently
    if (!this.token) {
      throw new Error('No authentication token available. Please login first.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout method
  logout() {
    this.token = null;
    localStorage.removeItem('jwt_token');
  }
}

// Example usage:
async function testEndpoints() {
  const client = new ApiClient();

  // First, login to get a token
  const loginResult = await client.login('your-email@example.com', 'your-password');
  if (!loginResult.success) {
    console.error('Login failed:', loginResult.error);
    return;
  }

  console.log('Login successful');

  // Test analytics/stats endpoint
  console.log('Testing /analytics/stats endpoint...');
  const statsResult = await client.getUserStats();
  if (statsResult.success) {
    console.log('Stats retrieved successfully:', statsResult.data);
  } else {
    console.error('Failed to get stats:', statsResult.error);
  }

  // Test documents endpoint
  console.log('Testing /documents endpoint...');
  const docsResult = await client.listDocuments();
  if (docsResult.success) {
    console.log('Documents retrieved successfully:', docsResult.data);
  } else {
    console.error('Failed to get documents:', docsResult.error);
  }
}

// Uncomment the line below to run the test
// testEndpoints();