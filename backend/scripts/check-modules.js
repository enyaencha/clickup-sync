const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

async function checkModules() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'clickup_sync'
    });

    console.log('Program Modules:');
    console.log('='.repeat(80));

    const [modules] = await connection.query(
        'SELECT id, name, code, logframe_goal FROM program_modules WHERE deleted_at IS NULL'
    );

    for (const m of modules) {
        console.log(`ID: ${m.id}`);
        console.log(`Name: ${m.name}`);
        console.log(`Code: ${m.code}`);
        console.log(`Goal: ${m.logframe_goal || 'Not set'}`);

        // Check sub-programs and components count
        const [subs] = await connection.query(
            'SELECT COUNT(*) as count FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL',
            [m.id]
        );
        const [comps] = await connection.query(
            'SELECT COUNT(*) as count FROM project_components WHERE module_id = ? AND deleted_at IS NULL',
            [m.id]
        );
        const [acts] = await connection.query(
            'SELECT COUNT(*) as count FROM activities WHERE module_id = ? AND deleted_at IS NULL',
            [m.id]
        );

        console.log(`Sub-programs: ${subs[0].count}, Components: ${comps[0].count}, Activities: ${acts[0].count}`);
        console.log('-'.repeat(80));
    }

    await connection.end();
}

checkModules().catch(console.error);
