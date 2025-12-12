-- Migration: Add outcome-related fields to activities table
-- Date: 2025-12-12
-- Description: Adds text fields for capturing qualitative outcome data directly on activities

ALTER TABLE activities
ADD COLUMN outcome_notes TEXT NULL COMMENT 'Qualitative outcome description and results achieved',
ADD COLUMN challenges_faced TEXT NULL COMMENT 'Challenges encountered during implementation',
ADD COLUMN lessons_learned TEXT NULL COMMENT 'Key lessons learned from the activity',
ADD COLUMN recommendations TEXT NULL COMMENT 'Recommendations for future activities';
