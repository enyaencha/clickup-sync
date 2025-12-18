/**
 * Render.com Database Initialization Script
 *
 * This script runs automatically on every Render deployment to:
 * 1. Initialize the database with the latest schema
 * 2. Run all pending migrations
 * 3. Ensure the database is up-to-date
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
            log(`📡 Connecting to: ${url.hostname}:${url.port || 3306}`, colors.blue);
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
            log(`📡 Connecting to: ${dbConfig.host}:${dbConfig.port}`, colors.blue);
        }

        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        log('✅ Connected to database successfully\n', colors.green);

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
        }

        // Run migrations from database/migrations directory
        log('\n📋 Checking for pending migrations...', colors.blue);
        const migrationsDir = path.join(__dirname, '../../database/migrations');

        try {
            const files = await fs.readdir(migrationsDir);
            const sqlFiles = files
                .filter(f => f.endsWith('.sql') && !f.includes('MANUAL'))
                .sort();

            log(`   Found ${sqlFiles.length} migration files`, colors.blue);

            if (sqlFiles.length > 0) {
                // Create migrations tracking table if it doesn't exist
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS _migrations (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        filename VARCHAR(255) UNIQUE NOT NULL,
                        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_filename (filename)
                    )
                `);

                for (const file of sqlFiles) {
                    // Check if migration was already run
                    const [rows] = await connection.query(
                        'SELECT COUNT(*) as count FROM _migrations WHERE filename = ?',
                        [file]
                    );

                    if (rows[0].count === 0) {
                        log(`   🔄 Running migration: ${file}`, colors.yellow);

                        const migrationPath = path.join(migrationsDir, file);
                        const migrationSQL = await fs.readFile(migrationPath, 'utf8');

                        try {
                            // Split and execute migration statements
                            const statements = migrationSQL
                                .split(';')
                                .map(stmt => stmt.trim())
                                .filter(stmt => stmt.length > 0);

                            for (const statement of statements) {
                                await connection.query(statement);
                            }

                            // Mark migration as executed
                            await connection.query(
                                'INSERT INTO _migrations (filename) VALUES (?)',
                                [file]
                            );

                            log(`   ✅ Completed: ${file}`, colors.green);
                        } catch (error) {
                            log(`   ❌ Failed: ${file} - ${error.message}`, colors.red);
                            // Continue with other migrations
                        }
                    } else {
                        log(`   ⏭️  Skipped (already applied): ${file}`, colors.blue);
                    }
                }
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                log('   No migrations directory found', colors.yellow);
            } else {
                throw error;
            }
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
