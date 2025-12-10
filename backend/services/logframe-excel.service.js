/**
 * Logframe Excel Service
 * Handles import/export of Logical Framework data to/from Excel templates
 */

const ExcelJS = require('exceljs');

class LogframeExcelService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Export logframe data to Excel in the client's template format
     */
    async exportToExcel(moduleId) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('RF');

        // Get module data
        const module = await this.db.queryOne(
            'SELECT * FROM program_modules WHERE id = ?',
            [moduleId]
        );

        if (!module) {
            throw new Error(`Module with id ${moduleId} not found`);
        }

        // Get sub-programs
        const subPrograms = await this.db.query(
            'SELECT * FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL',
            [moduleId]
        );

        // Set up header rows
        worksheet.mergeCells('B2:I2');
        worksheet.getCell('B2').value = 'LOGICAL FRAMEWORK TEMPLATE';
        worksheet.getCell('B2').font = { bold: true, size: 14 };
        worksheet.getCell('B2').alignment = { horizontal: 'center' };

        worksheet.getCell('B3').value = 'PROGRAM:';
        worksheet.getCell('C3').value = module.name;
        worksheet.getCell('B3').font = { bold: true };

        // If there's a sub-program, add it
        if (subPrograms.length > 0) {
            worksheet.getCell('B4').value = 'SUB-PROGRAM:';
            worksheet.getCell('C4').value = subPrograms.map(sp => sp.name).join(', ');
            worksheet.getCell('B4').font = { bold: true };
        }

        worksheet.getCell('B5').value = 'GOAL:';
        worksheet.getCell('C5').value = module.logframe_goal || '';
        worksheet.getCell('B5').font = { bold: true };

        // Column headers
        const headerRow = 6;
        const headers = [
            '',
            'Strategic Objective',
            'Intermediate Outcomes',
            'Outputs',
            'Key Activities',
            'Indicators',
            'Means of Verification',
            'Timeframe',
            'Responsibility'
        ];

        headers.forEach((header, idx) => {
            const cell = worksheet.getCell(headerRow, idx + 1);
            cell.value = header;
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        let currentRow = headerRow + 1;

        // Iterate through sub-programs
        for (const subProgram of subPrograms) {
            // Get components for this sub-program
            const components = await this.db.query(
                'SELECT * FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL',
                [subProgram.id]
            );

            // Add strategic objective (from module or sub-program)
            const startRow = currentRow;
            worksheet.getCell(currentRow, 2).value = module.logframe_goal || '';

            for (const component of components) {
                // Get activities for this component
                const activities = await this.db.query(
                    `SELECT * FROM activities
                     WHERE component_id = ? AND deleted_at IS NULL
                     ORDER BY start_date`,
                    [component.id]
                );

                // Get indicators for this component
                const indicators = await this.db.query(
                    `SELECT * FROM me_indicators
                     WHERE component_id = ? AND deleted_at IS NULL`,
                    [component.id]
                );

                // Get means of verification
                const movs = await this.db.query(
                    `SELECT * FROM means_of_verification
                     WHERE entity_type = 'component' AND entity_id = ? AND deleted_at IS NULL`,
                    [component.id]
                );

                if (activities.length === 0) {
                    // Add component row even if no activities
                    worksheet.getCell(currentRow, 3).value = subProgram.logframe_outcome || subProgram.outcome || subProgram.name || '';
                    worksheet.getCell(currentRow, 4).value = component.logframe_output || component.output || component.name || '';
                    worksheet.getCell(currentRow, 5).value = '';
                    worksheet.getCell(currentRow, 6).value = indicators.map(i => i.name).join('; ') || '';
                    worksheet.getCell(currentRow, 7).value = movs.map(m => m.verification_method).join('; ') || '';
                    worksheet.getCell(currentRow, 8).value = '';
                    worksheet.getCell(currentRow, 9).value = component.responsible_person || '';
                    currentRow++;
                }

                // Add activities
                for (const activity of activities) {
                    worksheet.getCell(currentRow, 3).value = subProgram.logframe_outcome || subProgram.outcome || subProgram.name || '';
                    worksheet.getCell(currentRow, 4).value = component.logframe_output || component.output || component.name || '';
                    worksheet.getCell(currentRow, 5).value = activity.name;

                    // Get indicators for this activity
                    const activityIndicators = await this.db.query(
                        `SELECT * FROM me_indicators
                         WHERE activity_id = ? AND deleted_at IS NULL`,
                        [activity.id]
                    );

                    worksheet.getCell(currentRow, 6).value = activityIndicators.map(i => i.name).join('; ') ||
                                                             indicators.map(i => i.name).join('; ') || '';
                    worksheet.getCell(currentRow, 7).value = movs.map(m => m.verification_method).join('; ') || '';

                    // Timeframe
                    let timeframe = '';
                    if (activity.start_date && activity.end_date) {
                        timeframe = `${this.formatDate(activity.start_date)} - ${this.formatDate(activity.end_date)}`;
                    } else if (activity.activity_date) {
                        timeframe = this.formatDate(activity.activity_date);
                    }
                    worksheet.getCell(currentRow, 8).value = timeframe;
                    worksheet.getCell(currentRow, 9).value = activity.responsible_person || '';

                    currentRow++;
                }
            }
        }

        // Add instructions at the bottom
        currentRow += 2;
        worksheet.getCell(currentRow, 2).value = 'Instructions:';
        worksheet.getCell(currentRow, 2).font = { bold: true };
        currentRow++;
        worksheet.getCell(currentRow, 2).value = '1. Use the strategic plan and operational plan to fill in the information';
        currentRow++;
        worksheet.getCell(currentRow, 2).value = '2. Under Strategic Objective, Intermediate Outcomes, Outputs, Key indicators, MOV, Time frame and responsibility use the guide provided in each of them';
        currentRow++;
        worksheet.getCell(currentRow, 2).value = '3. Create more rows as may be required';

        // Set column widths
        worksheet.getColumn(1).width = 5;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 30;
        worksheet.getColumn(4).width = 30;
        worksheet.getColumn(5).width = 30;
        worksheet.getColumn(6).width = 30;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 15;
        worksheet.getColumn(9).width = 25;

        // Apply borders to all data cells
        for (let i = headerRow; i < currentRow; i++) {
            for (let j = 1; j <= 9; j++) {
                const cell = worksheet.getCell(i, j);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'top', wrapText: true };
            }
        }

        return workbook;
    }

    /**
     * Import logframe data from Excel template
     */
    async importFromExcel(filePath, moduleId) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet('RF') || workbook.getWorksheet(1);

        const imported = {
            goal: null,
            subPrograms: [],
            components: [],
            activities: [],
            indicators: [],
            movs: []
        };

        // Read program and goal info
        let programName = null;
        let subProgramName = null;
        let goal = null;

        // Scan first few rows for metadata
        for (let row = 2; row <= 5; row++) {
            const labelCell = worksheet.getCell(row, 2).value;
            const valueCell = worksheet.getCell(row, 3).value;

            if (labelCell === 'PROGRAM:') {
                programName = valueCell;
            } else if (labelCell === 'SUB-PROGRAM:') {
                subProgramName = valueCell;
            } else if (labelCell === 'GOAL:') {
                goal = valueCell;
            }
        }

        // Update module goal if provided
        if (goal) {
            await this.db.query(
                'UPDATE program_modules SET logframe_goal = ? WHERE id = ?',
                [goal, moduleId]
            );
            imported.goal = goal;
        }

        // Find header row
        let headerRow = 6;
        for (let row = 2; row <= 10; row++) {
            const cell = worksheet.getCell(row, 2).value;
            if (cell && cell.toString().toLowerCase().includes('strategic objective')) {
                headerRow = row;
                break;
            }
        }

        // Parse data rows
        const dataStartRow = headerRow + 1;
        let currentStrategicObjective = null;
        let currentOutcome = null;
        let currentOutput = null;
        let currentSubProgramId = null;
        let currentComponentId = null;

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > headerRow) {
                rows.push({
                    rowNumber,
                    strategicObjective: row.getCell(2).value,
                    intermediateOutcome: row.getCell(3).value,
                    output: row.getCell(4).value,
                    keyActivity: row.getCell(5).value,
                    indicator: row.getCell(6).value,
                    mov: row.getCell(7).value,
                    timeframe: row.getCell(8).value,
                    responsibility: row.getCell(9).value
                });
            }
        });

        for (const rowData of rows) {
            // Skip empty rows or instruction rows
            if (!rowData.keyActivity && !rowData.output && !rowData.intermediateOutcome) continue;
            if (rowData.keyActivity && rowData.keyActivity.toString().toLowerCase().includes('instruction')) break;

            // Handle Intermediate Outcome (Sub-Program level)
            if (rowData.intermediateOutcome && rowData.intermediateOutcome !== currentOutcome) {
                currentOutcome = rowData.intermediateOutcome;

                // Create or find sub-program
                const existing = await this.db.query(
                    'SELECT id FROM sub_programs WHERE module_id = ? AND logframe_outcome = ? AND deleted_at IS NULL LIMIT 1',
                    [moduleId, currentOutcome]
                );

                if (existing.length > 0) {
                    currentSubProgramId = existing[0].id;
                } else {
                    // Create new sub-program
                    const code = `SUB-${moduleId}-${Date.now()}`;
                    const name = currentOutcome.substring(0, 100);
                    const result = await this.db.query(
                        `INSERT INTO sub_programs (module_id, name, code, logframe_outcome, start_date, end_date, status)
                         VALUES (?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'planning')`,
                        [moduleId, name, code, currentOutcome]
                    );
                    currentSubProgramId = result.insertId;
                    imported.subPrograms.push({ id: currentSubProgramId, name, outcome: currentOutcome });
                }
            }

            // Handle Output (Component level)
            if (rowData.output && rowData.output !== currentOutput) {
                currentOutput = rowData.output;

                // Create or find component
                const existing = await this.db.query(
                    'SELECT id FROM project_components WHERE sub_program_id = ? AND logframe_output = ? AND deleted_at IS NULL LIMIT 1',
                    [currentSubProgramId, currentOutput]
                );

                if (existing.length > 0) {
                    currentComponentId = existing[0].id;
                } else {
                    // Create new component
                    const code = `COMP-${currentSubProgramId}-${Date.now()}`;
                    const name = currentOutput.substring(0, 100);
                    const result = await this.db.query(
                        `INSERT INTO project_components (sub_program_id, name, code, logframe_output, status)
                         VALUES (?, ?, ?, ?, 'not-started')`,
                        [currentSubProgramId, name, code, currentOutput]
                    );
                    currentComponentId = result.insertId;
                    imported.components.push({ id: currentComponentId, name, output: currentOutput });
                }
            }

            // Handle Key Activity
            if (rowData.keyActivity && currentComponentId) {
                const activityName = rowData.keyActivity.toString().substring(0, 255);
                const code = `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                // Parse timeframe
                let startDate = null;
                let endDate = null;
                if (rowData.timeframe) {
                    const timeStr = rowData.timeframe.toString();
                    // Try to parse dates from various formats
                    const dateMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})|Q\d\s+\d{4}/);
                    if (dateMatch) {
                        startDate = dateMatch[0];
                    }
                }

                const result = await this.db.query(
                    `INSERT INTO activities (project_id, component_id, name, code, responsible_person, status)
                     VALUES (?, ?, ?, ?, ?, 'not-started')`,
                    [currentSubProgramId, currentComponentId, activityName, code, rowData.responsibility || '']
                );

                imported.activities.push({
                    id: result.insertId,
                    name: activityName,
                    component_id: currentComponentId
                });

                // Handle Indicator
                if (rowData.indicator) {
                    const indicatorName = rowData.indicator.toString().substring(0, 255);
                    const indicatorCode = `IND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                    const indResult = await this.db.query(
                        `INSERT INTO me_indicators (component_id, name, code, type, is_active)
                         VALUES (?, ?, ?, 'output', 1)`,
                        [currentComponentId, indicatorName, indicatorCode]
                    );

                    imported.indicators.push({
                        id: indResult.insertId,
                        name: indicatorName,
                        component_id: currentComponentId
                    });
                }

                // Handle Means of Verification
                if (rowData.mov) {
                    const movMethod = rowData.mov.toString().substring(0, 255);

                    const movResult = await this.db.query(
                        `INSERT INTO means_of_verification (entity_type, entity_id, verification_method, evidence_type)
                         VALUES ('component', ?, ?, 'document')`,
                        [currentComponentId, movMethod]
                    );

                    imported.movs.push({
                        id: movResult.insertId,
                        method: movMethod,
                        component_id: currentComponentId
                    });
                }
            }
        }

        return imported;
    }

    /**
     * Import logframe data from Excel file with multiple sheets
     * Each sheet is imported into its corresponding module (matched by sheet name/code)
     */
    async importFromExcelMultiSheet(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const results = {
            sheetsProcessed: 0,
            sheetsSkipped: 0,
            modules: []
        };

        // Process each worksheet
        for (const worksheet of workbook.worksheets) {
            const sheetName = worksheet.name;

            // Skip sheets that don't look like module data
            if (sheetName.toLowerCase() === 'instructions' ||
                sheetName.toLowerCase() === 'template' ||
                sheetName.toLowerCase() === 'readme') {
                results.sheetsSkipped++;
                continue;
            }

            try {
                // Try to find module by code (sheet name)
                const modules = await this.db.query(
                    'SELECT id, name, code FROM program_modules WHERE code = ? AND deleted_at IS NULL LIMIT 1',
                    [sheetName]
                );

                let moduleId;
                if (modules.length > 0) {
                    moduleId = modules[0].id;
                } else {
                    // Create new module if not found
                    const result = await this.db.query(
                        `INSERT INTO program_modules (name, code, status, start_date, end_date)
                         VALUES (?, ?, 'planning', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR))`,
                        [sheetName, sheetName]
                    );
                    moduleId = result.insertId;
                }

                // Import this sheet's data into the module
                const imported = await this.importWorksheetToModule(worksheet, moduleId);

                results.modules.push({
                    moduleId,
                    sheetName,
                    imported
                });
                results.sheetsProcessed++;

            } catch (error) {
                console.error(`Error importing sheet ${sheetName}:`, error);
                results.modules.push({
                    sheetName,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Import a specific worksheet into a module
     */
    async importWorksheetToModule(worksheet, moduleId) {
        const imported = {
            subPrograms: [],
            components: [],
            activities: [],
            indicators: [],
            movs: []
        };

        let currentSubProgramId = null;
        let currentComponentId = null;
        let currentOutcome = null;
        let currentOutput = null;

        // Find header row
        let headerRow = null;
        worksheet.eachRow((row, rowNumber) => {
            const firstCell = row.getCell(2).value;
            if (firstCell && firstCell.toString().toLowerCase().includes('strategic objective')) {
                headerRow = rowNumber;
            }
        });

        if (!headerRow) {
            throw new Error('Could not find header row in worksheet');
        }

        // Collect all data rows first
        const dataRows = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber <= headerRow) return;

            const rowData = {
                strategicObjective: row.getCell(2).value,
                intermediateOutcome: row.getCell(3).value,
                output: row.getCell(4).value,
                keyActivity: row.getCell(5).value,
                indicator: row.getCell(6).value,
                mov: row.getCell(7).value,
                timeframe: row.getCell(8).value,
                responsibility: row.getCell(9).value
            };

            // Skip empty rows and instruction rows
            if (!rowData.keyActivity && !rowData.output && !rowData.intermediateOutcome) return;
            if (rowData.keyActivity && rowData.keyActivity.toString().toLowerCase().includes('instruction')) return;

            dataRows.push(rowData);
        });

        // Process rows with async database operations
        for (const rowData of dataRows) {
            // Handle Intermediate Outcome (Sub-Program level)
            if (rowData.intermediateOutcome && rowData.intermediateOutcome !== currentOutcome) {
                currentOutcome = rowData.intermediateOutcome;

                // Create or find sub-program
                const existing = await this.db.query(
                    'SELECT id FROM sub_programs WHERE module_id = ? AND logframe_outcome = ? AND deleted_at IS NULL LIMIT 1',
                    [moduleId, currentOutcome]
                );

                if (existing.length > 0) {
                    currentSubProgramId = existing[0].id;
                } else {
                    // Create new sub-program
                    const code = `SUB-${moduleId}-${Date.now()}`;
                    const name = currentOutcome.substring(0, 100);
                    const result = await this.db.query(
                        `INSERT INTO sub_programs (module_id, name, code, logframe_outcome, start_date, end_date, status)
                         VALUES (?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'planning')`,
                        [moduleId, name, code, currentOutcome]
                    );
                    currentSubProgramId = result.insertId;
                    imported.subPrograms.push({ id: currentSubProgramId, name, outcome: currentOutcome });
                }
            }

            // Handle Output (Component level)
            if (rowData.output && rowData.output !== currentOutput) {
                currentOutput = rowData.output;

                // Create or find component
                const existing = await this.db.query(
                    'SELECT id FROM project_components WHERE sub_program_id = ? AND logframe_output = ? AND deleted_at IS NULL LIMIT 1',
                    [currentSubProgramId, currentOutput]
                );

                if (existing.length > 0) {
                    currentComponentId = existing[0].id;
                } else {
                    // Create new component
                    const code = `COMP-${currentSubProgramId}-${Date.now()}`;
                    const name = currentOutput.substring(0, 100);
                    const result = await this.db.query(
                        `INSERT INTO project_components (sub_program_id, name, code, logframe_output, status)
                         VALUES (?, ?, ?, ?, 'not-started')`,
                        [currentSubProgramId, name, code, currentOutput]
                    );
                    currentComponentId = result.insertId;
                    imported.components.push({ id: currentComponentId, name, output: currentOutput });
                }
            }

            // Handle Activity
            if (rowData.keyActivity && currentComponentId) {
                const activityName = rowData.keyActivity.toString().substring(0, 255);
                const code = `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                let startDate = null;
                if (rowData.timeframe) {
                    const timeStr = rowData.timeframe.toString();
                    const dateMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})|Q\d\s+\d{4}/);
                    if (dateMatch) {
                        startDate = dateMatch[0];
                    }
                }

                const result = await this.db.query(
                    `INSERT INTO activities (project_id, component_id, name, code, responsible_person, status)
                     VALUES (?, ?, ?, ?, ?, 'not-started')`,
                    [currentSubProgramId, currentComponentId, activityName, code, rowData.responsibility || '']
                );

                imported.activities.push({
                    id: result.insertId,
                    name: activityName,
                    component_id: currentComponentId
                });

                // Handle Indicator
                if (rowData.indicator) {
                    const indicatorName = rowData.indicator.toString().substring(0, 255);
                    const indicatorCode = `IND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                    const indResult = await this.db.query(
                        `INSERT INTO me_indicators (component_id, name, code, type, is_active)
                         VALUES (?, ?, ?, 'output', 1)`,
                        [currentComponentId, indicatorName, indicatorCode]
                    );

                    imported.indicators.push({
                        id: indResult.insertId,
                        name: indicatorName,
                        component_id: currentComponentId
                    });
                }

                // Handle Means of Verification
                if (rowData.mov) {
                    const movMethod = rowData.mov.toString().substring(0, 255);

                    const movResult = await this.db.query(
                        `INSERT INTO means_of_verification (entity_type, entity_id, verification_method, evidence_type)
                         VALUES ('component', ?, ?, 'document')`,
                        [currentComponentId, movMethod]
                    );

                    imported.movs.push({
                        id: movResult.insertId,
                        method: movMethod,
                        component_id: currentComponentId
                    });
                }
            }
        }

        return imported;
    }

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const quarter = Math.ceil(month / 3);
        const year = d.getFullYear();
        return `Q${quarter} ${year}`;
    }
}

module.exports = LogframeExcelService;
