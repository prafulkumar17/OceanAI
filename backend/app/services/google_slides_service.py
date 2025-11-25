import os
import json
from typing import Dict, List, Any, Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

SCOPES = [
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/drive'
]

class GoogleSlidesService:
    """Service for interacting with Google Slides API"""
    
    def __init__(self):
        self.creds = None
        self.slides_service = None
        self.drive_service = None
        self._authenticate()
        
    def _authenticate(self):
        """Authenticate using OAuth 2.0 token"""
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request
        
        creds = None
        
        # 1. Try Environment Variables (for Render/Cloud)
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')
        
        if client_id and client_secret and refresh_token:
            creds = Credentials(
                None,  # No access token initially
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=client_id,
                client_secret=client_secret,
                scopes=SCOPES
            )
        
        # 2. Fallback to Local File (for Development)
        else:
            token_path = os.path.join(os.getcwd(), 'token.json')
            
            if not os.path.exists(token_path):
                # Try looking in backend folder if running from root
                token_path = os.path.join(os.getcwd(), 'backend', 'token.json')
                
            if os.path.exists(token_path):
                creds = Credentials.from_authorized_user_file(token_path, SCOPES)
            
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif not creds: # Only raise if no creds at all (file missing AND env vars missing)
                 raise FileNotFoundError(
                    "Valid credentials not found. Set GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN env vars OR run 'python setup_google_auth.py' locally."
                )
        
        self.creds = creds
        self.slides_service = build('slides', 'v1', credentials=self.creds)
        self.drive_service = build('drive', 'v3', credentials=self.creds)
        
    def create_presentation_from_template(self, title: str, template_id: str) -> str:
        """
        Copy a template presentation to a new file
        Returns the new presentation ID
        """
        body = {
            'name': title
        }
        drive_response = self.drive_service.files().copy(
            fileId=template_id, body=body
        ).execute()
        
        return drive_response.get('id')
        
    def batch_update(self, presentation_id: str, requests: List[Dict[str, Any]]):
        """Execute batch update requests on a presentation"""
        if not requests:
            return
            
        body = {
            'requests': requests
        }
        self.slides_service.presentations().batchUpdate(
            presentationId=presentation_id, body=body
        ).execute()
        
    def replace_text(self, presentation_id: str, replacements: Dict[str, str], slide_ids: Optional[List[str]] = None):
        """
        Replace text placeholders in the presentation
        replacements: dict of { '{{placeholder}}': 'replacement_text' }
        slide_ids: optional list of slide IDs to restrict replacement to
        """
        requests = []
        for placeholder, text in replacements.items():
            req = {
                'replaceAllText': {
                    'containsText': {
                        'text': placeholder,
                        'matchCase': True
                    },
                    'replaceText': text
                }
            }
            if slide_ids:
                req['replaceAllText']['pageObjectIds'] = slide_ids
            requests.append(req)
            
        self.batch_update(presentation_id, requests)
        
    def get_presentation_slides(self, presentation_id: str) -> List[Dict]:
        """Get list of slides in the presentation"""
        presentation = self.slides_service.presentations().get(
            presentationId=presentation_id
        ).execute()
        return presentation.get('slides', [])

    def duplicate_slide(self, presentation_id: str, slide_id: str, insertion_index: Optional[int] = None) -> str:
        """Duplicate a slide and return the new slide's object ID"""
        req = {
            'duplicateObject': {
                'objectId': slide_id
            }
        }
            
        response = self.slides_service.presentations().batchUpdate(
            presentationId=presentation_id, 
            body={'requests': [req]}
        ).execute()
        
        new_slide_id = response.get('replies')[0].get('duplicateObject').get('objectId')
        
        if insertion_index is not None:
            # Move the slide to the correct position
            move_req = {
                'updateSlidesPosition': {
                    'slideObjectIds': [new_slide_id],
                    'insertionIndex': insertion_index
                }
            }
            self.slides_service.presentations().batchUpdate(
                presentationId=presentation_id, 
                body={'requests': [move_req]}
            ).execute()
            
        return new_slide_id

    def export_presentation(self, presentation_id: str) -> bytes:
        """Export presentation to PPTX bytes"""
        request = self.drive_service.files().export_media(
            fileId=presentation_id,
            mimeType='application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
        
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)
        
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            
        file_stream.seek(0)
        return file_stream.read()
    
    def export_presentation_as_pdf(self, presentation_id: str) -> bytes:
        """Export presentation to PDF bytes"""
        request = self.drive_service.files().export_media(
            fileId=presentation_id,
            mimeType='application/pdf'
        )
        
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)
        
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            
        file_stream.seek(0)
        return file_stream.read()

    def delete_file(self, file_id: str):
        """Delete file from Drive (cleanup)"""
        try:
            self.drive_service.files().delete(fileId=file_id).execute()
        except Exception as e:
            print(f"Warning: Failed to delete temp file {file_id}: {e}")

    def delete_slide(self, presentation_id: str, slide_id: str):
        """Delete a slide from the presentation"""
        req = {
            'deleteObject': {
                'objectId': slide_id
            }
        }
        self.batch_update(presentation_id, [req])
