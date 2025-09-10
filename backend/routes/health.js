const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.get('/', async (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    };

    try {
        // Check database connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        await connection.execute('SELECT 1');
        await connection.end();
        healthCheck.database = 'Connected';

        // Check sync status
        const syncConfig = await connection.execute('SELECT sync_status FROM sync_config WHERE id = 1');
        healthCheck.sync_status = syncConfig[0]?.[0]?.sync_status || 'Unknown';

        res.status(200).json(healthCheck);
    } catch (error) {
        healthCheck.status = 'ERROR';
        healthCheck.database = 'Disconnected';
        healthCheck.error = error.message;
        res.status(503).json(healthCheck);
    }
});

module.exports = router;
