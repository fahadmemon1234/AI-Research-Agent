from fastapi import APIRouter
from app.api.v1.utils import success_response

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Health check endpoint to verify the API is running
    """
    return success_response(
        data={"status": "healthy", "service": "AI Knowledge Assistant API"},
        message="Service is operational",
        status_code=200
    )

@router.get("/version")
def get_version():
    """
    Get the current version of the API
    """
    return success_response(
        data={"version": "1.0.0", "service": "AI Knowledge Assistant API"},
        message="Version retrieved successfully",
        status_code=200
    )