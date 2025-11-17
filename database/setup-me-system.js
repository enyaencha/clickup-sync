/**
 * M&E System Database Setup Script
 * Initializes the complete M&E database schema
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

async function setupDatabase() {
    let connection;

    try {
        console.log('🚀 Starting M&E System Database Setup...\n');

        // Connect to MySQL (without database selection)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'test',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'me_clickup_system';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${dbName}' ready`);

        // Use the database
        await connection.query(`USE \`${dbName}\``);

        // Read and execute the schema file
        const schemaPath = path.join(__dirname, 'me_system_complete_schema.sql');
        console.log(`\n📄 Reading schema from: ${schemaPath}`);

        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('⚙️  Executing schema...');
        await connection.query(schemaSQL);

        console.log('\n✅ Schema created successfully!');

        // Verify tables were created
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`\n📊 Created ${tables.length} tables:`);
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
        });

        // Check program modules
        const [programs] = await connection.query('SELECT name, code FROM program_modules');
        console.log(`\n🎯 Initialized ${programs.length} Program Modules:`);
        programs.forEach((prog, index) => {
            console.log(`   ${index + 1}. [${prog.code}] ${prog.name}`);
        });

        console.log('\n✨ M&E System Database Setup Complete! ✨\n');

    } catch (error) {
        console.error('\n❌ Error setting up database:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();
