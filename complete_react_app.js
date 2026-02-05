// Complete React App Example for AI Research Agent
// This demonstrates how to properly implement JWT authentication with your backend

import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

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

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Verify token is still valid by fetching user profile
          const userData = await apiClient.getCurrentUser();
          setUser(userData.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid/expired, remove it
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const result = await apiClient.login(email, password);
    if (result.success) {
      try {
        // Get user profile after successful login
        const userData = await apiClient.getCurrentUser();
        setUser(userData.data);
        setIsAuthenticated(true);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to fetch user profile' };
      }
    }
    return result;
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect to dashboard (handled by router in real app)
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;
  if (error) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>
      <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
        Log Out
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <div>
          Welcome, {user?.email}! 
          <button 
            onClick={logout} 
            style={{ marginLeft: '15px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Your Statistics</h2>
        {stats ? (
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(stats, null, 2)}</pre>
          </div>
        ) : (
          <p>No stats available</p>
        )}
      </div>
      
      <div>
        <h2>Your Documents</h2>
        {documents.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Filename</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '8px' }}>{doc.id}</td>
                  <td style={{ padding: '8px' }}>{doc.filename}</td>
                  <td style={{ padding: '8px' }}>{doc.file_size} bytes</td>
                  <td style={{ padding: '8px' }}>{doc.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents uploaded</p>
        )}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>You need to be logged in to view this page.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return children;
};

// Main App Component
const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  // Determine which page to show based on URL
  const pathname = window.location.pathname;

  return (
    <div>
      <nav style={{ backgroundColor: '#343a40', padding: '10px', marginBottom: '20px' }}>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>AI Research Agent</span>
        <span style={{ float: 'right', color: 'white' }}>
          {pathname !== '/login' && !pathname.startsWith('/dashboard') && (
            <a href="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Login</a>
          )}
          {pathname === '/login' && (
            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Dashboard</a>
          )}
        </span>
      </nav>

      {pathname === '/login' || pathname === '/' ? <Login /> : <ProtectedRoute><Dashboard /></ProtectedRoute>}
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Export for use in other modules
export { apiClient, AuthProvider, useAuth, Login, Dashboard, ProtectedRoute };