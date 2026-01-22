from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.init_db import Base
from sqlalchemy.orm import relationship

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    sender_type = Column(String, nullable=False)  # 'user' or 'ai'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    source_documents = Column(Text, nullable=True)  # JSON data stored as text
    token_count = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)  # How long AI took to respond (for AI messages)

    # Relationships
    chat_session = relationship("ChatSession", back_populates="messages")