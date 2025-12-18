# 🚀 Free Hosting on Render.com - Deployment Guide

This guide will help you deploy your ClickUp Sync M&E System to Render.com completely **FREE** with automatic database migrations and continuous deployment from GitHub.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free, no credit card needed)
3. **ClickUp API Token** - Get it from [ClickUp Settings](https://app.clickup.com/settings/apps)

---

## 🎯 Deployment Options

### Option 1: One-Click Deploy (Recommended)

Click the button below to deploy automatically:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=YOUR_GITHUB_REPO_URL)

### Option 2: Manual Deployment (Detailed Steps Below)

---

## 📦 What Gets Deployed

- **Frontend** (React + Vite) → Static Site
- **Backend** (Node.js + Express) → Web Service
- **Database** (MySQL) → Database Service
- **Auto Migrations** → Runs on every deployment

---

## 🔧 Manual Deployment Steps

### Step 1: Fork/Clone Repository

Make sure your code is in a GitHub repository.

### Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your repositories

### Step 3: Deploy Using Blueprint (render.yaml)

Our repository includes a `render.yaml` blueprint file that automatically configures everything!

1. In Render Dashboard, click **"New +"** → **"Blueprint"**
2. Select your repository from the list
3. Render will detect the `render.yaml` file
4. Review the services that will be created:
   - `clickup-sync-backend` (Backend API)
   - `clickup-sync-frontend` (React Frontend)
   - `clickup-mysql` (MySQL Database)

### Step 4: Configure Environment Variables

Render will prompt you to set these optional environment variables:

#### Backend Environment Variables

Most are auto-configured, but you should set:

- **`CLICKUP_API_TOKEN`** (Required) - Your ClickUp API token
  - Get it from: https://app.clickup.com/settings/apps
  - Click "Generate" for a personal token

The following are **automatically generated** by Render:
- `JWT_SECRET` - Auto-generated secure token
- `ENCRYPTION_KEY` - Auto-generated encryption key
- `DATABASE_URL` - Auto-connected to MySQL database
- All `DB_*` variables (host, user, password, etc.)

#### Frontend Environment Variables

- **`VITE_API_URL`** - Automatically set to your backend URL

### Step 5: Deploy! 🎉

1. Click **"Apply"** or **"Create Blueprint"**
2. Render will:
   - Create all services
   - Install dependencies
   - Run database initialization with latest schema (`me_clickup_system_2025_dec_16.sql`)
   - Apply all migrations from `/database/migrations/`
   - Start the services

Initial deployment takes **5-10 minutes**.

### Step 6: Access Your Application

Once deployed, Render provides URLs for your services:

- **Frontend**: `https://clickup-sync-frontend.onrender.com`
- **Backend API**: `https://clickup-sync-backend.onrender.com`

---

## 🗄️ Database Management

### Automatic Migrations

The deployment system automatically:

1. **Initializes Database** - Uses latest schema: `database/me_clickup_system_2025_dec_16.sql`
2. **Runs Migrations** - Applies all SQL files from `database/migrations/` in alphabetical order
3. **Tracks Applied Migrations** - Creates `_migrations` table to prevent re-running

### Adding New Migrations

1. Create a new SQL file in `database/migrations/`
2. Name it with a number prefix (e.g., `017_add_new_feature.sql`)
3. Commit and push to GitHub
4. Render auto-deploys and runs the new migration

Example migration file:

```sql
-- 017_add_new_feature.sql
ALTER TABLE activities ADD COLUMN new_field VARCHAR(255);

-- Track in migrations table
-- (automatically handled by init-db-render.js)
```

### Manual Database Access

To connect to your database manually:

1. In Render Dashboard → Select your database service
2. Copy the **External Database URL**
3. Use MySQL Workbench or command line:

```bash
mysql -h <host> -P <port> -u <user> -p<password> me_clickup_system
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Every time you push to your GitHub repository:

1. **Render detects the push** (via GitHub webhook)
2. **Rebuilds affected services** (frontend/backend)
3. **Runs database migrations** (if any new ones)
4. **Deploys the new version** (zero-downtime)

### Manual Deployment

You can also trigger deployments manually:

1. Go to Render Dashboard
2. Select a service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ⚙️ Environment Variables Reference

### Backend Variables

| Variable | Description | Auto-Set? |
|----------|-------------|-----------|
| `NODE_ENV` | Environment (production) | ✅ Yes |
| `PORT` | Server port (3000) | ✅ Yes |
| `DB_HOST` | Database host | ✅ Yes |
| `DB_USER` | Database user | ✅ Yes |
| `DB_PASSWORD` | Database password | ✅ Yes |
| `DB_NAME` | Database name | ✅ Yes |
| `DB_PORT` | Database port (3306) | ✅ Yes |
| `DATABASE_URL` | Full connection string | ✅ Yes |
| `JWT_SECRET` | JWT signing key | ✅ Generated |
| `ENCRYPTION_KEY` | Encryption key | ✅ Generated |
| `CLICKUP_API_TOKEN` | ClickUp API token | ❌ **You must set** |
| `ALLOWED_ORIGINS` | CORS allowed origins | ✅ Yes |

### Frontend Variables

| Variable | Description | Auto-Set? |
|----------|-------------|-----------|
| `VITE_API_URL` | Backend API URL | ✅ Yes |

---

## 🆓 Free Tier Limits

Render's free tier includes:

- ✅ **750 hours/month** per service (enough for 24/7 uptime)
- ✅ **Free PostgreSQL database** (alternatives below)
- ✅ **Automatic SSL certificates** (HTTPS)
- ✅ **Auto-deploy from GitHub**
- ⚠️ **Services sleep after 15 min inactivity** (wakes on first request in ~30 seconds)
- ⚠️ **No native MySQL** (use PostgreSQL or external MySQL)

### MySQL Alternatives for Free Tier

Since Render's free tier uses PostgreSQL, you have options:

1. **Use PostgreSQL** (Recommended)
   - Free on Render
   - Modify app to support PostgreSQL (minor code changes)

2. **Use PlanetScale** (Free MySQL)
   - Free 5GB database
   - Sign up at [planetscale.com](https://planetscale.com)
   - Update `DATABASE_URL` in Render to point to PlanetScale

3. **Use Railway** (Alternative to Render)
   - Supports MySQL natively
   - $5/month free credit
   - Similar deployment process

---

## 🐛 Troubleshooting

### Service Won't Start

1. Check the **Logs** in Render Dashboard
2. Look for database connection errors
3. Verify all environment variables are set

### Database Initialization Failed

The deployment logs will show detailed error messages. Common issues:

- **Connection timeout**: Database might not be ready yet (wait 2-3 min and redeploy)
- **Migration error**: Check the specific SQL file that failed
- **Permissions error**: Verify database credentials

### CORS Errors

If frontend can't connect to backend:

1. Check `ALLOWED_ORIGINS` environment variable
2. Verify frontend is using correct `VITE_API_URL`
3. Check browser console for specific CORS error

### Manual Database Reset

If you need to completely reset the database:

```bash
# Connect to your database
mysql -h <host> -P <port> -u <user> -p<password>

# Drop and recreate
DROP DATABASE me_clickup_system;
CREATE DATABASE me_clickup_system;
```

Then trigger a manual redeploy to reinitialize.

---

## 📊 Monitoring & Logs

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab
4. See real-time logs

### Health Check

The backend includes a health check endpoint:

```
GET https://clickup-sync-backend.onrender.com/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T12:00:00Z",
  "database": "connected"
}
```

---

## 🔐 Security Best Practices

1. **Secrets** - Never commit API tokens or passwords to GitHub
2. **JWT Secret** - Use Render's auto-generated value (32+ characters)
3. **HTTPS** - Render provides free SSL certificates automatically
4. **Environment Variables** - Store all sensitive data in Render environment variables
5. **Database** - Use strong passwords (Render auto-generates them)

---

## 📱 Accessing Your Deployed App

After deployment completes:

1. **Frontend URL**: Share this with your client
   - `https://clickup-sync-frontend.onrender.com`

2. **First Login**:
   - Default admin credentials are in your database seed data
   - Change password immediately after first login

3. **Configure ClickUp**:
   - Login to your deployed app
   - Go to Settings → ClickUp Integration
   - Enter your ClickUp API token
   - Select your workspace and lists

---

## 🎓 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Deploying Node.js Apps](https://render.com/docs/deploy-node-express-app)
- [Deploying Static Sites](https://render.com/docs/deploy-vite)
- [Managing Databases](https://render.com/docs/databases)

---

## 💡 Tips for Production

1. **Custom Domain** - Add your own domain in Render (free on all plans)
2. **Backup Database** - Set up regular backups (available on paid plans)
3. **Monitoring** - Use Render's built-in metrics
4. **Scaling** - Upgrade to paid plan to remove sleep mode and get more resources

---

## 🙋‍♂️ Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review deployment logs in Render Dashboard
3. Verify all environment variables are set correctly
4. Check that database migrations completed successfully

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created and GitHub connected
- [ ] Blueprint deployed from render.yaml
- [ ] ClickUp API token added to environment variables
- [ ] Services are running (check dashboard)
- [ ] Database initialized successfully (check backend logs)
- [ ] Frontend loads and shows login page
- [ ] Backend health check returns 200 OK
- [ ] Can login with default credentials
- [ ] ClickUp integration configured
- [ ] Share frontend URL with client 🎉

---

**Your app is now live and will auto-deploy on every GitHub push!** 🚀
