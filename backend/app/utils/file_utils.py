import os
import uuid
from pathlib import Path
from typing import Optional
from app.core.logging_config import log_info, log_error

def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename by adding a UUID prefix to the original filename
    """
    try:
        name, ext = os.path.splitext(original_filename)
        unique_name = f"{uuid.uuid4()}_{name}{ext}"
        log_info(f"Generated unique filename: {unique_name}")
        return unique_name
    except Exception as e:
        log_error(e, "Error generating unique filename")
        raise

def save_upload_file(upload_file, destination: Path) -> bool:
    """
    Save an uploaded file to the specified destination
    """
    try:
        destination.parent.mkdir(parents=True, exist_ok=True)
        
        with destination.open("wb") as buffer:
            buffer.write(upload_file.file.read())
        
        log_info(f"File saved successfully to {destination}")
        return True
    except Exception as e:
        log_error(e, f"Error saving file to {destination}")
        return False

def get_file_size(filepath: str) -> Optional[int]:
    """
    Get the size of a file in bytes
    """
    try:
        size = os.path.getsize(filepath)
        log_info(f"File size for {filepath}: {size} bytes")
        return size
    except Exception as e:
        log_error(e, f"Error getting file size for {filepath}")
        return None

def validate_file_type(filename: str, allowed_extensions: set) -> bool:
    """
    Validate if the file extension is in the allowed list
    """
    try:
        _, ext = os.path.splitext(filename.lower())
        is_valid = ext in allowed_extensions
        log_info(f"File type validation for {filename}: {'Valid' if is_valid else 'Invalid'}")
        return is_valid
    except Exception as e:
        log_error(e, f"Error validating file type for {filename}")
        return False

def validate_file_size(file_path: str, max_size_mb: int) -> bool:
    """
    Validate if the file size is within the allowed limit
    """
    try:
        file_size_bytes = get_file_size(file_path)
        if file_size_bytes is None:
            return False
        
        max_size_bytes = max_size_mb * 1024 * 1024
        is_valid = file_size_bytes <= max_size_bytes
        log_info(f"File size validation for {file_path}: {'Valid' if is_valid else 'Invalid'} (Size: {file_size_bytes} bytes, Max: {max_size_bytes} bytes)")
        return is_valid
    except Exception as e:
        log_error(e, f"Error validating file size for {file_path}")
        return False

def create_directory_if_not_exists(directory_path: str) -> bool:
    """
    Create a directory if it doesn't exist
    """
    try:
        Path(directory_path).mkdir(parents=True, exist_ok=True)
        log_info(f"Directory ensured: {directory_path}")
        return True
    except Exception as e:
        log_error(e, f"Error creating directory: {directory_path}")
        return False