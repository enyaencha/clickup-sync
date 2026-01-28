/**
 * Render.com Database Initialization Script
 *
 * This script runs automatically on every Render deployment to:
 * 1. Initialize the database with the latest complete schema
 *    (me_clickup_system_2025_dec_16.sql - includes all migrations)
 * 2. Skip if database already exists (idempotent)
 * 3. Verify database setup
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Color codes for better logging
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectWithRetry(dbConfig, maxRetries = 10, delayMs = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            log(`📡 Connection attempt ${attempt}/${maxRetries} to ${dbConfig.host}:${dbConfig.port}`, colors.blue);
            const connection = await mysql.createConnection(dbConfig);
            log('✅ Connected to database successfully\n', colors.green);
            return connection;
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            log(`   ⏳ Database not ready yet, retrying in ${delayMs / 1000}s... (${error.code})`, colors.yellow);
            await sleep(delayMs);
        }
    }
}

async function checkTableExists(connection, tableName) {
    const [rows] = await connection.query(
        `SELECT COUNT(*) as count FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = ?`,
        [tableName]
    );
    return rows[0].count > 0;
}

async function initializeDatabase() {
    let connection;
    const startTime = Date.now();

    try {
        log('\n🚀 Starting Database Initialization for Render Deployment\n', colors.bright);

        // Parse connection string if DATABASE_URL is provided
        let dbConfig;
        if (process.env.DATABASE_URL) {
            // Parse MySQL connection string: mysql://user:pass@host:port/database
            const url = new URL(process.env.DATABASE_URL);
            dbConfig = {
                host: url.hostname,
                port: url.port || 3306,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1), // Remove leading slash
                multipleStatements: true,
                connectTimeout: 60000
            };
            log(`🎯 Target database: ${url.hostname}:${url.port || 3306}`, colors.blue);
        } else {
            dbConfig = {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'test',
                database: process.env.DB_NAME || 'me_clickup_system',
                multipleStatements: true,
                connectTimeout: 60000
            };
            log(`🎯 Target database: ${dbConfig.host}:${dbConfig.port}`, colors.blue);
        }

        log('⏳ Waiting for database to be ready (may take up to 50 seconds)...\n', colors.yellow);

        // Connect to database with retry logic
        connection = await connectWithRetry(dbConfig);

        // Check if this is a fresh database or existing one
        const tablesExist = await checkTableExists(connection, 'organizations');

        if (!tablesExist) {
            log('📦 Fresh database detected - running full schema initialization', colors.yellow);

            // Run the latest complete schema
            const schemaPath = path.join(__dirname, '../../database/me_clickup_system_2025_dec_16.sql');
            log(`📄 Loading schema: ${path.basename(schemaPath)}`, colors.blue);

            const schema = await fs.readFile(schemaPath, 'utf8');

            // Split and execute statements
            const statements = schema
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            log(`⚙️  Executing ${statements.length} SQL statements...`, colors.blue);

            let executed = 0;
            for (const statement of statements) {
                try {
                    await connection.query(statement);
                    executed++;

                    if (executed % 50 === 0) {
                        process.stdout.write(`   Progress: ${executed}/${statements.length}\r`);
                    }
                } catch (error) {
                    // Skip non-critical errors
                    if (!error.message.includes('already exists') &&
                        !error.message.includes('Duplicate')) {
                        log(`   ⚠️  Warning: ${error.message.substring(0, 80)}`, colors.yellow);
                    }
                }
            }

            log(`\n✅ Schema initialized successfully (${executed} statements)`, colors.green);
        } else {
            log('📊 Existing database detected - skipping schema initialization', colors.blue);
            log('   Database already contains all tables and migrations', colors.blue);
        }

        // Verify database setup
        const [tables] = await connection.query('SHOW TABLES');
        log(`\n✅ Database ready with ${tables.length} tables/views`, colors.green);

        // Check critical tables
        const criticalTables = ['organizations', 'users', 'program_modules', 'activities'];
        for (const table of criticalTables) {
            const exists = await checkTableExists(connection, table);
            if (exists) {
                const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
                log(`   ✓ ${table}: ${count[0].count} records`, colors.blue);
            } else {
                log(`   ⚠️  Missing critical table: ${table}`, colors.yellow);
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log(`\n🎉 Database initialization completed in ${duration}s\n`, colors.bright + colors.green);

    } catch (error) {
        log('\n❌ Database initialization failed:', colors.red);
        log(error.message, colors.red);
        console.error(error);

        // Exit with error code to prevent deployment with broken database
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run initialization
if (require.main === module) {
    initializeDatabase().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { initializeDatabase };
