"""
Verify API key format and content
"""
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("=" * 60)
print("API Key Verification")
print("=" * 60)
print()

if not api_key:
    print("ERROR: No API key found")
else:
    print(f"Key found: {len(api_key)} characters")
    print(f"First 15 chars: {api_key[:15]}...")
    print(f"Last 10 chars: ...{api_key[-10:]}")
    print()
    
    # Check for common issues
    issues = []
    
    if api_key.startswith('"') or api_key.startswith("'"):
        issues.append("Key starts with quotes - remove them")
    if api_key.endswith('"') or api_key.endswith("'"):
        issues.append("Key ends with quotes - remove them")
    if " " in api_key:
        issues.append("Key contains spaces - remove them")
    if not api_key.startswith("AIza"):
        issues.append("Key doesn't start with 'AIza' - might be incorrect")
    if len(api_key) < 30:
        issues.append(f"Key seems too short ({len(api_key)} chars) - should be ~39 chars")
    if len(api_key) > 50:
        issues.append(f"Key seems too long ({len(api_key)} chars) - might include extra characters")
    
    if issues:
        print("⚠️  Potential Issues Found:")
        for issue in issues:
            print(f"   - {issue}")
        print()
    else:
        print("✅ Key format looks correct!")
        print()
    
    print("Expected format:")
    print("   - Starts with: AIza")
    print("   - Length: ~39 characters")
    print("   - No quotes, no spaces")
    print()
    print("Your key format:")
    print(f"   - Starts with: {api_key[:4]}")
    print(f"   - Length: {len(api_key)} characters")
    has_quotes = api_key.startswith('"') or api_key.startswith("'")
    print(f"   - Has quotes: {has_quotes}")
    print(f"   - Has spaces: {' ' in api_key}")

print()
print("=" * 60)

