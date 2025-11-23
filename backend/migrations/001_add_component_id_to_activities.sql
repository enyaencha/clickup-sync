-- Migration: Add component_id column to activities table
-- This updates the old schema to support the M&E system hierarchy

-- Check if component_id column exists, if not add it
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS component_id INT NULL AFTER id;

-- Add foreign key constraint to project_components
ALTER TABLE activities
ADD CONSTRAINT fk_activities_component
FOREIGN KEY (component_id) REFERENCES project_components(id)
ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_component_id ON activities(component_id);

-- If project_id column exists and has data, we might need to migrate it
-- Note: This assumes project_id was referencing project_components table
UPDATE activities a
SET a.component_id = a.project_id
WHERE a.component_id IS NULL AND a.project_id IS NOT NULL;
