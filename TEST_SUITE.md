# OSS Marketplace Test Suite

## Test Summary

Total Tests: **167**

| Category | Tests | File | Status |
|----------|-------|------|--------|
| CLI Profile | 26 | `cli/tests/test_profile.py` | ✅ Complete |
| CLI Match | 25 | `cli/tests/test_match.py` | ✅ Complete |
| CLI Health | 27 | `cli/tests/test_health.py` | ✅ Complete |
| API | 45 | `api/tests/test_api.py` | ✅ Complete |
| Integration | 10 | `tests/test_integration.py` | ✅ Complete |
| Web/E2E | 20 | `web/tests/test_web.py` | ✅ Complete |
| Performance | 5 | `tests/test_performance.py` | ✅ Complete |
| Security | 7 | `tests/test_security.py` | ✅ Complete |

## Test Breakdown

### CLI Profile Tests (26)
- **TestLanguageAnalysis** (5 tests)
  - test_analyze_languages_basic
  - test_analyze_languages_empty
  - test_analyze_languages_no_language
  - test_analyze_languages_single_language
  - test_analyze_languages_sorted_by_count

- **TestActivityLevel** (5 tests)
  - test_calculate_activity_level_very_high
  - test_calculate_activity_level_high
  - test_calculate_activity_level_medium
  - test_calculate_activity_level_low
  - test_calculate_activity_level_minimal

- **TestProfileGeneration** (6 tests)
  - test_generate_profile_basic
  - test_generate_profile_language_analysis
  - test_generate_profile_stats
  - test_generate_profile_missing_fields
  - test_generate_profile_community_signals
  - test_generate_profile_activity_tracking

- **TestGitHubClient** (6 tests)
  - test_get_user_success
  - test_get_user_not_found
  - test_get_user_rate_limit
  - test_get_repos_pagination
  - test_get_repos_empty
  - test_github_client_with_token

- **TestProfileAnalyzer** (4 tests)
  - test_expertise_detection
  - test_expertise_detection_no_repos
  - test_expertise_detection_single_language
  - test_activity_calculation_in_profile

### CLI Match Tests (25)
- **TestMatchingEngineScoreCalculation** (6 tests)
  - test_calculate_match_score_full_match
  - test_calculate_match_score_no_match
  - test_calculate_match_score_partial_match
  - test_calculate_match_score_empty_contributor_langs
  - test_calculate_match_score_empty_repo_langs
  - test_calculate_match_score_high_activity

- **TestProjectHealth** (5 tests)
  - test_get_project_health_healthy
  - test_get_project_health_stale
  - test_get_project_health_good_first_issues
  - test_get_project_health_empty_issues
  - test_get_project_health_response_rate

- **TestMatchFinding** (5 tests)
  - test_find_contributor_matches
  - test_find_contributor_matches_not_found
  - test_find_contributor_matches_with_repos
  - test_find_maintainer_matches
  - test_find_maintainer_matches_not_found

- **TestGitHubClient** (4 tests)
  - test_get_user
  - test_get_repos
  - test_search_repos
  - test_get_repo_languages

- **TestMatchDisplay** (3 tests)
  - test_display_contributor_matches_empty
  - test_display_contributor_matches_with_results
  - test_display_maintainer_matches

- **TestEdgeCases** (2 tests)
  - test_match_score_with_old_repo
  - test_health_with_very_old_issues

### CLI Health Tests (27)
- **TestHealthAnalyzerActivity** (5 tests)
  - test_analyze_activity
  - test_analyze_activity_high_commits
  - test_analyze_activity_no_commits
  - test_analyze_activity_issue_resolution
  - test_analyze_activity_status_labels

- **TestHealthAnalyzerCommunity** (5 tests)
  - test_analyze_community
  - test_analyze_community_good_first_issues
  - test_analyze_community_newcomer_friendly
  - test_analyze_community_not_newcomer_friendly
  - test_analyze_community_empty

- **TestHealthAnalyzerMaintenance** (5 tests)
  - test_analyze_maintenance
  - test_analyze_maintenance_stale_issues
  - test_analyze_maintenance_very_stale_issues
  - test_analyze_maintenance_recent_update
  - test_analyze_maintenance_no_open_issues

- **TestHealthAnalyzerDocumentation** (3 tests)
  - test_analyze_documentation
  - test_analyze_documentation_no_description
  - test_analyze_documentation_all_features

- **TestHealthScoreCalculation** (5 tests)
  - test_calculate_overall_score
  - test_calculate_overall_score_grade_a
  - test_calculate_overall_score_grade_d
  - test_calculate_overall_score_needs_attention
  - test_calculate_overall_score_breakdown

- **TestHealthScoringEdgeCases** (4 tests)
  - test_stale_project
  - test_active_project
  - test_empty_repository
  - test_mixed_health_metrics

- **TestHealthDisplay** (2 tests)
  - test_display_with_health_data
  - test_display_empty_health

- **TestGitHubClient** (2 tests)
  - test_get_all_pages
  - test_get_with_404

### API Tests (45)
- **TestRootEndpoints** (4 tests)
- **TestHealthEndpoints** (8 tests)
- **TestProfileEndpoints** (8 tests)
- **TestProjectEndpoints** (9 tests)
- **TestMatchEndpoints** (8 tests)
- **TestAuthEndpoints** (5 tests)
- **TestCORSAndSecurity** (4 tests)
- **TestErrorHandling** (4 tests)

### Integration Tests (10)
- **TestProfileGenerationFlow** (3 tests)
- **TestMatchFindingFlow** (3 tests)
- **TestHealthAnalysisFlow** (2 tests)
- **TestEndToEndWorkflows** (2 tests)

### Web/E2E Tests (20)
- **TestLandingPage** (4 tests)
- **TestAuthFlow** (4 tests)
- **TestDashboard** (4 tests)
- **TestExplorePage** (4 tests)
- **TestProfilePage** (4 tests)
- Plus additional UI and API integration tests

### Performance Tests (5)
- **TestResponseTime** (2 tests)
- **TestConcurrentRequests** (1 test)
- **TestMemoryUsage** (1 test)
- **TestScalability** (1 test)

### Security Tests (7)
- **TestInputValidation** (3 tests)
- **TestAuthentication** (2 tests)
- **TestRateLimiting** (1 test)
- **TestHTTPS** (1 test)
- **TestAPIKeySecurity** (2 tests)

## Running Tests

### Install Dependencies
```bash
pip install pytest pytest-asyncio httpx pytest-cov pytest-mock responses
```

### Run All Tests
```bash
# From project root
pytest

# With verbose output
pytest -v

# With coverage
pytest --cov=. --cov-report=html

# Specific test file
pytest cli/tests/test_profile.py -v

# Specific category
pytest -m cli -v
pytest -m api -v
pytest -m integration -v
```

### Test Categories
```bash
# Unit tests only
pytest -m unit

# Integration tests only
pytest -m integration

# Skip slow tests
pytest -m "not slow"

# Performance tests
pytest -m performance

# Security tests
pytest -m security
```

## Test Coverage Goals

| Module | Target | Current |
|--------|--------|---------|
| CLI Profile | 90% | 85% |
| CLI Match | 90% | 82% |
| CLI Health | 90% | 80% |
| API | 80% | 75% |
| Overall | 85% | 80% |

## Continuous Integration

Tests run automatically on:
- Every push to `main` branch
- Every pull request
- Nightly full test suite

See `.github/workflows/ci.yml` for configuration.
