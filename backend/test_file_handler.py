import importlib.util
import sys
from pathlib import Path
import os
from unittest.mock import MagicMock

def import_file_handler():
    # Mock aiofiles
    sys.modules["aiofiles"] = MagicMock()
    
    file_path = os.path.join(os.path.dirname(__file__), "app", "services", "file_handler.py")
    spec = importlib.util.spec_from_file_location("file_handler", file_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules["file_handler"] = module
    spec.loader.exec_module(module)
    return module

def test_upload_dir():
    fh_module = import_file_handler()
    UPLOAD_DIR = fh_module.UPLOAD_DIR
    
    print(f"UPLOAD_DIR: {UPLOAD_DIR}")
    
    # Expected path: .../backend/uploads
    expected_part = os.path.join("backend", "uploads")
    
    if str(UPLOAD_DIR).endswith(expected_part):
        print("SUCCESS: UPLOAD_DIR points to backend/uploads")
    else:
        print(f"FAILURE: UPLOAD_DIR does not end with {expected_part}")

    # Check if directory exists
    if UPLOAD_DIR.exists():
        print("SUCCESS: Upload directory exists")
    else:
        print("FAILURE: Upload directory does not exist")

if __name__ == "__main__":
    test_upload_dir()
