# RBAC + RLS Setup Guide

## Phase 1: Authentication & Authorization - COMPLETED ✅

This guide will help you set up the Role-Based Access Control (RBAC) and Row-Level Security (RLS) system for the M&E application.

---

## 1. Database Migrations

### Run the SQL migrations to create tables and seed data:

```bash
# Navigate to database migrations folder
cd /home/user/clickup-sync/database/migrations

# Run migrations (in order)
mysql -u root -p me_clickup_system < 001_create_rbac_tables.sql
mysql -u root -p me_clickup_system < 002_seed_roles_and_permissions.sql
```

### What these migrations do:

**001_create_rbac_tables.sql:**
- ✅ Extends `users` table with `is_system_admin` flag
- ✅ Creates `roles` table (11 predefined roles)
- ✅ Creates `permissions` table (45+ granular permissions)
- ✅ Creates `role_permissions` table (role-permission mapping)
- ✅ Creates `user_roles` table (user-role assignment)
- ✅ Creates `user_module_assignments` table (RLS for modules)
- ✅ Creates `user_hierarchy` table (supervisor-subordinate relationships)
- ✅ Creates `user_sessions` table (JWT token management)
- ✅ Creates `access_audit_log` table (security audit trail)
- ✅ Adds `created_by`, `owned_by`, `last_modified_by` to activities, verifications, indicators

**002_seed_roles_and_permissions.sql:**
- ✅ Seeds all 11 roles with descriptions
- ✅ Seeds 45+ permissions across all resources
- ✅ Maps permissions to appropriate roles
- ✅ Migrates existing users from old ENUM roles to new role system

---

## 2. Roles & Permissions Overview

### System-Level Roles (Global Access)

| Role | Level | Description |
|------|-------|-------------|
| **System Administrator** | 1 | Full system access and configuration |
| **M&E Director** | 2 | Director-level access across all modules |
| **M&E Manager** | 3 | Manager-level access across all modules |
| **Finance Officer** | 4 | Access to budget and financial data |
| **Report Viewer** | 5 | Read-only access to reports |

### Module-Level Roles (Scoped to Modules)

| Role | Level | Description |
|------|-------|-------------|
| **Module Manager** | 3 | Full control within assigned modules |
| **Module Coordinator** | 4 | Coordinate activities within modules |
| **Verification Officer** | 5 | Manage verification and evidence |
| **Field Officer** | 6 | Field-level data collection and entry |
| **Data Entry Clerk** | 8 | Basic data entry only |
| **Module Viewer** | 9 | Read-only access to module data |

### Permission Categories

- **Activities**: create, read, update, delete, approve, reject, submit
- **Verifications**: create, read, update, delete, verify, reject
- **Indicators**: create, read, update, delete
- **Settings**: view, manage
- **Users**: create, read, update, delete, manage_roles
- **Reports**: view, export
- **Budget**: view, update
- **Modules**: read, manage

---

## 3. API Endpoints

### Authentication Endpoints (Public - No Auth Required)

```javascript
// Register new user
POST /api/auth/register
Body: { username, email, password, full_name, role }

// Login
POST /api/auth/login
Body: { email, password }
Response: { user, token, refreshToken }

// Refresh access token
POST /api/auth/refresh
Body: { refreshToken }
```

### Protected Endpoints (Require Authentication)

```javascript
// Get current user
GET /api/auth/me
Headers: { Authorization: 'Bearer <token>' }

// Logout
POST /api/auth/logout
Headers: { Authorization: 'Bearer <token>' }

// Check permission
POST /api/auth/check-permission
Headers: { Authorization: 'Bearer <token>' }
Body: { resource, action }
```

---

## 4. Frontend Integration

### Store tokens after login:

```typescript
// Login successful
localStorage.setItem('token', data.data.token);
localStorage.setItem('refreshToken', data.data.refreshToken);
localStorage.setItem('user', JSON.stringify(data.data.user));
```

### Include token in API requests:

```typescript
fetch('/api/activities', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

### Access user data:

```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User roles:', user.roles);
console.log('User permissions:', user.permissions);
console.log('Module assignments:', user.module_assignments);
```

---

## 5. Using Authentication Middleware

### Protect routes in backend:

```javascript
const { authMiddleware, requirePermission, requireRole } = require('./middleware/auth.middleware');

// Require authentication
router.get('/protected', authMiddleware(authService), (req, res) => {
  res.json({ user: req.user });
});

// Require specific permission
router.post('/activities',
  authMiddleware(authService),
  requirePermission('activities', 'create'),
  (req, res) => {
    // Create activity
  }
);

// Require specific role
router.get('/admin',
  authMiddleware(authService),
  requireRole('system_admin', 'me_director'),
  (req, res) => {
    // Admin only
  }
);
```

---

## 6. Row-Level Security (RLS)

### Module-based filtering:

Users only see data from their assigned modules. To assign modules to a user:

```sql
INSERT INTO user_module_assignments (user_id, module_id, can_view, can_create, can_edit, can_approve)
VALUES (1, 1, true, true, true, false);
```

### Ownership-based filtering:

Field officers only see their own data:

```sql
-- Activities are filtered by created_by or owned_by
SELECT * FROM activities WHERE created_by = ? OR owned_by = ?
```

### Example RLS implementation in route:

```javascript
router.get('/activities', authMiddleware(authService), async (req, res) => {
  const user = req.user;
  let query = 'SELECT * FROM activities WHERE deleted_at IS NULL';

  // System admins see all
  if (!user.is_system_admin) {
    // Module-level users only see their modules
    const moduleIds = user.module_assignments.map(m => m.module_id);
    query += ` AND module_id IN (${moduleIds.join(',')})`;

    // Field officers only see their own
    if (user.roles.some(r => r.name === 'field_officer')) {
      query += ` AND (created_by = ${user.id} OR approval_status != 'draft')`;
    }
  }

  const activities = await db.query(query);
  res.json({ data: activities });
});
```

---

## 7. Testing the System

### 1. Create a test user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "field_officer"
  }'
```

### 2. Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access protected endpoint:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 8. Security Best Practices

✅ **JWT Secret**: Change `JWT_SECRET` in production (.env file)
✅ **Password Hashing**: Uses bcrypt with 10 salt rounds
✅ **Token Expiry**: Access tokens expire in 24 hours, refresh tokens in 7 days
✅ **Session Management**: Tokens stored in database for revocation
✅ **Audit Logging**: All access attempts logged in `access_audit_log`
✅ **HTTPS**: Use HTTPS in production for secure token transmission
✅ **CORS**: Configure CORS properly for your frontend domain

---

## 9. Next Steps

- [ ] Add Login page to frontend routing
- [ ] Create protected route wrapper component
- [ ] Add user profile page
- [ ] Add user management UI (admin only)
- [ ] Add role assignment UI (admin only)
- [ ] Add module assignment UI (admin only)
- [ ] Integrate RLS filters into all existing routes
- [ ] Add permission checks to frontend components
- [ ] Create audit log viewer (admin only)

---

## 10. Troubleshooting

### Issue: "Invalid token"
- **Solution**: Token may have expired. Use refresh token to get new access token.

### Issue: "Permission denied"
- **Solution**: Check user's roles and permissions. May need to assign proper role or module.

### Issue: "Session expired"
- **Solution**: Login again. Sessions are valid for 24 hours.

### Issue: "Cannot read properties of undefined (reading 'roles')"
- **Solution**: Ensure user data is loaded before accessing roles/permissions.

---

## Support

For issues or questions, contact your system administrator.

**Current Status**: ✅ Phase 1 Complete - Backend Auth & RBAC System Ready
**Next Phase**: Frontend Login Integration & Protected Routes
