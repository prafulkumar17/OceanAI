# How to Add Your Gemini API Key

## Current Status
Your `.env` file currently has a placeholder value. You need to replace it with your actual API key.

## Steps to Add Your API Key

### 1. Get Your API Key
1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the entire API key (it will look like: `AIzaSy...`)

### 2. Edit the .env File

**Option A: Using a Text Editor**
1. Open `backend/.env` in any text editor (Notepad, VS Code, etc.)
2. Find the line: `GEMINI_API_KEY=your_GEMINI_API_KEY_here`
3. Replace `your_GEMINI_API_KEY_here` with your actual key
4. Save the file

**Option B: Using PowerShell**
```powershell
cd backend
notepad .env
```
Then replace the placeholder with your actual key and save.

### 3. Verify It Works
After adding your key, run:
```powershell
cd backend
.\venv\Scripts\python.exe test_gemini.py
```

## Important Notes

- ✅ The API key should start with `AIza`
- ✅ It should be about 39 characters long
- ✅ No spaces or quotes around the key
- ✅ Make sure there are no extra spaces before or after the `=`

## Example .env File

```env
DATABASE_URL=sqlite:///./oceanai.db
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
SECRET_KEY=change_this_to_a_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
```

## Need Help?

If you're having trouble:
1. Make sure you copied the ENTIRE key (no truncation)
2. Check there are no extra spaces
3. Verify the key is active at https://makersuite.google.com/app/apikey
4. Try creating a new API key if the current one doesn't work


