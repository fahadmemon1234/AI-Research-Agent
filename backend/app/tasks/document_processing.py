import asyncio
from typing import Dict, Any
from app.core.logging_config import log_info, log_error
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.document_service import DocumentService
from app.models.chunk import Chunk
from app.models.document import DocumentStatus
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class DocumentProcessingTask:
    def __init__(self, db_url: str):
        """
        Initialize the document processing task with database connection
        """
        self.engine = create_engine(db_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()
        
        log_info("DocumentProcessingTask initialized")

    async def process_document(self, document_id: int) -> bool:
        """
        Process a document: chunk it, generate embeddings, and store in DB
        """
        try:
            # Get database session
            db = self.SessionLocal()
            
            try:
                # Get the document
                document = DocumentService.get_document_by_id(db, document_id)
                if not document:
                    log_error(None, f"Document with ID {document_id} not found")
                    return False
                
                # Update document status to processing
                DocumentService.update_document(db, document_id, {"status": DocumentStatus.PROCESSING.value})
                
                # Chunk the document
                log_info(f"Starting to chunk document {document_id}")
                chunks_data = self.chunking_service.chunk_document(document.file_path)
                
                # Process each chunk
                for chunk_data in chunks_data:
                    # Generate embedding for the chunk
                    embedding = self.embedding_service.generate_embedding(chunk_data["chunk_text"])
                    
                    # Create chunk record in database
                    db_chunk = Chunk(
                        doc_id=document_id,
                        chunk_text=chunk_data["chunk_text"],
                        embedding=str(embedding),  # Store as string representation for now
                        chunk_index=chunk_data["chunk_index"],
                        char_start_idx=chunk_data["char_start_idx"],
                        char_end_idx=chunk_data["char_end_idx"],
                        chunk_metadata=f"{{'file_path': '{chunk_data['file_path']}'}}"  # Store as JSON string
                    )
                    
                    db.add(db_chunk)
                
                # Update document status to ready
                DocumentService.update_document(
                    db, 
                    document_id, 
                    {
                        "status": DocumentStatus.READY.value,
                        "processed_at": "NOW()"  # This will be handled by the database
                    }
                )
                
                # Commit the transaction
                db.commit()
                
                log_info(f"Document {document_id} processed successfully with {len(chunks_data)} chunks")
                return True
            finally:
                db.close()
        except Exception as e:
            log_error(e, f"Error processing document with ID {document_id}")
            return False

    async def queue_document_processing(self, document_id: int) -> bool:
        """
        Queue a document for processing (in a real implementation, this would add to a proper queue)
        """
        try:
            # In a real implementation, this would add the task to a proper queue like Celery
            # For now, we'll just process it synchronously
            log_info(f"Queueing document {document_id} for processing")
            return await self.process_document(document_id)
        except Exception as e:
            log_error(e, f"Error queueing document {document_id} for processing")
            return False