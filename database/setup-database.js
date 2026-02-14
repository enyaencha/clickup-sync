/**
 * Database Setup Script
 * Creates database and runs the schema
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

function shouldEnableSsl(value) {
    if (!value) return false;
    return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase());
}

function getSslConfig() {
    if (!shouldEnableSsl(process.env.DB_SSL)) return undefined;

    let ca;
    if (process.env.DB_SSL_CA_PATH) {
        ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
    } else if (process.env.DB_SSL_CA) {
        ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
    }

    const ssl = { rejectUnauthorized: true };
    if (ca) ssl.ca = ca;
    return ssl;
}

async function setupDatabase() {
    let connection;

    try {
        console.log('🚀 Starting database setup...\n');

        // Step 1: Connect to MySQL (without specifying database)
        console.log('📡 Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            ssl: getSslConfig(),
            multipleStatements: true
        });
        console.log('✅ Connected to MySQL\n');

        // Step 2: Drop existing database and recreate (fresh start)
        const dbName = process.env.DB_NAME || 'me_clickup_system';
        console.log(`🗑️  Dropping existing database (if exists): ${dbName}...`);
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log('✅ Existing database dropped\n');

        console.log(`📦 Creating database: ${dbName}...`);
        await connection.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log('✅ Database created\n');

        // Step 3: Use the database
        await connection.query(`USE ${dbName}`);

        // Step 4: Load and execute schema
        console.log('📝 Loading schema file...');
        const schemaPath = path.join(__dirname, 'core_schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('✅ Schema file loaded\n');

        console.log('⚙️  Executing schema (this may take a moment)...');
        await connection.query(schema);
        console.log('✅ Schema executed successfully\n');

        // Step 5: Verify programs were created
        console.log('🔍 Verifying programs...');
        const [programs] = await connection.query('SELECT id, icon, name, code, status FROM programs WHERE deleted_at IS NULL');

        if (programs.length > 0) {
            console.log('✅ Programs created successfully:\n');
            programs.forEach(p => {
                console.log(`   ${p.icon} ${p.name} (${p.code}) - ${p.status}`);
            });
        } else {
            console.log('⚠️  No programs found. Something might be wrong.');
        }

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Start the backend: cd backend && node server-modular.js');
        console.log('   2. Start the frontend: cd frontend && npm run dev');
        console.log('   3. Open browser: http://localhost:3001\n');

    } catch (error) {
        console.error('\n❌ Database setup failed:');
        console.error(error.message);
        console.error('\nPlease check:');
        console.error('1. MySQL is running');
        console.error('2. Your credentials in .env file are correct');
        console.error('3. The MySQL user has proper permissions\n');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Database connection closed\n');
        }
    }
}

// Load environment variables
require('dotenv').config({ path: '../config/.env' });

// Run setup
setupDatabase();
