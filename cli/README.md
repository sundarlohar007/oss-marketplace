# OSS Marketplace CLI

Command-line tools for matching open source maintainers with contributors.

## Installation

```bash
# Clone the repository
git clone https://github.com/sundarlohar007/oss-marketplace.git
cd oss-marketplace

# macOS / Linux
./cli/install.sh

# Windows (PowerShell)
.\cli\install.ps1

# Or install from source
cd cli
pip install -e .
```

## Commands

### oss-profile - Contributor Profile Generator

```bash
# Create a profile for any GitHub user
python oss_profile.py create --github octocat

# Save locally for offline access
python oss_profile.py create --github octocat --save
```

### oss-match - Match Finder

```bash
# Find projects matching a contributor
python oss_match.py find --contributor octocat

# Find contributors for a project
python oss_match.py find --maintainer facebook --repo react

# Increase result limit
python oss_match.py find --contributor octocat --limit 20
```

### oss-health - Project Health Checker

```bash
# Check a project's health
python oss_health.py --owner facebook --repo react

# Output as JSON
python oss_health.py --owner facebook --repo react --json
```

## Requirements

- Python 3.9+
- GitHub account (for higher API rate limits)

## Rate Limits

Without authentication: 60 requests/hour
With GitHub token: 5,000 requests/hour

Get a token at: https://github.com/settings/tokens

```bash
# Use with commands
python oss_match.py find --contributor octocat --token YOUR_TOKEN
```
