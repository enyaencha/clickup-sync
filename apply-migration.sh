#!/bin/bash
# Apply Logframe Enhancement Migration
# Usage: ./apply-migration.sh

echo "🚀 Applying Logframe Enhancement Migration..."
mysql -u root -p me_clickup_system < database/migrations/002_add_logframe_enhancements.sql
echo "✅ Migration completed!"
