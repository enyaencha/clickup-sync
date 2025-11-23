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

        // Read migration file
        const migrationPath = path.join(__dirname, 'migrations', '001_add_component_id_to_activities.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Split into individual statements (handle multi-statement)
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        logger.info(`Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement && !statement.match(/^--/)) {
                try {
                    logger.info(`Executing statement ${i + 1}/${statements.length}...`);
                    await dbManager.query(statement);
                    logger.info(`✅ Statement ${i + 1} executed successfully`);
                } catch (error) {
                    // Log but don't fail on duplicate column errors
                    if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
                        logger.warn(`Statement ${i + 1} skipped (already exists):`, error.message);
                    } else {
                        logger.error(`❌ Statement ${i + 1} failed:`, error.message);
                        throw error;
                    }
                }
            }
        }

        logger.info('✅ Migration completed successfully!');
        logger.info('The activities table now has component_id column');

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
