"""Integration tests for full workflow - 10 tests"""
import pytest
import json
from unittest.mock import patch, MagicMock, Mock
import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from cli.oss_profile import generate_profile, analyze_languages, calculate_activity_level
from cli.oss_match import MatchingEngine, GitHubClient
from cli.oss_health import HealthAnalyzer


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
def complete_user_data():
    """Complete mock user data for integration testing"""
    return {
        "user": {
            "id": 12345,
            "login": "testuser",
            "name": "Test User",
            "bio": "Python developer passionate about OSS",
            "location": "San Francisco, CA",
            "company": "TechCorp",
            "blog": "https://testuser.dev",
            "twitter_username": "testuser",
            "followers": 500,
            "following": 100,
            "public_repos": 25,
            "public_gists": 10,
            "hireable": True,
            "created_at": "2018-06-15T10:00:00Z",
            "updated_at": "2024-01-15T00:00:00Z",
            "html_url": "https://github.com/testuser",
            "avatar_url": "https://github.com/testuser.png",
            "site_admin": False
        },
        "repos": [
            {
                "name": "python-project",
                "full_name": "testuser/python-project",
                "language": "Python",
                "stargazers_count": 150,
                "forks_count": 30,
                "watchers_count": 15,
                "private": False,
                "fork": False,
                "archived": False,
                "size": 5000
            },
            {
                "name": "web-app",
                "full_name": "testuser/web-app",
                "language": "JavaScript",
                "stargazers_count": 75,
                "forks_count": 20,
                "watchers_count": 10,
                "private": False,
                "fork": False,
                "archived": False,
                "size": 3000
            },
            {
                "name": "rust-tool",
                "full_name": "testuser/rust-tool",
                "language": "Rust",
                "stargazers_count": 50,
                "forks_count": 10,
                "watchers_count": 5,
                "private": False,
                "fork": False,
                "archived": False,
                "size": 2000
            }
        ],
        "events": [{"type": "PushEvent"}] * 150
    }


@pytest.fixture
def sample_project_data():
    """Sample project data for matching tests"""
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
        "updated_at": (datetime.utcnow() - timedelta(days=5)).isoformat() + "Z",
        "html_url": "https://github.com/facebook/react"
    }


class TestProfileGenerationFlow:
    """Test full profile generation flow - 3 tests"""
    
    def test_complete_profile_generation(self, complete_user_data):
        """Test generating a complete contributor profile"""
        profile = generate_profile(complete_user_data, "testuser")
        
        assert profile["username"] == "testuser"
        assert profile["name"] == "Test User"
        assert profile["bio"] == "Python developer passionate about OSS"
        assert len(profile["languages"]) >= 2
        assert profile["total_stars"] == 275
        assert "Python" in profile["top_languages"]
        assert "High" in profile["activity_level"]
    
    def test_profile_for_oss_contributor(self, complete_user_data):
        """Test profile indicates OSS contributor readiness"""
        profile = generate_profile(complete_user_data, "testuser")
        
        completeness = 0
        if profile["total_stars"] > 100:
            completeness += 20
        if profile["public_repos"] > 5:
            completeness += 20
        if profile["followers"] > 50:
            completeness += 20
        if profile["has_bio"] and profile["has_location"]:
            completeness += 20
        
        assert completeness >= 60
    
    def test_profile_language_diversity(self, complete_user_data):
        """Test profile shows language diversity"""
        profile = generate_profile(complete_user_data, "testuser")
        
        assert len(profile["languages"]) >= 2
        assert "Python" in profile["languages"]
        assert "JavaScript" in profile["languages"]


class TestMatchFindingFlow:
    """Test full match finding flow - 3 tests"""
    
    @patch('requests.get')
    def test_contributor_to_project_match(self, mock_get, sample_project_data):
        """Test matching contributor skills to project needs"""
        mock_get.return_value = MockResponse({
            "login": "testuser",
            "id": 123,
            "public_repos": 10,
            "followers": 50
        })
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        with patch.object(engine.github, 'get_repos', return_value=[
            {"language": "JavaScript", "private": False, "fork": False, "stargazers_count": 10}
        ]):
            with patch.object(engine.github, 'search_repos', return_value=[
                {
                    "full_name": "owner/repo",
                    "description": "JS project",
                    "stargazers_count": 1000,
                    "open_issues_count": 50,
                    "language": "JavaScript",
                    "owner": {"login": "owner"},
                    "html_url": "https://github.com/owner/repo"
                }
            ]):
                with patch.object(engine.github, 'get_repo', return_value=sample_project_data):
                    with patch.object(engine.github, 'get_issues', return_value=[]):
                        with patch.object(engine.github, 'get_repo_languages', return_value={"JavaScript": 50000}):
                            matches = engine.find_contributor_matches("testuser", limit=5)
                            
                            assert isinstance(matches, list)
    
    @patch('requests.get')
    def test_project_to_contributor_match(self, mock_get):
        """Test matching project needs to contributor skills"""
        mock_get.return_value = MockResponse({
            "full_name": "owner/repo",
            "description": "Python project",
            "stargazers_count": 1000,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        })
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        with patch.object(engine.github, 'get_repo_languages', return_value={"Python": 30000}):
            with patch.object(engine.github, 'get_issues', return_value=[]):
                with patch.object(engine.github, 'get_contributors', return_value=[]):
                    with patch.object(engine.github, 'search_repos', return_value=[
                        {
                            "full_name": "contributor/project",
                            "owner": {"login": "contributor"}
                        }
                    ]):
                        with patch.object(engine.github, 'get_user', return_value={
                            "login": "contributor",
                            "name": "Test Contributor",
                            "followers": 30,
                            "public_repos": 5,
                            "html_url": "https://github.com/contributor"
                        }):
                            with patch.object(engine.github, 'get_repos', return_value=[
                                {"language": "Python", "stargazers_count": 5}
                            ]):
                                matches = engine.find_maintainer_matches("owner", "repo", limit=5)
                                
                                assert isinstance(matches, list)
    
    def test_match_score_integration(self, sample_project_data):
        """Test match score calculation integrates with all components"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        contributor_langs = ["Python", "JavaScript", "TypeScript", "Go"]
        repo_langs = {"JavaScript": 50000, "HTML": 5000, "CSS": 10000}
        repo_metrics = {
            "stargazers_count": 10000,
            "open_issues_count": 100,
            "updated_at": sample_project_data["updated_at"]
        }
        
        result = engine.calculate_match_score(contributor_langs, repo_langs, repo_metrics)
        
        assert "score" in result
        assert "breakdown" in result
        assert len(result["breakdown"]) == 4
        assert "JavaScript" in result["matching_languages"]


class TestHealthAnalysisFlow:
    """Test full health analysis flow - 2 tests"""
    
    @patch('requests.get')
    def test_complete_health_analysis(self, mock_get):
        """Test complete health analysis workflow"""
        now = datetime.utcnow()
        
        mock_get.return_value = MockResponse({
            "id": 123,
            "name": "test-repo",
            "full_name": "owner/test-repo",
            "owner": {"login": "owner"},
            "description": "Active repository",
            "stargazers_count": 1000,
            "forks_count": 100,
            "watchers_count": 50,
            "open_issues_count": 30,
            "language": "Python",
            "has_issues": True,
            "has_projects": True,
            "has_wiki": True,
            "has_pages": True,
            "license": {"name": "MIT"},
            "default_branch": "main",
            "archived": False,
            "fork": False,
            "updated_at": (now - timedelta(days=5)).isoformat() + "Z",
            "html_url": "https://github.com/owner/test-repo"
        })
        
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[
            {"commit": {"author": {"date": (now - timedelta(days=d)).isoformat() + "Z"}}}
            for d in [1, 2, 3, 5, 10, 15]
        ]):
            health = analyzer.analyze_project("owner", "test-repo")
            
            assert health is not None
            assert "overall" in health
            assert "activity" in health
            assert "community" in health
            assert "maintenance" in health
    
    def test_health_score_affects_match_readiness(self):
        """Test health score affects project match readiness"""
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        healthy_repo = {
            "updated_at": (datetime.utcnow() - timedelta(days=5)).isoformat() + "Z",
            "stargazers_count": 10000,
            "forks_count": 1000
        }
        
        issues = [
            {"created_at": (datetime.utcnow() - timedelta(days=3)).isoformat() + "Z",
             "comments": 5, "state": "open", "labels": [{"name": "good first issue"}]}
        ] * 10
        
        health = engine.get_project_health(healthy_repo, issues)
        
        assert health["score"] > 50
        assert health["needs_help"] is True


class TestEndToEndWorkflows:
    """Test end-to-end workflows - 2 tests"""
    
    def test_profile_to_match_workflow(self, complete_user_data):
        """Test full workflow from profile to matches"""
        profile = generate_profile(complete_user_data, "testuser")
        
        assert profile["username"] == "testuser"
        assert len(profile["top_languages"]) > 0
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        score = engine.calculate_match_score(
            profile["top_languages"],
            {"Python": 10000, "JavaScript": 5000},
            {"stargazers_count": 1000, "open_issues_count": 50}
        )
        
        assert "score" in score
        assert score["score"] >= 0
    
    def test_multiple_language_contributor_matching(self, complete_user_data):
        """Test matching for contributors with multiple languages"""
        profile = generate_profile(complete_user_data, "testuser")
        
        client = GitHubClient()
        engine = MatchingEngine(client)
        
        python_match = engine.calculate_match_score(
            profile["top_languages"],
            {"Python": 50000, "JavaScript": 10000},
            {"stargazers_count": 5000, "open_issues_count": 30}
        )
        
        js_match = engine.calculate_match_score(
            profile["top_languages"],
            {"JavaScript": 50000, "TypeScript": 30000},
            {"stargazers_count": 10000, "open_issues_count": 100}
        )
        
        assert python_match["score"] > 0
        assert js_match["score"] > 0
        assert "Python" in python_match["matching_languages"]
        assert "JavaScript" in js_match["matching_languages"]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
