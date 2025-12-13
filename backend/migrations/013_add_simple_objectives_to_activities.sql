-- Migration: Add simple objectives fields to activities table
-- Date: 2025-12-13
-- Description: Simple immediate objectives for data entry (NOT M&E indicators)

ALTER TABLE activities
ADD COLUMN immediate_objectives TEXT NULL COMMENT 'Simple text description of activity immediate objectives',
ADD COLUMN expected_results TEXT NULL COMMENT 'Expected results/deliverables from the activity';
