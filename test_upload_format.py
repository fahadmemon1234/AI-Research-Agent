import requests
import json
import uuid

# Test to verify the exact format required for document uploads
BASE_URL = "http://localhost:8000/api/v1"

def test_upload_format():
    print("Testing Document Upload Format Requirements")
    print("=" * 60)
    
    # Create a test user
    test_email = f"format_test_{uuid.uuid4()}@example.com"
    test_password = "secure_password_123"
    
    print(f"Creating test user: {test_email}")
    
    # Register the user
    register_data = {
        "email": test_email,
        "password": test_password,
        "full_name": "Format Test User"
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
    
    # Test 1: Valid file upload with correct format
    print("\nTest 1: Valid file upload with correct multipart/form-data format")
    
    # Create a simple text file for testing
    test_content = "This is a test document for upload functionality.\nIt contains multiple lines to test the upload process."
    test_file = ("test_document.txt", test_content, "text/plain")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/documents/upload",
            files={"file": test_file},
            headers=headers
        )
        
        print(f"Upload Status: {response.status_code}")
        
        if response.status_code == 201:
            print("[SUCCESS] Document uploaded successfully with correct format")
            try:
                result = response.json()
                print(f"Document ID: {result['data']['id']}")
                print(f"File Path: {result['data']['file_path']}")
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
            print(f"[ERROR] Unexpected status: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"[ERROR] Upload request failed: {e}")
    
    # Test 2: Try with JSON content type (should fail)
    print("\nTest 2: Attempt upload with application/json content type (should fail)")
    
    json_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # This should fail because backend expects multipart/form-data
        response = requests.post(
            f"{BASE_URL}/documents/upload",
            data=test_content,  # Just sending raw data
            headers=json_headers
        )
        
        print(f"JSON Upload Status: {response.status_code}")
        if response.status_code == 400:
            print("[SUCCESS] Correctly rejected JSON content type")
        else:
            print(f"[UNEXPECTED] Got status {response.status_code} instead of 400")
    except Exception as e:
        print(f"[ERROR] JSON upload request failed: {e}")
    
    # Test 3: Try with wrong file extension
    print("\nTest 3: Attempt upload with invalid file extension")
    
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
                print(f"Error message: {result['message']}")
            except:
                print(f"Error response: {response.text}")
        else:
            print(f"[WARNING] Expected 400 but got {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Invalid file upload request failed: {e}")
    
    print("\n" + "=" * 60)
    print("Upload format test completed!")
    print("\nSUMMARY:")
    print("- Backend expects multipart/form-data for file uploads")
    print("- Authorization header with Bearer token is required")
    print("- Only .pdf, .txt, .docx files are allowed")
    print("- Sending files as JSON will result in 400 error")

if __name__ == "__main__":
    test_upload_format()