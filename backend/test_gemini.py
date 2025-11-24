"""
Quick test script to verify Gemini API is working
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in .env file")
        return False
    
    if api_key == "your_gemini_api_key_here":
        print("ERROR: Please replace 'your_gemini_api_key_here' with your actual API key in .env")
        return False
    
    try:
        print("API Key found!")
        print("Connecting to Gemini API...")
        
        genai.configure(api_key=api_key)
        # Use gemini-2.5-flash (stable, fast, good for document analysis)
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        
        print("Testing with a simple prompt...")
        response = model.generate_content("Say 'Hello from Gemini!' in one sentence.")
        
        if response.text:
            print("SUCCESS! Gemini API is working!")
            print(f"Response: {response.text.strip()}")
            return True
        else:
            print("ERROR: No response from Gemini API")
            return False
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print("\nTroubleshooting:")
        print("   - Check if your API key is correct")
        print("   - Verify you have internet connection")
        print("   - Make sure the API key is active at https://makersuite.google.com/app/apikey")
        return False

if __name__ == "__main__":
    import sys
    # Set UTF-8 encoding for Windows
    if sys.platform == 'win32':
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    
    print("=" * 50)
    print("Testing Gemini API Connection")
    print("=" * 50)
    print()
    
    success = test_gemini()
    
    print()
    print("=" * 50)
    if success:
        print("SUCCESS! All tests passed! You're ready to go!")
    else:
        print("FAILED! Tests failed. Please check the errors above.")
    print("=" * 50)

