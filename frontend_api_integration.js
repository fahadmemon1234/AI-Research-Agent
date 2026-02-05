// Frontend API Integration for AI Research Agent
// This file demonstrates how to properly integrate with your backend API

// API Client with JWT Authentication
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

  // Get current user profile
  async getCurrentUser() {
    return this.request('/auth/me');
  }
}

// Initialize API client
const apiClient = new ApiClient();

// Example usage functions
const authService = {
  // Login function
  login: async (email, password) => {
    const result = await apiClient.login(email, password);
    if (result.success) {
      // Dispatch event to notify other parts of the app
      window.dispatchEvent(new CustomEvent('loginSuccess', { detail: result.data }));
    }
    return result;
  },

  // Logout function
  logout: () => {
    apiClient.logout();
    window.dispatchEvent(new CustomEvent('logout'));
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    // Check if token is expired (optional)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (e) {
      return false;
    }
  }
};

// Example React component using the API client
const DashboardComponent = () => {
  const [stats, setStats] = React.useState(null);
  const [documents, setDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats
        const statsData = await apiClient.getUserStats();
        setStats(statsData.data);

        // Fetch user documents
        const docsData = await apiClient.getUserDocuments(1, 10);
        setDocuments(docsData.data.documents);

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchData();
    }
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}. Please <button onClick={() => authService.logout()}>log out</button> and log in again.</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Your Statistics</h2>
        {stats ? (
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        ) : (
          <p>No stats available</p>
        )}
      </div>
      <div>
        <h2>Your Documents</h2>
        {documents.length > 0 ? (
          <ul>
            {documents.map(doc => (
              <li key={doc.id}>{doc.filename} ({doc.file_size} bytes)</li>
            ))}
          </ul>
        ) : (
          <p>No documents uploaded</p>
        )}
      </div>
    </div>
  );
};

// Example Login Component
const LoginComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.login(email, password);
    
    if (result.success) {
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// Global event listeners for auth state changes
window.addEventListener('unauthorized', () => {
  console.log('Session expired or invalid. Redirecting to login.');
  window.location.href = '/login';
});

window.addEventListener('loginSuccess', (event) => {
  console.log('Login successful', event.detail);
  // Optionally redirect to dashboard
  // window.location.href = '/dashboard';
});

export { apiClient, authService, DashboardComponent, LoginComponent };