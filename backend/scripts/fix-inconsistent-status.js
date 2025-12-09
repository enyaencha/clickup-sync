/**
 * Fix Inconsistent Status Data
 * This script corrects status values based on progress_percentage
 */

const db = require('./core/database/connection');

async function fixInconsistentData() {
    console.log('\n' + '='.repeat(80));
    console.log('FIXING INCONSISTENT STATUS DATA');
    console.log('='.repeat(80) + '\n');

    try {
        await db.initialize();

        // Fix activities where status doesn't match progress
        console.log('🔧 Fixing activities with inconsistent status/progress...\n');

        // 1. Set status to 'completed' if progress is 100
        const completed = await db.query(`
            UPDATE activities
            SET status = 'completed',
                auto_status = 'completed'
            WHERE progress_percentage >= 100
            AND status != 'completed'
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${completed.affectedRows} activities to 'completed' (progress = 100%)`);

        // 2. Set status to 'in-progress' if progress > 0 but status is 'not-started'
        const inProgress = await db.query(`
            UPDATE activities
            SET status = 'in-progress',
                auto_status = 'in-progress'
            WHERE progress_percentage > 0
            AND progress_percentage < 100
            AND status = 'not-started'
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${inProgress.affectedRows} activities to 'in-progress' (progress > 0%)`);

        // 3. Set progress to 0 if status is 'not-started' but progress > 0
        const notStarted = await db.query(`
            UPDATE activities
            SET progress_percentage = 0
            WHERE status = 'not-started'
            AND progress_percentage > 0
            AND deleted_at IS NULL
        `);
        console.log(`✅ Reset ${notStarted.affectedRows} 'not-started' activities to 0% progress`);

        // 4. Set progress to 100 if status is 'completed' but progress < 100
        const completedProgress = await db.query(`
            UPDATE activities
            SET progress_percentage = 100
            WHERE status = 'completed'
            AND progress_percentage < 100
            AND deleted_at IS NULL
        `);
        console.log(`✅ Set ${completedProgress.affectedRows} 'completed' activities to 100% progress`);

        // Show current status distribution
        console.log('\n' + '='.repeat(80));
        console.log('CURRENT STATUS DISTRIBUTION');
        console.log('='.repeat(80));

        const distribution = await db.query(`
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

        // Find and report remaining inconsistencies
        console.log('\n' + '='.repeat(80));
        console.log('CHECKING FOR REMAINING INCONSISTENCIES');
        console.log('='.repeat(80));

        const inconsistent = await db.query(`
            SELECT
                id,
                name,
                status,
                progress_percentage
            FROM activities
            WHERE deleted_at IS NULL
            AND (
                (status = 'not-started' AND progress_percentage > 0)
                OR (status = 'completed' AND progress_percentage < 100)
                OR (status = 'in-progress' AND progress_percentage = 0)
                OR (status = 'in-progress' AND progress_percentage = 100)
            )
            LIMIT 20
        `);

        if (inconsistent.length > 0) {
            console.log(`\n⚠️  Found ${inconsistent.length} activities with potential inconsistencies:\n`);
            inconsistent.forEach((act, i) => {
                console.log(`${i + 1}. [${act.status}] ${act.name}`);
                console.log(`   Progress: ${act.progress_percentage}%`);
                console.log(`   ID: ${act.id}\n`);
            });
            console.log('💡 Consider running status calculator to auto-correct these.');
        } else {
            console.log('\n✅ No inconsistencies found! All activities have matching status/progress.\n');
        }

        console.log('='.repeat(80));
        console.log('✅ Data cleanup completed!');
        console.log('='.repeat(80) + '\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

fixInconsistentData();
