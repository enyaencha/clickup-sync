/**
 * M&E Project Management System - Main Server
 * Modular architecture with clear separation of concerns
 */

require('dotenv').config({ path: '../config/.env' });

const express = require('express');
const cors = require('cors');
const db = require('./core/database/connection');
const logger = require('./core/utils/logger');

// Module Routes
const programRoutes = require('./modules/programs/program.routes');
const projectRoutes = require('./modules/projects/project.routes');
const syncRoutes = require('./modules/sync/sync.routes');
const meRoutes = require('./modules/me/me.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        ip: req.ip
    });
    next();
});

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/health', async (req, res) => {
    const dbHealthy = await db.healthCheck();

    res.json({
        status: 'healthy',
        database: dbHealthy ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/programs', programRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/me', meRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'M&E Project Management System',
        version: '1.0.0',
        description: 'Integrated M&E and ClickUp project management with offline-first sync',
        endpoints: {
            health: '/health',
            programs: '/api/programs',
            projects: '/api/projects',
            sync: '/api/sync',
            me: '/api/me'
        }
    });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================================
// SERVER INITIALIZATION
// =====================================================

async function startServer() {
    try {
        // Initialize database connection
        await db.initialize();
        logger.info('Database connection established');

        // Start HTTP server
        app.listen(PORT, () => {
            logger.info(`Server started successfully on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`API URL: http://localhost:${PORT}`);
            logger.info(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    await db.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...');
    await db.close();
    process.exit(0);
});

// =====================================================
// START APPLICATION
// =====================================================

startServer();

module.exports = app;
