/**
 * Database Migration Runner
 * Run this script to update the database schema
 */

const fs = require('fs');
const path = require('path');
const dbManager = require('./core/database/connection');
const logger = require('./core/utils/logger');

async function runMigration() {
    try {
        logger.info('Starting database migration...');

        // Initialize database connection
        await dbManager.initialize();
        logger.info('✅ Database connected');

        // Read all migration files in the migrations directory
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sort to ensure they run in order

        logger.info(`Found ${migrationFiles.length} migration file(s) to process`);

        // Run each migration file
        for (const migrationFile of migrationFiles) {
            logger.info(`\n📄 Processing migration: ${migrationFile}`);
            const migrationPath = path.join(migrationsDir, migrationFile);
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

            // Split into individual statements (handle multi-statement)
            const statements = migrationSQL
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            logger.info(`   Found ${statements.length} SQL statement(s)`);

            // Execute each statement
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement && !statement.match(/^--/)) {
                    try {
                        logger.info(`   Executing statement ${i + 1}/${statements.length}...`);
                        await dbManager.query(statement);
                        logger.info(`   ✅ Statement ${i + 1} executed successfully`);
                    } catch (error) {
                        // Log but don't fail on duplicate column/key errors
                        if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
                            logger.warn(`   ⚠️  Statement ${i + 1} skipped (already exists):`, error.message);
                        } else {
                            logger.error(`   ❌ Statement ${i + 1} failed:`, error.message);
                            throw error;
                        }
                    }
                }
            }

            logger.info(`✅ Completed migration: ${migrationFile}`);
        }

        logger.info('\n✅ All migrations completed successfully!');

        await dbManager.close();
        process.exit(0);

    } catch (error) {
        logger.error('❌ Migration failed:', error);
        await dbManager.close();
        process.exit(1);
    }
}

// Run migration
runMigration();
