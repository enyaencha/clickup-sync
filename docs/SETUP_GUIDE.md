# M&E Project Management System - Setup Guide

## Quick Start

Follow these steps to get the system up and running.

---

## Prerequisites

- **Node.js** v16+ and npm
- **MySQL** 8.0+
- **Git**
- **ClickUp** account with API access

---

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd clickup-sync
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if using the frontend)
cd ../frontend
npm install
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
```

```sql
CREATE DATABASE me_clickup_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

```bash
# Run schema
mysql -u root -p me_clickup_system < database/me_enhanced_schema.sql
```

### 4. Environment Configuration

```bash
# Create environment file
cp config/.env.example config/.env
```

Edit `config/.env`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=me_clickup_system

# ClickUp API
CLICKUP_API_TOKEN=your_clickup_api_token
CLICKUP_API_BASE_URL=https://api.clickup.com/api/v2
CLICKUP_TEAM_ID=your_team_id

# Server
NODE_ENV=development
PORT=3000

# Sync Settings
SYNC_INTERVAL_MINUTES=15
SYNC_BATCH_SIZE=50
SYNC_MAX_RETRIES=3

# Logging
LOG_LEVEL=INFO
```

### 5. Start the Server

```bash
cd backend
node server-modular.js
```

You should see:
```
[INFO] Database connection established
[INFO] Server started successfully on port 3000
[INFO] API URL: http://localhost:3000
```

### 6. Verify Installation

```bash
# Check health
curl http://localhost:3000/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-XX-XX...",
  "uptime": 12.34,
  "version": "1.0.0"
}
```

---

## API Endpoints

### Programs

```bash
# List all programs
GET /api/programs

# Get program by ID
GET /api/programs/1

# Get program with projects
GET /api/programs/1/projects

# Get program statistics
GET /api/programs/1/stats

# Create program
POST /api/programs
Content-Type: application/json
{
  "name": "New Program",
  "code": "NEWPROG",
  "start_date": "2024-01-01",
  "budget": 100000
}

# Update program
PUT /api/programs/1
{
  "name": "Updated Name",
  "status": "active"
}

# Delete program
DELETE /api/programs/1
```

### Projects

```bash
# List all projects
GET /api/projects

# List projects by program
GET /api/projects?program_id=1

# Get project by ID
GET /api/projects/1

# Get project with activities
GET /api/projects/1/activities

# Get project progress
GET /api/projects/1/progress

# Create project
POST /api/projects
{
  "program_id": 1,
  "name": "New Project",
  "code": "PROJ-001",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "budget": 50000
}

# Update project
PUT /api/projects/1
{
  "progress_percentage": 45,
  "status": "active"
}

# Delete project
DELETE /api/projects/1
```

### M&E Indicators

```bash
# List indicators
GET /api/me/indicators

# Filter by program
GET /api/me/indicators?program_id=1

# Create indicator
POST /api/me/indicators
{
  "program_id": 1,
  "name": "Number of beneficiaries reached",
  "code": "IND-001",
  "type": "output",
  "target_value": 1000,
  "unit_of_measure": "number"
}

# Record result
POST /api/me/results
{
  "indicator_id": 1,
  "reporting_period_start": "2024-01-01",
  "reporting_period_end": "2024-01-31",
  "value": 150,
  "collection_date": "2024-02-01"
}

# Get indicator performance
GET /api/me/indicators/1/performance

# Get M&E dashboard
GET /api/me/dashboard
```

### Sync Operations

```bash
# Get sync status
GET /api/sync/status

# Get pending queue
GET /api/sync/queue

# Trigger pull from ClickUp
POST /api/sync/pull

# Trigger push to ClickUp
POST /api/sync/push
```

---

## Module Structure

```
backend/
├── core/
│   ├── database/
│   │   └── connection.js         # Database connection manager
│   └── utils/
│       ├── logger.js             # Application logger
│       └── response.js           # API response helper
│
├── modules/
│   ├── programs/                 # Program management
│   │   ├── program.repository.js # Data access
│   │   ├── program.service.js    # Business logic
│   │   ├── program.controller.js # HTTP handlers
│   │   ├── program.validator.js  # Input validation
│   │   └── program.routes.js     # API routes
│   │
│   ├── projects/                 # Project management
│   │   ├── project.repository.js
│   │   ├── project.service.js
│   │   ├── project.controller.js
│   │   └── project.routes.js
│   │
│   ├── sync/                     # Sync engine
│   │   ├── sync.service.js
│   │   ├── sync.controller.js
│   │   └── sync.routes.js
│   │
│   └── me/                       # M&E system
│       ├── me.service.js
│       ├── me.controller.js
│       └── me.routes.js
│
└── server-modular.js             # Main server entry
```

---

## Development Workflow

### Adding a New Module

1. **Create module directory:**
```bash
mkdir -p backend/modules/newmodule
```

2. **Create module files:**
```bash
touch backend/modules/newmodule/newmodule.repository.js
touch backend/modules/newmodule/newmodule.service.js
touch backend/modules/newmodule/newmodule.controller.js
touch backend/modules/newmodule/newmodule.routes.js
```

3. **Implement following pattern:**
   - Repository: Database queries
   - Service: Business logic
   - Controller: HTTP request handling
   - Routes: Endpoint definitions

4. **Register in server:**
```javascript
// backend/server-modular.js
const newModuleRoutes = require('./modules/newmodule/newmodule.routes');
app.use('/api/newmodule', newModuleRoutes);
```

---

## Database Management

### Running Migrations

```bash
cd database
node migrate.js
```

### Seeding Data

```bash
node seed.js
```

### Backup Database

```bash
./database/backup.sh
```

### Restore Database

```bash
mysql -u root -p me_clickup_system < backup_file.sql
```

---

## Testing

### Manual Testing

Use the provided API endpoints with curl or Postman:

```bash
# Test program creation
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Program",
    "code": "TEST",
    "start_date": "2024-01-01"
  }'
```

### Database Testing

```bash
# Check if programs are created
mysql -u root -p me_clickup_system -e "SELECT * FROM programs;"

# Check sync queue
mysql -u root -p me_clickup_system -e "SELECT * FROM sync_queue ORDER BY created_at DESC LIMIT 5;"
```

---

## Troubleshooting

### Database Connection Failed

```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p

# Verify credentials in config/.env
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in config/.env
PORT=3001
```

### Sync Not Working

```bash
# Check sync queue
curl http://localhost:3000/api/sync/queue

# Check sync status
curl http://localhost:3000/api/sync/status

# Check logs
tail -f logs/app.log
```

---

## Production Deployment

### Using Docker

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Manual Deployment

```bash
# Set environment to production
export NODE_ENV=production

# Install production dependencies only
npm install --production

# Start with PM2
npm install -g pm2
pm2 start backend/server-modular.js --name me-api

# View logs
pm2 logs me-api

# Monitor
pm2 monit
```

---

## Security Checklist

- [ ] Change default database password
- [ ] Use strong ClickUp API token
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Restrict CORS origins
- [ ] Use environment variables for secrets

---

## Monitoring

### Logs Location

```
logs/
├── app.log         # All logs
├── error.log       # Error logs only
└── monitor.log     # Monitoring logs
```

### View Logs

```bash
# Live tail
tail -f logs/app.log

# Filter errors
grep ERROR logs/app.log

# Last 100 lines
tail -n 100 logs/app.log
```

---

## Support

For issues and questions:
1. Check logs: `logs/app.log`
2. Review documentation: `docs/`
3. Check database: `mysql -u root -p me_clickup_system`
4. Test endpoints: Use curl or Postman

---

## Next Steps

1. ✅ Install and setup complete
2. ⬜ Configure ClickUp integration
3. ⬜ Create programs and projects
4. ⬜ Set up M&E indicators
5. ⬜ Configure sync schedule
6. ⬜ Train users
7. ⬜ Deploy to production
