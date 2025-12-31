#!/bin/bash

# Script to directly fix the SQL parameter errors in your running directory
# This updates the files in /home/nyaencha/Music/m&e/clickup-sync/

RUNNING_DIR="/home/nyaencha/Music/m&e/clickup-sync"
FINANCE_FILE="$RUNNING_DIR/backend/routes/finance.routes.js"
RESOURCES_FILE="$RUNNING_DIR/backend/routes/resources.routes.js"

echo "=========================================="
echo "Fixing SQL Parameter Errors"
echo "=========================================="
echo ""

# Check if running directory exists
if [ ! -d "$RUNNING_DIR" ]; then
    echo "❌ Error: Directory $RUNNING_DIR does not exist!"
    exit 1
fi

echo "📁 Working directory: $RUNNING_DIR"
echo ""

# Navigate to running directory
cd "$RUNNING_DIR" || exit 1

echo "🔄 Pulling latest changes from git..."
git fetch origin claude/add-finance-rename-resources-JvVp9
git pull origin claude/add-finance-rename-resources-JvVp9

if [ $? -eq 0 ]; then
    echo "✅ Git pull successful!"
else
    echo "⚠️  Git pull had issues, but continuing..."
fi

echo ""
echo "🔍 Verifying fixes were applied..."
echo ""

# Check finance.routes.js
if grep -q "const limit = Math.max(1, parseInt(req.query.limit)" "$FINANCE_FILE" 2>/dev/null; then
    echo "✅ finance.routes.js - FIXED"
else
    echo "❌ finance.routes.js - NOT FIXED"
fi

# Check resources.routes.js
if grep -q "const limit = Math.max(1, parseInt(req.query.limit)" "$RESOURCES_FILE" 2>/dev/null; then
    echo "✅ resources.routes.js - FIXED"
else
    echo "❌ resources.routes.js - NOT FIXED"
fi

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Restart your backend server:"
echo "   cd $RUNNING_DIR/backend"
echo "   pm2 restart all"
echo "   # OR if using npm:"
echo "   # npm start"
echo ""
echo "2. Rebuild frontend:"
echo "   cd $RUNNING_DIR/frontend"
echo "   npm run build"
echo ""
echo "3. Test the Finance and Resource dashboards"
echo ""
echo "=========================================="
