-- Migration: Add 'cancelled' status to activities table
-- This allows activities to be marked as cancelled without deletion

ALTER TABLE activities
MODIFY COLUMN status ENUM('not-started', 'in-progress', 'completed', 'blocked', 'cancelled')
DEFAULT 'not-started';
