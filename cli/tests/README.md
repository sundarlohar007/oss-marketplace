# OSS Marketplace Test Suite

To run the tests, first install the dependencies:

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx pytest-cov

# Run CLI tests
cd cli
pytest tests/ -v

# Run API tests
cd ../api
pytest tests/ -v --cov=. --cov-report=html
```

## Test Coverage

### CLI Tests
- `test_profile.py` - Profile generation and analysis
- `test_match.py` - Matching algorithm tests
- `test_health.py` - Health scoring tests

### API Tests
- `test_api.py` - API endpoint tests

## Running All Tests

```bash
# From project root
pytest --ignore=node_modules -v
```
