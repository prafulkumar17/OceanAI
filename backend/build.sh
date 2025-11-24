#!/usr/bin/env bash
# Build script for Render.com deployment

set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python -c "
from app.database import engine, Base
from app.models import User, Project

# Create all tables
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
