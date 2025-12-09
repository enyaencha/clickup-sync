/**
 * Migration Runner: Add Status and Performance Tracking
 * Run: node run-migration-010.js
 */

const fs = require('fs').promises;
const path = require('path');
const db = require('./core/database/connection');
const logger = require('./core/utils/logger');

async function runMigration() {
    console.log('\n' + '='.repeat(80));
    console.log('MIGRATION 010: Add Status and Performance Tracking');
    console.log('='.repeat(80) + '\n');

    try {
        // Initialize database connection
        console.log('📡 Connecting to database...');
        await db.initialize();
        console.log('✅ Database connected\n');

        // Read migration file
        const migrationPath = path.join(__dirname, 'migrations', '010_add_status_and_performance_tracking.sql');
        console.log('📄 Reading migration file:', migrationPath);
        const sqlContent = await fs.readFile(migrationPath, 'utf8');

        // Split into individual statements (handle multiple queries)
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt =>
                stmt.length > 0 &&
                !stmt.startsWith('--') &&
                !stmt.startsWith('/*') &&
                stmt.toUpperCase() !== 'DELIMITER'
            );

        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        // Execute statements
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Show progress for key operations
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
                    console.log(`🔄 [${i + 1}/${statements.length}] Updating data in: ${match[1]}`);
                }
            } else if (statement.toUpperCase().includes('SELECT')) {
                console.log(`📊 [${i + 1}/${statements.length}] Running query...`);
            }

            try {
                const result = await db.query(statement);

                // Show result for SELECT statements
                if (statement.toUpperCase().trim().startsWith('SELECT')) {
                    if (Array.isArray(result) && result.length > 0) {
                        console.log('   Result:', JSON.stringify(result[0], null, 2));
                    }
                }

                successCount++;
            } catch (error) {
                // Some errors are expected (like "Duplicate column name" if migration already ran)
                if (error.code === 'ER_DUP_FIELDNAME' ||
                    error.code === 'ER_DUP_KEYNAME' ||
                    error.message.includes('Duplicate column') ||
                    error.message.includes('already exists')) {
                    console.log(`   ⚠️  Skipped (already exists)`);
                    skipCount++;
                } else {
                    console.error(`   ❌ Error:`, error.message);
                    errorCount++;

                    // Don't stop on errors, continue with other statements
                    if (errorCount > 10) {
                        console.error('\n❌ Too many errors, stopping migration');
                        throw new Error('Migration failed with too many errors');
                    }
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
            console.log('🎉 Migration completed successfully!');
            console.log('\nNew features added:');
            console.log('  ✅ Status tracking (auto + manual override)');
            console.log('  ✅ Progress percentage tracking');
            console.log('  ✅ Performance metrics (baseline, target, actual)');
            console.log('  ✅ Risk indicators and tracking');
            console.log('  ✅ Status history audit trail');
            console.log('  ✅ Performance comments');
            console.log('  ✅ Indicator values historical tracking');
            console.log('\n📝 Next steps:');
            console.log('  1. Implement status-calculator.service.js');
            console.log('  2. Update Excel export with new columns');
            console.log('  3. Add UI for manual status override');
            console.log('  4. Set up automated status calculation cron job\n');
        } else {
            console.log('⚠️  Migration completed with errors. Please review the errors above.');
        }

        // Verify key tables exist
        console.log('\n🔍 Verifying migration...');
        try {
            const tables = await db.query("SHOW TABLES LIKE 'activity_risks'");
            if (tables.length > 0) {
                console.log('✅ activity_risks table created');
            }

            const tables2 = await db.query("SHOW TABLES LIKE 'status_history'");
            if (tables2.length > 0) {
                console.log('✅ status_history table created');
            }

            const tables3 = await db.query("SHOW TABLES LIKE 'indicator_values'");
            if (tables3.length > 0) {
                console.log('✅ indicator_values table created');
            }

            const columns = await db.query("SHOW COLUMNS FROM activities LIKE 'progress_percentage'");
            if (columns.length > 0) {
                console.log('✅ progress_percentage column added to activities');
            }

            const columns2 = await db.query("SHOW COLUMNS FROM me_indicators LIKE 'achievement_percentage'");
            if (columns2.length > 0) {
                console.log('✅ achievement_percentage column added to me_indicators');
            }

            console.log('✅ Verification complete\n');
        } catch (verifyError) {
            console.error('⚠️  Verification error:', verifyError.message);
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run migration
console.log('Starting migration...\n');
runMigration();
