# Production Database Cleanup Guide

This guide helps you prepare your database for production by removing all test/dummy data while preserving system configuration and your existing admin account (user ID 1).

## ⚠️ CRITICAL: Backup First!

**ALWAYS backup your database before running cleanup scripts!**

```bash
# Create backup
mysqldump -u root -p me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql

# Or with password in command
mysqldump -u root -proot me_clickup_system > backup_$(date +%Y%m%d_%H%M%S).sql
```

## ✅ What Will Be PRESERVED

### System Configuration
- ✅ Organizations
- ✅ Program Modules (Livelihood, Advocacy, Education, Health, Protection, Finance, Resources)
- ✅ Roles (Admin, Manager, Officer, etc.)
- ✅ Permissions
- ✅ Role Permissions
- ✅ Resource Types
- ✅ Locations
- ✅ Goal Categories
- ✅ Strategic Goals
- ✅ ME Indicators (templates)

### User Account
- ✅ **User ID 1** (your existing admin account)
- ✅ User ID 1's module assignments
- ✅ User ID 1's role assignments

## 🗑️ What Will Be DELETED

### User Data
- ❌ All test users (ID > 1)
- ❌ Their module assignments
- ❌ Their role assignments
- ❌ Their sessions

### Program Data
- ❌ All activities
- ❌ All programs (sub-programs)
- ❌ All sub-programs
- ❌ All projects
- ❌ All components
- ❌ Activity checklists, expenses, risks
- ❌ Sub-activities

### Finance Data
- ❌ All financial transactions
- ❌ Finance approvals
- ❌ Program budgets
- ❌ Budget revisions
- ❌ Component budgets
- ❌ Loans and repayments

### Resource Data
- ❌ All resource inventory
- ❌ Resource requests
- ❌ Resource maintenance records

### Logframe & M&E Data
- ❌ Indicators (activity-specific)
- ❌ Indicator values
- ❌ Indicator-activity links
- ❌ Means of verification
- ❌ Results chain
- ❌ Assumptions
- ❌ ME Reports
- ❌ ME Results

### Beneficiary Data
- ❌ All beneficiaries
- ❌ Relief beneficiaries
- ❌ Relief distributions
- ❌ Activity beneficiaries

### Sector-Specific Data
- ❌ Businesses
- ❌ Agricultural plots
- ❌ Crop production
- ❌ SHG members
- ❌ Nutrition assessments
- ❌ GBV cases and case notes
- ❌ Capacity building programs and participants
- ❌ Trainings and training participants

### Other Data
- ❌ All attachments
- ❌ All comments
- ❌ Audit logs
- ❌ Status history
- ❌ Performance comments
- ❌ Tasks and time entries

## 📖 Step-by-Step Cleanup Process

### Step 1: Verify What Will Happen

```bash
mysql -u root -p me_clickup_system < database/verify_before_cleanup.sql
```

This shows:
- User ID 1 details (will be kept)
- System data counts (will be preserved)
- Test data counts (will be deleted)
- Sample records that will be removed

**Review the output carefully!**

### Step 2: Create Backup

```bash
# Create timestamped backup
mysqldump -u root -p me_clickup_system > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh backup_before_cleanup_*.sql
```

### Step 3: Run Cleanup Script

```bash
mysql -u root -p me_clickup_system < database/clean_for_production.sql
```

The script will:
1. Show a warning message (5 second pause)
2. Disable foreign key checks
3. Delete test users (keep user ID 1)
4. Delete all test data
5. Reset auto-increment counters
6. Re-enable foreign key checks
7. Show verification results

### Step 4: Verify Results

```bash
mysql -u root -p me_clickup_system -e "
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Activities', COUNT(*) FROM activities
UNION ALL SELECT 'Programs', COUNT(*) FROM programs
UNION ALL SELECT 'Budgets', COUNT(*) FROM program_budgets
UNION ALL SELECT 'Resources', COUNT(*) FROM resources;
"
```

Expected results:
- Users: 1 (user ID 1)
- Activities: 0
- Programs: 0
- Budgets: 0
- Resources: 0

## 🔐 After Cleanup - Login

After cleanup, you can login with **user ID 1** (your existing admin account).

The credentials are whatever was set for user ID 1 in your database.

## 📝 Post-Cleanup Tasks

### 1. Verify Admin Access
- Login with user ID 1 credentials
- Verify you have system admin access
- Check module assignments are intact

### 2. Create Production Users
- Create user accounts for your team
- Assign appropriate roles
- Configure module access

### 3. Set Up Production Data
- Create programs (sub-programs)
- Define components
- Set up indicators and logframe
- Configure budgets

### 4. Configure Resources
- Add resource inventory
- Set up resource types if needed

## 🔄 Rolling Back

If you need to restore from backup:

```bash
# Stop the application first
# Then restore
mysql -u root -p me_clickup_system < backup_before_cleanup_YYYYMMDD_HHMMSS.sql
```

## ✅ Verification Checklist

Before going to production:

- [ ] Database backup created and verified
- [ ] Ran verification script and reviewed output
- [ ] Cleanup script executed successfully
- [ ] Only 1 user exists (user ID 1)
- [ ] All test data removed (activities, budgets, resources)
- [ ] System config intact (modules, roles, permissions)
- [ ] Can login with user ID 1
- [ ] Created production user accounts
- [ ] Assigned roles and module access

## 🔒 Security Notes

- User ID 1 is preserved - verify its password is strong
- All test users are removed - create new production accounts
- All audit logs are cleared - fresh start for production
- Use strong passwords for all new accounts
- Enable SSL for database connections in production
- Set up regular automated backups

## 📊 What Gets Reset

All these counters are reset to start from 1 (or 2 for users):

- Activities
- Programs & Components
- Budgets & Transactions
- Resources & Requests
- Indicators
- Beneficiaries
- And all other data tables

This means your production data will have clean, sequential IDs starting from 1.

---

## 📞 Support

If you encounter errors:

1. **DO NOT panic** - you have a backup
2. Restore from backup
3. Review the error message
4. Check if all tables exist in your database
5. Contact support with the specific error

---

**Last Updated:** 2026-01-06
**Database Version:** me_clickup_system_2026_jan_05.sql
**Script Purpose:** Clear all test data, keep system config and user ID 1
