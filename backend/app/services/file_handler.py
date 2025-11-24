import os
import aiofiles
from pathlib import Path
from typing import BinaryIO
import uuid

UPLOAD_DIR = Path(__file__).parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

class FileHandler:
    @staticmethod
    def get_file_extension(filename: str) -> str:
        """Extract file extension from filename"""
        return Path(filename).suffix.lower()
    
    @staticmethod
    def is_allowed_file(filename: str) -> bool:
        """Check if file type is allowed"""
        allowed_extensions = {'.pdf', '.docx', '.txt', '.doc'}
        return FileHandler.get_file_extension(filename) in allowed_extensions
    
    @staticmethod
    async def save_file(file: BinaryIO, filename: str) -> tuple[str, str]:
        """
        Save uploaded file and return (file_path, unique_filename)
        """
        # Generate unique filename
        file_ext = FileHandler.get_file_extension(filename)
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return str(file_path), unique_filename
    
    @staticmethod
    def get_file_size(file_path: str) -> int:
        """Get file size in bytes"""
        return os.path.getsize(file_path)
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file from filesystem"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False


