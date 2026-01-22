from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
from app.core.websocket_auth import require_active_user_from_websocket
from app.services.rag_service import RAGService
from app.services.chat_service import ChatService
from app.core.logging_config import log_info, log_error

router = APIRouter()
rag_service = RAGService()
chat_service = ChatService()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@router.websocket("/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat with AI
    """
    # Authenticate user from WebSocket connection
    current_user = await require_active_user_from_websocket(websocket)
    if not current_user:
        # The authentication function already closes the connection if authentication fails
        return

    await manager.connect(websocket)

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            query_data = json.loads(data)

            query = query_data.get("query", "")
            session_id = query_data.get("session_id", None)

            if not query:
                await manager.send_personal_message(json.dumps({
                    "type": "error",
                    "message": "Query is required"
                }), websocket)
                continue

            try:
                # Process the query using RAG with streaming
                # Using generator to stream the response
                response_generator = rag_service.query_documents_streaming(
                    query=query,
                    user_id=current_user.id,  # Now we have the authenticated user's ID
                    session_id=session_id
                )

                # Send streaming response
                for response_part in response_generator:
                    await manager.send_personal_message(json.dumps(response_part), websocket)

            except Exception as e:
                log_error(e, f"Error processing streaming query in WebSocket for user {current_user.id}")
                await manager.send_personal_message(json.dumps({
                    "type": "error",
                    "message": f"Query processing failed: {str(e)}"
                }), websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        log_info("WebSocket connection disconnected")
    except Exception as e:
        log_error(e, f"Unexpected error in WebSocket connection for user {current_user.id}")
        manager.disconnect(websocket)