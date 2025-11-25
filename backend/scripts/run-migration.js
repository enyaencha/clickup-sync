/**
 * Migration Runner Script
 * Applies the logframe enhancement migration
 */

const fs = require('fs').promises;
const path = require('path');
const dbManager = require('../core/database/connection');

async function runMigration() {
    console.log('🚀 Starting Logframe Enhancement Migration...\n');

    try {
        // Initialize database connection
        console.log('📊 Connecting to database...');
        await dbManager.initialize();
        console.log('✅ Database connected\n');

        // Read migration file
        const migrationPath = path.join(__dirname, '../../database/migrations/001_add_logframe_tables.sql');
        console.log('📄 Reading migration file:', migrationPath);
        const sql = await fs.readFile(migrationPath, 'utf8');
        console.log('✅ Migration file loaded\n');

        // Split SQL statements (split by semicolon, but be careful with stored procedures)
        console.log('🔨 Parsing SQL statements...');
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        let successCount = 0;
        let skipCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Skip comments and empty lines
            if (!statement || statement.startsWith('--')) {
                continue;
            }

            try {
                // Show progress
                const preview = statement.substring(0, 80).replace(/\n/g, ' ');
                console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

                await dbManager.query(statement);
                successCount++;
                console.log('   ✅ Success');
            } catch (err) {
                // Check if error is because table/column already exists
                if (err.code === 'ER_TABLE_EXISTS_ERROR' ||
                    err.code === 'ER_DUP_FIELDNAME' ||
                    err.sqlMessage?.includes('already exists')) {
                    console.log('   ⏭️  Already exists, skipping');
                    skipCount++;
                } else {
                    console.error('   ❌ Error:', err.message);
                    console.error('   SQL:', statement.substring(0, 200));

                    // Ask if should continue
                    console.log('\n⚠️  Migration encountered an error.');
                    console.log('Some statements may have succeeded before this error.');
                    throw err;
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✨ Migration completed successfully!');
        console.log('='.repeat(60));
        console.log(`📊 Statistics:`);
        console.log(`   • Total statements: ${statements.length}`);
        console.log(`   • Executed: ${successCount}`);
        console.log(`   • Skipped (already exist): ${skipCount}`);
        console.log('='.repeat(60));

        // Verify tables were created
        console.log('\n🔍 Verifying new tables...');
        const tables = await dbManager.query(`
            SHOW TABLES LIKE 'indicators'
            UNION
            SHOW TABLES LIKE 'indicator_measurements'
            UNION
            SHOW TABLES LIKE 'means_of_verification'
            UNION
            SHOW TABLES LIKE 'assumptions'
            UNION
            SHOW TABLES LIKE 'results_chain'
        `);

        if (tables.length >= 5) {
            console.log('✅ All 5 new tables created successfully:');
            console.log('   • indicators');
            console.log('   • indicator_measurements');
            console.log('   • means_of_verification');
            console.log('   • assumptions');
            console.log('   • results_chain');
        } else {
            console.log(`⚠️  Warning: Only ${tables.length} of 5 expected tables found`);
        }

        // Check for sample data
        console.log('\n🔍 Checking sample data...');
        const sampleIndicators = await dbManager.query('SELECT COUNT(*) as count FROM indicators');
        const sampleMOV = await dbManager.query('SELECT COUNT(*) as count FROM means_of_verification');
        const sampleAssumptions = await dbManager.query('SELECT COUNT(*) as count FROM assumptions');

        console.log(`   • Indicators: ${sampleIndicators[0].count} row(s)`);
        console.log(`   • Means of Verification: ${sampleMOV[0].count} row(s)`);
        console.log(`   • Assumptions: ${sampleAssumptions[0].count} row(s)`);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Logframe Enhancement Migration Complete!');
        console.log('='.repeat(60));
        console.log('\n📚 Next Steps:');
        console.log('   1. Backend services and routes will be implemented');
        console.log('   2. Frontend UI components will be created');
        console.log('   3. Integration with existing pages');
        console.log('\n');

    } catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ Migration Failed');
        console.error('='.repeat(60));
        console.error('Error:', error.message);
        console.error('\nStack trace:');
        console.error(error.stack);
        console.error('\n⚠️  Some tables may have been partially created.');
        console.error('Check the database and see README.md for rollback instructions if needed.\n');
        process.exit(1);
    } finally {
        // Close database connection
        await dbManager.close();
        console.log('Database connection closed.');
    }
}

// Run migration
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║   LOGFRAME ENHANCEMENT MIGRATION                          ║');
console.log('║   Version: 1.0.0                                          ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

runMigration().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
