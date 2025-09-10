#!/bin/bash

# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="clickup_sync_backup_${DATE}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
echo "🔄 Creating database backup..."
mysqldump -h "${DB_HOST:-localhost}" -u "${DB_USER:-root}" -p"${DB_PASSWORD}" "${DB_NAME:-clickup_sync}" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
echo "🗜️ Compressing backup..."
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
echo "🧹 Old backups cleaned up"
