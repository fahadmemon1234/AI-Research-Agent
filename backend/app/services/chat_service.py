from typing import List, Dict, Any, Optional
from app.core.logging_config import log_info, log_error
from app.models.chat_session import ChatSession
from app.models.message import Message
from app.models.user import User
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

class ChatService:
    def __init__(self):
        """
        Initialize the chat service
        """
        log_info("ChatService initialized")

    def create_chat_session(self, db: Session, user_id: int, title: str = None) -> ChatSession:
        """
        Create a new chat session for a user
        """
        try:
            # If no title is provided, generate one
            if not title:
                title = f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"

            # Create the chat session object
            db_chat_session = ChatSession(
                user_id=user_id,
                title=title,
                is_archived=False
            )

            # Add to database
            db.add(db_chat_session)
            db.commit()
            db.refresh(db_chat_session)

            log_info(f"Chat session created successfully with ID: {db_chat_session.id}")
            return db_chat_session
        except Exception as e:
            db.rollback()
            log_error(e, f"Error creating chat session for user: {user_id}")
            raise

    def get_chat_session_by_id(self, db: Session, session_id: int) -> Optional[ChatSession]:
        """
        Get a chat session by its ID
        """
        try:
            chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
            if chat_session:
                log_info(f"Chat session found with ID: {session_id}")
            else:
                log_info(f"No chat session found with ID: {session_id}")
            return chat_session
        except Exception as e:
            log_error(e, f"Error retrieving chat session with ID: {session_id}")
            raise

    def get_user_chat_sessions(self, db: Session, user_id: int) -> List[ChatSession]:
        """
        Get all chat sessions for a specific user
        """
        try:
            chat_sessions = db.query(ChatSession).filter(ChatSession.user_id == user_id).all()
            log_info(f"Retrieved {len(chat_sessions)} chat sessions for user: {user_id}")
            return chat_sessions
        except Exception as e:
            log_error(e, f"Error retrieving chat sessions for user: {user_id}")
            raise

    def add_message_to_session(self, db: Session, session_id: int, sender_type: str, content: str, 
                             source_documents: str = None, token_count: int = None) -> Message:
        """
        Add a message to a chat session
        """
        try:
            # Create the message object
            db_message = Message(
                chat_session_id=session_id,
                sender_type=sender_type,
                content=content,
                source_documents=source_documents,
                token_count=token_count
            )

            # Add to database
            db.add(db_message)
            db.commit()
            db.refresh(db_message)

            log_info(f"Message added to session {session_id} with ID: {db_message.id}")
            return db_message
        except Exception as e:
            db.rollback()
            log_error(e, f"Error adding message to session {session_id}")
            raise

    def get_messages_for_session(self, db: Session, session_id: int) -> List[Message]:
        """
        Get all messages for a specific chat session
        """
        try:
            messages = db.query(Message).filter(Message.chat_session_id == session_id).order_by(Message.created_at).all()
            log_info(f"Retrieved {len(messages)} messages for session: {session_id}")
            return messages
        except Exception as e:
            log_error(e, f"Error retrieving messages for session: {session_id}")
            raise

    def update_chat_session_title(self, db: Session, session_id: int, title: str) -> Optional[ChatSession]:
        """
        Update the title of a chat session
        """
        try:
            db_chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not db_chat_session:
                log_info(f"Chat session not found with ID: {session_id}")
                return None

            # Update the title
            db_chat_session.title = title
            db.commit()
            db.refresh(db_chat_session)

            log_info(f"Chat session title updated for ID: {session_id}")
            return db_chat_session
        except Exception as e:
            db.rollback()
            log_error(e, f"Error updating chat session title for ID: {session_id}")
            raise

    def archive_chat_session(self, db: Session, session_id: int) -> bool:
        """
        Archive a chat session
        """
        try:
            db_chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not db_chat_session:
                log_info(f"Chat session not found with ID: {session_id}")
                return False

            # Update the archived status
            db_chat_session.is_archived = True
            db.commit()

            log_info(f"Chat session archived successfully with ID: {session_id}")
            return True
        except Exception as e:
            db.rollback()
            log_error(e, f"Error archiving chat session with ID: {session_id}")
            raise

    def delete_chat_session(self, db: Session, session_id: int) -> bool:
        """
        Delete a chat session and all its messages
        """
        try:
            # Get the chat session
            db_chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not db_chat_session:
                log_info(f"Chat session not found with ID: {session_id}")
                return False

            # Delete all messages in the session first (due to foreign key constraint)
            db.query(Message).filter(Message.chat_session_id == session_id).delete()

            # Delete the chat session
            db.delete(db_chat_session)
            db.commit()

            log_info(f"Chat session deleted successfully with ID: {session_id}")
            return True
        except Exception as e:
            db.rollback()
            log_error(e, f"Error deleting chat session with ID: {session_id}")
            raise

    def generate_session_title(self, db: Session, session_id: int) -> str:
        """
        Generate a title for a chat session based on the first few messages
        """
        try:
            # Get the first few messages from the session
            messages = db.query(Message).filter(
                Message.chat_session_id == session_id
            ).order_by(Message.created_at).limit(3).all()

            if not messages:
                return f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"

            # Create a title based on the first user message
            for message in messages:
                if message.sender_type == "user":
                    # Use the first 50 characters of the message as the title
                    title = message.content[:50]
                    if len(message.content) > 50:
                        title += "..."
                    return title

            # If no user message found, use the first AI response
            for message in messages:
                if message.sender_type == "ai":
                    title = message.content[:50]
                    if len(message.content) > 50:
                        title += "..."
                    return f"Re: {title}"

            # Fallback
            return f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        except Exception as e:
            log_error(e, f"Error generating title for session: {session_id}")
            return f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"