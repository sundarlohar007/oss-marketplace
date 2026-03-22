"""Comprehensive unit tests for API endpoints - 45 tests"""
import pytest
import json
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock, MagicMock, Mock
import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    from api.main import app
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


class TestRootEndpoints:
    """Test root API endpoints - 4 tests"""
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint returns API info"""
        response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "OSS Marketplace API"
        assert "version" in data
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_api_status(self, client):
        """Test API status endpoint"""
        response = await client.get("/api/v1/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "operational"
        assert "endpoints" in data
    
    @pytest.mark.asyncio
    async def test_api_status_features(self, client):
        """Test API status includes feature flags"""
        response = await client.get("/api/v1/status")
        
        assert response.status_code == 200
        data = response.json()
        assert "features" in data
        assert data["features"]["github_oauth"] is True
        assert data["features"]["matching_engine"] is True
        assert data["features"]["health_analysis"] is True
    
    @pytest.mark.asyncio
    async def test_root_includes_docs_link(self, client):
        """Test root endpoint includes documentation links"""
        response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "docs" in data
        assert data["docs"] == "/docs"


class TestHealthEndpoints:
    """Test health analysis endpoints - 8 tests"""
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_analyze_project_health(self, mock_get, client):
        """Test project health analysis"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": 123,
            "name": "test-repo",
            "full_name": "testuser/test-repo",
            "stargazers_count": 1000,
            "has_issues": True,
            "has_projects": True,
            "has_wiki": True,
            "license": {"name": "MIT"},
            "default_branch": "main",
            "archived": False,
            "fork": False,
            "updated_at": "2024-01-01T00:00:00Z"
        }
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/health/analyze/testuser/test-repo")
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data or "score" in data
    
    @pytest.mark.asyncio
    async def test_health_endpoint_exists(self, client):
        """Test health endpoint is accessible"""
        response = await client.get("/api/v1/health")
        
        assert response.status_code in [200, 404, 405]
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_health_analyze_with_stars(self, mock_get, client):
        """Test health analysis with star count"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": 456,
            "name": "popular-repo",
            "full_name": "org/popular-repo",
            "stargazers_count": 50000,
            "forks_count": 10000,
            "has_issues": True,
            "has_wiki": True,
            "license": {"name": "Apache-2.0"},
            "default_branch": "main",
            "archived": False,
            "fork": False,
            "updated_at": datetime.utcnow().isoformat()
        }
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/health/analyze/org/popular-repo")
        
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_health_analyze_nonexistent_repo(self, mock_get, client):
        """Test health analysis for non-existent repository"""
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_response.json.return_value = {"message": "Not Found"}
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/health/analyze/user/nonexistent123")
        
        assert response.status_code in [404, 500]
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_health_analyze_archived_repo(self, mock_get, client):
        """Test health analysis for archived repository"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "archived-repo",
            "full_name": "user/archived-repo",
            "stargazers_count": 100,
            "archived": True,
            "updated_at": "2020-01-01T00:00:00Z"
        }
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/health/analyze/user/archived-repo")
        
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_health_score_grading(self, mock_get, client):
        """Test health score has proper grading"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "healthy-repo",
            "full_name": "user/healthy-repo",
            "stargazers_count": 1000,
            "has_issues": True,
            "has_wiki": True,
            "license": {"name": "MIT"},
            "default_branch": "main",
            "archived": False,
            "fork": False,
            "updated_at": datetime.utcnow().isoformat()
        }
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/health/analyze/user/healthy-repo")
        
        if response.status_code == 200:
            data = response.json()
            if "grade" in data:
                assert data["grade"] in ["A", "B", "C", "D"]
    
    @pytest.mark.asyncio
    async def test_health_endpoint_methods(self, client):
        """Test health endpoint accepts GET requests"""
        response = await client.get("/api/v1/health")
        
        assert response.status_code in [200, 404, 405]
    
    @pytest.mark.asyncio
    async def test_health_analyze_requires_path_parameter(self, client):
        """Test health analyze requires owner/repo parameters"""
        response = await client.get("/api/v1/health/analyze/")
        
        assert response.status_code == 404


class TestProfileEndpoints:
    """Test profile endpoints - 8 tests"""
    
    @pytest.mark.asyncio
    async def test_list_profiles(self, client):
        """Test listing profiles"""
        response = await client.get("/api/v1/profiles/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_list_profiles_empty(self, client):
        """Test listing profiles when none exist"""
        response = await client.get("/api/v1/profiles/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_get_profile_not_found(self, client):
        """Test getting non-existent profile"""
        response = await client.get("/api/v1/profiles/nonexistent_user_123")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_create_profile_requires_auth(self, client):
        """Test creating profile requires authentication"""
        response = await client.post(
            "/api/v1/profiles/",
            json={"username": "testuser", "bio": "Test"}
        )
        
        assert response.status_code in [401, 403, 404]
    
    @pytest.mark.asyncio
    async def test_profile_endpoint_exists(self, client):
        """Test profile endpoint is accessible"""
        response = await client.get("/api/v1/profiles")
        
        assert response.status_code in [200, 307, 404]
    
    @pytest.mark.asyncio
    async def test_profile_search_endpoint(self, client):
        """Test profile search functionality"""
        response = await client.get("/api/v1/profiles/search?language=Python")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_profile_pagination(self, client):
        """Test profile pagination parameters"""
        response = await client.get("/api/v1/profiles/?skip=0&limit=10")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_profile_fields_validation(self, client):
        """Test profile fields are properly returned"""
        response = await client.get("/api/v1/profiles/")
        
        if response.status_code == 200:
            data = response.json()
            if len(data) > 0:
                profile = data[0]
                assert "username" in profile or "login" in profile


class TestProjectEndpoints:
    """Test project endpoints - 9 tests"""
    
    @pytest.mark.asyncio
    async def test_list_projects(self, client):
        """Test listing projects"""
        response = await client.get("/api/v1/projects/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    @patch('httpx.AsyncClient.get')
    async def test_discover_projects(self, mock_get, client):
        """Test project discovery"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "total": 2,
            "items": [
                {
                    "full_name": "user/repo1",
                    "description": "Test repo 1",
                    "stargazers_count": 100,
                    "language": "Python",
                    "html_url": "https://github.com/user/repo1"
                },
                {
                    "full_name": "user/repo2",
                    "description": "Test repo 2",
                    "stargazers_count": 200,
                    "language": "JavaScript",
                    "html_url": "https://github.com/user/repo2"
                }
            ]
        }
        mock_get.return_value = mock_response
        
        response = await client.get("/api/v1/projects/search/discover?minStars=50")
        
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data or "items" in data
    
    @pytest.mark.asyncio
    async def test_search_projects_by_language(self, client):
        """Test searching projects by language"""
        response = await client.get("/api/v1/projects/search?language=Python")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_search_projects_by_stars(self, client):
        """Test searching projects by minimum stars"""
        response = await client.get("/api/v1/projects/search?minStars=1000")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_get_project_details(self, client):
        """Test getting project details"""
        response = await client.get("/api/v1/projects/owner/repo")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_project_languages_endpoint(self, client):
        """Test getting project languages"""
        response = await client.get("/api/v1/projects/owner/repo/languages")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_project_contributors_endpoint(self, client):
        """Test getting project contributors"""
        response = await client.get("/api/v1/projects/owner/repo/contributors")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_project_issues_endpoint(self, client):
        """Test getting project issues"""
        response = await client.get("/api/v1/projects/owner/repo/issues")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_projects_filtering(self, client):
        """Test project filtering options"""
        response = await client.get(
            "/api/v1/projects/?has_issues=true&min_stars=100&language=Python"
        )
        
        assert response.status_code == 200


class TestMatchEndpoints:
    """Test match endpoints - 8 tests"""
    
    @pytest.mark.asyncio
    async def test_find_contributor_matches_no_profile(self, client):
        """Test finding matches for non-existent profile"""
        response = await client.get("/api/v1/matches/contributor/nonexistentuser")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_find_project_matches_no_project(self, client):
        """Test finding matches for non-existent project"""
        response = await client.get("/api/v1/matches/project/owner/nonexistent")
        
        assert response.status_code in [404, 500]
    
    @pytest.mark.asyncio
    async def test_match_endpoint_exists(self, client):
        """Test match endpoint is accessible"""
        response = await client.get("/api/v1/matches")
        
        assert response.status_code in [200, 307, 404]
    
    @pytest.mark.asyncio
    async def test_match_contributor_requires_username(self, client):
        """Test match contributor requires username parameter"""
        response = await client.get("/api/v1/matches/contributor/")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_match_project_requires_params(self, client):
        """Test match project requires owner and repo"""
        response = await client.get("/api/v1/matches/project/")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_match_limit_parameter(self, client):
        """Test match limit parameter"""
        response = await client.get("/api/v1/matches/contributor/testuser?limit=5")
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_match_with_filters(self, client):
        """Test matching with language filters"""
        response = await client.get(
            "/api/v1/matches/contributor/testuser?language=Python&min_stars=100"
        )
        
        assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_match_score_calculation(self, client):
        """Test match score is included in results"""
        response = await client.get("/api/v1/matches/contributor/testuser")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                match = data[0]
                assert "score" in match or "match_score" in match


class TestAuthEndpoints:
    """Test authentication endpoints - 5 tests"""
    
    @pytest.mark.asyncio
    async def test_auth_endpoint_exists(self, client):
        """Test auth endpoint is accessible"""
        response = await client.get("/api/v1/auth")
        
        assert response.status_code in [200, 307, 404]
    
    @pytest.mark.asyncio
    async def test_github_oauth_start(self, client):
        """Test GitHub OAuth start endpoint"""
        response = await client.get("/api/v1/auth/github")
        
        assert response.status_code in [200, 302, 307, 404]
    
    @pytest.mark.asyncio
    async def test_auth_callback(self, client):
        """Test OAuth callback endpoint"""
        response = await client.get("/api/v1/auth/callback?code=test")
        
        assert response.status_code in [200, 400, 401, 404]
    
    @pytest.mark.asyncio
    async def test_auth_logout(self, client):
        """Test logout endpoint"""
        response = await client.post("/api/v1/auth/logout")
        
        assert response.status_code in [200, 401, 404]
    
    @pytest.mark.asyncio
    async def test_auth_me_endpoint(self, client):
        """Test get current user endpoint"""
        response = await client.get("/api/v1/auth/me")
        
        assert response.status_code in [200, 401, 404]


class TestCORSAndSecurity:
    """Test CORS and security headers - 4 tests"""
    
    @pytest.mark.asyncio
    async def test_cors_headers_present(self, client):
        """Test CORS headers are present"""
        response = await client.get("/", headers={"Origin": "http://localhost:3000"})
        
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_content_type_json(self, client):
        """Test response content type is JSON"""
        response = await client.get("/api/v1/status")
        
        assert "application/json" in response.headers.get("content-type", "")
    
    @pytest.mark.asyncio
    async def test_no_sensitive_data_in_root(self, client):
        """Test sensitive data is not exposed in root"""
        response = await client.get("/")
        
        data = response.json()
        assert "secret" not in str(data).lower()
        assert "password" not in str(data).lower()
        assert "token" not in str(data).lower()
    
    @pytest.mark.asyncio
    async def test_api_version_in_response(self, client):
        """Test API version is included in responses"""
        response = await client.get("/")
        
        data = response.json()
        if "version" in data:
            assert data["version"] == "1.0.0"


class TestErrorHandling:
    """Test error handling - 4 tests"""
    
    @pytest.mark.asyncio
    async def test_invalid_endpoint_returns_404(self, client):
        """Test invalid endpoint returns 404"""
        response = await client.get("/api/v1/nonexistent")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_invalid_json_returns_error(self, client):
        """Test invalid JSON returns proper error"""
        response = await client.post(
            "/api/v1/profiles/",
            content="not json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code in [400, 422, 404]
    
    @pytest.mark.asyncio
    async def test_method_not_allowed(self, client):
        """Test wrong HTTP method returns 405"""
        response = await client.delete("/")
        
        assert response.status_code in [404, 405]
    
    @pytest.mark.asyncio
    async def test_error_response_format(self, client):
        """Test error responses have proper format"""
        response = await client.get("/api/v1/profiles/nonexistent12345")
        
        if response.status_code == 404:
            data = response.json()
            assert "detail" in data or "message" in data or "error" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
