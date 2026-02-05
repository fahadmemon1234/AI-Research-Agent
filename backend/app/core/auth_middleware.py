from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.auth import verify_token
from app.services.user_service import UserService
from app.database.session import get_db
from app.core.logging_config import log_info, log_error
from typing import Optional


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Authentication Middleware to protect routes
    """
    def __init__(self, app, excluded_paths: Optional[list] = None):
        super().__init__(app)
        self.excluded_paths = excluded_paths or []
        self.security = HTTPBearer(auto_error=False)  # Don't auto-error, we'll handle it
    
    async def dispatch(self, request: Request, call_next):
        # Check if the path should be excluded from auth
        if request.url.path in self.excluded_paths:
            response = await call_next(request)
            return response
        # For OPTIONS requests (preflight), let them pass through to CORS middleware
        # This allows CORS preflight to work properly
        if request.method == "OPTIONS":
            response = await call_next(request)
            return response
        
        # Extract token from Authorization header
        authorization = request.headers.get("Authorization")
        if not authorization:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authorization header missing"}
            )
        
        try:
            # Verify the token format (Bearer <token>)
            scheme, token = authorization.split(" ")
            if scheme.lower() != "bearer":
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid authentication scheme"}
                )
            
            # Verify the token
            payload = verify_token(token)
            if payload is None:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid or expired token"}
                )
            
            # Get the email from the token
            email: str = payload.get("sub")
            if email is None:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token does not contain email"}
                )
            
            # Get the user from the database
            # Using a temporary session since we can't use Depends here
            db = next(get_db())
            try:
                user = UserService.get_user_by_email(db, email=email)
                if user is None:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "User not found"}
                    )

                # Add user info to request state for later use
                request.state.user = user
            finally:
                db.close()
        
        except ValueError:
            # Split failed - invalid format
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid token format"}
            )
        except Exception as e:
            log_error(e, "Authentication middleware error")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Authentication service error"}
            )
        
        response = await call_next(request)
        return response


# Helper function to get current user from request state (when using AuthMiddleware)
def get_current_user_from_state(request: Request):
    """
    Get current user from request state (set by AuthMiddleware)
    """
    if hasattr(request.state, 'user') and request.state.user:
        return request.state.user
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )


# Helper function to require active user
def require_active_user_from_state(request: Request):
    """
    Require that the current user is active (when using AuthMiddleware)
    """
    user = get_current_user_from_state(request)
    
    if not user.is_active:
        log_info(f"Inactive user attempted access: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    return user