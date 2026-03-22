"""
Profile routes - Contributor profile management
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime
from typing import List, Optional
import httpx

from api.database import get_db
from api.models import User, ContributorProfile
from api.schemas import ProfileResponse, ProfileCreate

router = APIRouter()


async def fetch_github_profile(username: str, token: str = None) -> dict:
    """Fetch profile data from GitHub API."""
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if token:
        headers["Authorization"] = f"token {token}"
    
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            f"https://api.github.com/users/{username}",
            headers=headers
        )
        
        if user_response.status_code == 404:
            raise HTTPException(status_code=404, detail="GitHub user not found")
        
        user_data = user_response.json()
        
        repos_response = await client.get(
            f"https://api.github.com/users/{username}/repos",
            headers=headers,
            params={"per_page": 100}
        )
        repos = repos_response.json() if repos_response.status_code == 200 else []
        
        return {
            "user": user_data,
            "repos": repos
        }


def analyze_languages(repos: List[dict]) -> dict:
    """Analyze programming languages from repositories."""
    languages = {}
    for repo in repos:
        if repo.get("language"):
            lang = repo["language"]
            if lang not in languages:
                languages[lang] = {"count": 0, "repos": []}
            languages[lang]["count"] += 1
            languages[lang]["repos"].append(repo["full_name"])
    
    total = sum(l["count"] for l in languages.values())
    for lang, stats in languages.items():
        stats["percentage"] = round((stats["count"] / total) * 100, 1) if total > 0 else 0
    
    return dict(sorted(languages.items(), key=lambda x: x[1]["count"], reverse=True))


def calculate_activity_score(repos: List[dict]) -> tuple:
    """Calculate activity level from repos."""
    if not repos:
        return "Minimal", 10
    
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    avg_stars = total_stars / len(repos) if repos else 0
    
    if avg_stars > 100 or total_stars > 1000:
        return "Very High", 95
    elif avg_stars > 50 or total_stars > 500:
        return "High", 80
    elif avg_stars > 10 or total_stars > 100:
        return "Medium", 60
    elif avg_stars > 1 or total_stars > 10:
        return "Low", 30
    else:
        return "Minimal", 10


def calculate_completeness(user_data: dict, repos: List[dict]) -> int:
    """Calculate profile completeness score."""
    score = 0
    
    if user_data.get("bio"):
        score += 15
    if user_data.get("location"):
        score += 10
    if user_data.get("blog"):
        score += 10
    if user_data.get("twitter_username"):
        score += 5
    if len(repos) >= 5:
        score += 20
    if len(repos) >= 10:
        score += 10
    if user_data.get("followers", 0) >= 10:
        score += 15
    if user_data.get("public_repos", 0) >= 5:
        score += 15
    
    return min(100, score)


@router.get("/", response_model=List[ProfileResponse])
async def list_profiles(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """List all contributor profiles."""
    result = await db.execute(
        select(ContributorProfile)
        .order_by(ContributorProfile.completeness_score.desc())
        .offset(skip)
        .limit(limit)
    )
    profiles = result.scalars().all()
    return profiles


@router.get("/{username}", response_model=ProfileResponse)
async def get_profile(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific contributor profile."""
    result = await db.execute(
        select(User, ContributorProfile)
        .join(ContributorProfile)
        .where(User.username == username)
    )
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    user, profile = row
    return profile


@router.post("/create/{username}", response_model=ProfileResponse)
async def create_or_update_profile(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    """Create or update a contributor profile by fetching from GitHub."""
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        github_data = await fetch_github_profile(username, user.github_token)
        user_data = github_data["user"]
        repos = github_data["repos"]
    except HTTPException:
        raise HTTPException(status_code=502, detail="Failed to fetch from GitHub")
    
    languages = analyze_languages(repos)
    top_languages = list(languages.keys())[:10]
    activity_level, activity_score = calculate_activity_score(repos)
    
    profile_data = {
        "user_id": user.id,
        "github_url": user_data.get("html_url"),
        "member_since": datetime.strptime(user_data.get("created_at", "")[:10], "%Y-%m-%d") if user_data.get("created_at") else None,
        "public_repos": user_data.get("public_repos", 0),
        "public_gists": user_data.get("public_gists", 0),
        "followers": user_data.get("followers", 0),
        "following": user_data.get("following", 0),
        "languages": languages,
        "top_languages": top_languages,
        "expertise": [{"area": lang, "level": "Proficient", "repos": data["count"]} for lang, data in list(languages.items())[:5]],
        "activity_level": activity_level,
        "activity_score": activity_score,
        "completeness_score": calculate_completeness(user_data, repos),
        "last_analyzed": datetime.utcnow()
    }
    
    result = await db.execute(
        select(ContributorProfile).where(ContributorProfile.user_id == user.id)
    )
    existing_profile = result.scalar_one_or_none()
    
    if existing_profile:
        for key, value in profile_data.items():
            setattr(existing_profile, key, value)
    else:
        existing_profile = ContributorProfile(**profile_data)
        db.add(existing_profile)
    
    await db.commit()
    await db.refresh(existing_profile)
    
    return existing_profile


@router.delete("/{username}")
async def delete_profile(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a contributor profile."""
    result = await db.execute(
        select(User, ContributorProfile)
        .join(ContributorProfile)
        .where(User.username == username)
    )
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    user, profile = row
    await db.delete(profile)
    await db.commit()
    
    return {"status": "success", "message": f"Profile for {username} deleted"}
