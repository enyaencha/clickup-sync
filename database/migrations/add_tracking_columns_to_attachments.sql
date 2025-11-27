-- Add missing columns to attachments table for proper tracking

ALTER TABLE attachments
ADD COLUMN deleted_at DATETIME NULL COMMENT 'Soft delete timestamp',
ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- Add index for soft delete queries
CREATE INDEX idx_deleted_at ON attachments(deleted_at);

-- Add composite index for entity lookups
CREATE INDEX idx_entity_lookup ON attachments(entity_type, entity_id, deleted_at);
