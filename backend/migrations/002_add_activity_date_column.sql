-- Migration: Add activity_date column to activities table
-- This column is referenced in the backend code but was missing from the actual database

-- Add activity_date column if it doesn't exist
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS activity_date DATE AFTER location_details;

-- Add index for better query performance when filtering/ordering by date
CREATE INDEX IF NOT EXISTS idx_activity_date ON activities(activity_date);
