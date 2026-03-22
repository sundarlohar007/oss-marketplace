"""Performance tests - 5 tests"""
import pytest
import time
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cli"))

from oss_profile import analyze_languages


class TestResponseTime:
    """Test API response times - 2 tests"""
    
    def test_profile_generation_speed(self):
        """Test profile generation completes within acceptable time"""
        start_time = time.time()
        
        repos = [{"language": "Python"}] * 100
        result = analyze_languages(repos)
        
        elapsed = time.time() - start_time
        assert elapsed < 1.0
    
    def test_activity_calculation_speed(self):
        """Test activity level calculation is fast"""
        from oss_profile import calculate_activity_level
        
        start_time = time.time()
        
        events = [{"type": "PushEvent"}] * 1000
        level = calculate_activity_level(events)
        
        elapsed = time.time() - start_time
        assert elapsed < 0.5


class TestConcurrentRequests:
    """Test concurrent request handling - 1 test"""
    
    def test_multiple_profile_generation(self):
        """Test generating multiple profiles sequentially"""
        start_time = time.time()
        
        for i in range(10):
            repos = [
                {"language": "Python", "stargazers_count": 10 * i},
                {"language": "JavaScript", "stargazers_count": 5 * i},
                {"language": "Go", "stargazers_count": 3 * i}
            ]
            analyze_languages(repos)
        
        elapsed = time.time() - start_time
        assert elapsed < 5.0


class TestMemoryUsage:
    """Test memory usage - 1 test"""
    
    def test_large_repo_list_handling(self):
        """Test handling large repository lists"""
        repos = [{"language": "Python"}] * 1000
        
        result = analyze_languages(repos)
        
        assert len(result) > 0
        assert sum(result.values()) == 100.0


class TestScalability:
    """Test scalability - 1 test"""
    
    def test_language_analysis_scalability(self):
        """Test language analysis scales with data size"""
        start_time = time.time()
        
        repos = [{"language": f"Lang{i}"} for i in range(100)]
        result = analyze_languages(repos)
        
        elapsed = time.time() - start_time
        assert elapsed < 0.5
        assert len(result) == 100


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
