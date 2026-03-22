"""Comprehensive unit tests for CLI profile generation - 16 tests"""
import pytest
import json
from unittest.mock import patch, MagicMock, Mock, call
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from oss_profile import (
    analyze_languages,
    calculate_activity_level,
    generate_profile
)


class MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
    
    def json(self):
        return self.json_data


class TestLanguageAnalysis:
    """Test language analysis functionality - 5 tests"""
    
    def test_analyze_languages_basic(self):
        """Test basic language analysis from repos"""
        repos = [
            {"language": "Python"},
            {"language": "Python"},
            {"language": "JavaScript"},
            {"language": "Go"},
            {"language": "Rust"},
        ]
        
        result = analyze_languages(repos)
        
        assert "Python" in result
        assert result["Python"] == 40.0
        assert result["JavaScript"] == 20.0
        assert result["Go"] == 20.0
        assert result["Rust"] == 20.0
    
    def test_analyze_languages_empty(self):
        """Test language analysis with no repos"""
        result = analyze_languages([])
        assert result == {}
    
    def test_analyze_languages_no_language(self):
        """Test repos with no language specified"""
        repos = [
            {"name": "repo1"},
            {"name": "repo2"},
            {"language": "Python"},
        ]
        
        result = analyze_languages(repos)
        
        assert len(result) == 1
        assert "Python" in result
        assert result["Python"] == 100.0
    
    def test_analyze_languages_single_language(self):
        """Test repos all using same language"""
        repos = [
            {"language": "Python"},
            {"language": "Python"},
            {"language": "Python"},
        ]
        
        result = analyze_languages(repos)
        
        assert len(result) == 1
        assert result["Python"] == 100.0
    
    def test_analyze_languages_sorted_by_count(self):
        """Test languages are sorted by count descending"""
        repos = [
            {"language": "Python"},
            {"language": "Python"},
            {"language": "Python"},
            {"language": "JavaScript"},
            {"language": "Go"},
            {"language": "TypeScript"},
        ]
        
        result = analyze_languages(repos)
        languages = list(result.keys())
        
        assert languages[0] == "Python"
        assert languages[1] == "JavaScript"
        assert result["Python"] > result["JavaScript"]


class TestActivityLevel:
    """Test activity level calculation - 5 tests"""
    
    def test_calculate_activity_level_very_high(self):
        """Test very high activity level"""
        events = [{"type": "PushEvent"}] * 600
        level = calculate_activity_level(events)
        
        assert "Very High" in level
    
    def test_calculate_activity_level_high(self):
        """Test high activity level"""
        events = [{"type": "PushEvent"}] * 300
        level = calculate_activity_level(events)
        
        assert "High" in level
    
    def test_calculate_activity_level_medium(self):
        """Test medium activity level"""
        events = [{"type": "PushEvent"}] * 100
        level = calculate_activity_level(events)
        
        assert "Medium" in level
    
    def test_calculate_activity_level_low(self):
        """Test low activity level"""
        events = [{"type": "PushEvent"}] * 20
        level = calculate_activity_level(events)
        
        assert "Low" in level
    
    def test_calculate_activity_level_minimal(self):
        """Test minimal activity level"""
        events = []
        level = calculate_activity_level(events)
        
        assert "Minimal" in level


class TestProfileGeneration:
    """Test profile generation - 6 tests"""
    
    @pytest.fixture
    def sample_data(self):
        return {
            "user": {
                "id": 12345,
                "login": "testuser",
                "name": "Test User",
                "bio": "A test developer",
                "location": "Test City",
                "company": "Test Corp",
                "blog": "https://test.com",
                "twitter_username": "testuser",
                "followers": 100,
                "following": 50,
                "public_repos": 20,
                "public_gists": 5,
                "hireable": True,
                "created_at": "2020-01-15T10:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "html_url": "https://github.com/testuser",
                "avatar_url": "https://github.com/testuser.png",
                "site_admin": False
            },
            "repos": [
                {
                    "name": "repo1",
                    "full_name": "testuser/repo1",
                    "language": "Python",
                    "stargazers_count": 50,
                    "forks_count": 10,
                    "watchers_count": 5,
                    "private": False,
                    "fork": False,
                    "archived": False,
                    "size": 1000
                },
                {
                    "name": "repo2",
                    "full_name": "testuser/repo2",
                    "language": "JavaScript",
                    "stargazers_count": 30,
                    "forks_count": 5,
                    "watchers_count": 3,
                    "private": False,
                    "fork": False,
                    "archived": False,
                    "size": 500
                },
                {
                    "name": "repo3",
                    "full_name": "testuser/repo3",
                    "language": "Python",
                    "stargazers_count": 20,
                    "forks_count": 3,
                    "watchers_count": 2,
                    "private": True,
                    "fork": True,
                    "archived": False,
                    "size": 300
                }
            ],
            "events": [{"type": "PushEvent"}] * 100
        }
    
    def test_generate_profile_basic(self, sample_data):
        """Test basic profile generation"""
        profile = generate_profile(sample_data, "testuser")
        
        assert profile["username"] == "testuser"
        assert profile["name"] == "Test User"
        assert profile["bio"] == "A test developer"
        assert profile["location"] == "Test City"
    
    def test_generate_profile_language_analysis(self, sample_data):
        """Test language analysis in profile"""
        profile = generate_profile(sample_data, "testuser")
        
        assert "Python" in profile["languages"]
        assert "JavaScript" in profile["languages"]
        assert len(profile["top_languages"]) >= 2
    
    def test_generate_profile_stats(self, sample_data):
        """Test stats calculation in profile"""
        profile = generate_profile(sample_data, "testuser")
        
        assert profile["total_repos"] == 3
        assert profile["public_repos"] == 2
        assert profile["forked_repos"] == 1
        assert profile["total_stars"] == 100
        assert profile["total_forks"] == 18
    
    def test_generate_profile_missing_fields(self):
        """Test profile generation with missing optional fields"""
        data = {
            "user": {
                "login": "testuser",
                "created_at": "2020-01-15T10:00:00Z"
            },
            "repos": [],
            "events": []
        }
        
        profile = generate_profile(data, "testuser")
        
        assert profile["name"] == "testuser"
        assert profile["bio"] == "No bio provided"
        assert profile["location"] == "Unknown"
        assert profile["company"] == "Independent"
    
    def test_generate_profile_community_signals(self, sample_data):
        """Test community signals in profile"""
        profile = generate_profile(sample_data, "testuser")
        
        assert profile["has_bio"] is True
        assert profile["has_location"] is True
        assert profile["has_website"] is True
        assert profile["is_verified"] is False
    
    def test_generate_profile_activity_tracking(self, sample_data):
        """Test activity tracking in profile"""
        profile = generate_profile(sample_data, "testuser")
        
        assert profile["followers"] == 100
        assert profile["following"] == 50
        assert profile["event_count"] == 100


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
