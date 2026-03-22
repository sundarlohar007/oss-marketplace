# OSS Marketplace CLI Installation Script for Windows
# Run this script from the oss-marketplace directory

Write-Host "Installing OSS Marketplace CLI..." -ForegroundColor Green

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $SCRIPT_DIR) {
    $SCRIPT_DIR = Get-Location
}
Set-Location $SCRIPT_DIR

# Check Python
Write-Host "Checking Python installation..."
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion"
} catch {
    Write-Host "Python not found. Install Python 3.11+ from https://python.org" -ForegroundColor Red
    Write-Host "Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Yellow
    exit 1
}

# Create virtual environment
$VENV_DIR = "$SCRIPT_DIR\.venv"
Write-Host "Creating virtual environment..."
if (Test-Path $VENV_DIR) {
    Remove-Item -Recurse -Force $VENV_DIR
}
python -m venv $VENV_DIR

# Activate
& "$VENV_DIR\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..."
python -m pip install --upgrade pip
pip install rich requests click

# Install CLI
Write-Host "Installing CLI..."
pip install -e .

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Cyan
Write-Host "  oss-profile create --github your-username"
Write-Host "  oss-match find --contributor your-username"
Write-Host "  oss-health analyze --repo owner/repo"
Write-Host ""
Write-Host "Make sure to activate the virtual environment:" -ForegroundColor Yellow
Write-Host "  $VENV_DIR\Scripts\Activate.ps1"
Write-Host ""
