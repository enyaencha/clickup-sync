#!/bin/bash

# Database backup script
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/config/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${ROOT_DIR}/backups"
BACKUP_FILE="clickup_sync_backup_${DATE}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

DB_HOST_VALUE="${DB_HOST:-localhost}"
DB_USER_VALUE="${DB_USER:-root}"
DB_PASSWORD_VALUE="${DB_PASSWORD:-}"
DB_NAME_VALUE="${DB_NAME:-clickup_sync}"
DB_PORT_VALUE="${DB_PORT:-3306}"

SSL_ARGS=()
CA_TEMP_FILE=""

if [ -n "${DB_SSL:-}" ] && [[ ! "${DB_SSL,,}" =~ ^(0|false|no|off)$ ]]; then
  SSL_ARGS+=(--ssl-mode=REQUIRED)
  if [ -n "${DB_SSL_CA_PATH:-}" ]; then
    SSL_ARGS+=(--ssl-ca="$DB_SSL_CA_PATH")
  elif [ -n "${DB_SSL_CA:-}" ]; then
    CA_TEMP_FILE="$(mktemp)"
    printf '%s' "${DB_SSL_CA//\\n/$'\n'}" > "$CA_TEMP_FILE"
    SSL_ARGS+=(--ssl-ca="$CA_TEMP_FILE")
  fi
fi

cleanup() {
  if [ -n "$CA_TEMP_FILE" ] && [ -f "$CA_TEMP_FILE" ]; then
    rm -f "$CA_TEMP_FILE"
  fi
}
trap cleanup EXIT

echo "🔄 Creating database backup..."
mysqldump \
  -h "$DB_HOST_VALUE" \
  -P "$DB_PORT_VALUE" \
  -u "$DB_USER_VALUE" \
  -p"$DB_PASSWORD_VALUE" \
  "${SSL_ARGS[@]}" \
  "$DB_NAME_VALUE" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
echo "🗜️ Compressing backup..."
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
echo "🧹 Old backups cleaned up"
