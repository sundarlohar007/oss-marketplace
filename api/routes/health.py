"""
Health check routes - Project health analysis
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional
import httpx

from api.database import get_db
from api.models import Project
from api.schemas import HealthAnalysis

router = APIRouter()


async def fetch_project_data(owner: str, repo: str, token: str = None) -> dict:
    """Fetch comprehensive project data from GitHub."""
    headers = {"Accept": "application/vnd.github.v3+json"}
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
        
        issues_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/issues",
            headers=headers,
            params={"state": "all", "since": (datetime.utcnow() - timedelta(days=365)).isoformat()}
        )
        issues = issues_response.json() if issues_response.status_code == 200 else []
        issues = [i for i in issues if "pull_request" not in i]
        
        commits_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/commits",
            headers=headers,
            params={"since": (datetime.utcnow() - timedelta(days=365)).isoformat()}
        )
        commits = commits_response.json() if commits_response.status_code == 200 else []
        
        contributors_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contributors",
            headers=headers
        )
        contributors = contributors_response.json() if contributors_response.status_code == 200 else []
        
        languages_response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/languages",
            headers=headers
        )
        languages = languages_response.json() if languages_response.status_code == 200 else {}
        
        return {
            "repo": repo_data,
            "issues": issues,
            "commits": commits,
            "contributors": contributors,
            "languages": languages
        }


def analyze_activity(commits: list, issues: list) -> dict:
    """Analyze project activity metrics."""
    now = datetime.utcnow()
    
    commits_by_month = {}
    for commit in commits:
        date_str = commit.get("commit", {}).get("author", {}).get("date", "")[:10]
        if date_str:
            month_key = datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m")
            commits_by_month[month_key] = commits_by_month.get(month_key, 0) + 1
    
    recent_commits = sum(1 for c in commits 
        if (now - datetime.strptime(c.get("commit", {}).get("author", {}).get("date", "")[:10], "%Y-%m-%d")).days < 30)
    
    issues_this_month = sum(1 for i in issues 
        if (now - datetime.strptime(i.get("created_at", "")[:10], "%Y-%m-%d")).days < 30)
    
    closed_this_month = sum(1 for i in issues 
        if i.get("state") == "closed" 
        and (now - datetime.strptime(i.get("closed_at", "")[:10], "%Y-%m-%d")).days < 30)
    
    commit_score = min(100, recent_commits / 3 * 100)
    issue_score = 50 if issues_this_month == 0 else min(100, (closed_this_month / issues_this_month) * 100)
    
    return {
        "total_commits": len(commits),
        "commits_this_month": recent_commits,
        "commits_by_month": commits_by_month,
        "total_issues": len(issues),
        "issues_this_month": issues_this_month,
        "closed_this_month": closed_this_month,
        "issue_resolution_rate": round(issue_score, 1),
        "commit_frequency_score": round(commit_score, 1),
        "activity_status": "Very Active" if recent_commits > 20 else "Active" if recent_commits > 5 else "Low Activity"
    }


def analyze_community(issues: list, contributors: list) -> dict:
    """Analyze community health."""
    now = datetime.utcnow()
    
    issues_with_comments = sum(1 for i in issues if i.get("comments", 0) > 0)
    avg_comments = sum(i.get("comments", 0) for i in issues) / len(issues) if issues else 0
    
    good_first_issues = sum(1 for i in issues 
        for label in i.get("labels", []) 
        if "good first" in label.get("name", "").lower())
    
    recent_issues = [i for i in issues if (now - datetime.strptime(i.get("created_at", "")[:10], "%Y-%m-%d")).days < 90]
    responsive_issues = sum(1 for i in recent_issues if i.get("comments", 0) > 0)
    response_rate = (responsive_issues / len(recent_issues) * 100) if recent_issues else 0
    
    return {
        "total_contributors": len(contributors),
        "issues_with_engagement": issues_with_comments,
        "avg_comments_per_issue": round(avg_comments, 1),
        "good_first_issues": good_first_issues,
        "response_rate": round(response_rate, 1),
        "newcomer_friendly": good_first_issues > 0 and response_rate > 50
    }


def analyze_maintenance(repo_data: dict, issues: list) -> dict:
    """Analyze maintenance practices."""
    now = datetime.utcnow()
    
    updated_at = datetime.strptime(repo_data.get("updated_at", "")[:10], "%Y-%m-%d")
    days_since_update = (now - updated_at).days
    
    open_issues = [i for i in issues if i.get("state") == "open"]
    stale_issues = sum(1 for i in open_issues 
        if (now - datetime.strptime(i.get("created_at", "")[:10], "%Y-%m-%d")).days > 90)
    very_stale = sum(1 for i in open_issues 
        if (now - datetime.strptime(i.get("created_at", "")[:10], "%Y-%m-%d")).days > 180)
    
    return {
        "days_since_update": days_since_update,
        "last_updated_status": "Recent" if days_since_update < 7 else "Active" if days_since_update < 30 else "Stale",
        "open_issues": len(open_issues),
        "stale_issues": stale_issues,
        "very_stale_issues": very_stale,
        "stale_issue_percentage": round(stale_issues / len(open_issues) * 100, 1) if open_issues else 0
    }


def analyze_documentation(repo_data: dict) -> dict:
    """Analyze documentation quality."""
    return {
        "has_wiki": repo_data.get("has_wiki", False),
        "has_projects": repo_data.get("has_projects", False),
        "has_pages": repo_data.get("has_pages", False),
        "description_length": len(repo_data.get("description", "") or ""),
        "has_description": bool(repo_data.get("description"))
    }


def calculate_overall_score(activity: dict, community: dict, maintenance: dict, documentation: dict) -> dict:
    """Calculate overall health score."""
    scores = {
        "activity": activity["commit_frequency_score"],
        "community": community["response_rate"],
        "maintenance": max(0, 100 - maintenance["stale_issue_percentage"]),
        "documentation": 50 if documentation["has_description"] else 20,
    }
    
    weights = {"activity": 0.30, "community": 0.30, "maintenance": 0.25, "documentation": 0.15}
    weighted_score = sum(scores[k] * weights[k] for k in scores)
    
    return {
        "score": round(weighted_score, 1),
        "breakdown": {k: round(v, 1) for k, v in scores.items()},
        "grade": "A" if weighted_score >= 80 else "B" if weighted_score >= 60 else "C" if weighted_score >= 40 else "D",
        "status": "Healthy" if weighted_score >= 70 else "Needs Attention" if weighted_score >= 40 else "At Risk"
    }


@router.get("/analyze/{owner}/{repo}", response_model=HealthAnalysis)
async def analyze_project_health(
    owner: str,
    repo: str,
    token: Optional[str] = None
):
    """Perform complete health analysis of a project."""
    data = await fetch_project_data(owner, repo, token)
    
    activity = analyze_activity(data["commits"], data["issues"])
    community = analyze_community(data["issues"], data["contributors"])
    maintenance = analyze_maintenance(data["repo"], data["issues"])
    documentation = analyze_documentation(data["repo"])
    overall = calculate_overall_score(activity, community, maintenance, documentation)
    
    return HealthAnalysis(
        overall_score=overall["score"],
        grade=overall["grade"],
        status=overall["status"],
        breakdown=overall["breakdown"],
        activity=activity,
        community=community,
        maintenance=maintenance,
        documentation=documentation
    )


@router.get("/score/{owner}/{repo}")
async def get_quick_score(
    owner: str,
    repo: str,
    db: AsyncSession = Depends(get_db)
):
    """Get quick health score from database or calculate."""
    full_name = f"{owner}/{repo}"
    result = await db.execute(select(Project).where(Project.full_name == full_name))
    project = result.scalar_one_or_none()
    
    if project:
        return {
            "full_name": full_name,
            "health_score": project.health_score,
            "stars": project.stars,
            "forks": project.forks,
            "open_issues": project.open_issues,
            "last_synced": project.last_synced.isoformat() if project.last_synced else None
        }
    
    data = await fetch_project_data(owner, repo)
    health = calculate_overall_score(
        analyze_activity(data["commits"], data["issues"]),
        analyze_community(data["issues"], data["contributors"]),
        analyze_maintenance(data["repo"], data["issues"]),
        analyze_documentation(data["repo"])
    )
    
    return {
        "full_name": full_name,
        "health_score": health["score"],
        "grade": health["grade"],
        "status": health["status"],
        "stars": data["repo"].get("stargazers_count", 0),
        "forks": data["repo"].get("forks_count", 0),
        "open_issues": len(data["issues"]),
        "analysis_timestamp": datetime.utcnow().isoformat()
    }
