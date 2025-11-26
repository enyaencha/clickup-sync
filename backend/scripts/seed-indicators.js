/**
 * Seed dummy indicators data for testing
 * Run with: node scripts/seed-indicators.js
 */

require('dotenv').config({ path: __dirname + '/../../config/.env' });
const dbManager = require('../core/database/connection');

const dummyIndicators = [
    {
        module_id: 5,
        name: 'Number of farmers trained',
        code: 'TEST-IND-001',
        description: 'Total number of farmers who completed training program',
        type: 'output',
        unit_of_measure: 'farmers',
        baseline_value: 0,
        baseline_date: '2025-01-01',
        target_value: 1000,
        target_date: '2025-12-31',
        current_value: 250,
        collection_frequency: 'monthly',
        data_source: 'Training attendance sheets',
        verification_method: 'Verified by training coordinator',
        status: 'on-track',
        achievement_percentage: 25.00,
        responsible_person: 'John Doe',
        notes: 'Q1 progress looks good',
        is_active: 1
    },
    {
        module_id: 5,
        name: 'Hectares of land improved',
        code: 'TEST-IND-002',
        description: 'Total hectares under improved farming practices',
        type: 'outcome',
        unit_of_measure: 'hectares',
        baseline_value: 500,
        baseline_date: '2025-01-01',
        target_value: 2000,
        target_date: '2025-12-31',
        current_value: 750,
        collection_frequency: 'quarterly',
        data_source: 'Field surveys',
        verification_method: 'GPS measurements',
        status: 'on-track',
        achievement_percentage: 37.50,
        responsible_person: 'Jane Smith',
        notes: 'Expansion in western region ahead of schedule',
        is_active: 1
    },
    {
        module_id: 5,
        name: 'Crop yield increase',
        code: 'TEST-IND-003',
        description: 'Percentage increase in crop yield',
        type: 'impact',
        unit_of_measure: 'percentage',
        baseline_value: 0,
        baseline_date: '2025-01-01',
        target_value: 30,
        target_date: '2025-12-31',
        current_value: 12,
        collection_frequency: 'annually',
        data_source: 'Harvest data',
        verification_method: 'Independent assessment',
        status: 'at-risk',
        achievement_percentage: 40.00,
        responsible_person: 'Mike Johnson',
        notes: 'Weather affecting progress',
        is_active: 1
    }
];

async function seedIndicators() {
    try {
        console.log('🌱 Seeding indicators...');

        // Initialize database
        await dbManager.initialize();
        console.log('✅ Database connected');

        // Insert each indicator
        for (const indicator of dummyIndicators) {
            console.log(`\n📝 Inserting: ${indicator.name}`);

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
                null, // program_id
                null, // project_id
                null, // activity_id
                indicator.module_id || null,
                null, // sub_program_id
                null, // component_id
                indicator.name,
                indicator.code,
                indicator.description || null,
                indicator.type,
                null, // category
                indicator.unit_of_measure || null,
                indicator.baseline_value || null,
                indicator.baseline_date || null,
                indicator.target_value,
                indicator.target_date || null,
                indicator.current_value || 0,
                indicator.collection_frequency || 'monthly',
                indicator.data_source || null,
                indicator.verification_method || null,
                null, // disaggregation
                indicator.status || 'not-started',
                indicator.achievement_percentage || 0,
                indicator.responsible_person || null,
                indicator.notes || null,
                null, // clickup_custom_field_id
                indicator.is_active !== undefined ? indicator.is_active : 1,
                null, // last_measured_date
                null  // next_measurement_date
            ]);

            console.log(`   ✅ Created with ID: ${result.insertId}`);
        }

        // Verify
        console.log('\n📊 Verifying inserted data...');
        const indicators = await dbManager.query(`
            SELECT id, code, name, type, target_value, current_value, achievement_percentage, status
            FROM me_indicators
            WHERE code LIKE 'TEST-IND-%'
            ORDER BY id DESC
        `);

        console.log('\n✅ SUCCESS! Inserted indicators:');
        console.table(indicators);

        await dbManager.close();
        console.log('\n✨ Done!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        await dbManager.close();
        process.exit(1);
    }
}

seedIndicators();
