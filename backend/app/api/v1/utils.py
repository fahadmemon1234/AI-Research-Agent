from fastapi.responses import JSONResponse
from typing import Any, Dict, Optional
from enum import Enum

class ResponseCode(Enum):
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    AUTH_ERROR = "AUTH_ERROR"
    NOT_FOUND = "NOT_FOUND"

def success_response(data: Any = None, message: str = "Operation successful", status_code: int = 200) -> JSONResponse:
    """
    Create a standardized success response
    """
    response_body = {
        "code": ResponseCode.SUCCESS.value,
        "message": message,
        "data": data,
        "status": "success"
    }
    return JSONResponse(content=response_body, status_code=status_code)

def error_response(message: str = "An error occurred", error_code: str = None, status_code: int = 400) -> JSONResponse:
    """
    Create a standardized error response
    """
    response_body = {
        "code": ResponseCode.ERROR.value,
        "message": message,
        "error_code": error_code,
        "status": "error"
    }
    return JSONResponse(content=response_body, status_code=status_code)

def validation_error_response(errors: Dict[str, str]) -> JSONResponse:
    """
    Create a standardized validation error response
    """
    response_body = {
        "code": ResponseCode.VALIDATION_ERROR.value,
        "message": "Validation failed",
        "errors": errors,
        "status": "error"
    }
    return JSONResponse(content=response_body, status_code=422)

def auth_error_response(message: str = "Authentication required") -> JSONResponse:
    """
    Create a standardized authentication error response
    """
    response_body = {
        "code": ResponseCode.AUTH_ERROR.value,
        "message": message,
        "status": "error"
    }
    return JSONResponse(content=response_body, status_code=401)

def not_found_response(message: str = "Resource not found") -> JSONResponse:
    """
    Create a standardized not found response
    """
    response_body = {
        "code": ResponseCode.NOT_FOUND.value,
        "message": message,
        "status": "error"
    }
    return JSONResponse(content=response_body, status_code=404)