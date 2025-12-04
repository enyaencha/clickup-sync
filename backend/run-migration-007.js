/**
 * Run specific migration 007
 */

require('dotenv').config({ path: __dirname + '/../config/.env' });

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
    let connection;

    try {
        console.log('🔄 Starting migration 007...');
        console.log('📡 Connecting to database...');

        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'me_clickup_system',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('✅ Database connected');

        // Read migration file
        const migrationPath = path.join(__dirname, 'migrations', '007_add_program_specific_modules.sql');
        console.log('📄 Reading migration file:', migrationPath);

        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Split into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => {
                // Filter out empty statements and comment-only statements
                if (!stmt || stmt.length === 0) return false;
                const lines = stmt.split('\n').filter(line => {
                    const trimmed = line.trim();
                    return trimmed && !trimmed.startsWith('--');
                });
                return lines.length > 0;
            });

        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        let executed = 0;
        let skipped = 0;
        let failed = 0;

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            try {
                // Get table name for better logging
                const tableMatch = statement.match(/(?:CREATE TABLE|ALTER TABLE)\s+(?:IF NOT EXISTS\s+)?([`\w]+)/i);
                const tableName = tableMatch ? tableMatch[1].replace(/`/g, '') : 'unknown';

                process.stdout.write(`   [${i + 1}/${statements.length}] ${tableName}... `);

                await connection.query(statement);
                console.log('✅');
                executed++;

            } catch (error) {
                // Handle specific errors
                if (error.code === 'ER_TABLE_EXISTS_ERROR' ||
                    error.code === 'ER_DUP_FIELDNAME' ||
                    error.code === 'ER_DUP_KEYNAME' ||
                    error.message.includes('already exists')) {
                    console.log('⚠️  (already exists)');
                    skipped++;
                } else {
                    console.log('❌');
                    console.error(`\n   Error: ${error.message}`);
                    console.error(`   Code: ${error.code}`);
                    console.error(`   Statement preview: ${statement.substring(0, 100)}...\n`);
                    failed++;
                    // Don't throw - continue with other statements
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log(`   ✅ Executed: ${executed}`);
        console.log(`   ⚠️  Skipped: ${skipped}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log('='.repeat(60));

        if (failed > 0) {
            console.log('\n⚠️  Some statements failed. Check errors above.');
            process.exit(1);
        } else {
            console.log('\n✅ Migration completed successfully!');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run migration
runMigration();
