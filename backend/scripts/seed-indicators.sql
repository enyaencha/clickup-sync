-- Seed dummy indicators for testing
-- Run this with: mysql -u root -p me_clickup_system < seed-indicators.sql

-- Insert test indicators
INSERT INTO me_indicators (
    program_id, project_id, activity_id,
    module_id, sub_program_id, component_id,
    name, code, description, type, category,
    unit_of_measure, baseline_value, baseline_date,
    target_value, target_date, current_value,
    collection_frequency, data_source, verification_method,
    disaggregation, status, achievement_percentage,
    responsible_person, notes, clickup_custom_field_id,
    is_active, last_measured_date, next_measurement_date
) VALUES
(
    NULL, NULL, NULL,
    5, NULL, NULL,
    'Number of farmers trained', 'IND-001', 'Total number of farmers who completed training program',
    'output', NULL, 'farmers',
    0, '2025-01-01', 1000, '2025-12-31', 250,
    'monthly', 'Training attendance sheets', 'Verified by training coordinator',
    NULL, 'on-track', 25.00,
    'John Doe', 'Q1 progress looks good', NULL,
    1, '2025-11-01', '2025-12-01'
),
(
    NULL, NULL, NULL,
    5, NULL, NULL,
    'Hectares of land improved', 'IND-002', 'Total hectares under improved farming practices',
    'outcome', NULL, 'hectares',
    500, '2025-01-01', 2000, '2025-12-31', 750,
    'quarterly', 'Field surveys', 'GPS measurements and farmer reports',
    NULL, 'on-track', 37.50,
    'Jane Smith', 'Expansion in western region ahead of schedule', NULL,
    1, '2025-10-15', '2026-01-15'
),
(
    NULL, NULL, NULL,
    5, NULL, NULL,
    'Crop yield increase', 'IND-003', 'Percentage increase in crop yield compared to baseline',
    'impact', NULL, 'percentage',
    0, '2025-01-01', 30, '2025-12-31', 12,
    'annually', 'Harvest data collection', 'Independent agricultural assessment',
    NULL, 'at-risk', 40.00,
    'Mike Johnson', 'Weather conditions affecting progress', NULL,
    1, NULL, '2025-12-31'
);

SELECT 'Successfully inserted 3 test indicators' as Result;
SELECT * FROM me_indicators WHERE code LIKE 'IND-%';
