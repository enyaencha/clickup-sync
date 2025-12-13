-- ===================================================================
-- IMPORTANT: Run these migrations to add outcome and objectives fields
-- ===================================================================
-- These columns need to be added to the activities table for the
-- outcome and objectives modals to save data properly.
--
-- You can run this in your MySQL client or through phpMyAdmin
-- ===================================================================

USE clickup_sync;  -- Change this to your actual database name

-- Migration 012: Add outcome fields to activities table
ALTER TABLE activities
ADD COLUMN outcome_notes TEXT NULL COMMENT 'Qualitative outcome description and results achieved',
ADD COLUMN challenges_faced TEXT NULL COMMENT 'Challenges encountered during implementation',
ADD COLUMN lessons_learned TEXT NULL COMMENT 'Key lessons learned from the activity',
ADD COLUMN recommendations TEXT NULL COMMENT 'Recommendations for future activities';

-- Migration 013: Add simple objectives fields to activities table
ALTER TABLE activities
ADD COLUMN immediate_objectives TEXT NULL COMMENT 'Simple text description of activity immediate objectives',
ADD COLUMN expected_results TEXT NULL COMMENT 'Expected results/deliverables from the activity';

-- Verify the columns were added
SHOW COLUMNS FROM activities LIKE '%outcome%';
SHOW COLUMNS FROM activities LIKE '%objective%';
SHOW COLUMNS FROM activities LIKE '%challenges%';
SHOW COLUMNS FROM activities LIKE '%lessons%';
SHOW COLUMNS FROM activities LIKE '%recommendations%';
SHOW COLUMNS FROM activities LIKE '%expected%';
