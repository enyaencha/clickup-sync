# M&E Project Management System - Architecture

## Overview

This system integrates Monitoring & Evaluation (M&E) with ClickUp project management, featuring:
- **5 Programs** mapped to ClickUp Spaces
- **Projects within Programs** for granular management
- **Offline-first** local storage with later sync to ClickUp
- **Modular architecture** for easy maintenance and extension

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Programs │  │ Projects │  │   Tasks  │  │ M&E      │   │
│  │ Dashboard│  │ Manager  │  │ Manager  │  │ Reports  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Programs │  │ Projects │  │   Sync   │  │   M&E    │   │
│  │   API    │  │   API    │  │   API    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Program    │  │   Project    │  │     Sync     │     │
│  │   Service    │  │   Service    │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     M&E      │  │   Storage    │  │   ClickUp    │     │
│  │   Service    │  │   Service    │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Data Access Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Program    │  │   Project    │  │    Task      │     │
│  │  Repository  │  │  Repository  │  │  Repository  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │     M&E      │  │     Sync     │                        │
│  │  Repository  │  │  Repository  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer (MySQL)                     │
│                                                              │
│  Core Tables: programs, projects, tasks, activities         │
│  M&E Tables: indicators, targets, results, reports          │
│  Sync Tables: sync_operations, sync_conflicts, queue        │
│  Mapping: clickup_mapping (local ↔ ClickUp IDs)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Program → Space Mapping

```
Program (M&E Concept)           →    Space (ClickUp)
├── Projects                    →    Folders
│   ├── Activities              →    Lists
│   │   ├── Tasks               →    Tasks
│   │   └── Deliverables        →    Tasks (custom type)
│   └── Indicators              →    Custom Fields
└── Results                     →    Goals
```

### 5 Caritas Programs

1. **🌾 Food & Environment** - Sustainable agriculture and environmental conservation
2. **💼 Socio-Economic** - Economic empowerment and poverty alleviation
3. **👥 Gender & Youth** - Gender equality and youth empowerment
4. **🏥 Relief Services** - Emergency relief and health services
5. **🎓 Capacity Building** - Training and institutional strengthening

---

## Module Structure

### Backend Modules

```
backend/
├── modules/
│   ├── programs/               # Program Management
│   │   ├── program.controller.js
│   │   ├── program.service.js
│   │   ├── program.repository.js
│   │   ├── program.routes.js
│   │   └── program.validator.js
│   │
│   ├── projects/               # Project Management
│   │   ├── project.controller.js
│   │   ├── project.service.js
│   │   ├── project.repository.js
│   │   ├── project.routes.js
│   │   └── project.validator.js
│   │
│   ├── tasks/                  # Task Management
│   │   ├── task.controller.js
│   │   ├── task.service.js
│   │   ├── task.repository.js
│   │   ├── task.routes.js
│   │   └── task.validator.js
│   │
│   ├── me/                     # M&E System
│   │   ├── indicator.controller.js
│   │   ├── indicator.service.js
│   │   ├── indicator.repository.js
│   │   ├── result.controller.js
│   │   ├── result.service.js
│   │   ├── result.repository.js
│   │   ├── me.routes.js
│   │   └── report.generator.js
│   │
│   ├── sync/                   # Sync Engine
│   │   ├── sync.controller.js
│   │   ├── sync.service.js
│   │   ├── sync.repository.js
│   │   ├── sync.routes.js
│   │   ├── queue.manager.js
│   │   └── conflict.resolver.js
│   │
│   ├── storage/                # Local Storage
│   │   ├── storage.service.js
│   │   ├── cache.manager.js
│   │   └── offline.handler.js
│   │
│   └── clickup/                # ClickUp Integration
│       ├── clickup.client.js
│       ├── clickup.mapper.js
│       ├── clickup.webhook.js
│       └── rate.limiter.js
│
├── core/                       # Core Infrastructure
│   ├── database/
│   │   ├── connection.js
│   │   ├── transaction.js
│   │   └── migrations/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.handler.js
│   │   ├── validator.js
│   │   └── logger.js
│   └── utils/
│       ├── logger.js
│       ├── response.js
│       └── helpers.js
│
└── server.js                   # Application Entry Point
```

---

## Data Flow

### Creating a New Task (Offline → Online)

```
1. User creates task in UI (offline)
   ↓
2. Frontend → POST /api/tasks
   ↓
3. TaskController → TaskService
   ↓
4. TaskService:
   - Creates task in local DB
   - Queues sync operation (pending)
   - Returns immediately to user
   ↓
5. SyncEngine (periodic or manual):
   - Processes queue
   - Calls ClickUpClient
   - Updates task with clickup_id
   - Marks sync operation as completed
   ↓
6. Task now available in both local DB and ClickUp
```

### Pulling ClickUp Updates

```
1. SyncEngine triggers pull (cron or manual)
   ↓
2. SyncService.pullUpdates():
   - Fetches from ClickUp API
   - Checks last_sync_at timestamp
   ↓
3. For each entity:
   - Compare timestamps (conflict detection)
   - If no conflict → Update local DB
   - If conflict → Create conflict record
   ↓
4. Update sync_status table
   ↓
5. Emit event to frontend (if needed)
```

---

## Database Schema Overview

### Core M&E Tables

| Table | Purpose |
|-------|---------|
| `programs` | 5 main programs (mapped to ClickUp spaces) |
| `projects` | Projects within programs (mapped to folders) |
| `activities` | Activity lists within projects (mapped to lists) |
| `me_indicators` | M&E indicators and metrics |
| `me_targets` | Target values for indicators |
| `me_results` | Actual results/achievements |
| `me_reports` | Generated M&E reports |

### Sync & Mapping Tables

| Table | Purpose |
|-------|---------|
| `clickup_mapping` | Maps local IDs to ClickUp IDs |
| `sync_queue` | Pending operations for sync |
| `sync_conflicts` | Detected conflicts needing resolution |
| `sync_status` | Current sync state per entity |
| `sync_log` | Audit trail of all sync operations |

### ClickUp Tables (Existing)

| Table | Purpose |
|-------|---------|
| `spaces` | ClickUp spaces (linked to programs) |
| `folders` | ClickUp folders (linked to projects) |
| `lists` | ClickUp lists (linked to activities) |
| `tasks` | ClickUp tasks |
| `custom_fields` | Custom fields (for indicators) |

---

## Key Design Principles

### 1. **Separation of Concerns**
- Each module handles ONE responsibility
- Clear boundaries between layers
- Independent testing possible

### 2. **Offline-First**
- All operations save locally first
- Queue for later sync
- User never blocked by network

### 3. **Conflict Resolution**
- Timestamp-based detection
- User-driven resolution via UI
- Strategies: local_wins, remote_wins, merge

### 4. **Modularity**
- Each module can be updated independently
- Clear interfaces between modules
- Easy to add new features

### 5. **Scalability**
- Queue-based sync processing
- Rate limiting for API calls
- Efficient database indexing

---

## API Endpoints

### Programs
```
GET    /api/programs              - List all programs
GET    /api/programs/:id          - Get program details
POST   /api/programs              - Create program
PUT    /api/programs/:id          - Update program
DELETE /api/programs/:id          - Delete program
GET    /api/programs/:id/projects - Get program projects
GET    /api/programs/:id/stats    - Get program statistics
```

### Projects
```
GET    /api/projects              - List all projects
GET    /api/projects/:id          - Get project details
POST   /api/projects              - Create project
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
GET    /api/projects/:id/tasks    - Get project tasks
GET    /api/projects/:id/progress - Get project progress
```

### M&E System
```
GET    /api/me/indicators         - List indicators
POST   /api/me/indicators         - Create indicator
PUT    /api/me/indicators/:id     - Update indicator
GET    /api/me/results            - List results
POST   /api/me/results            - Record result
GET    /api/me/reports/:type      - Generate report
GET    /api/me/dashboard          - M&E dashboard data
```

### Sync
```
POST   /api/sync/pull             - Pull from ClickUp
POST   /api/sync/push             - Push to ClickUp
GET    /api/sync/status           - Get sync status
GET    /api/sync/queue            - View sync queue
POST   /api/sync/resolve/:id      - Resolve conflict
GET    /api/sync/conflicts        - List conflicts
```

---

## Frontend Components

```
frontend/src/
├── modules/
│   ├── programs/
│   │   ├── ProgramList.jsx
│   │   ├── ProgramCard.jsx
│   │   ├── ProgramForm.jsx
│   │   └── ProgramDashboard.jsx
│   │
│   ├── projects/
│   │   ├── ProjectList.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ProjectGantt.jsx
│   │   └── ProjectKanban.jsx
│   │
│   ├── tasks/
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   └── TaskDetail.jsx
│   │
│   ├── me/
│   │   ├── IndicatorList.jsx
│   │   ├── ResultForm.jsx
│   │   ├── ReportViewer.jsx
│   │   └── MEDashboard.jsx
│   │
│   └── sync/
│       ├── SyncStatus.jsx
│       ├── ConflictResolver.jsx
│       └── SyncQueue.jsx
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── services/
│
└── App.jsx
```

---

## Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=me_clickup_system

# ClickUp
CLICKUP_API_TOKEN=encrypted_token
CLICKUP_API_BASE_URL=https://api.clickup.com/api/v2
CLICKUP_TEAM_ID=your_team_id

# Sync Settings
SYNC_INTERVAL_MINUTES=15
SYNC_BATCH_SIZE=50
SYNC_MAX_RETRIES=3
SYNC_RETRY_DELAY_MS=1000

# Storage
LOCAL_STORAGE_PATH=./data/local
CACHE_TTL_MINUTES=60

# M&E Settings
ME_DEFAULT_PROGRAMS=5
ME_REPORT_FORMATS=pdf,excel,json
```

---

## Security Considerations

1. **Authentication**: JWT-based auth for API access
2. **Authorization**: Role-based access control (RBAC)
3. **API Token Encryption**: AES-256 for ClickUp tokens
4. **Input Validation**: All inputs validated before processing
5. **SQL Injection Prevention**: Parameterized queries only
6. **Rate Limiting**: Prevent API abuse

---

## Performance Optimizations

1. **Database Indexing**: Strategic indexes on foreign keys and search fields
2. **Caching**: Redis cache for frequently accessed data
3. **Lazy Loading**: Load data on-demand in UI
4. **Pagination**: All list endpoints support pagination
5. **Batch Operations**: Bulk sync for efficiency
6. **Connection Pooling**: Database connection reuse

---

## Monitoring & Logging

### Metrics Tracked
- Sync success/failure rates
- API response times
- Database query performance
- Queue depth
- Conflict count
- Active users

### Log Levels
- **ERROR**: Critical failures
- **WARN**: Potential issues
- **INFO**: Normal operations
- **DEBUG**: Detailed debugging

---

## Future Enhancements

1. **Real-time Collaboration**: WebSocket for live updates
2. **Mobile App**: React Native mobile client
3. **Advanced Reporting**: Custom report builder
4. **Workflow Automation**: Trigger-based actions
5. **Integration APIs**: Connect with other M&E systems
6. **AI Insights**: Predictive analytics for M&E data
