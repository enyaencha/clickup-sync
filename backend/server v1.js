// ============================
// CLICKUP SYNC ENGINE - CORE BACKEND
// ============================
//require('dotenv').config({ path: __dirname + '/config/.env' });
require('dotenv').config({ path: __dirname + '/../config/.env' });

const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const crypto = require('crypto');
const cron = require('node-cron');

// ============================
// ENCRYPTION HELPERS
// ============================
function decrypt(encryptedText) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error("❌ ENCRYPTION_KEY is missing in .env");
    }

    // parse as 32-byte buffer from hex string
    const key = Buffer.from(encryptionKey, 'hex');

    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encrypt(text) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error("❌ ENCRYPTION_KEY is missing in .env");
    }

    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}


// ============================
// DATABASE CONNECTION
// ============================

class DatabaseManager {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'test',
            database: process.env.DB_NAME || 'clickup_sync',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(sql, params = []) {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }

    async transaction(callback) {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();

        try {
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

// ============================
// CLICKUP API CLIENT
// ============================

class ClickUpAPI {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseURL = 'https://api.clickup.com/api/v2';
        this.rateLimitDelay = 1000; // 1 second between requests
        this.lastRequestTime = 0;
    }

    async makeRequest(method, endpoint, data = null) {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve =>
                setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
            );
        }

        const config = {
            method,
            url: `${this.baseURL}${endpoint}`,
            headers: {
                'Authorization': this.apiToken,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        };

        if (data) {
            config.data = data;
        }

        this.lastRequestTime = Date.now();

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`ClickUp API Error: ${error.response.status} - ${error.response.data?.err || error.response.statusText}`);
            }
            throw error;
        }
    }

    // Teams
    async getTeams() {
        return await this.makeRequest('GET', '/team');
    }

    // Spaces
    async getSpaces(teamId) {
        return await this.makeRequest('GET', `/team/${teamId}/space`);
    }

    async createSpace(teamId, spaceData) {
        return await this.makeRequest('POST', `/team/${teamId}/space`, spaceData);
    }

    // Folders
    async getFolders(spaceId) {
        return await this.makeRequest('GET', `/space/${spaceId}/folder`);
    }

    // Lists
    async getLists(spaceId, folderless = true) {
        const params = folderless ? '?archived=false' : '';
        return await this.makeRequest('GET', `/space/${spaceId}/list${params}`);
    }

    async getFolderLists(folderId) {
        return await this.makeRequest('GET', `/folder/${folderId}/list`);
    }

    // Tasks
    async getTasks(listId, options = {}) {
        const params = new URLSearchParams(options).toString();
        const endpoint = `/list/${listId}/task${params ? '?' + params : ''}`;
        return await this.makeRequest('GET', endpoint);
    }

    async getTask(taskId) {
        return await this.makeRequest('GET', `/task/${taskId}`);
    }

    async createTask(listId, taskData) {
        return await this.makeRequest('POST', `/list/${listId}/task`, taskData);
    }

    async updateTask(taskId, taskData) {
        return await this.makeRequest('PUT', `/task/${taskId}`, taskData);
    }

    // Comments
    async getComments(taskId) {
        return await this.makeRequest('GET', `/task/${taskId}/comment`);
    }

    async createComment(taskId, commentData) {
        return await this.makeRequest('POST', `/task/${taskId}/comment`, commentData);
    }

    // Time Tracking
    async getTimeEntries(teamId, options = {}) {
        const params = new URLSearchParams(options).toString();
        return await this.makeRequest('GET', `/team/${teamId}/time_entries${params ? '?' + params : ''}`);
    }

    async createTimeEntry(teamId, timeData) {
        return await this.makeRequest('POST', `/team/${teamId}/time_entries`, timeData);
    }
}

// ============================
// SYNC ENGINE CORE
// ============================

class SyncEngine {
    constructor(db, clickupAPI) {
        this.db = db;
        this.clickupAPI = clickupAPI;
        this.isRunning = false;
        this.syncInProgress = new Set();
    }

    async initialize() {
        console.log('Initializing Sync Engine...');
        await this.setupWebhooks();
        this.startPeriodicSync();
        console.log('Sync Engine initialized successfully');
    }

    // ============================
    // PULL SYNC (ClickUp → Local)
    // ============================

    async pullFromClickUp(entityType = null, entityId = null) {
        if (this.isRunning) {
            console.log('Sync already in progress, skipping...');
            return;
        }

        this.isRunning = true;
        const startTime = new Date();
        console.log(`Starting pull sync at ${startTime.toISOString()}`);

        try {
            if (entityType && entityId) {
                await this.pullSpecificEntity(entityType, entityId);
            } else {
                await this.pullAllData();
            }

            await this.db.query(
                'UPDATE sync_config SET last_full_sync = ? WHERE id = 1',
                [startTime]
            );

            console.log(`Pull sync completed successfully in ${Date.now() - startTime.getTime()}ms`);
        } catch (error) {
            console.error('Pull sync failed:', error);
            throw error;
        } finally {
            this.isRunning = false;
        }
    }

    async pullAllData() {
        // Pull in dependency order
        await this.pullTeams();
        await this.pullUsers();
        await this.pullSpaces();
        await this.pullFolders();
        await this.pullLists();
        await this.pullTasks();
        await this.pullComments();
        await this.pullTimeEntries();
    }

    async pullTeams() {
        console.log('Pulling teams...');
        const clickupTeams = await this.clickupAPI.getTeams();

        for (const team of clickupTeams.teams) {
            await this.upsertTeam(team);
        }
    }

    async upsertTeam(clickupTeam) {
        const existingTeam = await this.db.query(
            'SELECT * FROM teams WHERE clickup_id = ?',
            [clickupTeam.id]
        );

        const teamData = {
            name: clickupTeam.name,
            avatar: clickupTeam.avatar,
            color: clickupTeam.color,
            clickup_updated_at: new Date(parseInt(clickupTeam.date_updated))
        };

        if (existingTeam.length === 0) {
            // Create new team
            await this.db.query(`
                INSERT INTO teams (
                    clickup_id, name, avatar, color, 
                    clickup_created_at, clickup_updated_at,
                    sync_status, last_sync_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'synced', NOW())
            `, [
                clickupTeam.id,
                teamData.name,
                teamData.avatar,
                teamData.color,
                new Date(parseInt(clickupTeam.date_created)),
                teamData.clickup_updated_at
            ]);

            console.log(`Created team: ${teamData.name}`);
        } else {
            // Update existing team if ClickUp version is newer
            const existing = existingTeam[0];
            const existingUpdated = new Date(existing.clickup_updated_at);

            if (teamData.clickup_updated_at > existingUpdated) {
                await this.db.query(`
                    UPDATE teams 
                    SET name = ?, avatar = ?, color = ?, 
                        clickup_updated_at = ?, sync_status = 'synced', 
                        last_sync_at = NOW()
                    WHERE clickup_id = ?
                `, [
                    teamData.name,
                    teamData.avatar,
                    teamData.color,
                    teamData.clickup_updated_at,
                    clickupTeam.id
                ]);

                console.log(`Updated team: ${teamData.name}`);
            }
        }
    }

    async pullSpaces() {
        console.log('Pulling spaces...');
        const teams = await this.db.query('SELECT * FROM teams WHERE is_active = true');

        for (const team of teams) {
            try {
                const clickupSpaces = await this.clickupAPI.getSpaces(team.clickup_id);

                for (const space of clickupSpaces.spaces) {
                    await this.upsertSpace(space, team.id);
                }
            } catch (error) {
                console.error(`Failed to pull spaces for team ${team.name}:`, error);
            }
        }
    }

    async upsertSpace(clickupSpace, teamId) {
        const existingSpace = await this.db.query(
            'SELECT * FROM spaces WHERE clickup_id = ?',
            [clickupSpace.id]
        );

        const spaceData = {
            name: clickupSpace.name,
            color: clickupSpace.color,
            avatar: clickupSpace.avatar,
            is_private: clickupSpace.private || false,
            is_archived: clickupSpace.archived || false
        };

        if (existingSpace.length === 0) {
            await this.db.query(`
                INSERT INTO spaces (
                    clickup_id, team_id, name, color, avatar,
                    is_private, is_archived, sync_status, last_sync_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', NOW())
            `, [
                clickupSpace.id,
                teamId,
                spaceData.name,
                spaceData.color,
                spaceData.avatar,
                spaceData.is_private,
                spaceData.is_archived
            ]);

            console.log(`Created space: ${spaceData.name}`);
        } else {
            await this.db.query(`
                UPDATE spaces 
                SET name = ?, color = ?, avatar = ?, is_private = ?, 
                    is_archived = ?, sync_status = 'synced', last_sync_at = NOW()
                WHERE clickup_id = ?
            `, [
                spaceData.name,
                spaceData.color,
                spaceData.avatar,
                spaceData.is_private,
                spaceData.is_archived,
                clickupSpace.id
            ]);
        }
    }

    async pullTasks() {
        console.log('Pulling tasks...');
        const lists = await this.db.query('SELECT * FROM lists WHERE is_active = true');

        for (const list of lists) {
            try {
                const clickupTasks = await this.clickupAPI.getTasks(list.clickup_id, {
                    archived: false,
                    include_closed: true,
                    subtasks: true
                });

                for (const task of clickupTasks.tasks) {
                    await this.upsertTask(task, list.id);
                }
            } catch (error) {
                console.error(`Failed to pull tasks for list ${list.name}:`, error);
            }
        }
    }

    async upsertTask(clickupTask, listId) {
        const existingTask = await this.db.query(
            'SELECT * FROM tasks WHERE clickup_id = ?',
            [clickupTask.id]
        );

        // Get user IDs for assignees and creator
        const creatorId = await this.getUserIdByClickUpId(clickupTask.creator.id);
        const assigneeId = clickupTask.assignees.length > 0
            ? await this.getUserIdByClickUpId(clickupTask.assignees[0].id)
            : null;

        const taskData = {
            name: clickupTask.name,
            description: clickupTask.description || '',
            due_date: clickupTask.due_date ? new Date(parseInt(clickupTask.due_date)) : null,
            due_date_time: clickupTask.due_date_time || false,
            start_date: clickupTask.start_date ? new Date(parseInt(clickupTask.start_date)) : null,
            start_date_time: clickupTask.start_date_time || false,
            time_estimate: clickupTask.time_estimate || null,
            time_spent: clickupTask.time_spent || 0,
            url: clickupTask.url,
            text_content: clickupTask.text_content || '',
            clickup_created_at: new Date(parseInt(clickupTask.date_created)),
            clickup_updated_at: new Date(parseInt(clickupTask.date_updated))
        };

        if (existingTask.length === 0) {
            const result = await this.db.query(`
                INSERT INTO tasks (
                    clickup_id, list_id, name, description,
                    due_date, due_date_time, start_date, start_date_time,
                    time_estimate, time_spent, url, text_content,
                    creator_id, assignee_id, clickup_created_at, clickup_updated_at,
                    sync_status, last_sync_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', NOW())
            `, [
                clickupTask.id,
                listId,
                taskData.name,
                taskData.description,
                taskData.due_date,
                taskData.due_date_time,
                taskData.start_date,
                taskData.start_date_time,
                taskData.time_estimate,
                taskData.time_spent,
                taskData.url,
                taskData.text_content,
                creatorId,
                assigneeId,
                taskData.clickup_created_at,
                taskData.clickup_updated_at
            ]);

            const taskId = result.insertId;

            // Handle multiple assignees
            await this.syncTaskAssignees(taskId, clickupTask.assignees);

            console.log(`Created task: ${taskData.name}`);
        } else {
            // Check for conflicts
            const existing = existingTask[0];
            const hasLocalChanges = existing.sync_status === 'pending';
            const clickupIsNewer = taskData.clickup_updated_at > new Date(existing.clickup_updated_at);

            if (hasLocalChanges && clickupIsNewer) {
                // Conflict detected
                await this.recordConflict('task', existing.id, clickupTask.id, existing, clickupTask);
                return;
            }

            if (clickupIsNewer || !hasLocalChanges) {
                await this.db.query(`
                    UPDATE tasks 
                    SET name = ?, description = ?, due_date = ?, due_date_time = ?,
                        start_date = ?, start_date_time = ?, time_estimate = ?, time_spent = ?,
                        url = ?, text_content = ?, assignee_id = ?, clickup_updated_at = ?,
                        sync_status = 'synced', last_sync_at = NOW()
                    WHERE clickup_id = ?
                `, [
                    taskData.name,
                    taskData.description,
                    taskData.due_date,
                    taskData.due_date_time,
                    taskData.start_date,
                    taskData.start_date_time,
                    taskData.time_estimate,
                    taskData.time_spent,
                    taskData.url,
                    taskData.text_content,
                    assigneeId,
                    taskData.clickup_updated_at,
                    clickupTask.id
                ]);

                await this.syncTaskAssignees(existing.id, clickupTask.assignees);
            }
        }
    }

    // ============================
    // PUSH SYNC (Local → ClickUp)
    // ============================

    async pushToClickUp() {
        console.log('Starting push sync...');

        const pendingOperations = await this.db.query(`
            SELECT * FROM sync_operations 
            WHERE status IN ('pending', 'failed') 
            AND retry_count < 3 
            ORDER BY started_at ASC 
            LIMIT 50
        `);

        for (const operation of pendingOperations) {
            try {
                await this.processPushOperation(operation);
            } catch (error) {
                console.error(`Failed to process operation ${operation.id}:`, error);
                await this.handlePushError(operation, error);
            }
        }
    }

    async processPushOperation(operation) {
        console.log(`Processing ${operation.operation_type} for ${operation.entity_type} ${operation.entity_id}`);

        // Update operation status
        await this.db.query(
            'UPDATE sync_operations SET status = "processing" WHERE id = ?',
            [operation.id]
        );

        switch (operation.entity_type) {
            case 'task':
                await this.pushTask(operation);
                break;
            case 'comment':
                await this.pushComment(operation);
                break;
            case 'time_entry':
                await this.pushTimeEntry(operation);
                break;
            default:
                throw new Error(`Unsupported entity type: ${operation.entity_type}`);
        }

        // Mark as completed
        await this.db.query(
            'UPDATE sync_operations SET status = "completed", completed_at = NOW() WHERE id = ?',
            [operation.id]
        );
    }

    async pushTask(operation) {
        const task = await this.db.query(
            'SELECT * FROM tasks WHERE clickup_id = ?',
            [operation.entity_id]
        );

        if (task.length === 0) {
            throw new Error('Task not found');
        }

        const taskData = task[0];
        const clickupTaskData = {
            name: taskData.name,
            description: taskData.description,
            due_date: taskData.due_date ? taskData.due_date.getTime() : null,
            due_date_time: taskData.due_date_time,
            start_date: taskData.start_date ? taskData.start_date.getTime() : null,
            start_date_time: taskData.start_date_time,
            time_estimate: taskData.time_estimate
        };

        if (operation.operation_type === 'push') {
            // Update existing task
            await this.clickupAPI.updateTask(taskData.clickup_id, clickupTaskData);

            // Update local sync status
            await this.db.query(
                'UPDATE tasks SET sync_status = "synced", last_sync_at = NOW() WHERE clickup_id = ?',
                [taskData.clickup_id]
            );
        }
    }

    // ============================
    // WEBHOOK HANDLING
    // ============================

    async setupWebhooks() {
        // This would typically be done through ClickUp's webhook setup
        console.log('Webhook endpoints should be configured in ClickUp dashboard');
        console.log('Webhook URL: /webhook/clickup');
    }

    async handleWebhook(webhookData) {
        console.log('Processing webhook:', webhookData.event);

        // Store webhook event
        await this.db.query(`
            INSERT INTO webhook_events (
                webhook_id, event_type, entity_type, entity_id,
                clickup_id, user_id, payload, received_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            webhookData.webhook_id,
            webhookData.event,
            this.getEntityTypeFromEvent(webhookData.event),
            webhookData.task_id || webhookData.list_id || webhookData.space_id,
            webhookData.task_id || webhookData.list_id || webhookData.space_id,
            webhookData.user?.id,
            JSON.stringify(webhookData)
        ]);

        // Process the webhook event
        switch (webhookData.event) {
            case 'taskCreated':
            case 'taskUpdated':
                await this.handleTaskWebhook(webhookData);
                break;
            case 'taskDeleted':
                await this.handleTaskDeletion(webhookData);
                break;
            case 'commentPosted':
                await this.handleCommentWebhook(webhookData);
                break;
            default:
                console.log(`Unhandled webhook event: ${webhookData.event}`);
        }

        // Mark webhook as processed
        await this.db.query(
            'UPDATE webhook_events SET processed = true, processed_at = NOW() WHERE webhook_id = ?',
            [webhookData.webhook_id]
        );
    }

    async handleTaskWebhook(webhookData) {
        if (this.syncInProgress.has(`task-${webhookData.task_id}`)) {
            console.log('Sync already in progress for this task, skipping webhook');
            return;
        }

        this.syncInProgress.add(`task-${webhookData.task_id}`);

        try {
            // Fetch latest task data from ClickUp
            const taskData = await this.clickupAPI.getTask(webhookData.task_id);

            // Find the list for this task
            const list = await this.db.query(
                'SELECT id FROM lists WHERE clickup_id = ?',
                [taskData.task.list.id]
            );

            if (list.length > 0) {
                await this.upsertTask(taskData.task, list[0].id);
            }
        } catch (error) {
            console.error('Failed to process task webhook:', error);
        } finally {
            this.syncInProgress.delete(`task-${webhookData.task_id}`);
        }
    }

    // ============================
    // CONFLICT RESOLUTION
    // ============================

    async recordConflict(entityType, entityId, clickupId, localData, clickupData) {
        console.log(`Conflict detected for ${entityType} ${entityId}`);

        await this.db.query(`
            INSERT INTO sync_conflicts (
                entity_type, entity_id, clickup_id,
                local_data, clickup_data, conflict_type
            ) VALUES (?, ?, ?, ?, ?, 'simultaneous_edit')
        `, [
            entityType,
            entityId,
            clickupId,
            JSON.stringify(localData),
            JSON.stringify(clickupData)
        ]);

        // Mark entity as in conflict
        const tableName = this.getTableName(entityType);
        await this.db.query(
            `UPDATE ${tableName} SET sync_status = 'conflict' WHERE clickup_id = ?`,
            [clickupId]
        );
    }

    async resolveConflict(conflictId, resolution, userId = null) {
        const conflict = await this.db.query(
            'SELECT * FROM sync_conflicts WHERE id = ?',
            [conflictId]
        );

        if (conflict.length === 0) {
            throw new Error('Conflict not found');
        }

        const conflictData = conflict[0];
        const tableName = this.getTableName(conflictData.entity_type);

        switch (resolution) {
            case 'local_wins':
                // Keep local version, push to ClickUp
                await this.db.query(`
                    INSERT INTO sync_operations (entity_type, entity_id, operation_type, status)
                    VALUES (?, ?, 'push', 'pending')
                `, [conflictData.entity_type, conflictData.clickup_id]);
                break;

            case 'clickup_wins':
                // Accept ClickUp version
                const clickupData = JSON.parse(conflictData.clickup_data);
                await this.applyClickUpData(conflictData.entity_type, conflictData.entity_id, clickupData);
                break;

            case 'manual_merge':
                // This would require custom merge logic
                throw new Error('Manual merge not implemented yet');
        }

        // Update conflict resolution
        await this.db.query(`
            UPDATE sync_conflicts 
            SET resolution_status = ?, resolved_by = ?, resolved_at = NOW()
            WHERE id = ?
        `, [resolution, userId, conflictId]);

        // Update entity sync status
        await this.db.query(
            `UPDATE ${tableName} SET sync_status = 'synced' WHERE clickup_id = ?`,
            [conflictData.clickup_id]
        );
    }

    // ============================
    // PERIODIC SYNC
    // ============================

    startPeriodicSync() {
        // Run every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            try {
                console.log('Starting periodic sync...');
                await this.pushToClickUp();
                await this.pullFromClickUp();
                console.log('Periodic sync completed');
            } catch (error) {
                console.error('Periodic sync failed:', error);
            }
        });

        console.log('Periodic sync scheduled (every 15 minutes)');
    }

    // ============================
    // UTILITY METHODS
    // ============================

    async getUserIdByClickUpId(clickupId) {
        const result = await this.db.query(
            'SELECT id FROM users WHERE clickup_id = ?',
            [clickupId]
        );
        return result.length > 0 ? result[0].id : null;
    }

    async syncTaskAssignees(taskId, assignees) {
        // Clear existing assignees
        await this.db.query('DELETE FROM task_assignees WHERE task_id = ?', [taskId]);

        // Add current assignees
        for (const assignee of assignees) {
            const userId = await this.getUserIdByClickUpId(assignee.id);
            if (userId) {
                await this.db.query(`
                    INSERT INTO task_assignees (task_id, user_id)
                    VALUES (?, ?)
                `, [taskId, userId]);
            }
        }
    }

    getEntityTypeFromEvent(event) {
        if (event.includes('task')) return 'task';
        if (event.includes('list')) return 'list';
        if (event.includes('comment')) return 'comment';
        return 'unknown';
    }

    getTableName(entityType) {
        const mapping = {
            'task': 'tasks',
            'list': 'lists',
            'space': 'spaces',
            'folder': 'folders',
            'team': 'teams',
            'user': 'users',
            'comment': 'comments',
            'time_entry': 'time_entries'
        };
        return mapping[entityType] || entityType + 's';
    }

    async handlePushError(operation, error) {
        const retryCount = operation.retry_count + 1;
        const maxRetries = 3;

        if (retryCount < maxRetries) {
            // Schedule for retry with exponential backoff
            const delay = Math.pow(2, retryCount) * 60000; // 2min, 4min, 8min

            await this.db.query(`
                UPDATE sync_operations 
                SET status = 'failed', retry_count = ?, 
                    error_message = ?, started_at = DATE_ADD(NOW(), INTERVAL ? MILLISECOND)
                WHERE id = ?
            `, [retryCount, error.message, delay, operation.id]);
        } else {
            // Max retries reached, mark as permanently failed
            await this.db.query(`
                UPDATE sync_operations 
                SET status = 'failed', retry_count = ?, error_message = ?
                WHERE id = ?
            `, [retryCount, error.message, operation.id]);
        }
    }
}

// ============================
// EXPRESS API ROUTES
// ============================

const app = express();
app.use(express.json());

const db = new DatabaseManager();
let syncEngine;

// Initialize sync engine
(async () => {
    try {
        // Get API token from config
        const config = await db.query('SELECT * FROM sync_config WHERE id = 1');
        if (config.length === 0) {
            console.error('No sync configuration found. Please set up API token first.');
            process.exit(1);
        }

        const apiToken = decrypt(config[0].api_token_encrypted);
        const clickupAPI = new ClickUpAPI(apiToken);
        syncEngine = new SyncEngine(db, clickupAPI);

        await syncEngine.initialize();
        console.log('Sync engine started successfully');
    } catch (error) {
        console.error('Failed to initialize sync engine:', error);
        process.exit(1);
    }
})();

// API Routes
app.post('/api/sync/pull', async (req, res) => {
    try {
        await syncEngine.pullFromClickUp();
        res.json({ success: true, message: 'Pull sync completed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/sync/push', async (req, res) => {
    try {
        await syncEngine.pushToClickUp();
        res.json({ success: true, message: 'Push sync completed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/webhook/clickup', async (req, res) => {
    try {
        // Verify webhook signature (implement based on ClickUp's webhook security)
        await syncEngine.handleWebhook(req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Conflict resolution endpoints
// Conflict resolution endpoints
app.get('/api/conflicts', async (req, res) => {
    try {
        const conflicts = await db.query(
            'SELECT * FROM sync_conflicts WHERE resolution_status IS NULL'
        );
        res.json({ success: true, conflicts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/conflicts/:id/resolve', async (req, res) => {
    const { resolution, userId } = req.body;
    try {
        await syncEngine.resolveConflict(req.params.id, resolution, userId);
        res.json({ success: true, message: 'Conflict resolved' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// ============================
// START EXPRESS SERVER
// ============================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});






