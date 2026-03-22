"""
Authentication routes - GitHub OAuth
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import httpx
import base64

from api.config import settings
from api.database import get_db
from api.models import User
from api.schemas import GitHubTokenRequest, GitHubTokenResponse, UserResponse

router = APIRouter()


async def get_github_access_token(code: str) -> str:
    """Exchange GitHub code for access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_CALLBACK_URL
            },
            headers={"Accept": "application/json"}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        data = response.json()
        return data.get("access_token")


async def get_github_user(token: str) -> dict:
    """Fetch user data from GitHub."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user data")
        
        return response.json()


@router.get("/github")
async def github_login():
    """Redirect to GitHub OAuth authorization."""
    scope = "read:user user:email repo"
    auth_url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&scope={scope}"
    return RedirectResponse(auth_url)


@router.get("/callback", response_model=dict)
async def github_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Handle GitHub OAuth callback."""
    try:
        token = await get_github_access_token(code)
        github_user = await get_github_user(token)
        
        result = await db.execute(
            select(User).where(User.github_id == github_user["id"])
        )
        user = result.scalar_one_or_none()
        
        if user:
            user.github_token = token
            user.last_login = datetime.utcnow()
        else:
            user = User(
                github_id=github_user["id"],
                username=github_user["login"],
                email=github_user.get("email"),
                name=github_user.get("name"),
                avatar_url=github_user.get("avatar_url"),
                bio=github_user.get("bio"),
                company=github_user.get("company"),
                location=github_user.get("location"),
                blog=github_user.get("blog"),
                twitter_username=github_user.get("twitter_username"),
                github_token=token,
                last_login=datetime.utcnow()
            )
            db.add(user)
        
        await db.commit()
        await db.refresh(user)
        
        return {
            "status": "success",
            "user_id": user.id,
            "username": user.username,
            "message": "Login successful"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get current authenticated user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.post("/logout")
async def logout():
    """Logout endpoint."""
    return {"status": "success", "message": "Logged out successfully"}
