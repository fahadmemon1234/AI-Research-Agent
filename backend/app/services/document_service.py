from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document
from app.core.logging_config import log_info, log_error

class DocumentService:
    @staticmethod
    def create_document(db: Session, document_data: dict) -> Document:
        """
        Create a new document in the database
        """
        try:
            # Create the document object
            db_document = Document(
                filename=document_data["filename"],
                file_path=document_data["file_path"],
                file_size=document_data["file_size"],
                mime_type=document_data["mime_type"],
                user_id=document_data["user_id"],
                status=document_data["status"],
                document_metadata=document_data.get("document_metadata")
            )
            
            # Add to database
            db.add(db_document)
            db.commit()
            db.refresh(db_document)
            
            log_info(f"Document created successfully with ID: {db_document.id}")
            return db_document
        except Exception as e:
            db.rollback()
            log_error(e, f"Error creating document for user {document_data['user_id']}")
            raise

    @staticmethod
    def get_document_by_id(db: Session, document_id: int) -> Optional[Document]:
        """
        Get a document by its ID
        """
        try:
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                log_info(f"Document found with ID: {document_id}")
            else:
                log_info(f"No document found with ID: {document_id}")
            return document
        except Exception as e:
            log_error(e, f"Error retrieving document with ID: {document_id}")
            raise

    @staticmethod
    def get_document_by_id_and_user(db: Session, document_id: int, user_id: int) -> Optional[Document]:
        """
        Get a document by its ID and user ID (to ensure user owns the document)
        """
        try:
            document = db.query(Document).filter(
                Document.id == document_id,
                Document.user_id == user_id
            ).first()
            if document:
                log_info(f"Document found with ID: {document_id} for user: {user_id}")
            else:
                log_info(f"No document found with ID: {document_id} for user: {user_id}")
            return document
        except Exception as e:
            log_error(e, f"Error retrieving document with ID: {document_id} for user: {user_id}")
            raise

    @staticmethod
    def get_user_documents(db: Session, user_id: int) -> List[Document]:
        """
        Get all documents for a specific user
        """
        try:
            documents = db.query(Document).filter(Document.user_id == user_id).all()
            log_info(f"Retrieved {len(documents)} documents for user: {user_id}")
            return documents
        except Exception as e:
            log_error(e, f"Error retrieving documents for user: {user_id}")
            raise

    @staticmethod
    def update_document(db: Session, document_id: int, update_data: dict) -> Optional[Document]:
        """
        Update a document's information
        """
        try:
            db_document = db.query(Document).filter(Document.id == document_id).first()
            if not db_document:
                log_info(f"Document not found with ID: {document_id}")
                return None
            
            # Update fields
            for field, value in update_data.items():
                setattr(db_document, field, value)
            
            db.commit()
            db.refresh(db_document)
            
            log_info(f"Document updated successfully with ID: {document_id}")
            return db_document
        except Exception as e:
            db.rollback()
            log_error(e, f"Error updating document with ID: {document_id}")
            raise

    @staticmethod
    def delete_document(db: Session, document_id: int) -> bool:
        """
        Delete a document
        """
        try:
            db_document = db.query(Document).filter(Document.id == document_id).first()
            if not db_document:
                log_info(f"Document not found with ID: {document_id}")
                return False
            
            db.delete(db_document)
            db.commit()
            
            log_info(f"Document deleted successfully with ID: {document_id}")
            return True
        except Exception as e:
            db.rollback()
            log_error(e, f"Error deleting document with ID: {document_id}")
            raise