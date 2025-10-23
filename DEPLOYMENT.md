# Deployment Guide

## Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `parlay-tools-demo`
2. Make it public or private as needed
3. Don't initialize with README (we already have one)

### 2. Push Code to GitHub

```bash
# Add the correct remote URL (replace YOUR_USERNAME with your GitHub username)
git remote set-url origin https://github.com/YOUR_USERNAME/parlay-tools-demo.git

# Push the code
git push -u origin main
```

## Vercel Deployment

### 1. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `parlay-tools-demo` repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Environment Variables

In Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_API_BASE`: `https://parlay-tools-backend.onrender.com`

### 3. Deploy Backend to Render

1. Go to [Render](https://render.com)
2. Sign in with your GitHub account
3. Click "New Web Service"
4. Connect your `parlay-tools-demo` repository
5. Configure the service:
   - **Name**: `parlay-tools-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

## Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/parlay-tools-demo.git
cd parlay-tools-demo

# Start development environment
make dev
```

## Production URLs

- **Frontend**: https://parlay-demo.vercel.app
- **Backend**: https://parlay-tools-backend.onrender.com
- **API Docs**: https://parlay-tools-backend.onrender.com/docs

## Troubleshooting

### Backend Issues
- Ensure `render.yaml` is in the root directory
- Check that `requirements.txt` includes all dependencies
- Verify the start command in Render dashboard

### Frontend Issues
- Ensure `NEXT_PUBLIC_API_BASE` environment variable is set
- Check that API routes are properly configured
- Verify CORS settings in backend

### CORS Configuration
The backend is configured to allow:
- `http://localhost:3000` (local development)
- `https://parlay-demo.vercel.app` (production frontend)
