#!/bin/bash
# Quick check and fix script for your running directory

echo "=========================================="
echo "🔍 Checking Your Running Code"
echo "=========================================="
echo ""

RUNNING_DIR="/home/nyaencha/Music/m&e/clickup-sync"
FILE="$RUNNING_DIR/backend/routes/resources.routes.js"

if [ -f "$FILE" ]; then
    echo "📁 Found: $FILE"
    echo ""
    echo "🔎 Checking for SQL parameter fix..."
    echo ""

    if grep -q "Math.max(1, parseInt(req.query.limit)" "$FILE"; then
        echo "✅ FILE IS ALREADY FIXED!"
        echo ""
        echo "Your file has the correct code. Just restart your server:"
        echo "  cd $RUNNING_DIR/backend"
        echo "  pm2 restart all"
    else
        echo "❌ FILE NEEDS TO BE UPDATED"
        echo ""
        echo "Run these commands to fix it:"
        echo ""
        echo "  cd $RUNNING_DIR"
        echo "  git pull origin claude/add-finance-rename-resources-JvVp9"
        echo "  cd backend"
        echo "  pm2 restart all"
        echo ""
        echo "Or if you haven't committed local changes:"
        echo "  cd $RUNNING_DIR"
        echo "  git stash"
        echo "  git pull origin claude/add-finance-rename-resources-JvVp9"
        echo "  cd backend"
        echo "  pm2 restart all"
    fi
else
    echo "❌ File not found: $FILE"
    echo ""
    echo "Is your server running from a different location?"
fi

echo ""
echo "=========================================="
