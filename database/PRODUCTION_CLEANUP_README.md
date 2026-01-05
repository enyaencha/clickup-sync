# Production Database Cleanup Guide

This guide will help you prepare your database for production by removing all test/dummy data while preserving essential system configuration.

## ⚠️ CRITICAL: Backup First!

**ALWAYS backup your database before running cleanup scripts!**

```bash
# Create backup
mysqldump -u root -p me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql

# Or if you have password in command
mysqldump -u root -proot me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 📋 What Will Be Preserved

The cleanup script **KEEPS** the following essential data:

### System Configuration
- ✅ **Organizations** - Your organization details
- ✅ **Program Modules** - Core modules (Livelihood, Advocacy, Education, Health, Protection, Finance, Resources)
- ✅ **Roles** - System roles (Admin, Manager, Officer, etc.)
- ✅ **Permissions** - All permission definitions
- ✅ **Role Permissions** - Role-permission mappings
- ✅ **Settings** - System configuration settings
- ✅ **Resource Types** - Resource type definitions (vehicles, equipment, etc.)

## 🗑️ What Will Be Deleted

The cleanup script **REMOVES** all test/dummy data:

### User Data
- ❌ All test users (a new admin will be created)
- ❌ User module assignments
- ❌ User role assignments

### Program Data
- ❌ All programs (sub-programs)
- ❌ All components
- ❌ All activities
- ❌ Activity checklists
- ❌ Activity attachments
- ❌ Means of verification

### Finance Data
- ❌ All financial transactions
- ❌ Finance approvals
- ❌ Program budgets
- ❌ Loans and repayments

### Resource Data
- ❌ All resource inventory
- ❌ Resource requests
- ❌ Resource maintenance records

### Other Data
- ❌ Indicators and indicator data
- ❌ Logframe data
- ❌ All attachments
- ❌ All audit logs
- ❌ Projects

## 📖 Step-by-Step Cleanup Process

### Step 1: Verify What Will Be Preserved

Run the verification script to see what data will be kept:

```bash
mysql -u root -p me_clickup_system < database/verify_before_cleanup.sql
```

This will show you:
- What system data will be preserved
- What test data will be deleted
- Sample records that will be removed

**Review the output carefully!**

### Step 2: Create a Backup

```bash
# Create backup with timestamp
mysqldump -u root -p me_clickup_system > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh backup_before_cleanup_*.sql
```

### Step 3: Run the Cleanup Script

```bash
mysql -u root -p me_clickup_system < database/clean_for_production.sql
```

The script will:
1. Disable foreign key checks
2. Clear all test/dummy data
3. Reset auto-increment counters
4. Create a default admin user
5. Re-enable foreign key checks
6. Show verification summary

### Step 4: Verify the Cleanup

After running the cleanup, verify the results:

```bash
mysql -u root -p me_clickup_system -e "
SELECT 'Organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL SELECT 'Program Modules', COUNT(*) FROM program_modules
UNION ALL SELECT 'Roles', COUNT(*) FROM roles
UNION ALL SELECT 'Users', COUNT(*) FROM users
UNION ALL SELECT 'Activities', COUNT(*) FROM activities
UNION ALL SELECT 'Budgets', COUNT(*) FROM program_budgets
UNION ALL SELECT 'Resources', COUNT(*) FROM resources;
"
```

Expected results:
- Organizations: 1 (Caritas Nairobi)
- Program Modules: 7 (or however many you have)
- Roles: 5+ (system roles)
- Users: 1 (default admin)
- Activities: 0
- Budgets: 0
- Resources: 0

## 🔐 Default Admin Account

After cleanup, a default admin account is created:

**Email:** `admin@caritas.org`
**Password:** `Admin@123`

### ⚠️ CHANGE THE PASSWORD IMMEDIATELY!

1. Login to the system with the default credentials
2. Go to Settings → Profile
3. Change the password to a strong, secure password
4. Update the email if needed

## 📝 Post-Cleanup Tasks

After cleanup is complete:

### 1. Configure Organization
- Update organization details (name, address, contact info)
- Upload organization logo

### 2. Create Users
- Create user accounts for your team
- Assign appropriate roles
- Configure module access for each user

### 3. Set Up Modules
- Create programs (sub-programs)
- Define components
- Set up indicators

### 4. Configure Finance
- Set up fiscal years
- Define budget categories
- Configure approval workflows

### 5. Configure Resources
- Add resource types if needed
- Set up initial resource inventory

## 🔄 Rolling Back (If Needed)

If you need to restore your backup:

```bash
# Stop the application first
# Then restore the backup
mysql -u root -p me_clickup_system < backup_before_cleanup_YYYYMMDD_HHMMSS.sql
```

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] Database backup created and verified
- [ ] Ran verification script and reviewed output
- [ ] Cleanup script executed successfully
- [ ] Only 1 user exists (admin)
- [ ] All test activities/budgets/resources removed
- [ ] System modules still present
- [ ] Roles and permissions intact
- [ ] Can login with default admin account
- [ ] Changed default admin password
- [ ] Organization details configured

## 📞 Support

If you encounter any issues during cleanup:

1. **DO NOT run the cleanup script multiple times**
2. Restore from your backup
3. Review the error messages
4. Check the scripts for any database-specific issues
5. Contact support if needed

## 🔒 Security Notes

- The cleanup script creates ONE default admin user
- Default password is `Admin@123` - **CHANGE THIS IMMEDIATELY**
- All audit logs are cleared - fresh start for production
- Review user permissions after creating new accounts
- Enable SSL for database connections in production
- Use strong passwords for all user accounts
- Regular backups are essential in production

---

**Last Updated:** 2026-01-05
**Database Version:** me_clickup_system_2026_jan_05.sql
