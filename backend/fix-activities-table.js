/**
 * Fix Activities Table Schema
 * Adds component_id column if it doesn't exist
 */

const dbManager = require('./core/database/connection');
const logger = require('./core/utils/logger');

async function fixActivitiesTable() {
    try {
        logger.info('Checking activities table schema...');

        // Initialize database connection
        await dbManager.initialize();
        logger.info('✅ Database connected');

        // Check if component_id column exists
        const columns = await dbManager.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'activities'
        `);

        const columnNames = columns.map(col => col.COLUMN_NAME);
        logger.info('Current columns in activities table:', columnNames);

        const hasComponentId = columnNames.includes('component_id');
        const hasProjectId = columnNames.includes('project_id');

        if (hasComponentId) {
            logger.info('✅ activities table already has component_id column - no migration needed!');
        } else if (hasProjectId) {
            logger.info('Found project_id column, need to add component_id...');

            // Add component_id column
            await dbManager.query(`
                ALTER TABLE activities
                ADD COLUMN component_id INT NULL
            `);
            logger.info('✅ Added component_id column');

            // Copy data from project_id to component_id (assuming project_id referred to project_components)
            const result = await dbManager.query(`
                UPDATE activities
                SET component_id = project_id
                WHERE component_id IS NULL AND project_id IS NOT NULL
            `);
            logger.info(`✅ Migrated ${result.affectedRows} rows from project_id to component_id`);

            // Add foreign key if project_components table exists
            try {
                await dbManager.query(`
                    ALTER TABLE activities
                    ADD CONSTRAINT fk_activities_component
                    FOREIGN KEY (component_id) REFERENCES project_components(id)
                    ON DELETE CASCADE
                `);
                logger.info('✅ Added foreign key constraint');
            } catch (error) {
                logger.warn('Could not add foreign key (table might not exist):', error.message);
            }

            // Add index
            try {
                await dbManager.query(`
                    CREATE INDEX idx_component_id ON activities(component_id)
                `);
                logger.info('✅ Added index on component_id');
            } catch (error) {
                logger.warn('Could not add index:', error.message);
            }

        } else {
            logger.error('❌ activities table has neither component_id nor project_id column!');
            logger.error('Available columns:', columnNames);
            throw new Error('Unexpected activities table structure');
        }

        logger.info('✅ Activities table is now ready!');
        logger.info('You can now restart the backend server.');

        await dbManager.close();
        process.exit(0);

    } catch (error) {
        logger.error('❌ Failed to fix activities table:', error);
        try {
            await dbManager.close();
        } catch (e) {
            // Ignore close errors
        }
        process.exit(1);
    }
}

// Run the fix
fixActivitiesTable();
