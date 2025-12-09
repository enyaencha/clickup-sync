#!/usr/bin/env node
/**
 * Recalculate Statuses Script
 * Run this script via cron to automatically update all statuses
 *
 * Usage:
 *   node scripts/recalculate-statuses.js [options]
 *
 * Options:
 *   --module=<id>     Recalculate only specific module
 *   --dry-run         Preview changes without updating
 *   --verbose         Show detailed output
 *
 * Examples:
 *   node scripts/recalculate-statuses.js
 *   node scripts/recalculate-statuses.js --module=5
 *   node scripts/recalculate-statuses.js --dry-run --verbose
 *
 * Cron Setup (run daily at 2 AM):
 *   0 2 * * * cd /path/to/backend && node scripts/recalculate-statuses.js >> logs/status-calc.log 2>&1
 */

const db = require('../core/database/connection');
const StatusCalculatorService = require('../services/status-calculator.service');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    moduleId: null,
    dryRun: false,
    verbose: false
};

args.forEach(arg => {
    if (arg.startsWith('--module=')) {
        options.moduleId = parseInt(arg.split('=')[1]);
    } else if (arg === '--dry-run') {
        options.dryRun = true;
    } else if (arg === '--verbose') {
        options.verbose = true;
    }
});

async function recalculateStatuses() {
    const startTime = Date.now();

    console.log('\n' + '='.repeat(80));
    console.log('STATUS RECALCULATION');
    console.log('='.repeat(80));
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log(`Mode: ${options.dryRun ? 'DRY RUN (no changes)' : 'LIVE UPDATE'}`);
    console.log('='.repeat(80) + '\n');

    try {
        // Initialize database
        console.log('📡 Connecting to database...');
        await db.initialize();
        console.log('✅ Connected\n');

        const statusCalculator = new StatusCalculatorService(db);

        let summary;

        if (options.moduleId) {
            // Recalculate specific module
            console.log(`🎯 Recalculating statuses for module ${options.moduleId}...\n`);

            const module = await db.queryOne(
                'SELECT id, name, code FROM program_modules WHERE id = ? AND deleted_at IS NULL',
                [options.moduleId]
            );

            if (!module) {
                throw new Error(`Module ${options.moduleId} not found`);
            }

            console.log(`Module: ${module.name} (${module.code})`);
            console.log('─'.repeat(80));

            if (!options.dryRun) {
                summary = await statusCalculator.recalculateModuleStatuses(options.moduleId);
            } else {
                // Dry run: just preview
                summary = {
                    activitiesUpdated: 0,
                    componentsUpdated: 0,
                    subProgramsUpdated: 0
                };

                const subPrograms = await db.query(
                    'SELECT COUNT(*) as count FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL',
                    [options.moduleId]
                );
                const components = await db.query(
                    'SELECT COUNT(*) as count FROM project_components pc JOIN sub_programs sp ON pc.sub_program_id = sp.id WHERE sp.module_id = ? AND pc.deleted_at IS NULL',
                    [options.moduleId]
                );
                const activities = await db.query(
                    'SELECT COUNT(*) as count FROM activities a JOIN project_components pc ON a.component_id = pc.id JOIN sub_programs sp ON pc.sub_program_id = sp.id WHERE sp.module_id = ? AND a.deleted_at IS NULL',
                    [options.moduleId]
                );

                summary.subProgramsUpdated = subPrograms[0].count;
                summary.componentsUpdated = components[0].count;
                summary.activitiesUpdated = activities[0].count;

                console.log('[DRY RUN] Would update:');
            }

        } else {
            // Recalculate all modules
            console.log('🌍 Recalculating statuses for ALL modules...\n');

            if (!options.dryRun) {
                summary = await statusCalculator.recalculateAllStatuses();
            } else {
                summary = {
                    modulesProcessed: 0,
                    totalSubPrograms: 0,
                    totalComponents: 0,
                    totalActivities: 0
                };

                const counts = await db.query(`
                    SELECT
                        (SELECT COUNT(*) FROM program_modules WHERE deleted_at IS NULL) as modules,
                        (SELECT COUNT(*) FROM sub_programs WHERE deleted_at IS NULL) as sub_programs,
                        (SELECT COUNT(*) FROM project_components WHERE deleted_at IS NULL) as components,
                        (SELECT COUNT(*) FROM activities WHERE deleted_at IS NULL) as activities
                `);

                summary.modulesProcessed = counts[0].modules;
                summary.totalSubPrograms = counts[0].sub_programs;
                summary.totalComponents = counts[0].components;
                summary.totalActivities = counts[0].activities;

                console.log('[DRY RUN] Would update:');
            }
        }

        // Display results
        console.log('\n' + '='.repeat(80));
        console.log('SUMMARY');
        console.log('='.repeat(80));

        if (options.moduleId) {
            console.log(`✅ Activities:    ${summary.activitiesUpdated}`);
            console.log(`✅ Components:    ${summary.componentsUpdated}`);
            console.log(`✅ Sub-Programs:  ${summary.subProgramsUpdated}`);
        } else {
            console.log(`✅ Modules:       ${summary.modulesProcessed}`);
            console.log(`✅ Sub-Programs:  ${summary.totalSubPrograms}`);
            console.log(`✅ Components:    ${summary.totalComponents}`);
            console.log(`✅ Activities:    ${summary.totalActivities}`);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n⏱️  Duration: ${duration}s`);
        console.log(`📅 Completed at: ${new Date().toISOString()}`);

        if (options.dryRun) {
            console.log('\n⚠️  DRY RUN MODE - No changes were made to the database');
        }

        console.log('='.repeat(80) + '\n');

        // Detailed status breakdown if verbose
        if (options.verbose && !options.dryRun) {
            console.log('\n' + '='.repeat(80));
            console.log('STATUS BREAKDOWN');
            console.log('='.repeat(80));

            const statusBreakdown = await db.query(`
                SELECT status, COUNT(*) as count
                FROM activities
                WHERE deleted_at IS NULL
                GROUP BY status
                ORDER BY count DESC
            `);

            console.log('\nActivity Status Distribution:');
            statusBreakdown.forEach(row => {
                console.log(`  ${row.status.padEnd(20)} : ${row.count}`);
            });

            const riskBreakdown = await db.query(`
                SELECT risk_level, COUNT(*) as count
                FROM activities
                WHERE deleted_at IS NULL AND risk_level != 'none'
                GROUP BY risk_level
                ORDER BY FIELD(risk_level, 'critical', 'high', 'medium', 'low')
            `);

            if (riskBreakdown.length > 0) {
                console.log('\nRisk Level Distribution:');
                riskBreakdown.forEach(row => {
                    console.log(`  ${row.risk_level.padEnd(20)} : ${row.count}`);
                });
            }

            const atRiskActivities = await db.query(`
                SELECT a.id, a.name, a.status, a.progress_percentage,
                       pc.name as component_name, sp.name as sub_program_name
                FROM activities a
                JOIN project_components pc ON a.component_id = pc.id
                JOIN sub_programs sp ON pc.sub_program_id = sp.id
                WHERE a.status IN ('at-risk', 'delayed', 'off-track')
                AND a.deleted_at IS NULL
                ORDER BY FIELD(a.status, 'off-track', 'delayed', 'at-risk'), a.progress_percentage
                LIMIT 20
            `);

            if (atRiskActivities.length > 0) {
                console.log('\nTop At-Risk Activities:');
                console.log('─'.repeat(80));
                atRiskActivities.forEach((act, i) => {
                    console.log(`${i + 1}. [${act.status.toUpperCase()}] ${act.name}`);
                    console.log(`   Component: ${act.component_name}`);
                    console.log(`   Progress: ${act.progress_percentage}%\n`);
                });
            }

            console.log('='.repeat(80) + '\n');
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run the script
recalculateStatuses();
