from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx, txt
    file_size = Column(Integer, nullable=False)  # in bytes
    
    # Extracted content
    extracted_text = Column(Text, nullable=True)
    
    # AI Analysis
    ai_summary = Column(Text, nullable=True)
    ai_keywords = Column(JSON, nullable=True)  # List of keywords
    ai_sentiment = Column(String, nullable=True)  # positive, negative, neutral
    ai_confidence = Column(Float, nullable=True)
    ai_analysis_data = Column(JSON, nullable=True)  # Additional AI insights
    
    # Metadata
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="uploaded")  # uploaded, processing, processed, error
    processing_error = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", back_populates="documents")


