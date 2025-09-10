// insertToken.js
require('dotenv').config({ path: __dirname + '/.env' });

console.log("Loaded ENCRYPTION_KEY:", process.env.ENCRYPTION_KEY);

const crypto = require('crypto');
const mysql = require('mysql2/promise');

async function main() {
    try {
        const encryptionKey = process.env.ENCRYPTION_KEY;
        if (!encryptionKey) {
            throw new Error("❌ ENCRYPTION_KEY is missing in .env");
        }
        if (encryptionKey.length !== 64) {
            throw new Error("❌ ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
        }

        // Token you want to store securely
        const token = "pk_206421374_YMGLVQYCTUW35FV775KRXL2WQO07RU0F";

        console.log("🔑 Using ENCRYPTION_KEY from .env");
        console.log("🔒 Encrypting token...");

        // AES-256-CBC encryption
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(encryptionKey, 'hex'),  // FIXED: use hex
            iv
        );

        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const encryptedToken = iv.toString('hex') + ':' + encrypted;

        console.log("✅ Token encrypted successfully");

        // Connect to DB
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log("📦 Connected to database:", process.env.DB_NAME);

        // Insert into sync_config
        const [result] = await db.execute(
            `INSERT INTO sync_config 
             (workspace_id, api_token_encrypted, webhook_secret, sync_status, sync_interval_minutes) 
             VALUES (?, ?, ?, 'active', ?)`,
            [
                'default_workspace',
                encryptedToken,
                process.env.CLICKUP_WEBHOOK_SECRET,
                process.env.SYNC_INTERVAL_MINUTES || 15
            ]
        );

        console.log("✅ Token inserted into sync_config!");
        console.log("📄 Insert ID:", result.insertId);

        await db.end();
    } catch (err) {
        console.error("❌ Error inserting token into sync_config:");
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);
        process.exit(1);
    }
}

main();
