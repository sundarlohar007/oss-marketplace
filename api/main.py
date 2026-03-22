"""
OSS Marketplace API - Main Application Entry Point
FastAPI backend for the matchmaking platform
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import logging

from api.config import settings
from api.database import engine, Base
from api.routes import auth, profiles, projects, matches, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting OSS Marketplace API...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("✅ Database tables created")
    yield
    
    logger.info("👋 Shutting down OSS Marketplace API...")


app = FastAPI(
    title="OSS Marketplace API",
    description="""
## 🌍 OSS Marketplace API

The matchmaking engine for open source maintainers and contributors.

### Features

- **Contributor Profiles** - Create and manage developer profiles
- **Project Matching** - Find perfect project/developer matches
- **Health Analysis** - Analyze open source project health
- **GitHub Integration** - Seamless GitHub OAuth and API integration

### Authentication

Most endpoints require authentication. Use the `/auth/github` endpoint to get started.

### Rate Limits

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["Profiles"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["Matches"])
app.include_router(health.router, prefix="/api/v1/health", tags=["Health"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "OSS Marketplace API",
        "version": "1.0.0",
        "description": "Match maintainers with perfect contributors",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/v1/health",
        "status": "operational"
    }


@app.get("/api/v1/status", tags=["Status"])
async def api_status():
    """API status and available endpoints."""
    return {
        "status": "operational",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "auth": "/api/v1/auth",
            "profiles": "/api/v1/profiles",
            "projects": "/api/v1/projects",
            "matches": "/api/v1/matches",
            "health": "/api/v1/health"
        },
        "features": {
            "github_oauth": True,
            "matching_engine": True,
            "health_analysis": True
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
