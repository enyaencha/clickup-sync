const ExcelJS = require('exceljs');
const path = require('path');

async function analyzeTemplate(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    console.log('\n' + '='.repeat(80));
    console.log('FILE:', path.basename(filePath));
    console.log('='.repeat(80));

    workbook.eachSheet((worksheet, sheetId) => {
        console.log(`\n--- SHEET ${sheetId}: "${worksheet.name}" ---`);
        console.log(`Rows: ${worksheet.rowCount}, Columns: ${worksheet.columnCount}`);

        // Find header row
        let headerRow = null;
        let headerRowNum = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 20) return; // Only check first 20 rows

            const firstCell = row.getCell(1).value || row.getCell(2).value;
            if (firstCell && (
                firstCell.toString().toLowerCase().includes('strategic') ||
                firstCell.toString().toLowerCase().includes('objective') ||
                firstCell.toString().toLowerCase().includes('outcome') ||
                firstCell.toString().toLowerCase().includes('output')
            )) {
                headerRow = row;
                headerRowNum = rowNumber;
            }
        });

        if (headerRow) {
            console.log(`\nHeader row found at row ${headerRowNum}:`);
            console.log('Columns:');
            headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const value = cell.value;
                if (value) {
                    console.log(`  [${colNumber}] ${value}`);
                }
            });

            // Sample first 3 data rows
            console.log(`\nSample data rows (${headerRowNum + 1} to ${headerRowNum + 3}):`);
            for (let i = headerRowNum + 1; i <= Math.min(headerRowNum + 3, worksheet.rowCount); i++) {
                const row = worksheet.getRow(i);
                console.log(`\nRow ${i}:`);
                row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                    const header = headerRow.getCell(colNumber).value;
                    if (header) {
                        console.log(`  ${header}: ${cell.value}`);
                    }
                });
            }
        } else {
            console.log('\nNo header row found. Showing first 5 rows:');
            for (let i = 1; i <= Math.min(5, worksheet.rowCount); i++) {
                const row = worksheet.getRow(i);
                console.log(`Row ${i}:`, row.values);
            }
        }
    });
}

async function main() {
    const files = [
        '/home/user/clickup-sync/FOOD SECURITY Results Framework and Logical framework templates _ CN _2024 - Copy.xlsx',
        '/home/user/clickup-sync/SEEP Results Framework and Logical framework _ CN _2024 Reworked Draft (1).xlsx'
    ];

    for (const file of files) {
        try {
            await analyzeTemplate(file);
        } catch (error) {
            console.error(`Error analyzing ${file}:`, error.message);
        }
    }
}

main().catch(console.error);
