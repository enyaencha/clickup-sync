# Module-Specific Activity Forms

**Date:** December 15, 2025
**Feature:** Custom activity forms for Finance Management and Resource Management modules

## Overview

The activity form system has been enhanced to provide module-specific fields based on the parent module. Activities created under Finance Management (ID=6) and Resource Management (ID=5) modules now have tailored form fields relevant to their workflows.

## What Changed

### 1. Frontend - Enhanced AddActivityModal

**File:** `frontend/src/components/AddActivityModal.tsx`

The activity modal now:
- **Detects the parent module** by fetching component → sub-program → module hierarchy
- **Shows conditional form sections** based on module type
- **Displays module-specific icons** (💰 for Finance, 🏗️ for Resources)
- **Stores module-specific data** as JSON in the database

#### Finance Module Fields (Module ID = 6)

When creating an activity under Finance Management, users see:

- **Transaction Type:** Expense, Reimbursement, Advance Payment, Refund
- **Expense Category:** Operational, Program, Capital, Administrative
- **Payment Method:** Cash, Bank Transfer, Mobile Money, Check
- **Approval Level Required:** Department Head, Director, Board Approval
- **Budget Line/Code:** For tracking against specific budget lines
- **Expected Amount:** Estimated cost
- **Vendor/Payee Name:** Who will be paid
- **Invoice Number:** For reference
- **Receipt Number:** For verification

**Note:** Finance activities hide location fields (parish, ward, county) and beneficiary fields as they're not relevant to financial transactions.

#### Resource Management Fields (Module ID = 5)

When creating an activity under Resource Management, users see:

- **Activity Type:** Resource Allocation, Maintenance, Capacity Building, Equipment Request, Facility Booking
- **Resource Category:** Equipment, Vehicle, Facility, Tools, Materials
- **Quantity Needed:** Number of units required
- **Duration of Use:** How many days the resource is needed
- **Maintenance Type:** (if maintenance activity) Preventive, Corrective, Emergency
- **Training Topic:** (if capacity building) Subject of training
- **Expected Participants:** (if capacity building) Number of attendees

**Conditional fields** appear based on activity type selection (e.g., maintenance type only shows for maintenance activities).

### 2. Database - New JSON Column

**Migration File:** `database/migrations/016_add_module_specific_data_to_activities.sql`

Added `module_specific_data` JSON column to the `activities` table:

```sql
ALTER TABLE activities
ADD COLUMN module_specific_data JSON DEFAULT NULL
COMMENT 'JSON field for module-specific data (Finance, Resources, etc.)';
```

**Why JSON?**
- Flexible: Each module can store different fields without schema changes
- Efficient: No need for separate junction tables for each module
- Queryable: MySQL JSON functions allow filtering and searching
- Scalable: Easy to add new modules with their own field requirements

### 3. Backend - Service Layer Update

**File:** `backend/services/me.service.js`

Updated `createActivity()` function to:
- Accept `module_specific_data` field in the payload
- Store JSON data in the database
- Handle null values appropriately

```javascript
// Frontend sends:
{
  name: "Vehicle Maintenance",
  description: "Quarterly maintenance",
  module_specific_data: JSON.stringify({
    activity_type: "maintenance",
    resource_category: "vehicle",
    maintenance_type: "preventive",
    quantity_needed: "1",
    duration_of_use: "2"
  })
}

// Backend stores in activities.module_specific_data
```

## Running the Migration

### Option 1: MySQL CLI (Recommended)
```bash
mysql -u root -p me_clickup_system < database/migrations/MANUAL_MODULE_SPECIFIC_MIGRATION.sql
```

### Option 2: Node.js Script
```bash
cd backend
node run-module-specific-migration.js
```

### Option 3: MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. File > Run SQL Script
4. Select `MANUAL_MODULE_SPECIFIC_MIGRATION.sql`
5. Click Run

## How It Works

1. **User opens activity modal** for a component under Finance or Resource module
2. **Modal fetches module information:**
   - GET `/api/components/{componentId}` → gets `sub_program_id`
   - GET `/api/sub-programs/{subProgramId}` → gets `module_id`
   - GET `/api/programs/{moduleId}` → gets module name
3. **Form adapts based on `module_id`:**
   - `module_id === 6` → Show Finance fields
   - `module_id === 5` → Show Resource fields
   - Other modules → Show standard fields
4. **On submit:**
   - Module-specific data is JSON stringified
   - Sent as `module_specific_data` field
   - Backend stores in activities table
5. **Backend creates activity** with all standard fields + module-specific JSON

## Data Structure Examples

### Finance Activity JSON
```json
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
```

### Resource Activity JSON
```json
{
  "activity_type": "maintenance",
  "resource_category": "vehicle",
  "resource_id": "15",
  "quantity_needed": "1",
  "duration_of_use": "7",
  "maintenance_type": "preventive",
  "training_topic": null,
  "participants_count": null
}
```

## User Experience

### Standard Module Activity Form
- Shows all standard fields (location, beneficiaries, duration, etc.)
- Generic activity icon (✓)
- Title: "Add New [Module Name] Activity"

### Finance Module Activity Form
- Finance icon (💰) in header
- Green highlighted "Finance Details" section
- Hides location fields (parish, ward, county)
- Hides beneficiary fields
- Shows transaction tracking fields
- Title: "Add New Finance Management Activity"

### Resource Module Activity Form
- Resource icon (🏗️) in header
- Blue highlighted "Resource Management Details" section
- Shows all standard location and beneficiary fields
- Conditional fields based on activity type selection
- Title: "Add New Resource Management Activity"

## Future Enhancements

Potential additions for future releases:

1. **Activity Details View:** Display module-specific data in activity details modal
2. **Activity Edit:** Allow editing module-specific fields
3. **Filtering:** Filter activities by module-specific criteria
4. **Reporting:** Generate module-specific activity reports
5. **Validation:** Add field validation rules (e.g., budget line format)
6. **Resource Dropdown:** Link resource activities to actual resources from inventory
7. **Budget Validation:** Check against available budget for finance activities
8. **Approval Workflows:** Module-specific approval rules

## Files Changed

### Database
- `database/migrations/016_add_module_specific_data_to_activities.sql` (NEW)
- `database/migrations/MANUAL_MODULE_SPECIFIC_MIGRATION.sql` (NEW)
- `backend/run-module-specific-migration.js` (NEW)

### Frontend
- `frontend/src/components/AddActivityModal.tsx` (UPDATED - completely rewritten)

### Backend
- `backend/services/me.service.js` (UPDATED - added module_specific_data field)

### Documentation
- `MODULE_SPECIFIC_ACTIVITY_FORMS.md` (NEW - this file)

## Testing the Feature

### Test Finance Module Form
1. Navigate to a sub-program under Finance Management (module ID = 6)
2. Go to a component
3. Click "New Activity"
4. Verify Finance Details section appears with green background
5. Fill in finance-specific fields
6. Submit and check database for `module_specific_data` JSON

### Test Resource Module Form
1. Navigate to a sub-program under Resource Management (module ID = 5)
2. Go to a component
3. Click "New Activity"
4. Verify Resource Management Details section appears with blue background
5. Select "Maintenance" as activity type
6. Verify "Maintenance Type" field appears conditionally
7. Submit and check database

### Test Standard Module Form
1. Navigate to any other module (Health, Education, Agriculture, etc.)
2. Go to a component
3. Click "New Activity"
4. Verify standard form without module-specific sections
5. Verify no `module_specific_data` is stored

## Troubleshooting

### Form Not Showing Module-Specific Fields
- Check that the sub-program's `module_id` is correctly set to 5 or 6
- Open browser console for any API errors
- Verify component → sub-program → module hierarchy is correct

### Database Migration Fails
- Ensure MySQL server is running
- Check database credentials in migration script
- Verify you're running against correct database (`me_clickup_system`)
- Column might already exist - check with `DESCRIBE activities;`

### Module-Specific Data Not Saving
- Check browser network tab for POST /api/activities payload
- Verify `module_specific_data` is included in request
- Check backend logs for any SQL errors
- Confirm migration was run successfully

## Support

For issues or questions:
1. Check migration logs in console output
2. Verify database column exists: `DESCRIBE activities;`
3. Check browser console for frontend errors
4. Review backend logs for API errors
5. Ensure component/sub-program/module relationships are correct in database

---

**Created:** December 15, 2025
**Version:** 1.0
**Modules Enhanced:** Finance Management (ID: 6), Resource Management (ID: 5)
