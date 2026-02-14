const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
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

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        ssl: getSslConfig(),
        multipleStatements: true
    });

    try {
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.execute(`USE ${process.env.DB_NAME}`);

        // Read and execute the main schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = await fs.promises.readFile(schemaPath, 'utf8');
        
        await connection.execute(schema);
        console.log('✅ Database schema created successfully');

        // Run migration files
        const migrationsPath = path.join(__dirname, 'migrations');
        try {
            const files = await fs.promises.readdir(migrationsPath);
            const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
            
            for (const file of sqlFiles) {
                const filePath = path.join(migrationsPath, file);
                const sql = await fs.promises.readFile(filePath, 'utf8');
                await connection.execute(sql);
                console.log(`✅ Applied migration: ${file}`);
            }
        } catch (err) {
            console.log('No migrations directory found, skipping...');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

if (require.main === module) {
    runMigrations().catch(console.error);
}

module.exports = { runMigrations };
