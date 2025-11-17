/**
 * M&E System Database Setup Script
 * Initializes the complete M&E database schema
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

async function setupDatabase() {
    let connection;

    try {
        console.log('🚀 Starting M&E System Database Setup...\n');

        // Connect to MySQL (without database selection)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'test',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'me_clickup_system';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${dbName}' ready`);

        // Use the database
        await connection.query(`USE \`${dbName}\``);

        // Read the schema file
        const schemaPath = path.join(__dirname, 'me_system_complete_schema.sql');
        console.log(`\n📄 Reading schema from: ${schemaPath}`);

        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('⚙️  Executing schema...');

        // Split into individual statements and execute them one by one
        // This avoids issues with views referencing tables that might not exist yet
        const statements = schemaSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

        let executedCount = 0;
        let skippedCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Skip comments and empty statements
            if (!statement || statement.startsWith('--')) {
                skippedCount++;
                continue;
            }

            try {
                await connection.query(statement);
                executedCount++;

                // Show progress for major operations
                if (statement.toLowerCase().includes('create table') ||
                    statement.toLowerCase().includes('create or replace view')) {
                    const match = statement.match(/create\s+(?:or\s+replace\s+)?(?:table|view)\s+(?:if\s+not\s+exists\s+)?`?(\w+)`?/i);
                    if (match) {
                        console.log(`  ✓ ${match[1]}`);
                    }
                }
            } catch (error) {
                // Only log critical errors, skip warnings about existing objects
                if (!error.message.includes('already exists') &&
                    !error.message.includes('Unknown table') &&
                    !error.message.includes('Duplicate key name')) {
                    console.warn(`  ⚠️  Warning in statement ${i + 1}: ${error.message.substring(0, 100)}`);
                }
                skippedCount++;
            }
        }

        console.log(`\n✅ Schema execution completed!`);
        console.log(`   Executed: ${executedCount} statements`);
        console.log(`   Skipped: ${skippedCount} statements`);

        // Verify tables were created
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`\n📊 Created ${tables.length} tables/views:`);

        // Group by type
        const tableList = tables.map(t => Object.values(t)[0]);
        const regularTables = [];
        const views = [];

        for (const tableName of tableList) {
            const [tableInfo] = await connection.query(
                `SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
                [dbName, tableName]
            );
            if (tableInfo[0]?.TABLE_TYPE === 'VIEW') {
                views.push(tableName);
            } else {
                regularTables.push(tableName);
            }
        }

        console.log(`\n   Tables: ${regularTables.length}`);
        regularTables.forEach((name, i) => console.log(`     ${i + 1}. ${name}`));

        console.log(`\n   Views: ${views.length}`);
        views.forEach((name, i) => console.log(`     ${i + 1}. ${name}`));

        // Check program modules
        const [programs] = await connection.query('SELECT name, code FROM program_modules');
        console.log(`\n🎯 Initialized ${programs.length} Program Modules:`);
        programs.forEach((prog, index) => {
            console.log(`   ${index + 1}. [${prog.code}] ${prog.name}`);
        });

        // Check organization
        const [orgs] = await connection.query('SELECT name FROM organizations');
        if (orgs.length > 0) {
            console.log(`\n🏢 Organization: ${orgs[0].name}`);
        }

        console.log('\n✨ M&E System Database Setup Complete! ✨');
        console.log('\n📝 Next Steps:');
        console.log('   1. Update config/.env with your ClickUp API token');
        console.log('   2. Start the server: npm start');
        console.log('   3. Configure ClickUp: POST /api/sync/configure');
        console.log('   4. Create activities and they will auto-sync to ClickUp!\n');

    } catch (error) {
        console.error('\n❌ Error setting up database:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();
