const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs');

function shouldEnableSsl(value) {
    if (!value) return false;
    return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase());
}

function getSslConfig() {
    if (!shouldEnableSsl(process.env.DB_SSL)) return undefined;

    let ca;
    if (process.env.DB_SSL_CA_PATH) {
        ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
    } else if (process.env.DB_SSL_CA) {
        ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
    }

    const ssl = { rejectUnauthorized: true };
    if (ca) ssl.ca = ca;
    return ssl;
}

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
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            ssl: getSslConfig()
        });
        
        await connection.execute('SELECT 1');
        healthCheck.database = 'Connected';

        // Check sync status
        const syncConfig = await connection.execute('SELECT sync_status FROM sync_config WHERE id = 1');
        healthCheck.sync_status = syncConfig[0]?.[0]?.sync_status || 'Unknown';
        await connection.end();

        res.status(200).json(healthCheck);
    } catch (error) {
        healthCheck.status = 'ERROR';
        healthCheck.database = 'Disconnected';
        healthCheck.error = error.message;
        res.status(503).json(healthCheck);
    }
});

module.exports = router;
