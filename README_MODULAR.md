# M&E Project Management System
## Integrated ClickUp Sync with Offline-First Architecture

A comprehensive Monitoring & Evaluation (M&E) project management system integrated with ClickUp, featuring modular architecture, offline-first data storage, and bidirectional synchronization.

---

## 🌟 Key Features

### Core Capabilities
- ✅ **5 Standard M&E Programs** (Health, Education, WASH, Protection, Emergency)
- ✅ **Hierarchical Project Structure** (Programs → Projects → Activities → Tasks)
- ✅ **Offline-First Architecture** (Local storage with later sync to ClickUp)
- ✅ **Bidirectional Sync** (Push local changes, pull ClickUp updates)
- ✅ **M&E Integration** (Indicators, targets, results, reports)
- ✅ **Conflict Resolution** (Smart detection and user-driven resolution)
- ✅ **Modular Codebase** (Clean separation of concerns for easy maintenance)

### Technical Features
- 🔄 **Queue-Based Sync** - Operations queued for reliable syncing
- 📊 **Comprehensive Dashboards** - Program, project, and M&E dashboards
- 🔍 **Audit Trail** - Complete change history and sync logs
- 🎯 **Smart Mapping** - Local entities mapped to ClickUp (Spaces, Folders, Lists)
- 🛡️ **Conflict Management** - Timestamp-based conflict detection
- 📈 **Progress Tracking** - Real-time project and activity progress
- 🗄️ **38+ Database Tables** - Comprehensive data model

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React)                        │
│  Programs | Projects | Tasks | M&E | Sync Dashboard    │
└─────────────────────────────────────────────────────────┘
                          ↕ API
┌─────────────────────────────────────────────────────────┐
│            Backend (Node.js/Express - Modular)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Programs │  │ Projects │  │   Sync   │  │   M&E   ││
│  │  Module  │  │  Module  │  │  Engine  │  │  Module ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              MySQL Database (38+ Tables)                 │
│  Programs | Projects | Activities | Indicators | Sync   │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   ClickUp API                            │
│     Spaces | Folders | Lists | Tasks | Custom Fields    │
└─────────────────────────────────────────────────────────┘
```

### Data Mapping

```
Local Database          ←→    ClickUp
─────────────────             ─────────────
Programs (5)            ←→    Spaces
  └─ Projects           ←→    Folders
      └─ Activities     ←→    Lists
          └─ Tasks      ←→    Tasks
              └─ Indicators ←→ Custom Fields
```

---

## 📁 Project Structure

```
clickup-sync/
│
├── backend/
│   ├── core/                      # Core infrastructure
│   │   ├── database/
│   │   │   └── connection.js      # MySQL connection pool
│   │   └── utils/
│   │       ├── logger.js          # Application logging
│   │       └── response.js        # API response helpers
│   │
│   ├── modules/                   # Modular components
│   │   ├── programs/              # Program management
│   │   │   ├── program.repository.js
│   │   │   ├── program.service.js
│   │   │   ├── program.controller.js
│   │   │   ├── program.validator.js
│   │   │   └── program.routes.js
│   │   │
│   │   ├── projects/              # Project management
│   │   │   ├── project.repository.js
│   │   │   ├── project.service.js
│   │   │   ├── project.controller.js
│   │   │   └── project.routes.js
│   │   │
│   │   ├── sync/                  # Sync engine
│   │   │   ├── sync.service.js
│   │   │   ├── sync.controller.js
│   │   │   └── sync.routes.js
│   │   │
│   │   └── me/                    # M&E system
│   │       ├── me.service.js
│   │       ├── me.controller.js
│   │       └── me.routes.js
│   │
│   └── server-modular.js          # Main server entry
│
├── database/
│   ├── me_enhanced_schema.sql     # Enhanced schema with M&E
│   ├── clickup_schema.sql         # Original ClickUp schema
│   ├── migrate.js                 # Migration runner
│   └── seed.js                    # Data seeder
│
├── frontend/                      # React frontend
│   └── src/
│       ├── components/
│       └── App.tsx
│
├── docs/
│   ├── ARCHITECTURE.md            # Architecture documentation
│   ├── DATABASE_SCHEMA.md         # Database schema details
│   └── SETUP_GUIDE.md             # Setup instructions
│
├── config/
│   └── .env                       # Environment configuration
│
└── README_MODULAR.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- ClickUp account with API token

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd clickup-sync

# 2. Install dependencies
cd backend
npm install

# 3. Setup database
mysql -u root -p
CREATE DATABASE me_clickup_system;
exit

mysql -u root -p me_clickup_system < ../database/me_enhanced_schema.sql

# 4. Configure environment
cp ../config/.env.example ../config/.env
# Edit .env with your credentials

# 5. Start server
node server-modular.js
```

### Verify Installation

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-XX-XX...",
  "uptime": 12.34,
  "version": "1.0.0"
}
```

---

## 📖 API Documentation

### Programs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | List all programs |
| GET | `/api/programs/:id` | Get program by ID |
| GET | `/api/programs/:id/projects` | Get program with projects |
| GET | `/api/programs/:id/stats` | Get program statistics |
| GET | `/api/programs/dashboard` | Get programs dashboard |
| POST | `/api/programs` | Create new program |
| PUT | `/api/programs/:id` | Update program |
| DELETE | `/api/programs/:id` | Delete program |

### Projects API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects?program_id=1` | Filter by program |
| GET | `/api/projects/:id` | Get project by ID |
| GET | `/api/projects/:id/activities` | Get project with activities |
| GET | `/api/projects/:id/progress` | Get project progress |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### M&E API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/dashboard` | M&E dashboard |
| GET | `/api/me/indicators` | List indicators |
| GET | `/api/me/indicators/:id` | Get indicator |
| GET | `/api/me/indicators/:id/performance` | Get achievement |
| POST | `/api/me/indicators` | Create indicator |
| POST | `/api/me/results` | Record result |
| POST | `/api/me/reports` | Generate report |

### Sync API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sync/status` | Get sync status |
| GET | `/api/sync/queue` | Get pending operations |
| POST | `/api/sync/pull` | Trigger pull from ClickUp |
| POST | `/api/sync/push` | Trigger push to ClickUp |

---

## 💾 Database Schema

### Core Tables

1. **programs** - M&E programs (5 default)
2. **projects** - Projects within programs
3. **activities** - Activities within projects
4. **tasks** - Tasks within activities

### M&E Tables

5. **me_indicators** - M&E indicators
6. **me_results** - Results/achievements
7. **me_reports** - Generated reports

### Sync Tables

8. **sync_queue** - Pending sync operations
9. **sync_conflicts** - Detected conflicts
10. **sync_status** - Entity sync status
11. **sync_log** - Audit trail
12. **clickup_mapping** - Local ↔ ClickUp ID mapping

**Total: 38+ tables** (includes ClickUp integration tables)

See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for complete schema.

---

## 🔄 Sync Workflow

### Offline-First Flow

```
1. User creates/edits entity locally
   ↓
2. Saved to local database immediately
   ↓
3. Operation queued in sync_queue (pending)
   ↓
4. User can continue working (offline-first)
   ↓
5. Sync engine processes queue (periodic or manual)
   ↓
6. Pushes to ClickUp API
   ↓
7. Updates mapping and sync_status
```

### Conflict Resolution

```
1. Pull update from ClickUp
   ↓
2. Compare timestamps (local vs ClickUp)
   ↓
3. If conflict detected:
   ├─ Record in sync_conflicts
   ├─ Mark entity sync_status = 'conflict'
   └─ User resolves via UI:
       ├─ local_wins
       ├─ clickup_wins
       └─ manual_merge
   ↓
4. Apply resolution and sync
```

---

## 🎯 5 Caritas Programs

The system comes with 5 predefined M&E programs:

1. **🌾 Food & Environment** (`FOOD_ENV`) - Sustainable agriculture, food security, and environmental conservation
2. **💼 Socio-Economic** (`SOCIO_ECON`) - Economic empowerment, livelihoods, and poverty alleviation
3. **👥 Gender & Youth** (`GENDER_YOUTH`) - Gender equality, youth empowerment, and social inclusion
4. **🏥 Relief Services** (`RELIEF`) - Emergency relief, health services, and humanitarian assistance
5. **🎓 Capacity Building** (`CAPACITY`) - Training, institutional strengthening, and skills development

Each program is mapped to a ClickUp Space.

---

## 🧩 Modular Design Principles

### 1. Separation of Concerns

Each module follows a clear pattern:

```
Module/
├── repository.js   # Database queries
├── service.js      # Business logic
├── controller.js   # HTTP request handling
├── validator.js    # Input validation (optional)
└── routes.js       # Endpoint definitions
```

### 2. Benefits

- ✅ **Easy to Maintain** - Each module is independent
- ✅ **Easy to Test** - Mock dependencies at each layer
- ✅ **Easy to Extend** - Add new modules without affecting existing code
- ✅ **Clear Responsibilities** - Each layer has one job
- ✅ **Scalable** - Modules can be moved to microservices if needed

### 3. Adding New Modules

```bash
# Create module structure
mkdir backend/modules/newmodule
cd backend/modules/newmodule

# Create files
touch newmodule.repository.js
touch newmodule.service.js
touch newmodule.controller.js
touch newmodule.routes.js

# Register in server
# Edit backend/server-modular.js
const newModuleRoutes = require('./modules/newmodule/newmodule.routes');
app.use('/api/newmodule', newModuleRoutes);
```

---

## 📊 Example Usage

### Create a Program

```bash
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Environment",
    "code": "FOOD_ENV",
    "icon": "🌾",
    "description": "Sustainable agriculture and food security",
    "start_date": "2024-01-01",
    "budget": 500000,
    "status": "active"
  }'
```

### Create a Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": 1,
    "name": "Sustainable Farming Initiative",
    "code": "FOOD_ENV-001",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "budget": 100000
  }'
```

### Create an Indicator

```bash
curl -X POST http://localhost:3000/api/me/indicators \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": 1,
    "name": "Number of farmers trained in sustainable agriculture",
    "code": "IND-FOOD_ENV-001",
    "type": "output",
    "target_value": 500,
    "unit_of_measure": "number"
  }'
```

### Record a Result

```bash
curl -X POST http://localhost:3000/api/me/results \
  -H "Content-Type: application/json" \
  -d '{
    "indicator_id": 1,
    "reporting_period_start": "2024-01-01",
    "reporting_period_end": "2024-01-31",
    "value": 85,
    "collection_date": "2024-02-01"
  }'
```

---

## 🔧 Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=me_clickup_system

# ClickUp
CLICKUP_API_TOKEN=your_token
CLICKUP_API_BASE_URL=https://api.clickup.com/api/v2
CLICKUP_TEAM_ID=your_team_id

# Server
NODE_ENV=development
PORT=3000

# Sync
SYNC_INTERVAL_MINUTES=15
SYNC_BATCH_SIZE=50
SYNC_MAX_RETRIES=3
```

---

## 📚 Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Detailed architecture overview
- [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) - Complete schema documentation
- [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) - Step-by-step setup guide

---

## 🛠️ Development

### Running Tests

```bash
npm test
```

### View Logs

```bash
# Real-time logs
tail -f logs/app.log

# Errors only
tail -f logs/error.log
```

### Database Backup

```bash
./database/backup.sh
```

---

## 🚢 Deployment

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

```bash
# Install PM2
npm install -g pm2

# Start server
cd backend
pm2 start server-modular.js --name me-api

# View logs
pm2 logs me-api

# Monitor
pm2 monit
```

---

## 🤝 Contributing

1. Follow the modular pattern for new features
2. Each module should have repository, service, controller, routes
3. Write clear, self-documenting code
4. Add appropriate logging
5. Update documentation

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

Built for Caritas M&E system integration with ClickUp project management.

---

## 📞 Support

For issues and questions:
1. Check `docs/` directory
2. Review `logs/app.log`
3. Test endpoints with curl or Postman
4. Check database for sync status

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Production Ready ✅
