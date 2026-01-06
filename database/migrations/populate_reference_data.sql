-- ============================================================================
-- POPULATE REFERENCE DATA
-- ============================================================================
-- This populates essential reference data tables
-- ============================================================================

USE me_clickup_system;

-- ============================================================================
-- LOCATIONS (Kenya Administrative Structure)
-- ============================================================================

-- Country level
INSERT INTO locations (name, type, parent_id) VALUES
('Kenya', 'country', NULL);

SET @country_id = LAST_INSERT_ID();

-- Counties (47 counties of Kenya) - Sample, add more as needed
INSERT INTO locations (name, type, parent_id) VALUES
('Nairobi', 'county', @country_id),
('Mombasa', 'county', @country_id),
('Kisumu', 'county', @country_id),
('Nakuru', 'county', @country_id),
('Kiambu', 'county', @country_id),
('Machakos', 'county', @country_id),
('Kajiado', 'county', @country_id),
('Embu', 'county', @country_id),
('Kirinyaga', 'county', @country_id),
('Murang''a', 'county', @country_id);

-- Get Nairobi ID for sub-counties
SET @nairobi_id = (SELECT id FROM locations WHERE name = 'Nairobi' AND type = 'county');

-- Sub-Counties in Nairobi
INSERT INTO locations (name, type, parent_id) VALUES
('Westlands', 'sub_county', @nairobi_id),
('Dagoretti North', 'sub_county', @nairobi_id),
('Dagoretti South', 'sub_county', @nairobi_id),
('Langata', 'sub_county', @nairobi_id),
('Kibra', 'sub_county', @nairobi_id),
('Roysambu', 'sub_county', @nairobi_id),
('Kasarani', 'sub_county', @nairobi_id),
('Ruaraka', 'sub_county', @nairobi_id),
('Embakasi South', 'sub_county', @nairobi_id),
('Embakasi North', 'sub_county', @nairobi_id),
('Embakasi Central', 'sub_county', @nairobi_id),
('Embakasi East', 'sub_county', @nairobi_id),
('Embakasi West', 'sub_county', @nairobi_id),
('Makadara', 'sub_county', @nairobi_id),
('Kamukunji', 'sub_county', @nairobi_id),
('Starehe', 'sub_county', @nairobi_id),
('Mathare', 'sub_county', @nairobi_id);

-- Sample wards (add more as needed)
SET @kibra_id = (SELECT id FROM locations WHERE name = 'Kibra' AND type = 'sub_county');

INSERT INTO locations (name, type, parent_id) VALUES
('Laini Saba', 'ward', @kibra_id),
('Lindi', 'ward', @kibra_id),
('Makina', 'ward', @kibra_id),
('Woodley/Kenyatta Golf Course', 'ward', @kibra_id),
('Sarang''ombe', 'ward', @kibra_id);

-- ============================================================================
-- GOAL CATEGORIES (Aligned with SDGs and typical NGO frameworks)
-- ============================================================================

SET @org_id = (SELECT id FROM organizations LIMIT 1);

INSERT INTO goal_categories (organization_id, name, description, period, is_active) VALUES
(@org_id, 'Poverty Reduction', 'Initiatives focused on reducing poverty and improving livelihoods', 'Annual 2026', 1),
(@org_id, 'Food Security & Nutrition', 'Programs ensuring access to nutritious food and combating hunger', 'Annual 2026', 1),
(@org_id, 'Health & Well-being', 'Health services, disease prevention, and health system strengthening', 'Annual 2026', 1),
(@org_id, 'Quality Education', 'Access to quality education and learning opportunities', 'Annual 2026', 1),
(@org_id, 'Gender Equality', 'Promoting gender equality and empowering women and girls', 'Annual 2026', 1),
(@org_id, 'WASH', 'Water, Sanitation, and Hygiene programs', 'Annual 2026', 1),
(@org_id, 'Economic Growth', 'Decent work, economic opportunities, and sustainable economic growth', 'Annual 2026', 1),
(@org_id, 'Infrastructure Development', 'Basic infrastructure and resilient communities', 'Annual 2026', 1),
(@org_id, 'Peace & Justice', 'Peacebuilding, justice, and strong institutions', 'Annual 2026', 1),
(@org_id, 'Climate Action', 'Climate change mitigation and adaptation', 'Annual 2026', 1),
(@org_id, 'Protection', 'Child protection, GBV prevention, and refugee support', 'Annual 2026', 1),
(@org_id, 'Community Empowerment', 'Building community capacity and resilience', 'Annual 2026', 1);

-- ============================================================================
-- STRATEGIC GOALS (Sample organizational goals)
-- ============================================================================

INSERT INTO strategic_goals (
    category_id,
    name,
    description,
    target_date,
    status,
    is_active
)
SELECT
    gc.id,
    CONCAT('Improve ', gc.name, ' outcomes'),
    CONCAT('Strategic goal to improve ', gc.name, ' outcomes for vulnerable communities by 2027'),
    '2027-12-31',
    'active',
    1
FROM goal_categories gc
WHERE gc.is_active = 1;

-- Add specific strategic goals with more details
UPDATE strategic_goals sg
INNER JOIN goal_categories gc ON sg.category_id = gc.id
SET
    sg.name = 'Reduce extreme poverty by 50% in target communities',
    sg.description = 'Through livelihood programs, cash transfers, and economic empowerment initiatives'
WHERE gc.name = 'Poverty Reduction';

UPDATE strategic_goals sg
INNER JOIN goal_categories gc ON sg.category_id = gc.id
SET
    sg.name = 'Ensure food security for 20,000 vulnerable households',
    sg.description = 'Through agricultural support, food assistance, and nutrition programs'
WHERE gc.name = 'Food Security & Nutrition';

UPDATE strategic_goals sg
INNER JOIN goal_categories gc ON sg.category_id = gc.id
SET
    sg.name = 'Provide quality health services to 50,000 people annually',
    sg.description = 'Through health facilities support, community health workers, and health camps'
WHERE gc.name = 'Health & Well-being';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '
╔════════════════════════════════════════════════════════════════╗
║         REFERENCE DATA POPULATED SUCCESSFULLY                   ║
╠════════════════════════════════════════════════════════════════╣
║  Locations:        Counties, Sub-counties, Wards              ║
║  Goal Categories:  12 categories aligned with SDGs            ║
║  Strategic Goals:  Organizational strategic objectives        ║
╚════════════════════════════════════════════════════════════════╝
' AS status;

-- Show counts
SELECT 'Locations' as table_name, COUNT(*) as count FROM locations
UNION ALL
SELECT 'Goal Categories', COUNT(*) FROM goal_categories
UNION ALL
SELECT 'Strategic Goals', COUNT(*) FROM strategic_goals;

-- Show sample locations
SELECT '=== SAMPLE LOCATION HIERARCHY ===' as section;
SELECT
    c.name as county,
    sc.name as sub_county,
    w.name as ward
FROM locations c
LEFT JOIN locations sc ON sc.parent_id = c.id AND sc.type = 'sub_county'
LEFT JOIN locations w ON w.parent_id = sc.id AND w.type = 'ward'
WHERE c.type = 'county' AND c.name = 'Nairobi'
LIMIT 10;
