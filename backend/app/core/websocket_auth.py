from fastapi import WebSocket, HTTPException
from sqlalchemy.orm import Session
from app.core.auth import verify_token, extract_token_from_websocket_cookies
from app.database.session import get_db
from app.services.user_service import UserService
from app.core.logging_config import log_info, log_error


async def get_current_user_from_websocket(websocket: WebSocket):
    """
    Get the current user from WebSocket connection by extracting token from cookies
    """
    # Extract token from cookies
    token = await extract_token_from_websocket_cookies(websocket)

    if not token:
        log_error(None, "No token found in WebSocket cookies")
        await websocket.close(code=1008, reason="Authentication token missing")  # Policy violation
        return None

    try:
        # Verify the token
        payload = verify_token(token)
        if payload is None:
            log_error(None, "Invalid token provided in WebSocket")
            await websocket.close(code=1008, reason="Invalid authentication token")  # Policy violation
            return None

        # Get the email from the token
        email: str = payload.get("sub")
        if email is None:
            log_error(None, "Token does not contain email")
            await websocket.close(code=1008, reason="Invalid authentication token")  # Policy violation
            return None

        # Create a database session
        db: Session = next(get_db())
        try:
            # Get the user from the database
            user = UserService.get_user_by_email(db, email=email)
            if user is None:
                log_error(None, f"No user found for email: {email}")
                await websocket.close(code=1008, reason="Invalid authentication token")  # Policy violation
                return None

            log_info(f"Current user retrieved from WebSocket: {user.email}")
            return user
        finally:
            db.close()

    except Exception as e:
        log_error(e, "Error getting current user from WebSocket")
        await websocket.close(code=1008, reason="Authentication error")  # Policy violation
        return None


async def require_active_user_from_websocket(websocket: WebSocket):
    """
    Ensure the current user from WebSocket is active
    """
    current_user = await get_current_user_from_websocket(websocket)
    
    if not current_user:
        return None
        
    if not current_user.is_active:
        log_info(f"Inactive user attempted WebSocket access: {current_user.email}")
        await websocket.close(code=1008, reason="Inactive user account")  # Policy violation
        return None

    return current_user