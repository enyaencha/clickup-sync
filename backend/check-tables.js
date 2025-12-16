/**
 * Quick script to check if Finance and Resource tables exist
 */
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Jjtech2019@@',
    database: 'me_clickup_system'
};

async function checkTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database\n');

        // Check for finance tables
        const [financeTables] = await connection.query(`
            SHOW TABLES LIKE 'finance_%'
        `);

        console.log('📊 Finance Tables:', financeTables.length > 0 ? financeTables.length + ' found' : 'NONE FOUND ❌');
        financeTables.forEach(row => {
            console.log('  -', Object.values(row)[0]);
        });

        // Check for resource tables
        const [resourceTables] = await connection.query(`
            SHOW TABLES LIKE 'resource%'
        `);

        console.log('\n📊 Resource Tables:', resourceTables.length > 0 ? resourceTables.length + ' found' : 'NONE FOUND ❌');
        resourceTables.forEach(row => {
            console.log('  -', Object.values(row)[0]);
        });

        if (financeTables.length === 0 || resourceTables.length === 0) {
            console.log('\n⚠️  TABLES MISSING! You need to run the migration:');
            console.log('   mysql -u root -p me_clickup_system < database/migrations/MANUAL_FINANCE_RESOURCE_MIGRATION.sql');
        } else {
            console.log('\n✅ All tables exist! Restart your backend server to apply code fixes.');
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Cannot connect to MySQL - server not running');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        if (connection) await connection.end();
    }
}

checkTables();
