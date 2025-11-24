import os
from dotenv import load_dotenv
from app.services.google_slides_service import GoogleSlidesService

load_dotenv()

def inspect_deep():
    print("🔍 Starting Deep Inspection...")
    
    template_id = os.getenv("GOOGLE_SLIDES_TEMPLATE_ID")
    if not template_id:
        print("❌ Error: GOOGLE_SLIDES_TEMPLATE_ID not found in .env")
        return

    print(f"📋 Inspecting Template ID: {template_id}")
    
    try:
        service = GoogleSlidesService()
        
        # Get presentation details
        presentation = service.slides_service.presentations().get(
            presentationId=template_id
        ).execute()
        
        slides = presentation.get('slides', [])
        print(f"found {len(slides)} slides.")
        
        for i, slide in enumerate(slides):
            print(f"\n--- Slide {i} ({slide['objectId']}) ---")
            
            # Iterate through page elements
            elements = slide.get('pageElements', [])
            for element in elements:
                shape = element.get('shape')
                if shape:
                    text_content = shape.get('text')
                    if text_content:
                        text_elements = text_content.get('textElements', [])
                        full_text = ""
                        for te in text_elements:
                            if 'textRun' in te:
                                full_text += te['textRun']['content']
                        
                        if full_text.strip():
                            print(f"  📝 Found Text: '{full_text.strip()}'")
                            # Print raw characters to check for hidden formatting
                            # print(f"     Raw: {repr(full_text)}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    inspect_deep()
