/**
 * Migration Runner
 * Runs database migrations safely
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../../config/.env' });

async function runMigration() {
    let connection;

    try {
        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'me_clickup_system',
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Read migration file
        const migrationPath = path.join(__dirname, '001_add_program_icons.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Running migration: 001_add_program_icons.sql');

        // Execute migration
        const [results] = await connection.query(migrationSQL);

        console.log('✅ Migration completed successfully');

        // Show results
        if (Array.isArray(results)) {
            const programsResult = results.find(r => Array.isArray(r) && r.length > 0 && r[0].name);
            if (programsResult) {
                console.log('\n📊 Updated Programs:');
                programsResult.forEach(program => {
                    console.log(`  ${program.icon} ${program.name} (${program.code}) - ${program.status}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n✅ Database connection closed');
        }
    }
}

// Run migration
console.log('🚀 Starting migration...\n');
runMigration();
