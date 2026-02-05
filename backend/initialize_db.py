#!/usr/bin/env python3
"""
Script to initialize the database and create all tables
"""

import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from app.database.db_setup import init_db

if __name__ == "__main__":
    print("Starting database initialization...")
    try:
        init_db()
        print("Database initialized successfully!")
        print("All tables have been created.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)