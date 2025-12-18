# 🔍 How to View Your Render PostgreSQL Database

## Method 1: Using Render Dashboard (Easiest)

### Step 1: Access Database Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your database service: **`clickup-db`**
3. You'll see the database overview page

### Step 2: View Connection Info
On the database page, you'll see:
- **Status**: Running status
- **Region**: oregon
- **Plan**: Free
- **Connection Info**: Click "Connect" to see credentials

### Step 3: Get Connection String
Click the **"Connect"** button and you'll see:
```
External Database URL:
postgres://username:password@dpg-xxxxx.oregon-postgres.render.com/clickup_sync
```

Copy this URL - you'll need it for external tools.

---

## Method 2: Using psql (Command Line)

### Install psql (if needed)
```bash
# Mac
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Connect to Database
```bash
psql "postgres://username:password@dpg-xxxxx.oregon-postgres.render.com/clickup_sync"
```

### Useful Commands
```sql
-- List all tables
\dt

-- Describe a table structure
\d users

-- View all users
SELECT id, username, email, role, is_active FROM users;

-- Count records in a table
SELECT COUNT(*) FROM users;

-- See table sizes
\d+ tablename

-- Quit
\q
```

---

## Method 3: Using pgAdmin (GUI Tool)

### Install pgAdmin
Download from: https://www.pgadmin.org/download/

### Connect to Render Database
1. Open pgAdmin
2. Right-click **"Servers"** → **"Register"** → **"Server"**
3. **General Tab**:
   - Name: `Render - ClickUp Sync`
4. **Connection Tab**:
   - Host: `dpg-xxxxx.oregon-postgres.render.com` (from Render)
   - Port: `5432`
   - Database: `clickup_sync`
   - Username: (from Render connection string)
   - Password: (from Render connection string)
   - SSL Mode: `Require`
5. Click **"Save"**

Now you can browse tables visually!

---

## Method 4: Using DBeaver (Free, Powerful)

### Install DBeaver
Download from: https://dbeaver.io/download/

### Connect
1. Click **"New Database Connection"**
2. Select **"PostgreSQL"**
3. Enter connection details from Render
4. Test connection
5. Click **"Finish"**

---

## Method 5: Using Render Web Shell (Built-in)

### Access Web Shell
1. Go to your database in Render Dashboard
2. Click **"Shell"** tab
3. You'll get a web-based psql terminal
4. Run SQL commands directly:

```sql
-- View all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check users
SELECT * FROM users;

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
```

---

## 🔍 Quick Database Check Commands

### Verify Schema
```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- View users table structure
\d users
```

### Check Data
```sql
-- See all users
SELECT id, username, email, role, is_active, is_system_admin, created_at
FROM users;

-- See organizations
SELECT * FROM organizations;

-- See activities
SELECT id, title, status, created_at FROM activities LIMIT 10;

-- See user sessions
SELECT id, user_id, ip_address, is_active, created_at
FROM user_sessions
ORDER BY created_at DESC
LIMIT 10;
```

### Check Indexes
```sql
-- List all indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public';
```

---

## 🛠️ Common Database Tasks

### Create a New User
```sql
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES ('testuser', 'test@example.com', '$2a$10$...', 'Test User', 'field_officer', true);
```

### Update User Password
```sql
UPDATE users
SET password_hash = '$2a$10$...'
WHERE email = 'user@example.com';
```

### View Recent Activity
```sql
SELECT u.username, a.action, a.resource, a.created_at
FROM access_audit_log a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 20;
```

### Database Size
```sql
SELECT pg_size_pretty(pg_database_size('clickup_sync'));
```

---

## 📊 Monitoring

### Active Connections
```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'clickup_sync';
```

### Table Sizes
```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ⚠️ Important Notes

1. **SSL Required**: Render requires SSL connections
2. **External Access**: Available even on free tier
3. **Backups**: Render backs up free databases daily (7-day retention)
4. **Read-Only User**: Create read-only users for viewing without risk
5. **Connection Limits**: Free tier has connection limits

---

## 🔐 Security Tips

1. **Don't share connection strings publicly**
2. **Use read-only users for analytics tools**
3. **Rotate passwords periodically**
4. **Monitor access logs**
5. **Use IP restrictions when possible**

---

## 🆘 Troubleshooting

### Can't Connect
- Check SSL is enabled
- Verify connection string is correct
- Check firewall/network settings
- Ensure database is not sleeping (free tier)

### Slow Queries
- Check table indexes
- Use EXPLAIN ANALYZE
- Monitor connection pool

### Connection Timeout
- Free tier databases may sleep
- First query after sleep takes longer
- Subsequent queries are fast

---

**Your Database Connection String is in Render Dashboard → clickup-db → Connect** 🔗
