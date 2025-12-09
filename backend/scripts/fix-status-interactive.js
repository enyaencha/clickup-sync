#!/usr/bin/env node
/**
 * Interactive Data Fix - Status/Progress Consistency
 * Prompts for database connection and fixes inconsistent data
 */

const readline = require('readline');
const mysql = require('mysql2/promise');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function fixData() {
    console.log('\n' + '='.repeat(80));
    console.log('INTERACTIVE DATA FIX - Status/Progress Consistency');
    console.log('='.repeat(80) + '\n');

    try {
        // Prompt for connection details
        console.log('Enter database connection details:\n');

        const host = await question('Host (default: localhost): ') || 'localhost';
        const user = await question('Username (default: root): ') || 'root';
        const password = await question('Password: ');
        const database = await question('Database name: ');

        console.log('\n📡 Connecting to database...');

        const connection = await mysql.createConnection({
            host,
            user,
            password,
            database
        });

        console.log('✅ Connected successfully!\n');

        // Show current inconsistencies
        console.log('🔍 Checking for inconsistencies...\n');

        const [inconsistent] = await connection.query(`
            SELECT
                COUNT(*) as count
            FROM activities
            WHERE deleted_at IS NULL
            AND (
                (status = 'not-started' AND progress_percentage > 0)
                OR (status = 'completed' AND progress_percentage < 100)
                OR (status = 'in-progress' AND progress_percentage = 0)
                OR (status = 'in-progress' AND progress_percentage = 100)
            )
        `);

        const inconsistentCount = inconsistent[0].count;

        if (inconsistentCount === 0) {
            console.log('✅ No inconsistencies found! Your data is clean.\n');
            await connection.end();
            rl.close();
            process.exit(0);
        }

        console.log(`⚠️  Found ${inconsistentCount} activities with inconsistent status/progress\n`);

        const confirm = await question('Fix these inconsistencies? (yes/no): ');
        if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
            console.log('Operation cancelled.');
            await connection.end();
            rl.close();
            process.exit(0);
        }

        console.log('\n🔧 Fixing inconsistencies...\n');

        // Fix 1: Completed activities should have 100% progress
        const [r1] = await connection.query(`
            UPDATE activities
            SET status = 'completed',
                auto_status = 'completed'
            WHERE progress_percentage >= 100
            AND status != 'completed'
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${r1.affectedRows} activities to 'completed' (progress = 100%)`);

        // Fix 2: In-progress if progress > 0
        const [r2] = await connection.query(`
            UPDATE activities
            SET status = 'in-progress',
                auto_status = 'in-progress'
            WHERE progress_percentage > 0
            AND progress_percentage < 100
            AND status = 'not-started'
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${r2.affectedRows} activities to 'in-progress' (progress > 0%)`);

        // Fix 3: Reset progress for not-started
        const [r3] = await connection.query(`
            UPDATE activities
            SET progress_percentage = 0
            WHERE status = 'not-started'
            AND progress_percentage > 0
            AND deleted_at IS NULL
        `);
        console.log(`✅ Reset ${r3.affectedRows} 'not-started' activities to 0% progress`);

        // Fix 4: Completed should be 100%
        const [r4] = await connection.query(`
            UPDATE activities
            SET progress_percentage = 100
            WHERE status = 'completed'
            AND progress_percentage < 100
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${r4.affectedRows} 'completed' activities to 100% progress`);

        // Show status distribution
        console.log('\n' + '='.repeat(80));
        console.log('STATUS DISTRIBUTION AFTER FIX');
        console.log('='.repeat(80));

        const [distribution] = await connection.query(`
            SELECT
                status,
                COUNT(*) as count,
                ROUND(AVG(progress_percentage), 1) as avg_progress,
                MIN(progress_percentage) as min_progress,
                MAX(progress_percentage) as max_progress
            FROM activities
            WHERE deleted_at IS NULL
            GROUP BY status
            ORDER BY count DESC
        `);

        console.log('\nActivities by Status:');
        console.log('─'.repeat(80));
        distribution.forEach(row => {
            console.log(
                `${row.status.padEnd(15)} : ${String(row.count).padStart(4)} activities | ` +
                `Avg: ${String(row.avg_progress).padStart(5)}% | ` +
                `Range: ${row.min_progress}%-${row.max_progress}%`
            );
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ Data fix completed successfully!');
        console.log('='.repeat(80) + '\n');

        console.log('💡 Next step: Run status calculator for intelligent status updates:');
        console.log('   node scripts/recalculate-statuses.js\n');

        await connection.end();
        rl.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        rl.close();
        process.exit(1);
    }
}

fixData();
