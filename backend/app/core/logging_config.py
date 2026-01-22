import logging
from logging.handlers import RotatingFileHandler
import os
from datetime import datetime

def setup_logging():
    """Configure application logging with rotation"""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Create logger
    logger = logging.getLogger('ai_knowledge_assistant')
    logger.setLevel(logging.DEBUG)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Create rotating file handler
    file_handler = RotatingFileHandler(
        f'logs/app_{datetime.now().strftime("%Y%m%d")}.log',
        maxBytes=1024*1024*5,  # 5 MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Global logger instance
logger = setup_logging()

def log_error(error: Exception, context: str = ""):
    """Log an error with context"""
    logger.error(f"{context}: {str(error)}", exc_info=True)

def log_info(message: str):
    """Log an info message"""
    logger.info(message)

def log_debug(message: str):
    """Log a debug message"""
    logger.debug(message)

def log_warning(message: str):
    """Log a warning message"""
    logger.warning(message)