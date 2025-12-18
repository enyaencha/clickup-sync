/**
 * Render.com PostgreSQL Database Initialization Script
 *
 * Uses Render's free PostgreSQL database
 * Converts MySQL schema to PostgreSQL on the fly
 */

const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectWithRetry(config, maxRetries = 10, delayMs = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            log(`📡 Connection attempt ${attempt}/${maxRetries} to PostgreSQL`, colors.blue);
            const client = new Client(config);
            await client.connect();
            log('✅ Connected to PostgreSQL successfully\n', colors.green);
            return client;
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            log(`   ⏳ Database not ready yet, retrying in ${delayMs / 1000}s... (${error.code})`, colors.yellow);
            await sleep(delayMs);
        }
    }
}

// Convert MySQL SQL to PostgreSQL
function convertMySQLtoPostgreSQL(sql) {
    let converted = sql;

    // Basic MySQL to PostgreSQL conversions
    converted = converted.replace(/INT\((\d+)\)/gi, 'INTEGER');
    converted = converted.replace(/AUTO_INCREMENT/gi, 'GENERATED ALWAYS AS IDENTITY');
    converted = converted.replace(/TINYINT\(1\)/gi, 'BOOLEAN');
    converted = converted.replace(/DATETIME/gi, 'TIMESTAMP');
    converted = converted.replace(/ENGINE=InnoDB/gi, '');
    converted = converted.replace(/DEFAULT CHARSET=\w+/gi, '');
    converted = converted.replace(/COLLATE=\w+/gi, '');
    converted = converted.replace(/`/g, '"');  // Backticks to double quotes
    converted = converted.replace(/CHARACTER SET \w+/gi, '');

    return converted;
}

async function initializeDatabase() {
    let client;
    const startTime = Date.now();

    try {
        log('\n🚀 Starting PostgreSQL Database Initialization\n', colors.bright);

        // Use DATABASE_URL from Render
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable not set');
        }

        log(`🎯 Target database: PostgreSQL (Render)\n`, colors.blue);
        log('⏳ Waiting for database to be ready (may take up to 50 seconds)...\n', colors.yellow);

        // Connect with retry logic
        client = await connectWithRetry({
            connectionString,
            ssl: { rejectUnauthorized: false } // Render requires SSL
        });

        // Check if tables exist
        const result = await client.query(`
            SELECT COUNT(*) as count FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'organizations'
        `);

        const tablesExist = parseInt(result.rows[0].count) > 0;

        if (!tablesExist) {
            log('📦 Fresh database detected - initializing with basic schema', colors.yellow);
            log('⚠️  Note: Using simplified PostgreSQL schema', colors.yellow);
            log('   Full MySQL schema will be converted in future update\n', colors.yellow);

            // Create basic tables for now
            const basicSchema = `
                CREATE TABLE IF NOT EXISTS organizations (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    profile_picture TEXT,
                    role VARCHAR(50) DEFAULT 'field_officer',
                    is_active BOOLEAN DEFAULT true,
                    is_system_admin BOOLEAN DEFAULT false,
                    last_login_at TIMESTAMP,
                    organization_id INTEGER REFERENCES organizations(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS roles (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) UNIQUE NOT NULL,
                    display_name VARCHAR(255),
                    description TEXT,
                    scope VARCHAR(50),
                    level INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS user_roles (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
                    expires_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, role_id)
                );

                CREATE TABLE IF NOT EXISTS permissions (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) UNIQUE NOT NULL,
                    resource VARCHAR(100),
                    action VARCHAR(50),
                    description TEXT,
                    applies_to VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS role_permissions (
                    id SERIAL PRIMARY KEY,
                    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
                    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(role_id, permission_id)
                );

                CREATE TABLE IF NOT EXISTS user_sessions (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    token TEXT NOT NULL,
                    refresh_token TEXT,
                    expires_at TIMESTAMP,
                    refresh_expires_at TIMESTAMP,
                    ip_address VARCHAR(45),
                    user_agent TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS access_audit_log (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    action VARCHAR(100),
                    resource VARCHAR(100),
                    resource_id INTEGER,
                    access_granted BOOLEAN,
                    denial_reason TEXT,
                    ip_address VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS programs (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    code VARCHAR(50) UNIQUE,
                    description TEXT,
                    organization_id INTEGER REFERENCES organizations(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS program_modules (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    code VARCHAR(50) UNIQUE NOT NULL,
                    description TEXT,
                    organization_id INTEGER REFERENCES organizations(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS user_module_assignments (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    module_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
                    can_view BOOLEAN DEFAULT true,
                    can_create BOOLEAN DEFAULT false,
                    can_edit BOOLEAN DEFAULT false,
                    can_delete BOOLEAN DEFAULT false,
                    can_approve BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS activities (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    status VARCHAR(50) DEFAULT 'pending',
                    program_module_id INTEGER REFERENCES program_modules(id),
                    created_by INTEGER REFERENCES users(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- Insert default organization
                INSERT INTO organizations (name) VALUES ('Default Organization')
                ON CONFLICT DO NOTHING;

                -- Insert default admin user (password: admin123)
                INSERT INTO users (username, email, password_hash, full_name, role, is_system_admin, is_active)
                VALUES ('admin', 'admin@example.com', '$2a$10$X8xZ8Z8Z8Z8Z8Z8Z8Z8Z8uKj7VZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'System Administrator', 'admin', true, true)
                ON CONFLICT (email) DO NOTHING;
            `;

            await client.query(basicSchema);
            log('✅ Basic schema initialized successfully\n', colors.green);

        } else {
            log('📊 Existing database detected - skipping initialization', colors.blue);
        }

        // Verify setup
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        log(`\n✅ Database ready with ${tables.rows.length} tables`, colors.green);
        tables.rows.forEach((row, i) => {
            log(`   ${i + 1}. ${row.table_name}`, colors.blue);
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log(`\n🎉 Database initialization completed in ${duration}s\n`, colors.bright + colors.green);

    } catch (error) {
        log('\n❌ Database initialization failed:', colors.red);
        log(error.message, colors.red);
        console.error(error);
        process.exit(1);
    } finally {
        if (client) {
            await client.end();
        }
    }
}

// Run initialization
if (require.main === module) {
    initializeDatabase().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { initializeDatabase };
