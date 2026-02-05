import requests
import json
from datetime import datetime

# Test script for AI Research Agent API authentication
# This script demonstrates how to properly authenticate with your API

BASE_URL = "http://localhost:8000/api/v1"

def test_authentication():
    print("Testing AI Research Agent API Authentication")
    print("=" * 50)
    
    # Step 1: Try to access protected endpoint without authentication (should fail)
    print("\n1. Testing protected endpoint without authentication...")
    try:
        response = requests.get(f"{BASE_URL}/analytics/stats")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Step 2: Login to get token
    print("\n2. Logging in to get authentication token...")
    login_data = {
        "email": "test@example.com",  # Replace with a valid test user
        "password": "testpassword"    # Replace with the correct password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"   Login Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if "data" in result and "access_token" in result["data"]:
                token = result["data"]["access_token"]
                print("   [SUCCESS] Successfully obtained token")
                print(f"   Token preview: {token[:30]}...")
            else:
                print("   [ERROR] Failed to get token from response")
                print(f"   Response: {result}")
                return
        else:
            print(f"   [ERROR] Login failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except Exception as e:
        print(f"   [ERROR] Error during login: {e}")
        return
    
    # Step 3: Access protected endpoints with token
    print("\n3. Testing protected endpoints with authentication...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test analytics/stats endpoint
    print("   Testing /analytics/stats endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/analytics/stats", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print("   [SUCCESS] Successfully accessed /analytics/stats")
            print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}...")
        else:
            print(f"   [ERROR] Failed to access /analytics/stats: {response.text}")
    except Exception as e:
        print(f"   [ERROR] Error accessing /analytics/stats: {e}")
    
    # Test documents endpoint
    print("\n   Testing /documents endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/documents?page=1&limit=10", headers=headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print("   [SUCCESS] Successfully accessed /documents")
            print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}...")
        else:
            print(f"   [ERROR] Failed to access /documents: {response.text}")
    except Exception as e:
        print(f"   [ERROR] Error accessing /documents: {e}")
    
    # Step 4: Test invalid token
    print("\n4. Testing with invalid token...")
    invalid_headers = {
        "Authorization": "Bearer invalid_token_12345",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/analytics/stats", headers=invalid_headers)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 401:
            print("   [SUCCESS] Correctly rejected invalid token")
        else:
            print(f"   [WARN] Expected 401 but got {response.status_code}")
    except Exception as e:
        print(f"   [ERROR] Error testing invalid token: {e}")
    
    print("\n" + "=" * 50)
    print("Authentication test completed!")

def create_test_user():
    """Helper function to create a test user if needed"""
    print("\nCreating a test user...")
    
    user_data = {
        "email": "test@example.com",
        "password": "testpassword",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"   Registration Status Code: {response.status_code}")
        if response.status_code in [200, 201]:
            print("   [SUCCESS] Test user created successfully")
            return True
        elif response.status_code == 400:
            print("   - Test user already exists")
            return True
        else:
            print(f"   [ERROR] Failed to create test user: {response.text}")
            return False
    except Exception as e:
        print(f"   [ERROR] Error creating test user: {e}")
        return False

if __name__ == "__main__":
    # First, try to create a test user
    user_created = create_test_user()
    
    if user_created:
        # Run the authentication test
        test_authentication()
    else:
        print("\nUnable to proceed without a test user.")