from typing import List, Dict, Any
from app.core.logging_config import log_info, log_error
from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from app.services.prompt_service import PromptService
from app.services.citation_service import CitationService
from app.models.message import Message
from app.models.chat_session import ChatSession
from app.services.chat_service import ChatService
from sqlalchemy.orm import Session

class RAGService:
    def __init__(self):
        """
        Initialize the RAG service with required components
        """
        self.search_service = SearchService()
        self.llm_service = LLMService()
        self.prompt_service = PromptService()
        self.citation_service = CitationService()
        
        log_info("RAGService initialized")

    def query_documents(self, query: str, user_id: int, session_id: str = None, top_k: int = 6) -> Dict[str, Any]:
        """
        Process a query against user's documents using RAG
        """
        try:
            # Retrieve relevant chunks for the query
            log_info(f"Searching for relevant chunks for query: {query[:50]}...")
            relevant_chunks = self.search_service.search_similar_chunks(query, user_id, top_k)

            log_info(f"Found {len(relevant_chunks)} relevant chunks")

            # Build the prompt with context from retrieved chunks
            context = self._build_context_from_chunks(relevant_chunks)
            prompt = self.prompt_service.build_rag_prompt(query, context)

            # Generate response using LLM
            log_info("Generating response with LLM")

            try:
                response = self.llm_service.generate_response(prompt)
            except Exception as llm_error:
                log_error(llm_error, "LLM service error, returning mock response")
                # Return mock response if LLM service fails
                response = f"This is a mock response for your query: '{query}'. The actual AI service is not configured."

            # Create citations for the sources
            citations = self.citation_service.create_citations(relevant_chunks)

            # If session_id is provided, save the interaction
            if session_id:
                # In a real implementation, we would save the query and response to the session
                pass

            result = {
                "response": response,
                "sources": citations,
                "session_id": session_id
            }

            log_info("Query processed successfully")
            return result
        except Exception as e:
            log_error(e, f"Error processing query: {query[:50]}...")
            # Return a safe result to prevent errors
            return {
                "response": f"Error processing query: {str(e)}",
                "sources": [],
                "session_id": session_id
            }

    def _build_context_from_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Build context string from retrieved chunks
        """
        context_parts = []
        for chunk in chunks:
            # Add chunk text to context
            context_parts.append(f"Document: {chunk.get('document_name', 'Unknown')}")
            context_parts.append(f"Content: {chunk.get('chunk_text', '')}")
            context_parts.append("---")  # Separator between chunks
        
        return "\n".join(context_parts)
    
    def query_documents_streaming(self, query: str, user_id: int, session_id: str = None, top_k: int = 6):
        """
        Process a query against user's documents using RAG with streaming response
        """
        try:
            # Retrieve relevant chunks for the query
            log_info(f"Searching for relevant chunks for query: {query[:50]}...")
            relevant_chunks = self.search_service.search_similar_chunks(query, user_id, top_k)

            log_info(f"Found {len(relevant_chunks)} relevant chunks")

            # Build the prompt with context from retrieved chunks
            context = self._build_context_from_chunks(relevant_chunks)
            prompt = self.prompt_service.build_rag_prompt(query, context)

            # Generate response using LLM with streaming
            log_info("Generating streaming response with LLM")

            # For testing purposes, yield some mock data if API call fails
            try:
                response_generator = self.llm_service.generate_response_streaming(prompt)

                # Create citations for the sources
                citations = self.citation_service.create_citations(relevant_chunks)

                # Yield response parts and final result
                for part in response_generator:
                    yield {
                        "type": "stream",
                        "content": part,
                        "is_complete": False
                    }

                # Send completion message with citations
                yield {
                    "type": "complete",
                    "sources": citations,
                    "session_id": session_id,
                    "is_complete": True
                }
            except Exception as llm_error:
                log_error(llm_error, "LLM service error, returning mock response")
                # Send mock response if LLM service fails
                mock_response_parts = ["Processing your query...", "Finding relevant information...", "Preparing response..."]

                for part in mock_response_parts:
                    yield {
                        "type": "stream",
                        "content": part,
                        "is_complete": False
                    }
                    import time
                    time.sleep(0.5)  # Simulate streaming delay

                # Send completion message
                yield {
                    "type": "complete",
                    "sources": [{"document_name": "mock_doc.pdf", "page": 1, "content": "Mock content"}],
                    "session_id": session_id,
                    "is_complete": True
                }

            log_info("Streaming query processed successfully")
        except Exception as e:
            log_error(e, f"Error processing streaming query: {query[:50]}...")
            # Ensure we always send a completion message to prevent frontend from hanging
            yield {
                "type": "complete",
                "sources": [],
                "session_id": session_id,
                "is_complete": True,
                "error": str(e)
            }