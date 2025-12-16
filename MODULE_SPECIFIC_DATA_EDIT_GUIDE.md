# Module-Specific Activity Data - Edit Guide

## ✅ Changes Pushed Successfully

All code has been pushed to branch: **`claude/add-finance-rename-resources-JvVp9`**

---

## 🔄 Step 1: Pull the Latest Changes

Since you've merged to main, you need to pull the latest code:

```bash
cd /home/nyaencha/Music/m&e/clickup-sync/
git checkout main
git pull origin main
```

**OR** if you haven't merged yet, pull from the feature branch:

```bash
git pull origin claude/add-finance-rename-resources-JvVp9
```

---

## 🔧 Step 2: Restart Your Server

After pulling, restart your backend:

```bash
cd backend
# Stop your current server (Ctrl+C) then:
npm start
```

---

## 📝 How Module-Specific Data Edit Works

### When You Create an Activity:

1. **Finance Module Activity** - Form captures:
   - Transaction type, expense category, payment method
   - Budget line, vendor/payee, invoice/receipt numbers
   - Approval level, expected amount

2. **Resource Module Activity** - Form captures:
   - Activity type, resource category, quantity needed
   - Maintenance type, training topic, participants count
   - Duration of use

3. **Data Storage**: All module-specific fields are JSON-stringified and stored in the `module_specific_data` column

### When You View/Edit an Activity:

1. **Open Activity Details** - Click on any activity
2. **Module-Specific Section Appears** if data exists:
   - 💰 Finance activities show green "Finance Details" section
   - 🏗️ Resource activities show blue "Resource Details" section
   - All fields are displayed dynamically from the JSON

3. **Click "Edit" Button**:
   - All module-specific fields become editable
   - Change any values you need
   - Click "Save" to persist changes

4. **Behind the Scenes**:
   - Frontend parses the JSON when activity loads
   - Updates are tracked in `moduleSpecificData` state
   - On save, data is JSON-stringified again
   - Backend `updateActivity()` includes `module_specific_data` in UPDATE query

---

## 📊 Database Structure

```sql
-- The module_specific_data column stores JSON like this:

-- Finance Activity Example:
{
  "transaction_type": "expense",
  "expense_category": "program",
  "payment_method": "bank_transfer",
  "budget_line": "BL-2025-001",
  "vendor_payee": "ABC Supplies",
  "invoice_number": "INV-12345",
  "receipt_number": "RCP-67890",
  "approval_level": "director",
  "expected_amount": "50000.00"
}

-- Resource Activity Example:
{
  "activity_type": "maintenance",
  "resource_category": "vehicle",
  "quantity_needed": "1",
  "duration_of_use": "7",
  "maintenance_type": "preventive",
  "training_topic": null,
  "participants_count": null
}
```

---

## 🎯 Testing the Feature

### Test Create:
1. Navigate to Finance or Resource module
2. Go to a component
3. Click "New Activity"
4. Fill in module-specific fields
5. Submit → Data saved as JSON

### Test View:
1. Click on a Finance/Resource activity
2. Verify module-specific section appears
3. Check all fields are displayed correctly

### Test Edit:
1. Open a Finance/Resource activity
2. Click "Edit"
3. Modify module-specific fields
4. Click "Save"
5. Reopen to verify changes persisted

---

## 🐛 Troubleshooting

### Module-Specific Section Not Showing:
- Check if activity has `module_specific_data` in database:
  ```sql
  SELECT id, name, module_specific_data
  FROM activities
  WHERE id = <activity_id>;
  ```
- If NULL, the activity was created before this feature

### Fields Not Editable:
- Make sure you clicked "Edit" button first
- Check browser console for errors

### Changes Not Saving:
- Check backend logs for errors
- Verify `module_specific_data` column exists:
  ```sql
  DESCRIBE activities;
  ```
- If column missing, run migration:
  ```bash
  mysql -u root -p me_clickup_system < database/migrations/MANUAL_MODULE_SPECIFIC_MIGRATION.sql
  ```

### Finance Approvals Still Failing:
- Pull latest code (includes SQL parameter fix)
- Restart server
- Check `FINANCE_ROUTES_FIX.md` for manual fixes if needed

---

## 📦 What Was Changed

**Files Modified:**
1. `frontend/src/components/ActivityDetailsModal.tsx`
   - Added module_specific_data parsing
   - Dynamic field rendering
   - Edit handlers for module data

2. `backend/services/me.service.js`
   - Added module_specific_data to updateActivity()
   - Included in SQL UPDATE query

**New Features:**
- ✅ View module-specific data in activity details
- ✅ Edit module-specific fields
- ✅ Automatic field name formatting (snake_case → Title Case)
- ✅ Dynamic detection of module type (Finance 💰 vs Resource 🏗️)
- ✅ Full CRUD support for JSON data

---

## 🚀 Next Steps

1. **Pull the changes** from git
2. **Restart your server**
3. **Test creating** a new Finance activity with transaction details
4. **Test editing** the activity to modify those details
5. **Verify** data persists correctly

If Finance approvals endpoint still fails after restart, check the `FINANCE_ROUTES_FIX.md` file for specific code changes needed.

All changes are ready and waiting in the branch! 🎉
