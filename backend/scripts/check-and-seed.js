/**
 * Check existing entities and create related seed data
 * Run with: node scripts/check-and-seed.js
 */

require('dotenv').config({ path: __dirname + '/../../config/.env' });
const dbManager = require('../core/database/connection');

async function checkAndSeed() {
    try {
        console.log('🔍 Checking existing entities...\n');

        // Initialize database
        await dbManager.initialize();
        console.log('✅ Database connected\n');

        // Check for existing modules
        const modules = await dbManager.query(`
            SELECT id, name FROM program_modules
            ORDER BY id DESC LIMIT 5
        `);
        console.log('📋 MODULES:', modules.length > 0 ? modules : 'None found');

        // Check for existing sub-programs
        const subPrograms = await dbManager.query(`
            SELECT id, name, module_id FROM sub_programs
            ORDER BY id DESC LIMIT 5
        `);
        console.log('\n📋 SUB-PROGRAMS:', subPrograms.length > 0 ? subPrograms : 'None found');

        // Check for existing components
        const components = await dbManager.query(`
            SELECT id, name, sub_program_id FROM project_components
            ORDER BY id DESC LIMIT 5
        `);
        console.log('\n📋 COMPONENTS:', components.length > 0 ? components : 'None found');

        // Check for existing activities
        const activities = await dbManager.query(`
            SELECT id, name, component_id FROM activities
            ORDER BY id DESC LIMIT 5
        `);
        console.log('\n📋 ACTIVITIES:', activities.length > 0 ? activities : 'None found');

        console.log('\n' + '='.repeat(60));
        console.log('🌱 Creating seed indicators...\n');

        // Determine which entity to link to
        let entityType, entityId, entityName;

        if (modules.length > 0) {
            entityType = 'module';
            entityId = modules[0].id;
            entityName = modules[0].name;
        } else if (subPrograms.length > 0) {
            entityType = 'sub_program';
            entityId = subPrograms[0].id;
            entityName = subPrograms[0].name;
        } else if (components.length > 0) {
            entityType = 'component';
            entityId = components[0].id;
            entityName = components[0].name;
        } else if (activities.length > 0) {
            entityType = 'activity';
            entityId = activities[0].id;
            entityName = activities[0].name;
        } else {
            console.log('❌ No entities found! Please create a module, sub-program, component, or activity first.');
            await dbManager.close();
            process.exit(1);
        }

        console.log(`📍 Will link indicators to ${entityType.toUpperCase()}: "${entityName}" (ID: ${entityId})\n`);

        // Create indicators
        const indicators = [
            {
                name: 'Number of beneficiaries reached',
                code: `SEED-${entityType.toUpperCase()}-001`,
                description: `Total number of beneficiaries reached through ${entityName}`,
                type: 'output',
                unit_of_measure: 'people',
                baseline_value: 0,
                baseline_date: '2025-01-01',
                target_value: 5000,
                target_date: '2025-12-31',
                current_value: 1250,
                status: 'on-track',
                achievement_percentage: 25.00,
                responsible_person: 'Project Manager',
                notes: 'Q1 progress on track'
            },
            {
                name: 'Training sessions completed',
                code: `SEED-${entityType.toUpperCase()}-002`,
                description: `Number of training sessions delivered under ${entityName}`,
                type: 'output',
                unit_of_measure: 'sessions',
                baseline_value: 0,
                baseline_date: '2025-01-01',
                target_value: 50,
                target_date: '2025-12-31',
                current_value: 18,
                status: 'on-track',
                achievement_percentage: 36.00,
                responsible_person: 'Training Coordinator',
                notes: 'Ahead of schedule in regional offices'
            },
            {
                name: 'Satisfaction rate',
                code: `SEED-${entityType.toUpperCase()}-003`,
                description: `Beneficiary satisfaction rate for ${entityName}`,
                type: 'outcome',
                unit_of_measure: 'percentage',
                baseline_value: 65,
                baseline_date: '2025-01-01',
                target_value: 85,
                target_date: '2025-12-31',
                current_value: 72,
                status: 'at-risk',
                achievement_percentage: 35.00,
                responsible_person: 'M&E Officer',
                notes: 'Need to improve service delivery in some areas'
            }
        ];

        for (const indicator of indicators) {
            console.log(`📝 Inserting: ${indicator.name}`);

            const result = await dbManager.query(`
                INSERT INTO me_indicators (
                    program_id, project_id, activity_id,
                    module_id, sub_program_id, component_id,
                    name, code, description, type, category,
                    unit_of_measure, baseline_value, baseline_date,
                    target_value, target_date, current_value,
                    collection_frequency, data_source, verification_method,
                    disaggregation, status, achievement_percentage,
                    responsible_person, notes, clickup_custom_field_id,
                    is_active, last_measured_date, next_measurement_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                null,
                null,
                entityType === 'activity' ? entityId : null,
                entityType === 'module' ? entityId : null,
                entityType === 'sub_program' ? entityId : null,
                entityType === 'component' ? entityId : null,
                indicator.name,
                indicator.code,
                indicator.description,
                indicator.type,
                null,
                indicator.unit_of_measure,
                indicator.baseline_value,
                indicator.baseline_date,
                indicator.target_value,
                indicator.target_date,
                indicator.current_value,
                'monthly',
                'M&E reports',
                'Field verification',
                null,
                indicator.status,
                indicator.achievement_percentage,
                indicator.responsible_person,
                indicator.notes,
                null,
                1,
                null,
                null
            ]);

            console.log(`   ✅ Created with ID: ${result.insertId}`);
        }

        // Verify
        console.log('\n📊 Verifying inserted data...');
        const inserted = await dbManager.query(`
            SELECT id, code, name, type, target_value, current_value,
                   achievement_percentage, status,
                   module_id, sub_program_id, component_id, activity_id
            FROM me_indicators
            WHERE code LIKE 'SEED-%'
            ORDER BY id DESC
        `);

        console.log('\n✅ SUCCESS! Inserted indicators:');
        console.table(inserted);

        console.log(`\n💡 These indicators are linked to ${entityType}: "${entityName}"`);
        console.log(`   Go to the Indicators page, select the ${entityType} tab, and choose "${entityName}" to see them.\n`);

        await dbManager.close();
        console.log('✨ Done!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        if (dbManager) await dbManager.close();
        process.exit(1);
    }
}

checkAndSeed();
