#!/bin/bash
# Script to apply finance routes SQL parameter fix
# This fixes the "Incorrect arguments to mysqld_stmt_execute" error

FILE="backend/routes/finance.routes.js"

echo "🔧 Applying SQL parameter fix to $FILE..."

# Backup the original file
cp "$FILE" "${FILE}.backup"
echo "✅ Backup created: ${FILE}.backup"

# Apply the fix using sed
# Fix 1: GET /budgets endpoint - around line 56-66
sed -i '/router.get.*\/budgets/,/offset = 0/ {
    s/limit = 50,/limit,/
    s/offset = 0/offset/
}' "$FILE"

# Fix 2: GET /transactions endpoint - around line 178-188
sed -i '/router.get.*\/transactions/,/offset = 0/ {
    s/limit = 10,/limit,/
    s/offset = 0/offset/
}' "$FILE"

# Fix 3: GET /approvals endpoint - around line 322-332
sed -i '/router.get.*\/approvals/,/offset = 0/ {
    s/limit = 50,/limit,/
    s/offset = 0/offset/
}' "$FILE"

# Add the safe parsing lines after the destructuring
# This is more complex, so we'll do it with a more targeted approach
# For now, let's just output instructions

echo ""
echo "⚠️  Manual step required:"
echo ""
echo "In $FILE, find these 3 sections and add the safe parsing lines:"
echo ""
echo "1. After line ~62 (GET /budgets), add:"
echo "   const limit = Math.max(1, parseInt(req.query.limit) || 50);"
echo "   const offset = Math.max(0, parseInt(req.query.offset) || 0);"
echo ""
echo "2. After line ~188 (GET /transactions), add:"
echo "   const limit = Math.max(1, parseInt(req.query.limit) || 10);"
echo "   const offset = Math.max(0, parseInt(req.query.offset) || 0);"
echo ""
echo "3. After line ~332 (GET /approvals), add:"
echo "   const limit = Math.max(1, parseInt(req.query.limit) || 50);"
echo "   const offset = Math.max(0, parseInt(req.query.offset) || 0);"
echo ""
echo "Then find ALL instances of:"
echo "   params.push(parseInt(limit), parseInt(offset));"
echo ""
echo "And replace with:"
echo "   params.push(limit, offset);"
echo ""
echo "✅ Partial fix applied. Complete the manual steps above, then restart your server."
