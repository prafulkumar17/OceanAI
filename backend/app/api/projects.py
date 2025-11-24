from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.project import Project, DocumentType
from app.models.user import User
from app.schemas.project import (
    ProjectCreate, 
    ProjectResponse, 
    ProjectUpdate,
    ProjectGenerateRequest,
    ProjectRefineRequest,
    ProjectContentUpdate
)
from app.api.auth import get_current_user
from app.services.document_generator import DocumentGenerator
from app.services.file_exporter import FileExporter
import json

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    db_project = Project(
        title=project.title,
        topic=project.topic,
        document_type=project.document_type,
        owner_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all projects for current user"""
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project

@router.post("/{project_id}/generate", response_model=ProjectResponse)
async def generate_document(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate the complete document in one go"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        generator = DocumentGenerator()
        content = await generator.generate_document(project.topic, project.document_type)
        
        # Store as JSON string
        project.generated_content = json.dumps(content)
        db.commit()
        db.refresh(project)
        
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")

@router.get("/{project_id}/generate/stream")
async def generate_document_stream(
    project_id: int,
    token: str = Query(..., description="Access token for authentication"),
    db: Session = Depends(get_db)
):
    """Stream the document generation process"""
    # Validate token manually since EventSource doesn't support headers
    from jose import JWTError, jwt
    import os
    from app.services.auth import get_user_by_email
    
    try:
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        ALGORITHM = "HS256"
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    current_user = get_user_by_email(db, email=email)
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    async def event_generator():
        generator = DocumentGenerator()
        full_content = ""
        
        try:
            async for chunk in generator.generate_document_stream(project.topic, project.document_type):
                full_content += chunk
                # Send raw chunk for typing effect
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            
            # After stream ends, save the full content
            try:
                # Clean and parse the full content
                cleaned_content = generator._clean_json_response(full_content)
                parsed_content = json.loads(cleaned_content)
                
                # Format based on type
                if project.document_type == DocumentType.DOCX:
                    final_content = {"type": "docx", "sections": parsed_content.get("sections", [])}
                else:
                    final_content = {"type": "pptx", "slides": parsed_content.get("slides", [])}
                
                # Save to DB
                project.generated_content = json.dumps(final_content)
                db.commit()
                
                # Send final success event
                yield f"data: {json.dumps({'status': 'complete', 'content': final_content})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'error': f'Parsing error: {str(e)}'})}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    from fastapi.responses import StreamingResponse
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{project_id}/refine", response_model=ProjectResponse)
async def refine_document(
    project_id: int,
    refine_request: ProjectRefineRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Refine the document content"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.generated_content:
        raise HTTPException(status_code=400, detail="No content to refine. Generate content first.")
    
    try:
        generator = DocumentGenerator()
        current_content = json.loads(project.generated_content)
        refined_content = await generator.refine_content(
            project.generated_content,
            refine_request.refinement_prompt,
            project.document_type
        )
        
        # Update content
        project.generated_content = json.dumps(refined_content)
        db.commit()
        db.refresh(project)
        
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refining document: {str(e)}")

@router.patch("/{project_id}/content", response_model=ProjectResponse)
def update_project_content(
    project_id: int,
    content_update: ProjectContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update project content with manual edits"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Update the generated content with the edited version
        project.generated_content = json.dumps(content_update.content)
        db.commit()
        db.refresh(project)
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating content: {str(e)}")

@router.get("/{project_id}/preview-pdf")
def get_pdf_preview(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate PDF preview for PPTX projects"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.generated_content:
        raise HTTPException(status_code=400, detail="No content to preview")
    
    if project.document_type != DocumentType.PPTX:
        raise HTTPException(status_code=400, detail="PDF preview only available for presentations")
    
    try:
        from app.services.file_exporter import FileExporter
        from app.services.google_slides_service import GoogleSlidesService
        import os
        
        # Parse content
        content_data = json.loads(project.generated_content)
        content_data["title"] = project.title
        
        # Generate PPTX using Google Slides
        template_id = os.getenv("GOOGLE_SLIDES_TEMPLATE_ID")
        if not template_id:
            raise HTTPException(status_code=500, detail="Template not configured")
        
        service = GoogleSlidesService()
        presentation_id = None
        
        try:
            # Create presentation from template
            presentation_id = service.create_presentation_from_template(project.title, template_id)
            
            # Get slides and populate content (similar to export logic)
            presentation_slides = service.get_presentation_slides(presentation_id)
            if len(presentation_slides) < 2:
                raise ValueError("Template must have at least 2 slides")
            
            title_slide_id = presentation_slides[0]['objectId']
            
            # Find content slide
            content_slide_id = None
            best_score = 0
            
            for slide in presentation_slides:
                score = 0
                has_content = False
                has_title = False
                
                for element in slide.get('pageElements', []):
                    shape = element.get('shape')
                    if shape and shape.get('text'):
                        for te in shape['text']['textElements']:
                            if 'textRun' in te:
                                content = te['textRun']['content']
                                if '{{SLIDE_CONTENT}}' in content:
                                    has_content = True
                                if '{{SLIDE_TITLE}}' in content:
                                    has_title = True
                
                if has_content:
                    score += 1
                if has_title:
                    score += 1
                    
                if score > best_score:
                    best_score = score
                    content_slide_id = slide['objectId']
                    
                if best_score == 2:
                    break
            
            if not content_slide_id:
                if len(presentation_slides) > 3:
                    content_slide_id = presentation_slides[3]['objectId']
                else:
                    content_slide_id = presentation_slides[1]['objectId']
            
            content_slide_index = 0
            for i, slide in enumerate(presentation_slides):
                if slide['objectId'] == content_slide_id:
                    content_slide_index = i
                    break
            
            # Replace title slide
            service.replace_text(presentation_id, {
                "{{MAIN_TITLE}}": project.title,
                "{{SUBTITLE}}": "Generated by OceanAI"
            }, slide_ids=[title_slide_id])
            
            # Duplicate and populate content slides
            slides = content_data.get("slides", [])
            for i, slide_data in enumerate(slides):
                insertion_index = content_slide_index + 1 + i
                new_slide_id = service.duplicate_slide(presentation_id, content_slide_id, insertion_index=insertion_index)
                
                bullets = slide_data.get("bullets", [])
                content_text = "\n".join(bullets) if bullets else ""
                
                service.replace_text(presentation_id, {
                    "{{SLIDE_TITLE}}": slide_data.get("title", ""),
                    "{{SLIDE_CONTENT}}": content_text
                }, slide_ids=[new_slide_id])
            
            # Delete template slide
            service.delete_slide(presentation_id, content_slide_id)
            
            # Export as PDF
            pdf_bytes = service.export_presentation_as_pdf(presentation_id)
            
            # Clean up
            service.delete_file(presentation_id)
            
            return Response(content=pdf_bytes, media_type="application/pdf")
            
        except Exception as e:
            if presentation_id:
                try:
                    service.delete_file(presentation_id)
                except:
                    pass
            raise e
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF preview: {str(e)}")

@router.get("/{project_id}/export")
def export_document(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export project as a file"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.generated_content:
        raise HTTPException(status_code=400, detail="No content to export. Generate content first.")
    
    try:
        content_data = json.loads(project.generated_content)
        content_data["title"] = project.title  # Add title to content
        
        file_bytes = FileExporter.export_to_file(content_data, project.document_type)
        
        # Determine file extension and MIME type
        if project.document_type == DocumentType.DOCX:
            filename = f"{project.title}.docx"
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            filename = f"{project.title}.pptx"
            media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        
        return Response(
            content=file_bytes,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting document: {str(e)}")

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return None

