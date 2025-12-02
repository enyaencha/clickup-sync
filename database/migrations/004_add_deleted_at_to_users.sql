-- Add deleted_at column for soft delete functionality
-- Run this migration to enable soft delete for users

USE me_clickup_system;

-- Add deleted_at column to users table
ALTER TABLE users
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete timestamp' AFTER updated_at;

-- Add index for better query performance
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Verify the column was added
SELECT 'deleted_at column added successfully to users table' as status;
