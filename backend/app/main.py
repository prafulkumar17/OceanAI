from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, projects
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OceanAI Document Generator API",
    description="AI-powered document generation system (Word & PowerPoint)",
    version="1.0.0"
)

# CORS middleware
import os

# CORS middleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/")
def root():
    return {
        "message": "OceanAI Document Generator API",
        "version": "1.0.0",
        "docs": "/docs",
        "features": [
            "User authentication",
            "Project creation",
            "AI document generation (Word & PowerPoint)",
            "Content refinement",
            "Document export"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


