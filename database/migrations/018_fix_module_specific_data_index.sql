-- Migration: Remove problematic functional index on module_specific_data
-- Reason: CAST(JSON AS CHAR(255)) truncates valid JSON payloads and breaks writes

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'activities'
      AND INDEX_NAME = 'idx_module_specific_data'
);

SET @drop_index_sql = IF(
    @index_exists > 0,
    'ALTER TABLE activities DROP INDEX idx_module_specific_data',
    'SELECT ''Index idx_module_specific_data not found'' AS status'
);

PREPARE stmt FROM @drop_index_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migration 018 completed successfully' AS status;
