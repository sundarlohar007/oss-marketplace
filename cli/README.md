# OSS Marketplace CLI

Command-line tools for matching open source maintainers with contributors.

## Installation

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/oss-marketplace/oss-marketplace/main/cli/install.sh | bash

# Or use pip
pip install oss-marketplace

# Or install from source
git clone https://github.com/oss-marketplace/oss-marketplace.git
cd oss-marketplace/cli
pip install -e .
```

## Commands

### oss-profile - Contributor Profile Generator

```bash
# Create a profile for any GitHub user
oss-profile create --github octocat

# Save locally for offline access
oss-profile create --github octocat --save

# View saved profile
oss-profile view --user octocat

# List all saved profiles
oss-profile list
```

### oss-match - Match Finder

```bash
# Find projects matching a contributor
oss-match find --contributor octocat

# Find contributors for a project
oss-match find --maintainer facebook --repo react

# Increase result limit
oss-match find --contributor octocat --limit 20
```

### oss-health - Project Health Checker

```bash
# Check a project's health
oss-health check --owner facebook --repo react

# Or use shorthand
oss-health check facebook/react

# Output as JSON
oss-health check facebook/react --json
```

## Requirements

- Python 3.9+
- GitHub account (for higher API rate limits)

## Rate Limits

Without authentication: 60 requests/hour
With GitHub token: 5,000 requests/hour

Get a token at: https://github.com/settings/tokens

```bash
export GITHUB_TOKEN="your-token-here"
```
