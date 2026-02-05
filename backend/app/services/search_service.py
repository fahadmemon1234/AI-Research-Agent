from typing import List, Dict, Any
from app.core.logging_config import log_info, log_error
from app.services.embedding_service import EmbeddingService
from sqlalchemy.orm import Session
from app.models.chunk import Chunk
from app.models.document import Document
import numpy as np

class SearchService:
    def __init__(self):
        """
        Initialize the search service with required components
        """
        self.embedding_service = EmbeddingService()
        
        log_info("SearchService initialized")

    def search_similar_chunks(self, query: str, user_id: int, top_k: int = 6) -> List[Dict[str, Any]]:
        """
        Search for similar chunks using vector similarity
        """
        try:
            # Generate embedding for the query
            try:
                query_embedding = self.embedding_service.generate_embedding(query)
            except Exception as embedding_error:
                log_error(embedding_error, f"Embedding generation failed for user {user_id}, returning empty results")
                # Return empty results instead of raising exception to prevent frontend hanging
                return []

            # In a real implementation, we would query the database using pgvector
            # For now, we'll simulate the search by retrieving chunks from the database
            # and calculating similarity manually

            # This is a simplified approach - in production, you'd use pgvector's
            # built-in similarity functions like cosine_distance or l2_distance
            from app.database.init_db import SessionLocal
            db = SessionLocal()

            try:
                # Get all chunks for the user's documents
                chunks = (
                    db.query(Chunk)
                    .join(Document)
                    .filter(Document.user_id == user_id)
                    .limit(100)  # Limit to prevent performance issues
                    .all()
                )

                # Calculate similarity scores for each chunk
                similarities = []
                for chunk in chunks:
                    # Convert stored embedding string back to list (in a real implementation,
                    # this would be stored as a proper vector in pgvector)
                    try:
                        chunk_embedding = eval(chunk.embedding)  # Not safe in production!
                        similarity = self.embedding_service.calculate_similarity(
                            query_embedding,
                            chunk_embedding
                        )
                        similarities.append((chunk, similarity))
                    except:
                        # Skip chunks with invalid embeddings
                        continue

                # Sort by similarity score (descending)
                similarities.sort(key=lambda x: x[1], reverse=True)

                # Get top_k results
                top_results = similarities[:top_k]

                # Format results
                formatted_results = []
                for chunk, similarity in top_results:
                    # Get document info
                    document = db.query(Document).filter(Document.id == chunk.doc_id).first()

                    formatted_results.append({
                        "id": chunk.id,
                        "document_id": chunk.doc_id,
                        "document_name": document.filename if document else "Unknown",
                        "chunk_text": chunk.chunk_text,
                        "similarity_score": similarity,
                        "chunk_index": chunk.chunk_index,
                        "char_start_idx": chunk.char_start_idx,
                        "char_end_idx": chunk.char_end_idx
                    })

                log_info(f"Found {len(formatted_results)} similar chunks for query")
                return formatted_results
            finally:
                db.close()
        except Exception as e:
            log_error(e, f"Error searching similar chunks for user {user_id}")
            # Return empty results instead of raising exception to prevent frontend hanging
            return []

    def search_similar_chunks_advanced(self, query: str, user_id: int, top_k: int = 6,
                                     filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Advanced search with filters and metadata
        """
        try:
            # Generate embedding for the query
            try:
                query_embedding = self.embedding_service.generate_embedding(query)
            except Exception as embedding_error:
                log_error(embedding_error, f"Embedding generation failed for advanced search for user {user_id}, returning empty results")
                # Return empty results instead of raising exception to prevent frontend hanging
                return []

            # In a real implementation, we would use pgvector with filters
            # For now, we'll extend the basic search with filter capabilities

            from app.database.init_db import SessionLocal
            db = SessionLocal()

            try:
                # Build query with filters
                query_obj = db.query(Chunk).join(Document).filter(Document.user_id == user_id)

                # Apply filters if provided
                if filters:
                    # Example: filter by document type, date range, etc.
                    if "document_type" in filters:
                        # This would be implemented based on your specific needs
                        pass

                chunks = query_obj.limit(100).all()

                # Calculate similarity scores for each chunk
                similarities = []
                for chunk in chunks:
                    try:
                        chunk_embedding = eval(chunk.embedding)  # Not safe in production!
                        similarity = self.embedding_service.calculate_similarity(
                            query_embedding,
                            chunk_embedding
                        )
                        similarities.append((chunk, similarity))
                    except:
                        # Skip chunks with invalid embeddings
                        continue

                # Sort by similarity score (descending)
                similarities.sort(key=lambda x: x[1], reverse=True)

                # Get top_k results
                top_results = similarities[:top_k]

                # Format results
                formatted_results = []
                for chunk, similarity in top_results:
                    # Get document info
                    document = db.query(Document).filter(Document.id == chunk.doc_id).first()

                    formatted_results.append({
                        "id": chunk.id,
                        "document_id": chunk.doc_id,
                        "document_name": document.filename if document else "Unknown",
                        "chunk_text": chunk.chunk_text,
                        "similarity_score": similarity,
                        "metadata": chunk.metadata,
                        "chunk_index": chunk.chunk_index
                    })

                log_info(f"Advanced search found {len(formatted_results)} similar chunks for query")
                return formatted_results
            finally:
                db.close()
        except Exception as e:
            log_error(e, f"Error performing advanced search for user {user_id}")
            # Return empty results instead of raising exception to prevent frontend hanging
            return []