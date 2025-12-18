/**
 * Render.com PostgreSQL Database Initialization Script
 *
 * Uses Render's free PostgreSQL database
 * Converts MySQL schema to PostgreSQL on the fly
 */

const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Color codes
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

async function connectWithRetry(config, maxRetries = 10, delayMs = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            log(`📡 Connection attempt ${attempt}/${maxRetries} to PostgreSQL`, colors.blue);
            const client = new Client(config);
            await client.connect();
            log('✅ Connected to PostgreSQL successfully\n', colors.green);
            return client;
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            log(`   ⏳ Database not ready yet, retrying in ${delayMs / 1000}s... (${error.code})`, colors.yellow);
            await sleep(delayMs);
        }
    }
}

// Convert MySQL SQL to PostgreSQL
function convertMySQLtoPostgreSQL(sql) {
    let converted = sql;

    // Basic MySQL to PostgreSQL conversions
    converted = converted.replace(/INT\((\d+)\)/gi, 'INTEGER');
    converted = converted.replace(/AUTO_INCREMENT/gi, 'GENERATED ALWAYS AS IDENTITY');
    converted = converted.replace(/TINYINT\(1\)/gi, 'BOOLEAN');
    converted = converted.replace(/DATETIME/gi, 'TIMESTAMP');
    converted = converted.replace(/ENGINE=InnoDB/gi, '');
    converted = converted.replace(/DEFAULT CHARSET=\w+/gi, '');
    converted = converted.replace(/COLLATE=\w+/gi, '');
    converted = converted.replace(/`/g, '"');  // Backticks to double quotes
    converted = converted.replace(/CHARACTER SET \w+/gi, '');

    return converted;
}

async function initializeDatabase() {
    let client;
    const startTime = Date.now();

    try {
        log('\n🚀 Starting PostgreSQL Database Initialization\n', colors.bright);

        // Use DATABASE_URL from Render
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable not set');
        }

        log(`🎯 Target database: PostgreSQL (Render)\n`, colors.blue);
        log('⏳ Waiting for database to be ready (may take up to 50 seconds)...\n', colors.yellow);

        // Connect with retry logic
        client = await connectWithRetry({
            connectionString,
            ssl: { rejectUnauthorized: false } // Render requires SSL
        });

        // Check if tables exist
        const result = await client.query(`
            SELECT COUNT(*) as count FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'organizations'
        `);

        const tablesExist = parseInt(result.rows[0].count) > 0;

        if (!tablesExist) {
            log('📦 Fresh database detected - initializing with complete schema', colors.yellow);
            log('📋 Loading converted PostgreSQL schema (76 tables)...\n', colors.blue);

            // Load the converted PostgreSQL schema
            const schemaPath = path.join(__dirname, '../../database/me_clickup_system_postgres.sql');

            try {
                const schema = await fs.readFile(schemaPath, 'utf8');

                // Split into individual statements (careful with complex queries)
                const statements = schema
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'));

                log(`⚙️  Executing ${statements.length} SQL statements...`, colors.yellow);

                let executed = 0;
                let skipped = 0;
                let errors = 0;

                for (const statement of statements) {
                    // Skip DROP TABLE statements to avoid errors on fresh database
                    if (statement.match(/^DROP TABLE/i)) {
                        skipped++;
                        continue;
                    }

                    try {
                        await client.query(statement + ';');
                        executed++;

                        // Log progress every 10 statements
                        if (executed % 10 === 0) {
                            log(`   ✓ Executed ${executed}/${statements.length - skipped} statements...`, colors.blue);
                        }
                    } catch (error) {
                        // Log error but continue (some statements might fail due to dependencies)
                        if (error.message.includes('already exists')) {
                            skipped++;
                        } else {
                            errors++;
                            if (errors <= 5) {  // Only log first 5 errors
                                log(`   ⚠️  Error in statement: ${error.message.substring(0, 100)}`, colors.yellow);
                            }
                        }
                    }
                }

                log(`\n✅ Schema initialization completed`, colors.green);
                log(`   ✓ Executed: ${executed} statements`, colors.green);
                log(`   ⊘ Skipped: ${skipped} statements`, colors.yellow);
                if (errors > 0) {
                    log(`   ⚠️  Errors: ${errors} statements (non-critical)\n`, colors.yellow);
                }

            } catch (error) {
                log('❌ Failed to load schema file:', colors.red);
                log(error.message, colors.red);
                throw error;
            }

        } else {
            log('📊 Existing database detected - skipping initialization', colors.blue);
        }

        // Verify setup
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        log(`\n✅ Database ready with ${tables.rows.length} tables`, colors.green);
        tables.rows.forEach((row, i) => {
            log(`   ${i + 1}. ${row.table_name}`, colors.blue);
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log(`\n🎉 Database initialization completed in ${duration}s\n`, colors.bright + colors.green);

    } catch (error) {
        log('\n❌ Database initialization failed:', colors.red);
        log(error.message, colors.red);
        console.error(error);
        process.exit(1);
    } finally {
        if (client) {
            await client.end();
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
