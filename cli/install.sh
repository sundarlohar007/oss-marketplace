#!/bin/bash
set -e

echo "Installing OSS Marketplace CLI..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check for Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Python not found. Install Python 3.11+ from https://python.org"
    exit 1
fi

PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "Using Python: $($PYTHON_CMD --version)"

# Create virtual environment
echo "Creating virtual environment..."
$PYTHON_CMD -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies and package
echo "Installing dependencies..."
pip install --upgrade pip
pip install rich requests click

# Install the CLI tool
echo "Installing CLI..."
pip install -e .

echo ""
echo "✅ Installation complete!"
echo ""
echo "Run these commands:"
echo "  oss-profile create --github your-username"
echo "  oss-match find --contributor your-username"
echo "  oss-health analyze --repo owner/repo"
echo ""
echo "Make sure to activate the virtual environment:"
echo "  source .venv/bin/activate"
echo ""
echo "Or add this to your ~/.bashrc or ~/.zshrc:"
echo "  source $SCRIPT_DIR/.venv/bin/activate"
