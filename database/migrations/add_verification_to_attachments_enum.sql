-- Add 'verification' to attachments.entity_type ENUM
-- This allows attachments to be linked to means_of_verification records

ALTER TABLE attachments
MODIFY COLUMN entity_type ENUM('activity', 'goal', 'indicator', 'sub_program', 'comment', 'verification', 'component', 'module') NOT NULL
COMMENT 'Type of entity this attachment is linked to';

-- Note: Also added 'component' and 'module' for future use
