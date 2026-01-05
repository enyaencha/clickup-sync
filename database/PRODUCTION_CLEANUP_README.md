# Production User Cleanup Guide

This guide will help you prepare your database for production by removing all user accounts while **preserving ALL test data** (activities, budgets, resources, etc.).

## ⚠️ CRITICAL: Backup First!

**ALWAYS backup your database before running cleanup scripts!**

```bash
# Create backup
mysqldump -u root -p me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql

# Or if you have password in command
mysqldump -u root -proot me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🗑️ What Will Be Deleted

The cleanup script **ONLY REMOVES** user account data:

- ❌ All users
- ❌ User module assignments
- ❌ User role assignments

## ✅ What Will Be Preserved

**EVERYTHING ELSE** is kept intact:

### System Configuration
- ✅ Organizations
- ✅ Program Modules (Livelihood, Advocacy, Education, Health, Protection, Finance, Resources)
- ✅ Roles (Admin, Manager, Officer, etc.)
- ✅ Permissions
- ✅ Role Permissions
- ✅ Settings
- ✅ Resource Types

### Test/Demo Data
- ✅ **All programs (sub-programs)**
- ✅ **All components**
- ✅ **All activities**
- ✅ **All activity checklists and verification**
- ✅ **All financial transactions**
- ✅ **All finance approvals**
- ✅ **All program budgets**
- ✅ **All loans and repayments**
- ✅ **All resources inventory**
- ✅ **All resource requests**
- ✅ **All indicators and logframe data**
- ✅ **All attachments**
- ✅ **All projects**

## 🎯 Why Use This Approach?

This cleanup is perfect when you:
- Want to keep all your test/demo data for training purposes
- Need to show the system with sample data to stakeholders
- Want users to start with example data to learn from
- Are setting up a demo/staging environment
- Need to clear user accounts before handing over to production team

## 📖 Step-by-Step Cleanup Process

### Step 1: Verify What Will Be Deleted

Run the verification script to preview the cleanup:

```bash
mysql -u root -p me_clickup_system < database/verify_before_cleanup.sql
```

This shows you:
- How many users will be deleted
- Sample user accounts that will be removed
- What data will be PRESERVED (activities, budgets, etc.)

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
2. Delete all users
3. Clear user module assignments
4. Clear user role assignments
5. Reset auto-increment counters for user tables
6. Create a default admin user
7. Re-enable foreign key checks
8. Show verification summary

### Step 4: Verify the Cleanup

After running the cleanup, verify the results:

```bash
mysql -u root -p me_clickup_system -e "
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'User Assignments', COUNT(*) FROM user_module_assignments
UNION ALL SELECT '--- Preserved Data ---', NULL
UNION ALL SELECT 'Activities', COUNT(*) FROM activities
UNION ALL SELECT 'Budgets', COUNT(*) FROM program_budgets
UNION ALL SELECT 'Resources', COUNT(*) FROM resources;
"
```

Expected results:
- Users: 1 (default admin)
- User Assignments: 0
- Activities: (your test data count - KEPT)
- Budgets: (your test data count - KEPT)
- Resources: (your test data count - KEPT)

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

### 1. Login and Update Admin Account
- Change the default password
- Update admin email address
- Update profile information

### 2. Create Production Users
- Create user accounts for your team
- Assign appropriate roles
- Configure module access for each user

### 3. Review Test Data
- Check if you want to keep all the test data
- If some test data should be removed, do it manually
- Update any test data that needs production values

### 4. Configure Organization
- Verify organization details
- Upload organization logo if needed
- Update contact information

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
- [ ] All test data still present (activities, budgets, resources)
- [ ] Can login with default admin account
- [ ] Changed default admin password
- [ ] Created production user accounts
- [ ] Assigned proper roles and module access

## 🔒 Security Notes

- The cleanup script creates ONE default admin user
- Default password is `Admin@123` - **CHANGE THIS IMMEDIATELY**
- All user accounts are removed - create new production accounts
- Test data remains - review if it contains any sensitive information
- Use strong passwords for all user accounts
- Enable SSL for database connections in production
- Set up regular automated backups

## 🆚 Alternative: Full Data Cleanup

If you want to remove ALL test data (not just users), you'll need to:

1. Manually modify the cleanup script to include additional DELETE statements
2. Add deletions for: activities, components, programs, budgets, resources, etc.
3. Or create a fresh database from the schema files

**The current script is designed to keep test data for demonstration/training purposes.**

---

## 📞 Support

If you encounter any issues during cleanup:

1. **DO NOT run the cleanup script multiple times without restoring**
2. Restore from your backup
3. Review the error messages
4. Check the scripts for any database-specific issues
5. Contact support if needed

---

**Last Updated:** 2026-01-05
**Database Version:** me_clickup_system_2026_jan_05.sql
**Script Purpose:** Clear user accounts only, preserve all test data
