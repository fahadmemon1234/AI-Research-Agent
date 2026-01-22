from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.init_db import Base
from sqlalchemy.orm import relationship

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(String, nullable=True)  # Vector embedding stored as string representation
    chunk_index = Column(Integer, nullable=False)  # Sequential position of chunk in document
    char_start_idx = Column(Integer, nullable=False)  # Starting character index in original document
    char_end_idx = Column(Integer, nullable=False)  # Ending character index in original document
    chunk_metadata = Column(Text, nullable=True)  # Additional metadata about the chunk
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document", back_populates="chunks")