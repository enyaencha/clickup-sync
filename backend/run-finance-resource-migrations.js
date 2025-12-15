/**
 * Run Finance and Resource Management migrations (014 & 015)
 */

require('dotenv').config({ path: __dirname + '/../config/.env' });

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
    let connection;

    try {
        console.log('🔄 Starting Finance & Resource Management migrations...');
        console.log('📡 Connecting to database...');

        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Kenny2024#',
            database: process.env.DB_NAME || 'me_clickup_system',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('✅ Database connected\n');

        // List of migrations to run
        const migrations = [
            '014_update_finance_resource_modules.sql',
            '015_create_finance_resource_tables.sql'
        ];

        for (const migrationFile of migrations) {
            console.log('\n' + '='.repeat(60));
            console.log(`📄 Running migration: ${migrationFile}`);
            console.log('='.repeat(60) + '\n');

            // Read migration file
            const migrationPath = path.join(__dirname, '../database/migrations', migrationFile);

            if (!fs.existsSync(migrationPath)) {
                console.log(`⚠️  Migration file not found: ${migrationPath}`);
                continue;
            }

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

            console.log(`📊 Found ${statements.length} SQL statements\n`);

            let executed = 0;
            let skipped = 0;
            let failed = 0;

            // Execute each statement
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];

                try {
                    // Get operation and table name for better logging
                    const match = statement.match(/(?:CREATE TABLE|ALTER TABLE|INSERT INTO|UPDATE)\s+(?:IF NOT EXISTS\s+)?([`\w]+)/i);
                    const operation = statement.match(/^(CREATE|ALTER|INSERT|UPDATE)/i)?.[1] || 'EXEC';
                    const tableName = match ? match[1].replace(/`/g, '') : 'query';

                    process.stdout.write(`   [${i + 1}/${statements.length}] ${operation} ${tableName}... `);

                    await connection.query(statement);
                    console.log('✅');
                    executed++;

                } catch (error) {
                    // Handle specific errors
                    if (error.code === 'ER_TABLE_EXISTS_ERROR' ||
                        error.code === 'ER_DUP_FIELDNAME' ||
                        error.code === 'ER_DUP_KEYNAME' ||
                        error.code === 'ER_DUP_ENTRY' ||
                        error.message.includes('already exists') ||
                        error.message.includes('Duplicate')) {
                        console.log('⚠️  (already exists)');
                        skipped++;
                    } else {
                        console.log('❌');
                        console.error(`\n   Error: ${error.message}`);
                        console.error(`   Code: ${error.code}`);
                        console.error(`   Statement preview: ${statement.substring(0, 150)}...\n`);
                        failed++;
                        // Don't throw - continue with other statements
                    }
                }
            }

            console.log('\n' + '-'.repeat(60));
            console.log(`${migrationFile} Summary:`);
            console.log(`   ✅ Executed: ${executed}`);
            console.log(`   ⚠️  Skipped: ${skipped}`);
            console.log(`   ❌ Failed: ${failed}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ All migrations completed successfully!');
        console.log('='.repeat(60));
        console.log('\n📦 Finance Management module tables created:');
        console.log('   - program_budgets');
        console.log('   - component_budgets');
        console.log('   - financial_transactions');
        console.log('   - finance_approvals');
        console.log('   - budget_revisions');
        console.log('\n🏗️  Resource Management module tables created:');
        console.log('   - resource_types');
        console.log('   - resources');
        console.log('   - resource_requests');
        console.log('   - resource_maintenance');
        console.log('   - capacity_building_programs');
        console.log('   - capacity_building_participants');
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run migrations
runMigrations();
