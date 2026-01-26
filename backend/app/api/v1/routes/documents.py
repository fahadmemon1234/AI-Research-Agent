from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
from app.database.session import get_db
from app.core.middleware import require_active_user
from app.models.user import User
from app.services.document_service import DocumentService
from app.schemas.document import DocumentResponse, DocumentStatus
from app.utils.file_utils import generate_unique_filename, save_upload_file, validate_file_type
from app.utils.document_utils import validate_document_file
from app.api.v1.utils import success_response, error_response, auth_error_response
from pathlib import Path

router = APIRouter()

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx"}

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload a document for the current user
    """
    # Validate file type
    if not validate_file_type(file.filename, ALLOWED_EXTENSIONS):
        return error_response(
            f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
            "INVALID_FILE_TYPE",
            400
        )
    
    try:
        # Generate unique filename
        unique_filename = generate_unique_filename(file.filename)
        
        # Define upload path
        upload_dir = Path("uploads") / str(current_user.id)
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / unique_filename
        
        # Save the uploaded file
        success = save_upload_file(file, file_path)
        if not success:
            return error_response("Failed to save uploaded file", "SAVE_FILE_ERROR", 500)
        
        # Validate the document file
        is_valid, validation_msg = validate_document_file(str(file_path))
        if not is_valid:
            # Clean up the invalid file
            if file_path.exists():
                file_path.unlink()
            return error_response(f"Invalid document: {validation_msg}", "INVALID_DOCUMENT", 400)
        
        # Create document record in database
        document_data = {
            "filename": file.filename,
            "file_path": str(file_path),
            "file_size": file_path.stat().st_size,
            "mime_type": file.content_type,
            "user_id": current_user.id,
            "status": DocumentStatus.PENDING.value  # Initially set to pending
        }
        
        document = DocumentService.create_document(db, document_data)

        # Convert to dictionary to ensure JSON serialization
        document_response = DocumentResponse.model_validate(document)
        return success_response(
            data=document_response.model_dump(mode='json'),
            message="Document uploaded successfully",
            status_code=201
        )
    except Exception as e:
        return error_response(f"Upload failed: {str(e)}", "UPLOAD_ERROR", 500)


@router.get("/")
def list_documents(
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    List all documents for the current user
    """
    try:
        documents = DocumentService.get_user_documents(db, current_user.id)
        document_responses = [DocumentResponse.model_validate(doc).model_dump(mode='json') for doc in documents]

        return success_response(
            data={"documents": document_responses},
            message="Documents retrieved successfully"
        )
    except Exception as e:
        return error_response(f"Failed to retrieve documents: {str(e)}", "RETRIEVE_ERROR", 500)


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a document by ID
    """
    try:
        # Verify that the document belongs to the current user
        document = DocumentService.get_document_by_id_and_user(db, document_id, current_user.id)
        if not document:
            return error_response("Document not found or access denied", "DOCUMENT_NOT_FOUND", 404)

        # Delete the document record
        success = DocumentService.delete_document(db, document_id)
        if not success:
            return error_response("Failed to delete document", "DELETE_ERROR", 500)

        # Optionally delete the physical file
        if os.path.exists(document.file_path):
            try:
                os.remove(document.file_path)
            except OSError:
                # Log the error but don't fail the operation
                pass

        return success_response(
            message="Document deleted successfully"
        )
    except Exception as e:
        return error_response(f"Failed to delete document: {str(e)}", "DELETE_ERROR", 500)