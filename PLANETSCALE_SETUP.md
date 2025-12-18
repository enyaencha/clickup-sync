# 🌍 PlanetScale Free MySQL Setup Guide

PlanetScale offers **5GB of free MySQL hosting** - perfect for your app!

---

## 📋 Step 1: Create PlanetScale Account

1. Go to **[planetscale.com](https://planetscale.com)**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with **GitHub** (easiest option) or email
4. **No credit card required** for free tier! ✅

---

## 🗄️ Step 2: Create Your Database

1. After signing in, click **"Create a database"**
2. **Database name**: `clickup-sync` (or any name you prefer)
3. **Region**: Choose closest to your location:
   - `US East (Northern Virginia)` - Good for global access
   - `US West (Oregon)` - Matches your Render region
4. **Plan**: Select **"Hobby"** (Free - 5GB storage)
5. Click **"Create database"**

⏱️ **Takes 1-2 minutes to provision**

---

## 🔌 Step 3: Get Connection Details

### Option A: Connection String (Recommended)

1. In your database dashboard, click **"Connect"**
2. Select **"Connect with"** → **"Node.js"**
3. Click **"Generate new password"**
4. **Copy the connection string** - looks like:
   ```
   mysql://username:password@host.us-east-4.psdb.cloud/database?ssl={"rejectUnauthorized":true}
   ```
5. **Save this** - you'll need it for Render!

### Option B: Individual Credentials

From the same "Connect" page, note these details:
- **Host**: `xxxxx.us-east-4.psdb.cloud`
- **Username**: `xxxxxxxxx`
- **Password**: `pscale_pw_xxxxxxxxx`
- **Database**: `clickup-sync`
- **Port**: `3306` (default MySQL port)

---

## 🚀 Step 4: Configure Render with PlanetScale

### Method 1: Using Connection String (Easier)

1. Go to **Render Dashboard** → **clickup-sync-backend**
2. Click **"Environment"** tab
3. Find **`DATABASE_URL`** and click **"Edit"**
4. **Paste your PlanetScale connection string**
5. Click **"Save Changes"**

That's it! The app will use this connection string.

### Method 2: Using Individual Variables

1. Go to **Render Dashboard** → **clickup-sync-backend**
2. Click **"Environment"** tab
3. Set these variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | Your PlanetScale host (e.g., `xxxxx.us-east-4.psdb.cloud`) |
| `DB_USER` | Your PlanetScale username |
| `DB_PASSWORD` | Your PlanetScale password |
| `DB_NAME` | `me_clickup_system` |
| `DB_PORT` | `3306` |

4. Click **"Save Changes"**

---

## 🔄 Step 5: Redeploy Your Backend

After setting the environment variables:

1. Go to **clickup-sync-backend** in Render
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Watch the logs - you should see:

```
🚀 Starting Database Initialization
🎯 Target database: xxxxx.psdb.cloud:3306
📡 Connection attempt 1/10 to xxxxx.psdb.cloud:3306
✅ Connected to database successfully

📦 Fresh database detected - running full schema initialization
📄 Loading schema: me_clickup_system_2025_dec_16.sql
⚙️  Executing [X] SQL statements...
✅ Schema initialized successfully

✅ Database ready with [X] tables/views
🎉 Database initialization completed!
```

---

## ✅ Step 6: Verify Everything Works

1. **Check Backend Health**:
   - Visit: `https://clickup-sync-backend.onrender.com/health`
   - Should return: `{"status":"ok","database":"connected"}`

2. **Check Frontend**:
   - Visit: `https://clickup-sync-frontend.onrender.com`
   - Should load the login page

3. **Check PlanetScale Dashboard**:
   - Go to your database → **"Insights"** tab
   - You should see connection activity and tables created

---

## 📊 PlanetScale Free Tier Limits

✅ **Included in Free Tier:**
- 5 GB storage
- 1 billion row reads per month
- 10 million row writes per month
- 1 production branch
- 1 development branch
- Automatic backups (7 days)
- SSL/TLS encryption
- No credit card required

This is **more than enough** for small to medium apps! 🎉

---

## 🔐 Security Best Practices

1. **Never commit credentials** to GitHub
2. **Use connection string** - it's easier and more secure
3. **Rotate passwords** if they're ever exposed
4. **Enable IP restrictions** in PlanetScale (optional, for extra security)

---

## 🛠️ Troubleshooting

### "Connection refused" error

**Solution**: Double-check your connection details. Make sure you copied the full connection string including password.

### "Access denied" error

**Solution**: Regenerate your password in PlanetScale and update Render environment variables.

### "Database doesn't exist" error

**Solution**: Make sure:
- Database name in PlanetScale matches `me_clickup_system`
- Or update `DB_NAME` in Render to match your PlanetScale database name

### Schema not importing

**Solution**:
- Check backend deployment logs
- Make sure the schema file path is correct
- Try redeploying with "Clear build cache & deploy"

---

## 💡 Pro Tips

1. **Database Branches**: PlanetScale lets you create dev branches - use them for testing!
2. **Schema Changes**: Use PlanetScale's web console to view tables and data
3. **Monitoring**: Check PlanetScale Insights for query performance
4. **Scaling**: When you outgrow free tier, upgrade to $29/month for more storage

---

## 🎓 PlanetScale Resources

- [Documentation](https://planetscale.com/docs)
- [Connection Strings](https://planetscale.com/docs/concepts/connection-strings)
- [Free Tier FAQ](https://planetscale.com/docs/concepts/billing#planetscale-plans)

---

## 🎉 You're All Set!

Your app is now running with:
- ✅ **Frontend**: Hosted on Render (free static site)
- ✅ **Backend**: Hosted on Render (free web service)
- ✅ **Database**: PlanetScale (free 5GB MySQL)

**Total cost**: $0/month 🎊

Share the frontend URL with your client and you're done!
