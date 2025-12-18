/**
 * MySQL to PostgreSQL Schema Converter
 *
 * Converts the complete MySQL schema to PostgreSQL-compatible format
 */

const fs = require('fs').promises;
const path = require('path');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

/**
 * Convert MySQL data types to PostgreSQL
 */
function convertDataType(mysqlType) {
    // Convert common MySQL types to PostgreSQL
    let pgType = mysqlType;

    // Integer types (order matters - do BIGINT before INT)
    pgType = pgType.replace(/BIGINT(\(\d+\))?/gi, 'BIGINT');
    pgType = pgType.replace(/TINYINT\(1\)/gi, 'BOOLEAN');
    pgType = pgType.replace(/TINYINT(\(\d+\))?/gi, 'SMALLINT');
    pgType = pgType.replace(/SMALLINT(\(\d+\))?/gi, 'SMALLINT');
    pgType = pgType.replace(/MEDIUMINT(\(\d+\))?/gi, 'INTEGER');
    pgType = pgType.replace(/INT(\(\d+\))?/gi, 'INTEGER');

    // String types
    pgType = pgType.replace(/VARCHAR\((\d+)\)/gi, 'VARCHAR($1)');
    pgType = pgType.replace(/CHAR\((\d+)\)/gi, 'CHAR($1)');
    pgType = pgType.replace(/LONGTEXT/gi, 'TEXT');
    pgType = pgType.replace(/MEDIUMTEXT/gi, 'TEXT');
    pgType = pgType.replace(/TEXT/gi, 'TEXT');

    // Date/Time types
    pgType = pgType.replace(/DATETIME/gi, 'TIMESTAMP');
    pgType = pgType.replace(/TIMESTAMP/gi, 'TIMESTAMP');

    // Decimal types
    pgType = pgType.replace(/DECIMAL\((\d+),(\d+)\)/gi, 'DECIMAL($1,$2)');
    pgType = pgType.replace(/DOUBLE/gi, 'DOUBLE PRECISION');
    pgType = pgType.replace(/FLOAT/gi, 'REAL');

    // JSON type
    pgType = pgType.replace(/JSON/gi, 'JSONB');

    return pgType;
}

/**
 * Convert ENUM to PostgreSQL format
 */
function convertEnum(line) {
    // Replace all enum(...) with VARCHAR(100) for simplicity
    // PostgreSQL supports ENUM but requires CREATE TYPE first, so we use VARCHAR
    line = line.replace(/\s+enum\([^)]+\)/gi, ' VARCHAR(100)');
    return line;
}

/**
 * Convert AUTO_INCREMENT to SERIAL or GENERATED ALWAYS AS IDENTITY
 */
function convertAutoIncrement(line) {
    // Convert AUTO_INCREMENT to GENERATED ALWAYS AS IDENTITY
    // Note: Data types are already converted at this point (INTEGER, BIGINT)
    if (line.includes('AUTO_INCREMENT')) {
        // Replace BIGINT ... AUTO_INCREMENT with BIGSERIAL
        line = line.replace(/BIGINT\s+NOT NULL\s+AUTO_INCREMENT/gi, 'BIGSERIAL');
        // Replace INTEGER ... AUTO_INCREMENT with SERIAL
        line = line.replace(/INTEGER\s+NOT NULL\s+AUTO_INCREMENT/gi, 'SERIAL');
        // Fallback: remove any remaining AUTO_INCREMENT
        line = line.replace(/\s*AUTO_INCREMENT/gi, '');
    }

    return line;
}

/**
 * Remove MySQL-specific syntax
 */
function removeMySQLSpecific(line) {
    // Remove MySQL comments
    if (line.match(/^\/\*!.*?\*\/;?$/)) {
        return '';
    }

    // Remove ENGINE, CHARSET, COLLATE, etc.
    line = line.replace(/ENGINE=\w+/gi, '');
    line = line.replace(/DEFAULT CHARSET=\w+/gi, '');
    line = line.replace(/COLLATE=\w+/gi, '');
    line = line.replace(/CHARACTER SET \w+/gi, '');
    line = line.replace(/COLLATE \w+/gi, '');
    line = line.replace(/AUTO_INCREMENT=\d+/gi, '');

    // Remove table/column comments in ENGINE line
    line = line.replace(/\s*COMMENT\s*=\s*'[^']*'/gi, '');

    // Convert backticks to double quotes
    line = line.replace(/`/g, '"');

    // Remove LOCK TABLES and UNLOCK TABLES
    if (line.match(/^(LOCK|UNLOCK) TABLES/i)) {
        return '';
    }

    // Remove ALTER TABLE DISABLE/ENABLE KEYS
    if (line.match(/ALTER TABLE .* (DISABLE|ENABLE) KEYS/i)) {
        return '';
    }

    // Fix CONSTRAINTEGER -> CONSTRAINT (happens when CONSTRAINT + INTEGER get merged)
    line = line.replace(/CONSTRAINTEGER/gi, 'CONSTRAINT');

    return line;
}

/**
 * Convert MySQL comments to PostgreSQL format
 */
function convertComments(line) {
    // Convert inline COMMENT 'text' to PostgreSQL format
    const commentMatch = line.match(/COMMENT\s+'([^']*)'/i);
    if (commentMatch) {
        // For now, just remove inline comments - we can add them back as separate COMMENT ON statements
        line = line.replace(/\s*COMMENT\s+'[^']*'/gi, '');
    }
    return line;
}

/**
 * Fix DEFAULT CURRENT_TIMESTAMP
 */
function fixDefaultTimestamp(line) {
    line = line.replace(/DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DEFAULT CURRENT_TIMESTAMP');
    return line;
}

/**
 * Convert KEY/INDEX definitions
 */
function convertIndexes(line) {
    // Remove regular INDEX/KEY definitions (can't be inline in PostgreSQL CREATE TABLE)
    if (line.match(/^\s*(INDEX|KEY)\s+/i)) {
        return '';  // Skip regular indexes
    }

    // Keep UNIQUE constraints but fix the syntax
    if (line.match(/^\s*UNIQUE\s+(KEY|INDEX)\s+/i)) {
        // Skip UNIQUE indexes too - they'll need to be created separately
        return '';
    }

    return line;
}

/**
 * Convert functional indexes (CAST expressions)
 */
function convertFunctionalIndexes(line) {
    // Remove functional indexes like ((cast(`module_specific_data` as char(255) charset utf8mb4)))
    if (line.includes('cast(') || line.includes('CAST(')) {
        // Skip functional indexes - we'll need to create them separately
        return '';
    }
    return line;
}

/**
 * Main conversion function
 */
async function convertSchema() {
    const startTime = Date.now();

    try {
        log('\n🔄 Starting MySQL to PostgreSQL Schema Conversion\n', colors.bright + colors.cyan);

        const mysqlSchemaPath = path.join(__dirname, '../../database/me_clickup_system_2025_dec_16.sql');
        const postgresSchemaPath = path.join(__dirname, '../../database/me_clickup_system_postgres.sql');

        log('📖 Reading MySQL schema file...', colors.blue);
        const mysqlSchema = await fs.readFile(mysqlSchemaPath, 'utf8');

        log('⚙️  Converting schema to PostgreSQL format...', colors.yellow);

        const lines = mysqlSchema.split('\n');
        const convertedLines = [];
        let skipInserts = false;
        let tableCount = 0;
        let inCreateTable = false;
        let tableBuffer = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Skip MySQL-specific comments and directives
            if (line.match(/^\/\*!.*?\*\/;?$/)) {
                continue;
            }

            // Remove LOCK/UNLOCK TABLES
            if (line.match(/^(LOCK|UNLOCK) TABLES/i)) {
                continue;
            }

            // Remove ALTER TABLE DISABLE/ENABLE KEYS
            if (line.match(/ALTER TABLE .* (DISABLE|ENABLE) KEYS/i)) {
                continue;
            }

            // Track CREATE TABLE statements
            if (line.match(/^CREATE TABLE/i)) {
                inCreateTable = true;
                tableCount++;
                tableBuffer = [];
            }

            if (inCreateTable) {
                // Apply all conversions (ORDER MATTERS!)
                line = removeMySQLSpecific(line);  // First - removes backticks, etc
                line = convertDataType(line);       // Second - convert types BEFORE auto_increment
                line = convertAutoIncrement(line);  // Third - convert AUTO_INCREMENT using already-converted types
                line = convertEnum(line);           // Fourth - convert ENUMs
                line = convertComments(line);       // Fifth - remove comments
                line = fixDefaultTimestamp(line);   // Sixth - fix timestamps
                line = convertIndexes(line);        // Seventh - remove indexes
                line = convertFunctionalIndexes(line);  // Eighth - remove functional indexes

                // Final cleanup of the line
                line = line.replace(/CONSTRAINTEGER/gi, 'CONSTRAINT');

                if (line.trim()) {
                    tableBuffer.push(line);
                }

                // Check if CREATE TABLE statement is complete
                if (line.includes(');')) {
                    inCreateTable = false;

                    // Clean up the table definition
                    let tableSQL = tableBuffer.join('\n');

                    // Remove trailing commas before closing parenthesis
                    tableSQL = tableSQL.replace(/,(\s*\))/g, '$1');

                    // Remove empty lines
                    tableSQL = tableSQL.split('\n').filter(l => l.trim()).join('\n');

                    convertedLines.push(tableSQL);
                    convertedLines.push('');
                }
            } else {
                // Handle INSERT statements - convert them too
                if (line.match(/^INSERT INTO/i)) {
                    line = removeMySQLSpecific(line);
                    if (line.trim()) {
                        convertedLines.push(line);
                    }
                } else if (line.match(/^(DROP TABLE|CREATE TABLE|--)/i)) {
                    // Keep DROP TABLE, CREATE TABLE, and comments
                    line = removeMySQLSpecific(line);
                    if (line.trim()) {
                        convertedLines.push(line);
                    }
                } else if (line.trim() && !line.match(/^\/\*/)) {
                    // Keep other SQL statements
                    line = removeMySQLSpecific(line);
                    if (line.trim()) {
                        convertedLines.push(line);
                    }
                }
            }
        }

        // Write converted schema
        log('💾 Writing PostgreSQL schema file...', colors.blue);
        const postgresSchema = convertedLines.join('\n');
        await fs.writeFile(postgresSchemaPath, postgresSchema, 'utf8');

        const fileSize = (postgresSchema.length / 1024).toFixed(2);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        log(`\n✅ Conversion completed successfully!`, colors.green + colors.bright);
        log(`   📊 Tables converted: ${tableCount}`, colors.green);
        log(`   📦 Output file size: ${fileSize} KB`, colors.green);
        log(`   ⏱️  Duration: ${duration}s`, colors.green);
        log(`   📁 Output: ${postgresSchemaPath}\n`, colors.cyan);

        return postgresSchemaPath;

    } catch (error) {
        log('\n❌ Conversion failed:', colors.red);
        log(error.message, colors.red);
        console.error(error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    convertSchema()
        .then(() => {
            log('🎉 Schema conversion complete!\n', colors.bright + colors.green);
            process.exit(0);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { convertSchema };
