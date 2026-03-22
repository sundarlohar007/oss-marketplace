"""Comprehensive unit tests for matching functionality - 25 tests"""
import pytest
import json
from unittest.mock import patch, MagicMock, Mock, call
import sys
import os
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from oss_match import MatchingEngine, GitHubClient, MatchDisplay
from rich.console import Console


class MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
        self.text = json.dumps(json_data) if isinstance(json_data, dict) else str(json_data)
    
    def json(self):
        return self.json_data
    
    def raise_for_status(self):
        if self.status_code >= 400:
            raise Exception(f"HTTP {self.status_code}")


@pytest.fixture
def mock_contributor_data():
    return {
        "username": "testuser",
        "top_languages": ["Python", "JavaScript", "TypeScript"],
        "public_repos": 15,
        "followers": 100,
        "activity_level": "High"
    }


@pytest.fixture
def mock_project_data():
    return {
        "full_name": "facebook/react",
        "description": "A declarative, efficient, and flexible JavaScript library",
        "stargazers_count": 215000,
        "forks_count": 46000,
        "language": "JavaScript",
        "open_issues_count": 1200,
        "has_issues": True,
        "has_projects": True,
        "has_wiki": True,
        "license": {"name": "MIT License"},
        "default_branch": "main",
        "archived": False,
        "fork": False,
        "updated_at": "2024-01-15T10:00:00Z",
        "html_url": "https://github.com/facebook/react"
    }


class TestMatchingEngineScoreCalculation:
    """Test match score calculation - 6 tests"""
    
    def test_calculate_match_score_full_match(self):
        """Test match score with perfect language match"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        contributor_langs = ["Python", "JavaScript", "TypeScript"]
        repo_langs = {"JavaScript": 50000, "HTML": 5000, "CSS": 10000}
        
        result = engine.calculate_match_score(
            contributor_langs,
            repo_langs,
            {"stargazers_count": 10000, "open_issues_count": 100}
        )
        
        assert "score" in result
        assert 0 <= result["score"] <= 100
        assert "breakdown" in result
        assert len(result["matching_languages"]) >= 1
    
    def test_calculate_match_score_no_match(self):
        """Test match score with no language overlap"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        contributor_langs = ["Rust", "Go"]
        repo_langs = {"Python": 50000, "JavaScript": 30000}
        
        result = engine.calculate_match_score(
            contributor_langs,
            repo_langs,
            {"stargazers_count": 1000, "open_issues_count": 50}
        )
        
        assert result["score"] < 50
        assert len(result["matching_languages"]) == 0
    
    def test_calculate_match_score_partial_match(self):
        """Test match score with partial language overlap"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        contributor_langs = ["Python", "Go"]
        repo_langs = {"Python": 30000, "JavaScript": 30000}
        
        result = engine.calculate_match_score(
            contributor_langs,
            repo_langs,
            {"stargazers_count": 5000, "open_issues_count": 30}
        )
        
        assert 0 < result["score"] < 100
        assert len(result["matching_languages"]) == 1
        assert "Python" in result["matching_languages"]
    
    def test_calculate_match_score_empty_contributor_langs(self):
        """Test match score with empty contributor languages"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        result = engine.calculate_match_score(
            [],
            {"Python": 1000},
            {"stargazers_count": 100, "open_issues_count": 10}
        )
        
        assert result["score"] == 0
        assert "breakdown" in result
    
    def test_calculate_match_score_empty_repo_langs(self):
        """Test match score with empty repo languages"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        result = engine.calculate_match_score(
            ["Python", "JavaScript"],
            {},
            {"stargazers_count": 100, "open_issues_count": 10}
        )
        
        assert result["score"] == 0
        assert "breakdown" in result
    
    def test_calculate_match_score_high_activity(self):
        """Test match score with high issue count (needing help)"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        result = engine.calculate_match_score(
            ["Python"],
            {"Python": 10000},
            {"stargazers_count": 500, "open_issues_count": 100}
        )
        
        assert "breakdown" in result
        assert "need_level" in result["breakdown"]


class TestProjectHealth:
    """Test project health analysis - 5 tests"""
    
    def test_get_project_health_healthy(self):
        """Test health analysis for healthy project"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z",
            "stargazers_count": 10000,
            "forks_count": 1000
        }
        
        issues = [
            {"created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z", 
             "comments": 5, "state": "open", "labels": []},
            {"created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat() + "Z", 
             "comments": 3, "state": "closed", "labels": []}
        ] * 10
        
        health = engine.get_project_health(repo_data, issues)
        
        assert "score" in health
        assert health["score"] > 30
        assert health["active"] in [True, False]
    
    def test_get_project_health_stale(self):
        """Test health analysis for stale project"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=200)).isoformat() + "Z",
            "stargazers_count": 1000,
            "forks_count": 100
        }
        
        issues = [
            {"created_at": (datetime.now(timezone.utc) - timedelta(days=100)).isoformat() + "Z", 
             "comments": 0, "state": "open", "labels": []}
        ] * 5
        
        health = engine.get_project_health(repo_data, issues)
        
        assert health["score"] >= 0
        assert health["active"] is False
        assert health["days_since_update"] > 30
    
    def test_get_project_health_good_first_issues(self):
        """Test health with good first issues present"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat() + "Z",
            "stargazers_count": 5000,
            "forks_count": 500
        }
        
        issues = [
            {"created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z", 
             "comments": 2, "state": "open", "labels": [{"name": "good first issue"}]},
            {"created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat() + "Z", 
             "comments": 1, "state": "open", "labels": [{"name": "help wanted"}]}
        ]
        
        health = engine.get_project_health(repo_data, issues)
        
        assert health["good_first_issues"] >= 1
    
    def test_get_project_health_empty_issues(self):
        """Test health with no issues"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z",
            "stargazers_count": 1000,
            "forks_count": 100
        }
        
        health = engine.get_project_health(repo_data, [])
        
        assert health["total_issues"] == 0
        assert health["needs_help"] is False
    
    def test_get_project_health_response_rate(self):
        """Test response rate calculation"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z",
            "stargazers_count": 5000,
            "forks_count": 500
        }
        
        recent_time = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat() + "Z"
        issues = [
            {"created_at": recent_time, "comments": 5, "state": "open", "labels": []},
            {"created_at": recent_time, "comments": 3, "state": "open", "labels": []},
            {"created_at": recent_time, "comments": 0, "state": "open", "labels": []},
        ]
        
        health = engine.get_project_health(repo_data, issues)
        
        assert "response_rate" in health
        assert health["response_rate"] >= 50


class TestMatchFinding:
    """Test match finding functionality - 5 tests"""
    
    @patch('requests.get')
    def test_find_contributor_matches(self, mock_get):
        """Test finding project matches for a contributor"""
        mock_get.return_value = MockResponse({
            "login": "testuser",
            "id": 123,
            "public_repos": 10,
            "followers": 50
        })
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        with patch.object(client, 'get_repos', return_value=[]):
            with patch.object(client, 'search_repos', return_value=[]):
                matches = engine.find_contributor_matches("testuser", limit=5)
                
                assert isinstance(matches, list)
                assert len(matches) <= 5
    
    @patch('requests.get')
    def test_find_contributor_matches_not_found(self, mock_get):
        """Test finding matches for non-existent user"""
        mock_get.return_value = MockResponse({}, status_code=404)
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        matches = engine.find_contributor_matches("nonexistent_user_12345")
        
        assert matches == []
    
    @patch('requests.get')
    def test_find_contributor_matches_with_repos(self, mock_get):
        """Test finding matches with repositories"""
        mock_get.return_value = MockResponse({
            "login": "testuser",
            "id": 123,
            "public_repos": 3,
            "followers": 20
        })
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repos = [
            {"name": "repo1", "language": "Python", "private": False, "fork": False},
            {"name": "repo2", "language": "Python", "private": False, "fork": False},
            {"name": "repo3", "language": "Go", "private": False, "fork": False},
        ]
        
        with patch.object(client, 'get_repos', return_value=repos):
            with patch.object(client, 'search_repos', return_value=[]):
                matches = engine.find_contributor_matches("testuser", limit=3)
                
                assert isinstance(matches, list)
    
    @patch('requests.get')
    def test_find_maintainer_matches(self, mock_get):
        """Test finding contributors for a project"""
        mock_get.return_value = MockResponse({
            "full_name": "owner/repo",
            "description": "Test repo",
            "stargazers_count": 1000,
            "open_issues_count": 50,
            "updated_at": datetime.now(timezone.utc).isoformat() + "Z"
        })
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        with patch.object(engine.github, 'get_repo_languages', return_value={"Python": 1000}):
            with patch.object(engine.github, 'get_issues', return_value=[]):
                with patch.object(engine.github, 'get_contributors', return_value=[]):
                    with patch.object(engine.github, 'search_repos', return_value=[]):
                        matches = engine.find_maintainer_matches("owner", "repo", limit=5)
                        
                        assert isinstance(matches, list)
    
    @patch('requests.get')
    def test_find_maintainer_matches_not_found(self, mock_get):
        """Test finding contributors for non-existent repo"""
        mock_get.return_value = MockResponse({}, status_code=404)
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        matches = engine.find_maintainer_matches("nonexistent", "repo123")
        
        assert matches == []


class TestGitHubClient:
    """Test GitHub client - 4 tests"""
    
    @patch('requests.get')
    def test_get_user(self, mock_get):
        """Test getting user data"""
        mock_response = MockResponse({
            "login": "testuser",
            "id": 123,
            "name": "Test User"
        })
        mock_get.return_value = mock_response
        
        client = GitHubClient()
        user = client.get_user("testuser")
        
        assert user["login"] == "testuser"
        assert user["id"] == 123
    
    @patch('requests.get')
    def test_get_repos(self, mock_get):
        """Test getting user repositories"""
        mock_get.return_value = MockResponse([
            {"name": "repo1", "language": "Python"},
            {"name": "repo2", "language": "JavaScript"}
        ])
        
        client = GitHubClient()
        repos = client.get_repos("testuser")
        
        assert len(repos) == 2
    
    @patch('requests.get')
    def test_search_repos(self, mock_get):
        """Test repository search"""
        mock_response = MockResponse({
            "items": [
                {"full_name": "user/repo1", "language": "Python", "stargazers_count": 100},
                {"full_name": "user/repo2", "language": "Python", "stargazers_count": 50}
            ]
        })
        mock_get.return_value = mock_response
        
        client = GitHubClient()
        results = client.search_repos("language:python", sort="stars")
        
        assert len(results) == 2
    
    @patch('requests.get')
    def test_get_repo_languages(self, mock_get):
        """Test getting repository languages"""
        mock_response = MockResponse({
            "Python": 50000,
            "JavaScript": 20000,
            "HTML": 5000
        })
        mock_get.return_value = mock_response
        
        client = GitHubClient()
        languages = client.get_repo_languages("owner", "repo")
        
        assert "Python" in languages
        assert languages["Python"] == 50000


class TestMatchDisplay:
    """Test match display functionality - 3 tests"""
    
    def test_display_contributor_matches_empty(self):
        """Test display with no matches"""
        console = Console()
        display = MatchDisplay(console)
        
        with patch.object(console, 'print') as mock_print:
            display.display_contributor_matches([], "testuser")
            
            assert mock_print.called
    
    def test_display_contributor_matches_with_results(self):
        """Test display with matches found"""
        console = Console()
        display = MatchDisplay(console)
        
        matches = [
            {
                "full_name": "owner/repo1",
                "description": "Test repo",
                "stars": 100,
                "forks": 20,
                "issues_count": 10,
                "score": 85,
                "health_score": 75,
                "matching_languages": ["Python"],
                "good_first_issues": 2,
                "url": "https://github.com/owner/repo1"
            }
        ]
        
        with patch.object(console, 'print') as mock_print:
            display.display_contributor_matches(matches, "testuser")
            
            assert mock_print.called
    
    def test_display_maintainer_matches(self):
        """Test display for maintainer matches"""
        console = Console()
        display = MatchDisplay(console)
        
        matches = [
            {
                "username": "contributor1",
                "name": "Contributor One",
                "bio": "Test bio",
                "followers": 50,
                "public_repos": 10,
                "score": 80,
                "matching_languages": ["Python"],
                "url": "https://github.com/contributor1"
            }
        ]
        
        with patch.object(console, 'print') as mock_print:
            display.display_maintainer_matches(matches, "owner", "repo")
            
            assert mock_print.called


class TestEdgeCases:
    """Test edge cases and error handling - 2 tests"""
    
    def test_match_score_with_old_repo(self):
        """Test match score calculation for old repository"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        old_date = (datetime.now(timezone.utc) - timedelta(days=365)).isoformat() + "Z"
        
        result = engine.calculate_match_score(
            ["Python"],
            {"Python": 1000},
            {"stargazers_count": 100, "open_issues_count": 10, "updated_at": old_date}
        )
        
        assert "breakdown" in result
        assert "freshness" in result["breakdown"]
        assert result["breakdown"]["freshness"] < 20
    
    def test_health_with_very_old_issues(self):
        """Test health calculation with very old issues"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        repo_data = {
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=30)).isoformat() + "Z",
            "stargazers_count": 5000,
            "forks_count": 500
        }
        
        old_date = (datetime.now(timezone.utc) - timedelta(days=200)).isoformat() + "Z"
        issues = [
            {"created_at": old_date, "comments": 0, "state": "open", "labels": []}
        ] * 10
        
        health = engine.get_project_health(repo_data, issues)
        
        assert health["score"] >= 0
        assert health["total_issues"] == 10


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
