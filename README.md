# OceanAI - Document Generation System

AI-powered document generation system that creates Word documents and PowerPoint presentations using Google Gemini AI.

## 🎯 Features

- **User Authentication** - JWT-based login/register
- **Project Management** - Create and manage document projects
- **AI Document Generation** - Generate complete documents in one go
  - Word Documents: 3-5 sections with paragraphs
  - PowerPoint Presentations: 5 slides with titles and bullets
- **Content Refinement** - Refine generated content with simple prompts
- **Document Export** - Download as .docx or .pptx files

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - Database (easy setup, can switch to PostgreSQL)
- **SQLAlchemy** - ORM for database operations
- **Google Gemini API** - AI document generation
- **python-docx** - Word document generation
- **python-pptx** - PowerPoint generation
- **JWT** - Authentication tokens
- **Pydantic** - Data validation

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## 📁 Project Structure

```
oceanAI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   └── projects.py      # Project CRUD + generate/refine/export
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   └── project.py       # Project model
│   │   ├── schemas/
│   │   │   ├── auth.py          # Auth schemas
│   │   │   └── project.py       # Project schemas
│   │   ├── services/
│   │   │   ├── auth.py          # JWT & password hashing
│   │   │   ├── document_generator.py  # Gemini AI generation
│   │   │   └── file_exporter.py       # Export to .docx/.pptx
│   │   ├── main.py              # FastAPI app
│   │   └── database.py          # Database configuration
│   ├── requirements.txt
│   └── .env                     # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Login/Register
│   │   │   ├── ProjectsList.tsx # List projects
│   │   │   ├── CreateProject.tsx # Create project
│   │   │   └── ProjectDetail.tsx # View/edit/export
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   └── App.tsx              # Router
│   └── package.json
└── README.md
```

## 🚀 Quick Start

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Backend Setup

1. Navigate to backend: `cd backend`
2. Activate venv: `.\venv\Scripts\Activate.ps1` (Windows)
3. Set up `.env` file with `GEMINI_API_KEY` and `SECRET_KEY`
4. Start server: `python run.py`

### Frontend Setup

1. Navigate to frontend: `cd frontend`
2. Install: `npm install`
3. Start dev server: `npm run dev`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List user's projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects/{id}/generate` - Generate document
- `POST /api/projects/{id}/refine` - Refine content
- `GET /api/projects/{id}/export` - Download file
- `DELETE /api/projects/{id}` - Delete project

## 🔄 User Workflow

1. **Register/Login** → Get JWT token
2. **Create Project** → Enter title, topic, choose docx/pptx
3. **Generate Document** → AI creates full document in one go
4. **View Content** → See generated sections/slides
5. **Refine (Optional)** → Enter refinement prompt, click refine
6. **Export** → Download .docx or .pptx file

## 🔐 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your-secret-key-for-jwt-change-in-production
DATABASE_URL=sqlite:///./oceanai.db
```

## 📝 Next Steps (Future Enhancements)

- Section-by-section refinement
- Like/dislike buttons
- Comments system
- AI template builder
- Drag-and-drop outline editor

## 📄 License

MIT
