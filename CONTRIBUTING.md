# Contributing to OSS Marketplace

We love your input! We want to make contributing as easy and transparent as possible.

## 🎯 How Can I Contribute?

### Types of Contributions We're Looking For

1. **🐛 Bug Reports** - Found a bug? Open an issue with a clear reproduction
2. **💡 Feature Requests** - Have an idea? Tell us how it would help you
3. **📝 Documentation** - Improve docs, add examples, fix typos
4. **💻 Code Contributions** - Pick up a "good first issue" and start coding
5. **🎨 Design** - UI/UX improvements, logo ideas, color schemes
6. **📣 Community** - Answer questions, welcome new members, share the project

## 🚀 Development Process

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

### Setup Development Environment

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/oss-marketplace.git
cd oss-marketplace

# 2. Setup CLI development
cd cli
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .

# 3. Setup API development
cd ../api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Setup Web development
cd ../web
npm install
```

### Running Locally

```bash
# CLI (from cli/ directory)
oss-profile create --github octocat

# API (from api/ directory)
uvicorn api.main:app --reload --port 8000

# Web (from web/ directory)
npm run dev
```

## 🔀 branches

- `main` - Stable, production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches
- `fix/*` - Bug fix branches
- `docs/*` - Documentation only branches

## 📋 Pull Request Process

### 1. Create a branch

```bash
# For features
git checkout -b feature/amazing-feature

# For bug fixes
git checkout -b fix/that-annoying-bug

# For docs
git checkout -b docs/improve-readme
```

### 2. Make your changes

- Write code that follows existing style
- Add comments for complex logic
- Keep functions small and focused
- Test your changes locally first

### 3. Commit with clear messages

```
feat(cli): add GitHub OAuth login support

- Added GitHub OAuth flow to oss-profile
- Token storage in secure keyring
- Session management with expiry

Closes #123
```

**Commit types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### 4. Push and create PR

```bash
git push origin feature/amazing-feature
```

Then open a Pull Request with:
- Clear title explaining what/why
- Description of changes
- Screenshots if UI changes
- "Closes #issue-number" if applicable

### 5. Review Process

- Maintainers review within 48 hours
- Address feedback by pushing new commits
- Don't force push during review
- Once approved, we'll merge!

## 📏 Coding Standards

### Python (CLI & API)

```python
# Use type hints everywhere
def calculate_match_score(
    contributor: Contributor,
    project: Project,
    weights: MatchWeights
) -> float:
    """Calculate match percentage between contributor and project."""
    skill_score = calculate_skill_match(contributor, project)
    interest_score = calculate_interest_match(contributor, project)
    
    return (
        skill_score * weights.skill +
        interest_score * weights.interest
    )

# Use dataclasses for data structures
@dataclass
class MatchResult:
    contributor_id: str
    project_id: str
    score: float
    breakdown: dict[str, float]
```

### JavaScript/TypeScript (Web)

```typescript
// Always use TypeScript for new code
interface MatchCardProps {
  project: Project
  matchScore: number
  onConnect: () => void
}

export function MatchCard({ project, matchScore, onConnect }: MatchCardProps) {
  return (
    <div className="match-card">
      <h3>{project.name}</h3>
      <p>Match: {matchScore}%</p>
      <Button onClick={onConnect}>Connect</Button>
    </div>
  )
}
```

## 🧪 Testing

### Run all tests

```bash
# CLI & API
cd api
pytest tests/ -v

# Web
cd web
npm run test
```

### Write tests for new features

```python
# tests/test_matcher.py
def test_skill_match_same_language():
    contributor = Contributor(
        languages=["python", "javascript"],
        frameworks=["react", "fastapi"]
    )
    project = Project(
        needed_languages=["python"],
        needed_frameworks=["fastapi"]
    )
    
    score = calculate_skill_match(contributor, project)
    assert score > 0.8  # Should be high match
```

## 🐛 Reporting Bugs

Open an issue with this template:

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What you expected to happen]

## Screenshots
[If applicable, screenshots]

## Environment
 - OS: [e.g., macOS, Windows, Linux]
 - Version: [e.g., 0.1.0]
 - Python/Node version: [versions]

## Additional Context
[Any other context about the problem]
```

## 💡 Suggesting Features

Open an issue with this template:

```markdown
## Problem Statement
[Problem this feature would solve]

## Proposed Solution
[How you envision solving it]

## Use Cases
1. [Use case 1]
2. [Use case 2]

## Alternatives Considered
[Any alternatives you've thought about]

## Additional Context
[Screenshots, mockups, or examples]
```

## 🏷️ Good First Issues

Looking for somewhere to start? Check these labels:

- `good first issue` - Easy bugs/features for newcomers
- `help wanted` - We'd love your help on these
- `documentation` - Improve our docs
- `frontend` - UI/UX work
- `backend` - API/logic work

## 📜 Code of Conduct

By participating, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward other community members

## 🙏 Thank You

Every contribution matters. Thank you for making OSS Marketplace better!

---

<p align="center">
  Made with ❤️ by contributors like you
</p>
