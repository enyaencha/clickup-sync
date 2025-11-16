/**
 * M&E Service
 * Monitoring & Evaluation business logic
 */

const db = require('../../core/database/connection');
const logger = require('../../core/utils/logger');

class MEService {
    /**
     * Get all indicators
     */
    async getAllIndicators(filters = {}) {
        let sql = 'SELECT * FROM me_indicators WHERE is_active = TRUE';
        const params = [];

        if (filters.program_id) {
            sql += ' AND program_id = ?';
            params.push(filters.program_id);
        }

        if (filters.project_id) {
            sql += ' AND project_id = ?';
            params.push(filters.project_id);
        }

        if (filters.type) {
            sql += ' AND type = ?';
            params.push(filters.type);
        }

        sql += ' ORDER BY created_at DESC';

        return await db.query(sql, params);
    }

    /**
     * Get indicator by ID
     */
    async getIndicatorById(id) {
        const sql = 'SELECT * FROM me_indicators WHERE id = ?';
        return await db.queryOne(sql, [id]);
    }

    /**
     * Create indicator
     */
    async createIndicator(data) {
        const sql = `
            INSERT INTO me_indicators (
                program_id, project_id, activity_id, name, code,
                description, type, category, unit_of_measure,
                baseline_value, target_value, collection_frequency,
                data_source, verification_method, disaggregation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.program_id || null,
            data.project_id || null,
            data.activity_id || null,
            data.name,
            data.code,
            data.description || null,
            data.type,
            data.category || null,
            data.unit_of_measure || null,
            data.baseline_value || null,
            data.target_value,
            data.collection_frequency || 'monthly',
            data.data_source || null,
            data.verification_method || null,
            JSON.stringify(data.disaggregation || {})
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    /**
     * Record result for indicator
     */
    async recordResult(data) {
        const sql = `
            INSERT INTO me_results (
                indicator_id, reporting_period_start, reporting_period_end,
                value, disaggregation, data_collector, collection_date,
                notes, attachments
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.indicator_id,
            data.reporting_period_start,
            data.reporting_period_end,
            data.value,
            JSON.stringify(data.disaggregation || {}),
            data.data_collector || null,
            data.collection_date || new Date().toISOString().split('T')[0],
            data.notes || null,
            JSON.stringify(data.attachments || [])
        ];

        const result = await db.query(sql, params);

        // Update indicator current value
        await db.query(
            'UPDATE me_indicators SET current_value = ? WHERE id = ?',
            [data.value, data.indicator_id]
        );

        logger.info('Result recorded for indicator:', { indicatorId: data.indicator_id, resultId: result.insertId });

        return result.insertId;
    }

    /**
     * Get indicator performance
     */
    async getIndicatorPerformance(indicatorId) {
        const sql = `
            SELECT
                i.*,
                CASE
                    WHEN i.target_value > 0 THEN (i.current_value / i.target_value * 100)
                    ELSE 0
                END as achievement_percentage,
                COUNT(r.id) as total_reports,
                MAX(r.collection_date) as last_reported_date
            FROM me_indicators i
            LEFT JOIN me_results r ON i.id = r.indicator_id
            WHERE i.id = ?
            GROUP BY i.id
        `;

        return await db.queryOne(sql, [indicatorId]);
    }

    /**
     * Get M&E dashboard data
     */
    async getDashboard(filters = {}) {
        const dashboard = {
            total_indicators: 0,
            indicators_on_track: 0,
            indicators_off_track: 0,
            total_results_collected: 0,
            by_type: {},
            recent_results: []
        };

        // Total indicators
        let countSql = 'SELECT COUNT(*) as total FROM me_indicators WHERE is_active = TRUE';
        const countParams = [];

        if (filters.program_id) {
            countSql += ' AND program_id = ?';
            countParams.push(filters.program_id);
        }

        const countResult = await db.queryOne(countSql, countParams);
        dashboard.total_indicators = countResult ? countResult.total : 0;

        // Indicators by type
        let typeSql = 'SELECT type, COUNT(*) as count FROM me_indicators WHERE is_active = TRUE';
        const typeParams = [];

        if (filters.program_id) {
            typeSql += ' AND program_id = ?';
            typeParams.push(filters.program_id);
        }

        typeSql += ' GROUP BY type';

        const typeResults = await db.query(typeSql, typeParams);
        typeResults.forEach(row => {
            dashboard.by_type[row.type] = row.count;
        });

        // Recent results
        const recentSql = `
            SELECT r.*, i.name as indicator_name, i.code as indicator_code
            FROM me_results r
            INNER JOIN me_indicators i ON r.indicator_id = i.id
            ORDER BY r.collection_date DESC
            LIMIT 10
        `;

        dashboard.recent_results = await db.query(recentSql);

        return dashboard;
    }

    /**
     * Generate report
     */
    async generateReport(reportData) {
        const sql = `
            INSERT INTO me_reports (
                title, report_type, program_id, project_id,
                period_start, period_end, content, summary,
                status, generated_by, generated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            reportData.title,
            reportData.report_type,
            reportData.program_id || null,
            reportData.project_id || null,
            reportData.period_start,
            reportData.period_end,
            JSON.stringify(reportData.content || {}),
            reportData.summary || null,
            reportData.status || 'draft',
            reportData.generated_by || null
        ];

        const result = await db.query(sql, params);
        logger.info('M&E report generated:', { reportId: result.insertId });

        return result.insertId;
    }
}

module.exports = new MEService();
