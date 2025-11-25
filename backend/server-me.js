/**
 * M&E SYSTEM - MAIN SERVER
 * Manages M&E data and pushes to ClickUp
 */

console.log('Loading M&E server...');
require('dotenv').config({ path: __dirname + '/../config/.env' });
console.log('Environment loaded');

console.log('Loading dependencies...');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const crypto = require('crypto');
const cron = require('node-cron');
console.log('Core modules loaded');

console.log('Loading custom modules...');
const dbManager = require('./core/database/connection');
console.log('DB Manager loaded');
const logger = require('./core/utils/logger');
console.log('Logger loaded');
const MEService = require('./services/me.service');
console.log('MEService loaded');
const SyncManager = require('./services/sync.manager');
console.log('SyncManager loaded');

// ==============================================
// ENCRYPTION HELPERS
// ==============================================

function decrypt(encryptedText) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error('ENCRYPTION_KEY is missing in .env');
    }

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
        throw new Error('ENCRYPTION_KEY is missing in .env');
    }

    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

// ==============================================
// EXPRESS APP SETUP
// ==============================================

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        query: req.query
    });
    next();
});

// ==============================================
// INITIALIZE SERVICES
// ==============================================

let meService;
let syncManager;

/**
 * Auto-migrate activities table to add component_id column if needed
 */
async function autoMigrateActivitiesTable() {
    try {
        logger.info('Checking activities table schema...');

        // Check if component_id column exists
        const columns = await dbManager.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'activities'
        `);

        const columnNames = columns.map(col => col.COLUMN_NAME);
        const hasComponentId = columnNames.includes('component_id');

        if (!hasComponentId) {
            logger.info('Adding component_id column to activities table...');

            // Add component_id column
            await dbManager.query(`
                ALTER TABLE activities
                ADD COLUMN component_id INT NULL
            `);

            // Migrate data if project_id exists
            if (columnNames.includes('project_id')) {
                await dbManager.query(`
                    UPDATE activities
                    SET component_id = project_id
                    WHERE component_id IS NULL AND project_id IS NOT NULL
                `);
                logger.info('✅ Migrated project_id data to component_id');
            }

            // Try to add foreign key and index
            try {
                await dbManager.query(`
                    ALTER TABLE activities
                    ADD CONSTRAINT fk_activities_component
                    FOREIGN KEY (component_id) REFERENCES project_components(id)
                    ON DELETE CASCADE
                `);
            } catch (e) {
                // Ignore if constraint already exists or table doesn't exist
            }

            try {
                await dbManager.query(`
                    CREATE INDEX idx_component_id ON activities(component_id)
                `);
            } catch (e) {
                // Ignore if index already exists
            }

            logger.info('✅ Activities table migration completed');
        } else {
            logger.info('✅ Activities table schema is up to date');
        }
    } catch (error) {
        logger.error('Warning: Could not auto-migrate activities table:', error.message);
        // Don't throw - continue with startup even if migration fails
    }
}

async function initializeServices() {
    try {
        console.log('Inside initializeServices()...');
        logger.info('Initializing M&E System...');

        // Initialize database
        console.log('Initializing database connection...');
        await dbManager.initialize();
        logger.info('✅ Database connected');

        // Initialize M&E Service
        console.log('Creating MEService instance...');
        meService = new MEService(dbManager);
        logger.info('✅ M&E Service initialized');

        // Register M&E Routes (must be after meService is initialized)
        try {
            console.log('Registering M&E Routes...');
            app.use('/api', require('./routes/me.routes')(meService));
            logger.info('✅ M&E Routes registered');
        } catch (error) {
            console.error('❌ Failed to register M&E Routes:', error);
            throw error;
        }

        // Register Settings Routes
        try {
            console.log('Registering Settings Routes...');
            app.use('/api/settings', require('./routes/settings.routes'));
            logger.info('✅ Settings Routes registered');
        } catch (error) {
            console.error('❌ Failed to register Settings Routes:', error);
            throw error;
        }

        // Register Activity Checklist Routes
        try {
            console.log('Registering Activity Checklist Routes...');
            app.use('/api/checklists', require('./routes/activity-checklist.routes'));
            logger.info('✅ Activity Checklist Routes registered');
        } catch (error) {
            console.error('❌ Failed to register Activity Checklist Routes:', error);
            throw error;
        }

        // Register error handlers AFTER routes (must be last)
        // 404 handler
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });

        // Global error handler
        app.use((err, req, res, next) => {
            logger.error('Unhandled error:', err);
            res.status(err.status || 500).json({
                success: false,
                error: err.message || 'Internal server error'
            });
        });

        console.log('Skipping sync configuration (sync disabled)...');
        logger.warn('⚠️  ClickUp sync is disabled. Enable it later by configuring sync_config.');

        /* CLICKUP SYNC DISABLED - Uncomment when ready to enable
        console.log('Querying sync_config...');
        // Get ClickUp API token from sync_config
        const config = await dbManager.queryOne(
            'SELECT clickup_api_token_encrypted FROM sync_config WHERE id = 1'
        );
        console.log('Sync config query completed');

        if (!config || !config.clickup_api_token_encrypted) {
            logger.warn('⚠️  ClickUp API token not configured. Please configure it to enable sync.');
            logger.warn('   Add your token to sync_config table or use /api/sync/configure endpoint');
        } else {
            const apiToken = decrypt(config.clickup_api_token_encrypted);

            // Initialize Sync Manager
            syncManager = new SyncManager(dbManager, apiToken);
            logger.info('✅ Sync Manager initialized');

            // Start periodic sync processing
            startPeriodicSync();
        }
        */

        console.log('About to log M&E System ready...');
        logger.info('✨ M&E System ready!');
        console.log('M&E System ready logged!');

    } catch (error) {
        console.error('❌ FATAL ERROR in initializeServices:', error);
        console.error('Error stack:', error.stack);
        logger.error('Failed to initialize services:', error);
        throw error;
    }
}

// ==============================================
// PERIODIC SYNC
// ==============================================

function startPeriodicSync() {
    const interval = process.env.SYNC_INTERVAL_MINUTES || 15;

    // Process sync queue every N minutes
    cron.schedule(`*/${interval} * * * *`, async () => {
        try {
            logger.info('⏰ Starting periodic sync queue processing...');
            await syncManager.processSyncQueue();
        } catch (error) {
            logger.error('Periodic sync failed:', error);
        }
    });

    logger.info(`⏰ Periodic sync scheduled (every ${interval} minutes)`);
}

// ==============================================
// API ROUTES
// ==============================================

// Health check
app.get('/health', async (req, res) => {
    try {
        const dbHealthy = await dbManager.healthCheck();
        res.json({
            status: 'ok',
            timestamp: new Date(),
            database: dbHealthy ? 'connected' : 'disconnected',
            version: '2.0.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// M&E Routes are registered in initializeServices() after meService is created

// ==============================================
// SYNC MANAGEMENT ROUTES
// ==============================================

// Configure ClickUp API token
app.post('/api/sync/configure', async (req, res) => {
    try {
        const { clickup_api_token, clickup_team_id } = req.body;

        if (!clickup_api_token) {
            return res.status(400).json({ success: false, error: 'API token required' });
        }

        // Encrypt the token
        const encryptedToken = encrypt(clickup_api_token);

        // Check if config exists
        const existing = await dbManager.queryOne('SELECT id FROM sync_config WHERE id = 1');

        if (existing) {
            await dbManager.query(
                'UPDATE sync_config SET clickup_api_token_encrypted = ?, updated_at = NOW() WHERE id = 1',
                [encryptedToken]
            );
        } else {
            await dbManager.query(
                'INSERT INTO sync_config (id, organization_id, clickup_api_token_encrypted) VALUES (1, 1, ?)',
                [encryptedToken]
            );
        }

        // Update organization with team ID if provided
        if (clickup_team_id) {
            await dbManager.query(
                'UPDATE organizations SET clickup_team_id = ? WHERE id = 1',
                [clickup_team_id]
            );
        }

        logger.info('✅ ClickUp API token configured');

        // Re-initialize sync manager
        const apiToken = decrypt(encryptedToken);
        syncManager = new SyncManager(dbManager, apiToken);

        res.json({
            success: true,
            message: 'ClickUp API token configured successfully. Sync enabled.'
        });

    } catch (error) {
        logger.error('Error configuring API token:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manually trigger sync queue processing
app.post('/api/sync/process', async (req, res) => {
    try {
        if (!syncManager) {
            return res.status(400).json({
                success: false,
                error: 'Sync not configured. Please configure ClickUp API token first.'
            });
        }

        // Process sync queue
        await syncManager.processSyncQueue();

        res.json({
            success: true,
            message: 'Sync queue processing completed'
        });

    } catch (error) {
        logger.error('Error processing sync queue:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get sync queue status
app.get('/api/sync/queue', async (req, res) => {
    try {
        const queue = await dbManager.query(`
            SELECT * FROM sync_queue
            WHERE status IN ('pending', 'processing', 'failed')
            ORDER BY priority ASC, scheduled_at ASC
            LIMIT 100
        `);

        const stats = await dbManager.query(`
            SELECT status, COUNT(*) as count
            FROM sync_queue
            GROUP BY status
        `);

        res.json({
            success: true,
            queue,
            stats
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get sync log
app.get('/api/sync/log', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const log = await dbManager.query(`
            SELECT * FROM sync_log
            ORDER BY created_at DESC
            LIMIT ?
        `, [limit]);

        res.json({
            success: true,
            data: log
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==============================================
// ERROR HANDLING
// ==============================================
// Error handlers are now registered inside initializeServices() after routes

// ==============================================
// START SERVER
// ==============================================

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        console.log('Inside startServer(), about to initialize services...');
        await initializeServices();
        console.log('Services initialized successfully!');

        console.log(`Starting HTTP server on port ${PORT}...`);
        app.listen(PORT, () => {
            logger.info(`🚀 M&E System running on http://localhost:${PORT}`);
            logger.info(`📊 API Docs available at http://localhost:${PORT}/health`);
            console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   M&E SYSTEM - ClickUp Integration                      ║
║   Version: 2.0.0                                         ║
║   Port: ${PORT}                                             ║
║                                                          ║
║   Status: RUNNING ✅                                     ║
║                                                          ║
║   API Base: http://localhost:${PORT}/api                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
            `);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    await dbManager.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...');
    await dbManager.close();
    process.exit(0);
});

// Start the server
console.log('All functions defined, about to call startServer()...');
startServer().catch(error => {
    console.error('FATAL ERROR starting server:', error);
    process.exit(1);
});
console.log('startServer() called...');

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logger.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

