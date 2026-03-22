"""Pytest configuration for OSS Marketplace tests"""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
    config.addinivalue_line(
        "markers", "api: marks tests as API tests"
    )
    config.addinivalue_line(
        "markers", "cli: marks tests as CLI tests"
    )


@pytest.fixture(scope="session")
def mock_github_api():
    """Mock GitHub API responses for testing"""
    return {
        "user": {
            "login": "testuser",
            "id": 12345,
            "name": "Test User",
            "bio": "Test developer",
            "followers": 100,
            "following": 50,
            "public_repos": 10
        },
        "repos": [
            {
                "name": "test-repo",
                "full_name": "testuser/test-repo",
                "language": "Python",
                "stargazers_count": 50,
                "forks_count": 10,
                "private": False,
                "fork": False,
                "archived": False
            }
        ]
    }


@pytest.fixture
def sample_profile_data():
    """Sample profile data for testing"""
    return {
        "username": "testuser",
        "name": "Test User",
        "bio": "Python developer",
        "location": "San Francisco",
        "company": "TechCorp",
        "languages": {"Python": 60.0, "JavaScript": 40.0},
        "top_languages": ["Python", "JavaScript"],
        "total_repos": 10,
        "public_repos": 8,
        "total_stars": 150,
        "total_forks": 30,
        "followers": 100,
        "following": 50,
        "activity_level": "High",
        "event_count": 100,
        "has_bio": True,
        "has_location": True,
        "has_website": True,
        "is_verified": False
    }


@pytest.fixture
def sample_match_data():
    """Sample match data for testing"""
    return {
        "score": 85.5,
        "breakdown": {
            "language_match": 40.0,
            "popularity": 15.0,
            "need_level": 15.0,
            "freshness": 15.5
        },
        "matching_languages": ["Python"],
        "full_name": "owner/repo",
        "description": "Test repository",
        "stars": 1000,
        "forks": 100,
        "issues_count": 50,
        "good_first_issues": 5,
        "health_score": 75,
        "url": "https://github.com/owner/repo"
    }


@pytest.fixture
def sample_health_data():
    """Sample health data for testing"""
    return {
        "project": "owner/repo",
        "url": "https://github.com/owner/repo",
        "overall": {
            "score": 75.5,
            "grade": "B",
            "status": "Healthy",
            "breakdown": {
                "activity": 80,
                "community": 75,
                "maintenance": 70,
                "documentation": 75
            }
        },
        "activity": {
            "commit_frequency_score": 80,
            "commits_this_month": 25,
            "total_issues": 50,
            "issue_resolution_rate": 70
        },
        "community": {
            "total_contributors": 15,
            "response_rate": 75,
            "good_first_issues": 3
        },
        "maintenance": {
            "days_since_update": 5,
            "open_issues": 20,
            "stale_issues": 2,
            "stale_issue_percentage": 10
        },
        "documentation": {
            "has_wiki": True,
            "has_projects": True,
            "has_description": True
        }
    }
