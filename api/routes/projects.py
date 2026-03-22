"""
Project routes - Project management and discovery
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from datetime import datetime
from typing import List, Optional
import httpx

from api.database import get_db
from api.models import User, Project
from api.schemas import ProjectResponse, ProjectCreate

router = APIRouter()


async def fetch_github_repo(owner: str, repo: str, token: str = None) -> dict:
    """Fetch repository data from GitHub API."""
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if token:
        headers["Authorization"] = f"token {token}"
    
    async with httpx.AsyncClient() as client:
        repo_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers=headers
        )
        
        if repo_response.status_code == 404:
            raise HTTPException(status_code=404, detail="Repository not found")
        
        repo_data = repo_response.json()
        
        lang_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/languages",
            headers=headers
        )
        languages = lang_response.json() if lang_response.status_code == 200 else {}
        
        return {
            "repo": repo_data,
            "languages": languages
        }


def calculate_health_score(repo_data: dict, issues_count: int) -> float:
    """Calculate project health score."""
    stars = repo_data.get("stargazers_count", 0)
    forks = repo_data.get("forks_count", 0)
    
    updated_at = datetime.strptime(repo_data.get("updated_at", "")[:10], "%Y-%m-%d")
    days_since_update = (datetime.utcnow() - updated_at).days
    
    score = 70
    
    if days_since_update < 7:
        score += 20
    elif days_since_update < 30:
        score += 10
    elif days_since_update > 180:
        score -= 30
    elif days_since_update > 90:
        score -= 15
    
    if repo_data.get("has_issues", False):
        score += 5
    if repo_data.get("has_projects", False):
        score += 5
    if repo_data.get("has_wiki", False):
        score += 5
    
    if repo_data.get("license"):
        score += 5
    
    if issues_count > 100:
        score -= 10
    elif issues_count > 50:
        score -= 5
    
    return max(0, min(100, score))


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    skip: int = 0,
    limit: int = 10,
    language: Optional[str] = None,
    min_stars: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all projects with optional filtering."""
    query = select(Project)
    
    if language:
        query = query.where(Project.language == language)
    if min_stars:
        query = query.where(Project.stars >= min_stars)
    
    query = query.order_by(Project.stars.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    projects = result.scalars().all()
    return projects


@router.get("/{owner}/{repo}", response_model=ProjectResponse)
async def get_project(
    owner: str,
    repo: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific project."""
    full_name = f"{owner}/{repo}"
    result = await db.execute(
        select(Project).where(Project.full_name == full_name)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.post("/add/{owner}/{repo}", response_model=ProjectResponse)
async def add_project(
    owner: str,
    repo: str,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Add or update a project by fetching from GitHub."""
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        github_data = await fetch_github_repo(owner, repo, user.github_token)
        repo_data = github_data["repo"]
        languages = github_data["languages"]
    except HTTPException:
        raise HTTPException(status_code=502, detail="Failed to fetch from GitHub")
    
    async with httpx.AsyncClient() as client:
        issues_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/issues",
            headers={"Authorization": f"token {user.github_token}"},
            params={"state": "open", "per_page": 100}
        )
        issues_count = len(issues_response.json()) if issues_response.status_code == 200 else 0
    
    health_score = calculate_health_score(repo_data, issues_count)
    
    project_data = {
        "owner_id": user.id,
        "name": repo_data.get("name"),
        "full_name": repo_data.get("full_name"),
        "description": repo_data.get("description"),
        "github_url": repo_data.get("html_url"),
        "language": repo_data.get("language"),
        "languages": languages,
        "stars": repo_data.get("stargazers_count", 0),
        "forks": repo_data.get("forks_count", 0),
        "watchers": repo_data.get("watchers_count", 0),
        "open_issues": issues_count,
        "license": repo_data.get("license", {}).get("name") if repo_data.get("license") else None,
        "default_branch": repo_data.get("default_branch"),
        "is_archived": repo_data.get("archived", False),
        "is_fork": repo_data.get("fork", False),
        "health_score": health_score,
        "health_data": {"calculated_at": datetime.utcnow().isoformat()},
        "last_synced": datetime.utcnow()
    }
    
    result = await db.execute(
        select(Project).where(Project.full_name == f"{owner}/{repo}")
    )
    existing_project = result.scalar_one_or_none()
    
    if existing_project:
        for key, value in project_data.items():
            setattr(existing_project, key, value)
    else:
        existing_project = Project(**project_data)
        db.add(existing_project)
    
    await db.commit()
    await db.refresh(existing_project)
    
    return existing_project


@router.delete("/{owner}/{repo}")
async def delete_project(
    owner: str,
    repo: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a project."""
    full_name = f"{owner}/{repo}"
    result = await db.execute(
        select(Project).where(Project.full_name == full_name)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()
    
    return {"status": "success", "message": f"Project {full_name} deleted"}


@router.get("/search/discover")
async def discover_projects(
    language: Optional[str] = None,
    min_stars: int = Query(default=100, ge=0),
    limit: int = Query(default=10, le=50)
):
    """Discover popular projects from GitHub."""
    async with httpx.AsyncClient() as client:
        query = f"stars:>{min_stars}"
        if language:
            query += f" language:{language}"
        
        response = await client.get(
            "https://api.github.com/search/repositories",
            params={"q": query, "sort": "stars", "per_page": limit}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="GitHub search failed")
        
        items = response.json().get("items", [])
        
        return {
            "total": len(items),
            "projects": [
                {
                    "name": item.get("full_name"),
                    "description": item.get("description"),
                    "stars": item.get("stargazers_count"),
                    "language": item.get("language"),
                    "url": item.get("html_url")
                }
                for item in items
            ]
        }
