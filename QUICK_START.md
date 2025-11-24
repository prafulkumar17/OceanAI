# 🚀 Quick Start Guide

## Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Set up environment variables:**
   - Make sure `backend/.env` has:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     SECRET_KEY=your-secret-key-for-jwt-change-in-production
     ```

4. **Start the server:**
   ```powershell
   python run.py
   ```
   
   Or use uvicorn directly:
   ```powershell
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Verify it's running:**
   - Open: http://localhost:8000/docs
   - You should see the API documentation

## Frontend Setup

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies (if not already done):**
   ```powershell
   npm install
   ```

3. **Start the development server:**
   ```powershell
   npm run dev
   ```

4. **Open in browser:**
   - Usually: http://localhost:5173
   - Check the terminal output for the exact URL

## First Steps

1. **Register a new account:**
   - Go to the login page
   - Click "Register"
   - Enter email and password
   - You'll be automatically logged in

2. **Create your first project:**
   - Click "New Project"
   - Enter a title (e.g., "Marketing Strategy")
   - Enter a topic (e.g., "Digital marketing strategies for 2024")
   - Choose Word Document or PowerPoint
   - Click "Create Project"

3. **Generate content:**
   - Click "Generate Document"
   - Wait for AI to create the content
   - View the generated sections/slides

4. **Refine (optional):**
   - Enter a refinement prompt (e.g., "Make it more formal")
   - Click "Refine Content"

5. **Export:**
   - Click "Export"
   - Download your .docx or .pptx file

## Troubleshooting

### Backend won't start
- Check that `.env` file exists and has `GEMINI_API_KEY`
- Make sure virtual environment is activated
- Check if port 8000 is already in use

### Frontend can't connect to backend
- Make sure backend is running on http://localhost:8000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend (defaults to http://localhost:8000)

### Authentication errors
- Make sure you're logged in
- Check that JWT token is stored in localStorage
- Try logging out and logging back in

### API errors
- Check backend terminal for error messages
- Verify Gemini API key is valid
- Check http://localhost:8000/docs for API status

