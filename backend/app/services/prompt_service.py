from typing import Dict, Any
from app.core.logging_config import log_info, log_error

class PromptService:
    def __init__(self):
        """
        Initialize the prompt service
        """
        self.system_prompt = """
        You are an AI assistant that helps users find information in their documents.
        Answer questions based on the provided context from the user's documents.
        Be concise, accurate, and cite the source of information when possible.
        If the answer is not in the provided context, say so clearly.
        """
        
        log_info("PromptService initialized")

    def build_rag_prompt(self, query: str, context: str) -> str:
        """
        Build a prompt for the RAG system with query and context
        """
        try:
            prompt = f"""
            {self.system_prompt}
            
            Context from user's documents:
            {context}
            
            User's question: {query}
            
            Answer:
            """
            
            log_info(f"Built RAG prompt for query: {query[:50]}...")
            return prompt.strip()
        except Exception as e:
            log_error(e, f"Error building RAG prompt for query: {query[:50]}...")
            raise

    def build_summarization_prompt(self, text: str) -> str:
        """
        Build a prompt for summarizing text
        """
        try:
            prompt = f"""
            Summarize the following text in a concise manner:
            
            {text}
            
            Summary:
            """
            
            log_info("Built summarization prompt")
            return prompt.strip()
        except Exception as e:
            log_error(e, "Error building summarization prompt")
            raise

    def build_question_generation_prompt(self, context: str) -> str:
        """
        Build a prompt for generating follow-up questions
        """
        try:
            prompt = f"""
            Based on the following context, generate 3 relevant follow-up questions:
            
            {context}
            
            Questions:
            1.
            2.
            3.
            """
            
            log_info("Built question generation prompt")
            return prompt.strip()
        except Exception as e:
            log_error(e, "Error building question generation prompt")
            raise

    def build_citation_prompt(self, response: str, sources: list) -> str:
        """
        Build a prompt to enhance response with proper citations
        """
        try:
            sources_str = "\n".join([
                f"- Document: {source['document_name']}, Page/Section: {source.get('page', 'N/A')}"
                for source in sources
            ])
            
            prompt = f"""
            Original response: {response}
            
            Sources used:
            {sources_str}
            
            Rewrite the response to properly cite the sources used, mentioning which document each piece of information came from.
            """
            
            log_info("Built citation enhancement prompt")
            return prompt.strip()
        except Exception as e:
            log_error(e, "Error building citation prompt")
            raise