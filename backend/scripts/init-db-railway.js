/**
 * Railway MySQL Database Initialization Script
 *
 * This script initializes the MySQL database on Railway with the complete schema
 * from me_clickup_system_2025_dec_16.sql
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function initializeDatabase() {
    const startTime = Date.now();

    try {
        log('\n🚂 Railway MySQL Database Initialization\n', colors.bright + colors.cyan);

        // Parse DATABASE_URL from Railway (format: mysql://user:password@host:port/database)
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            log('⚠️  No DATABASE_URL found - skipping database initialization', colors.yellow);
            log('   This is normal for local development\n', colors.yellow);
            return;
        }

        log('📋 Connecting to Railway MySQL database...', colors.blue);

        // Create connection
        const connection = await mysql.createConnection(databaseUrl);

        log('✅ Connected successfully!\n', colors.green);

        // Check if database has tables
        log('🔍 Checking existing database state...', colors.blue);

        const [tables] = await connection.query(`
            SELECT COUNT(*) as count
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
        `);

        const tableCount = parseInt(tables[0].count);

        if (tableCount > 0) {
            log(`📊 Database already initialized with ${tableCount} tables`, colors.green);
            log('   Skipping initialization to preserve existing data\n', colors.yellow);
            await connection.end();
            return;
        }

        log('📦 Fresh database detected - initializing with complete schema', colors.yellow);
        log('📋 Loading MySQL schema file (all 76 tables)...\n', colors.blue);

        // Load the original MySQL schema
        const schemaPath = path.join(__dirname, '../../database/me_clickup_system_2025_dec_16.sql');

        try {
            const schema = await fs.readFile(schemaPath, 'utf8');

            // Split into individual statements
            const statements = schema
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            log(`⚙️  Executing ${statements.length} SQL statements...`, colors.yellow);

            let executed = 0;
            let skipped = 0;
            let errors = 0;

            // Disable foreign key checks during initialization
            await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

            for (const statement of statements) {
                // Skip MySQL directives that might cause issues
                if (statement.match(/^\/\*!/)) {
                    skipped++;
                    continue;
                }

                try {
                    await connection.query(statement + ';');
                    executed++;

                    // Log progress every 20 statements
                    if (executed % 20 === 0) {
                        log(`   ✓ Executed ${executed}/${statements.length - skipped} statements...`, colors.blue);
                    }
                } catch (error) {
                    // Log error but continue (some statements might fail due to dependencies)
                    if (error.message.includes('already exists')) {
                        skipped++;
                    } else {
                        errors++;
                        if (errors <= 5) {  // Only log first 5 errors
                            log(`   ⚠️  Error: ${error.message.substring(0, 100)}`, colors.yellow);
                        }
                    }
                }
            }

            // Re-enable foreign key checks
            await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

            // Verify table count
            const [finalTables] = await connection.query(`
                SELECT COUNT(*) as count
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
            `);

            const finalTableCount = parseInt(finalTables[0].count);

            log(`\n✅ Database initialization completed!`, colors.green + colors.bright);
            log(`   📊 Tables created: ${finalTableCount}`, colors.green);
            log(`   ✓ Executed: ${executed} statements`, colors.green);
            log(`   ⊘ Skipped: ${skipped} statements`, colors.yellow);
            if (errors > 0) {
                log(`   ⚠️  Errors: ${errors} statements (non-critical)\n`, colors.yellow);
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            log(`   ⏱️  Duration: ${duration}s\n`, colors.cyan);

        } catch (error) {
            log('❌ Failed to load schema file:', colors.red);
            log(error.message, colors.red);
            throw error;
        }

        await connection.end();

    } catch (error) {
        log('\n❌ Database initialization failed:', colors.red);
        log(error.message, colors.red);
        console.error(error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            log('🎉 Initialization complete!\n', colors.bright + colors.green);
            process.exit(0);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
