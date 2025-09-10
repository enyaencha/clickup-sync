#!/bin/bash

# System monitoring script for ClickUp Sync

LOG_FILE="./logs/monitor.log"
HEALTH_ENDPOINT="http://localhost:3000/health"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "$1"
}

check_service() {
    local service_name=$1
    local port=$2
    
    if curl -s "http://localhost:$port/health" > /dev/null; then
        log_message "✅ $service_name is running on port $port"
        return 0
    else
        log_message "❌ $service_name is not responding on port $port"
        return 1
    fi
}

check_database() {
    if mysql -h "${DB_HOST:-localhost}" -u "${DB_USER:-root}" -p"${DB_PASSWORD}" -e "USE ${DB_NAME:-clickup_sync};" 2>/dev/null; then
        log_message "✅ Database is accessible"
        return 0
    else
        log_message "❌ Database connection failed"
        return 1
    fi
}

check_disk_space() {
    local usage
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$usage" -lt 80 ]; then
        log_message "✅ Disk usage: ${usage}%"
    else
        log_message "⚠️  High disk usage: ${usage}%"
    fi
}

# Main monitoring checks
log_message "🔍 Starting system monitoring..."

check_service "Backend API" 3000
check_service "Frontend" 3001
check_database
check_disk_space

# Check for pending sync operations
PENDING_OPS=$(mysql -h "${DB_HOST:-localhost}" -u "${DB_USER:-root}" -p"${DB_PASSWORD}" "${DB_NAME:-clickup_sync}" -se "SELECT COUNT(*) FROM sync_operations WHERE status = 'pending';" 2>/dev/null)

if [ "$PENDING_OPS" ]; then
    if [ "$PENDING_OPS" -gt 0 ]; then
        log_message "⚠️  $PENDING_OPS pending sync operations"
    else
        log_message "✅ No pending sync operations"
    fi
fi

log_message "🔍 Monitoring complete"
