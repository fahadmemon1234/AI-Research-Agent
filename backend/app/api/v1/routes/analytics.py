from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.middleware import require_active_user
from app.models.user import User
from app.api.v1.utils import success_response, error_response
from app.core.logging_config import log_info, log_error

router = APIRouter()

@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(require_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's usage statistics
    """
    try:
        # In a real implementation, we would query the database for user statistics
        # For now, we'll return mock data
        stats = {
            "total_documents": 5,
            "total_queries": 42,
            "last_query_date": "2026-01-21T10:00:00Z",
            "top_documents": [
                {
                    "id": 1,
                    "name": "annual_report_2025.pdf",
                    "query_count": 15
                },
                {
                    "id": 2,
                    "name": "company_policy.docx",
                    "query_count": 12
                },
                {
                    "id": 3,
                    "name": "project_notes.txt",
                    "query_count": 8
                }
            ]
        }
        
        log_info(f"Retrieved stats for user: {current_user.id}")
        return success_response(
            data=stats,
            message="User statistics retrieved successfully"
        )
    except Exception as e:
        log_error(e, f"Error retrieving stats for user: {current_user.id}")
        return error_response(f"Failed to retrieve user stats: {str(e)}", "STATS_RETRIEVE_ERROR", 500)