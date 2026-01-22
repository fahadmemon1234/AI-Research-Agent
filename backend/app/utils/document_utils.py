import os
from typing import List, Tuple
from app.core.logging_config import log_info, log_error

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF file
    """
    try:
        import PyPDF2
        
        text = ""
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        log_info(f"Text extracted from PDF: {pdf_path}")
        return text
    except Exception as e:
        log_error(e, f"Error extracting text from PDF: {pdf_path}")
        return ""

def extract_text_from_docx(docx_path: str) -> str:
    """
    Extract text from a DOCX file
    """
    try:
        from docx import Document
        
        doc = Document(docx_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        log_info(f"Text extracted from DOCX: {docx_path}")
        return text
    except Exception as e:
        log_error(e, f"Error extracting text from DOCX: {docx_path}")
        return ""

def extract_text_from_txt(txt_path: str) -> str:
    """
    Extract text from a TXT file
    """
    try:
        with open(txt_path, 'r', encoding='utf-8') as file:
            text = file.read()
        
        log_info(f"Text extracted from TXT: {txt_path}")
        return text
    except Exception as e:
        log_error(e, f"Error extracting text from TXT: {txt_path}")
        return ""

def get_document_pages_count(pdf_path: str) -> int:
    """
    Get the number of pages in a PDF document
    """
    try:
        import PyPDF2
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            pages_count = len(pdf_reader.pages)
        
        log_info(f"Pages count for PDF {pdf_path}: {pages_count}")
        return pages_count
    except Exception as e:
        log_error(e, f"Error getting pages count for PDF: {pdf_path}")
        return 0

def validate_document_file(file_path: str) -> Tuple[bool, str]:
    """
    Validate if the document file is accessible and has valid content
    """
    try:
        if not os.path.exists(file_path):
            return False, "File does not exist"
        
        if os.path.getsize(file_path) == 0:
            return False, "File is empty"
        
        # Try to extract text to ensure the file is not corrupted
        _, ext = os.path.splitext(file_path.lower())
        
        if ext == '.pdf':
            text = extract_text_from_pdf(file_path)
        elif ext == '.docx':
            text = extract_text_from_docx(file_path)
        elif ext == '.txt':
            text = extract_text_from_txt(file_path)
        else:
            return False, f"Unsupported file type: {ext}"
        
        if not text.strip():
            return False, "File contains no readable text"
        
        log_info(f"Document validation successful for: {file_path}")
        return True, "Valid document"
    except Exception as e:
        log_error(e, f"Error validating document: {file_path}")
        return False, str(e)