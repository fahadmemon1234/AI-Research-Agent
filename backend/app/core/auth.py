from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from fastapi import WebSocket
from app.core.config import settings
from app.schemas.user import UserInDB

# Create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# Verify JWT token
def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            return None
        return payload
    except JWTError:
        return None

# Hash password
def hash_password(password: str) -> str:
    # Truncate password to 72 bytes if necessary (bcrypt limitation)
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    # Encode the password to bytes for bcrypt
    password_bytes = password.encode('utf-8')
    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return the hashed password as a string
    return hashed.decode('utf-8')

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Encode both passwords to bytes for comparison
    plain_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)


# Extract JWT token from cookies in WebSocket connection
async def extract_token_from_websocket_cookies(websocket: WebSocket) -> Optional[str]:
    """
    Extract JWT token from cookies in WebSocket connection
    """
    try:
        # Access the raw headers from the WebSocket scope
        raw_headers = websocket.scope.get("headers", [])

        # Find the cookie header (headers are tuples of bytes)
        cookie_header = None
        for header_name, header_value in raw_headers:
            if header_name.decode().lower() == 'cookie':
                cookie_header = header_value.decode()
                break

        if not cookie_header:
            return None

        # Parse cookies - split by semicolon and find the access_token
        cookies = {}
        for cookie in cookie_header.split(';'):
            if '=' in cookie:
                key, value = cookie.strip().split('=', 1)
                cookies[key] = value

        # Get the access token
        token = cookies.get('access_token')
        return token
    except Exception as e:
        print(f"Error extracting token from WebSocket cookies: {e}")
        return None