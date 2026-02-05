from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import Dict, Any
import json
from app.database.session import get_db
from app.core.middleware import require_active_user
from app.models.user import User
from app.services.rag_service import RAGService
from app.services.chat_service import ChatService
from app.api.v1.utils import success_response, error_response
from app.core.logging_config import log_info, log_error
from app.core.websocket_auth import require_active_user_from_websocket

router = APIRouter()
rag_service = RAGService()
chat_service = ChatService()

@router.post("/")
def query_documents(
    query_data: Dict[str, Any],
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Submit a query against user's documents
    """
    try:
        query = query_data.get("query", "")
        session_id = query_data.get("session_id", None)
        
        if not query:
            return error_response("Query is required", "MISSING_QUERY", 400)
        
        # If session_id is provided, verify it belongs to the current user
        if session_id:
            # In a real implementation, we would verify the session belongs to the user
            pass
        
        # Process the query using RAG
        result = rag_service.query_documents(
            query=query,
            user_id=current_user.id,
            session_id=session_id
        )
        
        # If a session_id was provided or generated, save the interaction
        if result.get("session_id"):
            # Create or update chat session as needed
            pass
        
        return success_response(
            data=result,
            message="Query processed successfully"
        )
    except Exception as e:
        log_error(e, f"Error processing query for user {current_user.id}")
        return error_response(f"Query processing failed: {str(e)}", "QUERY_ERROR", 500)


@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat
    """
    # Authenticate user from WebSocket connection
    current_user = await require_active_user_from_websocket(websocket)
    if not current_user:
        # The authentication function already closes the connection if authentication fails
        return

    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            query_data = json.loads(data)

            query = query_data.get("query", "")
            session_id = query_data.get("session_id", None)

            if not query:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Query is required"
                }))
                continue

            # Process the query using RAG with streaming
            try:
                # Using generator to stream the response
                response_generator = rag_service.query_documents_streaming(
                    query=query,
                    user_id=current_user.id,
                    session_id=session_id
                )

                # Send streaming response
                for response_part in response_generator:
                    await websocket.send_text(json.dumps(response_part))

            except Exception as e:
                log_error(e, f"Error processing streaming query for user {current_user.id}")
                # Always send a completion message to prevent frontend from hanging
                await websocket.send_text(json.dumps({
                    "type": "complete",
                    "sources": [],
                    "session_id": session_id,
                    "is_complete": True,
                    "error": f"Query processing failed: {str(e)}"
                }))

    except Exception as e:
        log_error(e, f"WebSocket error for user {current_user.id}")
        await websocket.close()