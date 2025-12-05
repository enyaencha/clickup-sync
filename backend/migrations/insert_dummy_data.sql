-- Dummy Data for M&E Program Modules
-- This creates realistic sample data for testing all modules

-- ================================================
-- 1. BENEFICIARIES (25 records)
-- ================================================

INSERT INTO beneficiaries (
    registration_number, first_name, middle_name, last_name, date_of_birth, age, gender,
    phone_number, email, county, sub_county, ward, village,
    household_size, household_head, marital_status, disability_status,
    vulnerability_category, registration_date, status
) VALUES
('BEN-2024-001', 'Mary', 'Wanjiku', 'Kamau', '1985-03-15', 39, 'female', '0712345601', 'mary.kamau@email.com', 'Nairobi', 'Dagoretti', 'Kawangware', 'Kawangware North', 5, TRUE, 'married', 'none', 'poor_household', '2024-01-15', 'active'),
('BEN-2024-002', 'John', 'Mwangi', 'Ochieng', '1990-07-22', 34, 'male', '0723456702', 'john.ochieng@email.com', 'Kisumu', 'Kisumu East', 'Manyatta', 'Nyalenda B', 6, TRUE, 'married', 'none', 'poor_household', '2024-01-20', 'active'),
('BEN-2024-003', 'Grace', 'Akinyi', 'Otieno', '1995-11-08', 29, 'female', '0734567803', NULL, 'Mombasa', 'Mvita', 'Tononoka', 'Majengo', 4, FALSE, 'single', 'none', 'youth_at_risk', '2024-02-01', 'active'),
('BEN-2024-004', 'David', 'Kipchoge', 'Rotich', '1978-05-30', 46, 'male', '0745678904', 'david.rotich@email.com', 'Uasin Gishu', 'Ainabkoi', 'Kapsoya', 'Kapsoya Estate', 7, TRUE, 'married', 'physical', 'pwd', '2024-02-10', 'active'),
('BEN-2024-005', 'Faith', 'Nyambura', 'Kariuki', '2002-09-12', 22, 'female', '0756789005', NULL, 'Kiambu', 'Kikuyu', 'Kikuyu', 'Kikuyu Town', 3, FALSE, 'single', 'none', 'youth_at_risk', '2024-02-15', 'active'),
('BEN-2024-006', 'Peter', 'Kamau', 'Muturi', '1965-12-25', 59, 'male', '0767890106', NULL, 'Murang\'a', 'Kigumo', 'Kinyona', 'Kinyona Village', 2, TRUE, 'widowed', 'visual', 'elderly', '2024-02-20', 'active'),
('BEN-2024-007', 'Sarah', 'Wambui', 'Ndungu', '1988-04-18', 36, 'female', '0778901207', 'sarah.ndungu@email.com', 'Nakuru', 'Nakuru West', 'Kaptembwo', 'Section 58', 8, TRUE, 'married', 'none', 'poor_household', '2024-03-01', 'active'),
('BEN-2024-008', 'James', 'Otieno', 'Omondi', '1992-08-05', 32, 'male', '0789012308', NULL, 'Kisumu', 'Kisumu Central', 'Kondele', 'Nyalenda A', 5, TRUE, 'married', 'none', 'poor_household', '2024-03-05', 'active'),
('BEN-2024-009', 'Lucy', 'Njeri', 'Wanjiru', '1999-01-14', 25, 'female', '0790123409', 'lucy.wanjiru@email.com', 'Nairobi', 'Embakasi', 'Umoja', 'Umoja 1', 4, FALSE, 'single', 'none', 'youth_at_risk', '2024-03-10', 'active'),
('BEN-2024-010', 'Daniel', 'Kiprono', 'Koech', '1983-06-20', 41, 'male', '0701234510', NULL, 'Kericho', 'Bureti', 'Litein', 'Litein Town', 6, TRUE, 'married', 'none', 'poor_household', '2024-03-15', 'active'),
('BEN-2024-011', 'Esther', 'Mumbi', 'Githui', '1970-10-10', 54, 'female', '0712345611', 'esther.githui@email.com', 'Kirinyaga', 'Mwea', 'Wamumu', 'Wamumu Village', 3, TRUE, 'divorced', 'hearing', 'pwd', '2024-03-20', 'active'),
('BEN-2024-012', 'Michael', 'Juma', 'Hassan', '1987-02-28', 37, 'male', '0723456712', NULL, 'Garissa', 'Garissa Township', 'Township', 'Iftin', 9, TRUE, 'married', 'none', 'refugee', '2024-03-25', 'active'),
('BEN-2024-013', 'Alice', 'Chebet', 'Sang', '1996-12-03', 28, 'female', '0734567813', 'alice.sang@email.com', 'Bomet', 'Bomet Central', 'Silibwet', 'Silibwet Town', 5, FALSE, 'married', 'none', 'poor_household', '2024-04-01', 'active'),
('BEN-2024-014', 'Joseph', 'Wekesa', 'Wafula', '1975-07-19', 49, 'male', '0745678914', NULL, 'Bungoma', 'Kanduyi', 'Bukembe', 'Bukembe West', 7, TRUE, 'married', 'none', 'poor_household', '2024-04-05', 'active'),
('BEN-2024-015', 'Rose', 'Nyokabi', 'Maina', '2003-03-22', 21, 'female', '0756789015', NULL, 'Nyeri', 'Nyeri Central', 'Ruringu', 'Ruringu Estate', 4, FALSE, 'single', 'none', 'ovc', '2024-04-10', 'active'),
('BEN-2024-016', 'Patrick', 'Kibet', 'Kiptoo', '1980-11-30', 44, 'male', '0767890116', 'patrick.kiptoo@email.com', 'Nandi', 'Nandi Hills', 'Nandi Hills', 'Nandi Hills Town', 6, TRUE, 'married', 'none', 'poor_household', '2024-04-15', 'active'),
('BEN-2024-017', 'Jane', 'Wangari', 'Ngugi', '1993-09-07', 31, 'female', '0778901217', NULL, 'Kajiado', 'Kajiado Central', 'Ildamat', 'Ildamat Village', 5, TRUE, 'married', 'none', 'poor_household', '2024-04-20', 'active'),
('BEN-2024-018', 'Samuel', 'Mburu', 'Karanja', '1968-05-14', 56, 'male', '0789012318', 'samuel.karanja@email.com', 'Embu', 'Manyatta', 'Gaturi North', 'Gaturi', 2, TRUE, 'widowed', 'multiple', 'elderly', '2024-04-25', 'active'),
('BEN-2024-019', 'Catherine', 'Achieng', 'Awino', '1998-01-25', 26, 'female', '0790123419', NULL, 'Siaya', 'Bondo', 'West Sakwa', 'Usonga', 4, FALSE, 'single', 'none', 'youth_at_risk', '2024-05-01', 'active'),
('BEN-2024-020', 'George', 'Macharia', 'Njoroge', '1986-08-11', 38, 'male', '0701234520', 'george.njoroge@email.com', 'Laikipia', 'Laikipia East', 'Nanyuki', 'Nanyuki Town', 6, TRUE, 'married', 'none', 'poor_household', '2024-05-05', 'active'),
('BEN-2024-021', 'Margaret', 'Wanjiru', 'Kimani', '1972-04-08', 52, 'female', '0712345621', NULL, 'Nyandarua', 'Ol Kalou', 'Rurii', 'Rurii Village', 3, TRUE, 'married', 'none', 'poor_household', '2024-05-10', 'active'),
('BEN-2024-022', 'Francis', 'Ouma', 'Odhiambo', '1991-10-16', 33, 'male', '0723456722', 'francis.odhiambo@email.com', 'Homa Bay', 'Ndhiwa', 'Kwabwai', 'Kwabwai Market', 7, TRUE, 'married', 'none', 'poor_household', '2024-05-15', 'active'),
('BEN-2024-023', 'Joyce', 'Wangui', 'Kimathi', '2000-06-29', 24, 'female', '0734567823', NULL, 'Meru', 'Imenti North', 'Ntima', 'Ntima East', 5, FALSE, 'single', 'none', 'youth_at_risk', '2024-05-20', 'active'),
('BEN-2024-024', 'Thomas', 'Kiptanui', 'Biwott', '1977-12-12', 47, 'male', '0745678924', NULL, 'Elgeyo Marakwet', 'Marakwet West', 'Kapsowar', 'Kapsowar Town', 8, TRUE, 'married', 'none', 'poor_household', '2024-05-25', 'active'),
('BEN-2024-025', 'Ann', 'Njoki', 'Wachira', '1989-02-17', 35, 'female', '0756789025', 'ann.wachira@email.com', 'Tharaka Nithi', 'Chuka', 'Karingani', 'Karingani Village', 4, TRUE, 'divorced', 'none', 'poor_household', '2024-06-01', 'active');

-- ================================================
-- 2. SHG GROUPS (20 records)
-- ================================================

INSERT INTO shg_groups (
    group_code, group_name, formation_date, registration_status,
    county, sub_county, ward, village, total_members, male_members, female_members,
    total_savings, total_shares, meeting_frequency, status
) VALUES
('SHG-001', 'Tumaini Women Group', '2023-01-15', 'registered', 'Nairobi', 'Dagoretti', 'Kawangware', 'Kawangware North', 15, 0, 15, 450000.00, 150000.00, 'weekly', 'active'),
('SHG-002', 'Umoja Self Help', '2023-02-10', 'registered', 'Kisumu', 'Kisumu East', 'Manyatta', 'Nyalenda B', 20, 8, 12, 600000.00, 200000.00, 'weekly', 'active'),
('SHG-003', 'Harambee Group', '2023-03-05', 'mature', 'Mombasa', 'Mvita', 'Tononoka', 'Majengo', 12, 4, 8, 360000.00, 120000.00, 'weekly', 'active'),
('SHG-004', 'Mwangaza Farmers', '2023-03-20', 'registered', 'Uasin Gishu', 'Ainabkoi', 'Kapsoya', 'Kapsoya Estate', 18, 9, 9, 540000.00, 180000.00, 'weekly', 'active'),
('SHG-005', 'Furaha Women', '2023-04-12', 'registered', 'Kiambu', 'Kikuyu', 'Kikuyu', 'Kikuyu Town', 10, 2, 8, 300000.00, 100000.00, 'weekly', 'active'),
('SHG-006', 'Amani Group', '2023-05-08', 'forming', 'Murang\'a', 'Kigumo', 'Kinyona', 'Kinyona Village', 8, 3, 5, 120000.00, 40000.00, 'weekly', 'active'),
('SHG-007', 'Upendo Wetu', '2023-06-01', 'registered', 'Nakuru', 'Nakuru West', 'Kaptembwo', 'Section 58', 25, 10, 15, 750000.00, 250000.00, 'weekly', 'active'),
('SHG-008', 'Maendeleo Group', '2023-06-20', 'mature', 'Kisumu', 'Kisumu Central', 'Kondele', 'Nyalenda A', 16, 6, 10, 480000.00, 160000.00, 'weekly', 'active'),
('SHG-009', 'Pamoja Women', '2023-07-10', 'registered', 'Nairobi', 'Embakasi', 'Umoja', 'Umoja 1', 14, 0, 14, 420000.00, 140000.00, 'weekly', 'active'),
('SHG-010', 'Vijana Farmers', '2023-08-05', 'registered', 'Kericho', 'Bureti', 'Litein', 'Litein Town', 22, 12, 10, 660000.00, 220000.00, 'bi_weekly', 'active'),
('SHG-011', 'Uzima Group', '2023-09-01', 'forming', 'Kirinyaga', 'Mwea', 'Wamumu', 'Wamumu Village', 9, 4, 5, 135000.00, 45000.00, 'weekly', 'active'),
('SHG-012', 'Imani Women', '2023-09-25', 'registered', 'Bomet', 'Bomet Central', 'Silibwet', 'Silibwet Town', 17, 5, 12, 510000.00, 170000.00, 'weekly', 'active'),
('SHG-013', 'Baraka Group', '2023-10-10', 'registered', 'Bungoma', 'Kanduyi', 'Bukembe', 'Bukembe West', 19, 8, 11, 570000.00, 190000.00, 'weekly', 'active'),
('SHG-014', 'Neema Women', '2023-11-01', 'forming', 'Nyeri', 'Nyeri Central', 'Ruringu', 'Ruringu Estate', 11, 2, 9, 165000.00, 55000.00, 'weekly', 'active'),
('SHG-015', 'Jamii Yetu', '2023-11-20', 'registered', 'Nandi', 'Nandi Hills', 'Nandi Hills', 'Nandi Hills Town', 21, 9, 12, 630000.00, 210000.00, 'weekly', 'active'),
('SHG-016', 'Tujenge Group', '2023-12-05', 'mature', 'Kajiado', 'Kajiado Central', 'Ildamat', 'Ildamat Village', 13, 5, 8, 390000.00, 130000.00, 'bi_weekly', 'active'),
('SHG-017', 'Wanawake Hodari', '2024-01-10', 'forming', 'Embu', 'Manyatta', 'Gaturi North', 'Gaturi', 7, 0, 7, 105000.00, 35000.00, 'weekly', 'active'),
('SHG-018', 'Unity Group', '2024-02-01', 'registered', 'Siaya', 'Bondo', 'West Sakwa', 'Usonga', 15, 6, 9, 450000.00, 150000.00, 'weekly', 'active'),
('SHG-019', 'Faida Group', '2024-03-01', 'forming', 'Laikipia', 'Laikipia East', 'Nanyuki', 'Nanyuki Town', 12, 5, 7, 180000.00, 60000.00, 'weekly', 'active'),
('SHG-020', 'Shujaa Women', '2024-04-01', 'forming', 'Nyandarua', 'Ol Kalou', 'Rurii', 'Rurii Village', 10, 3, 7, 150000.00, 50000.00, 'weekly', 'active');

-- ================================================
-- 3. SHG MEMBERS (Link beneficiaries to groups)
-- ================================================

-- Members for SHG-001 (15 members)
INSERT INTO shg_members (shg_group_id, beneficiary_id, join_date, membership_status, member_role)
SELECT 1, id, '2023-01-15', 'active', CASE WHEN id = 1 THEN 'chairperson' WHEN id = 3 THEN 'secretary' WHEN id = 5 THEN 'treasurer' ELSE 'member' END
FROM beneficiaries WHERE id IN (1,3,5,7,9,11,13,15,17,19,21,23,25,2,4) LIMIT 15;

-- Members for SHG-002 (20 members)
INSERT INTO shg_members (shg_group_id, beneficiary_id, join_date, membership_status, member_role)
SELECT 2, id, '2023-02-10', 'active', CASE WHEN id = 2 THEN 'chairperson' WHEN id = 4 THEN 'secretary' WHEN id = 6 THEN 'treasurer' ELSE 'member' END
FROM beneficiaries WHERE id IN (2,4,6,8,10,12,14,16,18,20,22,24,1,3,5,7,9,11,13,15) LIMIT 20;

-- Members for remaining groups (simplified - 12 members each)
INSERT INTO shg_members (shg_group_id, beneficiary_id, join_date, membership_status, member_role)
SELECT 3, id, '2023-03-05', 'active', 'member' FROM beneficiaries WHERE id BETWEEN 1 AND 12;

INSERT INTO shg_members (shg_group_id, beneficiary_id, join_date, membership_status, member_role)
SELECT 4, id, '2023-03-20', 'active', 'member' FROM beneficiaries WHERE id BETWEEN 5 AND 16;

INSERT INTO shg_members (shg_group_id, beneficiary_id, join_date, membership_status, member_role)
SELECT 5, id, '2023-04-12', 'active', 'member' FROM beneficiaries WHERE id BETWEEN 1 AND 10;

-- ================================================
-- 4. LOANS (25 records)
-- ================================================

INSERT INTO loans (
    loan_number, shg_group_id, beneficiary_id, loan_type, loan_amount, interest_rate,
    loan_term_months, application_date, loan_status, repayment_status, loan_purpose
) VALUES
('LOAN-2024-001', 1, 1, 'business', 50000.00, 10.00, 12, '2024-01-20', 'active', 'on_track', 'Small shop expansion'),
('LOAN-2024-002', 1, 3, 'agriculture', 30000.00, 10.00, 6, '2024-02-01', 'active', 'on_track', 'Farm inputs purchase'),
('LOAN-2024-003', 2, 2, 'education', 40000.00, 8.00, 12, '2024-02-10', 'active', 'on_track', 'School fees payment'),
('LOAN-2024-004', 2, 4, 'business', 60000.00, 10.00, 12, '2024-02-15', 'active', 'overdue', 'Tailoring business'),
('LOAN-2024-005', 3, 7, 'emergency', 20000.00, 8.00, 6, '2024-03-01', 'completed', 'completed', 'Medical emergency'),
('LOAN-2024-006', 3, 9, 'business', 45000.00, 10.00, 12, '2024-03-05', 'active', 'on_track', 'Beauty salon'),
('LOAN-2024-007', 4, 10, 'agriculture', 80000.00, 12.00, 18, '2024-03-10', 'active', 'on_track', 'Dairy farming'),
('LOAN-2024-008', 4, 12, 'business', 55000.00, 10.00, 12, '2024-03-15', 'active', 'on_track', 'Motorcycle taxi'),
('LOAN-2024-009', 5, 13, 'education', 35000.00, 8.00, 12, '2024-03-20', 'active', 'on_track', 'Vocational training'),
('LOAN-2024-010', 5, 15, 'business', 25000.00, 10.00, 6, '2024-03-25', 'completed', 'completed', 'Vegetable vending'),
('LOAN-2024-011', 1, 5, 'agriculture', 40000.00, 10.00, 12, '2024-04-01', 'active', 'on_track', 'Poultry farming'),
('LOAN-2024-012', 2, 6, 'business', 70000.00, 12.00, 18, '2024-04-05', 'active', 'on_track', 'Hardware shop'),
('LOAN-2024-013', 3, 11, 'emergency', 15000.00, 8.00, 6, '2024-04-10', 'completed', 'completed', 'House repair'),
('LOAN-2024-014', 4, 14, 'business', 50000.00, 10.00, 12, '2024-04-15', 'active', 'overdue', 'Grocery store'),
('LOAN-2024-015', 5, 17, 'agriculture', 35000.00, 10.00, 12, '2024-04-20', 'active', 'on_track', 'Crop farming'),
('LOAN-2024-016', 1, 7, 'business', 45000.00, 10.00, 12, '2024-04-25', 'active', 'on_track', 'Clothing business'),
('LOAN-2024-017', 2, 8, 'education', 30000.00, 8.00, 12, '2024-05-01', 'active', 'on_track', 'College fees'),
('LOAN-2024-018', 3, 13, 'business', 55000.00, 10.00, 12, '2024-05-05', 'active', 'on_track', 'Restaurant'),
('LOAN-2024-019', 4, 16, 'agriculture', 65000.00, 12.00, 18, '2024-05-10', 'disbursed', 'on_track', 'Greenhouse farming'),
('LOAN-2024-020', 5, 19, 'business', 40000.00, 10.00, 12, '2024-05-15', 'approved', 'pending', 'Fish vending'),
('LOAN-2024-021', 1, 9, 'emergency', 18000.00, 8.00, 6, '2024-05-20', 'active', 'on_track', 'Family emergency'),
('LOAN-2024-022', 2, 20, 'business', 60000.00, 10.00, 12, '2024-05-25', 'pending', 'pending', 'Barbershop'),
('LOAN-2024-023', 3, 21, 'agriculture', 75000.00, 12.00, 18, '2024-06-01', 'pending', 'pending', 'Livestock purchase'),
('LOAN-2024-024', 4, 22, 'business', 50000.00, 10.00, 12, '2024-06-05', 'pending', 'pending', 'Welding workshop'),
('LOAN-2024-025', 5, 23, 'education', 32000.00, 8.00, 12, '2024-06-10', 'pending', 'pending', 'Driving school');

-- ================================================
-- 5. GBV CASES (20 records - sensitive data)
-- ================================================

INSERT INTO gbv_cases (
    case_number, survivor_code, incident_date, incident_type, incident_location,
    survivor_age_group, survivor_gender, risk_level, case_status, consent_obtained, referral_source
) VALUES
('GBV-2024-001', 'SUR-A001', '2024-01-15', 'domestic_violence', 'Nairobi, Kawangware', 'adult', 'female', 'high', 'intervention', TRUE, 'Hospital'),
('GBV-2024-002', 'SUR-B002', '2024-01-22', 'sexual_assault', 'Kisumu, Nyalenda', 'youth', 'female', 'critical', 'investigation', TRUE, 'Police Station'),
('GBV-2024-003', 'SUR-C003', '2024-02-05', 'domestic_violence', 'Mombasa, Majengo', 'adult', 'female', 'medium', 'follow_up', TRUE, 'Community Leader'),
('GBV-2024-004', 'SUR-D004', '2024-02-12', 'early_marriage', 'Uasin Gishu, Kapsoya', 'child', 'female', 'high', 'intervention', TRUE, 'School'),
('GBV-2024-005', 'SUR-E005', '2024-02-20', 'domestic_violence', 'Kiambu, Kikuyu', 'youth', 'female', 'medium', 'closed', TRUE, 'Health Center'),
('GBV-2024-006', 'SUR-F006', '2024-03-01', 'sexual_assault', 'Murang\'a, Kinyona', 'adult', 'female', 'critical', 'intervention', TRUE, 'Police Station'),
('GBV-2024-007', 'SUR-G007', '2024-03-10', 'domestic_violence', 'Nakuru, Kaptembwo', 'adult', 'female', 'high', 'follow_up', TRUE, 'NGO'),
('GBV-2024-008', 'SUR-H008', '2024-03-18', 'fgm', 'Kisumu, Kondele', 'child', 'female', 'high', 'investigation', TRUE, 'Hospital'),
('GBV-2024-009', 'SUR-I009', '2024-03-25', 'domestic_violence', 'Nairobi, Umoja', 'youth', 'female', 'medium', 'follow_up', TRUE, 'Neighbor'),
('GBV-2024-010', 'SUR-J010', '2024-04-02', 'sexual_assault', 'Kericho, Litein', 'adult', 'female', 'critical', 'intervention', TRUE, 'Police Station'),
('GBV-2024-011', 'SUR-K011', '2024-04-08', 'domestic_violence', 'Kirinyaga, Wamumu', 'adult', 'female', 'high', 'intervention', TRUE, 'Health Center'),
('GBV-2024-012', 'SUR-L012', '2024-04-15', 'early_marriage', 'Bomet, Silibwet', 'child', 'female', 'high', 'investigation', TRUE, 'School'),
('GBV-2024-013', 'SUR-M013', '2024-04-22', 'domestic_violence', 'Bungoma, Bukembe', 'youth', 'female', 'medium', 'follow_up', TRUE, 'Community Leader'),
('GBV-2024-014', 'SUR-N014', '2024-05-01', 'sexual_assault', 'Nyeri, Ruringu', 'youth', 'female', 'critical', 'investigation', TRUE, 'Hospital'),
('GBV-2024-015', 'SUR-O015', '2024-05-08', 'domestic_violence', 'Nandi, Nandi Hills', 'adult', 'female', 'high', 'intervention', TRUE, 'NGO'),
('GBV-2024-016', 'SUR-P016', '2024-05-15', 'domestic_violence', 'Kajiado, Ildamat', 'adult', 'female', 'medium', 'closed', TRUE, 'Police Station'),
('GBV-2024-017', 'SUR-Q017', '2024-05-22', 'sexual_assault', 'Embu, Gaturi', 'elderly', 'female', 'high', 'follow_up', TRUE, 'Hospital'),
('GBV-2024-018', 'SUR-R018', '2024-05-29', 'domestic_violence', 'Siaya, Usonga', 'youth', 'female', 'medium', 'intervention', TRUE, 'Community Leader'),
('GBV-2024-019', 'SUR-S019', '2024-06-05', 'trafficking', 'Laikipia, Nanyuki', 'youth', 'female', 'critical', 'investigation', TRUE, 'Police Station'),
('GBV-2024-020', 'SUR-T020', '2024-06-10', 'domestic_violence', 'Nyandarua, Rurii', 'adult', 'female', 'high', 'intake', TRUE, 'Health Center');

-- ================================================
-- 6. RELIEF DISTRIBUTIONS (22 records)
-- ================================================

INSERT INTO relief_distributions (
    distribution_code, distribution_date, distribution_type, location, county, sub_county,
    item_description, quantity_distributed, unit_of_measure, target_beneficiaries, status
) VALUES
('REL-2024-001', '2024-01-15', 'food', 'Kawangware, Nairobi', 'Nairobi', 'Dagoretti', 'Maize flour, beans, cooking oil', 500, 'kg', 50, 'completed'),
('REL-2024-002', '2024-01-20', 'nfis', 'Nyalenda, Kisumu', 'Kisumu', 'Kisumu East', 'Blankets, mosquito nets, jerry cans', 200, 'pieces', 40, 'completed'),
('REL-2024-003', '2024-02-01', 'food', 'Majengo, Mombasa', 'Mombasa', 'Mvita', 'Rice, sugar, salt', 750, 'kg', 75, 'completed'),
('REL-2024-004', '2024-02-10', 'cash', 'Kapsoya, Uasin Gishu', 'Uasin Gishu', 'Ainabkoi', 'Cash transfer', 50, 'households', 50, 'completed'),
('REL-2024-005', '2024-02-15', 'food', 'Kikuyu, Kiambu', 'Kiambu', 'Kikuyu', 'Maize, beans, cooking oil', 400, 'kg', 40, 'completed'),
('REL-2024-006', '2024-03-01', 'medical', 'Kinyona, Murang\'a', 'Murang\'a', 'Kigumo', 'First aid kits, medicine', 100, 'kits', 30, 'completed'),
('REL-2024-007', '2024-03-10', 'food', 'Kaptembwo, Nakuru', 'Nakuru', 'Nakuru West', 'Maize flour, rice, oil', 1000, 'kg', 100, 'completed'),
('REL-2024-008', '2024-03-15', 'voucher', 'Kondele, Kisumu', 'Kisumu', 'Kisumu Central', 'Food vouchers', 80, 'vouchers', 80, 'completed'),
('REL-2024-009', '2024-03-20', 'nfis', 'Umoja, Nairobi', 'Nairobi', 'Embakasi', 'Bedding, utensils, hygiene kits', 150, 'pieces', 45, 'completed'),
('REL-2024-010', '2024-04-01', 'food', 'Litein, Kericho', 'Kericho', 'Bureti', 'Maize, beans, salt', 600, 'kg', 60, 'completed'),
('REL-2024-011', '2024-04-05', 'shelter', 'Wamumu, Kirinyaga', 'Kirinyaga', 'Mwea', 'Iron sheets, timber', 200, 'sheets', 25, 'completed'),
('REL-2024-012', '2024-04-10', 'food', 'Silibwet, Bomet', 'Bomet', 'Bomet Central', 'Maize flour, cooking oil', 450, 'kg', 45, 'in_progress'),
('REL-2024-013', '2024-04-15', 'education', 'Bukembe, Bungoma', 'Bungoma', 'Kanduyi', 'School supplies, uniforms', 120, 'sets', 120, 'completed'),
('REL-2024-014', '2024-04-20', 'food', 'Ruringu, Nyeri', 'Nyeri', 'Nyeri Central', 'Rice, sugar, tea leaves', 350, 'kg', 35, 'completed'),
('REL-2024-015', '2024-05-01', 'cash', 'Nandi Hills', 'Nandi', 'Nandi Hills', 'Cash transfer', 60, 'households', 60, 'completed'),
('REL-2024-016', '2024-05-05', 'food', 'Ildamat, Kajiado', 'Kajiado', 'Kajiado Central', 'Maize, beans, oil', 550, 'kg', 55, 'in_progress'),
('REL-2024-017', '2024-05-10', 'medical', 'Gaturi, Embu', 'Embu', 'Manyatta', 'Medicine, first aid supplies', 80, 'kits', 25, 'planned'),
('REL-2024-018', '2024-05-15', 'nfis', 'Usonga, Siaya', 'Siaya', 'Bondo', 'Blankets, mosquito nets', 180, 'pieces', 50, 'planned'),
('REL-2024-019', '2024-05-20', 'food', 'Nanyuki, Laikipia', 'Laikipia', 'Laikipia East', 'Maize flour, beans, salt', 700, 'kg', 70, 'planned'),
('REL-2024-020', '2024-05-25', 'voucher', 'Rurii, Nyandarua', 'Nyandarua', 'Ol Kalou', 'Food vouchers', 50, 'vouchers', 50, 'planned'),
('REL-2024-021', '2024-06-01', 'food', 'Kwabwai, Homa Bay', 'Homa Bay', 'Ndhiwa', 'Maize, rice, cooking oil', 800, 'kg', 80, 'planned'),
('REL-2024-022', '2024-06-05', 'shelter', 'Ntima, Meru', 'Meru', 'Imenti North', 'Building materials', 150, 'bundles', 30, 'planned');

-- ================================================
-- 7. NUTRITION ASSESSMENTS (25 records)
-- ================================================

INSERT INTO nutrition_assessments (
    assessment_date, beneficiary_id, household_size, cereals, tubers, vegetables, fruits,
    meat, eggs, fish, legumes, dairy, oils, sugar, condiments, hdds_score, food_security_status
) VALUES
('2024-01-20', 1, 5, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, 8, 'moderately_food_insecure'),
('2024-01-25', 2, 6, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 12, 'food_secure'),
('2024-02-05', 3, 4, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, 5, 'severely_food_insecure'),
('2024-02-10', 4, 7, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, 11, 'food_secure'),
('2024-02-15', 5, 3, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 9, 'moderately_food_insecure'),
('2024-02-20', 6, 2, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, 7, 'moderately_food_insecure'),
('2024-03-01', 7, 8, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 11, 'food_secure'),
('2024-03-05', 8, 5, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 6, 'moderately_food_insecure'),
('2024-03-10', 9, 4, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, 7, 'moderately_food_insecure'),
('2024-03-15', 10, 6, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 11, 'food_secure'),
('2024-03-20', 11, 3, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, 7, 'moderately_food_insecure'),
('2024-03-25', 12, 9, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 4, 'severely_food_insecure'),
('2024-04-01', 13, 5, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 11, 'food_secure'),
('2024-04-05', 14, 7, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 9, 'moderately_food_insecure'),
('2024-04-10', 15, 4, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, 5, 'severely_food_insecure'),
('2024-04-15', 16, 6, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 12, 'food_secure'),
('2024-04-20', 17, 5, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 9, 'moderately_food_insecure'),
('2024-04-25', 18, 2, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, 6, 'moderately_food_insecure'),
('2024-05-01', 19, 4, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 9, 'moderately_food_insecure'),
('2024-05-05', 20, 6, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, 11, 'food_secure'),
('2024-05-10', 21, 3, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 6, 'moderately_food_insecure'),
('2024-05-15', 22, 7, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 6, 'moderately_food_insecure'),
('2024-05-20', 23, 5, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, 10, 'food_secure'),
('2024-05-25', 24, 8, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 10, 'food_secure'),
('2024-06-01', 25, 4, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, 6, 'moderately_food_insecure');

-- ================================================
-- 8. AGRICULTURAL PLOTS (22 records)
-- ================================================

INSERT INTO agricultural_plots (
    plot_number, beneficiary_id, land_area_acres, county, sub_county, ward, village,
    soil_type, irrigation_available, ownership_type, registered_date
) VALUES
('PLT-001', 1, 0.5, 'Nairobi', 'Dagoretti', 'Kawangware', 'Kawangware North', 'Loam', FALSE, 'leased', '2023-06-01'),
('PLT-002', 2, 2.0, 'Kisumu', 'Kisumu East', 'Manyatta', 'Nyalenda B', 'Clay', TRUE, 'owned', '2023-06-10'),
('PLT-003', 4, 3.5, 'Uasin Gishu', 'Ainabkoi', 'Kapsoya', 'Kapsoya Estate', 'Loam', TRUE, 'owned', '2023-07-01'),
('PLT-004', 6, 1.0, 'Murang\'a', 'Kigumo', 'Kinyona', 'Kinyona Village', 'Clay', FALSE, 'owned', '2023-07-15'),
('PLT-005', 7, 4.0, 'Nakuru', 'Nakuru West', 'Kaptembwo', 'Section 58', 'Sandy Loam', TRUE, 'owned', '2023-08-01'),
('PLT-006', 8, 1.5, 'Kisumu', 'Kisumu Central', 'Kondele', 'Nyalenda A', 'Clay', TRUE, 'leased', '2023-08-15'),
('PLT-007', 10, 5.0, 'Kericho', 'Bureti', 'Litein', 'Litein Town', 'Clay Loam', TRUE, 'owned', '2023-09-01'),
('PLT-008', 11, 2.5, 'Kirinyaga', 'Mwea', 'Wamumu', 'Wamumu Village', 'Clay', TRUE, 'owned', '2023-09-15'),
('PLT-009', 13, 3.0, 'Bomet', 'Bomet Central', 'Silibwet', 'Silibwet Town', 'Loam', FALSE, 'owned', '2023-10-01'),
('PLT-010', 14, 2.0, 'Bungoma', 'Kanduyi', 'Bukembe', 'Bukembe West', 'Sandy', FALSE, 'owned', '2023-10-15'),
('PLT-011', 16, 6.0, 'Nandi', 'Nandi Hills', 'Nandi Hills', 'Nandi Hills Town', 'Clay Loam', TRUE, 'owned', '2023-11-01'),
('PLT-012', 17, 1.5, 'Kajiado', 'Kajiado Central', 'Ildamat', 'Ildamat Village', 'Sandy', FALSE, 'owned', '2023-11-15'),
('PLT-013', 18, 3.0, 'Embu', 'Manyatta', 'Gaturi North', 'Gaturi', 'Loam', TRUE, 'owned', '2023-12-01'),
('PLT-014', 20, 4.5, 'Laikipia', 'Laikipia East', 'Nanyuki', 'Nanyuki Town', 'Sandy Loam', TRUE, 'owned', '2024-01-01'),
('PLT-015', 21, 2.5, 'Nyandarua', 'Ol Kalou', 'Rurii', 'Rurii Village', 'Clay', FALSE, 'owned', '2024-01-15'),
('PLT-016', 22, 3.5, 'Homa Bay', 'Ndhiwa', 'Kwabwai', 'Kwabwai Market', 'Clay', TRUE, 'owned', '2024-02-01'),
('PLT-017', 23, 1.0, 'Meru', 'Imenti North', 'Ntima', 'Ntima East', 'Loam', FALSE, 'leased', '2024-02-15'),
('PLT-018', 24, 5.5, 'Elgeyo Marakwet', 'Marakwet West', 'Kapsowar', 'Kapsowar Town', 'Clay Loam', FALSE, 'owned', '2024-03-01'),
('PLT-019', 25, 2.0, 'Tharaka Nithi', 'Chuka', 'Karingani', 'Karingani Village', 'Loam', FALSE, 'owned', '2024-03-15'),
('PLT-020', 12, 4.0, 'Garissa', 'Garissa Township', 'Township', 'Iftin', 'Sandy', FALSE, 'communal', '2024-04-01'),
('PLT-021', 15, 1.5, 'Nyeri', 'Nyeri Central', 'Ruringu', 'Ruringu Estate', 'Loam', TRUE, 'leased', '2024-04-15'),
('PLT-022', 19, 3.0, 'Siaya', 'Bondo', 'West Sakwa', 'Usonga', 'Clay', TRUE, 'owned', '2024-05-01');

-- ================================================
-- 9. CROP PRODUCTION (30 records)
-- ================================================

INSERT INTO crop_production (
    plot_id, crop_type, variety, planting_date, planting_season, land_area_acres,
    expected_yield_kg, actual_yield_kg, harvest_date, production_status
) VALUES
-- Long rains 2023 (harvested)
(1, 'Maize', 'H513', '2023-03-15', 'long_rains', 0.5, 400, 450, '2023-07-20', 'completed'),
(2, 'Beans', 'Rose coco', '2023-03-20', 'long_rains', 2.0, 1000, 950, '2023-06-25', 'completed'),
(3, 'Wheat', 'Kenya Nguru', '2023-04-01', 'long_rains', 3.5, 3500, 3800, '2023-08-15', 'completed'),
(4, 'Maize', 'Duma 43', '2023-03-25', 'long_rains', 1.0, 800, 750, '2023-07-30', 'completed'),
(5, 'Potatoes', 'Shangi', '2023-04-10', 'long_rains', 4.0, 12000, 13500, '2023-08-20', 'completed'),

-- Short rains 2023 (harvested)
(6, 'Maize', 'DH04', '2023-10-15', 'short_rains', 1.5, 1200, 1100, '2024-02-10', 'completed'),
(7, 'Beans', 'KK8', '2023-10-20', 'short_rains', 5.0, 2500, 2700, '2024-01-15', 'completed'),
(8, 'Tomatoes', 'Anna F1', '2023-11-01', 'short_rains', 2.5, 7500, 8000, '2024-02-20', 'completed'),
(9, 'Cabbage', 'Gloria F1', '2023-10-25', 'short_rains', 3.0, 9000, 8500, '2024-02-05', 'completed'),
(10, 'Maize', 'H614', '2023-11-05', 'short_rains', 2.0, 1600, 1450, '2024-03-10', 'completed'),

-- Long rains 2024 (current season - in progress)
(11, 'Tea', 'TRFK 6/8', '2024-03-15', 'long_rains', 6.0, 18000, NULL, NULL, 'growing'),
(12, 'Maize', 'H513', '2024-03-20', 'long_rains', 1.5, 1200, NULL, NULL, 'growing'),
(13, 'Beans', 'GLP 2', '2024-04-01', 'long_rains', 3.0, 1500, NULL, NULL, 'growing'),
(14, 'Wheat', 'Kenya Fahari', '2024-03-25', 'long_rains', 4.5, 4500, NULL, NULL, 'growing'),
(15, 'Maize', 'DH04', '2024-04-05', 'long_rains', 2.5, 2000, 2100, '2024-08-10', 'completed'),

-- Year-round crops
(16, 'Vegetables', 'Kale', '2024-01-15', 'year_round', 3.5, 7000, 7200, '2024-04-20', 'completed'),
(17, 'Tomatoes', 'Moneymaker', '2024-02-01', 'year_round', 1.0, 3000, 2800, '2024-05-15', 'completed'),
(18, 'Coffee', 'Ruiru 11', '2023-06-01', 'year_round', 5.5, 5500, NULL, NULL, 'growing'),
(19, 'Bananas', 'Tissue culture', '2023-08-01', 'year_round', 2.0, 8000, NULL, NULL, 'growing'),
(20, 'Sorghum', 'Gadam', '2024-02-15', 'year_round', 4.0, 4000, 4200, '2024-06-20', 'completed'),

-- Additional recent plantings
(21, 'Maize', 'H513', '2024-04-10', 'long_rains', 1.5, 1200, NULL, NULL, 'growing'),
(22, 'Beans', 'Rose coco', '2024-04-15', 'long_rains', 3.0, 1500, NULL, NULL, 'growing'),
(1, 'Kale', 'Local variety', '2024-05-01', 'year_round', 0.5, 500, NULL, NULL, 'growing'),
(2, 'Onions', 'Red creole', '2024-05-05', 'year_round', 2.0, 4000, NULL, NULL, 'growing'),
(3, 'Barley', 'Kenya Hardy', '2024-04-20', 'long_rains', 3.5, 3500, NULL, NULL, 'growing'),

-- More completed harvests
(4, 'Beans', 'KK8', '2024-01-15', 'short_rains', 1.0, 500, 520, '2024-04-10', 'completed'),
(5, 'Carrots', 'Nantes', '2024-02-01', 'year_round', 4.0, 12000, 11500, '2024-05-20', 'completed'),
(7, 'Cassava', 'TME 14', '2023-06-01', 'year_round', 5.0, 25000, 26000, '2024-06-01', 'completed'),
(8, 'Sweet Potatoes', 'Vitaa', '2024-01-10', 'year_round', 2.5, 7500, 7800, '2024-05-25', 'completed'),
(9, 'Millet', 'Finger millet', '2024-02-20', 'year_round', 3.0, 1800, 1900, '2024-06-15', 'completed');

SELECT '✅ Dummy data insertion completed!' as status;
SELECT 'Beneficiaries:', COUNT(*) FROM beneficiaries;
SELECT 'SHG Groups:', COUNT(*) FROM shg_groups;
SELECT 'SHG Members:', COUNT(*) FROM shg_members;
SELECT 'Loans:', COUNT(*) FROM loans;
SELECT 'GBV Cases:', COUNT(*) FROM gbv_cases;
SELECT 'Relief Distributions:', COUNT(*) FROM relief_distributions;
SELECT 'Nutrition Assessments:', COUNT(*) FROM nutrition_assessments;
SELECT 'Agricultural Plots:', COUNT(*) FROM agricultural_plots;
SELECT 'Crop Production:', COUNT(*) FROM crop_production;
