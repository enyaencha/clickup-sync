/**
 * Database Connection Manager
 * Handles MySQL connection pooling and query execution
 */

const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

class DatabaseManager {
    constructor() {
        this.pool = null;
    }

    /**
     * Initialize database connection pool
     */
    async initialize(config = {}) {
        try {
            const poolConfig = {
                host: config.host || process.env.DB_HOST || 'localhost',
                user: config.user || process.env.DB_USER || 'root',
                password: config.password || process.env.DB_PASSWORD || '',
                database: config.database || process.env.DB_NAME || 'me_clickup_system',
                waitForConnections: true,
                connectionLimit: config.connectionLimit || 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
                charset: 'utf8mb4'
            };

            this.pool = mysql.createPool(poolConfig);

            // Test connection
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();

            logger.info('Database connection pool initialized successfully');
            return true;
        } catch (error) {
            logger.error('Failed to initialize database connection:', error);
            throw error;
        }
    }

    /**
     * Execute a query
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Array>} Query results
     */
    async query(sql, params = []) {
        try {
            const [results] = await this.pool.execute(sql, params);
            return results;
        } catch (error) {
            logger.error('Database query error:', { sql, params, error: error.message });
            throw error;
        }
    }

    /**
     * Execute a query and return first row
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Object|null>} First row or null
     */
    async queryOne(sql, params = []) {
        const results = await this.query(sql, params);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Begin a transaction
     * @returns {Promise<Connection>} Database connection
     */
    async beginTransaction() {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    /**
     * Commit a transaction
     * @param {Connection} connection - Database connection
     */
    async commit(connection) {
        await connection.commit();
        connection.release();
    }

    /**
     * Rollback a transaction
     * @param {Connection} connection - Database connection
     */
    async rollback(connection) {
        await connection.rollback();
        connection.release();
    }

    /**
     * Execute queries in a transaction
     * @param {Function} callback - Function that receives connection and executes queries
     * @returns {Promise<any>} Result from callback
     */
    async transaction(callback) {
        const connection = await this.beginTransaction();
        try {
            const result = await callback(connection);
            await this.commit(connection);
            return result;
        } catch (error) {
            await this.rollback(connection);
            throw error;
        }
    }

    /**
     * Close all connections in the pool
     */
    async close() {
        if (this.pool) {
            await this.pool.end();
            logger.info('Database connection pool closed');
        }
    }

    /**
     * Get connection pool statistics
     * @returns {Object} Pool statistics
     */
    getPoolStats() {
        if (!this.pool) return null;

        return {
            totalConnections: this.pool._allConnections.length,
            freeConnections: this.pool._freeConnections.length,
            queueLength: this.pool._connectionQueue.length
        };
    }

    /**
     * Health check
     * @returns {Promise<boolean>} True if database is healthy
     */
    async healthCheck() {
        try {
            await this.query('SELECT 1');
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;
