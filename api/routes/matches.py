"""
Matching routes - Match contributors with projects
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import datetime
from typing import List, Optional
import httpx

from api.database import get_db
from api.models import User, ContributorProfile, Project, Match
from api.schemas import MatchResponse, MatchCreate

router = APIRouter()


def calculate_match_score(contributor: ContributorProfile, project: Project) -> dict:
    """Calculate match score between contributor and project."""
    if not contributor.languages or not project.languages:
        return {"score": 0, "breakdown": {}}
    
    contrib_langs = set(contributor.languages.keys())
    project_langs = set(project.languages.keys())
    
    overlap = contrib_langs & project_langs
    
    lang_score = len(overlap) / len(project_langs) * 100 if project_langs else 0
    
    star_score = min(20, project.stars / 100) if project.stars < 2000 else 20
    
    health_score = project.health_score * 0.2
    
    activity_bonus = contributor.activity_score * 0.1
    
    total_score = lang_score * 0.5 + star_score + health_score + activity_bonus
    
    return {
        "score": round(min(100, total_score), 1),
        "breakdown": {
            "language_match": round(lang_score, 1),
            "popularity": round(star_score, 1),
            "project_health": round(health_score, 1),
            "activity_bonus": round(activity_bonus, 1)
        },
        "matching_languages": list(overlap)
    }


async def find_matching_projects(contributor: ContributorProfile, limit: int = 10) -> List[dict]:
    """Find projects that match a contributor's skills."""
    result = await calculate_match_score.__self__.fetch_repos(contributor, limit)
    return result


@router.get("/contributor/{username}", response_model=List[MatchResponse])
async def find_projects_for_contributor(
    username: str,
    limit: int = Query(default=10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Find projects that match a contributor's skills."""
    user_result = await db.execute(
        select(User, ContributorProfile)
        .join(ContributorProfile)
        .where(User.username == username)
    )
    row = user_result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Contributor profile not found. Create a profile first.")
    
    user, contributor = row
    
    async with httpx.AsyncClient() as client:
        search_langs = contributor.top_languages[:3] if contributor.top_languages else []
        matches = []
        
        for lang in search_langs:
            response = await client.get(
                "https://api.github.com/search/repositories",
                params={"q": f"language:{lang} stars:>100", "sort": "stars", "per_page": 20}
            )
            
            if response.status_code != 200:
                continue
            
            items = response.json().get("items", [])
            
            for item in items:
                if item.get("owner", {}).get("login") == username:
                    continue
                
                lang_response = await client.get(
                    f"https://api.github.com/repos/{item['full_name']}/languages"
                )
                languages = lang_response.json() if lang_response.status_code == 200 else {}
                
                match_score = calculate_match_score(contributor, type('obj', (object,), {
                    'languages': languages,
                    'stars': item.get('stargazers_count', 0),
                    'health_score': 70
                })())
                
                matches.append({
                    "project_name": item.get("full_name"),
                    "description": item.get("description"),
                    "stars": item.get("stargazers_count"),
                    "language": item.get("language"),
                    "url": item.get("html_url"),
                    "score": match_score["score"],
                    "breakdown": match_score["breakdown"],
                    "matching_languages": match_score["matching_languages"]
                })
    
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:limit]


@router.get("/project/{owner}/{repo}", response_model=List[MatchResponse])
async def find_contributors_for_project(
    owner: str,
    repo: str,
    limit: int = Query(default=10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Find contributors that match a project's needs."""
    full_name = f"{owner}/{repo}"
    project_result = await db.execute(
        select(Project).where(Project.full_name == full_name)
    )
    project = project_result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found. Add it first.")
    
    async with httpx.AsyncClient() as client:
        matches = []
        
        search_langs = list(project.languages.keys())[:3] if project.languages else []
        
        for lang in search_langs:
            response = await client.get(
                "https://api.github.com/search/users",
                params={"q": f"language:{lang} repos:>5", "per_page": 30}
            )
            
            if response.status_code != 200:
                continue
            
            items = response.json().get("items", [])
            
            for item in items:
                if item.get("login") == owner:
                    continue
                
                contrib_result = await db.execute(
                    select(User, ContributorProfile)
                    .join(ContributorProfile)
                    .where(User.username == item.get("login"))
                )
                contrib_row = contrib_result.first()
                
                if contrib_row:
                    user, contributor = contrib_row
                    match_score = calculate_match_score(contributor, project)
                    
                    matches.append({
                        "username": user.username,
                        "name": user.name,
                        "avatar_url": user.avatar_url,
                        "followers": user.followers,
                        "public_repos": user.public_repos,
                        "score": match_score["score"],
                        "breakdown": match_score["breakdown"],
                        "matching_languages": match_score["matching_languages"],
                        "url": user.avatar_url.replace("avatars", "orgs") if user.avatar_url else None
                    })
    
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:limit]


@router.post("/save")
async def save_match(
    match_data: MatchCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save a match to the database."""
    match = Match(**match_data.model_dump())
    db.add(match)
    await db.commit()
    await db.refresh(match)
    
    return {"status": "success", "match_id": match.id}


@router.get("/saved/{user_id}", response_model=List[MatchResponse])
async def get_saved_matches(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all saved matches for a user."""
    result = await db.execute(
        select(Match)
        .where(Match.contributor_id == user_id)
        .order_by(Match.score.desc())
    )
    matches = result.scalars().all()
    return matches


@router.put("/{match_id}/status")
async def update_match_status(
    match_id: int,
    status: str = Query(..., regex="^(pending|viewed|connected|rejected)$"),
    db: AsyncSession = Depends(get_db)
):
    """Update match status."""
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match.status = status
    match.viewed = status != "pending"
    await db.commit()
    
    return {"status": "success", "message": f"Match status updated to {status}"}


@router.delete("/{match_id}")
async def delete_match(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a saved match."""
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    await db.delete(match)
    await db.commit()
    
    return {"status": "success", "message": "Match deleted"}
