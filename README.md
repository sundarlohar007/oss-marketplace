# 🌍 OSS Maintenance Marketplace

> **Match. Connect. Build Together.** The intelligent matchmaking platform for open source maintainers and contributors.

[![Stars](https://img.shields.io/github/stars/sundarlohar007/oss-marketplace?style=flat)](https://github.com/sundarlohar007/oss-marketplace/stargazers)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## The Problem

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Open Source Has a Matching Problem                                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  MAINTAINERS                           CONTRIBUTORS                      ║
║  ──────────────                        ────────────                      ║
║  • 847 issues, 0 help                  • "I want to contribute"         ║
║  • Burned out, doing it alone          • "Where do I even start?"       ║
║  • PRs that don't fit the project       • "My PR got closed, no feedback" ║
║  • No time to onboard newcomers         • "I don't know what they need"  ║
║                                                                          ║
║              ❌ Nobody knows how to find each other ❌                    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## The Solution

**OSS Marketplace** is the first intelligent matchmaking platform for open source. We connect the right maintainers with the right contributors — automatically.

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Maintainer      │         │  Our Matching    │         │  Contributor    │
│  (has a repo)   │ ──────▶ │  Engine          │ ◀────── │  (wants to help)│
│                 │         │                  │         │                 │
│  • Health score │         │  • Skill matching│         │  • Profile DNA  │
│  • Needs list   │         │  • Interest fit  │         │  • Availability │
│  • Burnout level│         │  • Activity level│         │  • Goals        │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## 🚀 Quick Start (3 Ways to Use)

### Option 1: Web Dashboard (Recommended for Beginners)

The easiest way to get started with a beautiful, pre-built UI.

```bash
# 1. Navigate to web folder
cd oss-marketplace/web

# 2. Install dependencies
npm install

# 3. Start the dashboard
npm run dev
```

Open **http://localhost:3000** in your browser.

> **That's it!** The dashboard is fully functional and shows sample data. No setup required.

### Option 2: CLI Tools (For Developers)

Command-line tools for power users and automation.

```bash
# From the root directory
cd oss-marketplace

# Find your GitHub profile matches
python -m cli.oss_match find --contributor your-username

# Generate your contributor DNA
python -m cli.oss_profile create --github your-username

# Analyze a project's health
python -m cli.oss_health check --owner owner --repo repository
```

### Option 3: API Server (For Developers)

Run the full API server locally.

```bash
cd oss-marketplace/api
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

API available at **http://localhost:8000**

---

## ✨ Features

### 🌐 Web Dashboard
- **Premium Dark UI** — Beautiful zinc-950 dark theme with violet-cyan-emerald accents
- **Real-time Stats** — View project metrics, activity feeds, and health scores
- **Easy Navigation** — Sidebar layout with 7 fully functional pages
- **Responsive Design** — Works on desktop and mobile

### 📊 CLI Tools
| Tool | Purpose |
|------|---------|
| `oss_match` | Find projects matching your skills and interests |
| `oss_profile` | Generate your contributor DNA profile |
| `oss_health` | Analyze any project's health and maintenance status |

### 🧠 Matching Engine
- **Skill Matching** — Match by programming languages, frameworks, tools
- **Interest Fit** — Based on README analysis and contribution patterns
- **Activity Level** — Weekly commit frequency, response times, timezone overlap
- **Culture Score** — Communication style, documentation quality, community involvement

---

## 📁 Project Structure

```
oss-marketplace/
├── web/                    # Next.js 14 Dashboard
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Dashboard home
│   │   ├── explore/       # Project discovery
│   │   ├── matches/       # Your matches
│   │   ├── projects/      # Your projects
│   │   ├── profile/       # User profile
│   │   ├── analytics/     # Activity insights
│   │   └── settings/      # Settings page
│   ├── components/        # Reusable components
│   │   ├── layout/        # Sidebar, Topbar
│   │   ├── dashboard/     # Stat cards, project cards
│   │   └── ui/            # Button, Badge components
│   └── lib/               # Utilities
│
├── cli/                    # Python CLI Tools
│   ├── oss_profile.py     # Contributor DNA generator
│   ├── oss_match.py       # Project matching
│   └── oss_health.py      # Project health analyzer
│
├── api/                    # FastAPI Backend
│   ├── routes/            # API endpoints
│   ├── services/           # Business logic
│   └── models/            # Database models
│
├── docs/                   # Documentation
├── tests/                  # Test suite
└── scripts/                # Helper scripts
```

---

## 🎨 Dashboard Preview

The web dashboard includes:

| Page | Description |
|------|-------------|
| **Dashboard** | Overview with stats, recent activity, and quick actions |
| **Explore** | Discover new projects and contributors |
| **Matches** | View your personalized project matches |
| **Projects** | Manage your contributed projects |
| **Profile** | View and edit your contributor profile |
| **Analytics** | Activity insights and contribution metrics |
| **Settings** | Theme, notifications, privacy, API keys |

---

## 💚 Pricing

**100% Free, forever.** No tiers, no limits, no catch.

| Feature | Free |
|---------|------|
| Web Dashboard | ✅ Unlimited |
| CLI Tools | ✅ Unlimited |
| Project Matches | ✅ Unlimited |
| API Access | ✅ Unlimited |
| Team Management | ✅ Free |
| Priority Support | ✅ Community |

---

## 🛠️ Troubleshooting

### Web Dashboard Issues

**Dependencies fail to install?**
```bash
cd oss-marketplace/web
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 is already in use?**
```bash
# Use a different port
npm run dev -- -p 3001
```

### CLI Tool Issues

**Python module not found?**
```bash
# Install CLI dependencies
pip install requests pygithub

# Or run from root directory
cd oss-marketplace
python -m cli.oss_match find --contributor your-username
```

**GitHub API rate limit?**
- Unauthenticated: 60 requests/hour
- With GitHub token: 5,000 requests/hour

Create a token at: https://github.com/settings/tokens

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/oss-marketplace.git
cd oss-marketplace

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git add .
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ by developers, for developers</strong><br>
  <sub>No investors. No ads. Just connecting people who build things.</sub>
</p>
