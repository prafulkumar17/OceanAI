"""
List available Gemini models
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=api_key)

print("=" * 60)
print("Available Gemini Models")
print("=" * 60)
print()

try:
    models = genai.list_models()
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"Model: {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Description: {model.description}")
            print()
except Exception as e:
    print(f"Error listing models: {e}")
    print()
    print("Trying common model names...")
    
    # Try common model names
    common_models = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro',
        'models/gemini-pro',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash',
    ]
    
    for model_name in common_models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("test")
            print(f"SUCCESS: {model_name} works!")
            break
        except Exception as e:
            print(f"  {model_name}: {str(e)[:80]}")

print("=" * 60)


