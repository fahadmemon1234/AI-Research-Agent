# Import all models to ensure relationships are properly set up
from . import user, document, chat_session, message, chunk

# This ensures all models are loaded and relationships are properly configured
__all__ = ['user', 'document', 'chat_session', 'message', 'chunk']