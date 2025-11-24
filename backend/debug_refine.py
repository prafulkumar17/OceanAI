import asyncio
import os
import json
from dotenv import load_dotenv
from app.services.document_generator import DocumentGenerator
from app.models.project import DocumentType

load_dotenv()

async def debug_refine():
    print("🚀 Starting Refinement Debug...")
    
    # Mock existing content (PPTX)
    current_content = {
        "slides": [
            {
                "title": "Artificial Intelligence",
                "bullets": [
                    "AI is transforming the world",
                    "Machine learning is a subset of AI",
                    "Deep learning uses neural networks"
                ]
            }
        ]
    }
    content_str = json.dumps(current_content)
    
    refinement_prompt = "Add a bullet point about Generative AI"
    
    print(f"📝 Prompt: {refinement_prompt}")
    
    try:
        generator = DocumentGenerator()
        print("⏳ Calling Gemini...")
        
        # Call refine_content
        refined = await generator.refine_content(
            content_str,
            refinement_prompt,
            DocumentType.PPTX
        )
        
        print("✅ Refinement Successful!")
        print(json.dumps(refined, indent=2))
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_refine())
