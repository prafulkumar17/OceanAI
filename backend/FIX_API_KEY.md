# Fix Your API Key

## Current Issue
Your `.env` file still contains the placeholder text instead of your actual API key.

## Quick Fix Steps

### Method 1: Edit with Notepad (Easiest)
1. Open PowerShell/Command Prompt
2. Run: `notepad backend\.env`
3. Find the line: `GEMINI_API_KEY=your_GEMINI_API_KEY_here`
4. **Delete** `your_GEMINI_API_KEY_here` 
5. **Paste** your actual API key (should start with `AIza`)
6. **Save** the file (Ctrl+S)
7. **Close** Notepad

### Method 2: Edit with VS Code
1. Open VS Code
2. Open `backend/.env` file
3. Replace `your_GEMINI_API_KEY_here` with your actual key
4. Save (Ctrl+S)

## What Your .env Should Look Like

```env
DATABASE_URL=sqlite:///./oceanai.db
GEMINI_API_KEY=AIzaSyYourActualKeyHere123456789
SECRET_KEY=change_this_to_a_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
```

## Important
- ✅ Your API key should start with `AIza`
- ✅ It should be about 39 characters long
- ✅ NO quotes around it
- ✅ NO spaces before or after the `=`

## After Fixing
Run this to test:
```powershell
cd backend
.\venv\Scripts\python.exe test_gemini.py
```


