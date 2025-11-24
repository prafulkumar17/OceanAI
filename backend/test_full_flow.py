import asyncio
import os
import json
from dotenv import load_dotenv
from app.services.document_generator import DocumentGenerator
from app.services.file_exporter import FileExporter
from app.models.project import DocumentType

load_dotenv()

async def test_full_flow():
    print("🚀 Starting Full End-to-End Test...")
    
    # 1. Simulate Project Data
    topic = "The Future of Artificial Intelligence"
    doc_type = DocumentType.PPTX
    print(f"📋 Topic: {topic}")
    print(f"📄 Type: {doc_type}")
    
    try:
        # 2. Generate Content (Gemini)
        print("\n1️⃣  Generating Content with Gemini...")
        generator = DocumentGenerator()
        content = await generator.generate_document(topic, doc_type)
        print("   ✅ Content Generated!")
        print(f"   -> Slides: {len(content.get('slides', []))}")
        
        # Add title manually (usually comes from project title)
        content["title"] = "AI Future Presentation"
        
        # 3. Export File (Google Slides)
        print("\n2️⃣  Exporting to Google Slides...")
        file_bytes = FileExporter.export_to_file(content, doc_type)
        print(f"   ✅ Export Successful! ({len(file_bytes)} bytes)")
        
        # 4. Save to Disk (to verify)
        output_file = "test_output.pptx"
        with open(output_file, "wb") as f:
            f.write(file_bytes)
            
        print(f"\n🎉 Success! Saved to {output_file}")
        print("Note: Since we used Google Slides API, the file is a valid PPTX downloaded from Drive.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_full_flow())
