# Finance Routes SQL Parameter Fix

## Problem
The error "Incorrect arguments to mysqld_stmt_execute" occurs because `limit` and `offset`
query parameters can be undefined or empty strings, which become `NaN` when parsed.

## Solution
Apply these changes to `backend/routes/finance.routes.js`:

---

## Fix 1: GET /api/finance/budgets (around line 56)

**FIND:**
```javascript
router.get('/budgets', async (req, res) => {
    try {
        const {
            program_module_id,
            fiscal_year,
            status,
            limit = 50,
            offset = 0
        } = req.query;
```

**REPLACE WITH:**
```javascript
router.get('/budgets', async (req, res) => {
    try {
        const {
            program_module_id,
            fiscal_year,
            status
        } = req.query;

        // Safely parse limit and offset with defaults
        const limit = Math.max(1, parseInt(req.query.limit) || 50);
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
```

**THEN FIND (around line 100):**
```javascript
params.push(parseInt(limit), parseInt(offset));
```

**REPLACE WITH:**
```javascript
params.push(limit, offset);
```

---

## Fix 2: GET /api/finance/transactions (around line 178)

**FIND:**
```javascript
router.get('/transactions', async (req, res) => {
    try {
        const {
            program_budget_id,
            approval_status,
            verification_status,
            start_date,
            end_date,
            limit = 10,
            offset = 0
        } = req.query;
```

**REPLACE WITH:**
```javascript
router.get('/transactions', async (req, res) => {
    try {
        const {
            program_budget_id,
            approval_status,
            verification_status,
            start_date,
            end_date
        } = req.query;

        // Safely parse limit and offset with defaults
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
```

**THEN FIND (around line 237):**
```javascript
params.push(parseInt(limit), parseInt(offset));
```

**REPLACE WITH:**
```javascript
params.push(limit, offset);
```

---

## Fix 3: GET /api/finance/approvals (around line 322) **← THIS IS YOUR ERROR**

**FIND:**
```javascript
router.get('/approvals', async (req, res) => {
    try {
        const {
            status,
            request_type,
            priority,
            limit = 50,
            offset = 0
        } = req.query;
```

**REPLACE WITH:**
```javascript
router.get('/approvals', async (req, res) => {
    try {
        const {
            status,
            request_type,
            priority
        } = req.query;

        // Safely parse limit and offset with defaults
        const limit = Math.max(1, parseInt(req.query.limit) || 50);
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
```

**THEN FIND (around line 376):**
```javascript
params.push(parseInt(limit), parseInt(offset));
```

**REPLACE WITH:**
```javascript
params.push(limit, offset);
```

---

## After Making Changes

1. Save the file
2. Restart your backend server: `npm start` or `pm2 restart`
3. Test: Navigate to Finance dashboard - approvals should load without error

## Why This Works

- `Math.max(1, parseInt(req.query.limit) || 50)` ensures limit is always >= 1
- `Math.max(0, parseInt(req.query.offset) || 0)` ensures offset is always >= 0
- If parsing fails, defaults are used (50/10 for limit, 0 for offset)
- No more `NaN` values passed to MySQL
