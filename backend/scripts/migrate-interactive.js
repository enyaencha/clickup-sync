#!/usr/bin/env node
/**
 * Interactive Migration Runner
 * Prompts for database connection details and runs the migration
 */

const readline = require('readline');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function runMigration() {
    console.log('\n' + '='.repeat(80));
    console.log('INTERACTIVE MIGRATION RUNNER');
    console.log('='.repeat(80) + '\n');

    try {
        // Prompt for connection details
        console.log('Enter database connection details:\n');

        const host = await question('Host (default: localhost): ') || 'localhost';
        const user = await question('Username (default: root): ') || 'root';
        const password = await question('Password: ');
        const database = await question('Database name: ');

        console.log('\n📡 Connecting to database...');

        // Create connection
        const connection = await mysql.createConnection({
            host,
            user,
            password,
            database,
            multipleStatements: true
        });

        console.log('✅ Connected successfully!\n');

        // List available migrations
        const migrationsDir = path.join(__dirname, '..', 'migrations');
        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

        console.log('Available migrations:');
        sqlFiles.forEach((file, idx) => {
            console.log(`  ${idx + 1}. ${file}`);
        });

        console.log('');
        const choice = await question('Enter migration number (or filename): ');

        let migrationFile;
        if (!isNaN(choice)) {
            migrationFile = sqlFiles[parseInt(choice) - 1];
        } else {
            migrationFile = choice;
        }

        if (!migrationFile) {
            throw new Error('Invalid migration selection');
        }

        const migrationPath = path.join(migrationsDir, migrationFile);

        console.log(`\n📄 Reading migration: ${migrationFile}`);
        const sqlContent = await fs.readFile(migrationPath, 'utf8');

        // Split into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt =>
                stmt.length > 0 &&
                !stmt.startsWith('--') &&
                !stmt.startsWith('/*')
            );

        console.log(`📊 Found ${statements.length} SQL statements\n`);

        const confirm = await question('Run this migration? (yes/no): ');
        if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
            console.log('Migration cancelled.');
            await connection.end();
            rl.close();
            process.exit(0);
        }

        console.log('\n🚀 Executing migration...\n');

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Show progress
            if (statement.toUpperCase().includes('ALTER TABLE')) {
                const match = statement.match(/ALTER TABLE\s+(\w+)/i);
                if (match) {
                    console.log(`⚙️  [${i + 1}/${statements.length}] Altering table: ${match[1]}`);
                }
            } else if (statement.toUpperCase().includes('CREATE TABLE')) {
                const match = statement.match(/CREATE TABLE.*?(\w+)\s*\(/i);
                if (match) {
                    console.log(`📦 [${i + 1}/${statements.length}] Creating table: ${match[1]}`);
                }
            } else if (statement.toUpperCase().includes('UPDATE')) {
                const match = statement.match(/UPDATE\s+(\w+)/i);
                if (match) {
                    console.log(`🔄 [${i + 1}/${statements.length}] Updating: ${match[1]}`);
                }
            }

            try {
                const [result] = await connection.query(statement);

                if (statement.toUpperCase().trim().startsWith('SELECT')) {
                    console.log('   Result:', result);
                }

                successCount++;
            } catch (error) {
                // Expected errors (duplicates)
                if (error.code === 'ER_DUP_FIELDNAME' ||
                    error.code === 'ER_DUP_KEYNAME' ||
                    error.code === 'ER_TABLE_EXISTS_ERROR' ||
                    error.message.includes('Duplicate column') ||
                    error.message.includes('already exists')) {
                    console.log(`   ⚠️  Skipped (already exists)`);
                    skipCount++;
                } else {
                    console.error(`   ❌ Error: ${error.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('MIGRATION SUMMARY');
        console.log('='.repeat(80));
        console.log(`✅ Successful: ${successCount}`);
        console.log(`⚠️  Skipped:    ${skipCount}`);
        console.log(`❌ Errors:     ${errorCount}`);
        console.log('='.repeat(80) + '\n');

        if (errorCount === 0) {
            console.log('🎉 Migration completed successfully!\n');
        } else {
            console.log('⚠️  Migration completed with errors. Review above.\n');
        }

        await connection.end();
        rl.close();
        process.exit(errorCount > 0 ? 1 : 0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);
        rl.close();
        process.exit(1);
    }
}

// Run
runMigration();
