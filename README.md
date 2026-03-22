# 🌍 OSS Maintenance Marketplace

> **Match. Connect. Build Together.**

![Stars](https://img.shields.io/github/stars/sundarlohar007/oss-marketplace?style=flat)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## The Problem

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Open Source Has a Matching Problem                                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  MAINTAINERS                           CONTRIBUTORS                      ║
║  ──────────────                        ────────────                      ║
║  • 847 issues, 0 help                  • "I want to contribute"         ║
║  • Burned out, doing it alone           • "Where do I even start?"       ║
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

## ✨ Features

### For Maintainers
- 🔍 **Contributor Discovery** — Find developers who match your project's exact needs
- 📊 **Project Health Dashboard** — Burnout detection, stale issue alerts, response metrics
- 🤖 **AI Issue Generator** — Auto-generate beginner-friendly issues from your codebase
- 💌 **Smart Outreach** — Personalized invitation messages to potential contributors
- 📈 **Contribution Pipeline** — Track contributors from first interest → first PR → regular

### For Contributors
- 🎯 **Perfect Match Finder** — Find projects that match your skills, interests, and schedule
- 🧬 **Contributor DNA** — AI-analyzed profile of your coding style, strengths, and preferences
- 🏆 **OSS Resume** — Build a verified contribution history that stands out
- 🎓 **Learning Paths** — Get matched to projects that help you grow
- 💼 **Portfolio Builder** — Turn contributions into a public showcase

## 🚀 Quick Start

### Install the CLI

```bash
# Clone the repository
git clone https://github.com/sundarlohar007/oss-marketplace.git
cd oss-marketplace

# Install CLI tool (macOS/Linux)
./cli/install.sh

# Install CLI tool (Windows PowerShell)
.\cli\install.ps1

# Or install via pip
pip install ./cli
```

### Find Your Perfect Match (30 seconds)

```bash
# 1. Generate your Contributor DNA
python cli/oss_profile.py create --github your-username

# 2. Discover matching projects for a contributor
python cli/oss_match.py find --contributor your-username

# 3. Analyze project health
python cli/oss_health.py --owner owner --repo repository
```

### Example Output

```
🎯 Found 5 Perfect Matches for you!

┌─────────────────────────────────────────────────────────────────┐
│ 1. facebook/react                                               │
│    📊 Health: 78%  🔥 Match: 94%  🐛 Good first issues: 12      │
│    💬 "Looking for: React hooks expertise, TypeScript"         │
│    ➜ github.com/facebook/react                                 │
├─────────────────────────────────────────────────────────────────┤
│ 2. vercel/next.js                                               │
│    📊 Health: 82%  🔥 Match: 91%  🐛 Good first issues: 8       │
│    💬 "Looking for: SSR experience, documentation help"         │
│    ➜ github.com/vercel/next.js                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture

```
oss-marketplace/
├── cli/                    # Command-line interface tool
│   ├── oss-profile/        # Contributor DNA generator
│   ├── oss-match/         # Matching engine CLI
│   └── oss-health/         # Project health checker
│
├── api/                    # Backend API (FastAPI)
│   ├── routes/
│   │   ├── profiles/       # Contributor profile endpoints
│   │   ├── projects/       # Project/matching endpoints
│   │   └── health/         # Health check endpoints
│   ├── services/
│   │   ├── matcher/        # Core matching algorithm
│   │   ├── analyzer/       # Code analysis service
│   │   └── scorer/         # Health scoring engine
│   └── models/             # Database models
│
├── web/                    # Dashboard (Next.js 15)
│   ├── app/
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # Main user dashboard
│   │   └── explore/        # Project/contributor discovery
│   └── components/
│
└── docs/                   # Documentation
    ├── api-reference/       # API documentation
    ├── guides/             # User guides
    └── contributing.md     # Dev contribution guide
```

## 📊 How Matching Works

```
Matching Score = (Skill × 30%) + (Interest × 25%) + (Activity × 25%) + (Culture × 20%)

Skill Match:
├── Language overlap (Python ↔ Python = high)
├── Framework experience (React ↔ React = high)
├── Code complexity level
└── Years of experience in domain

Interest Match:
├── README language analysis
├── Issue comment patterns
├── Project topic tags
└── Historical contribution patterns

Activity Match:
├── Weekly commit frequency
├── Response time
├── Timezone overlap
└── Availability windows

Culture Match:
├── Communication style (issues vs PRs)
├── Documentation quality
├── Code review participation
└── Community involvement signals
```

## 💚 Pricing

**100% Free, forever.** No tiers, no limits, no catch.

| Feature | Free |
|---------|------|
| Contributor Profile | ✅ Unlimited |
| Project Matches | ✅ Unlimited |
| AI Issue Generator | ✅ Unlimited |
| Health Dashboard | ✅ Full Access |
| API Access | ✅ Unlimited |
| Team Management | ✅ Free |
| Priority Support | ✅ Community |

## 🤔 Why This Exists

We got tired of seeing:
- Maintainers give up because they can't find help
- Good developers want to contribute but can't find where
- Perfect matches that never happen because nobody knew

This is our attempt to solve it — for free, forever.

## 🤝 Contributing

We're building this in the open. Contributions welcome!

```bash
# Clone the repo
git clone https://github.com/sundarlohar007/oss-marketplace.git

# Setup development environment
cd oss-marketplace
./scripts/setup.sh

# Run the CLI locally
cd cli && pip install -e .
oss-profile create --github octocat

# Run the API locally
cd ../api && pip install -r requirements.txt
uvicorn api.main:app --reload

# Run the web dashboard
cd ../web && npm install
npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

## 📢 Community

- 💬 [Discord Server](https://discord.gg/oss-marketplace)
- 🐦 [Twitter/X](https://twitter.com/oss_marketplace)
- 📝 [Dev.to Blog](https://dev.to/oss-marketplace)
- 🐛 [Issue Tracker](https://github.com/sundarlohar007/oss-marketplace/issues)

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ by developers, for developers</strong><br>
  <sub>No investors. No ads. Just connecting people who build things.</sub>
</p>
