#!/bin/bash
set -e

echo "Installing OSS Marketplace CLI..."

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    PLATFORM="windows"
else
    PLATFORM="unknown"
fi

echo "Detected platform: $PLATFORM"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Python 3 not found. Please install Python 3.9+ from https://python.org"
    exit 1
fi

PYTHON_CMD="python3"

# Create virtual environment
echo "Creating virtual environment..."
$PYTHON_CMD -m venv ~/.oss-marketplace-venv

# Activate virtual environment
if [[ "$PLATFORM" == "windows" ]]; then
    VENV_BIN="~/.oss-marketplace-venv/Scripts"
    source "$VENV_BIN/activate"
else
    source ~/.oss-marketplace-venv/bin/activate
fi

# Install the package
echo "Installing OSS Marketplace..."
pip install --upgrade pip
pip install rich requests click

# Create symlinks or batch files
INSTALL_DIR="$HOME/.local/bin"
if [[ "$PLATFORM" == "windows" ]]; then
    INSTALL_DIR="$HOME/AppData/Local/Microsoft/WindowsApps"
fi

mkdir -p "$INSTALL_DIR"

# Download CLI scripts
CLI_DIR="$HOME/.oss-marketplace/cli"
mkdir -p "$CLI_DIR"

echo "Downloading CLI scripts..."
curl -fsSL "https://raw.githubusercontent.com/oss-marketplace/oss-marketplace/main/cli/oss_profile.py" -o "$CLI_DIR/oss_profile.py"
curl -fsSL "https://raw.githubusercontent.com/oss-marketplace/oss-marketplace/main/cli/oss_match.py" -o "$CLI_DIR/oss_match.py"
curl -fsSL "https://raw.githubusercontent.com/oss-marketplace/oss-marketplace/main/cli/oss_health.py" -o "$CLI_DIR/oss_health.py"

# Make executable
chmod +x "$CLI_DIR"/*.py

echo ""
echo "✅ Installation complete!"
echo ""
echo "Add to your PATH:"
echo "  export PATH=\"$CLI_DIR:\$PATH\""
echo ""
echo "Or run directly:"
echo "  python3 $CLI_DIR/oss_profile.py create --github your-username"
echo ""
echo "Add the PATH export to your ~/.bashrc or ~/.zshrc to make it permanent."
