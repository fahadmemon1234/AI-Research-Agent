from typing import List, Dict, Any
from app.core.logging_config import log_info, log_error
from app.utils.document_utils import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
import os

class ChunkingService:
    def __init__(self, chunk_size: int = 512, overlap_percent: float = 0.1):
        """
        Initialize the chunking service with specified parameters
        """
        self.chunk_size = chunk_size
        self.overlap_size = int(chunk_size * overlap_percent)
        
        log_info(f"ChunkingService initialized with chunk_size: {chunk_size}, overlap: {self.overlap_size}")

    def chunk_document(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Chunk a document into segments of specified size with overlap
        """
        try:
            # Extract text from the document based on its type
            _, ext = os.path.splitext(file_path.lower())
            
            if ext == '.pdf':
                text = extract_text_from_pdf(file_path)
            elif ext == '.docx':
                text = extract_text_from_docx(file_path)
            elif ext == '.txt':
                text = extract_text_from_txt(file_path)
            else:
                raise ValueError(f"Unsupported file type: {ext}")
            
            if not text.strip():
                log_error(None, f"Document {file_path} contains no text to chunk")
                return []
            
            # Split text into chunks
            chunks = self._split_text(text, file_path)
            
            log_info(f"Document {file_path} chunked into {len(chunks)} segments")
            return chunks
        except Exception as e:
            log_error(e, f"Error chunking document: {file_path}")
            raise

    def _split_text(self, text: str, file_path: str) -> List[Dict[str, Any]]:
        """
        Split text into chunks of specified size with overlap
        """
        chunks = []
        
        # Split text into sentences to avoid breaking in the middle of sentences
        sentences = self._split_into_sentences(text)
        
        current_chunk = ""
        current_size = 0
        chunk_index = 0
        char_start_idx = 0
        
        for sentence in sentences:
            sentence_size = len(sentence)
            
            # If adding this sentence would exceed chunk size
            if current_size + sentence_size > self.chunk_size and current_chunk:
                # Save the current chunk
                chunks.append({
                    "chunk_text": current_chunk.strip(),
                    "chunk_index": chunk_index,
                    "char_start_idx": char_start_idx,
                    "char_end_idx": char_start_idx + len(current_chunk),
                    "file_path": file_path
                })
                
                # Start a new chunk with overlap
                if self.overlap_size > 0:
                    # Get the end portion of the current chunk for overlap
                    overlap_start = max(0, len(current_chunk) - self.overlap_size)
                    current_chunk = current_chunk[overlap_start:]
                    current_size = len(current_chunk)
                    char_start_idx = char_start_idx + overlap_start
                else:
                    current_chunk = ""
                    current_size = 0
                    char_start_idx = char_start_idx + len(current_chunk)
                
                chunk_index += 1
            
            current_chunk += sentence
            current_size += sentence_size
        
        # Add the last chunk if it has content
        if current_chunk.strip():
            chunks.append({
                "chunk_text": current_chunk.strip(),
                "chunk_index": chunk_index,
                "char_start_idx": char_start_idx,
                "char_end_idx": char_start_idx + len(current_chunk),
                "file_path": file_path
            })
        
        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences
        """
        import re
        
        # This is a simple sentence splitter
        # In a production environment, you might want to use a more sophisticated NLP library
        sentence_endings = re.compile(r'[.!?]+\s+')
        sentences = sentence_endings.split(text)
        
        # Reattach the punctuation to each sentence
        sentence_list = []
        start = 0
        for sentence in sentences:
            # Find the end of this sentence in the original text
            match = sentence_endings.search(text, start)
            if match:
                full_sentence = text[start:match.end()]
                sentence_list.append(full_sentence)
                start = match.end()
            else:
                # Last sentence without ending punctuation
                if start < len(text):
                    sentence_list.append(text[start:])
                break
        
        return sentence_list