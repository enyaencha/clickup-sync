const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

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

async function seedDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        ssl: getSslConfig()
    });

    try {
        console.log('🌱 Seeding database...');

        // Insert default sync configuration
        await connection.execute(`
            INSERT IGNORE INTO sync_config (
                id, workspace_id, api_token_encrypted, sync_status, sync_interval_minutes
            ) VALUES (
                1, 'default', 'placeholder_encrypted_token', 'paused', 15
            )
        `);

        // Insert sample users (for development)
        if (process.env.NODE_ENV === 'development') {
            await connection.execute(`
                INSERT IGNORE INTO users (
                    id, clickup_id, username, email, role
                ) VALUES (
                    1, 'admin_user', 'admin', 'admin@example.com', 'admin'
                )
            `);
        }

        console.log('✅ Database seeded successfully');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

if (require.main === module) {
    seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };
