import requests
import json

# Test the specific endpoints that were returning 401 errors
BASE_URL = "http://localhost:8000/api/v1"

def test_protected_endpoints():
    print("Testing endpoints that were returning 401 errors")
    print("=" * 60)
    
    # First, register and login to get a valid token
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
    
    # Login to get token
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
            else:
                print("[ERROR] Login succeeded but no token in response")
                return
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Login request failed: {e}")
        return
    
    # Now test the endpoints that were previously returning 401
    print("\nTesting endpoints that were returning 401 errors:")
    
    # Set up headers with the valid token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test the specific endpoints mentioned in the original issue
    endpoints_to_test = [
        "/users/me/stats",  # This might not exist - we'll check the actual route
        "/analytics/stats",  # This is the actual route based on code inspection
        "/documents?page=1&limit=10"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            # Construct the full URL
            if "?" in endpoint:
                url_parts = endpoint.split("?", 1)
                full_url = f"{BASE_URL}{url_parts[0]}?{url_parts[1]}"
            else:
                full_url = f"{BASE_URL}{endpoint}"
            
            print(f"\nTesting: {full_url}")
            response = requests.get(full_url, headers=headers)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("[SUCCESS] SUCCESS: 200 OK")
                try:
                    data = response.json()
                    print(f"Response preview: {json.dumps(data, indent=2)[:200]}...")
                except:
                    print(f"Response preview: {response.text[:200]}...")
            elif response.status_code == 404:
                print("[INFO] NOT FOUND: This endpoint might not exist in the current API")
            else:
                print(f"[ERROR] FAILED: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"[ERROR] ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("Test completed!")

def test_without_auth():
    print("Testing endpoints WITHOUT authentication (should return 401):")
    print("-" * 60)
    
    endpoints_to_test = [
        "/analytics/stats",
        "/documents?page=1&limit=10"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            # Construct the full URL
            if "?" in endpoint:
                url_parts = endpoint.split("?", 1)
                full_url = f"{BASE_URL}{url_parts[0]}?{url_parts[1]}"
            else:
                full_url = f"{BASE_URL}{endpoint}"
            
            print(f"\nTesting: {full_url} (without auth)")
            response = requests.get(full_url)  # No headers
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 401:
                print("[SUCCESS] EXPECTED: 401 Unauthorized (protected endpoint)")
            else:
                print(f"[INFO] UNEXPECTED: {response.status_code}")
        except Exception as e:
            print(f"[ERROR] ERROR: {e}")

if __name__ == "__main__":
    # Test without authentication first
    test_without_auth()
    
    print("\n" + "=" * 60)
    
    # Test with proper authentication
    test_protected_endpoints()