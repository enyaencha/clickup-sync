# ClickUp Sync System

A comprehensive hybrid synchronization system for ClickUp that maintains a local MySQL database with bidirectional sync capabilities.

## Features

- ✅ **Hybrid Sync**: Bidirectional synchronization between ClickUp and local database
- 🔄 **Real-time Updates**: Webhook support for instant synchronization
- 🛡️ **Conflict Resolution**: Intelligent handling of simultaneous edits
- 📊 **Dashboard Interface**: React-based UI for task management
- 🔍 **Audit Trail**: Complete change history tracking
- ⚡ **Performance Optimized**: Strategic indexing and caching
- 🐳 **Docker Ready**: Full containerization support

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd clickup-sync
   ./setup.sh
   ```

2. **Configure Environment**
   ```bash
   cp config/.env.example .env
   # Edit .env with your ClickUp API token and database credentials
   ```

3. **Deploy**
   ```bash
   ./scripts/deploy.sh development
   ```

4. **Access Dashboard**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## Architecture

### Database Schema
- **Sync Control**: `sync_config`, `sync_operations`, `sync_conflicts`
- **Workspace Structure**: `teams` → `spaces` → `folders` → `lists` → `tasks`
- **Task Management**: Full metadata, assignees, comments, attachments
- **Time Tracking**: Complete time entry management
- **Audit System**: Change history and conflict resolution

### API Endpoints

#### Sync Operations
- `POST /api/sync/pull` - Pull data from ClickUp
- `POST /api/sync/push` - Push local changes to ClickUp
- `GET /api/sync/status` - Get sync status and statistics

#### Task Management
- `GET /api/tasks` - List tasks with filtering
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task

#### Conflict Resolution
- `GET /api/conflicts` - List pending conflicts
- `POST /api/conflicts/:id/resolve` - Resolve conflict

#### Webhooks
- `POST /webhook/clickup` - ClickUp webhook endpoint

### Sync Engine Features

1. **Pull Sync**: Fetches data from ClickUp API
2. **Push Sync**: Sends local changes to ClickUp
3. **Webhook Processing**: Real-time event handling
4. **Conflict Detection**: Timestamp-based conflict identification
5. **Retry Logic**: Exponential backoff for failed operations

## Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clickup_sync

# ClickUp API
CLICKUP_API_BASE_URL=https://api.clickup.com/api/v2
CLICKUP_WEBHOOK_SECRET=your_webhook_secret

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret

# Sync Settings
SYNC_INTERVAL_MINUTES=15
MAX_RETRY_ATTEMPTS=3
```

### ClickUp Setup

1. Generate API token in ClickUp settings
2. Configure webhook URL: `https://yourdomain.com/webhook/clickup`
3. Set webhook events: `taskCreated`, `taskUpdated`, `taskDeleted`, `commentPosted`

## Deployment

### Development
```bash
./scripts/deploy.sh development
```

### Production (Docker)
```bash
./scripts/deploy.sh production
```

### Manual Database Setup
```bash
cd database
node migrate.js
node seed.js
```

## Monitoring

### Health Checks
```bash
curl http://localhost:3000/health
```

### System Monitoring
```bash
./scripts/monitor.sh
```

### Database Backup
```bash
./database/backup.sh
```

## Development

### Running Tests
```bash
cd backend
npm test
```

### Database Migrations
```bash
cd database
node migrate.js
```

### Logs
- Application logs: `./logs/app.log`
- Error logs: `./logs/error.log`
- Monitor logs: `./logs/monitor.log`

## Troubleshooting

### Common Issues

1. **Sync Conflicts**
   - Check `/api/conflicts` endpoint
   - Use dashboard conflict resolution UI
   - Manual resolution via database if needed

2. **API Rate Limits**
   - Monitor rate limiting in logs
   - Adjust `SYNC_INTERVAL_MINUTES` if needed
   - Implement request queuing for high-volume scenarios

3. **Database Connection Issues**
   - Verify database credentials
   - Check database server status
   - Review connection pool settings

4. **Webhook Failures**
   - Verify webhook URL accessibility
   - Check webhook secret configuration
   - Monitor webhook event logs

## Support

For issues and feature requests, please check the documentation or create an issue in the repository.

## License

MIT License - see LICENSE file for details.
# clickup-sync
