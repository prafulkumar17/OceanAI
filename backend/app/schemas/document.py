from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_type: str

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    ai_summary: Optional[str] = None
    ai_keywords: Optional[List[str]] = None
    ai_sentiment: Optional[str] = None
    status: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: int
    original_filename: str
    file_size: int
    extracted_text: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_keywords: Optional[List[str]] = None
    ai_sentiment: Optional[str] = None
    ai_confidence: Optional[float] = None
    ai_analysis_data: Optional[Dict[str, Any]] = None
    status: str
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


