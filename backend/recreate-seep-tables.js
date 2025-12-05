/**
 * Script to drop and recreate SEEP module tables
 * Run with: node recreate-seep-tables.js
 */

require('dotenv').config({ path: __dirname + '/../config/.env' });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function recreateTables() {
    console.log('Starting SEEP tables recreation...\n');

    let connection;

    try {
        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'me_system',
            multipleStatements: true
        });

        console.log('✅ Connected to database\n');

        // Step 1: Drop existing tables
        console.log('Step 1: Dropping existing SEEP tables...');
        const dropSQL = fs.readFileSync(
            path.join(__dirname, 'migrations/drop_and_recreate_seep_tables.sql'),
            'utf8'
        );

        await connection.query(dropSQL);
        console.log('✅ Existing tables dropped\n');

        // Step 2: Create new tables with correct schema
        console.log('Step 2: Creating tables with correct schema...');
        const createSQL = fs.readFileSync(
            path.join(__dirname, 'migrations/007_add_program_specific_modules.sql'),
            'utf8'
        );

        await connection.query(createSQL);
        console.log('✅ Tables created successfully\n');

        // Step 3: Verify tables exist
        console.log('Step 3: Verifying table structure...');

        const tables = [
            'beneficiaries',
            'shg_groups',
            'shg_members',
            'shg_meetings',
            'shg_savings_transactions',
            'loans',
            'loan_repayments',
            'gbv_cases',
            'gbv_case_notes',
            'gbv_case_services',
            'relief_distributions',
            'relief_beneficiary_distribution',
            'nutrition_assessments',
            'agriculture_plots',
            'agriculture_production'
        ];

        for (const table of tables) {
            const [rows] = await connection.query(
                `SELECT COUNT(*) as count FROM information_schema.tables
                 WHERE table_schema = ? AND table_name = ?`,
                [process.env.DB_NAME || 'me_system', table]
            );

            if (rows[0].count > 0) {
                console.log(`  ✅ ${table}`);
            } else {
                console.log(`  ❌ ${table} - NOT FOUND`);
            }
        }

        console.log('\n✅ SEEP tables recreation completed successfully!');
        console.log('\nYou can now restart your backend server.');

    } catch (error) {
        console.error('❌ Error recreating tables:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

recreateTables();
