-- Migration: Add Program-Specific Module Tables
-- Date: 2025-12-04
-- Description: Adds tables for SEEP (SHG, loans, savings), beneficiary registration, GBV case management, and nutrition/agriculture tracking

-- ================================================
-- BENEFICIARY MANAGEMENT (Universal across all programs)
-- ================================================

CREATE TABLE IF NOT EXISTS beneficiaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    age INT,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
    id_number VARCHAR(50) UNIQUE,
    phone_number VARCHAR(20),
    alternative_phone VARCHAR(20),
    email VARCHAR(100),

    -- Address Information
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    village VARCHAR(100),
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),

    -- Vulnerability Assessment
    household_size INT,
    household_head BOOLEAN DEFAULT FALSE,
    marital_status ENUM('single', 'married', 'divorced', 'widowed', 'separated'),
    disability_status ENUM('none', 'physical', 'visual', 'hearing', 'mental', 'multiple'),
    disability_details TEXT,
    vulnerability_category ENUM('refugee', 'ovc', 'elderly', 'pwd', 'youth_at_risk', 'poor_household', 'other'),
    vulnerability_notes TEXT,

    -- Program Eligibility
    eligible_programs JSON, -- Array of program IDs: ["seep", "gender_youth", "relief", "food_security"]
    current_programs JSON, -- Array of programs currently enrolled in

    -- Metadata
    photo_url VARCHAR(255),
    registration_date DATE NOT NULL,
    registered_by INT,
    program_module_id INT,
    status ENUM('active', 'inactive', 'graduated', 'exited') DEFAULT 'active',
    exit_date DATE,
    exit_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (registered_by) REFERENCES users(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    INDEX idx_registration_number (registration_number),
    INDEX idx_program_module (program_module_id),
    INDEX idx_gender (gender),
    INDEX idx_vulnerability (vulnerability_category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- SEEP MODULE: SELF-HELP GROUPS (SHG)
-- ================================================

CREATE TABLE IF NOT EXISTS shg_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_code VARCHAR(50) UNIQUE NOT NULL,
    group_name VARCHAR(200) NOT NULL,
    program_module_id INT NOT NULL,

    -- Group Information
    formation_date DATE NOT NULL,
    registration_status ENUM('forming', 'registered', 'mature', 'dormant', 'dissolved') DEFAULT 'forming',
    registration_number VARCHAR(100),
    registration_authority VARCHAR(200),

    -- Location
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    village VARCHAR(100),
    meeting_venue VARCHAR(200),
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),

    -- Group Details
    total_members INT DEFAULT 0,
    male_members INT DEFAULT 0,
    female_members INT DEFAULT 0,
    youth_members INT DEFAULT 0, -- Members under 35
    pwd_members INT DEFAULT 0, -- People with disabilities

    -- Financial Information
    total_savings DECIMAL(15, 2) DEFAULT 0.00,
    total_shares DECIMAL(15, 2) DEFAULT 0.00,
    share_value DECIMAL(10, 2) DEFAULT 0.00,
    total_loans_disbursed DECIMAL(15, 2) DEFAULT 0.00,
    total_loans_outstanding DECIMAL(15, 2) DEFAULT 0.00,
    loan_interest_rate DECIMAL(5, 2) DEFAULT 10.00, -- Percentage

    -- Meetings
    meeting_frequency ENUM('weekly', 'bi-weekly', 'monthly') DEFAULT 'monthly',
    meeting_day VARCHAR(20),
    last_meeting_date DATE,

    -- Governance
    chairperson_id INT,
    secretary_id INT,
    treasurer_id INT,

    -- Metadata
    facilitator_id INT, -- Field officer facilitating the group
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (facilitator_id) REFERENCES users(id),
    FOREIGN KEY (chairperson_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (secretary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (treasurer_id) REFERENCES beneficiaries(id),
    INDEX idx_group_code (group_code),
    INDEX idx_program_module (program_module_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shg_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shg_group_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Membership Details
    join_date DATE NOT NULL,
    membership_status ENUM('active', 'inactive', 'exited') DEFAULT 'active',
    exit_date DATE,
    exit_reason TEXT,

    -- Position
    position ENUM('member', 'chairperson', 'vice_chairperson', 'secretary', 'treasurer', 'committee_member') DEFAULT 'member',

    -- Financial Details
    total_savings DECIMAL(15, 2) DEFAULT 0.00,
    total_shares INT DEFAULT 0,
    loans_taken INT DEFAULT 0,
    loans_repaid INT DEFAULT 0,
    current_loan_balance DECIMAL(15, 2) DEFAULT 0.00,

    -- Training
    trainings_attended INT DEFAULT 0,
    last_training_date DATE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (shg_group_id) REFERENCES shg_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    UNIQUE KEY unique_member (shg_group_id, beneficiary_id),
    INDEX idx_group (shg_group_id),
    INDEX idx_beneficiary (beneficiary_id),
    INDEX idx_status (membership_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shg_meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shg_group_id INT NOT NULL,

    -- Meeting Details
    meeting_date DATE NOT NULL,
    meeting_type ENUM('regular', 'special', 'training', 'annual_general') DEFAULT 'regular',
    venue VARCHAR(200),
    facilitator_id INT,

    -- Attendance
    total_members INT DEFAULT 0,
    members_present INT DEFAULT 0,
    attendance_percentage DECIMAL(5, 2),

    -- Financial Transactions
    savings_collected DECIMAL(15, 2) DEFAULT 0.00,
    loans_disbursed DECIMAL(15, 2) DEFAULT 0.00,
    loan_repayments DECIMAL(15, 2) DEFAULT 0.00,
    fines_collected DECIMAL(10, 2) DEFAULT 0.00,

    -- Meeting Outcomes
    agenda TEXT,
    resolutions TEXT,
    challenges TEXT,
    next_meeting_date DATE,

    -- Metadata
    minutes_document_url VARCHAR(255),
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (shg_group_id) REFERENCES shg_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (facilitator_id) REFERENCES users(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_group (shg_group_id),
    INDEX idx_meeting_date (meeting_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shg_meeting_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meeting_id INT NOT NULL,
    member_id INT NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    savings_contribution DECIMAL(10, 2) DEFAULT 0.00,
    loan_repayment DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (meeting_id) REFERENCES shg_meetings(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES shg_members(id),
    UNIQUE KEY unique_attendance (meeting_id, member_id),
    INDEX idx_meeting (meeting_id),
    INDEX idx_member (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- SEEP MODULE: LOANS & MICROFINANCE
-- ================================================

CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    shg_group_id INT NOT NULL,
    member_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Loan Details
    loan_type ENUM('group_loan', 'individual_loan', 'emergency_loan', 'business_loan') DEFAULT 'individual_loan',
    loan_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL, -- Percentage
    loan_tenure_months INT NOT NULL,
    repayment_frequency ENUM('weekly', 'bi-weekly', 'monthly') DEFAULT 'monthly',

    -- Dates
    application_date DATE NOT NULL,
    approval_date DATE,
    disbursement_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,

    -- Purpose
    loan_purpose TEXT NOT NULL,
    business_plan_url VARCHAR(255),

    -- Financial Calculations
    total_interest DECIMAL(15, 2),
    total_repayable DECIMAL(15, 2),
    amount_repaid DECIMAL(15, 2) DEFAULT 0.00,
    outstanding_balance DECIMAL(15, 2),
    overdue_amount DECIMAL(15, 2) DEFAULT 0.00,

    -- Status
    loan_status ENUM('pending', 'approved', 'disbursed', 'active', 'completed', 'defaulted', 'written_off') DEFAULT 'pending',
    repayment_status ENUM('on_track', 'overdue', 'defaulted', 'completed') DEFAULT 'on_track',
    days_overdue INT DEFAULT 0,

    -- Guarantors
    guarantor1_id INT,
    guarantor2_id INT,

    -- Approval Workflow
    approved_by INT,
    disbursed_by INT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (shg_group_id) REFERENCES shg_groups(id),
    FOREIGN KEY (member_id) REFERENCES shg_members(id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (guarantor1_id) REFERENCES shg_members(id),
    FOREIGN KEY (guarantor2_id) REFERENCES shg_members(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (disbursed_by) REFERENCES users(id),
    INDEX idx_loan_number (loan_number),
    INDEX idx_group (shg_group_id),
    INDEX idx_member (member_id),
    INDEX idx_status (loan_status),
    INDEX idx_repayment_status (repayment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loan_repayments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,

    -- Repayment Details
    repayment_date DATE NOT NULL,
    amount_paid DECIMAL(15, 2) NOT NULL,
    principal_paid DECIMAL(15, 2) NOT NULL,
    interest_paid DECIMAL(15, 2) NOT NULL,
    penalty_paid DECIMAL(10, 2) DEFAULT 0.00,

    -- Payment Method
    payment_method ENUM('cash', 'mpesa', 'bank_transfer', 'cheque') DEFAULT 'cash',
    payment_reference VARCHAR(100),
    receipt_number VARCHAR(50),

    -- Metadata
    recorded_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_loan (loan_id),
    INDEX idx_repayment_date (repayment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS savings_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    shg_group_id INT NOT NULL,
    member_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Account Details
    account_type ENUM('individual_savings', 'share_capital', 'emergency_fund', 'group_savings') DEFAULT 'individual_savings',
    opening_date DATE NOT NULL,
    opening_balance DECIMAL(15, 2) DEFAULT 0.00,
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    total_deposits DECIMAL(15, 2) DEFAULT 0.00,
    total_withdrawals DECIMAL(15, 2) DEFAULT 0.00,

    -- Status
    account_status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
    closure_date DATE,
    closure_reason TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (shg_group_id) REFERENCES shg_groups(id),
    FOREIGN KEY (member_id) REFERENCES shg_members(id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    INDEX idx_account_number (account_number),
    INDEX idx_group (shg_group_id),
    INDEX idx_member (member_id),
    INDEX idx_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS savings_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,

    -- Transaction Details
    transaction_date DATE NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'interest_credit', 'penalty', 'transfer') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,

    -- Payment Details
    payment_method ENUM('cash', 'mpesa', 'bank_transfer') DEFAULT 'cash',
    payment_reference VARCHAR(100),
    receipt_number VARCHAR(50),

    -- Related References
    meeting_id INT, -- If transaction occurred during a meeting

    -- Metadata
    description TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (account_id) REFERENCES savings_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (meeting_id) REFERENCES shg_meetings(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_account (account_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- SEEP MODULE: BUSINESS & ENTREPRENEURSHIP
-- ================================================

CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_code VARCHAR(50) UNIQUE NOT NULL,
    beneficiary_id INT NOT NULL,
    shg_member_id INT,

    -- Business Details
    business_name VARCHAR(200) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    sector VARCHAR(100), -- Agriculture, Retail, Service, Manufacturing, etc.
    registration_number VARCHAR(100),
    start_date DATE,

    -- Location
    county VARCHAR(100),
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    location_description TEXT,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),

    -- Business Performance
    initial_capital DECIMAL(15, 2),
    current_capital DECIMAL(15, 2),
    monthly_revenue DECIMAL(15, 2),
    monthly_expenses DECIMAL(15, 2),
    monthly_profit DECIMAL(15, 2),
    employees INT DEFAULT 0,

    -- Support Provided
    trainings_received TEXT,
    grants_received DECIMAL(15, 2) DEFAULT 0.00,
    loans_received DECIMAL(15, 2) DEFAULT 0.00,

    -- Status
    business_status ENUM('planning', 'active', 'growing', 'struggling', 'closed') DEFAULT 'planning',
    closure_date DATE,
    closure_reason TEXT,

    -- Metadata
    program_module_id INT,
    facilitator_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (shg_member_id) REFERENCES shg_members(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (facilitator_id) REFERENCES users(id),
    INDEX idx_business_code (business_code),
    INDEX idx_beneficiary (beneficiary_id),
    INDEX idx_status (business_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- GENDER & YOUTH MODULE: GBV CASE MANAGEMENT
-- ================================================

CREATE TABLE IF NOT EXISTS gbv_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,

    -- Survivor Information (Anonymous/Coded)
    survivor_code VARCHAR(50) UNIQUE NOT NULL, -- Anonymous identifier
    beneficiary_id INT, -- Optional link if survivor consents
    age_group ENUM('0-12', '13-17', '18-24', '25-35', '36-50', '51+') NOT NULL,
    gender ENUM('female', 'male', 'other') NOT NULL,

    -- Incident Details
    incident_date DATE,
    incident_type ENUM('physical_violence', 'sexual_violence', 'emotional_abuse', 'economic_abuse', 'harmful_practices', 'other') NOT NULL,
    incident_description TEXT, -- Non-sensitive summary
    location_type VARCHAR(100), -- Home, school, workplace, public space, etc.

    -- Case Management
    intake_date DATE NOT NULL,
    case_status ENUM('open', 'ongoing_support', 'referred', 'closed', 'follow_up') DEFAULT 'open',
    risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',

    -- Services Provided
    counseling_sessions INT DEFAULT 0,
    medical_referral BOOLEAN DEFAULT FALSE,
    legal_referral BOOLEAN DEFAULT FALSE,
    shelter_provided BOOLEAN DEFAULT FALSE,
    economic_support BOOLEAN DEFAULT FALSE,
    education_support BOOLEAN DEFAULT FALSE,

    -- Referrals
    referred_to TEXT, -- Organizations/services referred to
    referral_outcome TEXT,

    -- Follow-up
    last_contact_date DATE,
    next_followup_date DATE,
    case_closure_date DATE,
    closure_reason TEXT,

    -- Metadata (Access Restricted)
    program_module_id INT,
    case_worker_id INT, -- Assigned case worker
    created_by INT,
    notes TEXT, -- Encrypted/sensitive notes

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (case_worker_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_case_number (case_number),
    INDEX idx_survivor_code (survivor_code),
    INDEX idx_case_status (case_status),
    INDEX idx_risk_level (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gbv_case_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,

    -- Note Details
    note_date DATE NOT NULL,
    note_type ENUM('assessment', 'counseling', 'followup', 'referral', 'closure') NOT NULL,
    note_content TEXT NOT NULL, -- Sensitive/encrypted content

    -- Services Delivered
    services_provided TEXT,
    next_action TEXT,
    next_contact_date DATE,

    -- Metadata
    recorded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (case_id) REFERENCES gbv_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_case (case_id),
    INDEX idx_note_date (note_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- RELIEF MODULE: RELIEF DISTRIBUTION
-- ================================================

CREATE TABLE IF NOT EXISTS relief_distributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    distribution_code VARCHAR(50) UNIQUE NOT NULL,

    -- Distribution Details
    distribution_date DATE NOT NULL,
    program_module_id INT NOT NULL,
    distribution_type ENUM('food', 'nfis', 'cash', 'voucher', 'medical', 'shelter', 'education', 'other') NOT NULL,
    location VARCHAR(200) NOT NULL,
    ward VARCHAR(100),
    sub_county VARCHAR(100),
    county VARCHAR(100),

    -- Items Distributed
    item_description TEXT NOT NULL,
    quantity_distributed INT,
    unit_of_measure VARCHAR(50),
    total_value DECIMAL(15, 2),

    -- Recipients
    total_beneficiaries INT DEFAULT 0,
    male_beneficiaries INT DEFAULT 0,
    female_beneficiaries INT DEFAULT 0,
    children_beneficiaries INT DEFAULT 0, -- Under 18

    -- Funding
    donor VARCHAR(200),
    project_code VARCHAR(100),

    -- Verification
    distributed_by INT,
    verified_by INT,

    -- Metadata
    notes TEXT,
    distribution_report_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (distributed_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_distribution_code (distribution_code),
    INDEX idx_program_module (program_module_id),
    INDEX idx_distribution_date (distribution_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relief_beneficiaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    distribution_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Receipt Details
    received_date DATE NOT NULL,
    quantity_received DECIMAL(10, 2),
    receipt_number VARCHAR(50),
    signature_captured BOOLEAN DEFAULT FALSE,

    -- Feedback
    satisfaction_rating INT, -- 1-5 scale
    feedback TEXT,

    -- Metadata
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (distribution_id) REFERENCES relief_distributions(id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    UNIQUE KEY unique_recipient (distribution_id, beneficiary_id),
    INDEX idx_distribution (distribution_id),
    INDEX idx_beneficiary (beneficiary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- FOOD SECURITY MODULE: NUTRITION TRACKING
-- ================================================

CREATE TABLE IF NOT EXISTS nutrition_assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    beneficiary_id INT NOT NULL,
    household_id VARCHAR(50), -- Can group multiple beneficiaries

    -- Assessment Details
    assessment_date DATE NOT NULL,
    assessment_type ENUM('baseline', 'midline', 'endline', 'routine_monitoring') DEFAULT 'routine_monitoring',
    program_module_id INT NOT NULL,

    -- Household Diet Diversity Score (HDDS)
    cereals BOOLEAN DEFAULT FALSE,
    tubers BOOLEAN DEFAULT FALSE,
    vegetables BOOLEAN DEFAULT FALSE,
    fruits BOOLEAN DEFAULT FALSE,
    meat BOOLEAN DEFAULT FALSE,
    eggs BOOLEAN DEFAULT FALSE,
    fish BOOLEAN DEFAULT FALSE,
    legumes BOOLEAN DEFAULT FALSE,
    dairy BOOLEAN DEFAULT FALSE,
    oils_fats BOOLEAN DEFAULT FALSE,
    sugar BOOLEAN DEFAULT FALSE,
    condiments BOOLEAN DEFAULT FALSE,
    hdds_score INT, -- Count of food groups consumed

    -- Meal Frequency
    meals_per_day INT,
    children_meals_per_day INT,

    -- Food Security Status
    food_security_status ENUM('food_secure', 'mildly_insecure', 'moderately_insecure', 'severely_insecure') NOT NULL,
    hunger_score INT, -- Household Hunger Scale (HHS)

    -- Anthropometric Data (for children under 5)
    child_weight_kg DECIMAL(5, 2),
    child_height_cm DECIMAL(5, 2),
    muac_mm DECIMAL(5, 1), -- Mid-Upper Arm Circumference
    nutrition_status ENUM('normal', 'mam', 'sam', 'overweight'), -- MAM=Moderate Acute Malnutrition, SAM=Severe

    -- Interventions
    nutrition_education_received BOOLEAN DEFAULT FALSE,
    supplementary_feeding BOOLEAN DEFAULT FALSE,
    cash_transfer_received BOOLEAN DEFAULT FALSE,

    -- Metadata
    assessed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (assessed_by) REFERENCES users(id),
    INDEX idx_beneficiary (beneficiary_id),
    INDEX idx_assessment_date (assessment_date),
    INDEX idx_food_security (food_security_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- FOOD SECURITY MODULE: AGRICULTURE MONITORING
-- ================================================

CREATE TABLE IF NOT EXISTS agricultural_plots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_code VARCHAR(50) UNIQUE NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Plot Details
    plot_name VARCHAR(200),
    land_size_acres DECIMAL(10, 2) NOT NULL,
    land_ownership ENUM('owned', 'rented', 'communal', 'borrowed') DEFAULT 'owned',
    soil_type VARCHAR(100),
    water_source VARCHAR(100),

    -- Location (GIS)
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    village VARCHAR(100),
    gps_latitude DECIMAL(10, 8) NOT NULL,
    gps_longitude DECIMAL(11, 8) NOT NULL,
    gps_boundary JSON, -- Array of coordinates for plot boundary

    -- Crops & Practices
    main_crops TEXT, -- JSON array of crops
    intercropping BOOLEAN DEFAULT FALSE,
    irrigation_available BOOLEAN DEFAULT FALSE,
    climate_smart_practices TEXT, -- Conservation agriculture, mulching, etc.

    -- Agroforestry
    trees_planted INT DEFAULT 0,
    tree_species TEXT,
    soil_conservation_measures TEXT, -- Terracing, contour plowing, etc.

    -- Status
    program_module_id INT NOT NULL,
    facilitator_id INT,
    status ENUM('active', 'fallow', 'inactive') DEFAULT 'active',

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (facilitator_id) REFERENCES users(id),
    INDEX idx_plot_code (plot_code),
    INDEX idx_beneficiary (beneficiary_id),
    INDEX idx_location (county, sub_county, ward)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS crop_production (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_id INT NOT NULL,

    -- Season Details
    season VARCHAR(50) NOT NULL, -- Long rains, short rains, dry season, etc.
    season_year INT NOT NULL,
    planting_date DATE,
    harvest_date DATE,

    -- Crop Details
    crop_type VARCHAR(100) NOT NULL,
    crop_variety VARCHAR(100),
    land_area_acres DECIMAL(10, 2) NOT NULL,

    -- Inputs
    seed_source VARCHAR(100), -- Purchased, saved, distributed
    fertilizer_used BOOLEAN DEFAULT FALSE,
    fertilizer_type VARCHAR(100),
    pesticide_used BOOLEAN DEFAULT FALSE,

    -- Production
    expected_yield_kg DECIMAL(10, 2),
    actual_yield_kg DECIMAL(10, 2),
    yield_per_acre DECIMAL(10, 2),

    -- Post-Harvest
    quantity_consumed_kg DECIMAL(10, 2),
    quantity_sold_kg DECIMAL(10, 2),
    quantity_stored_kg DECIMAL(10, 2),
    revenue_generated DECIMAL(15, 2),

    -- Challenges
    pest_damage BOOLEAN DEFAULT FALSE,
    disease_damage BOOLEAN DEFAULT FALSE,
    drought_impact BOOLEAN DEFAULT FALSE,
    flood_impact BOOLEAN DEFAULT FALSE,
    challenges_description TEXT,

    -- Metadata
    program_module_id INT NOT NULL,
    recorded_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (plot_id) REFERENCES agricultural_plots(id) ON DELETE CASCADE,
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_plot (plot_id),
    INDEX idx_season (season_year, season),
    INDEX idx_crop (crop_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- COMMON: TRAININGS & CAPACITY BUILDING
-- ================================================

CREATE TABLE IF NOT EXISTS trainings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    training_code VARCHAR(50) UNIQUE NOT NULL,

    -- Training Details
    training_title VARCHAR(200) NOT NULL,
    training_type VARCHAR(100) NOT NULL, -- Financial literacy, business skills, agriculture, GBV awareness, etc.
    program_module_id INT NOT NULL,

    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT,
    venue VARCHAR(200),
    county VARCHAR(100),
    sub_county VARCHAR(100),

    -- Participants
    target_participants INT,
    actual_participants INT DEFAULT 0,
    male_participants INT DEFAULT 0,
    female_participants INT DEFAULT 0,
    youth_participants INT DEFAULT 0,

    -- Content
    training_objectives TEXT,
    topics_covered TEXT,
    materials_provided TEXT,

    -- Facilitators
    lead_facilitator_id INT,
    co_facilitators TEXT,

    -- Outcomes
    pre_test_average DECIMAL(5, 2),
    post_test_average DECIMAL(5, 2),
    satisfaction_rating DECIMAL(3, 2), -- Average rating from participants

    -- Metadata
    training_report_url VARCHAR(255),
    photos_url VARCHAR(255),
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (lead_facilitator_id) REFERENCES users(id),
    INDEX idx_training_code (training_code),
    INDEX idx_program_module (program_module_id),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS training_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    training_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    -- Attendance
    attended BOOLEAN DEFAULT TRUE,
    attendance_days INT DEFAULT 0,

    -- Assessment
    pre_test_score DECIMAL(5, 2),
    post_test_score DECIMAL(5, 2),
    certificate_issued BOOLEAN DEFAULT FALSE,

    -- Feedback
    satisfaction_rating INT, -- 1-5
    feedback TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    UNIQUE KEY unique_participant (training_id, beneficiary_id),
    INDEX idx_training (training_id),
    INDEX idx_beneficiary (beneficiary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Add GIS/GPS fields to existing activities table
-- ================================================

-- Add GPS coordinates to activities for field visits
ALTER TABLE activities
ADD COLUMN gps_latitude DECIMAL(10, 8) AFTER location_details,
ADD COLUMN gps_longitude DECIMAL(11, 8) AFTER gps_latitude,
ADD INDEX idx_gps (gps_latitude, gps_longitude);
