/**
 * Application Logger
 * Provides structured logging with different levels
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };

        this.currentLevel = this.levels[process.env.LOG_LEVEL || 'INFO'];
        this.logsDir = path.join(__dirname, '../../../logs');

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    /**
     * Format log message
     */
    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';

        return `[${timestamp}] [${level}] ${message} ${metaStr}`.trim();
    }

    /**
     * Write log to file
     */
    writeToFile(filename, message) {
        const filepath = path.join(this.logsDir, filename);
        fs.appendFileSync(filepath, message + '\n');
    }

    /**
     * Log error message
     */
    error(message, meta = {}) {
        if (this.currentLevel >= this.levels.ERROR) {
            const formatted = this.formatMessage('ERROR', message, meta);
            console.error(formatted);
            this.writeToFile('error.log', formatted);
            this.writeToFile('app.log', formatted);
        }
    }

    /**
     * Log warning message
     */
    warn(message, meta = {}) {
        if (this.currentLevel >= this.levels.WARN) {
            const formatted = this.formatMessage('WARN', message, meta);
            console.warn(formatted);
            this.writeToFile('app.log', formatted);
        }
    }

    /**
     * Log info message
     */
    info(message, meta = {}) {
        if (this.currentLevel >= this.levels.INFO) {
            const formatted = this.formatMessage('INFO', message, meta);
            console.log(formatted);
            this.writeToFile('app.log', formatted);
        }
    }

    /**
     * Log debug message
     */
    debug(message, meta = {}) {
        if (this.currentLevel >= this.levels.DEBUG) {
            const formatted = this.formatMessage('DEBUG', message, meta);
            console.log(formatted);
            this.writeToFile('app.log', formatted);
        }
    }
}

module.exports = new Logger();
