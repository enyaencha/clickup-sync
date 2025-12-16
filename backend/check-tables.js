/**
 * Quick script to check if Finance and Resource tables exist
 * Prompts for database credentials interactively
 */
const mysql = require('mysql2/promise');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline question
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function getDbConfig() {
    console.log('🔐 Database Connection Setup\n');

    const host = await question('Database Host (default: localhost): ') || 'localhost';
    const user = await question('Database User (default: root): ') || 'root';
    const password = await question('Database Password: ');
    const database = await question('Database Name (default: me_clickup_system): ') || 'me_clickup_system';

    console.log(''); // Empty line for spacing

    return { host, user, password, database };
}

async function checkTables() {
    let connection;
    try {
        // Get database configuration from user
        const dbConfig = await getDbConfig();

        console.log('🚀 Checking Finance and Resource tables...\n');

        // Connect to database
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
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('❌ Access denied - check your username and password');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        if (connection) await connection.end();
        rl.close();
    }
}

// Run the check
checkTables()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 Fatal error:', error);
        rl.close();
        process.exit(1);
    });
