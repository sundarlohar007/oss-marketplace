"""
Pydantic schemas for request/response validation
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class GitHubTokenRequest(BaseModel):
    code: str


class GitHubTokenResponse(BaseModel):
    access_token: str
    token_type: str
    scope: str


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None


class UserCreate(UserBase):
    github_id: int
    github_token: str


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    github_id: int
    company: Optional[str] = None
    blog: Optional[str] = None
    twitter_username: Optional[str] = None
    created_at: datetime
    last_login: datetime


class ProfileBase(BaseModel):
    languages: Dict[str, Any] = {}
    top_languages: List[str] = []
    expertise: List[Dict[str, Any]] = []
    activity_level: str = "Unknown"
    activity_score: int = 0


class ProfileCreate(ProfileBase):
    user_id: int


class ProfileResponse(ProfileBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    github_url: Optional[str] = None
    member_since: Optional[datetime] = None
    public_repos: int
    followers: int
    following: int
    completeness_score: int
    last_analyzed: Optional[datetime] = None
    created_at: datetime


class ProjectBase(BaseModel):
    name: str
    full_name: str
    description: Optional[str] = None
    language: Optional[str] = None
    languages: Dict[str, int] = {}
    stars: int = 0
    forks: int = 0


class ProjectCreate(ProjectBase):
    owner_id: int
    github_url: str


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    owner_id: int
    github_url: str
    open_issues: int
    license: Optional[str] = None
    health_score: float
    is_archived: bool
    created_at: datetime


class MatchBase(BaseModel):
    score: float
    breakdown: Dict[str, float] = {}
    matching_languages: List[str] = []


class MatchCreate(MatchBase):
    contributor_id: int
    project_id: int


class MatchResponse(MatchBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    contributor_id: int
    project_id: int
    status: str
    message_sent: bool
    viewed: bool
    connected: bool
    created_at: datetime
    
    contributor: Optional[UserResponse] = None
    project: Optional[ProjectResponse] = None


class HealthAnalysis(BaseModel):
    overall_score: float
    grade: str
    status: str
    breakdown: Dict[str, float] = {}
    
    activity: Dict[str, Any] = {}
    community: Dict[str, Any] = {}
    maintenance: Dict[str, Any] = {}
    documentation: Dict[str, Any] = {}


class ContributorSearch(BaseModel):
    languages: Optional[List[str]] = None
    min_stars: Optional[int] = 0
    min_followers: Optional[int] = 0
    activity_level: Optional[str] = None
    limit: int = Field(default=10, le=50)


class ProjectSearch(BaseModel):
    language: Optional[str] = None
    min_stars: Optional[int] = 0
    max_issues: Optional[int] = None
    has_good_first_issues: bool = False
    limit: int = Field(default=10, le=50)


class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
