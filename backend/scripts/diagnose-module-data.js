/**
 * Diagnostic script to check module data structure
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

async function diagnoseModule(connection, moduleId, moduleName) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Module: ${moduleName} (ID: ${moduleId})`);
    console.log('='.repeat(80));

    // Get module details
    const [modules] = await connection.query(
        'SELECT id, name, code, logframe_goal FROM program_modules WHERE id = ?',
        [moduleId]
    );

    if (modules.length === 0) {
        console.log('❌ Module not found');
        return;
    }

    const module = modules[0];
    console.log(`Code: ${module.code}`);
    console.log(`Goal: ${module.logframe_goal || 'NOT SET'}`);

    // Get sub-programs
    const [subPrograms] = await connection.query(
        'SELECT id, name, logframe_outcome FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL',
        [moduleId]
    );

    console.log(`\nSub-programs: ${subPrograms.length}`);

    for (const sp of subPrograms) {
        console.log(`\n  📋 Sub-program: ${sp.name} (ID: ${sp.id})`);
        console.log(`     Outcome: ${sp.logframe_outcome || 'NOT SET'}`);

        // Get components
        const [components] = await connection.query(
            'SELECT id, name, logframe_output FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL',
            [sp.id]
        );

        console.log(`     Components: ${components.length}`);

        for (const comp of components) {
            console.log(`\n     📦 Component: ${comp.name} (ID: ${comp.id})`);
            console.log(`        Output: ${comp.logframe_output || 'NOT SET'}`);

            // Get activities
            const [activities] = await connection.query(
                'SELECT id, name FROM activities WHERE component_id = ? AND deleted_at IS NULL LIMIT 5',
                [comp.id]
            );

            console.log(`        Activities: ${activities.length}`);
            activities.forEach((act, idx) => {
                if (idx < 3) {
                    console.log(`        - ${act.name.substring(0, 60)}${act.name.length > 60 ? '...' : ''}`);
                }
            });
            if (activities.length > 3) {
                console.log(`        ... and ${activities.length - 3} more`);
            }

            // Get indicators
            const [indicators] = await connection.query(
                'SELECT id, name, activity_id FROM me_indicators WHERE component_id = ? AND deleted_at IS NULL',
                [comp.id]
            );

            console.log(`        Indicators: ${indicators.length}`);
            const activityIndicators = indicators.filter(i => i.activity_id);
            const componentIndicators = indicators.filter(i => !i.activity_id);
            console.log(`        - Activity-level: ${activityIndicators.length}`);
            console.log(`        - Component-level: ${componentIndicators.length}`);
        }
    }
}

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'clickup_sync'
    });

    console.log('🔍 Diagnosing Module Data Structure\n');

    // Get all modules
    const [modules] = await connection.query(
        'SELECT id, name FROM program_modules WHERE deleted_at IS NULL ORDER BY name'
    );

    console.log(`Found ${modules.length} modules:\n`);
    modules.forEach(m => console.log(`  - ${m.name} (ID: ${m.id})`));

    // Diagnose each module
    for (const module of modules) {
        await diagnoseModule(connection, module.id, module.name);
    }

    await connection.end();
}

main().catch(console.error);
