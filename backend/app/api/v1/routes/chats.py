from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.core.middleware import require_active_user
from app.models.user import User
from app.services.chat_service import ChatService
from app.api.v1.utils import success_response, error_response
from app.models.chat_session import ChatSession
from app.models.message import Message

router = APIRouter()
chat_service = ChatService()

@router.get("/")
def list_chat_sessions(
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    List all chat sessions for the current user
    """
    try:
        sessions = chat_service.get_user_chat_sessions(db, current_user.id)
        
        # Format the sessions for response
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                "id": session.id,
                "title": session.title,
                "created_at": session.created_at.isoformat() if session.created_at else None,
                "updated_at": session.updated_at.isoformat() if session.updated_at else None,
                "is_archived": session.is_archived
            })
        
        return success_response(
            data=formatted_sessions,
            message="Chat sessions retrieved successfully"
        )
    except Exception as e:
        return error_response(f"Failed to retrieve chat sessions: {str(e)}", "SESSION_RETRIEVE_ERROR", 500)


@router.get("/{session_id}/messages")
def get_chat_session_messages(
    session_id: int,
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages for a specific chat session
    """
    try:
        # Verify that the session belongs to the current user
        session = chat_service.get_chat_session_by_id(db, session_id)
        if not session or session.user_id != current_user.id:
            return error_response("Session not found or access denied", "SESSION_NOT_FOUND", 404)
        
        messages = chat_service.get_messages_for_session(db, session_id)
        
        # Format the messages for response
        formatted_messages = []
        for message in messages:
            formatted_messages.append({
                "id": message.id,
                "sender_type": message.sender_type,
                "content": message.content,
                "created_at": message.created_at.isoformat() if message.created_at else None,
                "source_documents": message.source_documents,
                "token_count": message.token_count,
                "response_time_ms": message.response_time_ms
            })
        
        return success_response(
            data=formatted_messages,
            message="Messages retrieved successfully"
        )
    except Exception as e:
        return error_response(f"Failed to retrieve messages: {str(e)}", "MESSAGE_RETRIEVE_ERROR", 500)


@router.post("/")
def create_chat_session(
    session_data: Dict[str, Any],
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new chat session
    """
    try:
        title = session_data.get("title", None)
        
        session = chat_service.create_chat_session(db, current_user.id, title)
        
        return success_response(
            data={
                "id": session.id,
                "title": session.title,
                "created_at": session.created_at.isoformat() if session.created_at else None,
                "updated_at": session.updated_at.isoformat() if session.updated_at else None,
                "is_archived": session.is_archived
            },
            message="Chat session created successfully",
            status_code=201
        )
    except Exception as e:
        return error_response(f"Failed to create chat session: {str(e)}", "SESSION_CREATE_ERROR", 500)


@router.put("/{session_id}/title")
def update_chat_session_title(
    session_id: int,
    title_data: Dict[str, str],
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Update the title of a chat session
    """
    try:
        # Verify that the session belongs to the current user
        session = chat_service.get_chat_session_by_id(db, session_id)
        if not session or session.user_id != current_user.id:
            return error_response("Session not found or access denied", "SESSION_NOT_FOUND", 404)
        
        new_title = title_data.get("title", "")
        if not new_title.strip():
            return error_response("Title cannot be empty", "INVALID_TITLE", 400)
        
        updated_session = chat_service.update_chat_session_title(db, session_id, new_title)
        if not updated_session:
            return error_response("Failed to update session title", "TITLE_UPDATE_ERROR", 500)
        
        return success_response(
            data={
                "id": updated_session.id,
                "title": updated_session.title,
                "updated_at": updated_session.updated_at.isoformat() if updated_session.updated_at else None
            },
            message="Chat session title updated successfully"
        )
    except Exception as e:
        return error_response(f"Failed to update session title: {str(e)}", "TITLE_UPDATE_ERROR", 500)


@router.delete("/{session_id}")
def delete_chat_session(
    session_id: int,
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a chat session
    """
    try:
        # Verify that the session belongs to the current user
        session = chat_service.get_chat_session_by_id(db, session_id)
        if not session or session.user_id != current_user.id:
            return error_response("Session not found or access denied", "SESSION_NOT_FOUND", 404)
        
        success = chat_service.delete_chat_session(db, session_id)
        if not success:
            return error_response("Failed to delete chat session", "SESSION_DELETE_ERROR", 500)
        
        return success_response(
            message="Chat session deleted successfully"
        )
    except Exception as e:
        return error_response(f"Failed to delete chat session: {str(e)}", "SESSION_DELETE_ERROR", 500)