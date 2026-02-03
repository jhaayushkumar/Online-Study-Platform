# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment.

## 📋 Available Workflows

### 1. **Frontend CI** (`frontend-ci.yml`)
- **Trigger**: Push/PR to `main` or `develop` with frontend changes
- **Actions**:
  - Install dependencies
  - Run linting (if available)
  - Build frontend
  - Upload build artifacts

### 2. **Backend CI** (`backend-ci.yml`)
- **Trigger**: Push/PR to `main` or `develop` with backend changes
- **Actions**:
  - Install dependencies
  - Run linting (if available)
  - Run tests (if available)
  - Check code syntax

### 3. **PR Checks** (`pr-checks.yml`)
- **Trigger**: Pull requests to `main` or `develop`
- **Actions**:
  - Validate PR title (conventional commits)
  - Check for merge conflicts
  - Count changed files
  - Generate PR summary

### 4. **Code Quality** (`code-quality.yml`)
- **Trigger**: Pull requests
- **Actions**:
  - Check for console.log statements
  - Find TODO/FIXME comments
  - Run security audit
  - Generate quality report

### 5. **Deploy Production** (`deploy-production.yml`)
- **Trigger**: Push to `main` or manual dispatch
- **Actions**:
  - Build and deploy frontend
  - Deploy backend
  - Send deployment notification

## 🔧 Setup Instructions

### Required GitHub Secrets

Add these secrets in your repository settings (`Settings > Secrets and variables > Actions`):

#### Frontend Secrets:
```
VITE_APP_BASE_URL=https://your-backend-url.com/api/v1
VITE_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### Deployment Secrets (Optional):
```
# For Vercel
VERCEL_TOKEN=xxxxx
VERCEL_ORG_ID=xxxxx
VERCEL_PROJECT_ID=xxxxx

# For Railway
RAILWAY_TOKEN=xxxxx
```

## 📝 PR Title Format

Follow conventional commits format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `perf: improve performance`
- `test: add tests`
- `chore: update dependencies`
- `ci: update CI/CD`

## 🚀 Manual Deployment

Trigger manual deployment:
1. Go to `Actions` tab
2. Select `Deploy to Production`
3. Click `Run workflow`
4. Select branch and run

## 📊 Workflow Status Badges

Add to your main README.md:

```markdown
![Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Frontend%20CI/badge.svg)
![Backend CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Backend%20CI/badge.svg)
![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/PR%20Checks/badge.svg)
```

## 🔍 Monitoring

- Check workflow runs in the `Actions` tab
- Review build artifacts in workflow summaries
- Monitor deployment status in hosting platform dashboards

## 💡 Tips

1. **Fast CI**: Workflows only run when relevant files change
2. **Parallel Jobs**: Frontend and backend CI run independently
3. **Caching**: npm dependencies are cached for faster builds
4. **Artifacts**: Build outputs are saved for 7 days
5. **Manual Override**: Use `workflow_dispatch` for manual runs
