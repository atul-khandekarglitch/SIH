import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db import engine, Base
from app.api import auth, problems, admin, solutions, milestones, feedback, notifications, analytics, map as map_api
from app.services.seed_service import seed_demo_data
from app.db import AsyncSessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed demo data if database is fresh
    async with AsyncSessionLocal() as session:
        await seed_demo_data(session)

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered Societal Problem-to-Solution Collaboration Platform for Jharkhand State (SIH 2026 Prototype)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded problem images
uploads_dir = os.path.join(os.getcwd(), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include v1 routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(problems.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(solutions.router, prefix=settings.API_V1_STR)
app.include_router(milestones.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(map_api.router, prefix=settings.API_V1_STR)

# Direct Contract Aliases under /api/
app.include_router(auth.router, prefix="/api")
app.include_router(problems.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(solutions.router, prefix="/api")
app.include_router(milestones.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(map_api.router, prefix="/api")

# Contract specific endpoints
@app.get("/api/challenges")
async def get_challenges_alias(db=Depends(auth.get_db)):
    return await problems.list_problems(db=db)

@app.get("/api/universities")
async def get_universities():
    return [
        {"id": "uni-1", "name": "BIT Mesra", "district": "Ranchi", "lab": "Water & Environment Research Lab"},
        {"id": "uni-2", "name": "Birsa Agricultural University", "district": "Ranchi", "lab": "Agronomy & Micro-Irrigation Lab"},
        {"id": "uni-3", "name": "IIT ISM Dhanbad", "district": "Dhanbad", "lab": "Mining & Air Quality Research Group"}
    ]

@app.get("/api/gis/challenges")
async def get_gis_challenges(db=Depends(auth.get_db)):
    markers = await map_api.get_map_markers(db=db)
    features = []
    for m in markers:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [m["lng"] + 0.004, m["lat"] - 0.003] # ~500m public spatial fuzzing
            },
            "properties": m
        })
    return {"type": "FeatureCollection", "features": features}

@app.post("/api/ai/transcribe")
async def ai_transcribe(file: UploadFile = File(...)):
    return {"text": "Transcribed audio complaint: seasonal drinking water shortage in Ranchi block.", "confidence": 0.95}

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "online",
        "region": "Jharkhand",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
