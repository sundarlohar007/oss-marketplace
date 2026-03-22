"""Comprehensive unit tests for health analysis - 27 tests"""
import pytest
import json
from datetime import datetime, timedelta, timezone
from unittest.mock import patch, MagicMock, Mock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from oss_health import HealthAnalyzer, HealthDisplay, GitHubClient
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
def sample_repo_data():
    return {
        "id": 12345,
        "name": "test-repo",
        "full_name": "testuser/test-repo",
        "owner": {"login": "testuser"},
        "description": "A test repository for testing purposes",
        "stargazers_count": 1000,
        "forks_count": 100,
        "watchers_count": 50,
        "open_issues_count": 50,
        "language": "Python",
        "has_issues": True,
        "has_projects": True,
        "has_wiki": True,
        "has_pages": True,
        "license": {"name": "MIT"},
        "default_branch": "main",
        "archived": False,
        "fork": False,
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat() + "Z",
        "html_url": "https://github.com/testuser/test-repo"
    }


@pytest.fixture
def sample_issues():
    now = datetime.now(timezone.utc)
    return [
        {
            "id": i,
            "title": f"Issue {i}",
            "created_at": (now - timedelta(days=d)).isoformat() + "Z",
            "comments": c,
            "state": s,
            "closed_at": (now - timedelta(days=d-1)).isoformat() + "Z" if s == "closed" else None,
            "labels": [{"name": label}] if label else []
        }
        for i, d, c, s, label in [
            (1, 5, 3, "open", "bug"),
            (2, 10, 0, "open", None),
            (3, 15, 5, "closed", "enhancement"),
            (4, 100, 1, "open", None),
            (5, 200, 0, "open", "good first issue"),
            (6, 5, 2, "open", "good first issue"),
            (7, 30, 0, "open", "help wanted"),
            (8, 180, 0, "open", None),
            (9, 20, 4, "closed", "documentation"),
            (10, 50, 1, "closed", "bug"),
        ]
    ]


@pytest.fixture
def sample_commits():
    now = datetime.now(timezone.utc)
    return [
        {
            "commit": {
                "author": {
                    "date": (now - timedelta(days=d)).isoformat() + "Z"
                }
            }
        }
        for d in [1, 2, 3, 5, 10, 15, 20, 25, 30, 60, 90, 120]
    ]


@pytest.fixture
def sample_contributors():
    return [
        {"login": "user1", "contributions": 100},
        {"login": "user2", "contributions": 75},
        {"login": "user3", "contributions": 50},
        {"login": "user4", "contributions": 25},
        {"login": "user5", "contributions": 10},
    ]


class TestHealthAnalyzerActivity:
    """Test activity analysis - 5 tests"""
    
    def test_analyze_activity(self, sample_issues, sample_commits):
        """Test activity analysis"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        activity = analyzer._analyze_activity(sample_commits, sample_issues)
        
        assert "commit_frequency_score" in activity
        assert "commits_this_month" in activity
        assert "total_issues" in activity
        assert 0 <= activity["commit_frequency_score"] <= 100
    
    def test_analyze_activity_high_commits(self, sample_repo_data):
        """Test activity with many recent commits"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        now = datetime.now(timezone.utc)
        commits = [
            {"commit": {"author": {"date": (now - timedelta(days=d)).isoformat()}}}
            for d in range(1, 31)
        ]
        
        activity = analyzer._analyze_activity(commits, [])
        
        assert "commits_this_month" in activity
        assert "commit_frequency_score" in activity
    
    def test_analyze_activity_no_commits(self, sample_repo_data):
        """Test activity with no commits"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        activity = analyzer._analyze_activity([], [])
        
        assert activity["commits_this_month"] == 0
        assert activity["total_commits"] == 0
        assert activity["commit_frequency_score"] == 0
    
    def test_analyze_activity_issue_resolution(self, sample_issues):
        """Test issue resolution rate calculation"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        activity = analyzer._analyze_activity([], sample_issues)
        
        assert "issue_resolution_rate" in activity
        assert 0 <= activity["issue_resolution_rate"] <= 100
    
    def test_analyze_activity_status_labels(self):
        """Test activity status determination"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        now = datetime.now(timezone.utc)
        
        very_active_commits = [
            {"commit": {"author": {"date": (now - timedelta(days=d)).isoformat()}}}
            for d in range(1, 25)
        ]
        
        activity = analyzer._analyze_activity(very_active_commits, [])
        
        assert "activity_status" in activity
        
        low_activity_commits = [
            {"commit": {"author": {"date": (now - timedelta(days=d)).isoformat()}}}
            for d in range(50, 100)
        ]
        
        activity2 = analyzer._analyze_activity(low_activity_commits, [])
        
        assert "activity_status" in activity2


class TestHealthAnalyzerCommunity:
    """Test community analysis - 5 tests"""
    
    def test_analyze_community(self, sample_issues, sample_contributors):
        """Test community analysis"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        community = analyzer._analyze_community(sample_issues, sample_contributors)
        
        assert "total_contributors" in community
        assert "response_rate" in community
        assert "good_first_issues" in community
        assert 0 <= community["response_rate"] <= 100
    
    def test_analyze_community_good_first_issues(self, sample_issues):
        """Test detection of good first issues"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        community = analyzer._analyze_community(sample_issues, [])
        
        assert community["good_first_issues"] >= 1
    
    def test_analyze_community_newcomer_friendly(self):
        """Test newcomer friendly detection"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        now = datetime.now(timezone.utc)
        issues = [
            {
                "created_at": (now - timedelta(days=d)).isoformat(),
                "comments": 5,
                "state": "open",
                "labels": [{"name": "good first issue"}]
            }
            for d in [5, 10, 15, 20, 25]
        ]
        
        community = analyzer._analyze_community(issues, [])
        
        assert "newcomer_friendly" in community
        assert community["good_first_issues"] >= 1
    
    def test_analyze_community_not_newcomer_friendly(self):
        """Test project not newcomer friendly"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        now = datetime.now(timezone.utc)
        issues = [
            {
                "created_at": (now - timedelta(days=d)).isoformat() + "Z",
                "comments": 0,
                "state": "open",
                "labels": []
            }
            for d in [5, 10, 15, 20, 25]
        ]
        
        community = analyzer._analyze_community(issues, [])
        
        assert community["newcomer_friendly"] is False
        assert community["response_rate"] < 50
    
    def test_analyze_community_empty(self):
        """Test community analysis with no data"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        community = analyzer._analyze_community([], [])
        
        assert community["total_contributors"] == 0
        assert community["good_first_issues"] == 0


class TestHealthAnalyzerMaintenance:
    """Test maintenance analysis - 5 tests"""
    
    def test_analyze_maintenance(self, sample_repo_data, sample_issues):
        """Test maintenance analysis"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[]):
            maintenance = analyzer._analyze_maintenance(sample_repo_data, sample_issues)
        
        assert "days_since_update" in maintenance
        assert "stale_issues" in maintenance
        assert "stale_issue_percentage" in maintenance
    
    def test_analyze_maintenance_stale_issues(self, sample_issues):
        """Test stale issue detection"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        repo_data = {
            "owner": {"login": "test"},
            "name": "repo",
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
        }
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[]):
            maintenance = analyzer._analyze_maintenance(repo_data, sample_issues)
        
        assert "stale_issues" in maintenance
    
    def test_analyze_maintenance_very_stale_issues(self):
        """Test very stale issue detection (>180 days)"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        now = datetime.now(timezone.utc)
        issues = [
            {
                "created_at": (now - timedelta(days=200)).isoformat(),
                "state": "open",
                "labels": []
            }
        ]
        
        repo_data = {
            "owner": {"login": "test"},
            "name": "repo",
            "updated_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat()
        }
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[]):
            maintenance = analyzer._analyze_maintenance(repo_data, issues)
        
        assert "very_stale_issues" in maintenance
    
    def test_analyze_maintenance_recent_update(self, sample_repo_data):
        """Test maintenance with recent update"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        sample_repo_data["updated_at"] = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[]):
            maintenance = analyzer._analyze_maintenance(sample_repo_data, [])
        
        assert "last_updated_status" in maintenance
    
    def test_analyze_maintenance_no_open_issues(self, sample_repo_data):
        """Test maintenance with no open issues"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        with patch.object(analyzer.github, 'get_all_pages', return_value=[]):
            maintenance = analyzer._analyze_maintenance(sample_repo_data, [])
        
        assert maintenance["open_issues"] == 0
        assert maintenance["stale_issue_percentage"] == 0


class TestHealthAnalyzerDocumentation:
    """Test documentation analysis - 3 tests"""
    
    def test_analyze_documentation(self, sample_repo_data):
        """Test documentation analysis"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        docs = analyzer._analyze_documentation(sample_repo_data)
        
        assert "has_wiki" in docs
        assert "has_projects" in docs
        assert docs["has_description"] is True
        assert docs["description_length"] > 0
    
    def test_analyze_documentation_no_description(self):
        """Test documentation without description"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        repo = {
            "description": None,
            "has_wiki": False,
            "has_projects": False,
            "has_pages": False
        }
        
        docs = analyzer._analyze_documentation(repo)
        
        assert docs["has_description"] is False
        assert docs["description_length"] == 0
    
    def test_analyze_documentation_all_features(self):
        """Test documentation with all features enabled"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        repo = {
            "description": "A comprehensive test repository with all documentation features",
            "has_wiki": True,
            "has_projects": True,
            "has_pages": True
        }
        
        docs = analyzer._analyze_documentation(repo)
        
        assert docs["has_wiki"] is True
        assert docs["has_projects"] is True
        assert docs["has_pages"] is True


class TestHealthScoreCalculation:
    """Test overall health score calculation - 5 tests"""
    
    def test_calculate_overall_score(self):
        """Test overall health score calculation"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 80, "issue_resolution_rate": 70},
            "community": {"response_rate": 75},
            "maintenance": {"stale_issue_percentage": 20},
            "documentation": {"has_description": True}
        })
        
        assert "score" in overall
        assert "grade" in overall
        assert "status" in overall
        assert 0 <= overall["score"] <= 100
        assert overall["grade"] in ["A", "B", "C", "D"]
    
    def test_calculate_overall_score_grade_a(self):
        """Test Grade A score calculation"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 95},
            "community": {"response_rate": 90},
            "maintenance": {"stale_issue_percentage": 5},
            "documentation": {"has_description": True}
        })
        
        assert overall["score"] >= 80
        assert overall["grade"] == "A"
        assert overall["status"] == "Healthy"
    
    def test_calculate_overall_score_grade_d(self):
        """Test Grade D score calculation"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 20},
            "community": {"response_rate": 15},
            "maintenance": {"stale_issue_percentage": 80},
            "documentation": {"has_description": False}
        })
        
        assert overall["score"] < 40
        assert overall["grade"] == "D"
        assert overall["status"] == "At Risk"
    
    def test_calculate_overall_score_needs_attention(self):
        """Test needs attention status"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 50},
            "community": {"response_rate": 50},
            "maintenance": {"stale_issue_percentage": 40},
            "documentation": {"has_description": True}
        })
        
        assert 40 <= overall["score"] < 70
        assert overall["status"] == "Needs Attention"
    
    def test_calculate_overall_score_breakdown(self):
        """Test score breakdown in result"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 80},
            "community": {"response_rate": 70},
            "maintenance": {"stale_issue_percentage": 20},
            "documentation": {"has_description": True}
        })
        
        assert "breakdown" in overall
        assert "activity" in overall["breakdown"]
        assert "community" in overall["breakdown"]
        assert "maintenance" in overall["breakdown"]
        assert "documentation" in overall["breakdown"]


class TestHealthScoringEdgeCases:
    """Test health scoring edge cases - 4 tests"""
    
    def test_stale_project(self, sample_repo_data, sample_issues):
        """Test health score for stale project"""
        sample_repo_data["updated_at"] = (datetime.now(timezone.utc) - timedelta(days=200)).isoformat() + "Z"
        
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 10},
            "community": {"response_rate": 20},
            "maintenance": {"stale_issue_percentage": 80},
            "documentation": {"has_description": False}
        })
        
        assert overall["score"] < 50
        assert overall["grade"] in ["C", "D"]
    
    def test_active_project(self, sample_repo_data, sample_issues):
        """Test health score for very active project"""
        sample_repo_data["updated_at"] = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat() + "Z"
        
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 95},
            "community": {"response_rate": 90},
            "maintenance": {"stale_issue_percentage": 5},
            "documentation": {"has_description": True}
        })
        
        assert overall["score"] >= 70
        assert overall["grade"] in ["A", "B"]
    
    def test_empty_repository(self):
        """Test health for empty repository"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 0, "issue_resolution_rate": 0},
            "community": {"response_rate": 0},
            "maintenance": {"stale_issue_percentage": 0},
            "documentation": {"has_description": False}
        })
        
        assert "score" in overall
        assert "grade" in overall
    
    def test_mixed_health_metrics(self):
        """Test with mixed health metrics"""
        client = GitHubClient()
        analyzer = HealthAnalyzer(client)
        
        overall = analyzer._calculate_overall_score({
            "activity": {"commit_frequency_score": 90},
            "community": {"response_rate": 30},
            "maintenance": {"stale_issue_percentage": 60},
            "documentation": {"has_description": True}
        })
        
        assert 0 <= overall["score"] <= 100


class TestHealthDisplay:
    """Test health display functionality - 2 tests"""
    
    def test_display_with_health_data(self, sample_repo_data):
        """Test display with valid health data"""
        console = Console()
        display = HealthDisplay(console)
        
        health = {
            "project": "owner/repo",
            "url": "https://github.com/owner/repo",
            "activity": {
                "commit_frequency_score": 75,
                "commits_this_month": 20,
                "total_issues": 50,
                "issues_this_month": 10,
                "closed_this_month": 5,
                "issue_resolution_rate": 70,
                "activity_status": "Active"
            },
            "community": {
                "total_contributors": 15,
                "response_rate": 80,
                "good_first_issues": 3,
                "avg_comments_per_issue": 2.5,
                "newcomer_friendly": True
            },
            "maintenance": {
                "days_since_update": 5,
                "last_updated_status": "Recent",
                "open_issues": 20,
                "stale_issues": 3,
                "very_stale_issues": 1,
                "stale_issue_percentage": 15,
                "pr_merge_rate": 85,
                "total_releases": 10,
                "has_recent_release": True
            },
            "repo": {
                "stars": 1000,
                "forks": 100,
                "watchers": 50,
                "license": "MIT",
                "default_branch": "main",
                "is_fork": False,
                "is_archived": False
            },
            "documentation": {
                "has_wiki": True,
                "has_projects": True,
                "has_pages": False,
                "description_length": 50,
                "has_description": True
            },
            "overall": {
                "score": 75.5,
                "breakdown": {
                    "activity": 75,
                    "community": 80,
                    "maintenance": 85,
                    "documentation": 50
                },
                "grade": "B",
                "status": "Healthy"
            }
        }
        
        with patch.object(console, 'print') as mock_print:
            display.display(health)
            assert mock_print.called
    
    def test_display_empty_health(self):
        """Test display with no health data"""
        console = Console()
        display = HealthDisplay(console)
        
        with patch.object(console, 'print'):
            display.display(None)


class TestGitHubClient:
    """Test GitHub client - 2 tests"""
    
    @patch('requests.get')
    def test_get_all_pages(self, mock_get):
        """Test pagination with get_all_pages"""
        page1 = [{"id": 1}, {"id": 2}]
        page2 = [{"id": 3}]
        page3 = []
        
        mock_get.side_effect = [
            MockResponse(page1),
            MockResponse(page2),
            MockResponse(page3)
        ]
        
        client = GitHubClient()
        result = client.get_all_pages("test")
        
        assert len(result) >= 2
    
    @patch('requests.get')
    def test_get_with_404(self, mock_get):
        """Test 404 handling"""
        mock_get.return_value = MockResponse({}, status_code=404)
        
        client = GitHubClient()
        result = client.get("nonexistent")
        
        assert result is None


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
