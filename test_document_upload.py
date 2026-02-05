import requests
import json
import uuid

# Test script for document upload functionality
BASE_URL = "http://localhost:8000/api/v1"

def test_document_upload():
    print("Testing Document Upload Functionality")
    print("=" * 50)
    
    # Create a test user
    test_email = f"upload_test_{uuid.uuid4()}@example.com"
    test_password = "secure_password_123"
    
    print(f"Creating test user: {test_email}")
    
    # Register the user
    register_data = {
        "email": test_email,
        "password": test_password,
        "full_name": "Upload Test User"
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
    
    # Test document upload with a simple text file
    print("\nTesting document upload...")
    
    # Create a simple text file for testing
    test_content = "This is a test document for upload functionality."
    test_file = ("test_document.txt", test_content, "text/plain")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Upload the file using multipart/form-data
        response = requests.post(
            f"{BASE_URL}/documents/upload",
            files={"file": test_file},
            headers=headers
        )
        
        print(f"Upload Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("[SUCCESS] Document uploaded successfully")
            try:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
            except:
                print(f"Response: {response.text}")
        elif response.status_code == 400:
            print("[ERROR] Upload failed with 400 Bad Request")
            try:
                result = response.json()
                print(f"Error details: {json.dumps(result, indent=2)}")
            except:
                print(f"Error details: {response.text}")
        else:
            print(f"[ERROR] Upload failed with status {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"[ERROR] Upload request failed: {e}")
    
    # Test with an invalid file type
    print("\nTesting upload with invalid file type...")
    
    invalid_content = "This is not a valid document type."
    invalid_file = ("test_document.exe", invalid_content, "application/octet-stream")
    
    try:
        response = requests.post(
            f"{BASE_URL}/documents/upload",
            files={"file": invalid_file},
            headers=headers
        )
        
        print(f"Invalid file upload Status: {response.status_code}")
        
        if response.status_code == 400:
            print("[SUCCESS] Correctly rejected invalid file type")
            try:
                result = response.json()
                print(f"Error response: {json.dumps(result, indent=2)}")
            except:
                print(f"Error response: {response.text}")
        else:
            print(f"[WARNING] Expected 400 but got {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Invalid file upload request failed: {e}")
    
    print("\n" + "=" * 50)
    print("Document upload test completed!")

if __name__ == "__main__":
    test_document_upload()