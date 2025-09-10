const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    try {
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.execute(`USE ${process.env.DB_NAME}`);

        // Read and execute the main schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        await connection.execute(schema);
        console.log('✅ Database schema created successfully');

        // Run migration files
        const migrationsPath = path.join(__dirname, 'migrations');
        try {
            const files = await fs.readdir(migrationsPath);
            const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
            
            for (const file of sqlFiles) {
                const filePath = path.join(migrationsPath, file);
                const sql = await fs.readFile(filePath, 'utf8');
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
