from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging_config import log_info
from app.api.v1.routes import router as api_router
from app.database.init_db import init_db
import os
import json
from datetime import datetime
from decimal import Decimal

# Custom JSON encoder to handle datetime and other non-serializable objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

# Initialize FastAPI app
app = FastAPI(
    title="AI Knowledge Assistant API",
    description="API for the AI Knowledge Assistant application",
    version="1.0.0"
)

# Set the custom json loads function to handle datetime serialization
from fastapi.responses import JSONResponse

# Override the default JSONResponse to use our custom encoder
original_init = JSONResponse.__init__

def patched_init(self, content=None, **kwargs):
    if content is not None:
        # Serialize and deserialize with our custom encoder to handle datetime
        json_str = json.dumps(content, cls=DateTimeEncoder)
        content = json.loads(json_str)
    original_init(self, content, **kwargs)

JSONResponse.__init__ = patched_init

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """Initialize the database on application startup"""
    init_db()

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    log_info("Root endpoint accessed")
    return {"message": "Welcome to the AI Knowledge Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2026-01-21T00:00:00Z"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)