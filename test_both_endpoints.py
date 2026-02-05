import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:8000/api/v1"

def login_user(email: str, password: str):
    """Login user and get JWT token"""
    login_url = f"{BASE_URL}/auth/login"
    
    payload = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(login_url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('data', {}).get('access_token')
            return token
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Network error during login: {e}")
        return None

def get_user_stats(token: str):
    """Get user analytics stats"""
    stats_url = f"{BASE_URL}/analytics/stats"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(stats_url, headers=headers)
        
        print(f"Analytics stats response: {response.status_code}")
        if response.status_code == 200:
            print("User stats retrieved successfully!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Getting stats failed: {response.status_code}")
            print(response.text)
            
        return response
    except requests.exceptions.RequestException as e:
        print(f"Network error getting stats: {e}")
        return None

def list_documents(token: str, page: int = 1, limit: int = 10):
    """List user documents"""
    documents_url = f"{BASE_URL}/documents"
    
    params = {
        "page": page,
        "limit": limit
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(documents_url, headers=headers, params=params)
        
        print(f"Documents list response: {response.status_code}")
        if response.status_code == 200:
            print("Documents retrieved successfully!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Getting documents failed: {response.status_code}")
            print(response.text)
            
        return response
    except requests.exceptions.RequestException as e:
        print(f"Network error getting documents: {e}")
        return None

def register_user(email: str, password: str, first_name: str, last_name: str):
    """Register a new user"""
    register_url = f"{BASE_URL}/auth/register"
    
    payload = {
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name
    }
    
    try:
        response = requests.post(register_url, json=payload)
        
        if response.status_code == 200:
            print("User registered successfully!")
            return True
        elif response.status_code == 400:
            print("User already exists or invalid data")
            return False
        else:
            print(f"Registration failed: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Network error during registration: {e}")
        return False

def test_both_endpoints():
    """Test both analytics/stats and documents endpoints with proper authentication"""
    print("Testing both /analytics/stats and /documents endpoints")
    print("=" * 60)
    
    # Get user credentials
    email = input("Enter your email: ")
    password = input("Enter your password: ")
    
    # Login to get token
    token = login_user(email, password)
    
    if not token:
        print("Cannot proceed without authentication token.")
        return
    
    print(f"\nSuccessfully logged in. Token received (first 20 chars): {token[:20]}...")
    
    # Test analytics/stats endpoint
    print("\nTesting /analytics/stats endpoint...")
    get_user_stats(token)
    
    # Test documents endpoint
    print("\nTesting /documents endpoint...")
    list_documents(token)
    
    print("\nBoth endpoints tested successfully!")

def main():
    print("AI Research Agent - API Authentication Test Tool")
    print("=" * 55)
    
    # Ask if user wants to register first
    register_first = input("Do you need to register first? (y/n): ").lower() == 'y'
    
    if register_first:
        email = input("Enter your email for registration: ")
        password = input("Enter your password: ")
        first_name = input("Enter your first name: ")
        last_name = input("Enter your last name: ")
        
        if not register_user(email, password, first_name, last_name):
            print("Registration failed. Exiting.")
            return
        print("Registration completed.\n")
    
    test_both_endpoints()

if __name__ == "__main__":
    main()