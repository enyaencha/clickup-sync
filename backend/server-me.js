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

// CORS configuration - allow multiple origins for mobile development
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://192.168.100.4:3001', // Local network IP for mobile access
    'http://192.168.100.4:5173',
    'http://172.17.0.1:3001', // Docker network
    'http://172.17.0.1:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // In development, allow all origins
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        // In production, check against allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Conditional JSON body parser - skip multipart/form-data for file uploads
app.use((req, res, next) => {
    if (req.is('multipart/form-data')) {
        return next();
    }
    express.json({ limit: '10mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced request/response logging
app.use((req, res, next) => {
    const startTime = Date.now();

    // Log incoming request
    console.log('\n========================================');
    console.log(`📥 INCOMING: ${req.method} ${req.path}`);
    console.log('========================================');
    if (Object.keys(req.query).length > 0) {
        console.log('Query params:', req.query);
    }
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }

    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        query: req.query
    });

    // Intercept response to log it
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        console.log(`📤 RESPONSE: ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        if (res.statusCode >= 400) {
            console.error('Error response:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        }
        console.log('========================================\n');
        return originalSend.call(this, data);
    };

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

        // Initialize Authentication Service
        try {
            console.log('Initializing Authentication Service...');
            const AuthService = require('./services/auth.service');
            const authService = new AuthService(dbManager);
            app.locals.authService = authService; // Make available globally
            logger.info('✅ Authentication Service initialized');

            // Register Auth Routes (public, no auth required)
            console.log('Registering Auth Routes...');
            const authRoutes = require('./routes/auth.routes')(authService);
            app.use('/api/auth', authRoutes);
            logger.info('✅ Auth Routes registered at /api/auth');
            console.log('✅ Auth Routes registered at /api/auth');

            // Register User Management Routes (protected, requires auth)
            console.log('Registering User Management Routes...');
            const { authMiddleware } = require('./middleware/auth.middleware');
            app.use('/api/users', require('./routes/users.routes')(dbManager, authService, authMiddleware(authService)));
            logger.info('✅ User Management Routes registered at /api/users');
            console.log('✅ User Management Routes registered at /api/users');

            // Register Roles Routes (protected, requires auth)
            console.log('Registering Roles Routes...');
            app.use('/api/roles', require('./routes/roles.routes')(dbManager, authMiddleware(authService)));
            logger.info('✅ Roles Routes registered at /api/roles');
            console.log('✅ Roles Routes registered at /api/roles');
        } catch (error) {
            console.error('❌ Failed to initialize Authentication:', error);
            console.error('Stack trace:', error.stack);
            logger.error('Authentication initialization failed:', error);
            throw error;
        }

        // Initialize M&E Service
        console.log('Creating MEService instance...');
        meService = new MEService(dbManager);
        logger.info('✅ M&E Service initialized');

        // Register M&E Routes (must be after meService is initialized)
        try {
            console.log('Registering M&E Routes...');
            const { authMiddleware } = require('./middleware/auth.middleware');
            app.use('/api', authMiddleware(app.locals.authService), require('./routes/me.routes')(meService));
            logger.info('✅ M&E Routes registered with auth middleware');
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

        // Register Logframe Routes
        try {
            console.log('Initializing Logframe Services...');
            const IndicatorsService = require('./services/indicators.service');
            console.log('Creating IndicatorsService instance...');
            const indicatorsService = new IndicatorsService(dbManager);
            console.log('Registering /api/indicators routes...');
            app.use('/api/indicators', require('./routes/indicators.routes')(indicatorsService));
            console.log('✅ Indicators routes registered at /api/indicators');
            logger.info('✅ Indicators routes registered');

            const MeansOfVerificationService = require('./services/means-of-verification.service');
            const movService = new MeansOfVerificationService(dbManager);
            app.use('/api/means-of-verification', require('./routes/means-of-verification.routes')(movService));
            logger.info('✅ Means of Verification routes registered');

            const AssumptionsService = require('./services/assumptions.service');
            const assumptionsService = new AssumptionsService(dbManager);
            app.use('/api/assumptions', require('./routes/assumptions.routes')(assumptionsService));
            logger.info('✅ Assumptions routes registered');

            const ResultsChainService = require('./services/results-chain.service');
            const resultsChainService = new ResultsChainService(dbManager);
            app.use('/api/results-chain', require('./routes/results-chain.routes')(resultsChainService));
            logger.info('✅ Results Chain routes registered');

            const LogframeExcelService = require('./services/logframe-excel.service');
            const logframeExcelService = new LogframeExcelService(dbManager);
            app.use('/api/logframe', require('./routes/logframe-excel.routes')(logframeExcelService));
            logger.info('✅ Logframe Excel routes registered');

            const StatusCalculatorService = require('./services/status-calculator.service');
            const statusCalculatorService = new StatusCalculatorService(dbManager);
            app.use('/api/status', require('./routes/status.routes')(statusCalculatorService));
            logger.info('✅ Status Calculator routes registered');

            const AttachmentsService = require('./services/attachments.service');
            const attachmentsService = new AttachmentsService(dbManager);
            await attachmentsService.ensureUploadsDir();
            app.use('/api/attachments', require('./routes/attachments.routes')(attachmentsService));
            logger.info('✅ Attachments routes registered');
        } catch (error) {
            console.error('❌ Failed to register Logframe Routes:', error);
            throw error;
        }

        // Register SEEP Program Module Routes (Beneficiaries, SHG, Loans)
        try {
            console.log('Initializing SEEP Program Module Services...');

            // Get authMiddleware and authService (should be available from auth initialization above)
            const { authMiddleware } = require('./middleware/auth.middleware');
            const authService = app.locals.authService;

            if (!authService) {
                throw new Error('AuthService not initialized. Cannot register SEEP routes.');
            }

            // Beneficiaries Service
            const BeneficiariesService = require('./services/beneficiaries.service');
            console.log('Creating BeneficiariesService instance...');
            const beneficiariesService = new BeneficiariesService(dbManager);
            console.log('Registering /api/beneficiaries routes...');
            const beneficiariesRouter = require('./routes/beneficiaries.routes')(beneficiariesService);
            app.use('/api/beneficiaries', authMiddleware(authService), beneficiariesRouter);
            console.log('✅ Beneficiaries routes registered at /api/beneficiaries');
            logger.info('✅ Beneficiaries routes registered');

            // SHG Service
            const SHGService = require('./services/shg.service');
            console.log('Creating SHGService instance...');
            const shgService = new SHGService(dbManager);
            console.log('Registering /api/shg routes...');
            const shgRouter = require('./routes/shg.routes')(shgService);
            app.use('/api/shg', authMiddleware(authService), shgRouter);
            console.log('✅ SHG routes registered at /api/shg');
            logger.info('✅ SHG routes registered');

            // Loans Service
            const LoansService = require('./services/loans.service');
            console.log('Creating LoansService instance...');
            const loansService = new LoansService(dbManager);
            console.log('Registering /api/loans routes...');
            const loansRouter = require('./routes/loans.routes')(loansService, shgService);
            app.use('/api/loans', authMiddleware(authService), loansRouter);
            console.log('✅ Loans routes registered at /api/loans');
            logger.info('✅ Loans routes registered');

        } catch (error) {
            console.error('❌ Failed to register SEEP Module Routes:', error);
            throw error;
        }

        // Register Additional Program Module Routes (GBV, Relief, Nutrition, Agriculture)
        try {
            console.log('Initializing Additional Program Module Services...');

            // Get authMiddleware and authService
            const { authMiddleware: authMW } = require('./middleware/auth.middleware');
            const authSvc = app.locals.authService;

            // GBV Service
            const GBVService = require('./services/gbv.service');
            console.log('Creating GBVService instance...');
            const gbvService = new GBVService(dbManager);
            console.log('Registering /api/gbv routes...');
            const gbvRouter = require('./routes/gbv.routes')(gbvService);
            app.use('/api/gbv', authMW(authSvc), gbvRouter);
            console.log('✅ GBV routes registered at /api/gbv');
            logger.info('✅ GBV routes registered');

            // Relief Service
            const ReliefService = require('./services/relief.service');
            console.log('Creating ReliefService instance...');
            const reliefService = new ReliefService(dbManager);
            console.log('Registering /api/relief routes...');
            const reliefRouter = require('./routes/relief.routes')(reliefService);
            app.use('/api/relief', authMW(authSvc), reliefRouter);
            console.log('✅ Relief routes registered at /api/relief');
            logger.info('✅ Relief routes registered');

            // Nutrition Service
            const NutritionService = require('./services/nutrition.service');
            console.log('Creating NutritionService instance...');
            const nutritionService = new NutritionService(dbManager);
            console.log('Registering /api/nutrition routes...');
            const nutritionRouter = require('./routes/nutrition.routes')(nutritionService);
            app.use('/api/nutrition', authMW(authSvc), nutritionRouter);
            console.log('✅ Nutrition routes registered at /api/nutrition');
            logger.info('✅ Nutrition routes registered');

            // Agriculture Service
            const AgricultureService = require('./services/agriculture.service');
            console.log('Creating AgricultureService instance...');
            const agricultureService = new AgricultureService(dbManager);
            console.log('Registering /api/agriculture routes...');
            const agricultureRouter = require('./routes/agriculture.routes')(agricultureService);
            app.use('/api/agriculture', authMW(authSvc), agricultureRouter);
            console.log('✅ Agriculture routes registered at /api/agriculture');
            logger.info('✅ Agriculture routes registered');

        } catch (error) {
            console.error('❌ Failed to register Additional Program Module Routes:', error);
            throw error;
        }

        // Serve uploaded files
        const path = require('path');
        app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
        logger.info('✅ Static uploads directory configured');

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
            console.error('\n❌ ERROR CAUGHT BY GLOBAL HANDLER:');
            console.error('Path:', req.method, req.path);
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
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
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`🚀 M&E System running on http://localhost:${PORT}`);
            logger.info(`🌐 Mobile access: http://21.0.0.70:${PORT}`);
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

