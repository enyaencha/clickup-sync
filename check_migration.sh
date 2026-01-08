#!/bin/bash

# Quick Migration Checker for Budget Request Workflow

echo "======================================"
echo "Budget Request Migration Checker"
echo "======================================"
echo ""

# Check if database exists
DB_NAME="me_clickup_system"
MIGRATION_FILE="database/migrations/add_budget_request_workflow.sql"

echo "1. Checking if migration file exists..."
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "   ❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi
echo "   ✅ Migration file found"
echo ""

echo "2. To run the migration, execute:"
echo ""
echo "   mysql -u root -p $DB_NAME < $MIGRATION_FILE"
echo ""
echo "3. This migration will:"
echo "   - Create activity_budget_requests table"
echo "   - Create budget_allocations table"
echo "   - Create activity_budgets table"
echo "   - Update comments table entity_type ENUM to include 'budget_request'"
echo "   - Add parent_comment_id for threaded discussions"
echo ""
echo "4. After running the migration, restart your backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "======================================"
echo "IMPORTANT: The error 'Failed to fetch comments' likely means"
echo "the comments table doesn't have 'budget_request' in entity_type ENUM."
echo "Run the migration above to fix this!"
echo "======================================"
