# Database Setup Guide

## Quick Setup

Run the automated setup script:

```bash
cd database
node setup-database.js
```

This will:
1. Create the `me_clickup_system` database
2. Load the schema with all 38+ tables
3. Insert the 5 Caritas programs
4. Verify everything is working

## Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE me_clickup_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 2. Load Schema

```bash
mysql -u root -p me_clickup_system < me_enhanced_schema.sql
```

### 3. Verify

```bash
mysql -u root -p me_clickup_system
```

```sql
SELECT id, icon, name, code FROM programs;
```

You should see 5 programs:
- 🌾 Food & Environment
- 💼 Socio-Economic
- 👥 Gender & Youth
- 🏥 Relief Services
- 🎓 Capacity Building

## Configuration

Make sure your `.env` file has the correct database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=me_clickup_system
```

## Troubleshooting

### Error: "Incorrect arguments to mysqld_stmt_execute"

This means the database tables don't exist yet. Run the setup script.

### Error: "Access denied"

Check your MySQL username and password in the `.env` file.

### Error: "Unknown database"

The database hasn't been created. Run `node setup-database.js`.

## Migration

To update an existing database with the new icon field:

```bash
cd migrations
node run_migration.js
```

This will:
- Add the `icon` column to programs table
- Update programs with Caritas data
