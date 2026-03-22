# Windows Setup Guide

This guide is specifically for **Windows users** running PowerShell or Command Prompt.

## Prerequisites

Before starting, ensure you have:

- **Python 3.11+** — Download from [python.org](https://www.python.org/downloads/)
- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/)
- **Git** — Download from [git-scm.com](https://git-scm.com/download/win)
- **PostgreSQL 15+** (optional, for API database)

> **Note:** Make sure to check "Add Python to PATH" during Python installation.

## Quick Setup

### Step 1: Clone the Repository

```powershell
git clone https://github.com/sundarlohar007/oss-marketplace.git
cd oss-marketplace
```

### Step 2: Setup CLI Tool

```powershell
cd cli
pip install -e .
```

**Test the CLI:**
```powershell
python oss_profile.py create --github octocat
```

### Step 3: Setup API (Optional)

Open a **new PowerShell window**, then:

```powershell
cd oss-marketplace/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will run at: http://localhost:8000

### Step 4: Setup Web Dashboard (Optional)

Open another **new PowerShell window**, then:

```powershell
cd oss-marketplace/web
npm install
npm run dev
```

The web app will run at: http://localhost:3000

## Troubleshooting

### "pip is not recognized"

Python is not in your PATH. Either:
1. Reinstall Python and check "Add to PATH"
2. Use `py` instead of `pip`: `py -m pip install -e .`

### "uvicorn is not recognized"

```powershell
pip install uvicorn
```

### "npm is not recognized"

Restart your computer after installing Node.js, or check the installation path.

### Python version check

```powershell
python --version
```

Should show Python 3.11 or higher.

### Node version check

```powershell
node --version
```

Should show v18 or higher.

## Common PowerShell Commands

| Task | PowerShell | Linux/macOS |
|------|------------|-------------|
| Chain commands | `;` | `&&` |
| List files | `dir` | `ls` |
| Change directory | `cd` | `cd` |
| Copy file | `copy` | `cp` |
| Delete file | `del` | `rm` |
| Create directory | `mkdir` | `mkdir` |
| Activate venv | `venv\Scripts\Activate` | `source venv/bin/activate` |

## VS Code Tip

If using VS Code, open the terminal with `Ctrl+`` and select **PowerShell** for a better experience with Unix-like commands.

## Need Help?

- Open an issue: https://github.com/sundarlohar007/oss-marketplace/issues
- Check the main README: [README.md](README.md)
