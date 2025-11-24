"""
Check .env file configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("Checking .env Configuration")
print("=" * 60)
print()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env file")
    print()
    print("Please add this line to backend/.env:")
    print("GEMINI_API_KEY=your_actual_api_key_here")
elif api_key == "your_gemini_api_key_here" or api_key == "your_openai_api_key_here":
    print("WARNING: API key appears to be a placeholder")
    print(f"Current value: {api_key[:20]}...")
    print()
    print("Please replace it with your actual Gemini API key from:")
    print("https://makersuite.google.com/app/apikey")
else:
    print("API Key found!")
    print(f"Key length: {len(api_key)} characters")
    print(f"Key starts with: {api_key[:10]}...")
    print()
    print("To get a new API key:")
    print("1. Visit: https://makersuite.google.com/app/apikey")
    print("2. Sign in with Google")
    print("3. Click 'Create API Key'")
    print("4. Copy the key and paste it in backend/.env")
    print()
    print("Make sure the .env file has this format:")
    print("GEMINI_API_KEY=AIza...your_key_here")

print()
print("=" * 60)


