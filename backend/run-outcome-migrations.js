/**
 * Run outcome and objectives migrations (012 and 013)
 */

require('dotenv').config({ path: __dirname + '/../config/.env' });

const fs = require('fs');
const path = require('path');
const dbManager = require('./core/database/connection');

async function runMigrations() {
    try {
        console.log('Starting outcome and objectives migrations...');

        // Initialize database connection
        await dbManager.initialize();
        console.log('✅ Database connected');

        // Migration files to run
        const migrationsToRun = [
            '012_add_outcome_fields_to_activities.sql',
            '013_add_simple_objectives_to_activities.sql'
        ];

        const migrationsDir = path.join(__dirname, 'migrations');

        for (const migrationFile of migrationsToRun) {
            console.log(`\n📄 Processing migration: ${migrationFile}`);
            const migrationPath = path.join(migrationsDir, migrationFile);
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

            // Split into individual statements
            const statements = migrationSQL
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            console.log(`   Found ${statements.length} SQL statement(s)`);

            // Execute each statement
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement && !statement.match(/^--/)) {
                    try {
                        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
                        await dbManager.query(statement);
                        console.log(`   ✅ Statement ${i + 1} executed successfully`);
                    } catch (error) {
                        // Log but don't fail on duplicate column errors
                        if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
                            console.log(`   ⚠️  Statement ${i + 1} skipped (column already exists)`);
                        } else {
                            console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
                            throw error;
                        }
                    }
                }
            }

            console.log(`✅ Completed migration: ${migrationFile}`);
        }

        console.log('\n✅ All outcome and objectives migrations completed!');

        // Verify columns were added
        console.log('\n🔍 Verifying columns...');
        const result = await dbManager.query("SHOW COLUMNS FROM activities LIKE '%outcome%'");
        console.log('Outcome columns:', result);

        const result2 = await dbManager.query("SHOW COLUMNS FROM activities LIKE '%objective%'");
        console.log('Objective columns:', result2);

        await dbManager.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        try {
            await dbManager.close();
        } catch (e) {
            // Ignore close errors
        }
        process.exit(1);
    }
}

// Run migrations
runMigrations();
