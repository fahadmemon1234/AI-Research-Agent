from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.auth import verify_token
from app.database.session import get_db
from app.services.user_service import UserService
from app.core.logging_config import log_info, log_error

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Dependency to get the current user based on the JWT token
    """
    try:
        # Verify the token
        payload = verify_token(credentials.credentials)
        if payload is None:
            log_error(None, "Invalid token provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get the email from the token
        email: str = payload.get("sub")
        if email is None:
            log_error(None, "Token does not contain email")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get the user from the database
        user = UserService.get_user_by_email(db, email=email)
        if user is None:
            log_error(None, f"No user found for email: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        log_info(f"Current user retrieved: {user.email}")
        return user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error getting current user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def require_active_user(current_user = Depends(get_current_user)):
    """
    Dependency to ensure the current user is active
    """
    if not current_user.is_active:
        log_info(f"Inactive user attempted access: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    return current_user