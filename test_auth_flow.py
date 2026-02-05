import requests
import json

# Simple test to verify the authentication flow works with a new user
BASE_URL = "http://localhost:8000/api/v1"

def test_auth_flow():
    print("Testing Authentication Flow with New User")
    print("=" * 50)
    
    # Create a unique test user
    import uuid
    test_email = f"test_{uuid.uuid4()}@example.com"
    test_password = "secure_password_123"
    
    print(f"Creating test user: {test_email}")
    
    # Register the user
    register_data = {
        "email": test_email,
        "password": test_password,
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Registration Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print("[SUCCESS] User registered successfully")
        else:
            print(f"[ERROR] Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Registration request failed: {e}")
        return
    
    # Now try to login with the new user
    print(f"\nLogging in with test user: {test_email}")
    
    login_data = {
        "email": test_email,
        "password": test_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if "data" in result and "access_token" in result["data"]:
                token = result["data"]["access_token"]
                print("[SUCCESS] Login successful, token received")
                print(f"Token length: {len(token)} characters")
            else:
                print("[ERROR] Login succeeded but no token in response")
                print(f"Response: {result}")
                return
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Login request failed: {e}")
        return
    
    # Test accessing protected endpoints with the token
    print("\nTesting protected endpoints with valid token...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test analytics/stats endpoint
    try:
        response = requests.get(f"{BASE_URL}/analytics/stats", headers=headers)
        print(f"Analytics/Stats Status: {response.status_code}")
        if response.status_code == 200:
            print("[SUCCESS] Successfully accessed /analytics/stats")
        else:
            print(f"[ERROR] Failed to access /analytics/stats: {response.text}")
    except Exception as e:
        print(f"[ERROR] Analytics request failed: {e}")
    
    # Test documents endpoint
    try:
        response = requests.get(f"{BASE_URL}/documents?page=1&limit=10", headers=headers)
        print(f"Documents Status: {response.status_code}")
        if response.status_code == 200:
            print("[SUCCESS] Successfully accessed /documents")
        else:
            print(f"[ERROR] Failed to access /documents: {response.text}")
    except Exception as e:
        print(f"[ERROR] Documents request failed: {e}")
    
    # Test with invalid token
    print("\nTesting with invalid token...")
    invalid_headers = {
        "Authorization": "Bearer invalid_token_12345",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/analytics/stats", headers=invalid_headers)
        print(f"Invalid Token Status: {response.status_code}")
        if response.status_code == 401:
            print("[SUCCESS] Invalid token correctly rejected")
        else:
            print(f"[WARNING] Expected 401 but got {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Invalid token test failed: {e}")
    
    print("\n" + "=" * 50)
    print("Authentication flow test completed!")

if __name__ == "__main__":
    test_auth_flow()