# Setup Guide - OceanAI Document Processing System

## Quick Start (2-Day Timeline)

### Day 1: Backend Setup

#### 1. Database Setup
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb oceanai_db

# Or using psql:
psql -U postgres
CREATE DATABASE oceanai_db;
\q
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
# Edit .env and add:
# - DATABASE_URL=postgresql://user:password@localhost:5432/oceanai_db
# - GEMINI_API_KEY=your_gemini_api_key_here
# - SECRET_KEY=generate_a_random_secret_key

# Initialize database tables
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Run backend server
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### Day 2: Frontend Setup

#### 1. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/oceanai_db
OPENAI_API_KEY=sk-...
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Testing the System

1. **Start Backend**: `cd backend && uvicorn app.main:app --reload`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Upload Document**: Click "Upload" and select a PDF/DOCX/TXT file
5. **View Results**: Document will be processed and AI analysis will appear

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env matches your PostgreSQL credentials
- Verify database `oceanai_db` exists

### Gemini API Issues
- Verify GEMINI_API_KEY is set correctly in .env
- Get free API key from https://makersuite.google.com/app/apikey
- API calls require internet connection

### File Upload Issues
- Check `uploads/` directory exists and is writable
- Verify file size is under 10MB
- Ensure file type is PDF, DOCX, or TXT

## Production Deployment

### Backend
- Use production ASGI server: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`
- Set up proper database connection pooling
- Configure CORS for production domain
- Use environment variables for all secrets

### Frontend
- Build: `npm run build`
- Serve static files with nginx or similar
- Update API_URL to production backend

## Next Steps (Optional Enhancements)

1. **Authentication**: Implement JWT-based user authentication
2. **Search**: Add full-text search for documents
3. **Batch Processing**: Process multiple documents at once
4. **Export**: Export analysis results to PDF/CSV
5. **Analytics Dashboard**: Visualize document statistics
6. **Webhooks**: Notify on document processing completion
7. **OCR**: Add image-to-text conversion for scanned documents

