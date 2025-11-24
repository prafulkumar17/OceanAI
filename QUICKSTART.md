# Quick Start Guide - OceanAI

## Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Google Gemini API Key

## 5-Minute Setup

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb oceanai_db
```

### 2. Backend Setup (Terminal 1)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your DATABASE_URL and GEMINI_API_KEY

# Initialize database
python init_db.py

# Run server
python run.py
```

### 3. Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

## What You Get

✅ Document upload (PDF, DOCX, TXT)
✅ Automatic text extraction
✅ AI-powered analysis (summary, keywords, sentiment)
✅ Beautiful React UI
✅ Document management dashboard

## API Endpoints

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/{id}` - Get document details
- `POST /api/documents/{id}/analyze` - Re-analyze document
- `DELETE /api/documents/{id}` - Delete document

## Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env

**Gemini API error?**
- Verify GEMINI_API_KEY in .env
- Check API key is valid (get free key from https://makersuite.google.com/app/apikey)

**Frontend can't connect?**
- Ensure backend is running on port 8000
- Check CORS settings in backend/app/main.py

## Next Steps

1. Upload a test document
2. View AI analysis results
3. Explore the document detail page
4. Try re-analyzing documents

Happy coding! 🚀

