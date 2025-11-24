from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentUpdate
from app.services.file_handler import FileHandler
from app.services.document_processor import DocumentProcessor
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/documents", tags=["documents"])

# For now, using a simple user dependency (replace with proper auth later)
def get_current_user(db: Session = Depends(get_db)) -> User:
    # TODO: Implement proper authentication
    # For now, return first user or create a default one
    user = db.query(User).first()
    if not user:
        # Create default user for development
        user = User(
            email="admin@oceanai.com",
            username="admin",
            hashed_password="hashed_password_here",
            full_name="Admin User"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload and process a document"""
    
    # Validate file type
    if not FileHandler.is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="File type not allowed. Supported: PDF, DOCX, TXT"
        )
    
    try:
        # Save file
        file_path, unique_filename = await FileHandler.save_file(file.file, file.filename)
        file_size = FileHandler.get_file_size(file_path)
        file_type = FileHandler.get_file_extension(file.filename).lstrip('.')
        
        # Create document record
        db_document = Document(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            owner_id=current_user.id,
            status="uploaded"
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        # Process document asynchronously (in background)
        # For now, process immediately
        try:
            db_document.status = "processing"
            db.commit()
            
            # Extract text
            processor = DocumentProcessor()
            extracted_text = processor.extract_text(file_path, file_type)
            db_document.extracted_text = extracted_text
            
            # AI Analysis
            ai_service = AIService()
            analysis = await ai_service.analyze_document(extracted_text)
            
            db_document.ai_summary = analysis["summary"]
            db_document.ai_keywords = analysis["keywords"]
            db_document.ai_sentiment = analysis["sentiment"]
            db_document.ai_confidence = analysis["confidence"]
            db_document.ai_analysis_data = analysis["analysis_data"]
            db_document.status = "processed"
            db_document.processed_at = datetime.utcnow()
            
        except Exception as e:
            db_document.status = "error"
            db_document.processing_error = str(e)
        
        db.commit()
        db.refresh(db_document)
        
        return db_document
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all documents for current user"""
    documents = db.query(Document).filter(
        Document.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return documents

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document

@router.post("/{document_id}/analyze", response_model=DocumentResponse)
async def reanalyze_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Re-analyze a document with AI"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not document.extracted_text:
        raise HTTPException(status_code=400, detail="No text extracted from document")
    
    try:
        document.status = "processing"
        db.commit()
        
        # AI Analysis
        ai_service = AIService()
        analysis = await ai_service.analyze_document(document.extracted_text)
        
        document.ai_summary = analysis["summary"]
        document.ai_keywords = analysis["keywords"]
        document.ai_sentiment = analysis["sentiment"]
        document.ai_confidence = analysis["confidence"]
        document.ai_analysis_data = analysis["analysis_data"]
        document.status = "processed"
        document.processed_at = datetime.utcnow()
        
        db.commit()
        db.refresh(document)
        
        return document
        
    except Exception as e:
        document.status = "error"
        document.processing_error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file from filesystem
    FileHandler.delete_file(document.file_path)
    
    # Delete from database
    db.delete(document)
    db.commit()
    
    return None


