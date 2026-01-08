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
        worksheet.mergeCells('B2:J2');
        worksheet.getCell('B2').value = 'LOGICAL FRAMEWORK';
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
            'Output',
            'Key Activities',
            'Indicators',
            'Means of Verification',
            'Timeframe',
            'Responsibility',
            'Status',
            'Progress %'
        ];

        headers.forEach((header, idx) => {
            const cell = worksheet.getCell(headerRow, idx + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });

        let currentRow = headerRow + 1;

        // Iterate through sub-programs
        for (const subProgram of subPrograms) {
            // Get components for this sub-program
            const components = await this.db.query(
                'SELECT * FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL',
                [subProgram.id]
            );

            for (const component of components) {
                // Get activities for this component
                const activities = await this.db.query(
                    `SELECT * FROM activities
                     WHERE component_id = ? AND deleted_at IS NULL
                     ORDER BY start_date`,
                    [component.id]
                );

                // Get component-level indicators
                const componentIndicators = await this.db.query(
                    `SELECT * FROM me_indicators
                     WHERE component_id = ? AND deleted_at IS NULL`,
                    [component.id]
                );

                // Get component-level means of verification
                const componentMovs = await this.db.query(
                    `SELECT * FROM means_of_verification
                     WHERE entity_type = 'component' AND entity_id = ? AND deleted_at IS NULL`,
                    [component.id]
                );

                // If no activities, add at least one row for the component
                const activitiesToProcess = activities.length > 0 ? activities : [null];

                for (const activity of activitiesToProcess) {
                    // Column 1: Row number (optional)
                    worksheet.getCell(currentRow, 1).value = '';

                    // Column 2: Strategic Objective
                    const strategicObjectiveContent = this.buildStrategicObjectiveContent(
                        module.logframe_goal,
                        activity
                    );
                    worksheet.getCell(currentRow, 2).value = strategicObjectiveContent;
                    worksheet.getCell(currentRow, 2).alignment = { vertical: 'top', wrapText: true };

                    // Column 3: Intermediate Outcomes
                    const intermediateOutcomesContent = this.buildIntermediateOutcomesContent(
                        subProgram.logframe_outcome,
                        activity
                    );
                    worksheet.getCell(currentRow, 3).value = intermediateOutcomesContent;
                    worksheet.getCell(currentRow, 3).alignment = { vertical: 'top', wrapText: true };

                    // Column 4: Output
                    worksheet.getCell(currentRow, 4).value = component.logframe_output || '';
                    worksheet.getCell(currentRow, 4).alignment = { vertical: 'top', wrapText: true };

                    // Column 5: Key Activities
                    worksheet.getCell(currentRow, 5).value = activity ? activity.name : '';
                    worksheet.getCell(currentRow, 5).alignment = { vertical: 'top', wrapText: true };

                    // Column 6: Indicators
                    let indicators = '';
                    if (activity) {
                        // Get activity-level indicators
                        const activityIndicators = await this.db.query(
                            `SELECT * FROM me_indicators
                             WHERE activity_id = ? AND deleted_at IS NULL`,
                            [activity.id]
                        );
                        indicators = activityIndicators.length > 0
                            ? activityIndicators.map(i => i.name).join('; ')
                            : componentIndicators.map(i => i.name).join('; ');
                    } else {
                        indicators = componentIndicators.map(i => i.name).join('; ');
                    }
                    worksheet.getCell(currentRow, 6).value = indicators;
                    worksheet.getCell(currentRow, 6).alignment = { vertical: 'top', wrapText: true };

                    // Column 7: Means of Verification
                    let movs = '';
                    if (activity) {
                        // Get activity-level MOVs
                        const activityMovs = await this.db.query(
                            `SELECT * FROM means_of_verification
                             WHERE entity_type = 'activity' AND entity_id = ? AND deleted_at IS NULL`,
                            [activity.id]
                        );
                        movs = activityMovs.length > 0
                            ? activityMovs.map(m => m.verification_method).join('; ')
                            : componentMovs.map(m => m.verification_method).join('; ');
                    } else {
                        movs = componentMovs.map(m => m.verification_method).join('; ');
                    }
                    worksheet.getCell(currentRow, 7).value = movs;
                    worksheet.getCell(currentRow, 7).alignment = { vertical: 'top', wrapText: true };

                    // Column 8: Timeframe
                    let timeframe = '';
                    if (activity) {
                        timeframe = this.formatTimeframe(activity);
                    }
                    worksheet.getCell(currentRow, 8).value = timeframe;
                    worksheet.getCell(currentRow, 8).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Column 9: Responsibility
                    const responsibility = activity 
                        ? (activity.responsible_person || '') 
                        : (component.responsible_person || '');
                    worksheet.getCell(currentRow, 9).value = responsibility;
                    worksheet.getCell(currentRow, 9).alignment = { vertical: 'top', wrapText: true };

                    // Column 10: Status
                    worksheet.getCell(currentRow, 10).value = activity?.status || '';
                    worksheet.getCell(currentRow, 10).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Column 11: Progress %
                    const progress = activity?.progress_percentage !== undefined 
                        ? `${activity.progress_percentage}%` 
                        : '';
                    worksheet.getCell(currentRow, 11).value = progress;
                    worksheet.getCell(currentRow, 11).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Apply borders to all cells in this row
                    for (let col = 1; col <= 11; col++) {
                        const cell = worksheet.getCell(currentRow, col);
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    }

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
        worksheet.getColumn(2).width = 35;  // Strategic Objective
        worksheet.getColumn(3).width = 35;  // Intermediate Outcomes
        worksheet.getColumn(4).width = 30;  // Output
        worksheet.getColumn(5).width = 30;  // Key Activities
        worksheet.getColumn(6).width = 30;  // Indicators
        worksheet.getColumn(7).width = 25;  // Means of Verification
        worksheet.getColumn(8).width = 15;  // Timeframe
        worksheet.getColumn(9).width = 25;  // Responsibility
        worksheet.getColumn(10).width = 15; // Status
        worksheet.getColumn(11).width = 12; // Progress %

        return workbook;
    }

    /**
     * Build Strategic Objective column content
     * Includes: Goal + Objectives + Expected Results
     */
    buildStrategicObjectiveContent(goal, activity) {
        let content = goal || 'Not set';

        if (activity) {
            if (activity.immediate_objectives) {
                content += `\n\nObjectives: ${activity.immediate_objectives}`;
            }
            if (activity.expected_results) {
                content += `\n\nExpected Results: ${activity.expected_results}`;
            }
        }

        return content;
    }

    /**
     * Build Intermediate Outcomes column content
     * Includes: Outcome + Outcomes + Challenges + Lessons + Recommendations
     */
    buildIntermediateOutcomesContent(outcome, activity) {
        let content = outcome || '(No outcome set)';

        if (activity) {
            if (activity.outcome_notes) {
                content += `\n\nOutcomes: ${activity.outcome_notes}`;
            }
            if (activity.challenges_faced) {
                content += `\n\nChallenges: ${activity.challenges_faced}`;
            }
            if (activity.lessons_learned) {
                content += `\n\nLessons: ${activity.lessons_learned}`;
            }
            if (activity.recommendations) {
                content += `\n\nRecommendations: ${activity.recommendations}`;
            }
        }

        return content;
    }

    /**
     * Format timeframe from activity dates to Quarter format
     */
    formatTimeframe(activity) {
        if (activity.start_date && activity.end_date) {
            const start = new Date(activity.start_date);
            const end = new Date(activity.end_date);
            const startQ = `Q${Math.ceil((start.getMonth() + 1) / 3)} ${start.getFullYear()}`;
            const endQ = `Q${Math.ceil((end.getMonth() + 1) / 3)} ${end.getFullYear()}`;
            return startQ === endQ ? startQ : `${startQ} - ${endQ}`;
        } else if (activity.activity_date) {
            const date = new Date(activity.activity_date);
            return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
        }
        return '';
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
                    responsibility: row.getCell(9).value,
                    status: row.getCell(10).value,
                    progress: row.getCell(11).value
                });
            }
        });

        for (const rowData of rows) {
            // Skip empty rows or instruction rows
            if (!rowData.keyActivity && !rowData.output && !rowData.intermediateOutcome) continue;
            if (rowData.keyActivity && rowData.keyActivity.toString().toLowerCase().includes('instruction')) break;

            // Handle Intermediate Outcome (Sub-Program level)
            if (rowData.intermediateOutcome && rowData.intermediateOutcome !== currentOutcome) {
                currentOutcome = this.extractMainContent(rowData.intermediateOutcome);

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
                    const dateMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})|Q\d\s+\d{4}/);
                    if (dateMatch) {
                        startDate = dateMatch[0];
                    }
                }

                // Parse progress percentage
                let progressPercentage = null;
                if (rowData.progress) {
                    const progressStr = rowData.progress.toString().replace('%', '');
                    const progressNum = parseInt(progressStr);
                    if (!isNaN(progressNum)) {
                        progressPercentage = progressNum;
                    }
                }

                const result = await this.db.query(
                    `INSERT INTO activities (project_id, component_id, name, code, responsible_person, status, progress_percentage)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        currentSubProgramId, 
                        currentComponentId, 
                        activityName, 
                        code, 
                        rowData.responsibility || '', 
                        rowData.status || 'not-started',
                        progressPercentage
                    ]
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
     * Extract main content from a cell that might contain additional data
     * (like "Outcome text\n\nOutcomes: ..." -> "Outcome text")
     */
    extractMainContent(text) {
        if (!text) return '';
        const str = text.toString();
        const firstBreak = str.indexOf('\n\n');
        return firstBreak > 0 ? str.substring(0, firstBreak) : str;
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
                responsibility: row.getCell(9).value,
                status: row.getCell(10).value,
                progress: row.getCell(11).value
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
                currentOutcome = this.extractMainContent(rowData.intermediateOutcome);

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

                // Parse progress percentage
                let progressPercentage = null;
                if (rowData.progress) {
                    const progressStr = rowData.progress.toString().replace('%', '');
                    const progressNum = parseInt(progressStr);
                    if (!isNaN(progressNum)) {
                        progressPercentage = progressNum;
                    }
                }

                const result = await this.db.query(
                    `INSERT INTO activities (project_id, component_id, name, code, responsible_person, status, progress_percentage)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        currentSubProgramId, 
                        currentComponentId, 
                        activityName, 
                        code, 
                        rowData.responsibility || '', 
                        rowData.status || 'not-started',
                        progressPercentage
                    ]
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