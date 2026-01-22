from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.schemas.user import UserCreate, UserResponse, UserLogin, UserUpdate
from app.services.user_service import UserService
from app.core.auth import create_access_token, verify_password
from app.database.session import get_db
from app.core.middleware import get_current_user, require_active_user
from app.models.user import User
from app.api.v1.utils import success_response, error_response, validation_error_response, auth_error_response

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create the user
    try:
        db_user = UserService.create_user(db, user)
        # Convert SQLAlchemy model to Pydantic model
        return UserResponse.model_validate(db_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login")
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token
    """
    # Get user by email
    user = UserService.get_user_by_email(db, user_credentials.email)
    if not user:
        return auth_error_response("Invalid email or password")
    
    # Verify password
    if not verify_password(user_credentials.password, user.password_hash):
        return auth_error_response("Invalid email or password")
    
    # Check if user is active
    if not user.is_active:
        return auth_error_response("Account is deactivated")
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return success_response(
        data={
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 1800  # 30 minutes in seconds
        },
        message="Login successful"
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(require_active_user)):
    """
    Get current user's profile information
    """
    # Return the user object directly to match response_model
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information
    """
    try:
        # Update user profile
        updated_user = UserService.update_user(db, current_user.id, user_update)
        return UserResponse.model_validate(updated_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}"
        )