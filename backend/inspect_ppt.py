from pptx import Presentation
import sys
import os

def inspect_pptx(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    prs = Presentation(file_path)
    
    print(f"Inspecting: {file_path}")
    print("-" * 50)
    
    for i, layout in enumerate(prs.slide_layouts):
        print(f"\nLayout Index: {i}")
        print(f"Layout Name: {layout.name}")
        
        print("  Placeholders:")
        for shape in layout.placeholders:
            print(f"    - ID: {shape.placeholder_format.idx}, Name: {shape.name}, Type: {shape.placeholder_format.type}")

if __name__ == "__main__":
    # Default to the expected location if no argument provided
    default_path = "app/templates/template.pptx"
    
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = default_path
        
    inspect_pptx(path)
