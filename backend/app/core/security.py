from passlib.context import CryptContext
from app.core.logging_config import log_info, log_error

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    """
    try:
        hashed = pwd_context.hash(password)
        log_info("Password hashed successfully")
        return hashed
    except Exception as e:
        log_error(e, "Error hashing password")
        raise

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password
    """
    try:
        is_valid = pwd_context.verify(plain_password, hashed_password)
        log_info(f"Password verification: {'Success' if is_valid else 'Failed'}")
        return is_valid
    except Exception as e:
        log_error(e, "Error verifying password")
        return False