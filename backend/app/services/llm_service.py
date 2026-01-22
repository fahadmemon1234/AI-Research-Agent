from typing import Generator, Dict, Any
from app.core.logging_config import log_info, log_error
from app.core.config import settings
import google.generativeai as genai

class LLMService:
    def __init__(self):
        """
        Initialize the LLM service with Gemini API
        """
        genai.configure(api_key=settings.gemini_api_key)
        # Using Gemini Flash for faster, lower-cost responses
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        log_info("LLMService initialized with Gemini API")

    def generate_response(self, prompt: str) -> str:
        """
        Generate a response from the LLM based on the prompt
        """
        try:
            log_info(f"Sending prompt to LLM: {prompt[:50]}...")
            
            # Generate content
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 2048,
                    "candidate_count": 1
                },
                safety_settings={
                    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_HARASSMENT": "BLOCK_LOW_AND_ABOVE",
                }
            )
            
            # Extract text from response
            result = response.text if response.text else "I couldn't generate a response for your query."
            
            log_info("Response generated successfully")
            return result
        except Exception as e:
            log_error(e, f"Error generating response for prompt: {prompt[:50]}...")
            raise

    def generate_response_streaming(self, prompt: str) -> Generator[str, None, None]:
        """
        Generate a streaming response from the LLM based on the prompt
        """
        try:
            log_info(f"Sending prompt to LLM for streaming: {prompt[:50]}...")
            
            # Generate content with streaming
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 2048,
                    "candidate_count": 1
                },
                safety_settings={
                    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_LOW_AND_ABOVE",
                    "HARM_CATEGORY_HARASSMENT": "BLOCK_LOW_AND_ABOVE",
                },
                stream=True
            )
            
            # Stream the response
            for chunk in response:
                if chunk.text:
                    yield chunk.text
            
            log_info("Streaming response completed")
        except Exception as e:
            log_error(e, f"Error generating streaming response for prompt: {prompt[:50]}...")
            raise

    def embed_text(self, text: str) -> list:
        """
        Generate embeddings for text using Gemini
        """
        try:
            result = genai.embed_content(
                model="models/embedding-001",
                content=[text],
                task_type="retrieval_document",
            )
            
            embedding = result['embedding'][0]
            log_info("Text embedding generated successfully")
            return embedding
        except Exception as e:
            log_error(e, f"Error generating embedding for text: {text[:50]}...")
            raise

    def moderate_content(self, text: str) -> Dict[str, Any]:
        """
        Moderate content using the LLM's safety features
        """
        try:
            # This would use Gemini's safety features to moderate content
            # For now, we'll return a mock response
            moderation_result = {
                "flagged": False,
                "categories": {},
                "score": 0.0
            }
            
            log_info("Content moderation completed")
            return moderation_result
        except Exception as e:
            log_error(e, f"Error moderating content: {text[:50]}...")
            raise