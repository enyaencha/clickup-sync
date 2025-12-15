/**
 * Migration Runner: Add module_specific_data to activities table
 * Run this to enable module-specific activity forms for Finance and Resource modules
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Jjtech2019@@',
    database: 'me_clickup_system',
    multipleStatements: true
};

async function runMigration() {
    let connection;

    try {
        console.log('🚀 Starting module-specific data migration...\n');

        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database\n');

        // Read migration file
        const migrationPath = path.join(__dirname, '../database/migrations/016_add_module_specific_data_to_activities.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
        console.log('📄 Loaded migration file: 016_add_module_specific_data_to_activities.sql\n');

        // Execute migration
        console.log('🔧 Adding module_specific_data column to activities table...');
        const [results] = await connection.query(migrationSQL);
        console.log('✅ Migration executed successfully\n');

        // Verify the column was added
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'me_clickup_system'
            AND TABLE_NAME = 'activities'
            AND COLUMN_NAME = 'module_specific_data'
        `);

        if (columns.length > 0) {
            console.log('✅ Verification successful!');
            console.log('   Column added:', columns[0]);
            console.log('\n📊 Module-specific activity forms are now enabled!');
            console.log('   - Finance Module (ID=6): Transaction tracking fields');
            console.log('   - Resource Module (ID=5): Resource allocation fields');
        } else {
            console.log('⚠️  Column verification failed. Please check manually.');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run migration
runMigration()
    .then(() => {
        console.log('\n✨ Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
