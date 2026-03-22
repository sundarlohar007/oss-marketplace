#!/bin/bash
set -e

echo "🚀 Setting up OSS Marketplace development environment..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting."; exit 1; }

echo "✓ Prerequisites check passed"

# Setup CLI
echo "📦 Setting up CLI..."
cd cli
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup API
echo "📦 Setting up API..."
cd api
python3 -m venv venv_api
source venv_api/bin/activate
pip install -r requirements.txt
cd ..

# Setup Web
echo "📦 Setting up Web Dashboard..."
cd web
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo ""
echo "  CLI:    cd cli && source venv/bin/activate && python oss_profile.py create --github your-username"
echo "  API:    cd api && source venv_api/bin/activate && uvicorn api.main:app --reload"
echo "  Web:    cd web && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
