from fastapi import APIRouter
from app.api.v1.routes.utils import router as utils_router
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.documents import router as documents_router
from app.api.v1.routes.query import router as query_router
from app.api.v1.routes.chats import router as chats_router
from app.api.v1.routes.analytics import router as analytics_router

router = APIRouter()

# Include all sub-routers
router.include_router(utils_router, tags=["utils"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(documents_router, prefix="/documents", tags=["documents"])
router.include_router(query_router, prefix="/query", tags=["query"])
router.include_router(chats_router, prefix="/chats", tags=["chats"])
router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])