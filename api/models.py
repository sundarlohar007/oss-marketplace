"""
Database models
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from api.database import Base


class User(Base):
    """User model for authentication."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    avatar_url = Column(String(500))
    bio = Column(Text)
    company = Column(String(255))
    location = Column(String(255))
    blog = Column(String(500))
    twitter_username = Column(String(100))
    github_token = Column(String(500))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("ContributorProfile", back_populates="user", uselist=False)
    projects = relationship("Project", back_populates="owner")
    matches = relationship("Match", foreign_keys="Match.contributor_id", back_populates="contributor")
    project_matches = relationship("Match", foreign_keys="Match.project_id", back_populates="project")


class ContributorProfile(Base):
    """Contributor DNA profile."""
    __tablename__ = "contributor_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    github_url = Column(String(500))
    member_since = Column(DateTime)
    public_repos = Column(Integer, default=0)
    public_gists = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    
    languages = Column(JSON)
    top_languages = Column(JSON)
    expertise = Column(JSON)
    
    activity_level = Column(String(50))
    activity_score = Column(Integer, default=0)
    contribution_quality = Column(JSON)
    
    completeness_score = Column(Integer, default=0)
    last_analyzed = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")


class Project(Base):
    """Open source project."""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    name = Column(String(255), index=True)
    full_name = Column(String(500), unique=True, index=True)
    description = Column(Text)
    github_url = Column(String(500))
    
    language = Column(String(100))
    languages = Column(JSON)
    
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    watchers = Column(Integer, default=0)
    open_issues = Column(Integer, default=0)
    
    license = Column(String(100))
    default_branch = Column(String(50))
    
    is_archived = Column(Boolean, default=False)
    is_fork = Column(Boolean, default=False)
    
    health_score = Column(Float, default=0)
    health_data = Column(JSON)
    
    last_synced = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="projects")
    matches = relationship("Match", foreign_keys="Match.project_id", back_populates="project")


class Match(Base):
    """Match record between contributor and project."""
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    
    contributor_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    score = Column(Float)
    breakdown = Column(JSON)
    matching_languages = Column(JSON)
    
    status = Column(String(50), default="pending")
    message_sent = Column(Boolean, default=False)
    message_content = Column(Text)
    
    viewed = Column(Boolean, default=False)
    connected = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    contributor = relationship("User", foreign_keys=[contributor_id], back_populates="matches")
    project = relationship("Project", foreign_keys=[project_id], back_populates="matches")
