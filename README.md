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

## 🚀 Quick Start (Complete Setup)

### Prerequisites

- Node.js 18+
- Python 3.11+ (for CLI tools)
- GitHub account
- Supabase account (free)

---

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   | Field | Value |
   |-------|-------|
   | **Application name** | OSS Marketplace |
   | **Homepage URL** | http://localhost:3000 |
   | **Authorization callback URL** | http://localhost:3000/api/auth/callback/github |
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**

---

### Step 2: Set Up Supabase

1. Go to: https://supabase.com/dashboard
2. Click **"New project"**
3. Fill in:
   | Field | Value |
   |-------|-------|
   | **Name** | oss-marketplace |
   | **Database Password** | Create a strong password |
   | **Region** | Closest to you |
4. Wait ~2 minutes for setup
5. Go to **"Project Settings"** → **"API"**
6. Copy **Project URL** and **anon public** key

---

### Step 3: Create Database Tables

1. In Supabase dashboard, go to **"SQL Editor"**
2. Copy and run this SQL:

```sql
-- Users table (synced from GitHub)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id INTEGER UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  name TEXT,
  bio TEXT,
  company TEXT,
  location TEXT,
  blog TEXT,
  twitter_username TEXT,
  public_repos INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  github_created_at TIMESTAMP,
  last_synced TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User preferences for matching
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferred_languages TEXT[],
  preferred_topics TEXT[],
  preferred_stars_min INTEGER DEFAULT 0,
  preferred_stars_max INTEGER,
  looking_for TEXT,
  availability TEXT,
  experience_level TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved/favorited projects
CREATE TABLE saved_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  match_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, repo_owner, repo_name)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own saved projects" ON saved_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage saved projects" ON saved_projects FOR ALL USING (auth.uid() = user_id);
```

---

### Step 4: Configure Environment Variables

Create `.env.local` in `web/` folder:

```env
# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret

# From Step 1
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# From Step 2
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### Step 5: Run the App

```bash
# Navigate to web folder
cd oss-marketplace/web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** and sign in with GitHub!

---

## ✨ Features

### 🌐 Web Dashboard
- **GitHub OAuth Login** — Sign in with your GitHub account
- **Premium Dark UI** — Beautiful zinc-950 dark theme with violet-cyan-emerald accents
- **Real-time GitHub Data** — View your repositories, activity, and stats
- **Project Discovery** — Search and explore GitHub repositories
- **Personalized Matches** — AI-powered project recommendations

### 📊 Dashboard Pages
| Page | Description |
|------|-------------|
| **Dashboard** | Overview with your GitHub stats, repos, and recent activity |
| **Explore** | Search GitHub projects with filters |
| **Matches** | Personalized project recommendations |
| **Projects** | Browse and manage your repositories |
| **Profile** | View your GitHub profile info |
| **Analytics** | Contribution activity and language stats |
| **Settings** | Preferences, notifications, privacy |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Auth | NextAuth.js + GitHub OAuth |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |

---

## 📁 Project Structure

```
oss-marketplace/
├── web/                    # Full-stack SaaS App
│   ├── app/
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   ├── api/           # API routes
│   │   ├── login/         # Login page
│   │   └── page.tsx       # Root redirect
│   ├── lib/
│   │   ├── auth/          # NextAuth config
│   │   ├── github/        # GitHub API client
│   │   └── supabase/      # Supabase client
│   └── components/        # React components
│
├── cli/                   # Python CLI Tools
├── api/                   # FastAPI Backend
└── docs/                  # Documentation
```

---

## 💚 Pricing

**100% Free, forever.** No tiers, no limits.

| Feature | Free |
|---------|------|
| Web Dashboard | ✅ Unlimited |
| GitHub OAuth | ✅ Free |
| Supabase Free Tier | ✅ 500MB DB |
| Vercel Hosting | ✅ Free |
| Project Matches | ✅ Unlimited |

---

## 🤝 Contributing

Contributions welcome!

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/oss-marketplace.git
cd oss-marketplace

# Create a feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
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
