-- Migration: Create Finance and Resource Management Tables
-- Date: 2025-12-15
-- Description: Creates comprehensive tables for Finance and Resource Management modules

-- ================================================
-- FINANCE MANAGEMENT MODULE TABLES
-- ================================================

-- Program Budget Allocations
CREATE TABLE IF NOT EXISTS program_budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_module_id INT NOT NULL,
    sub_program_id INT,
    fiscal_year VARCHAR(10) NOT NULL, -- e.g., '2025', '2024-2025'

    -- Budget Details
    total_budget DECIMAL(15, 2) NOT NULL,
    allocated_budget DECIMAL(15, 2) DEFAULT 0.00,
    spent_budget DECIMAL(15, 2) DEFAULT 0.00,
    committed_budget DECIMAL(15, 2) DEFAULT 0.00, -- Approved but not yet spent
    remaining_budget DECIMAL(15, 2) GENERATED ALWAYS AS (total_budget - spent_budget - committed_budget) STORED,

    -- Budget Categories
    operational_budget DECIMAL(15, 2) DEFAULT 0.00,
    program_budget DECIMAL(15, 2) DEFAULT 0.00,
    capital_budget DECIMAL(15, 2) DEFAULT 0.00,

    -- Funding Source
    donor VARCHAR(200),
    funding_source VARCHAR(200),
    grant_number VARCHAR(100),

    -- Dates
    budget_start_date DATE NOT NULL,
    budget_end_date DATE NOT NULL,

    -- Status
    status ENUM('draft', 'submitted', 'approved', 'active', 'closed', 'exhausted') DEFAULT 'draft',
    approval_status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',

    -- Approval Workflow
    submitted_by INT,
    submitted_at TIMESTAMP NULL,
    approved_by INT,
    approved_at TIMESTAMP NULL,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (sub_program_id) REFERENCES programs(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_program_module (program_module_id),
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Component Budget Allocations (breakdown of program budgets)
CREATE TABLE IF NOT EXISTS component_budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_budget_id INT NOT NULL,
    component_id INT NOT NULL,

    -- Allocated Amount
    allocated_amount DECIMAL(15, 2) NOT NULL,
    spent_amount DECIMAL(15, 2) DEFAULT 0.00,
    committed_amount DECIMAL(15, 2) DEFAULT 0.00,
    remaining_amount DECIMAL(15, 2) GENERATED ALWAYS AS (allocated_amount - spent_amount - committed_amount) STORED,

    -- Budget Lines
    budget_line VARCHAR(200),
    budget_code VARCHAR(50),

    -- Status
    status ENUM('active', 'exhausted', 'frozen', 'reallocated') DEFAULT 'active',

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_budget_id) REFERENCES program_budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES components(id),
    INDEX idx_program_budget (program_budget_id),
    INDEX idx_component (component_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Transactions/Expenditures
CREATE TABLE IF NOT EXISTS financial_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,

    -- Budget References
    program_budget_id INT NOT NULL,
    component_budget_id INT,
    activity_id INT,

    -- Transaction Details
    transaction_date DATE NOT NULL,
    transaction_type ENUM('expenditure', 'commitment', 'reversal', 'adjustment', 'reimbursement') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KES',

    -- Expenditure Category
    expense_category VARCHAR(100) NOT NULL, -- Salaries, Training, Transport, Materials, etc.
    expense_subcategory VARCHAR(100),
    budget_line VARCHAR(200),

    -- Payment Details
    payment_method ENUM('cash', 'bank_transfer', 'mpesa', 'cheque', 'petty_cash') DEFAULT 'bank_transfer',
    payment_reference VARCHAR(100),
    receipt_number VARCHAR(100),
    invoice_number VARCHAR(100),

    -- Payee Information
    payee_name VARCHAR(200),
    payee_type ENUM('staff', 'vendor', 'beneficiary', 'contractor', 'service_provider', 'other'),
    payee_id_number VARCHAR(50),

    -- Supporting Documents
    receipt_url VARCHAR(255),
    invoice_url VARCHAR(255),
    approval_document_url VARCHAR(255),

    -- Description
    description TEXT NOT NULL,
    purpose TEXT,

    -- Approval Workflow
    approval_status ENUM('pending', 'approved', 'rejected', 'on_hold') DEFAULT 'pending',
    requested_by INT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    verified_by INT,
    verified_at TIMESTAMP NULL,

    -- Verification Status
    verification_status ENUM('pending', 'verified', 'flagged', 'audited') DEFAULT 'pending',
    verification_notes TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_budget_id) REFERENCES program_budgets(id),
    FOREIGN KEY (component_budget_id) REFERENCES component_budgets(id),
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_transaction_number (transaction_number),
    INDEX idx_program_budget (program_budget_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_approval_status (approval_status),
    INDEX idx_verification_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Finance Approvals (for budget requests and reallocations)
CREATE TABLE IF NOT EXISTS finance_approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    approval_number VARCHAR(50) UNIQUE NOT NULL,

    -- Request Details
    request_type ENUM('budget_allocation', 'budget_reallocation', 'expense_approval', 'advance_request', 'reimbursement') NOT NULL,
    program_budget_id INT,
    transaction_id INT,

    -- Amount Details
    requested_amount DECIMAL(15, 2) NOT NULL,
    approved_amount DECIMAL(15, 2),

    -- Request Information
    request_title VARCHAR(255) NOT NULL,
    request_description TEXT NOT NULL,
    justification TEXT,

    -- Supporting Documents
    supporting_document_url VARCHAR(255),

    -- Approval Workflow
    status ENUM('pending', 'under_review', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

    -- Requester
    requested_by INT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Approver(s)
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    approved_by INT,
    approved_at TIMESTAMP NULL,

    -- Rejection
    rejection_reason TEXT,

    -- Finance Team Notes
    finance_notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_budget_id) REFERENCES program_budgets(id),
    FOREIGN KEY (transaction_id) REFERENCES financial_transactions(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_approval_number (approval_number),
    INDEX idx_request_type (request_type),
    INDEX idx_status (status),
    INDEX idx_requested_at (requested_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budget Revisions History
CREATE TABLE IF NOT EXISTS budget_revisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_budget_id INT NOT NULL,

    -- Revision Details
    revision_number INT NOT NULL,
    revision_date DATE NOT NULL,
    revision_type ENUM('increase', 'decrease', 'reallocation', 'extension') NOT NULL,

    -- Amount Changes
    previous_total DECIMAL(15, 2) NOT NULL,
    new_total DECIMAL(15, 2) NOT NULL,
    adjustment_amount DECIMAL(15, 2) NOT NULL,

    -- Reason
    reason TEXT NOT NULL,
    justification TEXT,

    -- Approval
    requested_by INT NOT NULL,
    approved_by INT,
    approved_at TIMESTAMP NULL,

    -- Supporting Documents
    document_url VARCHAR(255),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (program_budget_id) REFERENCES program_budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_program_budget (program_budget_id),
    INDEX idx_revision_date (revision_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- RESOURCE MANAGEMENT MODULE TABLES
-- ================================================

-- Resource Types (Equipment, Vehicles, Facilities, etc.)
CREATE TABLE IF NOT EXISTS resource_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('equipment', 'vehicle', 'facility', 'material', 'technology', 'human_resource', 'other') NOT NULL,
    description TEXT,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_name_category (name, category),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource Inventory
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_code VARCHAR(50) UNIQUE NOT NULL,
    resource_type_id INT NOT NULL,

    -- Basic Information
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('equipment', 'vehicle', 'facility', 'material', 'technology', 'human_resource', 'other') NOT NULL,

    -- Acquisition Details
    acquisition_date DATE,
    acquisition_cost DECIMAL(15, 2),
    acquisition_method ENUM('purchase', 'donation', 'lease', 'grant', 'other'),
    supplier VARCHAR(200),

    -- Asset Details
    serial_number VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(100),

    -- Quantity and Units
    quantity INT DEFAULT 1,
    unit_of_measure VARCHAR(50), -- pieces, kg, liters, etc.

    -- Location and Assignment
    location VARCHAR(200),
    current_location VARCHAR(200),
    assigned_to_user INT,
    assigned_to_program INT,
    assignment_date DATE,

    -- Condition and Maintenance
    condition_status ENUM('excellent', 'good', 'fair', 'poor', 'damaged', 'under_repair') DEFAULT 'good',
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_frequency VARCHAR(50), -- e.g., 'monthly', 'quarterly', 'annually'

    -- Availability
    availability_status ENUM('available', 'in_use', 'reserved', 'under_maintenance', 'retired', 'lost', 'disposed') DEFAULT 'available',

    -- Financial
    current_value DECIMAL(15, 2),
    depreciation_rate DECIMAL(5, 2), -- Percentage per year

    -- Documentation
    photo_url VARCHAR(255),
    document_url VARCHAR(255),
    warranty_expiry_date DATE,

    -- Metadata
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (resource_type_id) REFERENCES resource_types(id),
    FOREIGN KEY (assigned_to_user) REFERENCES users(id),
    FOREIGN KEY (assigned_to_program) REFERENCES program_modules(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_resource_code (resource_code),
    INDEX idx_category (category),
    INDEX idx_availability (availability_status),
    INDEX idx_assigned_to_program (assigned_to_program)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource Requests/Allocations
CREATE TABLE IF NOT EXISTS resource_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,

    -- Request Details
    resource_id INT,
    resource_type_id INT, -- If requesting new resource

    -- Requester Information
    requested_by INT NOT NULL,
    program_module_id INT,
    activity_id INT,

    -- Request Details
    request_type ENUM('allocation', 'booking', 'purchase', 'maintenance', 'disposal') NOT NULL,
    quantity_requested INT DEFAULT 1,

    -- Purpose
    purpose TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days INT,

    -- Approval Workflow
    status ENUM('pending', 'approved', 'rejected', 'in_use', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

    -- Approval Chain
    approved_by INT,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,

    -- Fulfillment
    fulfilled_by INT,
    fulfilled_at TIMESTAMP NULL,

    -- Return (for bookings)
    expected_return_date DATE,
    actual_return_date DATE,
    return_condition ENUM('excellent', 'good', 'fair', 'poor', 'damaged'),
    return_notes TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (resource_id) REFERENCES resources(id),
    FOREIGN KEY (resource_type_id) REFERENCES resource_types(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (fulfilled_by) REFERENCES users(id),
    INDEX idx_request_number (request_number),
    INDEX idx_status (status),
    INDEX idx_resource (resource_id),
    INDEX idx_program_module (program_module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource Maintenance Records
CREATE TABLE IF NOT EXISTS resource_maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,

    -- Maintenance Details
    maintenance_date DATE NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'inspection', 'repair', 'upgrade') NOT NULL,

    -- Issue Description
    issue_description TEXT,
    work_performed TEXT NOT NULL,

    -- Service Provider
    service_provider VARCHAR(200),
    technician_name VARCHAR(200),

    -- Cost
    cost DECIMAL(10, 2),

    -- Downtime
    downtime_start DATETIME,
    downtime_end DATETIME,
    downtime_hours DECIMAL(5, 2),

    -- Parts Used
    parts_replaced TEXT,
    parts_cost DECIMAL(10, 2),

    -- Next Maintenance
    next_maintenance_date DATE,

    -- Documentation
    report_url VARCHAR(255),
    receipt_url VARCHAR(255),

    -- Metadata
    performed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_resource (resource_id),
    INDEX idx_maintenance_date (maintenance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Training and Capacity Building (moved from old capacity building module)
CREATE TABLE IF NOT EXISTS capacity_building_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_code VARCHAR(50) UNIQUE NOT NULL,

    -- Program Details
    program_name VARCHAR(200) NOT NULL,
    program_type ENUM('staff_training', 'volunteer_training', 'community_training', 'leadership_development', 'technical_skills', 'other') NOT NULL,
    target_audience VARCHAR(200),

    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_hours INT,

    -- Location
    venue VARCHAR(200),
    county VARCHAR(100),
    sub_county VARCHAR(100),

    -- Capacity
    target_participants INT,
    actual_participants INT DEFAULT 0,

    -- Budget
    budget_allocated DECIMAL(15, 2),
    budget_spent DECIMAL(15, 2) DEFAULT 0.00,

    -- Content
    objectives TEXT,
    topics_covered TEXT,
    materials_provided TEXT,

    -- Facilitators
    lead_facilitator_id INT,
    co_facilitators TEXT,

    -- Status
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',

    -- Outcomes
    satisfaction_rating DECIMAL(3, 2),
    impact_assessment TEXT,

    -- Documentation
    report_url VARCHAR(255),
    certificate_template_url VARCHAR(255),

    -- Metadata
    program_module_id INT,
    created_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (lead_facilitator_id) REFERENCES users(id),
    FOREIGN KEY (program_module_id) REFERENCES program_modules(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_program_code (program_code),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Training Participants
CREATE TABLE IF NOT EXISTS capacity_building_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    user_id INT,
    beneficiary_id INT,

    -- Participant Details (if not in system)
    participant_name VARCHAR(200),
    participant_email VARCHAR(100),
    participant_phone VARCHAR(20),
    organization VARCHAR(200),

    -- Attendance
    attended BOOLEAN DEFAULT TRUE,
    attendance_percentage DECIMAL(5, 2),

    -- Assessment
    pre_test_score DECIMAL(5, 2),
    post_test_score DECIMAL(5, 2),
    knowledge_gain DECIMAL(5, 2) GENERATED ALWAYS AS (post_test_score - pre_test_score) STORED,

    -- Certificate
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(50),
    certificate_url VARCHAR(255),

    -- Feedback
    satisfaction_rating INT, -- 1-5
    feedback TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (program_id) REFERENCES capacity_building_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    INDEX idx_program (program_id),
    INDEX idx_user (user_id),
    INDEX idx_beneficiary (beneficiary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default resource types
INSERT INTO resource_types (name, category, description) VALUES
('Desktop Computer', 'equipment', 'Desktop computers and workstations'),
('Laptop', 'equipment', 'Portable computers'),
('Printer', 'equipment', 'Printing devices'),
('Projector', 'equipment', 'Video projectors for presentations'),
('Vehicle - 4WD', 'vehicle', 'Four-wheel drive vehicles'),
('Vehicle - Motorcycle', 'vehicle', 'Motorcycles for field work'),
('Office Space', 'facility', 'Office facilities and spaces'),
('Training Hall', 'facility', 'Training and meeting halls'),
('Warehouse', 'facility', 'Storage facilities'),
('Office Furniture', 'material', 'Desks, chairs, cabinets'),
('Training Materials', 'material', 'Educational and training materials'),
('Software License', 'technology', 'Software and system licenses'),
('Mobile Devices', 'technology', 'Smartphones and tablets')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
