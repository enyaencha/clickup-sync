/**
 * Logframe Excel Service
 * Service for exporting/importing Logical Framework data to/from Excel
 */

const ExcelJS = require('exceljs');

class LogframeExcelService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Export logframe data to Excel
     */
    async exportToExcel(moduleId) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Logframe');

        // Get module data
        const module = await this.db.queryOne(
            'SELECT * FROM program_modules WHERE id = ?',
            [moduleId]
        );

        if (!module) {
            throw new Error('Module not found');
        }

        // Get all logframe data
        const logframeData = await this.getLogframeData(moduleId);

        // Set up columns
        worksheet.columns = [
            { header: 'Strategic Objective', key: 'strategic_objective', width: 30 },
            { header: 'Intermediate Outcomes', key: 'intermediate_outcomes', width: 35 },
            { header: 'Output', key: 'output', width: 30 },
            { header: 'Key Activities', key: 'key_activities', width: 30 },
            { header: 'Indicators', key: 'indicators', width: 30 },
            { header: 'Means of Verification', key: 'means_of_verification', width: 25 },
            { header: 'Timeframe', key: 'timeframe', width: 15 },
            { header: 'Responsibility', key: 'responsibility', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Progress %', key: 'progress', width: 12 }
        ];

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        headerRow.height = 30;

        // Add data rows
        let rowIndex = 2;
        for (const subProgram of logframeData.subPrograms) {
            for (const component of subProgram.components) {
                const activities = component.activities.length > 0 
                    ? component.activities 
                    : [null];

                for (const activity of activities) {
                    const row = worksheet.getRow(rowIndex);

                    // Strategic Objective Column
                    const strategicObjectiveContent = this.buildStrategicObjectiveContent(
                        module.logframe_goal,
                        activity
                    );
                    row.getCell(1).value = strategicObjectiveContent;
                    row.getCell(1).alignment = { vertical: 'top', wrapText: true };

                    // Intermediate Outcomes Column
                    const intermediateOutcomesContent = this.buildIntermediateOutcomesContent(
                        subProgram.logframe_outcome,
                        activity
                    );
                    row.getCell(2).value = intermediateOutcomesContent;
                    row.getCell(2).alignment = { vertical: 'top', wrapText: true };

                    // Output Column
                    row.getCell(3).value = component.logframe_output || '';
                    row.getCell(3).alignment = { vertical: 'top', wrapText: true };

                    // Key Activities Column
                    row.getCell(4).value = activity ? activity.name : '';
                    row.getCell(4).alignment = { vertical: 'top', wrapText: true };

                    // Indicators Column
                    const indicators = activity?.indicators?.length > 0
                        ? activity.indicators.map(ind => ind.name).join('; ')
                        : component.indicators?.map(ind => ind.name).join('; ') || '';
                    row.getCell(5).value = indicators;
                    row.getCell(5).alignment = { vertical: 'top', wrapText: true };

                    // Means of Verification Column
                    const movs = activity?.means_of_verification?.length > 0
                        ? activity.means_of_verification.map(mov => mov.verification_method).join('; ')
                        : component.means_of_verification?.map(mov => mov.verification_method).join('; ') || '';
                    row.getCell(6).value = movs;
                    row.getCell(6).alignment = { vertical: 'top', wrapText: true };

                    // Timeframe Column
                    row.getCell(7).value = activity ? this.formatTimeframe(activity) : '';
                    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Responsibility Column
                    row.getCell(8).value = activity 
                        ? (activity.responsible_person || '') 
                        : (component.responsible_person || '');
                    row.getCell(8).alignment = { vertical: 'top', wrapText: true };

                    // Status Column
                    row.getCell(9).value = activity?.status || '';
                    row.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Progress % Column
                    row.getCell(10).value = activity?.progress_percentage !== undefined 
                        ? `${activity.progress_percentage}%` 
                        : '';
                    row.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' };

                    // Set row height
                    row.height = Math.max(30, this.calculateRowHeight(row));

                    // Add borders
                    for (let i = 1; i <= 10; i++) {
                        row.getCell(i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    }

                    rowIndex++;
                }
            }
        }

        return workbook;
    }

    /**
     * Build Strategic Objective column content
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
     * Format timeframe from activity dates
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
     * Calculate row height based on content
     */
    calculateRowHeight(row) {
        let maxLines = 1;
        
        for (let i = 1; i <= 10; i++) {
            const cell = row.getCell(i);
            if (cell.value) {
                const lines = cell.value.toString().split('\n').length;
                maxLines = Math.max(maxLines, lines);
            }
        }
        
        return maxLines * 15 + 10; // 15 pixels per line + 10 padding
    }

    /**
     * Get complete logframe data for a module
     */
    async getLogframeData(moduleId) {
        const module = await this.db.queryOne(
            'SELECT * FROM program_modules WHERE id = ?',
            [moduleId]
        );

        const subPrograms = await this.db.query(
            'SELECT * FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL ORDER BY name',
            [moduleId]
        );

        const logframeData = {
            module,
            subPrograms: []
        };

        for (const subProgram of subPrograms) {
            const components = await this.db.query(
                'SELECT * FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL ORDER BY name',
                [subProgram.id]
            );

            const subProgramData = {
                id: subProgram.id,
                name: subProgram.name,
                logframe_outcome: subProgram.logframe_outcome,
                components: []
            };

            for (const component of components) {
                const activities = await this.db.query(
                    `SELECT * FROM activities 
                     WHERE component_id = ? AND deleted_at IS NULL 
                     ORDER BY start_date`,
                    [component.id]
                );

                // Get activity-level indicators and MOVs
                for (const activity of activities) {
                    activity.indicators = await this.db.query(
                        'SELECT * FROM me_indicators WHERE activity_id = ? AND deleted_at IS NULL',
                        [activity.id]
                    );

                    activity.means_of_verification = await this.db.query(
                        `SELECT * FROM means_of_verification
                         WHERE entity_type = 'activity' AND entity_id = ? AND deleted_at IS NULL`,
                        [activity.id]
                    );
                }

                const componentIndicators = await this.db.query(
                    'SELECT * FROM me_indicators WHERE component_id = ? AND deleted_at IS NULL',
                    [component.id]
                );

                const componentMovs = await this.db.query(
                    `SELECT * FROM means_of_verification
                     WHERE entity_type = 'component' AND entity_id = ? AND deleted_at IS NULL`,
                    [component.id]
                );

                subProgramData.components.push({
                    id: component.id,
                    name: component.name,
                    logframe_output: component.logframe_output,
                    responsible_person: component.responsible_person,
                    activities: activities,
                    indicators: componentIndicators,
                    means_of_verification: componentMovs
                });
            }

            logframeData.subPrograms.push(subProgramData);
        }

        return logframeData;
    }

    /**
     * Import logframe data from Excel
     */
    async importFromExcel(filePath, moduleId) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('No worksheet found in the uploaded file');
        }

        // TODO: Implement import logic based on your requirements
        // This would parse the Excel file and create/update records in the database

        return {
            success: true,
            message: 'Import functionality to be implemented'
        };
    }

    /**
     * Import from multiple sheets
     */
    async importFromExcelMultiSheet(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        // TODO: Implement multi-sheet import logic

        return {
            success: true,
            sheetsProcessed: 0,
            sheetsSkipped: 0,
            modules: []
        };
    }
}

module.exports = LogframeExcelService;