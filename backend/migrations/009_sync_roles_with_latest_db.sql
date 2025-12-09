-- Sync roles table with latest database structure
-- This ensures the roles table matches the production database dump

-- Update scope column to use the correct ENUM if needed
-- (This will fail gracefully if the column already has the right type)

-- Ensure all roles from the database dump exist
INSERT INTO roles (id, name, display_name, description, scope, level, created_at, updated_at) VALUES
(1,'system_admin','System Administrator','Full system access with all permissions','system',1,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(2,'me_director','M&E Director','Oversees all M&E activities and reporting','system',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(3,'me_manager','M&E Manager','Manages M&E data collection and analysis','module',3,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(4,'finance_officer','Finance Officer','Handles financial transactions and reporting','system',4,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(5,'report_viewer','Report Viewer','View-only access to reports and dashboards','system',6,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(6,'module_manager','Module Manager','Manages specific program modules','module',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(7,'module_coordinator','Module Coordinator','Coordinate activities within modules','module',4,'2025-11-27 18:31:40','2025-11-27 18:31:40'),
(8,'field_officer','Field Officer','Implements field activities and collects data','system',5,'2025-11-27 18:31:40','2025-12-09 04:17:10'),
(9,'verification_officer','Verification Officer','Manage verification and evidence','module',5,'2025-11-27 18:31:40','2025-11-27 18:31:40'),
(10,'data_entry_clerk','Data Entry Clerk','Basic data entry only','module',8,'2025-11-27 18:31:40','2025-11-27 18:31:40'),
(11,'module_viewer','Module Viewer','Read-only access to module data','module',9,'2025-11-27 18:31:40','2025-11-27 18:31:40'),
(13,'program_director','Program Director','Oversees entire programs and strategic planning','system',2,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(16,'finance_manager','Finance Manager','Manages budgets and financial tracking','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(17,'logistics_manager','Logistics Manager','Manages logistics and procurement','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(18,'program_manager','Program Manager','Manages program implementation','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(20,'me_officer','M&E Officer','Collects and validates M&E data','system',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(21,'data_analyst','Data Analyst','Analyzes data and generates reports','system',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(22,'procurement_officer','Procurement Officer','Manages procurement processes','system',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(23,'program_officer','Program Officer','Implements program activities','system',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(24,'technical_advisor','Technical Advisor','Provides technical guidance and support','system',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(26,'community_mobilizer','Community Mobilizer','Mobilizes communities and facilitates activities','system',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(27,'data_entry_officer','Data Entry Officer','Enters and validates field data','system',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(28,'enumerator','Enumerator','Conducts surveys and data collection','system',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(30,'approver','Approver','Reviews and approves activities and reports','module',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(31,'external_auditor','External Auditor','Audits program data and compliance','system',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(33,'gbv_specialist','GBV Specialist','Specialized in Gender-Based Violence programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(34,'nutrition_specialist','Nutrition Specialist','Specialized in Nutrition programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(35,'agriculture_specialist','Agriculture Specialist','Specialized in Agriculture programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(36,'relief_coordinator','Relief Coordinator','Coordinates relief and emergency response','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),
(37,'seep_coordinator','SEEP Coordinator','Coordinates SEEP economic empowerment activities','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level),
    updated_at = VALUES(updated_at);
