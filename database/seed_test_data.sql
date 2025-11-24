-- =====================================================
-- SEED DATA FOR TESTING - M&E CLICKUP SYNC SYSTEM
-- 20 Records Each: Sub-Programs, Components, Activities, Beneficiaries
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing test data (optional - uncomment if you want fresh start)
-- TRUNCATE TABLE activity_beneficiaries;
-- TRUNCATE TABLE activities;
-- TRUNCATE TABLE project_components;
-- TRUNCATE TABLE sub_programs;
-- TRUNCATE TABLE beneficiaries;

-- =====================================================
-- SUB-PROGRAMS (20 Records)
-- Distributed across the 5 existing program modules
-- =====================================================

INSERT INTO `sub_programs` (`module_id`, `name`, `code`, `description`, `budget`, `actual_cost`, `start_date`, `end_date`, `progress_percentage`, `manager_name`, `manager_email`, `target_beneficiaries`, `actual_beneficiaries`, `location`, `status`, `priority`) VALUES
-- Food, Water & Environment (module_id = 1)
(1, 'Climate-Smart Agriculture Training', 'SUB-FE-001', 'Training farmers on climate-resilient farming techniques and water conservation', 150000.00, 45000.00, '2025-01-15', '2025-12-31', 30, 'Mary Wanjiku', 'mary.w@caritas.org', 500, 150, '"Kiambu County"', 'active', 'high'),
(1, 'Community Water Points Rehabilitation', 'SUB-FE-002', 'Rehabilitating and maintaining community water access points in drought-affected areas', 250000.00, 120000.00, '2025-02-01', '2025-11-30', 48, 'John Kamau', 'john.k@caritas.org', 2000, 800, '"Machakos County"', 'active', 'urgent'),
(1, 'Tree Planting Initiative', 'SUB-FE-003', 'Agroforestry and environmental conservation through community tree planting', 80000.00, 25000.00, '2025-03-01', '2025-12-31', 31, 'Grace Muthoni', 'grace.m@caritas.org', 1500, 450, '"Murang\'a County"', 'active', 'medium'),
(1, 'Drip Irrigation Systems', 'SUB-FE-004', 'Installing water-efficient drip irrigation systems for small-scale farmers', 180000.00, 60000.00, '2025-01-10', '2025-10-31', 33, 'Peter Ochieng', 'peter.o@caritas.org', 300, 100, '"Makueni County"', 'active', 'high'),

-- Socio-Economic Empowerment (module_id = 2)
(2, 'Village Savings and Loans Groups', 'SUB-SE-001', 'Establishing and supporting VSLAs for financial inclusion and savings mobilization', 120000.00, 55000.00, '2025-01-20', '2025-12-31', 46, 'Sarah Njeri', 'sarah.n@caritas.org', 800, 380, '"Nairobi County - Kibera"', 'active', 'high'),
(2, 'Youth Micro-Enterprise Development', 'SUB-SE-002', 'Business skills training and startup capital for youth entrepreneurs', 200000.00, 80000.00, '2025-02-15', '2025-12-31', 40, 'James Omondi', 'james.o@caritas.org', 200, 85, '"Kisumu County"', 'active', 'urgent'),
(2, 'Women Artisan Cooperative', 'SUB-SE-003', 'Supporting women artisans with skills training and market linkages', 90000.00, 35000.00, '2025-03-01', '2025-12-31', 39, 'Lucy Wangari', 'lucy.w@caritas.org', 150, 60, '"Nakuru County"', 'active', 'medium'),
(2, 'Dairy Farming Value Chain', 'SUB-SE-004', 'Strengthening dairy value chain from production to market access', 160000.00, 70000.00, '2025-01-25', '2025-11-30', 44, 'Daniel Kiprop', 'daniel.k@caritas.org', 250, 110, '"Nyandarua County"', 'active', 'high'),

-- Gender, Youth & Peace (module_id = 3)
(3, 'Gender-Based Violence Prevention', 'SUB-GY-001', 'Community awareness and support services for GBV survivors', 110000.00, 45000.00, '2025-01-10', '2025-12-31', 41, 'Faith Akinyi', 'faith.a@caritas.org', 1000, 420, '"Nairobi County"', 'active', 'urgent'),
(3, 'Beacon Boys Youth Mentorship', 'SUB-GY-002', 'Mentorship program for at-risk youth promoting positive masculinity', 95000.00, 40000.00, '2025-02-01', '2025-12-31', 42, 'Michael Otieno', 'michael.o@caritas.org', 300, 130, '"Mombasa County"', 'active', 'high'),
(3, 'Women Economic Empowerment', 'SUB-GY-003', 'Business training and financial support for women-led businesses', 140000.00, 55000.00, '2025-01-15', '2025-12-31', 39, 'Rose Chebet', 'rose.c@caritas.org', 200, 80, '"Eldoret Town"', 'active', 'high'),
(3, 'Peacebuilding Dialogues', 'SUB-GY-004', 'Inter-community dialogue and conflict resolution initiatives', 75000.00, 30000.00, '2025-03-01', '2025-11-30', 40, 'David Mutua', 'david.m@caritas.org', 500, 200, '"Isiolo County"', 'active', 'medium'),

-- Relief & Charitable Services (module_id = 4)
(4, 'Emergency Food Distribution', 'SUB-RL-001', 'Food relief for drought-affected communities and vulnerable households', 300000.00, 150000.00, '2025-01-05', '2025-12-31', 50, 'Agnes Wambui', 'agnes.w@caritas.org', 5000, 2500, '"Turkana County"', 'active', 'urgent'),
(4, 'Refugee Support Services', 'SUB-RL-002', 'Comprehensive support services for refugees in Kakuma and Dadaab camps', 250000.00, 120000.00, '2025-01-10', '2025-12-31', 48, 'Hassan Mohammed', 'hassan.m@caritas.org', 3000, 1450, '"Turkana & Garissa Counties"', 'active', 'urgent'),
(4, 'Child Care Center Operations', 'SUB-RL-003', 'Operating day care centers for orphaned and vulnerable children', 180000.00, 85000.00, '2025-01-01', '2025-12-31', 47, 'Catherine Nyambura', 'catherine.n@caritas.org', 150, 72, '"Nairobi County"', 'active', 'high'),
(4, 'Health Outreach Clinics', 'SUB-RL-004', 'Mobile health clinics providing basic healthcare in underserved areas', 220000.00, 100000.00, '2025-02-01', '2025-12-31', 45, 'Dr. James Kariuki', 'james.kar@caritas.org', 2000, 920, '"Garissa County"', 'active', 'urgent'),

-- Capacity Building (module_id = 5)
(5, 'Staff Professional Development', 'SUB-CB-001', 'Training programs for Caritas staff on M&E, project management, and leadership', 85000.00, 35000.00, '2025-01-20', '2025-12-31', 41, 'Patrick Mwangi', 'patrick.m@caritas.org', 50, 22, '"Nairobi - Caritas HQ"', 'active', 'medium'),
(5, 'Volunteer Mobilization Program', 'SUB-CB-002', 'Recruiting, training, and managing community volunteers', 70000.00, 28000.00, '2025-02-01', '2025-12-31', 40, 'Susan Njoki', 'susan.nj@caritas.org', 200, 85, '"Various Counties"', 'active', 'medium'),
(5, 'Community Leadership Training', 'SUB-CB-003', 'Building leadership capacity among community leaders and committee members', 95000.00, 40000.00, '2025-01-15', '2025-12-31', 42, 'Thomas Kimani', 'thomas.k@caritas.org', 150, 65, '"Trans-Nzoia County"', 'active', 'high'),
(5, 'Digital Literacy for Field Staff', 'SUB-CB-004', 'Training field staff on digital tools, data collection, and reporting systems', 60000.00, 22000.00, '2025-03-01', '2025-11-30', 37, 'Betty Mwikali', 'betty.m@caritas.org', 80, 30, '"Various Field Offices"', 'active', 'medium');

-- =====================================================
-- PROJECT COMPONENTS (20 Records)
-- Distributed across the 20 sub-programs
-- =====================================================

INSERT INTO `project_components` (`sub_program_id`, `name`, `code`, `description`, `budget`, `orderindex`, `status`, `progress_percentage`, `responsible_person`) VALUES
-- Components for Climate-Smart Agriculture Training (sub_program 1)
(1, 'Farmer Training Workshops', 'COMP-FE-001', 'Conducting hands-on training workshops for farmers on climate-smart practices', 50000.00, 1, 'in-progress', 40, 'Mary Wanjiku'),
(1, 'Demonstration Plots Setup', 'COMP-FE-002', 'Establishing demonstration plots for practical learning', 35000.00, 2, 'in-progress', 30, 'John Maina'),

-- Components for Community Water Points (sub_program 2)
(2, 'Water Point Assessment', 'COMP-FE-003', 'Technical assessment of existing water points needing rehabilitation', 25000.00, 1, 'completed', 100, 'Engineer Peter'),
(2, 'Rehabilitation Works', 'COMP-FE-004', 'Physical rehabilitation and repair of water points', 180000.00, 2, 'in-progress', 50, 'John Kamau'),

-- Components for VSLAs (sub_program 5)
(5, 'VSLA Group Formation', 'COMP-SE-001', 'Identifying and forming new VSLA groups in target communities', 30000.00, 1, 'in-progress', 60, 'Sarah Njeri'),
(5, 'Financial Literacy Training', 'COMP-SE-002', 'Training VSLA members on financial management and record-keeping', 40000.00, 2, 'in-progress', 45, 'James Muturi'),

-- Components for Youth Micro-Enterprise (sub_program 6)
(6, 'Business Skills Workshops', 'COMP-SE-003', 'Training youth on business planning, marketing, and management', 80000.00, 1, 'in-progress', 50, 'James Omondi'),
(6, 'Startup Capital Grants', 'COMP-SE-004', 'Providing seed capital grants to trained youth entrepreneurs', 100000.00, 2, 'not-started', 0, 'Finance Team'),

-- Components for GBV Prevention (sub_program 9)
(9, 'Community Awareness Campaigns', 'COMP-GY-001', 'Public awareness campaigns on GBV prevention and reporting', 45000.00, 1, 'in-progress', 55, 'Faith Akinyi'),
(9, 'Survivor Support Services', 'COMP-GY-002', 'Providing counseling and legal support to GBV survivors', 55000.00, 2, 'in-progress', 35, 'Social Worker Team'),

-- Components for Beacon Boys (sub_program 10)
(10, 'Mentorship Program Setup', 'COMP-GY-003', 'Recruiting and training mentors for at-risk youth', 40000.00, 1, 'in-progress', 50, 'Michael Otieno'),
(10, 'Life Skills Workshops', 'COMP-GY-004', 'Conducting life skills and vocational training sessions', 45000.00, 2, 'in-progress', 40, 'Youth Coordinator'),

-- Components for Emergency Food Distribution (sub_program 13)
(13, 'Beneficiary Registration', 'COMP-RL-001', 'Registering and verifying eligible households for food assistance', 35000.00, 1, 'in-progress', 70, 'Agnes Wambui'),
(13, 'Food Distribution Events', 'COMP-RL-002', 'Organizing and conducting monthly food distribution exercises', 220000.00, 2, 'in-progress', 50, 'Logistics Team'),

-- Components for Refugee Support (sub_program 14)
(14, 'Livelihood Support Programs', 'COMP-RL-003', 'Skills training and income generation activities for refugees', 120000.00, 1, 'in-progress', 45, 'Hassan Mohammed'),
(14, 'Education Support Services', 'COMP-RL-004', 'Providing educational materials and support to refugee children', 100000.00, 2, 'in-progress', 50, 'Education Coordinator'),

-- Components for Capacity Building (sub_program 17)
(17, 'M&E Training Module', 'COMP-CB-001', 'Training staff on monitoring, evaluation, and reporting systems', 35000.00, 1, 'in-progress', 60, 'Patrick Mwangi'),
(17, 'Project Management Certification', 'COMP-CB-002', 'Professional project management certification courses for senior staff', 40000.00, 2, 'not-started', 0, 'HR Department'),

-- Components for Volunteer Program (sub_program 18)
(18, 'Volunteer Recruitment Drive', 'COMP-CB-003', 'Community outreach and volunteer recruitment campaigns', 25000.00, 1, 'in-progress', 55, 'Susan Njoki'),
(18, 'Volunteer Training & Orientation', 'COMP-CB-004', 'Comprehensive training program for new volunteers', 35000.00, 2, 'in-progress', 45, 'Training Team');

-- =====================================================
-- ACTIVITIES (20 Records)
-- Distributed across the 20 components
-- =====================================================

INSERT INTO `activities` (`project_id`, `component_id`, `name`, `code`, `description`, `start_date`, `end_date`, `activity_date`, `status`, `progress_percentage`, `responsible_person`, `budget_allocated`, `budget_spent`, `target_beneficiaries`, `actual_beneficiaries`, `beneficiary_type`, `location_details`, `parish`, `ward`, `county`, `duration_hours`, `facilitators`, `staff_assigned`, `approval_status`, `priority`, `created_by`) VALUES
-- Activities for Farmer Training Workshops (component 1)
(1, 1, 'Introduction to Climate-Smart Agriculture', 'ACT-FE-001', 'Workshop covering basics of climate-resilient farming techniques', '2025-02-10', '2025-02-10', '2025-02-10', 'completed', 100, 'Mary Wanjiku', 3000.00, 2800.00, 50, 48, 'farmers', 'Kiambu Agricultural Center', 'Kiambu Town', 'Municipality', 'Kiambu', 6, 'Mary Wanjiku, John Maina, Agricultural Officer', 'Field Team Alpha', 'approved', 'high', NULL),
(1, 1, 'Water Harvesting Techniques Training', 'ACT-FE-002', 'Practical training on rainwater harvesting and storage methods', '2025-03-15', '2025-03-15', '2025-03-15', 'in-progress', 50, 'John Maina', 3500.00, 1500.00, 50, 25, 'farmers', 'Community Hall - Githunguri', 'Githunguri', 'Central Ward', 'Kiambu', 5, 'John Maina, Water Engineer Peter', 'Field Team Alpha', 'submitted', 'high', NULL),

-- Activities for Demonstration Plots (component 2)
(1, 2, 'Demonstration Plot Land Preparation', 'ACT-FE-003', 'Clearing, plowing, and preparing land for demonstration plots', '2025-01-20', '2025-01-25', '2025-01-22', 'completed', 100, 'Farm Supervisor', 5000.00, 4800.00, 100, 95, 'farmers', 'Kiambu Demo Farm', 'Kiambu Town', 'Central', 'Kiambu', 40, 'Farm Workers Team', 'Field Team Alpha', 'approved', 'medium', NULL),

-- Activities for Water Point Assessment (component 3)
(2, 3, 'Water Point Technical Survey', 'ACT-FE-004', 'Engineering survey and condition assessment of 15 water points', '2025-02-05', '2025-02-12', '2025-02-08', 'completed', 100, 'Engineer Peter', 15000.00, 14500.00, 2000, 2000, 'community', 'Various locations Machakos', 'Multiple', 'Multiple', 'Machakos', 56, 'Engineer Peter, Survey Team', 'Technical Team', 'approved', 'urgent', NULL),

-- Activities for Rehabilitation Works (component 4)
(2, 4, 'Mwala Water Point Rehabilitation', 'ACT-FE-005', 'Complete rehabilitation of Mwala community water point', '2025-03-01', '2025-03-10', '2025-03-05', 'in-progress', 60, 'John Kamau', 50000.00, 28000.00, 500, 0, 'community', 'Mwala Market Area', 'Mwala', 'Mwala Ward', 'Machakos', 80, 'Engineer Peter, Construction Team', 'Technical Team', 'approved', 'urgent', NULL),

-- Activities for VSLA Group Formation (component 5)
(5, 5, 'Kibera VSLA Group Mobilization', 'ACT-SE-001', 'Community mobilization and formation of new VSLA groups in Kibera', '2025-02-01', '2025-02-15', '2025-02-10', 'completed', 100, 'Sarah Njeri', 8000.00, 7500.00, 150, 140, 'women', 'Kibera Soweto Zone', 'Kibera', 'Laini Saba', 'Nairobi', 12, 'Sarah Njeri, Community Mobilizers', 'VSLA Team', 'approved', 'high', NULL),
(5, 5, 'VSLA Starter Kit Distribution', 'ACT-SE-002', 'Distribution of VSLA boxes, record books, and training materials', '2025-02-20', '2025-02-20', '2025-02-20', 'completed', 100, 'James Muturi', 12000.00, 11800.00, 150, 145, 'women', 'Kibera Community Hall', 'Kibera', 'Laini Saba', 'Nairobi', 4, 'Sarah Njeri, James Muturi', 'VSLA Team', 'approved', 'high', NULL),

-- Activities for Financial Literacy Training (component 6)
(5, 6, 'Basic Financial Management Workshop', 'ACT-SE-003', 'Training on budgeting, saving, and financial planning', '2025-03-05', '2025-03-05', '2025-03-05', 'in-progress', 50, 'James Muturi', 6000.00, 2800.00, 150, 70, 'women', 'Olympic Community Center', 'Kibera', 'Olympic Ward', 'Nairobi', 5, 'Financial Trainer, James Muturi', 'VSLA Team', 'submitted', 'high', NULL),

-- Activities for Business Skills Workshops (component 7)
(6, 7, 'Youth Entrepreneurship Bootcamp - Day 1', 'ACT-SE-004', 'Introduction to entrepreneurship and business opportunity identification', '2025-03-10', '2025-03-10', '2025-03-10', 'completed', 100, 'James Omondi', 15000.00, 14200.00, 40, 38, 'youth', 'Kisumu Youth Center', 'Kisumu Town', 'Market Ward', 'Kisumu', 6, 'James Omondi, Business Trainer Sarah', 'Youth Enterprise Team', 'approved', 'urgent', NULL),
(6, 7, 'Business Plan Development Workshop', 'ACT-SE-005', 'Guided workshop on creating comprehensive business plans', '2025-03-17', '2025-03-17', '2025-03-17', 'not-started', 0, 'Business Trainer Sarah', 18000.00, 0.00, 40, 0, 'youth', 'Kisumu Youth Center', 'Kisumu Town', 'Market Ward', 'Kisumu', 8, 'Business Trainer Sarah, Finance Officer', 'Youth Enterprise Team', 'draft', 'urgent', NULL),

-- Activities for GBV Awareness Campaigns (component 9)
(9, 9, 'Community GBV Awareness Rally', 'ACT-GY-001', 'Public awareness rally on GBV prevention and reporting mechanisms', '2025-02-25', '2025-02-25', '2025-02-25', 'completed', 100, 'Faith Akinyi', 12000.00, 11500.00, 500, 480, 'community', 'Mukuru Kwa Njenga', 'Mukuru', 'Kwa Njenga Ward', 'Nairobi', 4, 'Faith Akinyi, Community Mobilizers, Police Rep', 'Gender Team', 'approved', 'urgent', NULL),

-- Activities for Survivor Support Services (component 10)
(9, 10, 'GBV Survivor Counseling Sessions', 'ACT-GY-002', 'Individual and group counseling for GBV survivors', '2025-03-01', '2025-03-31', '2025-03-15', 'in-progress', 40, 'Counselor Jane', 20000.00, 7500.00, 50, 18, 'women', 'Caritas Counseling Center', 'Nairobi CBD', 'Central Ward', 'Nairobi', 60, 'Counselor Jane, Psychologist Dr. Mary', 'Gender Team', 'approved', 'urgent', NULL),

-- Activities for Mentorship Program (component 11)
(10, 11, 'Beacon Boys Mentor Recruitment', 'ACT-GY-003', 'Recruiting and vetting community mentors for at-risk youth', '2025-02-10', '2025-02-20', '2025-02-15', 'completed', 100, 'Michael Otieno', 8000.00, 7800.00, 30, 28, 'youth', 'Mombasa Community Centers', 'Changamwe', 'Multiple Wards', 'Mombasa', 20, 'Michael Otieno, HR Coordinator', 'Youth Team', 'approved', 'high', NULL),

-- Activities for Life Skills Workshops (component 12)
(10, 12, 'Life Skills Training - Conflict Resolution', 'ACT-GY-004', 'Workshop on conflict resolution and anger management for youth', '2025-03-08', '2025-03-08', '2025-03-08', 'in-progress', 50, 'Youth Coordinator', 9000.00, 4200.00, 50, 24, 'youth', 'Mombasa Youth Hall', 'Changamwe', 'Changamwe Ward', 'Mombasa', 5, 'Psychologist Dr. James, Youth Coordinator', 'Youth Team', 'submitted', 'high', NULL),

-- Activities for Beneficiary Registration (component 13)
(13, 13, 'Food Aid Beneficiary Verification', 'ACT-RL-001', 'House-to-house verification of drought-affected households', '2025-01-15', '2025-01-30', '2025-01-22', 'completed', 100, 'Agnes Wambui', 15000.00, 14800.00, 1000, 980, 'households', 'Turkana Villages', 'Multiple', 'Multiple', 'Turkana', 120, 'Field Assessment Team', 'Relief Team Alpha', 'approved', 'urgent', NULL),

-- Activities for Food Distribution (component 14)
(13, 14, 'February Food Distribution Exercise', 'ACT-RL-002', 'Monthly food ration distribution to registered beneficiaries', '2025-02-20', '2025-02-22', '2025-02-21', 'completed', 100, 'Logistics Coordinator', 85000.00, 84500.00, 1000, 975, 'households', 'Lodwar Distribution Points', 'Lodwar Town', 'Multiple Wards', 'Turkana', 24, 'Distribution Team, Logistics Team', 'Relief Team Alpha', 'approved', 'urgent', NULL),

-- Activities for Refugee Livelihood Support (component 15)
(14, 15, 'Refugee Tailoring Skills Training', 'ACT-RL-003', 'Vocational training in tailoring and garment making for refugees', '2025-02-05', '2025-03-15', '2025-02-20', 'in-progress', 55, 'Hassan Mohammed', 35000.00, 18000.00, 30, 28, 'refugees', 'Kakuma Vocational Center', 'Kakuma Camp', 'Kakuma Ward', 'Turkana', 120, 'Hassan Mohammed, Tailoring Instructor', 'Refugee Support Team', 'approved', 'high', NULL),

-- Activities for M&E Training (component 17)
(17, 17, 'Introduction to M&E Systems', 'ACT-CB-001', 'Training on monitoring and evaluation fundamentals and tools', '2025-02-28', '2025-03-01', '2025-03-01', 'completed', 100, 'Patrick Mwangi', 12000.00, 11500.00, 15, 14, 'staff', 'Caritas Training Room', 'Nairobi CBD', 'Central', 'Nairobi', 12, 'Patrick Mwangi, External M&E Expert', 'Capacity Building Team', 'approved', 'medium', NULL),

-- Activities for Volunteer Recruitment (component 19)
(18, 19, 'Community Volunteer Recruitment Event', 'ACT-CB-002', 'Public recruitment event for community volunteers across target areas', '2025-02-18', '2025-02-18', '2025-02-18', 'completed', 100, 'Susan Njoki', 8000.00, 7600.00, 100, 92, 'community', 'Various Community Centers', 'Multiple', 'Multiple', 'Various', 8, 'Susan Njoki, Volunteer Coordinators', 'Volunteer Team', 'approved', 'medium', NULL);

-- =====================================================
-- BENEFICIARIES (20 Records)
-- Mixed demographics across different counties and types
-- =====================================================

INSERT INTO `beneficiaries` (`name`, `beneficiary_id_number`, `gender`, `age`, `age_group`, `beneficiary_type`, `location_id`, `parish`, `ward`, `county`, `gps_coordinates`, `is_vulnerable`, `vulnerability_category`, `phone`, `email`, `demographics`, `is_active`) VALUES
('Mary Njoki Kamau', 'BEN-2025-001', 'female', 34, '18-35', 'individual', NULL, 'Githunguri', 'Central Ward', 'Kiambu', '-1.0692,36.8219', TRUE, '["single_mother", "low_income"]', '+254712345001', NULL, '{"education": "primary", "occupation": "farmer", "household_size": 5}', TRUE),
('John Mwangi Kariuki', 'BEN-2025-002', 'male', 45, '36-60', 'individual', NULL, 'Mwala', 'Mwala Ward', 'Machakos', '-1.4318,37.2411', FALSE, NULL, '+254712345002', NULL, '{"education": "secondary", "occupation": "farmer", "household_size": 6}', TRUE),
('Grace Wanjiru Ndungu', 'BEN-2025-003', 'female', 28, '18-35', 'individual', NULL, 'Kibera', 'Laini Saba', 'Nairobi', '-1.3133,36.7894', TRUE, '["unemployed", "single_mother"]', '+254712345003', NULL, '{"education": "secondary", "occupation": "casual_worker", "household_size": 3}', TRUE),
('Peter Ochieng Otieno', 'BEN-2025-004', 'male', 23, '18-35', 'individual', NULL, 'Kisumu Town', 'Market Ward', 'Kisumu', '-0.0917,34.7680', FALSE, NULL, '+254712345004', 'peter.o@gmail.com', '{"education": "tertiary", "occupation": "unemployed", "household_size": 1}', TRUE),
('Faith Auma Okello', 'BEN-2025-005', 'female', 31, '18-35', 'individual', NULL, 'Mukuru', 'Kwa Njenga', 'Nairobi', '-1.3028,36.8739', TRUE, '["gvb_survivor", "low_income"]', '+254712345005', NULL, '{"education": "primary", "occupation": "small_business", "household_size": 4}', TRUE),
('David Kiplagat Korir', 'BEN-2025-006', 'male', 19, '18-35', 'individual', NULL, 'Changamwe', 'Changamwe Ward', 'Mombasa', '-4.0950,39.6544', FALSE, NULL, '+254712345006', NULL, '{"education": "secondary", "occupation": "student", "household_size": 7}', TRUE),
('Sarah Nyambura Githinji', 'BEN-2025-007', 'female', 52, '36-60', 'individual', NULL, 'Lodwar Town', 'Lodwar Ward', 'Turkana', '3.1190,35.5977', TRUE, '["elderly", "chronic_illness", "drought_affected"]', '+254712345007', NULL, '{"education": "none", "occupation": "subsistence_farmer", "household_size": 8}', TRUE),
('Hassan Ali Mohammed', 'BEN-2025-008', 'male', 29, 'refugee', 'individual', NULL, 'Kakuma Camp', 'Kakuma Ward', 'Turkana', '3.7368,34.8608', TRUE, '["refugee", "displaced"]', '+254712345008', NULL, '{"education": "secondary", "occupation": "unemployed", "household_size": 5, "country_of_origin": "Somalia"}', TRUE),
('Lucy Wangari Maina', 'BEN-2025-009', 'female', 38, '36-60', 'individual', NULL, 'Nakuru Town', 'Central Ward', 'Nakuru', '-0.3031,36.0800', FALSE, NULL, '+254712345009', 'lucy.w@gmail.com', '{"education": "secondary", "occupation": "artisan", "household_size": 4}', TRUE),
('James Mutua Musyoki', 'BEN-2025-010', 'male', 41, '36-60', 'individual', NULL, 'Makueni Town', 'Central Ward', 'Makueni', '-1.8044,37.6214', FALSE, NULL, '+254712345010', NULL, '{"education": "primary", "occupation": "farmer", "household_size": 5}', TRUE),
('Agnes Chebet Rotich', 'BEN-2025-011', 'female', 26, '18-35', 'individual', NULL, 'Eldoret Town', 'Central Ward', 'Uasin Gishu', '0.5143,35.2698', TRUE, '["youth", "low_income"]', '+254712345011', 'agnes.c@gmail.com', '{"education": "tertiary", "occupation": "unemployed", "household_size": 2}', TRUE),
('Michael Kamau Njoroge', 'BEN-2025-012', 'male', 17, '6-17', 'individual', NULL, 'Mombasa', 'Changamwe Ward', 'Mombasa', '-4.0950,39.6544', TRUE, '["ovc", "at_risk_youth"]', '+254712345012', NULL, '{"education": "secondary", "occupation": "student", "household_size": 1, "guardian": "uncle"}', TRUE),
('Rose Wambui Kimani', 'BEN-2025-013', 'female', 65, '60+', 'individual', NULL, 'Nyandarua', 'Central Ward', 'Nyandarua', '-0.0536,36.5214', TRUE, '["elderly", "disabled"]', '+254712345013', NULL, '{"education": "none", "occupation": "retired", "household_size": 2, "disability_type": "mobility"}', TRUE),
('Daniel Kiprop Bett', 'BEN-2025-014', 'male', 35, '18-35', 'individual', NULL, 'Nyandarua', 'Central Ward', 'Nyandarua', '-0.0536,36.5214', FALSE, NULL, '+254712345014', NULL, '{"education": "secondary", "occupation": "dairy_farmer", "household_size": 6}', TRUE),
('Catherine Nyokabi Mugo', 'BEN-2025-015', 'female', 42, '36-60', 'individual', NULL, 'Nairobi', 'Central Ward', 'Nairobi', '-1.2864,36.8172', TRUE, '["gvb_survivor"]', '+254712345015', 'catherine.n@gmail.com', '{"education": "secondary", "occupation": "employed", "household_size": 3}', TRUE),
('Patrick Mwangi Kuria', 'BEN-2025-016', 'male', 27, '18-35', 'individual', NULL, 'Trans-Nzoia', 'Central Ward', 'Trans-Nzoia', '1.0667,34.9500', FALSE, NULL, '+254712345016', 'patrick.m@gmail.com', '{"education": "tertiary", "occupation": "community_leader", "household_size": 4}', TRUE),
('Susan Njeri Waweru', 'BEN-2025-017', 'female', 30, '18-35', 'individual', NULL, 'Various', 'Multiple', 'Various', NULL, FALSE, NULL, '+254712345017', 'susan.nj@gmail.com', '{"education": "tertiary", "occupation": "volunteer", "household_size": 2}', TRUE),
('Thomas Kimani Njenga', 'BEN-2025-018', 'male', 48, '36-60', 'individual', NULL, 'Trans-Nzoia', 'Central Ward', 'Trans-Nzoia', '1.0667,34.9500', FALSE, NULL, '+254712345018', 'thomas.k@gmail.com', '{"education": "secondary", "occupation": "farmer", "household_size": 7}', TRUE),
('Betty Mwikali Mutua', 'BEN-2025-019', 'female', 33, '18-35', 'individual', NULL, 'Various', 'Multiple', 'Various', NULL, FALSE, NULL, '+254712345019', 'betty.m@gmail.com', '{"education": "tertiary", "occupation": "trainer", "household_size": 3}', TRUE),
('Fatuma Hassan Ali', 'BEN-2025-020', 'female', 24, '18-35', 'individual', NULL, 'Garissa Town', 'Central Ward', 'Garissa', '-0.4534,39.6461', TRUE, '["refugee", "single_mother"]', '+254712345020', NULL, '{"education": "primary", "occupation": "unemployed", "household_size": 3, "country_of_origin": "Somalia"}', TRUE);

-- =====================================================
-- ACTIVITY_BENEFICIARIES (20 Records)
-- Linking beneficiaries to activities they participated in
-- =====================================================

INSERT INTO `activity_beneficiaries` (`activity_id`, `beneficiary_id`, `role`, `attended`) VALUES
-- Climate-Smart Agriculture Workshop participants
(1, 1, 'participant', TRUE),
(1, 2, 'participant', TRUE),
(1, 10, 'participant', TRUE),

-- Water Harvesting Training participants
(2, 1, 'participant', TRUE),
(2, 2, 'participant', FALSE),

-- VSLA Group Formation participants
(6, 3, 'participant', TRUE),
(6, 5, 'participant', TRUE),
(6, 9, 'participant', TRUE),

-- VSLA Starter Kit Distribution
(7, 3, 'participant', TRUE),
(7, 5, 'participant', TRUE),

-- Financial Literacy Training
(8, 3, 'participant', TRUE),
(8, 5, 'participant', TRUE),
(8, 9, 'participant', FALSE),

-- Youth Entrepreneurship Bootcamp
(9, 4, 'participant', TRUE),
(9, 11, 'participant', TRUE),

-- GBV Awareness Rally
(11, 3, 'participant', TRUE),
(11, 5, 'participant', TRUE),
(11, 15, 'participant', TRUE);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- END OF SEED DATA
-- =====================================================
