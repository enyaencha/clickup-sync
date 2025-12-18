# 🚂 Railway.com Deployment Guide

Complete guide for deploying the ClickUp M&E System to Railway.com with **MySQL database** (no conversion needed!)

---

## 🎯 Why Railway.com?

✅ **Native MySQL Support** - Use your original database schema without conversion
✅ **Free Tier** - $5 credit/month + 500 hours execution time
✅ **Automatic Deployments** - Deploy on every git push
✅ **Simple Setup** - No complex configuration files needed
✅ **Built-in Database** - MySQL database included in free tier

---

## 📋 Prerequisites

1. **GitHub Account** - Your code repository
2. **Railway Account** - Sign up at https://railway.app (use GitHub login)
3. **Git Repository** - This project pushed to GitHub

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `enyaencha/clickup-sync`
4. Select branch: `claude/setup-free-hosting-Slmo4`

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will automatically create a MySQL database and provide connection details

### Step 4: Configure Backend Service

1. Click on your backend service (should be auto-detected)
2. Go to **"Settings"** tab
3. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `npm start` (already configured in package.json)
   - **Build Command**: `npm install`

### Step 5: Add Environment Variables

In your **backend service**, go to **"Variables"** tab and add:

```bash
# Database (Railway will auto-inject DATABASE_URL)
# You don't need to set DATABASE_URL manually - Railway does this automatically!

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Encryption Key (32 bytes hex)
ENCRYPTION_KEY=your-32-byte-hex-encryption-key-here

# ClickUp API (Optional - for sync functionality)
CLICKUP_API_KEY=your-clickup-api-key-if-you-have-one
CLICKUP_TEAM_ID=your-clickup-team-id

# Node Environment
NODE_ENV=production

# CORS Origins (Railway will provide your frontend URL)
ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

**Important**: Railway automatically injects `DATABASE_URL` when you add a MySQL database. You don't need to set it manually!

### Step 6: Configure Frontend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repo again
2. In Settings:
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview` (or use a static file server)

3. Add environment variable:
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 7: Deploy!

1. Railway will automatically deploy both services
2. Monitor deployment logs in the **"Deployments"** tab
3. Wait for deployment to complete (~3-5 minutes)

---

## 🔍 Deployment Monitoring

### Check Backend Logs

Look for these success messages:

```bash
🚂 Railway MySQL Database Initialization

📋 Connecting to Railway MySQL database...
✅ Connected successfully!

🔍 Checking existing database state...
📦 Fresh database detected - initializing with complete schema
📋 Loading MySQL schema file (all 76 tables)...

⚙️  Executing 2000+ SQL statements...
   ✓ Executed 20/2000 statements...
   ✓ Executed 40/2000 statements...
   ...

✅ Database initialization completed!
   📊 Tables created: 76
   ✓ Executed: 1850 statements
   ⊘ Skipped: 150 statements
   ⏱️  Duration: 15.3s

🎉 Initialization complete!
```

### Verify Database

Railway provides a built-in database viewer:

1. Click on your **MySQL database** in Railway
2. Go to **"Data"** tab
3. You should see all **76 tables**

---

## 📊 Database Schema (76 Tables)

Your original MySQL schema will be loaded directly:

### Core System (9 tables)
- access_audit_log, users, roles, user_roles, permissions, role_permissions
- user_sessions, organizations, organization_hierarchies

### M&E Framework (15 tables)
- goals, outcomes, outputs, indicators, indicator_values
- verification_methods, verifications, assumptions, activity_risks

### Activities (10 tables)
- activities, activity_beneficiaries, activity_checklists
- activity_expenses, activity_comments, comments

### Beneficiaries (7 tables)
- beneficiaries, agricultural_plots, vsla_groups, vsla_group_members
- vsla_loans, refugee_profiles, youth_profiles

### GBV Module (4 tables)
- gbv_cases, gbv_survivors, gbv_interventions, gbv_referrals

### SEEP Module (3 tables)
- seep_participants, seep_trainings, seep_business_plans

### And 28 more specialized tables!

---

## 🌐 Accessing Your Application

### Backend API
Your backend will be available at:
```
https://your-project-name.up.railway.app
```

### Frontend App
Your frontend will be available at:
```
https://your-frontend-name.up.railway.app
```

### Test Login
```bash
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

## 🔐 Database Connection Details

Railway automatically provides:
- **DATABASE_URL**: Full connection string (auto-injected)
- **MYSQL_URL**: Alternative format
- **Host, Port, Database, User, Password**: Individual components

Access via **mysql client**:
```bash
mysql -h containers-us-west-xyz.railway.app -u root -p your_database
```

Or use GUI tools like:
- **MySQL Workbench**
- **DBeaver**
- **TablePlus**

---

## ⚙️ How It Works

### 1. First Deployment (Fresh Database)
```
┌─────────────────────────────────────────┐
│ Railway detects git push                │
├─────────────────────────────────────────┤
│ 1. npm install (install dependencies)  │
│ 2. npm start (runs init-db-railway.js) │
│    ↓                                    │
│    • Connects to MySQL                  │
│    • Checks table count = 0             │
│    • Loads me_clickup_system_2025...sql │
│    • Executes all CREATE TABLE          │
│    • Executes all INSERT (sample data)  │
│    • Creates 76 tables                  │
│ 3. Starts server-me.js                  │
│ 4. ✅ App ready!                        │
└─────────────────────────────────────────┘
```

### 2. Subsequent Deployments (Existing Data)
```
┌─────────────────────────────────────────┐
│ Railway detects git push                │
├─────────────────────────────────────────┤
│ 1. npm install                          │
│ 2. npm start (runs init-db-railway.js) │
│    ↓                                    │
│    • Connects to MySQL                  │
│    • Checks table count = 76            │
│    • Skips initialization               │
│    • ✅ Preserves all existing data    │
│ 3. Starts server-me.js                  │
│ 4. ✅ App ready!                        │
└─────────────────────────────────────────┘
```

**Your existing users, login data, and all records are safe!** ✅

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin claude/setup-free-hosting-Slmo4
```

Railway detects the push and redeploys automatically! 🚀

---

## 💰 Railway Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Execution Time | 500 hours/month |
| Credit | $5/month |
| Memory | 512MB - 8GB |
| Storage | Shared |
| Databases | Multiple MySQL/PostgreSQL |
| Custom Domains | Yes (free) |

**Estimate**: Should be sufficient for 1-10 users with light usage.

---

## 🐛 Troubleshooting

### Database Connection Failed
**Issue**: `ECONNREFUSED` or `Authentication failed`

**Solution**:
1. Check Railway MySQL service is running
2. Verify `DATABASE_URL` environment variable is set (auto-injected)
3. Check MySQL service logs for errors

### Tables Not Created
**Issue**: Login fails with "table doesn't exist"

**Solution**:
1. Check backend deployment logs for init script errors
2. Verify schema file exists: `database/me_clickup_system_2025_dec_16.sql`
3. Manually run init script:
   ```bash
   railway run npm run init-db-railway
   ```

### Frontend Can't Connect to Backend
**Issue**: CORS errors or API not found

**Solution**:
1. Add backend URL to frontend `VITE_API_URL`
2. Add frontend URL to backend `ALLOWED_ORIGINS`
3. Both services must use HTTPS (Railway provides this)

### Out of Memory
**Issue**: `JavaScript heap out of memory`

**Solution**:
1. Increase memory in Railway settings (Settings → Resources)
2. Or optimize initialization script to process in smaller batches

---

## 📁 Project Structure

```
clickup-sync/
├── backend/
│   ├── package.json (start script runs init-db-railway.js)
│   ├── server-me.js (main server)
│   ├── scripts/
│   │   └── init-db-railway.js (database initialization)
│   └── core/
│       └── database/
│           └── connection.js (supports both MySQL and PostgreSQL)
├── frontend/
│   └── (React app files)
├── database/
│   └── me_clickup_system_2025_dec_16.sql (original MySQL schema)
└── railway.json (Railway configuration)
```

---

## 🔗 Useful Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# View logs
railway logs

# Run command in Railway environment
railway run npm run init-db-railway

# Open project in browser
railway open

# Connect to database
railway connect mysql
```

---

## 📚 Next Steps

1. ✅ Deploy to Railway
2. ✅ Verify 76 tables created
3. ✅ Test login with sample users
4. 🔐 Change default passwords
5. 🔑 Update JWT_SECRET and ENCRYPTION_KEY
6. 👥 Add your real users
7. 📊 Start entering M&E data
8. 🔄 Set up ClickUp sync (optional)

---

## 🆘 Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Issues**: https://github.com/enyaencha/clickup-sync/issues

---

**🎉 Happy Deploying!**

Your complete M&E ClickUp system with all 76 tables is ready to go on Railway! 🚂
