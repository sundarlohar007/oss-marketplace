# Deployment Guide

## Prerequisites

1. **GitHub OAuth App** - Create at https://github.com/settings/developers
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback`

2. **Railway Account** - Sign up at https://railway.app
3. **Vercel Account** - Sign up at https://vercel.com

## Environment Variables

Create a `.env` file:

```env
# API Configuration
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@host:5432/oss_marketplace
REDIS_URL=redis://host:6379

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

## Deploy to Railway (API)

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables from `.env`
5. Railway will auto-detect FastAPI and deploy

**Railway Configuration:**
- Build Command: `cd api && pip install -r requirements.txt`
- Start Command: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`

## Deploy to Vercel (Web)

1. Go to [Vercel](https://vercel.com)
2. Click "New Project" → "Import Git Repository"
3. Select your repo
4. Framework Preset: Next.js
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your-railway-api-url

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individually
docker build -t oss-marketplace-api ./api
docker build -t oss-marketplace-web ./web
```

## Local Development

```bash
# API
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Web (in another terminal)
cd web
npm install
npm run dev
```

## Verify Deployment

After deploying:

1. Visit your Vercel URL
2. Click "Login with GitHub"
3. Authorize the application
4. Create your profile
5. Test the matching functionality

## Troubleshooting

**API not starting?**
- Check Railway logs: `railway logs`
- Verify environment variables are set

**Web can't connect to API?**
- Verify `NEXT_PUBLIC_API_URL` points to Railway URL
- Check CORS settings in API config

**GitHub OAuth not working?**
- Verify callback URL matches GitHub App settings
- Check client ID and secret are correct
