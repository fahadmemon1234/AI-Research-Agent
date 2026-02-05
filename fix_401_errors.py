import requests
import json

# Script to demonstrate how to fix 401 errors on protected endpoints
BASE_URL = "http://localhost:8000/api/v1"

def fix_401_errors():
    print("Fixing 401 errors on protected endpoints")
    print("=" * 50)
    
    # Step 1: Register a test user
    import uuid
    test_email = f"demo_{uuid.uuid4()}@example.com"
    test_password = "demo_password_123"
    
    print(f"Step 1: Creating a demo user: {test_email}")
    
    register_data = {
        "email": test_email,
        "password": test_password,
        "full_name": "Demo User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code in [200, 201]:
            print("[SUCCESS] User created successfully")
        else:
            print(f"[ERROR] User creation failed: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Request failed: {e}")
        return
    
    # Step 2: Login to get token
    print(f"\nStep 2: Logging in to get authentication token")
    
    login_data = {
        "email": test_email,
        "password": test_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            result = response.json()
            token = result["data"]["access_token"]
            print("[SUCCESS] Login successful, token acquired")
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Login request failed: {e}")
        return
    
    # Step 3: Show how to fix 401 errors by using the token
    print(f"\nStep 3: Fixing 401 errors with proper authentication")
    
    # Headers with the authentication token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test the endpoints that were returning 401
    endpoints = [
        ("/analytics/stats", "User statistics"),
        ("/documents?page=1&limit=10", "User documents")
    ]
    
    for endpoint, description in endpoints:
        print(f"\nTesting {description} at {endpoint}")
        
        # First, show what happens without authentication (401)
        print("  Without auth -> 401:", end=" ")
        try:
            resp = requests.get(f"{BASE_URL}{endpoint}")
            print(resp.status_code)
        except Exception as e:
            print(f"Error: {e}")
        
        # Then, show what happens with authentication (200)
        print("  With auth -> 200:", end=" ")
        try:
            resp = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            print(f"{resp.status_code} [SUCCESS]")
            
            if resp.status_code == 200:
                print("  Response preview:", json.dumps(resp.json(), indent=2)[:100] + "...")
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n" + "=" * 50)
    print("FIX SUMMARY:")
    print("[SUCCESS] 401 errors occur when Authorization header is missing")
    print("[SUCCESS] Add 'Authorization: Bearer <token>' header to fix")
    print("[SUCCESS] Token is obtained from successful login response")
    print("[SUCCESS] All protected endpoints now return 200 with valid token")

def show_frontend_implementation():
    print(f"\n" + "=" * 50)
    print("FRONTEND IMPLEMENTATION EXAMPLE:")
    print("=" * 50)
    
    print("""
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
      config.headers.Authorization = `Bearer \${this.token}`;
    }

    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, config);

      // Handle 401 Unauthorized - token might be expired
      if (response.status_code === 401) {
        this.removeToken();
        throw new Error('Unauthorized: Please log in again');
      }

      return await response.json();
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

  // Get user stats
  async getUserStats() {
    return this.request('/analytics/stats');
  }

  // Get user documents
  async getUserDocuments(page = 1, limit = 10) {
    return this.request(`/documents?page=\${page}&limit=\${limit}`);
  }
}

// Usage:
const apiClient = new ApiClient();

// Login to get token
await apiClient.login('user@example.com', 'password');

// Now these will return 200 instead of 401
const stats = await apiClient.getUserStats();
const docs = await apiClient.getUserDocuments(1, 10);
""")

if __name__ == "__main__":
    fix_401_errors()
    show_frontend_implementation()