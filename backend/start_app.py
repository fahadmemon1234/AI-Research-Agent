#!/usr/bin/env python3
"""
Application startup script
Handles database migrations before starting the server
"""

import subprocess
import sys
import os

def run_migrations():
    """Run database migrations"""
    print("Running database migrations...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], cwd=os.path.dirname(__file__), capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"Migration failed: {result.stderr}")
            return False
        print("Migrations completed successfully!")
        return True
    except Exception as e:
        print(f"Error running migrations: {e}")
        return False

def start_server():
    """Start the uvicorn server"""
    print("Starting server...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"
        ], cwd=os.path.dirname(__file__))
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    print("Starting AI Knowledge Assistant application...")
    
    # Run migrations first
    if not run_migrations():
        print("Failed to run migrations. Exiting.")
        sys.exit(1)
    
    # Start the server
    start_server()