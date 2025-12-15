-- Migration: Update Finance and Resource Management Modules
-- Date: 2025-12-15
-- Description: Updates icons for Finance Management (id=6) and Resource Management (id=5) modules

-- Update Resource Management (previously Capacity Building)
UPDATE program_modules
SET
    name = 'Resource Management',
    code = 'RESOURCE_MGMT',
    icon = '🏗️',
    description = 'Resource Allocation & Management, Capacity Building, Infrastructure Development, Material Resources, and Strategic Resource Planning'
WHERE id = 5;

-- Update or Insert Finance Management Module
INSERT INTO program_modules (id, organization_id, name, code, icon, description, start_date, status)
VALUES (
    6,
    1,
    'Finance Management',
    'FINANCE_MGMT',
    '💰',
    'Budget Management, Financial Planning, Expenditure Tracking, Program Funding Allocation, and Financial Reporting',
    CURDATE(),
    'active'
)
ON DUPLICATE KEY UPDATE
    name = 'Finance Management',
    code = 'FINANCE_MGMT',
    icon = '💰',
    description = 'Budget Management, Financial Planning, Expenditure Tracking, Program Funding Allocation, and Financial Reporting',
    updated_at = CURRENT_TIMESTAMP;
