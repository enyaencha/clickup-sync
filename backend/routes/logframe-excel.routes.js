/**
 * Logframe Excel Routes
 * Routes for importing/exporting Logical Framework data to/from Excel
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'logframe');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logframe-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

module.exports = (logframeExcelService) => {
    /**
     * Export logframe data to Excel
     * GET /api/logframe/export/:moduleId
     */
    router.get('/export/:moduleId', async (req, res) => {
        try {
            const moduleId = req.params.moduleId;

            console.log(`Exporting logframe for module ${moduleId}`);

            const workbook = await logframeExcelService.exportToExcel(moduleId);

            // Get module name for filename
            const module = await logframeExcelService.db.queryOne(
                'SELECT name, code FROM program_modules WHERE id = ?',
                [moduleId]
            );

            const moduleName = module?.code || `module-${moduleId}`;
            const filename = `Logframe_${moduleName}_${Date.now()}.xlsx`;

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${filename}"`
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Export error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Import logframe data from Excel
     * POST /api/logframe/import/:moduleId
     */
    router.post('/import/:moduleId', upload.single('file'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            const moduleId = req.params.moduleId;
            const filePath = req.file.path;

            console.log(`Importing logframe from ${filePath} to module ${moduleId}`);

            const imported = await logframeExcelService.importFromExcel(filePath, moduleId);

            // Clean up uploaded file
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.warn('Could not delete uploaded file:', err);
            }

            res.json({
                success: true,
                data: imported,
                message: 'Logframe data imported successfully',
                summary: {
                    subPrograms: imported.subPrograms.length,
                    components: imported.components.length,
                    activities: imported.activities.length,
                    indicators: imported.indicators.length,
                    movs: imported.movs.length
                }
            });
        } catch (error) {
            console.error('Import error:', error);

            // Clean up uploaded file on error
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (err) {
                    console.warn('Could not delete uploaded file:', err);
                }
            }

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Export all modules' logframes to a single workbook
     * GET /api/logframe/export-all
     */
    router.get('/export-all', async (req, res) => {
        try {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();

            // Get all modules
            const modules = await logframeExcelService.db.query(
                'SELECT id, name, code FROM program_modules WHERE deleted_at IS NULL ORDER BY code'
            );

            // Export each module to a separate sheet
            for (const module of modules) {
                const moduleWorkbook = await logframeExcelService.exportToExcel(module.id);
                const moduleWorksheet = moduleWorkbook.getWorksheet(1);

                if (moduleWorksheet) {
                    // Copy worksheet to main workbook
                    const newWorksheet = workbook.addWorksheet(module.code);

                    // Copy all rows and formatting
                    moduleWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const newRow = newWorksheet.getRow(rowNumber);
                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = cell.style;
                        });
                        newRow.commit();
                    });

                    // Copy column widths
                    moduleWorksheet.columns.forEach((column, idx) => {
                        newWorksheet.getColumn(idx + 1).width = column.width;
                    });

                    // Copy merged cells
                    Object.keys(moduleWorksheet._merges).forEach(key => {
                        newWorksheet.mergeCells(key);
                    });
                }
            }

            const filename = `Logframe_All_Modules_${Date.now()}.xlsx`;

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${filename}"`
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Export all error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get logframe data as JSON (for preview or frontend display)
     * GET /api/logframe/data/:moduleId
     */
    router.get('/data/:moduleId', async (req, res) => {
        try {
            const moduleId = req.params.moduleId;

            // Get module data
            const module = await logframeExcelService.db.queryOne(
                'SELECT * FROM program_modules WHERE id = ?',
                [moduleId]
            );

            if (!module) {
                return res.status(404).json({
                    success: false,
                    error: 'Module not found'
                });
            }

            // Get sub-programs
            const subPrograms = await logframeExcelService.db.query(
                'SELECT * FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL ORDER BY name',
                [moduleId]
            );

            // Get all data for each sub-program
            const logframeData = {
                module: {
                    id: module.id,
                    name: module.name,
                    code: module.code,
                    goal: module.logframe_goal
                },
                subPrograms: []
            };

            for (const subProgram of subPrograms) {
                const components = await logframeExcelService.db.query(
                    'SELECT * FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL ORDER BY name',
                    [subProgram.id]
                );

                const subProgramData = {
                    id: subProgram.id,
                    name: subProgram.name,
                    outcome: subProgram.logframe_outcome,
                    components: []
                };

                for (const component of components) {
                    const activities = await logframeExcelService.db.query(
                        'SELECT * FROM activities WHERE component_id = ? AND deleted_at IS NULL ORDER BY start_date',
                        [component.id]
                    );

                    const indicators = await logframeExcelService.db.query(
                        'SELECT * FROM me_indicators WHERE component_id = ? AND deleted_at IS NULL',
                        [component.id]
                    );

                    const movs = await logframeExcelService.db.query(
                        `SELECT * FROM means_of_verification
                         WHERE entity_type = 'component' AND entity_id = ? AND deleted_at IS NULL`,
                        [component.id]
                    );

                    subProgramData.components.push({
                        id: component.id,
                        name: component.name,
                        output: component.logframe_output,
                        responsible_person: component.responsible_person,
                        activities: activities,
                        indicators: indicators,
                        means_of_verification: movs
                    });
                }

                logframeData.subPrograms.push(subProgramData);
            }

            res.json({
                success: true,
                data: logframeData
            });
        } catch (error) {
            console.error('Get logframe data error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
