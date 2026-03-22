# 🚀 OSS Marketplace Roadmap

## 📍 Current Status: Phase 1 - Foundation

We're currently building the core CLI tool and API infrastructure.

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Current - March 2026)
**Goal:** Working CLI tool that anyone can run

- [x] Create repository structure
- [x] Write compelling README
- [x] Build `oss-profile create` command
- [ ] Add profile JSON export
- [ ] Add language analysis
- [ ] Add activity level detection
- [ ] Write CONTRIBUTING guide
- [ ] Create setup/install scripts

**Deliverable:** A CLI tool that takes 30 seconds to install and generates a contributor profile.

---

### Phase 2: Core Matching Engine (April 2026)
**Goal:** Basic project-to-contributor matching

- [ ] Build matching algorithm
  - [ ] Language overlap scoring
  - [ ] Activity level calculation
  - [ ] Interest signal detection
- [ ] Create database models (PostgreSQL)
- [ ] Build profile storage API
- [ ] Add GitHub OAuth login
- [ ] Build `oss-match find` command

**Deliverable:** Maintainers can find contributors by running `oss-match find --maintainer repo-name`

---

### Phase 3: Web Dashboard MVP (May 2026)
**Goal:** Visual dashboard for non-CLI users

- [ ] Next.js 15 setup with shadcn/ui
- [ ] GitHub OAuth authentication
- [ ] Contributor profile dashboard
- [ ] Maintainer project dashboard
- [ ] Basic search and filter
- [ ] Profile card display

**Deliverable:** A web app at oss.marketplace where users can sign in and see matches.

---

### Phase 4: Intelligence Layer (June 2026)
**Goal:** AI-powered features that actually work

- [ ] OpenAI integration
- [ ] AI-generated good-first-issues
- [ ] Contributor expertise analysis
- [ ] Project burnout detection
- [ ] Smart outreach message generator
- [ ] "Why we matched you" explanations

**Deliverable:** The "wow, this is actually smart" moment for users.

---

### Phase 5: Growth & Launch (July-August 2026)
**Goal:** Get 1,000 users and first paying customers

- [ ] Launch on:
  - [ ] Product Hunt
  - [ ] Hacker News
  - [ ] r/programming
  - [ ] Dev.to
  - [ ] Twitter/X
- [ ] Create demo videos
- [ ] Write launch blog post
- [ ] Build landing page
- [ ] Start Discord community
- [ ] First 100 paying users

**Deliverable:** 5,000 GitHub stars and first $1,000/month revenue.

---

### Phase 6: Scale & Monetization (September-December 2026)
**Goal:** Sustainable revenue

- [ ] Implement pricing tiers
- [ ] Build jobs board
- [ ] Add team features (Enterprise)
- [ ] Partner with:
  - [ ] GitHub
  - [ ] Vercel
  - [ ] Major OSS foundations
- [ ] Sponsored project listings
- [ ] 1,000 paying customers

**Deliverable:** $10,000/month recurring revenue.

---

## 🔮 Future Ideas (Post-MVP)

These are stretch goals for after we hit $10K/month:

- **🌍 Global OSS Summit** - Annual conference for matched pairs
- **🎓 OSS Academy** - Structured learning paths matched to projects
- **💼 Corporate Matching** - Companies sponsor developers to maintain critical OSS
- **📊 OSS Health Index** - Industry report on open source sustainability
- **🤝 Mentorship Pipeline** - Match junior devs with senior maintainers
- **🏆 Hall of Fame** - Celebrate successful maintainer-contributor pairs

---

## 🐛 Known Issues

- GitHub API rate limits (60 requests/hour for unauthenticated)
- CLI needs better error handling
- No database persistence yet
- Matching algorithm is basic (v1)

---

## 💡 Feature Requests

Have an idea? Open an issue with the label `feature-request`!

---

## 📊 Metrics

| Metric | Current | Goal |
|--------|---------|------|
| GitHub Stars | 0 | 5,000 |
| CLI Downloads | 0 | 10,000 |
| Web Users | 0 | 1,000 |
| Paying Customers | 0 | 100 |
| Monthly Revenue | $0 | $10,000 |

---

*Last updated: March 2026*
