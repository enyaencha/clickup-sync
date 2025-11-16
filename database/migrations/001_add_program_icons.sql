-- =====================================================
-- Migration: Add Icon Column to Programs & Update to Caritas Programs
-- Date: 2024
-- Description: Adds icon field and updates 5 programs to Caritas programs
-- =====================================================

-- Add icon column if it doesn't exist
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS icon VARCHAR(10) COMMENT 'Emoji icon for program'
AFTER code;

-- Update existing programs or insert new Caritas programs
-- This uses INSERT ... ON DUPLICATE KEY UPDATE to handle both scenarios

-- Clear existing programs (optional - comment out if you want to keep existing data)
-- DELETE FROM programs;

-- Insert/Update Caritas Programs
INSERT INTO programs (id, name, code, icon, description, start_date, status, budget) VALUES
(1, 'Food & Environment', 'FOOD_ENV', '🌾', 'Sustainable agriculture, food security, and environmental conservation programs', '2024-01-01', 'active', 500000.00),
(2, 'Socio-Economic', 'SOCIO_ECON', '💼', 'Economic empowerment, livelihoods, and poverty alleviation initiatives', '2024-01-01', 'active', 450000.00),
(3, 'Gender & Youth', 'GENDER_YOUTH', '👥', 'Gender equality, youth empowerment, and social inclusion programs', '2024-01-01', 'active', 350000.00),
(4, 'Relief Services', 'RELIEF', '🏥', 'Emergency relief, health services, and humanitarian assistance', '2024-01-01', 'active', 600000.00),
(5, 'Capacity Building', 'CAPACITY', '🎓', 'Training, institutional strengthening, and skills development programs', '2024-01-01', 'active', 400000.00)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    code = VALUES(code),
    icon = VALUES(icon),
    description = VALUES(description),
    updated_at = CURRENT_TIMESTAMP;

-- Verify migration
SELECT id, name, code, icon, status FROM programs WHERE deleted_at IS NULL;

-- Show migration complete message
SELECT 'Migration completed successfully. Icon column added and Caritas programs updated.' AS status;
