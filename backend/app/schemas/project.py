from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.project import DocumentType

class ProjectCreate(BaseModel):
    title: str
    topic: str
    document_type: DocumentType

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    topic: Optional[str] = None
    generated_content: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    topic: str
    document_type: str
    generated_content: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectGenerateRequest(BaseModel):
    project_id: Optional[int] = None
    topic: Optional[str] = None
    document_type: Optional[str] = None

class ProjectRefineRequest(BaseModel):
    refinement_prompt: str

class ProjectContentUpdate(BaseModel):
    content: dict

