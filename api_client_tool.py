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
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(stats_url, headers=headers)
        
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
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(documents_url, headers=headers, params=params)
        
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

def upload_document(file_path: str, token: str):
    """Upload document with authentication token"""
    upload_url = f"{BASE_URL}/documents/upload"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    if not os.path.exists(file_path):
        print(f"File does not exist: {file_path}")
        return None
        
    try:
        with open(file_path, 'rb') as file:
            files = {
                'file': (os.path.basename(file_path), file, 'application/pdf')
            }
            
            response = requests.post(upload_url, files=files, headers=headers)
            
            if response.status_code in [200, 201]:
                print("Document uploaded successfully!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Upload failed: {response.status_code}")
                print(response.text)
                
            return response
    except requests.exceptions.RequestException as e:
        print(f"Network error during upload: {e}")
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

def main():
    print("AI Research Agent - API Client Tool")
    print("=" * 45)
    
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
    
    # Login to get the token
    print("Now logging in...")
    email = input("Enter your email: ")
    password = input("Enter your password: ")
    
    token = login_user(email, password)
    
    if not token:
        print("Cannot proceed without authentication token.")
        return
    
    print(f"\nSuccessfully logged in. Token received (first 20 chars): {token[:20]}...")
    
    # Ask what action to perform
    print("\nSelect an action:")
    print("1. Upload a document")
    print("2. List documents")
    print("3. Get user statistics")
    print("4. All of the above")
    
    choice = input("Enter your choice (1-4): ")
    
    if choice == "1":
        file_path = input("\nEnter the path to the document you want to upload: ")
        print(f"Uploading {os.path.basename(file_path)}...")
        upload_document(file_path, token)
    elif choice == "2":
        page = int(input("Enter page number (default 1): ") or "1")
        limit = int(input("Enter limit (default 10): ") or "10")
        print(f"Listing documents (page {page}, limit {limit})...")
        list_documents(token, page, limit)
    elif choice == "3":
        print("Getting user statistics...")
        get_user_stats(token)
    elif choice == "4":
        # Upload a document
        file_path = input("\nEnter the path to the document you want to upload (press Enter to skip): ")
        if file_path:
            print(f"Uploading {os.path.basename(file_path)}...")
            upload_document(file_path, token)
        
        # List documents
        print("\nListing documents...")
        list_documents(token)
        
        # Get stats
        print("\nGetting user statistics...")
        get_user_stats(token)
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()