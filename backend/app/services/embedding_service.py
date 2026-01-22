from typing import List, Dict, Any
from app.core.logging_config import log_info, log_error
from app.core.config import settings
import google.generativeai as genai

class EmbeddingService:
    def __init__(self):
        """
        Initialize the embedding service with Gemini API
        """
        genai.configure(api_key=settings.gemini_api_key)
        self.model = "models/embedding-001"  # Using Gemini's embedding model
        
        log_info("EmbeddingService initialized with Gemini API")

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using Gemini
        """
        try:
            # Prepare the request
            result = genai.embed_content(
                model=self.model,
                content=texts,
                task_type="retrieval_document",  # Suitable for document chunks
            )
            
            embeddings = result['embedding']
            log_info(f"Generated embeddings for {len(texts)} text chunks")
            return embeddings
        except Exception as e:
            log_error(e, f"Error generating embeddings for {len(texts)} text chunks")
            raise

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        """
        try:
            result = genai.embed_content(
                model=self.model,
                content=[text],
                task_type="retrieval_document",  # Suitable for document chunks
            )
            
            embedding = result['embedding'][0]  # Get the first (and only) embedding
            log_info("Generated embedding for single text")
            return embedding
        except Exception as e:
            log_error(e, "Error generating embedding for single text")
            raise

    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings
        """
        try:
            import numpy as np
            
            # Convert to numpy arrays
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            return float(similarity)
        except Exception as e:
            log_error(e, "Error calculating similarity between embeddings")
            raise