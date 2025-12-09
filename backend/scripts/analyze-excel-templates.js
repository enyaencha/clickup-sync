/**
 * Analyze Excel template structures to identify column differences
 */

const ExcelJS = require('exceljs');
const path = require('path');

async function analyzeTemplate(filePath, templateName) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Analyzing: ${templateName}`);
    console.log('='.repeat(80));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];
    console.log(`\nWorksheet name: ${worksheet.name}`);

    // Find the header row (usually contains "Strategic Objective", "Outputs", etc.)
    let headerRow = null;
    let headerRowNumber = 0;

    worksheet.eachRow((row, rowNumber) => {
        const values = row.values;
        // Look for a row that contains "Strategic Objective" or "Intermediate Outcomes"
        const rowText = values.join('|').toLowerCase();
        if ((rowText.includes('strategic') || rowText.includes('intermediate')) && !headerRow) {
            headerRow = row;
            headerRowNumber = rowNumber;
        }
    });

    if (headerRow) {
        console.log(`\nHeader row found at row ${headerRowNumber}:`);
        console.log('-'.repeat(80));

        const headers = [];
        headerRow.eachCell((cell, colNumber) => {
            const value = cell.value?.toString().trim() || '';
            if (value) {
                headers.push({ col: colNumber, value });
                console.log(`Column ${colNumber}: "${value}"`);
            }
        });

        console.log(`\nTotal columns: ${headers.length}`);
        return { headerRowNumber, headers };
    } else {
        console.log('\n⚠️  Could not find header row');

        // Show first 10 rows for debugging
        console.log('\nFirst 10 rows:');
        let rowCount = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowCount < 10) {
                const values = row.values.slice(1).map(v => v?.toString().trim() || '').filter(v => v);
                if (values.length > 0) {
                    console.log(`Row ${rowNumber}: ${values.join(' | ')}`);
                }
                rowCount++;
            }
        });

        return null;
    }
}

async function main() {
    const seepPath = path.join(__dirname, '../../SEEP Results Framework and Logical framework _ CN _2024 Reworked Draft (1).xlsx');
    const foodPath = path.join(__dirname, '../../FOOD SECURITY Results Framework and Logical framework templates _ CN _2024 - Copy.xlsx');

    try {
        const seepStructure = await analyzeTemplate(seepPath, 'SEEP Template');
        const foodStructure = await analyzeTemplate(foodPath, 'FOOD SECURITY Template');

        // Compare structures
        console.log(`\n${'='.repeat(80)}`);
        console.log('COMPARISON');
        console.log('='.repeat(80));

        if (seepStructure && foodStructure) {
            console.log(`\nSEEP has ${seepStructure.headers.length} columns`);
            console.log(`FOOD SECURITY has ${foodStructure.headers.length} columns`);

            // Check for differences
            const maxCols = Math.max(seepStructure.headers.length, foodStructure.headers.length);
            console.log('\nColumn-by-column comparison:');
            console.log('-'.repeat(80));

            for (let i = 0; i < maxCols; i++) {
                const seepCol = seepStructure.headers[i];
                const foodCol = foodStructure.headers[i];
                const seepVal = seepCol ? `Col ${seepCol.col}: "${seepCol.value}"` : 'N/A';
                const foodVal = foodCol ? `Col ${foodCol.col}: "${foodCol.value}"` : 'N/A';
                const match = seepCol?.value === foodCol?.value ? '✓' : '✗';

                console.log(`${match} SEEP: ${seepVal.padEnd(40)} | FOOD: ${foodVal}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
