const db = require('./core/database/connection');

async function checkSchema() {
    try {
        await db.initialize();

        const tables = ['activities', 'project_components', 'sub_programs', 'program_modules', 'me_indicators'];

        for (const table of tables) {
            console.log('\n' + '='.repeat(80));
            console.log(`TABLE: ${table}`);
            console.log('='.repeat(80));

            const columns = await db.query(`DESCRIBE ${table}`);
            console.log('\nColumns:');
            columns.forEach(col => {
                console.log(`  ${col.Field.padEnd(30)} ${col.Type.padEnd(20)} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'.padEnd(8)} ${col.Key ? `KEY: ${col.Key}` : ''}`);
            });

            // Sample data
            const sample = await db.query(`SELECT * FROM ${table} LIMIT 1`);
            if (sample.length > 0) {
                console.log('\nSample record:');
                console.log(JSON.stringify(sample[0], null, 2));
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

checkSchema();
