-- Migration: Add all missing columns to activities table for M&E system
-- This aligns the database with the backend service expectations

-- Location fields
ALTER TABLE activities ADD COLUMN location_id INT NULL;
ALTER TABLE activities ADD COLUMN location_details VARCHAR(500) NULL;
ALTER TABLE activities ADD COLUMN parish VARCHAR(100) NULL;
ALTER TABLE activities ADD COLUMN ward VARCHAR(100) NULL;
ALTER TABLE activities ADD COLUMN county VARCHAR(100) NULL;

-- Date & Duration
ALTER TABLE activities ADD COLUMN activity_date DATE NULL;
ALTER TABLE activities ADD COLUMN duration_hours INT NULL;

-- Facilitators/Staff
ALTER TABLE activities ADD COLUMN facilitators TEXT NULL COMMENT 'Comma-separated or JSON array';
ALTER TABLE activities ADD COLUMN staff_assigned TEXT NULL;

-- Beneficiaries
ALTER TABLE activities ADD COLUMN target_beneficiaries INT NULL;
ALTER TABLE activities ADD COLUMN actual_beneficiaries INT DEFAULT 0;
ALTER TABLE activities ADD COLUMN beneficiary_type VARCHAR(100) NULL;

-- Budget (rename existing budget to budget_allocated if needed, or add new column)
ALTER TABLE activities ADD COLUMN budget_allocated DECIMAL(10, 2) NULL;
ALTER TABLE activities ADD COLUMN budget_spent DECIMAL(10, 2) DEFAULT 0;

-- Approval Status
ALTER TABLE activities ADD COLUMN approval_status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft';

-- Priority
ALTER TABLE activities ADD COLUMN priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal';

-- Audit
ALTER TABLE activities ADD COLUMN created_by INT NULL COMMENT 'User ID who created this activity';

-- Add indexes for better query performance
CREATE INDEX idx_activity_date ON activities(activity_date);
CREATE INDEX idx_approval_status ON activities(approval_status);
CREATE INDEX idx_status ON activities(status);
CREATE INDEX idx_location_id ON activities(location_id);
