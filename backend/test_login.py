#!/usr/bin/env python3
"""
Test script to verify login functionality and middleware
"""

import asyncio
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_login_flow():
    print("Testing login functionality...\n")
    
    # Test 1: Try to access a protected endpoint without authentication
    print("1. Testing access to protected endpoint without auth...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/me")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        if response.status_code == 401:
            print("   ✓ Correctly rejected unauthorized access\n")
        else:
            print("   ✗ Should have been rejected\n")
    except Exception as e:
        print(f"   Error: {e}\n")
    
    # Test 2: Register a test user
    print("2. Creating a test user...")
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✓ User created successfully")
        elif response.status_code == 400:
            print("   - User already exists, continuing with login test...")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Login with the test user
    print("\n3. Testing login...")
    login_data = {
        "email": "test@example.com",
        "password": "securepassword123"
    }
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            if "data" in result and "access_token" in result["data"]:
                token = result["data"]["access_token"]
                print("   ✓ Login successful")
                print(f"   Token received (length: {len(token)})")
                
                # Test 4: Access protected endpoint with valid token
                print("\n4. Testing access to protected endpoint with valid token...")
                headers = {"Authorization": f"Bearer {token}"}
                response = requests.get(f"{BASE_URL}/api/v1/me", headers=headers)
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    user_info = response.json()
                    print(f"   ✓ Successfully accessed user profile: {user_info.get('email', 'Unknown')}")
                else:
                    print(f"   ✗ Failed to access profile: {response.json()}")
            else:
                print(f"   ✗ No token in response: {result}")
        else:
            print(f"   ✗ Login failed: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 5: Try to access protected endpoint with invalid token
    print("\n5. Testing access with invalid token...")
    try:
        headers = {"Authorization": "Bearer invalid.token.here"}
        response = requests.get(f"{BASE_URL}/api/v1/me", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✓ Correctly rejected invalid token")
        else:
            print("   ✗ Should have been rejected")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\nLogin functionality test completed.")

if __name__ == "__main__":
    test_login_flow()