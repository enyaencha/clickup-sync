-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: me_clickup_system
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_audit_log`
--

DROP TABLE IF EXISTS `access_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_audit_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SELECT, INSERT, UPDATE, DELETE, LOGIN, etc.',
  `resource` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Table/resource accessed',
  `resource_id` int DEFAULT NULL COMMENT 'ID of the record accessed',
  `module_id` int DEFAULT NULL COMMENT 'Module context if applicable',
  `access_granted` tinyint(1) NOT NULL,
  `denial_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Reason if access denied',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `request_data` json DEFAULT NULL COMMENT 'Additional request metadata',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_action` (`user_id`,`action`),
  KEY `idx_resource` (`resource`,`resource_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_access_granted` (`access_granted`),
  KEY `idx_module` (`module_id`),
  CONSTRAINT `access_audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit log for access control and RLS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_audit_log`
--

LOCK TABLES `access_audit_log` WRITE;
/*!40000 ALTER TABLE `access_audit_log` DISABLE KEYS */;
INSERT INTO `access_audit_log` VALUES (1,1,'LOGIN','users',1,NULL,1,NULL,'192.168.109.119',NULL,NULL,'2026-01-06 12:41:59'),(2,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-08 06:34:07'),(3,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-08 12:33:12'),(4,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-08 13:08:25'),(5,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-08 17:53:00'),(6,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 04:32:27'),(7,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 04:33:13'),(8,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 05:43:02'),(9,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 06:35:30'),(10,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 06:46:28'),(11,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 06:47:52'),(12,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 19:39:18'),(13,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-09 20:18:10'),(14,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.126',NULL,NULL,'2026-01-13 09:23:05'),(15,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.234',NULL,NULL,'2026-01-13 09:25:52'),(16,2,'LOGIN','users',2,NULL,1,NULL,'192.168.72.234',NULL,NULL,'2026-01-13 09:30:21'),(17,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-13 09:53:08'),(18,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-13 10:31:01'),(19,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-13 12:15:10'),(20,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.126',NULL,NULL,'2026-01-13 17:32:27'),(21,2,'LOGIN','users',2,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-13 19:06:45'),(22,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-13 19:16:57'),(23,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-13 19:19:40'),(24,1,'LOGIN','users',1,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-14 07:44:33'),(25,2,'LOGIN','users',2,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-14 07:45:21'),(26,3,'LOGIN','users',3,NULL,1,NULL,'192.168.72.119',NULL,NULL,'2026-01-14 07:48:17'),(27,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 06:19:41'),(28,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 10:25:58'),(29,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 10:30:16'),(30,2,'LOGIN','users',2,NULL,1,NULL,'192.168.2.198',NULL,NULL,'2026-01-16 10:56:28'),(31,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 12:56:01'),(32,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 12:57:16'),(33,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-16 13:00:56'),(34,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-18 10:13:41'),(35,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-18 12:44:38'),(36,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-20 05:46:48'),(37,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 12:45:53'),(38,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:09:24'),(39,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:10:55'),(40,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:23:05'),(41,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:26:02'),(42,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:27:01'),(43,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:27:24'),(44,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:27:51'),(45,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:30:27'),(46,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:36:23'),(47,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:42:29'),(48,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:53:38'),(49,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 13:58:14'),(50,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 14:00:30'),(51,4,'LOGIN','users',4,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 14:04:28'),(52,4,'LOGIN','users',4,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 14:21:44'),(53,4,'LOGIN','users',4,NULL,0,'Invalid password','127.0.0.1',NULL,NULL,'2026-01-25 14:24:01'),(54,4,'LOGIN','users',4,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 14:24:12'),(55,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-25 14:29:46'),(56,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 05:29:53'),(57,4,'LOGIN','users',4,NULL,0,'Invalid password','127.0.0.1',NULL,NULL,'2026-01-28 05:33:20'),(58,4,'LOGIN','users',4,NULL,0,'Invalid password','127.0.0.1',NULL,NULL,'2026-01-28 05:33:25'),(59,4,'LOGIN','users',4,NULL,0,'Invalid password','127.0.0.1',NULL,NULL,'2026-01-28 05:33:34'),(60,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 05:34:22'),(61,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 05:39:11'),(62,4,'LOGIN','users',4,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 05:40:04'),(63,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 06:03:07'),(64,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 06:25:09'),(65,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-01-28 07:12:11'),(66,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-01 15:31:06'),(67,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-01 15:40:28'),(68,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-01 15:40:59'),(69,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-02 17:22:52'),(70,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-02 17:36:52'),(71,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2026-02-02 17:38:11');
/*!40000 ALTER TABLE `access_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_list_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('not-started','in-progress','completed','blocked','cancelled','on-track','at-risk','delayed','off-track','on-hold') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
  `progress_percentage` int DEFAULT '0',
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `component_id` int DEFAULT NULL,
  `activity_date` date DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `location_details` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_latitude` decimal(10,8) DEFAULT NULL,
  `gps_longitude` decimal(11,8) DEFAULT NULL,
  `parish` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_hours` int DEFAULT NULL,
  `facilitators` text COLLATE utf8mb4_unicode_ci,
  `staff_assigned` text COLLATE utf8mb4_unicode_ci,
  `target_beneficiaries` int DEFAULT NULL,
  `actual_beneficiaries` int DEFAULT '0',
  `beneficiary_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_allocated` decimal(10,2) DEFAULT NULL,
  `budget_spent` decimal(10,2) DEFAULT '0.00',
  `approval_status` enum('draft','submitted','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `priority` enum('low','normal','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `created_by` int DEFAULT NULL,
  `owned_by` int DEFAULT NULL COMMENT 'User who owns this record',
  `last_modified_by` int DEFAULT NULL COMMENT 'User who last modified',
  `status_override` tinyint(1) DEFAULT '0' COMMENT 'Manual override flag',
  `auto_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Auto-calculated status',
  `manual_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Manually set status',
  `status_reason` text COLLATE utf8mb4_unicode_ci COMMENT 'Explanation for status',
  `last_status_update` timestamp NULL DEFAULT NULL COMMENT 'Last status update',
  `risk_level` enum('none','low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `outcome_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Qualitative outcome description and results achieved',
  `challenges_faced` text COLLATE utf8mb4_unicode_ci COMMENT 'Challenges encountered during implementation',
  `lessons_learned` text COLLATE utf8mb4_unicode_ci COMMENT 'Key lessons learned from the activity',
  `recommendations` text COLLATE utf8mb4_unicode_ci COMMENT 'Recommendations for future activities',
  `immediate_objectives` text COLLATE utf8mb4_unicode_ci COMMENT 'Simple text description of activity immediate objectives',
  `expected_results` text COLLATE utf8mb4_unicode_ci COMMENT 'Expected results/deliverables from the activity',
  `module_specific_data` json DEFAULT NULL COMMENT 'JSON field for module-specific data (Finance, Resources, etc.)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_list_id` (`clickup_list_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_code` (`code`),
  KEY `idx_clickup_list` (`clickup_list_id`),
  KEY `idx_component_id` (`component_id`),
  KEY `idx_activity_date` (`activity_date`),
  KEY `idx_approval_status` (`approval_status`),
  KEY `idx_status` (`status`),
  KEY `idx_location_id` (`location_id`),
  KEY `idx_activities_created_by` (`created_by`),
  KEY `idx_activities_owned_by` (`owned_by`),
  KEY `idx_activities_module` (`component_id`),
  KEY `idx_gps` (`gps_latitude`,`gps_longitude`),
  KEY `idx_auto_status` (`auto_status`),
  KEY `idx_risk_level` (`risk_level`),
  KEY `idx_module_specific_data` ((cast(`module_specific_data` as char(255) charset utf8mb4))),
  CONSTRAINT `fk_activities_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_activities_subprogram` FOREIGN KEY (`project_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,1,'Prepare annual organizational budget','ACT-1767855465350','Prepare annual organizational budget',NULL,'2026-01-01','2026-01-08','not-started',100,'BETTY ZACHARY',NULL,'pending',NULL,'2026-01-08 06:57:45','2026-01-16 13:02:03',NULL,1,'2026-01-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,1200.00,1000.00,'approved','urgent',1,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2026-01-16 13:02:03','none','The budget is now ok and ready to be shared','Difficult in balancing the sheets \nNot able to account on some cash on previous year','This process should not wait until a year so that it is being done cuz there is alot to handle','The early and small small anlysis is better to prevent the challenges we experienced','Prepare annual organizational budget clearly','Come up with a clear budget for this year as soon as possible','{\"budget_line\": \"bl-2025-0001\", \"vendor_payee\": \"Director\", \"approval_level\": \"department\", \"invoice_number\": \"inv-00098\", \"payment_method\": \"bank_transfer\", \"receipt_number\": \"rcp-0008\", \"expected_amount\": \"1200\", \"expense_category\": \"program\", \"transaction_type\": \"expense\"}'),(2,1,'Develop project-specific budgets','ACT-1767855811695','Develop project-specific budgets',NULL,'2026-01-09','2026-01-15','completed',100,NULL,NULL,'pending',NULL,'2026-01-08 07:03:31','2026-01-16 08:26:29',NULL,1,'2026-01-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,200.00,0.00,'approved','high',1,NULL,NULL,0,'completed',NULL,NULL,'2026-01-16 08:26:29','none',NULL,NULL,NULL,NULL,NULL,NULL,'{\"budget_line\": \"bl-2025-0002\", \"vendor_payee\": \"Program\", \"approval_level\": \"director\", \"invoice_number\": \"inv-00099\", \"payment_method\": \"check\", \"receipt_number\": \"rcp-0009\", \"expected_amount\": \"1300\", \"expense_category\": \"program\", \"transaction_type\": \"advance\"}'),(3,1,'Align budgets with donor requirements','ACT-1767870756218','Align budgets with donor requirements',NULL,'2026-01-09','2026-01-12','completed',100,NULL,NULL,'pending',NULL,'2026-01-08 11:12:36','2026-01-14 10:28:51',NULL,1,'2026-01-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,1200.00,0.00,'approved','normal',1,NULL,NULL,0,'completed',NULL,NULL,'2026-01-14 10:28:51','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,1,'Budget approval and sign-off','ACT-1767893718215','Budget approval and sign-off',NULL,'2026-01-12','2026-01-12','completed',100,NULL,NULL,'pending',NULL,'2026-01-08 17:35:18','2026-01-16 08:33:22',NULL,1,'2026-01-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0.00,'approved','normal',2,NULL,NULL,0,'completed',NULL,NULL,'2026-01-16 08:33:22','none',NULL,NULL,NULL,NULL,NULL,NULL,'{\"budget_line\": \"\", \"vendor_payee\": \"\", \"approval_level\": \"department\", \"invoice_number\": \"\", \"payment_method\": \"bank_transfer\", \"receipt_number\": \"\", \"expected_amount\": \"\", \"expense_category\": \"program\", \"transaction_type\": \"expense\"}');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_beneficiaries`
--

DROP TABLE IF EXISTS `activity_beneficiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_beneficiaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `role` enum('participant','facilitator','observer','other') COLLATE utf8mb4_unicode_ci DEFAULT 'participant',
  `attended` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_link` (`activity_id`,`beneficiary_id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  CONSTRAINT `activity_beneficiaries_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_beneficiaries_ibfk_2` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Links Beneficiaries to Activities';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_beneficiaries`
--

LOCK TABLES `activity_beneficiaries` WRITE;
/*!40000 ALTER TABLE `activity_beneficiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_beneficiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_budget_requests`
--

DROP TABLE IF EXISTS `activity_budget_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_budget_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `request_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requested_amount` decimal(15,2) NOT NULL,
  `justification` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `breakdown` json DEFAULT NULL COMMENT 'Detailed budget breakdown',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `status` enum('draft','submitted','under_review','approved','rejected','returned_for_amendment') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `approved_amount` decimal(15,2) DEFAULT NULL,
  `finance_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Notes from finance team',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `amendment_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'What needs to be changed',
  `requested_by` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_number` (`request_number`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_status` (`status`),
  KEY `idx_requested_by` (`requested_by`),
  KEY `idx_reviewed_by` (`reviewed_by`),
  KEY `idx_abr_request_number` (`request_number`),
  CONSTRAINT `fk_abr_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_abr_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_abr_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Budget requests from teams for activities';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_budget_requests`
--

LOCK TABLES `activity_budget_requests` WRITE;
/*!40000 ALTER TABLE `activity_budget_requests` DISABLE KEYS */;
INSERT INTO `activity_budget_requests` VALUES (1,1,'BRQ-1767872962502-65',1200001.00,'This activity has to take place for proper budgeting this year ','{\"Other\": 230000, \"Venue\": 120000, \"Materials\": 50000, \"Personnel\": 100000, \"Transport\": 500000}','high','approved',1200000.00,'reviced\n\nREVISION: clear amount',NULL,NULL,2,3,'2026-01-08 11:49:22','2026-01-08 13:17:13','2026-01-08 11:49:22','2026-01-08 19:04:01',NULL),(2,3,'BRQ-1767873885794-270',1300000.00,'Need to start this activity as soon as possible','{\"Other\": 50000, \"Venue\": 300000, \"Materials\": 50000, \"Personnel\": 500000, \"Transport\": 100000, \"Donor rebursment\": 300000}','urgent','approved',1300000.00,'This ok and approved good luck. But we have removed 200k which will be added later \n\nREVISION: added the missing amount',NULL,NULL,2,1,'2026-01-08 18:12:41','2026-01-08 18:42:30','2026-01-08 12:04:45','2026-01-08 19:02:17',NULL),(3,4,'BRQ-1767893856123-859',1500000.00,'For budgeting purposes','{\"Other\": 50000, \"Venue\": 900000, \"Materials\": 0, \"Personnel\": 300000, \"Transport\": 250000}','high','approved',1500000.00,'Approved remember to provide attendance list and proof of usage ',NULL,NULL,2,1,'2026-01-08 17:37:36','2026-01-08 19:10:42','2026-01-08 17:37:36','2026-01-08 19:10:42',NULL),(4,2,'BRQ-1767939002993-46',500000.00,'need support','{\"Other\": 0, \"Venue\": 0, \"General\": 500000, \"Materials\": 0, \"Personnel\": 0, \"Transport\": 0}','high','approved',700000.00,'Approved and remember to account \n\nREVISION: More addition to support the added activity',NULL,NULL,2,3,'2026-01-09 06:10:03','2026-01-09 06:17:24','2026-01-09 06:10:03','2026-01-13 09:28:01',NULL),(5,1,'BRQ-1767939703036-329',700.00,'need for material paper rim high quality type ','{\"Other\": 0, \"Venue\": 0, \"Materials\": 700, \"Personnel\": 0, \"Transport\": 0}','urgent','rejected',NULL,NULL,'We have papers in the office please send the driver to pick it ',NULL,2,3,'2026-01-09 06:45:42','2026-01-09 06:54:12','2026-01-09 06:21:43','2026-01-09 06:54:12',NULL),(6,4,'BRQ-1768560490966-852',300000.00,'addition expenditure','{\"Other\": 0, \"Venue\": 0, \"Materials\": 0, \"Personnel\": 0, \"Transport\": 0, \"New sub activity\": 300000}','high','approved',300000.00,'approved',NULL,NULL,1,1,'2026-01-16 10:48:10','2026-01-16 10:58:13','2026-01-16 10:48:10','2026-01-16 10:58:13',NULL),(7,4,'BRQ-1768568099125-747',100000.00,'txt','{\"Other\": 20000, \"Venue\": 10000, \"Materials\": 10000, \"Personnel\": 10000, \"Transport\": 50000}','medium','submitted',NULL,NULL,NULL,NULL,1,NULL,'2026-01-16 12:58:37',NULL,'2026-01-16 12:54:59','2026-01-16 12:58:37',NULL),(8,4,'BRQ-1769960352402-780',300000.00,'routine','{\"Other\": 0, \"Venue\": 30000, \"Materials\": 20000, \"Personnel\": 100000, \"Transport\": 100000, \"extra activity\": 50000}','medium','submitted',NULL,NULL,NULL,NULL,1,NULL,'2026-02-01 15:41:29',NULL,'2026-02-01 15:39:12','2026-02-01 15:41:29',NULL),(9,4,'BRQ-1770053203962-855',500000.00,'txt','{\"Other\": 0, \"Venue\": 100000, \"Materials\": 100000, \"Personnel\": 200000, \"Transport\": 50000}','high','submitted',NULL,NULL,NULL,NULL,1,NULL,'2026-02-02 17:26:43',NULL,'2026-02-02 17:26:43','2026-02-02 17:26:43',NULL);
/*!40000 ALTER TABLE `activity_budget_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_budgets`
--

DROP TABLE IF EXISTS `activity_budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_budgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `allocated_budget` decimal(15,2) DEFAULT '0.00',
  `requested_budget` decimal(15,2) DEFAULT '0.00',
  `approved_budget` decimal(15,2) DEFAULT '0.00',
  `spent_budget` decimal(15,2) DEFAULT '0.00',
  `committed_budget` decimal(15,2) DEFAULT '0.00',
  `remaining_budget` decimal(15,2) GENERATED ALWAYS AS (((`approved_budget` - `spent_budget`) - `committed_budget`)) STORED,
  `budget_source` enum('program','sub_program','component','request') COLLATE utf8mb4_unicode_ci DEFAULT 'request',
  `last_allocation_date` date DEFAULT NULL,
  `last_updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activity_id` (`activity_id`),
  KEY `idx_activity` (`activity_id`),
  KEY `fk_ab_updated_by` (`last_updated_by`),
  CONSTRAINT `fk_ab_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ab_updated_by` FOREIGN KEY (`last_updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity-level budget tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_budgets`
--

LOCK TABLES `activity_budgets` WRITE;
/*!40000 ALTER TABLE `activity_budgets` DISABLE KEYS */;
INSERT INTO `activity_budgets` (`id`, `activity_id`, `allocated_budget`, `requested_budget`, `approved_budget`, `spent_budget`, `committed_budget`, `budget_source`, `last_allocation_date`, `last_updated_by`, `created_at`, `updated_at`) VALUES (1,1,2400000.00,0.00,2400000.00,0.00,0.00,'request','2026-01-08',1,'2026-01-08 13:11:36','2026-01-08 19:04:01'),(3,3,1300000.00,0.00,1300000.00,0.00,0.00,'request','2026-01-08',1,'2026-01-08 18:42:30','2026-01-08 19:02:17'),(4,4,1800000.00,0.00,1800000.00,100000.00,0.00,'request','2026-01-16',1,'2026-01-08 19:10:42','2026-01-16 10:58:14'),(5,2,700000.00,0.00,700000.00,0.00,0.00,'request','2026-01-13',1,'2026-01-09 06:17:24','2026-01-13 09:28:01');
/*!40000 ALTER TABLE `activity_budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_checklists`
--

DROP TABLE IF EXISTS `activity_checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_checklists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderindex` int DEFAULT '0',
  `clickup_checklist_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clickup_checklist_item_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `completed_by` int DEFAULT NULL,
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_completed` (`is_completed`),
  CONSTRAINT `activity_checklists_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity Checklists (Implementation Steps) - ClickUp Checklists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_checklists`
--

LOCK TABLES `activity_checklists` WRITE;
/*!40000 ALTER TABLE `activity_checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_expenditures`
--

DROP TABLE IF EXISTS `activity_expenditures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_expenditures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `budget_request_id` int DEFAULT NULL COMMENT 'Link to approved budget request',
  `expense_date` date NOT NULL,
  `expense_category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Materials, Personnel, Transport, etc',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `receipt_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('cash','bank_transfer','mobile_money','check','other') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `status` enum('pending','approved','rejected','reimbursed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `receipt_attachment_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `submitted_by` int NOT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_budget_request` (`budget_request_id`),
  KEY `idx_status` (`status`),
  KEY `idx_expense_date` (`expense_date`),
  KEY `idx_submitted_by` (`submitted_by`),
  KEY `fk_exp_approved_by` (`approved_by`),
  KEY `idx_expenditure_category` (`expense_category`),
  CONSTRAINT `fk_exp_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exp_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_exp_budget_request` FOREIGN KEY (`budget_request_id`) REFERENCES `activity_budget_requests` (`id`),
  CONSTRAINT `fk_exp_submitted_by` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity expenditure tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_expenditures`
--

LOCK TABLES `activity_expenditures` WRITE;
/*!40000 ALTER TABLE `activity_expenditures` DISABLE KEYS */;
INSERT INTO `activity_expenditures` VALUES (1,4,NULL,'2026-01-08','Transport','paid transport',100000.00,NULL,NULL,'bank_transfer','approved',NULL,'\n\nAPPROVAL NOTE: approved',2,1,'2026-01-16 09:34:10','2026-01-08 19:07:39','2026-01-16 09:34:10',NULL),(2,4,NULL,'2026-01-16','Personnel','Payed to persons 10 of them each having ksh: 10,000',100000.00,NULL,NULL,'mobile_money','approved',NULL,'\n\nAPPROVAL NOTE: approved',1,1,'2026-01-16 09:33:54','2026-01-16 08:35:13','2026-01-16 09:33:54',NULL);
/*!40000 ALTER TABLE `activity_expenditures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_expenses`
--

DROP TABLE IF EXISTS `activity_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'KES',
  `expense_date` date NOT NULL,
  `receipt_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_date` (`expense_date`),
  CONSTRAINT `activity_expenses_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity Expenses Tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_expenses`
--

LOCK TABLES `activity_expenses` WRITE;
/*!40000 ALTER TABLE `activity_expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_risks`
--

DROP TABLE IF EXISTS `activity_risks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_risks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `component_id` int DEFAULT NULL,
  `sub_program_id` int DEFAULT NULL,
  `risk_category` enum('financial','operational','external','resource','timeline','technical','political','security','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `risk_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `risk_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `risk_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `impact_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `probability` enum('low','medium','high') COLLATE utf8mb4_unicode_ci NOT NULL,
  `mitigation_strategy` text COLLATE utf8mb4_unicode_ci,
  `contingency_plan` text COLLATE utf8mb4_unicode_ci,
  `owner_id` int DEFAULT NULL,
  `status` enum('identified','active','mitigated','materialized','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'identified',
  `identified_date` date NOT NULL,
  `target_resolution_date` date DEFAULT NULL,
  `actual_resolution_date` date DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`),
  KEY `sub_program_id` (`sub_program_id`),
  KEY `idx_activity_risk` (`activity_id`),
  KEY `idx_risk_level` (`risk_level`),
  KEY `idx_risk_status` (`status`),
  CONSTRAINT `activity_risks_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_risks_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_risks_ibfk_3` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_risks`
--

LOCK TABLES `activity_risks` WRITE;
/*!40000 ALTER TABLE `activity_risks` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_risks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agricultural_plots`
--

DROP TABLE IF EXISTS `agricultural_plots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agricultural_plots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plot_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `beneficiary_id` int NOT NULL,
  `plot_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `land_size_acres` decimal(10,2) NOT NULL,
  `land_ownership` enum('owned','rented','communal','borrowed') COLLATE utf8mb4_unicode_ci DEFAULT 'owned',
  `soil_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `water_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_latitude` decimal(10,8) NOT NULL,
  `gps_longitude` decimal(11,8) NOT NULL,
  `gps_boundary` json DEFAULT NULL,
  `main_crops` text COLLATE utf8mb4_unicode_ci,
  `intercropping` tinyint(1) DEFAULT '0',
  `irrigation_available` tinyint(1) DEFAULT '0',
  `climate_smart_practices` text COLLATE utf8mb4_unicode_ci,
  `trees_planted` int DEFAULT '0',
  `tree_species` text COLLATE utf8mb4_unicode_ci,
  `soil_conservation_measures` text COLLATE utf8mb4_unicode_ci,
  `program_module_id` int NOT NULL,
  `facilitator_id` int DEFAULT NULL,
  `status` enum('active','fallow','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plot_code` (`plot_code`),
  KEY `program_module_id` (`program_module_id`),
  KEY `facilitator_id` (`facilitator_id`),
  KEY `idx_plot_code` (`plot_code`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  KEY `idx_location` (`county`,`sub_county`,`ward`),
  CONSTRAINT `agricultural_plots_ibfk_1` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `agricultural_plots_ibfk_2` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `agricultural_plots_ibfk_3` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agricultural_plots`
--

LOCK TABLES `agricultural_plots` WRITE;
/*!40000 ALTER TABLE `agricultural_plots` DISABLE KEYS */;
/*!40000 ALTER TABLE `agricultural_plots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assumptions`
--

DROP TABLE IF EXISTS `assumptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assumptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('module','sub_program','component','activity') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of entity',
  `entity_id` int NOT NULL COMMENT 'ID of the entity',
  `assumption_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `assumption_category` enum('external','internal','financial','political','social','environmental','technical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `likelihood` enum('very-low','low','medium','high','very-high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `impact` enum('very-low','low','medium','high','very-high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `risk_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Calculated from likelihood x impact',
  `status` enum('valid','invalid','partially-valid','needs-review') COLLATE utf8mb4_unicode_ci DEFAULT 'needs-review',
  `validation_date` date DEFAULT NULL,
  `validation_notes` text COLLATE utf8mb4_unicode_ci,
  `mitigation_strategy` text COLLATE utf8mb4_unicode_ci,
  `mitigation_status` enum('not-started','in-progress','implemented','not-needed') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
  `last_reviewed_date` date DEFAULT NULL,
  `next_review_date` date DEFAULT NULL,
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_entity_type_id` (`entity_type`,`entity_id`),
  KEY `idx_risk_level` (`risk_level`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assumptions`
--

LOCK TABLES `assumptions` WRITE;
/*!40000 ALTER TABLE `assumptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `assumptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('activity','goal','indicator','sub_program','comment','verification','component','module') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of entity this attachment is linked to',
  `entity_id` int NOT NULL,
  `clickup_attachment_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL COMMENT 'bytes',
  `attachment_type` enum('photo','document','attendance_sheet','training_material','distribution_list','report','other') COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  `description` text COLLATE utf8mb4_unicode_ci,
  `sync_status` enum('synced','pending','syncing','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_type` (`attachment_type`),
  KEY `idx_deleted_at` (`deleted_at`),
  KEY `idx_entity_lookup` (`entity_type`,`entity_id`,`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Attachments & Evidence - ClickUp Attachments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,'verification',2,NULL,'Screenshot from 2026-01-13 14-04-03.png','/uploads/Screenshot from 2026-01-13 14-04-03-1768305503545-396530514.png',NULL,'image/png',393812,'document','Screenshot from 2026-01-13 14-04-03.png','pending',NULL,1,'2026-01-13 11:58:23',NULL,NULL,'2026-01-13 11:58:23'),(2,'verification',2,NULL,'17683057902203465327710665185865.jpg','/uploads/17683057902203465327710665185865-1768305809454-364231252.jpg',NULL,'image/jpeg',1537290,'document','17683057902203465327710665185865.jpg','pending',NULL,1,'2026-01-13 12:03:30',NULL,NULL,'2026-01-13 12:03:30'),(3,'verification',1,NULL,'Mobius Mobius III 2021 White (12_20).jpg','/uploads/Mobius Mobius III 2021 White (12_20)-1768305874374-160106547.jpg',NULL,'image/jpeg',72792,'document','Mobius Mobius III 2021 White (12_20).jpg','pending',NULL,1,'2026-01-13 12:04:34',NULL,NULL,'2026-01-13 12:04:34'),(4,'verification',1,NULL,'Samsung tablet 8.7 inch Taifacare test.pdf','/uploads/Samsung tablet 8.7 inch Taifacare test-1768305898060-34333168.pdf',NULL,'application/pdf',1838851,'document','Samsung tablet 8.7 inch Taifacare test.pdf','pending',NULL,1,'2026-01-13 12:04:58',NULL,NULL,'2026-01-13 12:04:58'),(5,'verification',6,NULL,'Screenshot from 2026-01-13 13-54-04.png','/uploads/Screenshot from 2026-01-13 13-54-04-1768324403351-169775984.png',NULL,'image/png',328196,'document','4 files','pending',NULL,1,'2026-01-13 17:13:23',NULL,NULL,'2026-01-13 17:13:23'),(6,'verification',6,NULL,'Screenshot from 2026-01-13 14-04-03.png','/uploads/Screenshot from 2026-01-13 14-04-03-1768324403398-584830117.png',NULL,'image/png',393812,'document','4 files','pending',NULL,1,'2026-01-13 17:13:23',NULL,NULL,'2026-01-13 17:13:23'),(7,'verification',6,NULL,'Screenshot from 2026-01-13 12-57-22.png','/uploads/Screenshot from 2026-01-13 12-57-22-1768324403401-773298798.png',NULL,'image/png',376643,'document','4 files','pending',NULL,1,'2026-01-13 17:13:23',NULL,NULL,'2026-01-13 17:13:23'),(8,'verification',6,NULL,'Screenshot from 2026-01-13 12-58-03.png','/uploads/Screenshot from 2026-01-13 12-58-03-1768324403402-936766833.png',NULL,'image/png',381314,'document','4 files','pending',NULL,1,'2026-01-13 17:13:23',NULL,NULL,'2026-01-13 17:13:23'),(9,'verification',8,NULL,'Screenshot from 2026-01-13 13-54-04.png','/uploads/Screenshot from 2026-01-13 13-54-04-1768330316229-963807667.png',NULL,'image/png',328196,'document',NULL,'pending',NULL,1,'2026-01-13 18:51:56',NULL,NULL,'2026-01-13 18:51:56'),(10,'',4,NULL,'Screenshot from 2026-01-16 12-01-33.png','/uploads/Screenshot from 2026-01-16 12-01-33-1768556005003-805669122.png',NULL,'image/png',318575,'','Transaction receipt','pending',NULL,1,'2026-01-16 09:33:25',NULL,NULL,'2026-01-16 09:33:25'),(11,'',4,NULL,'Screenshot from 2026-01-16 11-52-36.png','/uploads/Screenshot from 2026-01-16 11-52-36-1768556005019-808793886.png',NULL,'image/png',416305,'','Transaction invoice','pending',NULL,1,'2026-01-16 09:33:25',NULL,NULL,'2026-01-16 09:33:25'),(12,'',4,NULL,'Screenshot from 2026-01-16 11-52-03.png','/uploads/Screenshot from 2026-01-16 11-52-03-1768556005031-908830156.png',NULL,'image/png',269366,'','Verification evidence','pending',NULL,1,'2026-01-16 09:33:25',NULL,NULL,'2026-01-16 09:33:25'),(13,'',5,NULL,'nyaencha_evans_qr.png','/uploads/nyaencha_evans_qr-1768561890477-722986495.png',NULL,'image/png',571,'','Transaction receipt','pending',NULL,1,'2026-01-16 11:11:30',NULL,NULL,'2026-01-16 11:11:30'),(14,'',5,NULL,'nyaencha_evans_qr.png','/uploads/nyaencha_evans_qr-1768561890491-979801586.png',NULL,'image/png',571,'','Transaction invoice','pending',NULL,1,'2026-01-16 11:11:30',NULL,NULL,'2026-01-16 11:11:30'),(15,'',5,NULL,'nyaencha_evans_qr.png','/uploads/nyaencha_evans_qr-1768561890505-711927886.png',NULL,'image/png',571,'','Verification evidence','pending',NULL,1,'2026-01-16 11:11:30',NULL,NULL,'2026-01-16 11:11:30');
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beneficiaries`
--

DROP TABLE IF EXISTS `beneficiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alternative_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_latitude` decimal(10,8) DEFAULT NULL,
  `gps_longitude` decimal(11,8) DEFAULT NULL,
  `household_size` int DEFAULT NULL,
  `household_head` tinyint(1) DEFAULT '0',
  `marital_status` enum('single','married','divorced','widowed','separated') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disability_status` enum('none','physical','visual','hearing','mental','multiple') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `disability_details` text COLLATE utf8mb4_unicode_ci,
  `vulnerability_category` enum('refugee','ovc','elderly','pwd','youth_at_risk','poor_household','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vulnerability_notes` text COLLATE utf8mb4_unicode_ci,
  `eligible_programs` json DEFAULT NULL,
  `current_programs` json DEFAULT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_date` date NOT NULL,
  `registered_by` int DEFAULT NULL,
  `program_module_id` int DEFAULT NULL,
  `status` enum('active','inactive','graduated','exited') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `exit_date` date DEFAULT NULL,
  `exit_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  UNIQUE KEY `id_number` (`id_number`),
  KEY `idx_registration_number` (`registration_number`),
  KEY `idx_program_module` (`program_module_id`),
  KEY `idx_gender` (`gender`),
  KEY `idx_vulnerability` (`vulnerability_category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaries`
--

LOCK TABLES `beneficiaries` WRITE;
/*!40000 ALTER TABLE `beneficiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `beneficiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_allocations`
--

DROP TABLE IF EXISTS `budget_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_allocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source_type` enum('program_budget','sub_program','component') COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` int NOT NULL COMMENT 'ID of source budget entity',
  `target_type` enum('sub_program','component','activity') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int NOT NULL COMMENT 'ID of target entity',
  `allocated_amount` decimal(15,2) NOT NULL,
  `allocation_date` date NOT NULL,
  `allocation_notes` text COLLATE utf8mb4_unicode_ci,
  `spent_amount` decimal(15,2) DEFAULT '0.00',
  `committed_amount` decimal(15,2) DEFAULT '0.00',
  `remaining_amount` decimal(15,2) GENERATED ALWAYS AS (((`allocated_amount` - `spent_amount`) - `committed_amount`)) STORED,
  `allocated_by` int NOT NULL,
  `status` enum('active','exhausted','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_source` (`source_type`,`source_id`),
  KEY `idx_target` (`target_type`,`target_id`),
  KEY `idx_allocated_by` (`allocated_by`),
  KEY `idx_ba_status` (`status`),
  KEY `idx_ba_allocation_date` (`allocation_date`),
  CONSTRAINT `fk_ba_allocated_by` FOREIGN KEY (`allocated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks budget allocations from program down to activity level';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_allocations`
--

LOCK TABLES `budget_allocations` WRITE;
/*!40000 ALTER TABLE `budget_allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `budget_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_revision_history`
--

DROP TABLE IF EXISTS `budget_revision_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_revision_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `budget_request_id` int NOT NULL,
  `previous_amount` decimal(15,2) NOT NULL,
  `new_amount` decimal(15,2) NOT NULL,
  `revision_reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `revised_by` int NOT NULL,
  `revised_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_budget_request` (`budget_request_id`),
  KEY `idx_revised_by` (`revised_by`),
  CONSTRAINT `fk_brh_budget_request` FOREIGN KEY (`budget_request_id`) REFERENCES `activity_budget_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_brh_revised_by` FOREIGN KEY (`revised_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Track all budget revisions after approval';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_revision_history`
--

LOCK TABLES `budget_revision_history` WRITE;
/*!40000 ALTER TABLE `budget_revision_history` DISABLE KEYS */;
INSERT INTO `budget_revision_history` VALUES (1,2,1100000.00,1300000.00,'added the missing amount',1,'2026-01-08 19:02:17'),(2,1,1200001.00,1200000.00,'clear amount',1,'2026-01-08 19:04:01'),(3,4,500000.00,700000.00,'More addition to support the added activity',1,'2026-01-13 09:28:01');
/*!40000 ALTER TABLE `budget_revision_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_revisions`
--

DROP TABLE IF EXISTS `budget_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_revisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_budget_id` int NOT NULL,
  `revision_number` int NOT NULL,
  `revision_date` date NOT NULL,
  `revision_type` enum('increase','decrease','reallocation','extension') COLLATE utf8mb4_unicode_ci NOT NULL,
  `previous_total` decimal(15,2) NOT NULL,
  `new_total` decimal(15,2) NOT NULL,
  `adjustment_amount` decimal(15,2) NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `justification` text COLLATE utf8mb4_unicode_ci,
  `requested_by` int NOT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requested_by` (`requested_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_program_budget` (`program_budget_id`),
  KEY `idx_revision_date` (`revision_date`),
  CONSTRAINT `budget_revisions_ibfk_1` FOREIGN KEY (`program_budget_id`) REFERENCES `program_budgets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `budget_revisions_ibfk_2` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `budget_revisions_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_revisions`
--

LOCK TABLES `budget_revisions` WRITE;
/*!40000 ALTER TABLE `budget_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `budget_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `businesses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `beneficiary_id` int NOT NULL,
  `shg_member_id` int DEFAULT NULL,
  `business_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sector` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_description` text COLLATE utf8mb4_unicode_ci,
  `gps_latitude` decimal(10,8) DEFAULT NULL,
  `gps_longitude` decimal(11,8) DEFAULT NULL,
  `initial_capital` decimal(15,2) DEFAULT NULL,
  `current_capital` decimal(15,2) DEFAULT NULL,
  `monthly_revenue` decimal(15,2) DEFAULT NULL,
  `monthly_expenses` decimal(15,2) DEFAULT NULL,
  `monthly_profit` decimal(15,2) DEFAULT NULL,
  `employees` int DEFAULT '0',
  `trainings_received` text COLLATE utf8mb4_unicode_ci,
  `grants_received` decimal(15,2) DEFAULT '0.00',
  `loans_received` decimal(15,2) DEFAULT '0.00',
  `business_status` enum('planning','active','growing','struggling','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'planning',
  `closure_date` date DEFAULT NULL,
  `closure_reason` text COLLATE utf8mb4_unicode_ci,
  `program_module_id` int DEFAULT NULL,
  `facilitator_id` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_code` (`business_code`),
  KEY `shg_member_id` (`shg_member_id`),
  KEY `program_module_id` (`program_module_id`),
  KEY `facilitator_id` (`facilitator_id`),
  KEY `idx_business_code` (`business_code`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  KEY `idx_status` (`business_status`),
  CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `businesses_ibfk_2` FOREIGN KEY (`shg_member_id`) REFERENCES `shg_members` (`id`),
  CONSTRAINT `businesses_ibfk_3` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `businesses_ibfk_4` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `capacity_building_participants`
--

DROP TABLE IF EXISTS `capacity_building_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `capacity_building_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `beneficiary_id` int DEFAULT NULL,
  `participant_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participant_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participant_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attended` tinyint(1) DEFAULT '1',
  `attendance_percentage` decimal(5,2) DEFAULT NULL,
  `pre_test_score` decimal(5,2) DEFAULT NULL,
  `post_test_score` decimal(5,2) DEFAULT NULL,
  `knowledge_gain` decimal(5,2) GENERATED ALWAYS AS ((`post_test_score` - `pre_test_score`)) STORED,
  `certificate_issued` tinyint(1) DEFAULT '0',
  `certificate_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificate_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `satisfaction_rating` int DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_program` (`program_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  CONSTRAINT `capacity_building_participants_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `capacity_building_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `capacity_building_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `capacity_building_participants_ibfk_3` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `capacity_building_participants`
--

LOCK TABLES `capacity_building_participants` WRITE;
/*!40000 ALTER TABLE `capacity_building_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `capacity_building_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `capacity_building_programs`
--

DROP TABLE IF EXISTS `capacity_building_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `capacity_building_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_type` enum('staff_training','volunteer_training','community_training','leadership_development','technical_skills','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_audience` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration_hours` int DEFAULT NULL,
  `venue` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_participants` int DEFAULT NULL,
  `actual_participants` int DEFAULT '0',
  `budget_allocated` decimal(15,2) DEFAULT NULL,
  `budget_spent` decimal(15,2) DEFAULT '0.00',
  `objectives` text COLLATE utf8mb4_unicode_ci,
  `topics_covered` text COLLATE utf8mb4_unicode_ci,
  `materials_provided` text COLLATE utf8mb4_unicode_ci,
  `lead_facilitator_id` int DEFAULT NULL,
  `co_facilitators` text COLLATE utf8mb4_unicode_ci,
  `status` enum('planned','ongoing','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'planned',
  `satisfaction_rating` decimal(3,2) DEFAULT NULL,
  `impact_assessment` text COLLATE utf8mb4_unicode_ci,
  `report_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificate_template_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `program_module_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_code` (`program_code`),
  KEY `lead_facilitator_id` (`lead_facilitator_id`),
  KEY `program_module_id` (`program_module_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_program_code` (`program_code`),
  KEY `idx_status` (`status`),
  KEY `idx_dates` (`start_date`,`end_date`),
  CONSTRAINT `capacity_building_programs_ibfk_1` FOREIGN KEY (`lead_facilitator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `capacity_building_programs_ibfk_2` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `capacity_building_programs_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `capacity_building_programs`
--

LOCK TABLES `capacity_building_programs` WRITE;
/*!40000 ALTER TABLE `capacity_building_programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `capacity_building_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clickup_mapping`
--

DROP TABLE IF EXISTS `clickup_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clickup_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_entity_type` enum('program','project','activity','task','indicator') COLLATE utf8mb4_unicode_ci NOT NULL,
  `local_entity_id` int NOT NULL,
  `clickup_entity_type` enum('space','folder','list','task','custom_field') COLLATE utf8mb4_unicode_ci NOT NULL,
  `clickup_entity_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mapping_status` enum('active','broken','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `last_verified_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_local` (`local_entity_type`,`local_entity_id`),
  UNIQUE KEY `unique_clickup` (`clickup_entity_type`,`clickup_entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clickup_mapping`
--

LOCK TABLES `clickup_mapping` WRITE;
/*!40000 ALTER TABLE `clickup_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `clickup_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('activity','goal','sub_program','component','approval','finance_approval','budget_request','checklist','expense','risk','resource_request') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `clickup_comment_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_type` enum('update','challenge','lesson_learned','approval_feedback','observation','general') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `user_id` int DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_status` enum('synced','pending','syncing','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(450) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_comment_id` (`clickup_comment_id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_type` (`comment_type`),
  KEY `idx_clickup` (`clickup_comment_id`),
  KEY `idx_parent_comment` (`parent_comment_id`),
  CONSTRAINT `fk_parent_comment` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Comments & Notes - ClickUp Comments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'budget_request',1,NULL,NULL,'The 200k unallocated is for what please','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 12:28:30','2026-01-08 12:28:30','1',NULL),(2,'budget_request',1,NULL,NULL,'Yes i will review and revert back','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 12:41:57','2026-01-08 12:41:57','2',NULL),(3,'budget_request',1,NULL,NULL,'ok thanks waiting','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 12:42:27','2026-01-08 12:42:27','1',NULL),(4,'budget_request',2,NULL,NULL,'Hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 13:04:45','2026-01-08 13:04:45','2',NULL),(5,'budget_request',2,NULL,NULL,'Yes ','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 13:05:18','2026-01-08 13:05:18','1',NULL),(6,'budget_request',2,NULL,NULL,'Hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 17:31:40','2026-01-08 17:31:40','3',NULL),(7,'budget_request',3,NULL,NULL,'revice the amount or change the venue is too expensive ','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 17:38:44','2026-01-08 17:38:44','3',NULL),(8,'budget_request',2,NULL,NULL,'Hello what can i change ','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 17:56:42','2026-01-08 17:56:42','2',NULL),(9,'budget_request',2,NULL,NULL,'The meeting might have to hold abit no funds available for now\n','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 17:58:59','2026-01-08 17:58:59','1',NULL),(10,'budget_request',3,NULL,NULL,'Ok this will be rectified and will revert back','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 17:59:34','2026-01-08 17:59:34','2',NULL),(11,'budget_request',2,NULL,NULL,'ok noted','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 18:00:14','2026-01-08 18:00:14','2',NULL),(12,'budget_request',2,NULL,NULL,'Hello have have amended the changes requested and have resubmited','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 18:13:40','2026-01-08 18:13:40','2',NULL),(13,'budget_request',2,NULL,NULL,'Thanks let  me recheck and approve ','general',NULL,NULL,NULL,'pending',NULL,'2026-01-08 18:14:20','2026-01-08 18:14:20','1',NULL),(14,'budget_request',2,NULL,NULL,'Hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:13:52','2026-01-09 05:13:52','3',NULL),(15,'budget_request',2,NULL,NULL,'Hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:15:01','2026-01-09 05:15:01','2',NULL),(16,'budget_request',2,NULL,NULL,'Is everything ok','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:15:52','2026-01-09 05:15:52','3',NULL),(17,'budget_request',2,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:31:15','2026-01-09 05:31:15','3',NULL),(18,'budget_request',2,NULL,NULL,'need help','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:34:08','2026-01-09 05:34:08','2',NULL),(19,'budget_request',2,NULL,NULL,'WhatsApp background: Beige (#e5ddd5) with subtle pattern\nMessage bubbles:\nYour messages: WhatsApp green (#dcf8c6) on right\nReceived messages: White on left\nFinance: Green border with 🏦 icon\nActivity: Blue accent with 👥 icon\nBetter UX:\nAuto-scroll to new messages\nRounded input (WhatsApp style)\nEnter = send, Shift+Enter = new line\nAuto-expanding textarea\nRead receipts (✓✓)\nTime stamps (HH:MM format)\nSide panel: Already uses ConversationSidePanel component that slides from the right (not a full overlay)\nThe conversation is now displayed in a side panel within the page, with clear color coding for easy identification of who\'s sending what - just like WhatsApp!','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:35:15','2026-01-09 05:35:15','2',NULL),(20,'budget_request',2,NULL,NULL,'What is this for','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:37:35','2026-01-09 05:37:35','3',NULL),(21,'budget_request',3,NULL,NULL,'Hi have amended','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 05:39:05','2026-01-09 05:39:05','2',NULL),(22,'budget_request',2,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:05:30','2026-01-09 06:05:30','3',NULL),(23,'budget_request',2,NULL,NULL,'hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:08:29','2026-01-09 06:08:29','2',NULL),(24,'budget_request',4,NULL,NULL,'Hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:10:19','2026-01-09 06:10:19','3',NULL),(25,'budget_request',4,NULL,NULL,'hi there','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:11:14','2026-01-09 06:11:14','2',NULL),(26,'budget_request',4,NULL,NULL,'Have sent this need approval','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:11:31','2026-01-09 06:11:31','2',NULL),(27,'budget_request',4,NULL,NULL,'support','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:11:58','2026-01-09 06:11:58','2',NULL),(28,'budget_request',4,NULL,NULL,'On it','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:16:21','2026-01-09 06:16:21','3',NULL),(29,'budget_request',4,NULL,NULL,'Thanks','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:16:51','2026-01-09 06:16:51','2',NULL),(30,'budget_request',5,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:48:43','2026-01-09 06:48:43','3',NULL),(31,'budget_request',5,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 06:49:28','2026-01-09 06:49:28','2',NULL),(32,'budget_request',5,NULL,NULL,'hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 07:24:46','2026-01-09 07:24:46','3',NULL),(33,'budget_request',3,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 09:09:42','2026-01-09 09:09:42','3',NULL),(34,'budget_request',5,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 19:45:28','2026-01-09 19:45:28','3',NULL),(35,'budget_request',4,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 19:52:37','2026-01-09 19:52:37','3',NULL),(36,'budget_request',3,NULL,NULL,'fine','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 19:54:44','2026-01-09 19:54:44','3',NULL),(37,'budget_request',4,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 20:10:36','2026-01-09 20:10:36','3',NULL),(38,'budget_request',4,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 20:11:39','2026-01-09 20:11:39','3',NULL),(39,'budget_request',2,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 20:19:44','2026-01-09 20:19:44','2',NULL),(40,'budget_request',2,NULL,NULL,'hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-09 21:02:08','2026-01-09 21:02:08','2',NULL),(41,'budget_request',4,NULL,NULL,'hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-13 10:47:46','2026-01-13 10:47:46','1',NULL),(42,'budget_request',3,NULL,NULL,'Hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-13 11:25:36','2026-01-13 11:25:36','1',NULL),(43,'budget_request',6,NULL,NULL,'Hi ','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 10:49:05','2026-01-16 10:49:05','1',NULL),(44,'budget_request',6,NULL,NULL,'Hey hello','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 10:56:55','2026-01-16 10:56:55','2',NULL),(45,'budget_request',6,NULL,NULL,'seen working on it','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 10:57:29','2026-01-16 10:57:29','1',NULL),(46,'budget_request',6,NULL,NULL,'Ok','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 10:58:33','2026-01-16 10:58:33','2',NULL),(47,'budget_request',7,NULL,NULL,'Hello please 20k remaining','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 12:56:46','2026-01-16 12:56:46','3',NULL),(48,'budget_request',7,NULL,NULL,'Please return to me','general',NULL,NULL,NULL,'pending',NULL,'2026-01-16 12:57:49','2026-01-16 12:57:49','2',NULL),(49,'resource_request',2,NULL,NULL,'Please consider sharing this resource with FWE team since you going on the same route','general',NULL,NULL,NULL,'pending',NULL,'2026-01-18 12:15:23','2026-01-18 12:15:23','1',NULL),(50,'resource_request',6,NULL,NULL,'Hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-18 12:52:28','2026-01-18 12:52:28','1',NULL),(51,'resource_request',6,NULL,NULL,'Yes hi','general',NULL,NULL,NULL,'pending',NULL,'2026-01-18 12:53:17','2026-01-18 12:53:17','2',NULL),(52,'budget_request',9,NULL,NULL,'Hi amend the budget','general',NULL,NULL,NULL,'pending',NULL,'2026-02-02 17:27:40','2026-02-02 17:27:40','1',NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component_budgets`
--

DROP TABLE IF EXISTS `component_budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_budgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_budget_id` int NOT NULL,
  `component_id` int DEFAULT NULL,
  `allocated_amount` decimal(15,2) NOT NULL,
  `spent_amount` decimal(15,2) DEFAULT '0.00',
  `committed_amount` decimal(15,2) DEFAULT '0.00',
  `remaining_amount` decimal(15,2) GENERATED ALWAYS AS (((`allocated_amount` - `spent_amount`) - `committed_amount`)) STORED,
  `budget_line` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','exhausted','frozen','reallocated') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_program_budget` (`program_budget_id`),
  KEY `idx_component` (`component_id`),
  CONSTRAINT `component_budgets_ibfk_1` FOREIGN KEY (`program_budget_id`) REFERENCES `program_budgets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `component_budgets_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_budgets`
--

LOCK TABLES `component_budgets` WRITE;
/*!40000 ALTER TABLE `component_budgets` DISABLE KEYS */;
/*!40000 ALTER TABLE `component_budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crop_production`
--

DROP TABLE IF EXISTS `crop_production`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crop_production` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plot_id` int NOT NULL,
  `season` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `season_year` int NOT NULL,
  `planting_date` date DEFAULT NULL,
  `harvest_date` date DEFAULT NULL,
  `crop_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `crop_variety` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `land_area_acres` decimal(10,2) NOT NULL,
  `seed_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fertilizer_used` tinyint(1) DEFAULT '0',
  `fertilizer_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pesticide_used` tinyint(1) DEFAULT '0',
  `expected_yield_kg` decimal(10,2) DEFAULT NULL,
  `actual_yield_kg` decimal(10,2) DEFAULT NULL,
  `yield_per_acre` decimal(10,2) DEFAULT NULL,
  `quantity_consumed_kg` decimal(10,2) DEFAULT NULL,
  `quantity_sold_kg` decimal(10,2) DEFAULT NULL,
  `quantity_stored_kg` decimal(10,2) DEFAULT NULL,
  `revenue_generated` decimal(15,2) DEFAULT NULL,
  `pest_damage` tinyint(1) DEFAULT '0',
  `disease_damage` tinyint(1) DEFAULT '0',
  `drought_impact` tinyint(1) DEFAULT '0',
  `flood_impact` tinyint(1) DEFAULT '0',
  `challenges_description` text COLLATE utf8mb4_unicode_ci,
  `program_module_id` int NOT NULL,
  `recorded_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_module_id` (`program_module_id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_plot` (`plot_id`),
  KEY `idx_season` (`season_year`,`season`),
  KEY `idx_crop` (`crop_type`),
  CONSTRAINT `crop_production_ibfk_1` FOREIGN KEY (`plot_id`) REFERENCES `agricultural_plots` (`id`) ON DELETE CASCADE,
  CONSTRAINT `crop_production_ibfk_2` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `crop_production_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crop_production`
--

LOCK TABLES `crop_production` WRITE;
/*!40000 ALTER TABLE `crop_production` DISABLE KEYS */;
/*!40000 ALTER TABLE `crop_production` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_approvals`
--

DROP TABLE IF EXISTS `finance_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `approval_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_type` enum('budget_allocation','budget_reallocation','expense_approval','advance_request','reimbursement') COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_budget_id` int DEFAULT NULL,
  `transaction_id` int DEFAULT NULL,
  `requested_amount` decimal(15,2) NOT NULL,
  `approved_amount` decimal(15,2) DEFAULT NULL,
  `request_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `justification` text COLLATE utf8mb4_unicode_ci,
  `supporting_document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','under_review','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `requested_by` int NOT NULL,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `finance_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `approval_number` (`approval_number`),
  KEY `program_budget_id` (`program_budget_id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `requested_by` (`requested_by`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_approval_number` (`approval_number`),
  KEY `idx_request_type` (`request_type`),
  KEY `idx_status` (`status`),
  KEY `idx_requested_at` (`requested_at`),
  CONSTRAINT `finance_approvals_ibfk_1` FOREIGN KEY (`program_budget_id`) REFERENCES `program_budgets` (`id`),
  CONSTRAINT `finance_approvals_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `financial_transactions` (`id`),
  CONSTRAINT `finance_approvals_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `finance_approvals_ibfk_4` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `finance_approvals_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_approvals`
--

LOCK TABLES `finance_approvals` WRITE;
/*!40000 ALTER TABLE `finance_approvals` DISABLE KEYS */;
INSERT INTO `finance_approvals` VALUES (1,'FIN-1767935103494-1','budget_allocation',1,NULL,320000000.00,320000000.00,'Budget Allocation - Finance Management FY 2026','Program budget request for Finance Management. Total budget: KES 320000000.00',NULL,NULL,'approved','medium',1,'2026-01-09 05:05:03',NULL,NULL,3,'2026-01-09 05:05:03',NULL,'This ok within the budget','2026-01-09 05:05:03','2026-01-09 05:05:03',NULL),(2,'FIN-1768548536964-2','',1,2,12000.00,12000.00,'Transaction - reimbursement - Test finance','Transaction TXN-1768548536909-572 on 2026-01-16 for KES 12,000.','to pay for activity done ',NULL,'approved','medium',1,'2026-01-16 07:28:56',NULL,NULL,1,'2026-01-16 07:29:42',NULL,'This is ok ','2026-01-16 07:28:56','2026-01-16 07:29:42',NULL),(3,'FIN-1768549261676-3','',1,3,13500.00,13500.00,'Transaction - reimbursement - Unknown Payee','Transaction TXN-1768549261672-969 on 2026-01-16 for KES 13,500.','Transaction requires approval.',NULL,'approved','medium',1,'2026-01-16 07:41:01',NULL,NULL,1,'2026-01-16 07:41:48',NULL,'PAYED TO AND RECEIVED BY THE RECIPIENT','2026-01-16 07:41:01','2026-01-16 07:41:48',NULL),(4,'FIN-1768556004965-4','',1,4,900000.00,900000.00,'Transaction - expense - Unknown Payee','Transaction TXN-1768556004957-865 on 2026-01-16 for KES 900,000.','Transaction requires approval.',NULL,'approved','medium',1,'2026-01-16 09:33:24',NULL,NULL,1,'2026-01-16 09:34:26',NULL,'approved','2026-01-16 09:33:24','2026-01-16 09:34:26',NULL),(5,'FIN-1768561890460-5','',1,5,500000.00,NULL,'Transaction - expense - Test finance','Transaction TXN-1768561890401-156 on 2026-01-16 for KES 500,000.','Transaction requires approval.',NULL,'pending','medium',1,'2026-01-16 11:11:30',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-16 11:11:30','2026-01-16 11:11:30',NULL),(6,'FIN-1769346300699-2','budget_allocation',2,NULL,500000000.00,500000000.00,'Budget Allocation - Socio-Economic Empowerment FY 2026','Program budget request for Socio-Economic Empowerment - Fiscal Year 2026. Total budget: KES 500,000,000','Budget allocation for Socio-Economic Empowerment operations and activities',NULL,'approved','medium',1,'2026-01-25 13:05:00',NULL,NULL,1,'2026-01-25 13:05:22',NULL,'this valid','2026-01-25 13:05:00','2026-01-25 13:05:22',NULL);
/*!40000 ALTER TABLE `finance_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_transactions`
--

DROP TABLE IF EXISTS `financial_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_budget_id` int NOT NULL,
  `component_budget_id` int DEFAULT NULL,
  `activity_id` int DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `transaction_type` enum('expenditure','commitment','reversal','adjustment','reimbursement') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'KES',
  `expense_category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expense_subcategory` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_line` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('cash','bank_transfer','mpesa','cheque','petty_cash') COLLATE utf8mb4_unicode_ci DEFAULT 'bank_transfer',
  `payment_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payee_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payee_type` enum('staff','vendor','beneficiary','contractor','service_provider','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payee_id_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `approval_status` enum('pending','approved','rejected','on_hold') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `requested_by` int NOT NULL,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `verified_by` int DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verification_status` enum('pending','verified','flagged','audited') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verification_notes` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_number` (`transaction_number`),
  KEY `component_budget_id` (`component_budget_id`),
  KEY `activity_id` (`activity_id`),
  KEY `requested_by` (`requested_by`),
  KEY `approved_by` (`approved_by`),
  KEY `verified_by` (`verified_by`),
  KEY `idx_transaction_number` (`transaction_number`),
  KEY `idx_program_budget` (`program_budget_id`),
  KEY `idx_transaction_date` (`transaction_date`),
  KEY `idx_approval_status` (`approval_status`),
  KEY `idx_verification_status` (`verification_status`),
  CONSTRAINT `financial_transactions_ibfk_1` FOREIGN KEY (`program_budget_id`) REFERENCES `program_budgets` (`id`),
  CONSTRAINT `financial_transactions_ibfk_2` FOREIGN KEY (`component_budget_id`) REFERENCES `component_budgets` (`id`),
  CONSTRAINT `financial_transactions_ibfk_3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `financial_transactions_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `financial_transactions_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `financial_transactions_ibfk_6` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_transactions`
--

LOCK TABLES `financial_transactions` WRITE;
/*!40000 ALTER TABLE `financial_transactions` DISABLE KEYS */;
INSERT INTO `financial_transactions` VALUES (1,'TXN-1768545343178-821',1,NULL,NULL,'2026-01-16','',500000.00,'KES','program','Budget analysis','bl-2026-0001','bank_transfer','TRX003','rcp-00010','inv-00099','Test finance','vendor','A0T12344575',NULL,NULL,NULL,'given out','for the activity done ','pending',1,'2026-01-16 07:31:43',NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2026-01-16 06:35:43','2026-01-16 07:32:58',NULL),(2,'TXN-1768548536909-572',1,NULL,NULL,'2026-01-16','reimbursement',12000.00,'KES','program','Budget analysis','bl-2025-0001','bank_transfer','TRX004','rcp-00084','inv-00099','Test finance','','A0T12344575',NULL,NULL,NULL,'To individual','to pay for activity done ','pending',1,'2026-01-16 07:28:56',NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2026-01-16 07:28:56','2026-01-16 07:28:56',NULL),(3,'TXN-1768549261672-969',1,NULL,NULL,'2026-01-16','reimbursement',13500.00,'KES','program','Activity ','bl-2025-0002','','URT8767HJJJ','','','','','',NULL,NULL,NULL,'','','pending',1,'2026-01-16 07:41:01',NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2026-01-16 07:41:01','2026-01-16 07:41:01',NULL),(4,'TXN-1768556004957-865',1,NULL,4,'2026-01-16','',900000.00,'KES','program','','Venue','bank_transfer','','','','','','','/uploads/Screenshot from 2026-01-16 12-01-33-1768556005003-805669122.png','/uploads/Screenshot from 2026-01-16 11-52-36-1768556005019-808793886.png','/uploads/Screenshot from 2026-01-16 11-52-03-1768556005031-908830156.png','','','pending',1,'2026-01-16 09:33:24',NULL,NULL,NULL,NULL,'pending','',NULL,'2026-01-16 09:33:24','2026-01-16 09:33:25',NULL),(5,'TXN-1768561890401-156',1,NULL,2,'2026-01-16','',500000.00,'KES','program','','Materials','bank_transfer','banktransfer','rcp-0008776y','','Test finance','vendor','A0T12344575786t','/uploads/nyaencha_evans_qr-1768561890477-722986495.png','/uploads/nyaencha_evans_qr-1768561890491-979801586.png','/uploads/nyaencha_evans_qr-1768561890505-711927886.png','','','pending',1,'2026-01-16 11:11:30',NULL,NULL,NULL,NULL,'pending','',NULL,'2026-01-16 11:11:30','2026-01-16 11:11:30',NULL);
/*!40000 ALTER TABLE `financial_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gbv_case_notes`
--

DROP TABLE IF EXISTS `gbv_case_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gbv_case_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `note_date` date NOT NULL,
  `note_type` enum('assessment','counseling','followup','referral','closure') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note_content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `services_provided` text COLLATE utf8mb4_unicode_ci,
  `next_action` text COLLATE utf8mb4_unicode_ci,
  `next_contact_date` date DEFAULT NULL,
  `recorded_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_case` (`case_id`),
  KEY `idx_note_date` (`note_date`),
  CONSTRAINT `gbv_case_notes_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `gbv_cases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gbv_case_notes_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gbv_case_notes`
--

LOCK TABLES `gbv_case_notes` WRITE;
/*!40000 ALTER TABLE `gbv_case_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gbv_case_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gbv_cases`
--

DROP TABLE IF EXISTS `gbv_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gbv_cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `survivor_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `beneficiary_id` int DEFAULT NULL,
  `survivor_age_group` enum('0-12','13-17','18-24','25-35','36-50','51+') COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('female','male','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `incident_date` date DEFAULT NULL,
  `incident_type` enum('physical_violence','sexual_violence','emotional_abuse','economic_abuse','harmful_practices','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `incident_description` text COLLATE utf8mb4_unicode_ci,
  `incident_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intake_date` date NOT NULL,
  `case_status` enum('open','ongoing_support','referred','closed','follow_up') COLLATE utf8mb4_unicode_ci DEFAULT 'open',
  `risk_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `counseling_sessions` int DEFAULT '0',
  `medical_referral` tinyint(1) DEFAULT '0',
  `legal_referral` tinyint(1) DEFAULT '0',
  `shelter_provided` tinyint(1) DEFAULT '0',
  `economic_support` tinyint(1) DEFAULT '0',
  `education_support` tinyint(1) DEFAULT '0',
  `referred_to` text COLLATE utf8mb4_unicode_ci,
  `referral_outcome` text COLLATE utf8mb4_unicode_ci,
  `last_contact_date` date DEFAULT NULL,
  `next_followup_date` date DEFAULT NULL,
  `case_closure_date` date DEFAULT NULL,
  `closure_reason` text COLLATE utf8mb4_unicode_ci,
  `program_module_id` int DEFAULT NULL,
  `case_worker_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `consent_obtained` text COLLATE utf8mb4_unicode_ci,
  `referral_source` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age_group` enum('0-12','13-17','18-24','25-35','36-50','51+') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_number` (`case_number`),
  UNIQUE KEY `survivor_code` (`survivor_code`),
  KEY `beneficiary_id` (`beneficiary_id`),
  KEY `program_module_id` (`program_module_id`),
  KEY `case_worker_id` (`case_worker_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_case_number` (`case_number`),
  KEY `idx_survivor_code` (`survivor_code`),
  KEY `idx_case_status` (`case_status`),
  KEY `idx_risk_level` (`risk_level`),
  CONSTRAINT `gbv_cases_ibfk_1` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `gbv_cases_ibfk_2` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `gbv_cases_ibfk_3` FOREIGN KEY (`case_worker_id`) REFERENCES `users` (`id`),
  CONSTRAINT `gbv_cases_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gbv_cases`
--

LOCK TABLES `gbv_cases` WRITE;
/*!40000 ALTER TABLE `gbv_cases` DISABLE KEYS */;
/*!40000 ALTER TABLE `gbv_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal_categories`
--

DROP TABLE IF EXISTS `goal_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goal_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `period` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., Annual 2025, Q1 2025',
  `clickup_goal_folder_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_goal_folder_id` (`clickup_goal_folder_id`),
  KEY `idx_organization` (`organization_id`),
  CONSTRAINT `goal_categories_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Goal Categories (Organizational Objectives) - ClickUp Goal Folders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal_categories`
--

LOCK TABLES `goal_categories` WRITE;
/*!40000 ALTER TABLE `goal_categories` DISABLE KEYS */;
INSERT INTO `goal_categories` VALUES (1,1,'Poverty Reduction','Initiatives focused on reducing poverty and improving livelihoods','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(2,1,'Food Security & Nutrition','Programs ensuring access to nutritious food and combating hunger','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(3,1,'Health & Well-being','Health services, disease prevention, and health system strengthening','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(4,1,'Quality Education','Access to quality education and learning opportunities','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(5,1,'Gender Equality','Promoting gender equality and empowering women and girls','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(6,1,'WASH','Water, Sanitation, and Hygiene programs','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(7,1,'Economic Growth','Decent work, economic opportunities, and sustainable economic growth','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(8,1,'Infrastructure Development','Basic infrastructure and resilient communities','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(9,1,'Peace & Justice','Peacebuilding, justice, and strong institutions','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(10,1,'Climate Action','Climate change mitigation and adaptation','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(11,1,'Protection','Child protection, GBV prevention, and refugee support','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(12,1,'Community Empowerment','Building community capacity and resilience','Annual 2026',NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15');
/*!40000 ALTER TABLE `goal_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicator_activity_links`
--

DROP TABLE IF EXISTS `indicator_activity_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicator_activity_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `indicator_id` int NOT NULL,
  `activity_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_link` (`indicator_id`,`activity_id`),
  KEY `idx_indicator` (`indicator_id`),
  KEY `idx_activity` (`activity_id`),
  CONSTRAINT `indicator_activity_links_ibfk_1` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE,
  CONSTRAINT `indicator_activity_links_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Links Activities to Indicators for Auto-Tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicator_activity_links`
--

LOCK TABLES `indicator_activity_links` WRITE;
/*!40000 ALTER TABLE `indicator_activity_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicator_activity_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicator_values`
--

DROP TABLE IF EXISTS `indicator_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicator_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `indicator_id` int NOT NULL,
  `measured_value` decimal(15,2) NOT NULL,
  `measurement_date` date NOT NULL,
  `achievement_at_time` decimal(5,2) DEFAULT NULL,
  `variance_at_time` decimal(15,2) DEFAULT NULL,
  `data_source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `verified_by` int DEFAULT NULL,
  `verified_date` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `recorded_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_indicator_date` (`indicator_id`,`measurement_date`),
  KEY `idx_measurement_date` (`measurement_date`),
  CONSTRAINT `indicator_values_ibfk_1` FOREIGN KEY (`indicator_id`) REFERENCES `me_indicators` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicator_values`
--

LOCK TABLES `indicator_values` WRITE;
/*!40000 ALTER TABLE `indicator_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicator_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicators`
--

DROP TABLE IF EXISTS `indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goal_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_target_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicator_type` enum('numeric','financial','binary','activity_linked') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_value` decimal(15,2) DEFAULT NULL,
  `current_value` decimal(15,2) DEFAULT '0.00',
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., farmers, households, children',
  `target_amount` decimal(15,2) DEFAULT NULL,
  `current_amount` decimal(15,2) DEFAULT '0.00',
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'KES',
  `is_completed` tinyint(1) DEFAULT '0' COMMENT 'For yes/no indicators',
  `linked_activities_count` int DEFAULT '0',
  `completed_activities_count` int DEFAULT '0',
  `progress_percentage` int DEFAULT '0',
  `tracking_method` enum('manual','automatic') COLLATE utf8mb4_unicode_ci DEFAULT 'manual',
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_target_id` (`clickup_target_id`),
  KEY `idx_goal` (`goal_id`),
  KEY `idx_type` (`indicator_type`),
  KEY `idx_clickup` (`clickup_target_id`),
  CONSTRAINT `indicators_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `strategic_goals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `indicators_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Indicators/Targets (Measurable Key Results) - ClickUp Targets';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicators`
--

LOCK TABLES `indicators` WRITE;
/*!40000 ALTER TABLE `indicators` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_repayments`
--

DROP TABLE IF EXISTS `loan_repayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_repayments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `loan_id` int NOT NULL,
  `repayment_date` date NOT NULL,
  `amount_paid` decimal(15,2) NOT NULL,
  `principal_paid` decimal(15,2) NOT NULL,
  `interest_paid` decimal(15,2) NOT NULL,
  `penalty_paid` decimal(10,2) DEFAULT '0.00',
  `payment_method` enum('cash','mpesa','bank_transfer','cheque') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `payment_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recorded_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_loan` (`loan_id`),
  KEY `idx_repayment_date` (`repayment_date`),
  CONSTRAINT `loan_repayments_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loan_repayments_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_repayments`
--

LOCK TABLES `loan_repayments` WRITE;
/*!40000 ALTER TABLE `loan_repayments` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_repayments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `loan_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shg_group_id` int NOT NULL,
  `member_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `loan_type` enum('group_loan','individual_loan','emergency_loan','business_loan') COLLATE utf8mb4_unicode_ci DEFAULT 'individual_loan',
  `loan_amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_tenure_months` int NOT NULL,
  `repayment_frequency` enum('weekly','bi-weekly','monthly') COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `application_date` date NOT NULL,
  `approval_date` date DEFAULT NULL,
  `disbursement_date` date DEFAULT NULL,
  `expected_completion_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `loan_purpose` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_plan_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_interest` decimal(15,2) DEFAULT NULL,
  `total_repayable` decimal(15,2) DEFAULT NULL,
  `amount_repaid` decimal(15,2) DEFAULT '0.00',
  `outstanding_balance` decimal(15,2) DEFAULT NULL,
  `overdue_amount` decimal(15,2) DEFAULT '0.00',
  `loan_status` enum('pending','approved','disbursed','active','completed','defaulted','written_off') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `repayment_status` enum('on_track','overdue','defaulted','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'on_track',
  `days_overdue` int DEFAULT '0',
  `guarantor1_id` int DEFAULT NULL,
  `guarantor2_id` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `disbursed_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_number` (`loan_number`),
  KEY `beneficiary_id` (`beneficiary_id`),
  KEY `guarantor1_id` (`guarantor1_id`),
  KEY `guarantor2_id` (`guarantor2_id`),
  KEY `approved_by` (`approved_by`),
  KEY `disbursed_by` (`disbursed_by`),
  KEY `idx_loan_number` (`loan_number`),
  KEY `idx_group` (`shg_group_id`),
  KEY `idx_member` (`member_id`),
  KEY `idx_status` (`loan_status`),
  KEY `idx_repayment_status` (`repayment_status`),
  CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`shg_group_id`) REFERENCES `shg_groups` (`id`),
  CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `shg_members` (`id`),
  CONSTRAINT `loans_ibfk_3` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `loans_ibfk_4` FOREIGN KEY (`guarantor1_id`) REFERENCES `shg_members` (`id`),
  CONSTRAINT `loans_ibfk_5` FOREIGN KEY (`guarantor2_id`) REFERENCES `shg_members` (`id`),
  CONSTRAINT `loans_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `loans_ibfk_7` FOREIGN KEY (`disbursed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('country','county','sub_county','ward','parish') COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL COMMENT 'For hierarchical structure',
  `coordinates` json DEFAULT NULL COMMENT 'GPS coordinates',
  `boundary_data` json DEFAULT NULL COMMENT 'Polygon/area definition',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Geographic Locations (Hierarchical)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Kenya','country',NULL,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(2,'Nairobi','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(3,'Mombasa','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(4,'Kisumu','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(5,'Nakuru','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(6,'Kiambu','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(7,'Machakos','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(8,'Kajiado','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(9,'Embu','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(10,'Kirinyaga','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(11,'Murang\'a','county',1,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(12,'Westlands','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(13,'Dagoretti North','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(14,'Dagoretti South','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(15,'Langata','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(16,'Kibra','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(17,'Roysambu','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(18,'Kasarani','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(19,'Ruaraka','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(20,'Embakasi South','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(21,'Embakasi North','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(22,'Embakasi Central','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(23,'Embakasi East','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(24,'Embakasi West','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(25,'Makadara','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(26,'Kamukunji','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(27,'Starehe','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(28,'Mathare','sub_county',2,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(29,'Laini Saba','ward',16,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(30,'Lindi','ward',16,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(31,'Makina','ward',16,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(32,'Woodley/Kenyatta Golf Course','ward',16,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(33,'Sarang\'ombe','ward',16,NULL,NULL,1,'2026-01-08 11:26:15','2026-01-08 11:26:15');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `me_indicators`
--

DROP TABLE IF EXISTS `me_indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `me_indicators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `activity_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('output','outcome','impact','process') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_of_measure` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `baseline_value` decimal(15,2) DEFAULT NULL,
  `target_value` decimal(15,2) NOT NULL,
  `current_value` decimal(15,2) DEFAULT '0.00',
  `collection_frequency` enum('daily','weekly','monthly','quarterly','annually') COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `data_source` text COLLATE utf8mb4_unicode_ci,
  `verification_method` text COLLATE utf8mb4_unicode_ci,
  `disaggregation` json DEFAULT NULL,
  `clickup_custom_field_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `module_id` int DEFAULT NULL COMMENT 'Link to program_modules table',
  `sub_program_id` int DEFAULT NULL COMMENT 'Link to sub_programs table',
  `component_id` int DEFAULT NULL COMMENT 'Link to project_components table',
  `baseline_date` date DEFAULT NULL COMMENT 'Date when baseline was measured',
  `target_date` date DEFAULT NULL COMMENT 'Target achievement date',
  `last_measured_date` date DEFAULT NULL COMMENT 'Last measurement date',
  `next_measurement_date` date DEFAULT NULL COMMENT 'Next scheduled measurement',
  `status` enum('on-track','at-risk','off-track','not-started') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started' COMMENT 'Current status',
  `achievement_percentage` decimal(5,2) DEFAULT '0.00' COMMENT 'Progress towards target',
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Person responsible for indicator',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes',
  `created_by` int DEFAULT NULL COMMENT 'User who created this record',
  `owned_by` int DEFAULT NULL COMMENT 'User who owns this record',
  `last_modified_by` int DEFAULT NULL COMMENT 'User who last modified',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `variance` decimal(15,2) DEFAULT '0.00' COMMENT 'current_value - target_value',
  `performance_status` enum('not-started','on-track','at-risk','off-track','achieved','exceeded') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started' COMMENT 'Performance status',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `activity_id` (`activity_id`),
  KEY `idx_program` (`program_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_code` (`code`),
  KEY `idx_module` (`module_id`),
  KEY `idx_sub_program` (`sub_program_id`),
  KEY `idx_component` (`component_id`),
  KEY `idx_deleted` (`deleted_at`),
  KEY `idx_me_indicators_created_by` (`created_by`),
  KEY `idx_me_indicators_owned_by` (`owned_by`),
  KEY `idx_performance_status` (`performance_status`),
  KEY `idx_variance` (`variance`),
  CONSTRAINT `fk_me_indicators_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_me_indicators_module` FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_me_indicators_sub_program` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_indicators`
--

LOCK TABLES `me_indicators` WRITE;
/*!40000 ALTER TABLE `me_indicators` DISABLE KEYS */;
INSERT INTO `me_indicators` VALUES (1,NULL,NULL,NULL,'Number of beneficiaries reached','SEED-MODULE-001','Total number of beneficiaries reached through Capacity Building','impact','','people',0.00,5000.00,6000.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2026-01-05 08:36:27',5,NULL,NULL,'2024-12-29','2025-12-28',NULL,NULL,'on-track',100.00,'Project Manager','Q1 progress on track',NULL,NULL,NULL,NULL,-3750.00,'not-started'),(2,NULL,NULL,NULL,'Training sessions completed','SEED-MODULE-002','Number of training sessions delivered under Capacity Building','output','','sessionszz',0.00,50.00,0.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-12-09 15:19:32',5,NULL,NULL,'2024-12-29','2025-12-28',NULL,NULL,'not-started',0.00,'Training Coordinator','Ahead of schedule in regional offices',NULL,NULL,NULL,NULL,-50.00,'not-started'),(3,NULL,NULL,NULL,'Satisfaction rate','SEED-MODULE-003','Beneficiary satisfaction rate for Capacity Building','outcome','Hts','percentage',65.00,85.00,84.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-12-09 15:19:32',5,NULL,NULL,'2025-11-24','2025-11-24',NULL,NULL,'on-track',98.82,'M&E Officer','Need to improve service delivery in some areas',NULL,NULL,NULL,NULL,-1.00,'not-started'),(4,NULL,NULL,NULL,'test','code','','output','test','test',200.00,400.00,1.00,'monthly','','',NULL,NULL,1,'2025-11-27 05:45:36','2025-12-09 15:19:32',5,NULL,NULL,'0000-00-00','2025-11-22',NULL,NULL,'off-track',0.25,'Peterson James',NULL,NULL,NULL,NULL,NULL,-399.00,'not-started'),(5,NULL,NULL,NULL,'customer care service','ccs12','how the staff interact and engage with our clients','output','health','people',2.50,5.00,1.50,'monthly','clients','review forms',NULL,NULL,1,'2025-11-27 06:08:49','2025-12-09 15:19:32',NULL,19,NULL,'2025-10-27','2025-11-27',NULL,NULL,'off-track',30.00,'customer relations manager',NULL,NULL,NULL,NULL,NULL,-3.50,'not-started'),(6,NULL,NULL,NULL,'success of the training','sot 34','if the training is having any positive impact to the community','outcome','education','%',30.00,100.00,40.00,'monthly','trainees','list of the attendees',NULL,NULL,1,'2025-11-27 06:20:29','2025-12-09 15:19:32',NULL,21,NULL,'2025-09-27','2025-12-27',NULL,NULL,'off-track',40.00,'M&E',NULL,NULL,NULL,NULL,NULL,-60.00,'not-started'),(7,NULL,NULL,6,'Community healt','ch-ooo2','test','output','health','people',100.00,200.00,150.00,'daily',NULL,NULL,NULL,NULL,1,'2025-11-27 07:47:26','2025-12-09 15:19:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',75.00,'Training team',NULL,NULL,NULL,NULL,NULL,-50.00,'not-started'),(8,NULL,NULL,NULL,'Number oF participant Trained','NPT-001','','output','Health','People',400.00,499.98,350.00,'daily','Attendance sheet','Physical attendance list',NULL,NULL,1,'2025-12-06 15:25:51','2025-12-09 15:19:32',5,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'at-risk',70.00,'Abel',NULL,NULL,NULL,NULL,NULL,-149.98,'not-started'),(9,NULL,NULL,24,'Refugee Tailoring Skills Training Acquired','rft-002','test if the skills were acquired','outcome','Education','Skill %',50.00,100.00,20.00,'daily','Assessments','Interview ',NULL,NULL,1,'2025-12-09 15:45:47','2025-12-11 05:35:00',NULL,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'off-track',20.00,'SEEP team',NULL,NULL,NULL,NULL,NULL,0.00,'not-started'),(10,NULL,NULL,24,'Refugee Tailoring Skills Training are acqured to the target','TCS-234','objective ','impact','Education','People',200.00,200.00,200.00,'daily',NULL,NULL,NULL,NULL,1,'2025-12-10 03:04:28','2025-12-10 03:04:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',100.00,'Jaiden Test',NULL,NULL,NULL,NULL,NULL,0.00,'not-started'),(11,6,NULL,NULL,'Test indicator','IND-001','Test indicator','impact','Finance','%',50.00,80.00,70.00,'monthly','Report ','Data from the report',NULL,NULL,1,'2026-01-14 12:09:52','2026-01-14 12:29:15',6,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'on-track',87.50,'Test user',NULL,NULL,NULL,NULL,NULL,0.00,'not-started'),(12,NULL,NULL,4,'Activity Test Indicator','ATI-001','Activity test indicator','output','Funds','% Budget',0.00,99.99,40.00,'daily','Budget booklet','The report from the budget booklet',NULL,NULL,1,'2026-01-14 12:14:14','2026-01-14 12:36:48',NULL,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'off-track',40.00,'Finance Team ',NULL,NULL,NULL,NULL,NULL,0.00,'not-started');
/*!40000 ALTER TABLE `me_indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `me_reports`
--

DROP TABLE IF EXISTS `me_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `me_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `report_type` enum('monthly','quarterly','annual','ad-hoc','donor') COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `content` json DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_format` enum('pdf','excel','word','json') COLLATE utf8mb4_unicode_ci DEFAULT 'pdf',
  `status` enum('draft','pending-review','approved','published') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `generated_by` int DEFAULT NULL,
  `generated_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `idx_program` (`program_id`),
  KEY `idx_type` (`report_type`),
  CONSTRAINT `me_reports_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_reports_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_reports`
--

LOCK TABLES `me_reports` WRITE;
/*!40000 ALTER TABLE `me_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `me_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `me_results`
--

DROP TABLE IF EXISTS `me_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `me_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `indicator_id` int NOT NULL,
  `reporting_period_start` date NOT NULL,
  `reporting_period_end` date NOT NULL,
  `value` decimal(15,2) NOT NULL,
  `disaggregation` json DEFAULT NULL,
  `data_collector` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection_date` date NOT NULL,
  `verification_status` enum('pending','verified','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verified_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `measurement_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'How measurement was taken',
  `verified_date` date DEFAULT NULL COMMENT 'Date of verification',
  PRIMARY KEY (`id`),
  KEY `idx_indicator` (`indicator_id`),
  KEY `idx_period` (`reporting_period_start`,`reporting_period_end`),
  CONSTRAINT `me_results_ibfk_1` FOREIGN KEY (`indicator_id`) REFERENCES `me_indicators` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_results`
--

LOCK TABLES `me_results` WRITE;
/*!40000 ALTER TABLE `me_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `me_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `means_of_verification`
--

DROP TABLE IF EXISTS `means_of_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `means_of_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('module','sub_program','component','activity','indicator') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of entity',
  `entity_id` int NOT NULL COMMENT 'ID of the entity',
  `verification_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Field reports, GPS data, Photos',
  `description` text COLLATE utf8mb4_unicode_ci,
  `evidence_type` enum('document','photo','video','survey','report','database','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'File path or URL',
  `document_date` date DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected','needs-update') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verified_by` int DEFAULT NULL,
  `verified_date` date DEFAULT NULL,
  `verification_notes` text COLLATE utf8mb4_unicode_ci,
  `collection_frequency` enum('daily','weekly','monthly','quarterly','annual','ad-hoc') COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `owned_by` int DEFAULT NULL COMMENT 'User who owns this record',
  `last_modified_by` int DEFAULT NULL COMMENT 'User who last modified',
  PRIMARY KEY (`id`),
  KEY `idx_entity_type_id` (`entity_type`,`entity_id`),
  KEY `idx_evidence_type` (`evidence_type`),
  KEY `idx_status` (`verification_status`),
  KEY `idx_deleted` (`deleted_at`),
  KEY `idx_mov_created_by` (`created_by`),
  KEY `idx_mov_owned_by` (`owned_by`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `means_of_verification`
--

LOCK TABLES `means_of_verification` WRITE;
/*!40000 ALTER TABLE `means_of_verification` DISABLE KEYS */;
INSERT INTO `means_of_verification` VALUES (1,'activity',1,'Budget book','the activity was complete by signing in the budget book','document','budget book',NULL,'2026-01-07','rejected',1,'2026-01-08','the book is not explicit correct','','Manager Ted','All is given out','2026-01-08 07:34:41','2026-01-08 08:36:38',NULL,NULL,NULL,NULL),(2,'activity',1,'activity minutes','minates recorded during activity','document','Activity minutes',NULL,'2026-01-08','verified',1,'2026-01-08','Accepted','','Manager Tedd',NULL,'2026-01-08 07:37:32','2026-01-08 08:36:15',NULL,NULL,NULL,NULL),(3,'activity',4,'Test','Test','document','Test',NULL,'2026-01-13','pending',NULL,NULL,NULL,'','Test person','Test','2026-01-13 12:11:11','2026-01-13 12:11:11',NULL,NULL,NULL,NULL),(4,'activity',1,'Testz','Testz','photo','Tesz',NULL,'2026-01-13','verified',1,'2026-01-14','ok','','Tesz',NULL,'2026-01-13 12:13:24','2026-01-14 12:21:09',NULL,NULL,NULL,NULL),(5,'activity',1,'ttt','ttt','document','ttt',NULL,'2026-01-13','rejected',1,'2026-01-14','redo','',NULL,NULL,'2026-01-13 12:14:36','2026-01-14 12:20:58',NULL,NULL,NULL,NULL),(6,'activity',4,'ddd','ddd','document','ddd',NULL,'2026-01-13','verified',1,'2026-01-14','ok','','ddd',NULL,'2026-01-13 12:16:23','2026-01-14 12:20:41',NULL,NULL,NULL,NULL),(7,'activity',1,'gggg','report','report','report',NULL,'2026-01-13','rejected',1,'2026-01-14','proper name','','Reporter','test','2026-01-13 17:17:15','2026-01-14 12:20:22',NULL,NULL,NULL,NULL),(8,'activity',4,'interview','interview','','interview',NULL,'2026-01-13','verified',1,'2026-01-14','','','interviewer','interview','2026-01-13 18:51:56','2026-01-14 13:24:12',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `means_of_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT 'User to be notified',
  `type` enum('budget_approved','budget_rejected','budget_returned','budget_revised','comment_added','expense_approved','general') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'budget_request, activity, expense, etc',
  `entity_id` int DEFAULT NULL COMMENT 'ID of related entity',
  `action_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL to navigate when clicked',
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_type` (`type`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_notification_created` (`created_at` DESC),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System notifications for users';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'budget_approved','Budget Request Approved','Your budget request #BRQ-1767873885794-270 for \"Align budgets with donor requirements\" has been approved with an amount of KES 1,100,000. Finance notes: This ok and approved good luck. But we have removed 200k which will be added later ','budget_request',2,'/my-budget-requests',1,NULL,'2026-01-08 18:42:31',NULL),(2,2,'budget_revised','Budget Revised','Your approved budget #BRQ-1767873885794-270 for \"Align budgets with donor requirements\" has been revised from KES 1100000.00 to KES 1,300,000. Reason: added the missing amount','budget_request',2,'/my-budget-requests',1,NULL,'2026-01-08 19:02:17',NULL),(3,2,'budget_revised','Budget Revised','Your approved budget #BRQ-1767872962502-65 for \"Prepare annual organizational budget\" has been revised from KES 1200001.00 to KES 1,200,000. Reason: clear amount','budget_request',1,'/my-budget-requests',1,NULL,'2026-01-08 19:04:01',NULL),(4,2,'budget_approved','Budget Request Approved','Your budget request #BRQ-1767893856123-859 for \"Budget approval and sign-off\" has been approved with an amount of KES 1,500,000. Finance notes: Approved remember to provide attendance list and proof of usage ','budget_request',3,'/my-budget-requests',1,NULL,'2026-01-08 19:10:42',NULL),(5,2,'budget_approved','Budget Request Approved','Your budget request #BRQ-1767939002993-46 for \"Develop project-specific budgets\" has been approved with an amount of KES 500,000. Finance notes: Approved and remember to account ','budget_request',4,'/my-budget-requests',1,NULL,'2026-01-09 06:17:24',NULL),(6,2,'budget_revised','Budget Revised','Your approved budget #BRQ-1767939002993-46 for \"Develop project-specific budgets\" has been revised from KES 500000.00 to KES 700,000. Reason: More addition to support the added activity','budget_request',4,'/my-budget-requests',1,NULL,'2026-01-13 09:28:01',NULL),(7,1,'budget_approved','Budget Request Approved','Your budget request #BRQ-1768560490966-852 for \"Budget approval and sign-off\" has been approved with an amount of KES 300,000. Finance notes: approved','budget_request',6,'/my-budget-requests',1,NULL,'2026-01-16 10:58:14',NULL),(8,1,'general','Resource allocated','Your resource request REQ-1768733936451-248 has been allocated.','resource_request',1,NULL,0,NULL,'2026-01-18 12:13:20',NULL),(9,1,'general','Resource request approved','Your resource request REQ-1768734007385-965 has been approved.','resource_request',2,NULL,0,NULL,'2026-01-18 12:14:14',NULL),(10,1,'general','Resource request queued','Your request REQ-1768739331134-41 has been placed in the queue (position 2).','resource_request',4,NULL,0,NULL,'2026-01-18 12:28:51',NULL),(11,1,'general','Resource request approved','Your resource request REQ-1768739331134-41 has been approved.','resource_request',4,NULL,0,NULL,'2026-01-18 12:33:06',NULL),(12,1,'general','Resource request approved','Your resource request REQ-1768738946483-574 has been approved.','resource_request',3,NULL,0,NULL,'2026-01-18 12:33:21',NULL),(13,1,'general','Resource allocated','Your resource request REQ-1768739331134-41 has been allocated.','resource_request',4,NULL,1,NULL,'2026-01-18 12:33:31',NULL),(14,2,'general','Resource request queued','Your request REQ-1768740392959-891 has been placed in the queue (position 2).','resource_request',6,NULL,0,NULL,'2026-01-18 12:46:32',NULL),(15,2,'general','New comment on resource request','A new comment was added to request REQ-1768740392959-891.','resource_request',6,NULL,1,NULL,'2026-01-18 12:52:28',NULL),(16,1,'general','Resource returned','Resource request REQ-1768739331134-41 has been marked as returned.','resource_request',4,NULL,0,NULL,'2026-01-25 12:47:31',NULL),(17,1,'general','Resource request approved','Your resource request REQ-1769345912724-913 has been approved.','resource_request',7,NULL,0,NULL,'2026-01-25 12:58:45',NULL),(18,1,'general','Resource returned','Resource request REQ-1768739331134-41 has been marked as returned.','resource_request',4,NULL,0,NULL,'2026-02-01 15:35:31',NULL),(19,1,'general','Resource request approved','Your resource request REQ-1769960103395-909 has been approved.','resource_request',8,NULL,0,NULL,'2026-02-01 15:36:01',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutrition_assessments`
--

DROP TABLE IF EXISTS `nutrition_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition_assessments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `beneficiary_id` int NOT NULL,
  `household_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assessment_date` date NOT NULL,
  `assessment_type` enum('baseline','midline','endline','routine_monitoring') COLLATE utf8mb4_unicode_ci DEFAULT 'routine_monitoring',
  `program_module_id` int NOT NULL,
  `cereals` tinyint(1) DEFAULT '0',
  `tubers` tinyint(1) DEFAULT '0',
  `vegetables` tinyint(1) DEFAULT '0',
  `fruits` tinyint(1) DEFAULT '0',
  `meat` tinyint(1) DEFAULT '0',
  `eggs` tinyint(1) DEFAULT '0',
  `fish` tinyint(1) DEFAULT '0',
  `legumes` tinyint(1) DEFAULT '0',
  `dairy` tinyint(1) DEFAULT '0',
  `oils_fats` tinyint(1) DEFAULT '0',
  `sugar` tinyint(1) DEFAULT '0',
  `condiments` tinyint(1) DEFAULT '0',
  `hdds_score` int DEFAULT NULL,
  `meals_per_day` int DEFAULT NULL,
  `children_meals_per_day` int DEFAULT NULL,
  `food_security_status` enum('food_secure','mildly_insecure','moderately_insecure','severely_insecure') COLLATE utf8mb4_unicode_ci NOT NULL,
  `hunger_score` int DEFAULT NULL,
  `child_weight_kg` decimal(5,2) DEFAULT NULL,
  `child_height_cm` decimal(5,2) DEFAULT NULL,
  `muac_mm` decimal(5,1) DEFAULT NULL,
  `nutrition_status` enum('normal','mam','sam','overweight') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nutrition_education_received` tinyint(1) DEFAULT '0',
  `supplementary_feeding` tinyint(1) DEFAULT '0',
  `cash_transfer_received` tinyint(1) DEFAULT '0',
  `assessed_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_module_id` (`program_module_id`),
  KEY `assessed_by` (`assessed_by`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  KEY `idx_assessment_date` (`assessment_date`),
  KEY `idx_food_security` (`food_security_status`),
  CONSTRAINT `nutrition_assessments_ibfk_1` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `nutrition_assessments_ibfk_2` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `nutrition_assessments_ibfk_3` FOREIGN KEY (`assessed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition_assessments`
--

LOCK TABLES `nutrition_assessments` WRITE;
/*!40000 ALTER TABLE `nutrition_assessments` DISABLE KEYS */;
/*!40000 ALTER TABLE `nutrition_assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_team_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ClickUp Team ID',
  `clickup_workspace_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ClickUp Workspace ID',
  `settings` json DEFAULT NULL COMMENT 'Organization-wide settings',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Kenya',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_team_id` (`clickup_team_id`),
  KEY `idx_code` (`code`),
  KEY `idx_clickup_team` (`clickup_team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Organization/Workspace - Top Level Container';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'Caritas Nairobi','CARITAS_NBO','Caritas Nairobi - Catholic Archdiocese of Nairobi',NULL,NULL,NULL,NULL,NULL,NULL,'Kenya',1,'2025-11-17 07:39:02','2025-11-17 07:39:02');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance_comments`
--

DROP TABLE IF EXISTS `performance_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('activity','component','sub_program','indicator') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_type` enum('progress_update','challenge','achievement','lesson_learned','general') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `is_public` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_entity_comments` (`entity_type`,`entity_id`),
  KEY `idx_comment_type` (`comment_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_comments`
--

LOCK TABLES `performance_comments` WRITE;
/*!40000 ALTER TABLE `performance_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `performance_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Permission identifier',
  `resource` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Resource: activities, verifications, etc.',
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Action: create, read, update, delete, approve',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Permission description',
  `applies_to` enum('all','own','module','team') COLLATE utf8mb4_unicode_ci DEFAULT 'all' COMMENT 'Scope of permission',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_resource_action` (`resource`,`action`),
  KEY `idx_applies_to` (`applies_to`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Available permissions in the system';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'activities.create','activities','create','Create new activities','module','2025-11-27 18:31:40'),(2,'activities.read.all','activities','read','View all activities','all','2025-11-27 18:31:40'),(3,'activities.read.own','activities','read','View own activities','own','2025-11-27 18:31:40'),(4,'activities.read.module','activities','read','View module activities','module','2025-11-27 18:31:40'),(5,'activities.update.all','activities','update','Edit all activities','all','2025-11-27 18:31:40'),(6,'activities.update.own','activities','update','Edit own activities','own','2025-11-27 18:31:40'),(7,'activities.update.module','activities','update','Edit module activities','module','2025-11-27 18:31:40'),(8,'activities.delete.all','activities','delete','Delete all activities','all','2025-11-27 18:31:40'),(9,'activities.delete.own','activities','delete','Delete own activities','own','2025-11-27 18:31:40'),(10,'activities.approve','activities','approve','Approve activities','module','2025-11-27 18:31:40'),(11,'activities.reject','activities','reject','Reject activities','module','2025-11-27 18:31:40'),(12,'activities.submit','activities','submit','Submit for approval','own','2025-11-27 18:31:40'),(13,'verifications.create','verifications','create','Create verifications','module','2025-11-27 18:31:40'),(14,'verifications.read.all','verifications','read','View all verifications','all','2025-11-27 18:31:40'),(15,'verifications.read.module','verifications','read','View module verifications','module','2025-11-27 18:31:40'),(16,'verifications.update.all','verifications','update','Edit all verifications','all','2025-11-27 18:31:40'),(17,'verifications.update.module','verifications','update','Edit module verifications','module','2025-11-27 18:31:40'),(18,'verifications.delete.all','verifications','delete','Delete all verifications','all','2025-11-27 18:31:40'),(19,'verifications.verify','verifications','verify','Verify evidence','module','2025-11-27 18:31:40'),(20,'verifications.reject','verifications','reject','Reject evidence','module','2025-11-27 18:31:40'),(21,'indicators.create','indicators','create','Create indicators','module','2025-11-27 18:31:40'),(22,'indicators.read.all','indicators','read','View all indicators','all','2025-11-27 18:31:40'),(23,'indicators.read.module','indicators','read','View module indicators','module','2025-11-27 18:31:40'),(24,'indicators.update.all','indicators','update','Edit all indicators','all','2025-11-27 18:31:40'),(25,'indicators.update.module','indicators','update','Edit module indicators','module','2025-11-27 18:31:40'),(26,'indicators.delete.all','indicators','delete','Delete all indicators','all','2025-11-27 18:31:40'),(27,'settings.view','settings','read','View settings','all','2025-11-27 18:31:40'),(28,'settings.manage','settings','manage','Manage system settings','all','2025-11-27 18:31:40'),(29,'users.create','users','create','Create new users','','2025-11-27 18:31:40'),(30,'users.read.all','users','read','View all users','all','2025-11-27 18:31:40'),(31,'users.read.team','users','read','View team members','team','2025-11-27 18:31:40'),(32,'users.update.all','users','update','Edit all users','all','2025-11-27 18:31:40'),(33,'users.delete','users','delete','Delete users','','2025-11-27 18:31:40'),(34,'users.manage_roles','users','manage','Assign roles to users','all','2025-11-27 18:31:40'),(35,'reports.view.all','reports','read','View all reports','all','2025-11-27 18:31:40'),(36,'reports.view.module','reports','read','View module reports','module','2025-11-27 18:31:40'),(37,'reports.export','reports','export','Export reports','module','2025-11-27 18:31:40'),(38,'budget.view.all','budget','read','View all budgets','all','2025-11-27 18:31:40'),(39,'budget.view.module','budget','read','View module budgets','module','2025-11-27 18:31:40'),(40,'budget.update.all','budget','update','Edit all budgets','all','2025-11-27 18:31:40'),(41,'budget.update.module','budget','update','Edit module budgets','module','2025-11-27 18:31:40'),(42,'modules.read','modules','read','View program modules','','2025-11-27 18:31:40'),(43,'modules.manage','modules','manage','Manage modules','all','2025-11-27 18:31:40'),(44,'users.read','users','read','View user information','','2025-12-09 04:17:10'),(45,'users.update','users','update','Update user information','','2025-12-09 04:17:10'),(46,'activities.read','activities','read','View activities','module','2025-12-09 04:17:10'),(47,'activities.update','activities','update','Update activities','module','2025-12-09 04:17:10'),(48,'activities.delete','activities','delete','Delete activities','module','2025-12-09 04:17:10'),(49,'reports.create','reports','create','Create reports','module','2025-12-09 04:17:10'),(50,'reports.read','reports','read','View reports','module','2025-12-09 04:17:10'),(51,'reports.update','reports','update','Update reports','module','2025-12-09 04:17:10'),(52,'reports.delete','reports','delete','Delete reports','module','2025-12-09 04:17:10'),(53,'modules.create','modules','create','Create program modules','','2025-12-09 04:17:10'),(54,'modules.update','modules','update','Update program modules','','2025-12-09 04:17:10'),(55,'modules.delete','modules','delete','Delete program modules','','2025-12-09 04:17:10'),(56,'settings.read','settings','read','View system settings','','2025-12-09 04:17:10'),(57,'settings.update','settings','update','Update system settings','','2025-12-09 04:17:10');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_budgets`
--

DROP TABLE IF EXISTS `program_budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_budgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_module_id` int NOT NULL,
  `sub_program_id` int DEFAULT NULL,
  `fiscal_year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_budget` decimal(15,2) NOT NULL,
  `allocated_budget` decimal(15,2) DEFAULT '0.00',
  `spent_budget` decimal(15,2) DEFAULT '0.00',
  `committed_budget` decimal(15,2) DEFAULT '0.00',
  `remaining_budget` decimal(15,2) GENERATED ALWAYS AS (((`total_budget` - `spent_budget`) - `committed_budget`)) STORED,
  `operational_budget` decimal(15,2) DEFAULT '0.00',
  `program_budget` decimal(15,2) DEFAULT '0.00',
  `capital_budget` decimal(15,2) DEFAULT '0.00',
  `donor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funding_source` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grant_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_start_date` date NOT NULL,
  `budget_end_date` date NOT NULL,
  `status` enum('draft','submitted','approved','active','closed','exhausted') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `approval_status` enum('pending','approved','rejected','revision_needed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `submitted_by` int DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_program_id` (`sub_program_id`),
  KEY `submitted_by` (`submitted_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_program_module` (`program_module_id`),
  KEY `idx_fiscal_year` (`fiscal_year`),
  KEY `idx_status` (`status`),
  CONSTRAINT `program_budgets_ibfk_1` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `program_budgets_ibfk_2` FOREIGN KEY (`sub_program_id`) REFERENCES `programs` (`id`),
  CONSTRAINT `program_budgets_ibfk_3` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`),
  CONSTRAINT `program_budgets_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_budgets`
--

LOCK TABLES `program_budgets` WRITE;
/*!40000 ALTER TABLE `program_budgets` DISABLE KEYS */;
INSERT INTO `program_budgets` (`id`, `program_module_id`, `sub_program_id`, `fiscal_year`, `total_budget`, `allocated_budget`, `spent_budget`, `committed_budget`, `operational_budget`, `program_budget`, `capital_budget`, `donor`, `funding_source`, `grant_number`, `budget_start_date`, `budget_end_date`, `status`, `approval_status`, `submitted_by`, `submitted_at`, `approved_by`, `approved_at`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,6,NULL,'2026',320000000.00,320000000.00,0.00,0.00,NULL,NULL,NULL,'','','','2026-01-01','2026-12-31','approved','approved',1,'2026-01-08 11:14:20',3,'2026-01-09 05:05:03','','2026-01-08 11:14:20','2026-01-14 08:49:06',NULL),(2,2,NULL,'2026',500000000.00,500000000.00,0.00,0.00,NULL,NULL,NULL,'','','','2026-01-01','2026-12-31','active','pending',1,'2026-01-25 13:05:00',1,'2026-01-25 13:05:22','','2026-01-25 13:05:00','2026-01-25 13:05:22',NULL);
/*!40000 ALTER TABLE `program_budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_modules`
--

DROP TABLE IF EXISTS `program_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., FOOD_ENV, SOCIO_ECON',
  `icon` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Emoji icon',
  `description` text COLLATE utf8mb4_unicode_ci,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clickup_space_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `manager_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('planning','active','on-hold','completed','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `logframe_goal` text COLLATE utf8mb4_unicode_ci COMMENT 'Overall goal statement',
  `goal_indicators` text COLLATE utf8mb4_unicode_ci COMMENT 'Key goal-level indicators (optional text summary)',
  `overall_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
  `status_override` tinyint(1) DEFAULT '0',
  `last_status_update` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_space_id` (`clickup_space_id`),
  KEY `idx_organization` (`organization_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_space_id`),
  CONSTRAINT `program_modules_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 1: Program Modules (Major Thematic Areas) - ClickUp Spaces';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_modules`
--

LOCK TABLES `program_modules` WRITE;
/*!40000 ALTER TABLE `program_modules` DISABLE KEYS */;
INSERT INTO `program_modules` VALUES (1,1,'Food, Water & Environment','FOOD_ENV','🌾','Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(2,1,'Socio-Economic Empowerment','SEEP','💼','Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-12 06:04:25',NULL,NULL,NULL,'not-started',0,NULL),(3,1,'Gender, Youth & Peace','GENDER_YOUTH','👥','Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(4,1,'Relief & Charitable Services','RELIEF','🆘','Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(5,1,'Resource Management','RESOURCE_MGMT','🏗️','Resource Allocation & Management, Capacity Building, Infrastructure Development, Material Resources, and Strategic Resource Planning',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-15 10:25:36',NULL,NULL,NULL,'not-started',0,NULL),(6,1,'Finance Management','FINANCE_MGMT','💰','Budget Management, Financial Planning, Expenditure Tracking, Program Funding Allocation, and Financial Reporting',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-15 11:26:33',NULL,NULL,'Finance','not-started',0,NULL);
/*!40000 ALTER TABLE `program_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_space_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `status` enum('planning','active','on-hold','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `manager_id` int DEFAULT NULL,
  `manager_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_space_id` (`clickup_space_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_clickup_space` (`clickup_space_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_components`
--

DROP TABLE IF EXISTS `project_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sub_program_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_list_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `orderindex` int DEFAULT '0',
  `status` enum('not-started','in-progress','completed','blocked','on-track','at-risk','delayed','off-track') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
  `progress_percentage` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `logframe_output` text COLLATE utf8mb4_unicode_ci COMMENT 'Expected output statement',
  `output_indicators` text COLLATE utf8mb4_unicode_ci COMMENT 'Key output indicators (optional text summary)',
  `overall_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rolled-up status from activities',
  `status_override` tinyint(1) DEFAULT '0',
  `auto_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manual_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_status_update` timestamp NULL DEFAULT NULL,
  `risk_level` enum('none','low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_list_id` (`clickup_list_id`),
  KEY `idx_sub_program` (`sub_program_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_list_id`),
  CONSTRAINT `project_components_ibfk_1` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_components_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 3: Project Components (Work Packages) - ClickUp Lists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_components`
--

LOCK TABLES `project_components` WRITE;
/*!40000 ALTER TABLE `project_components` DISABLE KEYS */;
INSERT INTO `project_components` VALUES (1,1,'Annual & Project Budgeting','COMP-001','Annual & Project Budgeting',NULL,7000.00,0,'',100,1,'Susan susan','pending',NULL,'2026-01-08 06:53:46','2026-01-16 13:02:03',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2026-01-16 13:02:03','none');
/*!40000 ALTER TABLE `project_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_folder_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `actual_cost` decimal(15,2) DEFAULT '0.00',
  `status` enum('planning','active','on-hold','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `progress_percentage` int DEFAULT '0',
  `manager_id` int DEFAULT NULL,
  `manager_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_beneficiaries` int DEFAULT NULL,
  `actual_beneficiaries` int DEFAULT '0',
  `location_details` json DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_folder_id` (`clickup_folder_id`),
  KEY `idx_program` (`program_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup_folder` (`clickup_folder_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relief_beneficiaries`
--

DROP TABLE IF EXISTS `relief_beneficiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relief_beneficiaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `distribution_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `received_date` date NOT NULL,
  `quantity_received` decimal(10,2) DEFAULT NULL,
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature_captured` tinyint(1) DEFAULT '0',
  `satisfaction_rating` int DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `recorded_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `target_beneficiaries` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_recipient` (`distribution_id`,`beneficiary_id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_distribution` (`distribution_id`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  CONSTRAINT `relief_beneficiaries_ibfk_1` FOREIGN KEY (`distribution_id`) REFERENCES `relief_distributions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `relief_beneficiaries_ibfk_2` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `relief_beneficiaries_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relief_beneficiaries`
--

LOCK TABLES `relief_beneficiaries` WRITE;
/*!40000 ALTER TABLE `relief_beneficiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `relief_beneficiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relief_distributions`
--

DROP TABLE IF EXISTS `relief_distributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relief_distributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `distribution_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distribution_date` date NOT NULL,
  `program_module_id` int NOT NULL,
  `distribution_type` enum('food','nfis','cash','voucher','medical','shelter','education','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_distributed` int DEFAULT NULL,
  `unit_of_measure` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_value` decimal(15,2) DEFAULT NULL,
  `total_beneficiaries` int DEFAULT '0',
  `male_beneficiaries` int DEFAULT '0',
  `female_beneficiaries` int DEFAULT '0',
  `children_beneficiaries` int DEFAULT '0',
  `donor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distributed_by` int DEFAULT NULL,
  `verified_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `distribution_report_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_beneficiaries` int DEFAULT NULL,
  `status` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `distribution_code` (`distribution_code`),
  KEY `distributed_by` (`distributed_by`),
  KEY `verified_by` (`verified_by`),
  KEY `idx_distribution_code` (`distribution_code`),
  KEY `idx_program_module` (`program_module_id`),
  KEY `idx_distribution_date` (`distribution_date`),
  CONSTRAINT `relief_distributions_ibfk_1` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `relief_distributions_ibfk_2` FOREIGN KEY (`distributed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `relief_distributions_ibfk_3` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relief_distributions`
--

LOCK TABLES `relief_distributions` WRITE;
/*!40000 ALTER TABLE `relief_distributions` DISABLE KEYS */;
/*!40000 ALTER TABLE `relief_distributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_maintenance`
--

DROP TABLE IF EXISTS `resource_maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_maintenance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource_id` int NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_type` enum('preventive','corrective','inspection','repair','upgrade') COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_description` text COLLATE utf8mb4_unicode_ci,
  `work_performed` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_provider` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technician_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `downtime_start` datetime DEFAULT NULL,
  `downtime_end` datetime DEFAULT NULL,
  `downtime_hours` decimal(5,2) DEFAULT NULL,
  `parts_replaced` text COLLATE utf8mb4_unicode_ci,
  `parts_cost` decimal(10,2) DEFAULT NULL,
  `next_maintenance_date` date DEFAULT NULL,
  `report_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `performed_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `performed_by` (`performed_by`),
  KEY `idx_resource` (`resource_id`),
  KEY `idx_maintenance_date` (`maintenance_date`),
  CONSTRAINT `resource_maintenance_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resource_maintenance_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_maintenance`
--

LOCK TABLES `resource_maintenance` WRITE;
/*!40000 ALTER TABLE `resource_maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_requests`
--

DROP TABLE IF EXISTS `resource_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_id` int DEFAULT NULL,
  `resource_type_id` int DEFAULT NULL,
  `requested_by` int NOT NULL,
  `program_module_id` int DEFAULT NULL,
  `activity_id` int DEFAULT NULL,
  `request_type` enum('allocation','booking','purchase','procurement','maintenance','replacement','disposal') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_requested` int DEFAULT '1',
  `purpose` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  `status` enum('pending','approved','allocated','returned','rejected','in_use','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `fulfilled_by` int DEFAULT NULL,
  `fulfilled_at` timestamp NULL DEFAULT NULL,
  `expected_return_date` date DEFAULT NULL,
  `actual_return_date` date DEFAULT NULL,
  `return_condition` enum('excellent','good','fair','poor','damaged') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `return_notes` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_number` (`request_number`),
  KEY `resource_type_id` (`resource_type_id`),
  KEY `requested_by` (`requested_by`),
  KEY `activity_id` (`activity_id`),
  KEY `approved_by` (`approved_by`),
  KEY `fulfilled_by` (`fulfilled_by`),
  KEY `idx_request_number` (`request_number`),
  KEY `idx_status` (`status`),
  KEY `idx_resource` (`resource_id`),
  KEY `idx_program_module` (`program_module_id`),
  CONSTRAINT `resource_requests_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`),
  CONSTRAINT `resource_requests_ibfk_2` FOREIGN KEY (`resource_type_id`) REFERENCES `resource_types` (`id`),
  CONSTRAINT `resource_requests_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `resource_requests_ibfk_4` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `resource_requests_ibfk_5` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `resource_requests_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `resource_requests_ibfk_7` FOREIGN KEY (`fulfilled_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_requests`
--

LOCK TABLES `resource_requests` WRITE;
/*!40000 ALTER TABLE `resource_requests` DISABLE KEYS */;
INSERT INTO `resource_requests` VALUES (1,'REQ-1768733936451-248',1,NULL,1,1,NULL,'allocation',1,'For training transport purpose ','2026-01-19','2026-01-23',4,'returned','high',1,'2026-01-18 11:03:21',NULL,1,'2026-01-18 12:13:20',NULL,'2026-01-25',NULL,NULL,NULL,'2026-01-18 10:58:56','2026-01-25 12:46:17',NULL),(2,'REQ-1768734007385-965',1,NULL,1,4,NULL,'allocation',1,'Distribute food next week','2026-01-20','2026-01-21',1,'approved','medium',1,'2026-01-18 12:14:14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-18 11:00:07','2026-01-18 12:14:14',NULL),(3,'REQ-1768738946483-574',2,NULL,1,2,NULL,'allocation',1,'Test working ','2026-01-18','2026-01-19',1,'approved','medium',1,'2026-01-18 12:33:21',NULL,NULL,NULL,'2026-01-19',NULL,NULL,NULL,NULL,'2026-01-18 12:22:26','2026-01-18 12:33:21',NULL),(4,'REQ-1768739331134-41',2,NULL,1,5,NULL,'allocation',1,'taking resource to the seep team ','2026-01-18','2026-01-18',0,'returned','urgent',1,'2026-01-18 12:33:06',NULL,1,'2026-01-18 12:33:31','2026-01-18','2026-02-01',NULL,NULL,NULL,'2026-01-18 12:28:51','2026-02-01 15:35:31',NULL),(5,'REQ-1768740247975-345',1,NULL,1,6,4,'allocation',1,'For the activity on stake','2026-01-26','2026-01-27',1,'pending','medium',NULL,NULL,NULL,NULL,NULL,'2026-01-27',NULL,NULL,NULL,NULL,'2026-01-18 12:44:07','2026-01-18 12:44:07',NULL),(6,'REQ-1768740392959-891',1,NULL,2,6,1,'allocation',1,'needed for activity','2026-01-26','2026-01-28',2,'pending','medium',NULL,NULL,NULL,NULL,NULL,'2026-01-28',NULL,NULL,NULL,NULL,'2026-01-18 12:46:32','2026-01-18 12:46:32',NULL),(7,'REQ-1769345912724-913',2,NULL,1,6,NULL,'maintenance',1,'need service','2026-01-26','2026-01-27',1,'approved','medium',1,'2026-01-25 12:58:45',NULL,NULL,NULL,'2026-01-27',NULL,NULL,NULL,NULL,'2026-01-25 12:58:32','2026-01-25 12:58:45',NULL),(8,'REQ-1769960103395-909',2,NULL,1,3,NULL,'allocation',1,'Routine ','2026-02-03','2026-02-06',3,'approved','medium',1,'2026-02-01 15:36:01',NULL,NULL,NULL,'2026-02-06',NULL,NULL,NULL,NULL,'2026-02-01 15:35:03','2026-02-01 15:36:01',NULL);
/*!40000 ALTER TABLE `resource_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_types`
--

DROP TABLE IF EXISTS `resource_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('equipment','vehicle','facility','material','technology','human_resource','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name_category` (`name`,`category`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_types`
--

LOCK TABLES `resource_types` WRITE;
/*!40000 ALTER TABLE `resource_types` DISABLE KEYS */;
INSERT INTO `resource_types` VALUES (1,'Desktop Computer','other','Desktop computers and workstations etc',1,'2025-12-15 11:01:00','2026-01-18 10:53:40'),(2,'Laptop','equipment','Portable computers',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(3,'Printer','equipment','Printing devices',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(4,'Projector','equipment','Video projectors for presentations',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(5,'Vehicle - 4WD','vehicle','Four-wheel drive vehicles',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(6,'Vehicle - Motorcycle','vehicle','Motorcycles for field work',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(7,'Office Space','facility','Office facilities and spaces',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(8,'Training Hall','facility','Training and meeting halls',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(9,'Warehouse','facility','Storage facilities',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(10,'Office Furniture','material','Desks, chairs, cabinets',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(11,'Training Materials','material','Educational and training materials',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(12,'Software License','technology','Software and system licenses',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(13,'Mobile Devices','technology','Smartphones and tablets',1,'2025-12-15 11:01:00','2025-12-15 11:16:55');
/*!40000 ALTER TABLE `resource_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_type_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('equipment','vehicle','facility','material','technology','human_resource','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `acquisition_date` date DEFAULT NULL,
  `acquisition_cost` decimal(15,2) DEFAULT NULL,
  `acquisition_method` enum('purchase','donation','lease','grant','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacturer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `unit_of_measure` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_to_user` int DEFAULT NULL,
  `assigned_to_program` int DEFAULT NULL,
  `assignment_date` date DEFAULT NULL,
  `condition_status` enum('excellent','good','fair','poor','damaged','under_repair') COLLATE utf8mb4_unicode_ci DEFAULT 'good',
  `last_maintenance_date` date DEFAULT NULL,
  `next_maintenance_date` date DEFAULT NULL,
  `maintenance_frequency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability_status` enum('available','in_use','reserved','under_maintenance','retired','lost','disposed') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `current_value` decimal(15,2) DEFAULT NULL,
  `depreciation_rate` decimal(5,2) DEFAULT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_expiry_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_code` (`resource_code`),
  KEY `resource_type_id` (`resource_type_id`),
  KEY `assigned_to_user` (`assigned_to_user`),
  KEY `created_by` (`created_by`),
  KEY `idx_resource_code` (`resource_code`),
  KEY `idx_category` (`category`),
  KEY `idx_availability` (`availability_status`),
  KEY `idx_assigned_to_program` (`assigned_to_program`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`resource_type_id`) REFERENCES `resource_types` (`id`),
  CONSTRAINT `resources_ibfk_2` FOREIGN KEY (`assigned_to_user`) REFERENCES `users` (`id`),
  CONSTRAINT `resources_ibfk_3` FOREIGN KEY (`assigned_to_program`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `resources_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,'RES-1768733825104-976',5,'Prado TX 150 KDW 234W','Project car','vehicle','2026-01-01',10000000.00,'purchase','Toyota Kenya','65tyr45','Toyota','Japannes',1,'units','main office','',NULL,NULL,'2026-01-18','excellent',NULL,NULL,NULL,'in_use',10000000.00,NULL,NULL,NULL,NULL,NULL,1,'2026-01-18 10:57:05','2026-01-20 05:47:01',NULL),(2,'RES-1768738871640-747',5,'Landcruizer 75 turbo KDA  456A','Turbo landcruizer 75','vehicle','2021-01-12',12500000.00,'purchase','Toyota Kenya','','Toyota','Japannes',1,'units','','Kibera HC',NULL,NULL,NULL,'good',NULL,NULL,NULL,'available',7500000.00,NULL,NULL,NULL,NULL,NULL,1,'2026-01-18 12:21:11','2026-02-01 15:35:31',NULL);
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results_chain`
--

DROP TABLE IF EXISTS `results_chain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results_chain` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_entity_type` enum('activity','component','sub_program') COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_entity_id` int NOT NULL,
  `to_entity_type` enum('component','sub_program','module') COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_entity_id` int NOT NULL,
  `contribution_description` text COLLATE utf8mb4_unicode_ci COMMENT 'How does this contribute to the higher level',
  `contribution_weight` decimal(5,2) DEFAULT '100.00' COMMENT 'Percentage contribution (if multiple activities contribute)',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_from_entity` (`from_entity_type`,`from_entity_id`),
  KEY `idx_to_entity` (`to_entity_type`,`to_entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results_chain`
--

LOCK TABLES `results_chain` WRITE;
/*!40000 ALTER TABLE `results_chain` DISABLE KEYS */;
INSERT INTO `results_chain` VALUES (1,'activity',3,'component',1,'fast track the budget to align with donor requirement',100.00,'npv','2026-01-14 12:06:04','2026-01-14 12:06:04',NULL);
/*!40000 ALTER TABLE `results_chain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  KEY `idx_role` (`role_id`),
  KEY `idx_permission` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Maps permissions to roles';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,2,'2025-11-27 18:31:40'),(2,1,5,'2025-11-27 18:31:40'),(3,1,8,'2025-11-27 18:31:40'),(4,1,14,'2025-11-27 18:31:40'),(5,1,16,'2025-11-27 18:31:40'),(6,1,18,'2025-11-27 18:31:40'),(7,1,22,'2025-11-27 18:31:40'),(8,1,24,'2025-11-27 18:31:40'),(9,1,26,'2025-11-27 18:31:40'),(10,1,27,'2025-11-27 18:31:40'),(11,1,28,'2025-11-27 18:31:40'),(12,1,29,'2025-11-27 18:31:40'),(13,1,30,'2025-11-27 18:31:40'),(14,1,32,'2025-11-27 18:31:40'),(15,1,33,'2025-11-27 18:31:40'),(16,1,34,'2025-11-27 18:31:40'),(17,1,35,'2025-11-27 18:31:40'),(18,1,38,'2025-11-27 18:31:40'),(19,1,40,'2025-11-27 18:31:40'),(20,1,42,'2025-11-27 18:31:40'),(21,1,43,'2025-11-27 18:31:40'),(22,1,3,'2025-11-27 18:31:40'),(23,1,6,'2025-11-27 18:31:40'),(24,1,9,'2025-11-27 18:31:40'),(25,1,12,'2025-11-27 18:31:40'),(26,1,1,'2025-11-27 18:31:40'),(27,1,4,'2025-11-27 18:31:40'),(28,1,7,'2025-11-27 18:31:40'),(29,1,10,'2025-11-27 18:31:40'),(30,1,11,'2025-11-27 18:31:40'),(31,1,13,'2025-11-27 18:31:40'),(32,1,15,'2025-11-27 18:31:40'),(33,1,17,'2025-11-27 18:31:40'),(34,1,19,'2025-11-27 18:31:40'),(35,1,20,'2025-11-27 18:31:40'),(36,1,21,'2025-11-27 18:31:40'),(37,1,23,'2025-11-27 18:31:40'),(38,1,25,'2025-11-27 18:31:40'),(39,1,36,'2025-11-27 18:31:40'),(40,1,37,'2025-11-27 18:31:40'),(41,1,39,'2025-11-27 18:31:40'),(42,1,41,'2025-11-27 18:31:40'),(43,1,31,'2025-11-27 18:31:40'),(64,2,10,'2025-11-27 18:31:40'),(65,2,2,'2025-11-27 18:31:40'),(66,2,11,'2025-11-27 18:31:40'),(67,2,5,'2025-11-27 18:31:40'),(68,2,38,'2025-11-27 18:31:40'),(69,2,22,'2025-11-27 18:31:40'),(70,2,24,'2025-11-27 18:31:40'),(71,2,42,'2025-11-27 18:31:40'),(72,2,37,'2025-11-27 18:31:40'),(73,2,35,'2025-11-27 18:31:40'),(74,2,27,'2025-11-27 18:31:40'),(75,2,30,'2025-11-27 18:31:40'),(76,2,31,'2025-11-27 18:31:40'),(77,2,14,'2025-11-27 18:31:40'),(78,2,20,'2025-11-27 18:31:40'),(79,2,16,'2025-11-27 18:31:40'),(80,2,19,'2025-11-27 18:31:40'),(95,3,10,'2025-11-27 18:31:40'),(96,3,2,'2025-11-27 18:31:40'),(97,3,11,'2025-11-27 18:31:40'),(98,3,5,'2025-11-27 18:31:40'),(99,3,38,'2025-11-27 18:31:40'),(100,3,22,'2025-11-27 18:31:40'),(101,3,25,'2025-11-27 18:31:40'),(102,3,42,'2025-11-27 18:31:40'),(103,3,37,'2025-11-27 18:31:40'),(104,3,35,'2025-11-27 18:31:40'),(105,3,27,'2025-11-27 18:31:40'),(106,3,31,'2025-11-27 18:31:40'),(107,3,14,'2025-11-27 18:31:40'),(108,3,20,'2025-11-27 18:31:40'),(109,3,16,'2025-11-27 18:31:40'),(110,3,19,'2025-11-27 18:31:40'),(126,4,2,'2025-11-27 18:31:40'),(127,4,40,'2025-11-27 18:31:40'),(128,4,38,'2025-11-27 18:31:40'),(129,4,22,'2025-11-27 18:31:40'),(130,4,37,'2025-11-27 18:31:40'),(131,4,35,'2025-11-27 18:31:40'),(132,4,14,'2025-11-27 18:31:40'),(133,5,2,'2025-11-27 18:31:40'),(134,5,38,'2025-11-27 18:31:40'),(135,5,22,'2025-11-27 18:31:40'),(136,5,37,'2025-11-27 18:31:40'),(137,5,35,'2025-11-27 18:31:40'),(138,5,14,'2025-11-27 18:31:40'),(140,6,10,'2025-11-27 18:31:40'),(141,6,1,'2025-11-27 18:31:40'),(142,6,9,'2025-11-27 18:31:40'),(143,6,4,'2025-11-27 18:31:40'),(144,6,11,'2025-11-27 18:31:40'),(145,6,7,'2025-11-27 18:31:40'),(146,6,41,'2025-11-27 18:31:40'),(147,6,39,'2025-11-27 18:31:40'),(148,6,21,'2025-11-27 18:31:40'),(149,6,26,'2025-11-27 18:31:40'),(150,6,23,'2025-11-27 18:31:40'),(151,6,25,'2025-11-27 18:31:40'),(152,6,37,'2025-11-27 18:31:40'),(153,6,36,'2025-11-27 18:31:40'),(154,6,31,'2025-11-27 18:31:40'),(155,6,13,'2025-11-27 18:31:40'),(156,6,18,'2025-11-27 18:31:40'),(157,6,15,'2025-11-27 18:31:40'),(158,6,20,'2025-11-27 18:31:40'),(159,6,17,'2025-11-27 18:31:40'),(160,6,19,'2025-11-27 18:31:40'),(171,7,1,'2025-11-27 18:31:40'),(172,7,4,'2025-11-27 18:31:40'),(173,7,12,'2025-11-27 18:31:40'),(174,7,6,'2025-11-27 18:31:40'),(175,7,39,'2025-11-27 18:31:40'),(176,7,21,'2025-11-27 18:31:40'),(177,7,23,'2025-11-27 18:31:40'),(178,7,25,'2025-11-27 18:31:40'),(179,7,36,'2025-11-27 18:31:40'),(180,7,31,'2025-11-27 18:31:40'),(181,7,13,'2025-11-27 18:31:40'),(182,7,15,'2025-11-27 18:31:40'),(183,7,17,'2025-11-27 18:31:40'),(186,8,1,'2025-11-27 18:31:40'),(187,8,3,'2025-11-27 18:31:40'),(188,8,12,'2025-11-27 18:31:40'),(189,8,6,'2025-11-27 18:31:40'),(190,8,23,'2025-11-27 18:31:40'),(191,8,36,'2025-11-27 18:31:40'),(192,8,13,'2025-11-27 18:31:40'),(193,8,15,'2025-11-27 18:31:40'),(201,9,4,'2025-11-27 18:31:40'),(202,9,23,'2025-11-27 18:31:40'),(203,9,36,'2025-11-27 18:31:40'),(204,9,13,'2025-11-27 18:31:40'),(205,9,15,'2025-11-27 18:31:40'),(206,9,20,'2025-11-27 18:31:40'),(207,9,17,'2025-11-27 18:31:40'),(208,9,19,'2025-11-27 18:31:40'),(216,10,1,'2025-11-27 18:31:40'),(217,10,3,'2025-11-27 18:31:40'),(218,10,23,'2025-11-27 18:31:40'),(219,10,13,'2025-11-27 18:31:40'),(223,11,4,'2025-11-27 18:31:40'),(224,11,39,'2025-11-27 18:31:40'),(225,11,23,'2025-11-27 18:31:40'),(226,11,36,'2025-11-27 18:31:40'),(227,11,15,'2025-11-27 18:31:40');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Internal role name (e.g., system_admin)',
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Display name (e.g., System Administrator)',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Role description',
  `scope` enum('system','module') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'module' COMMENT 'System-wide or module-specific',
  `level` int NOT NULL DEFAULT '10' COMMENT 'Hierarchy level (1=highest, 10=lowest)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_scope` (`scope`),
  KEY `idx_level` (`level`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User roles for RBAC system';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'system_admin','System Administrator','Full system access with all permissions','',1,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(2,'me_director','M&E Director','Oversees all M&E activities and reporting','',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(3,'me_manager','M&E Manager','Manages M&E data collection and analysis','module',3,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(4,'finance_officer','Finance Officer','Handles financial transactions and reporting','',4,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(5,'report_viewer','Report Viewer','View-only access to reports and dashboards','',6,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(6,'module_manager','Module Manager','Manages specific program modules','module',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(7,'module_coordinator','Module Coordinator','Coordinate activities within modules','module',4,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(8,'field_officer','Field Officer','Implements field activities and collects data','',5,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(9,'verification_officer','Verification Officer','Manage verification and evidence','module',5,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(10,'data_entry_clerk','Data Entry Clerk','Basic data entry only','module',8,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(11,'module_viewer','Module Viewer','Read-only access to module data','module',9,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(13,'program_director','Program Director','Oversees entire programs and strategic planning','',2,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(16,'finance_manager','Finance Manager','Manages budgets and financial tracking','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(17,'logistics_manager','Logistics Manager','Manages logistics and procurement','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(18,'program_manager','Program Manager','Manages program implementation','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(20,'me_officer','M&E Officer','Collects and validates M&E data','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(21,'data_analyst','Data Analyst','Analyzes data and generates reports','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(22,'procurement_officer','Procurement Officer','Manages procurement processes','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(23,'program_officer','Program Officer','Implements program activities','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(24,'technical_advisor','Technical Advisor','Provides technical guidance and support','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(26,'community_mobilizer','Community Mobilizer','Mobilizes communities and facilitates activities','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(27,'data_entry_officer','Data Entry Officer','Enters and validates field data','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(28,'enumerator','Enumerator','Conducts surveys and data collection','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(30,'approver','Approver','Reviews and approves activities and reports','module',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(31,'external_auditor','External Auditor','Audits program data and compliance','',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(33,'gbv_specialist','GBV Specialist','Specialized in Gender-Based Violence programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(34,'nutrition_specialist','Nutrition Specialist','Specialized in Nutrition programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(35,'agriculture_specialist','Agriculture Specialist','Specialized in Agriculture programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(36,'relief_coordinator','Relief Coordinator','Coordinates relief and emergency response','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(37,'seep_coordinator','SEEP Coordinator','Coordinates SEEP economic empowerment activities','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_accounts`
--

DROP TABLE IF EXISTS `savings_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shg_group_id` int NOT NULL,
  `member_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `account_type` enum('individual_savings','share_capital','emergency_fund','group_savings') COLLATE utf8mb4_unicode_ci DEFAULT 'individual_savings',
  `opening_date` date NOT NULL,
  `opening_balance` decimal(15,2) DEFAULT '0.00',
  `current_balance` decimal(15,2) DEFAULT '0.00',
  `total_deposits` decimal(15,2) DEFAULT '0.00',
  `total_withdrawals` decimal(15,2) DEFAULT '0.00',
  `account_status` enum('active','inactive','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `closure_date` date DEFAULT NULL,
  `closure_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_number` (`account_number`),
  KEY `beneficiary_id` (`beneficiary_id`),
  KEY `idx_account_number` (`account_number`),
  KEY `idx_group` (`shg_group_id`),
  KEY `idx_member` (`member_id`),
  KEY `idx_status` (`account_status`),
  CONSTRAINT `savings_accounts_ibfk_1` FOREIGN KEY (`shg_group_id`) REFERENCES `shg_groups` (`id`),
  CONSTRAINT `savings_accounts_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `shg_members` (`id`),
  CONSTRAINT `savings_accounts_ibfk_3` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_accounts`
--

LOCK TABLES `savings_accounts` WRITE;
/*!40000 ALTER TABLE `savings_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_transactions`
--

DROP TABLE IF EXISTS `savings_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `transaction_date` date NOT NULL,
  `transaction_type` enum('deposit','withdrawal','interest_credit','penalty','transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `payment_method` enum('cash','mpesa','bank_transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `payment_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `recorded_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meeting_id` (`meeting_id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_account` (`account_id`),
  KEY `idx_transaction_date` (`transaction_date`),
  KEY `idx_transaction_type` (`transaction_type`),
  CONSTRAINT `savings_transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `savings_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `savings_transactions_ibfk_2` FOREIGN KEY (`meeting_id`) REFERENCES `shg_meetings` (`id`),
  CONSTRAINT `savings_transactions_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_transactions`
--

LOCK TABLES `savings_transactions` WRITE;
/*!40000 ALTER TABLE `savings_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shg_groups`
--

DROP TABLE IF EXISTS `shg_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shg_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_module_id` int NOT NULL,
  `formation_date` date NOT NULL,
  `registration_status` enum('forming','registered','mature','dormant','dissolved') COLLATE utf8mb4_unicode_ci DEFAULT 'forming',
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_authority` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_venue` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_latitude` decimal(10,8) DEFAULT NULL,
  `gps_longitude` decimal(11,8) DEFAULT NULL,
  `total_members` int DEFAULT '0',
  `male_members` int DEFAULT '0',
  `female_members` int DEFAULT '0',
  `youth_members` int DEFAULT '0',
  `pwd_members` int DEFAULT '0',
  `total_savings` decimal(15,2) DEFAULT '0.00',
  `total_shares` decimal(15,2) DEFAULT '0.00',
  `share_value` decimal(10,2) DEFAULT '0.00',
  `total_loans_disbursed` decimal(15,2) DEFAULT '0.00',
  `total_loans_outstanding` decimal(15,2) DEFAULT '0.00',
  `loan_interest_rate` decimal(5,2) DEFAULT '10.00',
  `meeting_frequency` enum('weekly','bi-weekly','monthly') COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `meeting_day` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_meeting_date` date DEFAULT NULL,
  `chairperson_id` int DEFAULT NULL,
  `secretary_id` int DEFAULT NULL,
  `treasurer_id` int DEFAULT NULL,
  `facilitator_id` int DEFAULT NULL,
  `status` enum('active','inactive','graduated') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_code` (`group_code`),
  KEY `facilitator_id` (`facilitator_id`),
  KEY `chairperson_id` (`chairperson_id`),
  KEY `secretary_id` (`secretary_id`),
  KEY `treasurer_id` (`treasurer_id`),
  KEY `idx_group_code` (`group_code`),
  KEY `idx_program_module` (`program_module_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `shg_groups_ibfk_1` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `shg_groups_ibfk_2` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `shg_groups_ibfk_3` FOREIGN KEY (`chairperson_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `shg_groups_ibfk_4` FOREIGN KEY (`secretary_id`) REFERENCES `beneficiaries` (`id`),
  CONSTRAINT `shg_groups_ibfk_5` FOREIGN KEY (`treasurer_id`) REFERENCES `beneficiaries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shg_groups`
--

LOCK TABLES `shg_groups` WRITE;
/*!40000 ALTER TABLE `shg_groups` DISABLE KEYS */;
INSERT INTO `shg_groups` VALUES (21,'SHG-001','Tumaini Women Group',1,'2023-01-15','registered',NULL,NULL,'Nairobi','Dagoretti','Kawangware','Kawangware North',NULL,NULL,NULL,15,0,15,0,0,450000.00,150000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(22,'SHG-002','Umoja Self Help',1,'2023-02-10','registered',NULL,NULL,'Kisumu','Kisumu East','Manyatta','Nyalenda B',NULL,NULL,NULL,20,8,12,0,0,600000.00,200000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(23,'SHG-003','Harambee Group',1,'2023-03-05','mature',NULL,NULL,'Mombasa','Mvita','Tononoka','Majengo',NULL,NULL,NULL,12,4,8,0,0,360000.00,120000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(24,'SHG-004','Mwangaza Farmers',1,'2023-03-20','registered',NULL,NULL,'Uasin Gishu','Ainabkoi','Kapsoya','Kapsoya Estate',NULL,NULL,NULL,18,9,9,0,0,540000.00,180000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(25,'SHG-005','Furaha Women',1,'2023-04-12','registered',NULL,NULL,'Kiambu','Kikuyu','Kikuyu','Kikuyu Town',NULL,NULL,NULL,10,2,8,0,0,300000.00,100000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(26,'SHG-006','Amani Group',1,'2023-05-08','forming',NULL,NULL,'Murang\'a','Kigumo','Kinyona','Kinyona Village',NULL,NULL,NULL,8,3,5,0,0,120000.00,40000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(27,'SHG-007','Upendo Wetu',1,'2023-06-01','registered',NULL,NULL,'Nakuru','Nakuru West','Kaptembwo','Section 58',NULL,NULL,NULL,25,10,15,0,0,750000.00,250000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(28,'SHG-008','Maendeleo Group',1,'2023-06-20','mature',NULL,NULL,'Kisumu','Kisumu Central','Kondele','Nyalenda A',NULL,NULL,NULL,16,6,10,0,0,480000.00,160000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(29,'SHG-009','Pamoja Women',1,'2023-07-10','registered',NULL,NULL,'Nairobi','Embakasi','Umoja','Umoja 1',NULL,NULL,NULL,14,0,14,0,0,420000.00,140000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(30,'SHG-010','Vijana Farmers',1,'2023-08-05','registered',NULL,NULL,'Kericho','Bureti','Litein','Litein Town',NULL,NULL,NULL,22,12,10,0,0,660000.00,220000.00,0.00,0.00,0.00,10.00,'',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(31,'SHG-011','Uzima Group',1,'2023-09-01','forming',NULL,NULL,'Kirinyaga','Mwea','Wamumu','Wamumu Village',NULL,NULL,NULL,9,4,5,0,0,135000.00,45000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(32,'SHG-012','Imani Women',1,'2023-09-25','registered',NULL,NULL,'Bomet','Bomet Central','Silibwet','Silibwet Town',NULL,NULL,NULL,17,5,12,0,0,510000.00,170000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(33,'SHG-013','Baraka Group',1,'2023-10-10','registered',NULL,NULL,'Bungoma','Kanduyi','Bukembe','Bukembe West',NULL,NULL,NULL,19,8,11,0,0,570000.00,190000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(34,'SHG-014','Neema Women',1,'2023-11-01','forming',NULL,NULL,'Nyeri','Nyeri Central','Ruringu','Ruringu Estate',NULL,NULL,NULL,11,2,9,0,0,165000.00,55000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(35,'SHG-015','Jamii Yetu',1,'2023-11-20','registered',NULL,NULL,'Nandi','Nandi Hills','Nandi Hills','Nandi Hills Town',NULL,NULL,NULL,21,9,12,0,0,630000.00,210000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(36,'SHG-016','Tujenge Group',1,'2023-12-05','mature',NULL,NULL,'Kajiado','Kajiado Central','Ildamat','Ildamat Village',NULL,NULL,NULL,13,5,8,0,0,390000.00,130000.00,0.00,0.00,0.00,10.00,'',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(37,'SHG-017','Wanawake Hodari',1,'2024-01-10','forming',NULL,NULL,'Embu','Manyatta','Gaturi North','Gaturi',NULL,NULL,NULL,7,0,7,0,0,105000.00,35000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(38,'SHG-018','Unity Group',1,'2024-02-01','registered',NULL,NULL,'Siaya','Bondo','West Sakwa','Usonga',NULL,NULL,NULL,15,6,9,0,0,450000.00,150000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(39,'SHG-019','Faida Group',1,'2024-03-01','forming',NULL,NULL,'Laikipia','Laikipia East','Nanyuki','Nanyuki Town',NULL,NULL,NULL,12,5,7,0,0,180000.00,60000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(40,'SHG-020','Shujaa Women',1,'2024-04-01','forming',NULL,NULL,'Nyandarua','Ol Kalou','Rurii','Rurii Village',NULL,NULL,NULL,10,3,7,0,0,150000.00,50000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL);
/*!40000 ALTER TABLE `shg_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shg_meeting_attendance`
--

DROP TABLE IF EXISTS `shg_meeting_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shg_meeting_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `member_id` int NOT NULL,
  `present` tinyint(1) DEFAULT '0',
  `savings_contribution` decimal(10,2) DEFAULT '0.00',
  `loan_repayment` decimal(10,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`meeting_id`,`member_id`),
  KEY `idx_meeting` (`meeting_id`),
  KEY `idx_member` (`member_id`),
  CONSTRAINT `shg_meeting_attendance_ibfk_1` FOREIGN KEY (`meeting_id`) REFERENCES `shg_meetings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shg_meeting_attendance_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `shg_members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shg_meeting_attendance`
--

LOCK TABLES `shg_meeting_attendance` WRITE;
/*!40000 ALTER TABLE `shg_meeting_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `shg_meeting_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shg_meetings`
--

DROP TABLE IF EXISTS `shg_meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shg_meetings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shg_group_id` int NOT NULL,
  `meeting_date` date NOT NULL,
  `meeting_type` enum('regular','special','training','annual_general') COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `venue` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facilitator_id` int DEFAULT NULL,
  `total_members` int DEFAULT '0',
  `members_present` int DEFAULT '0',
  `attendance_percentage` decimal(5,2) DEFAULT NULL,
  `savings_collected` decimal(15,2) DEFAULT '0.00',
  `loans_disbursed` decimal(15,2) DEFAULT '0.00',
  `loan_repayments` decimal(15,2) DEFAULT '0.00',
  `fines_collected` decimal(10,2) DEFAULT '0.00',
  `agenda` text COLLATE utf8mb4_unicode_ci,
  `resolutions` text COLLATE utf8mb4_unicode_ci,
  `challenges` text COLLATE utf8mb4_unicode_ci,
  `next_meeting_date` date DEFAULT NULL,
  `minutes_document_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recorded_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facilitator_id` (`facilitator_id`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_group` (`shg_group_id`),
  KEY `idx_meeting_date` (`meeting_date`),
  CONSTRAINT `shg_meetings_ibfk_1` FOREIGN KEY (`shg_group_id`) REFERENCES `shg_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shg_meetings_ibfk_2` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `shg_meetings_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shg_meetings`
--

LOCK TABLES `shg_meetings` WRITE;
/*!40000 ALTER TABLE `shg_meetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `shg_meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shg_members`
--

DROP TABLE IF EXISTS `shg_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shg_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shg_group_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `join_date` date NOT NULL,
  `membership_status` enum('active','inactive','exited') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `exit_date` date DEFAULT NULL,
  `exit_reason` text COLLATE utf8mb4_unicode_ci,
  `position` enum('member','chairperson','vice_chairperson','secretary','treasurer','committee_member') COLLATE utf8mb4_unicode_ci DEFAULT 'member',
  `total_savings` decimal(15,2) DEFAULT '0.00',
  `total_shares` int DEFAULT '0',
  `loans_taken` int DEFAULT '0',
  `loans_repaid` int DEFAULT '0',
  `current_loan_balance` decimal(15,2) DEFAULT '0.00',
  `trainings_attended` int DEFAULT '0',
  `last_training_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_member` (`shg_group_id`,`beneficiary_id`),
  KEY `idx_group` (`shg_group_id`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  KEY `idx_status` (`membership_status`),
  CONSTRAINT `shg_members_ibfk_1` FOREIGN KEY (`shg_group_id`) REFERENCES `shg_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shg_members_ibfk_2` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shg_members`
--

LOCK TABLES `shg_members` WRITE;
/*!40000 ALTER TABLE `shg_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `shg_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_history`
--

DROP TABLE IF EXISTS `status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('activity','component','sub_program','module') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `old_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_progress` int DEFAULT NULL,
  `new_progress` int DEFAULT NULL,
  `change_type` enum('auto','manual','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `change_reason` text COLLATE utf8mb4_unicode_ci,
  `override_applied` tinyint(1) DEFAULT '0',
  `changed_by` int DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_change_date` (`changed_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_history`
--

LOCK TABLES `status_history` WRITE;
/*!40000 ALTER TABLE `status_history` DISABLE KEYS */;
INSERT INTO `status_history` VALUES (1,'activity',1,NULL,'on-track',0,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 06:57:45'),(2,'component',1,NULL,'on-track',0,100,'auto','1 activities in progress',0,NULL,'2026-01-08 06:57:45'),(3,'activity',2,NULL,'not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 07:03:31'),(4,'activity',1,NULL,'on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 07:57:34'),(5,'activity',1,NULL,'on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 08:47:54'),(6,'activity',1,NULL,'on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 10:06:20'),(7,'activity',1,'in-progress','on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 10:09:21'),(8,'activity',3,NULL,'not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 11:12:36'),(9,'activity',3,NULL,'not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 11:16:20'),(10,'activity',4,NULL,'not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 17:35:18'),(11,'activity',3,'in-progress','not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 18:10:27'),(12,'activity',3,'in-progress','not-started',100,0,'auto',NULL,0,NULL,'2026-01-08 18:10:35'),(13,'activity',4,'in-progress','not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 19:08:04'),(14,'activity',1,'blocked','on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 19:51:12'),(15,'component',1,'on-track','not-started',50,50,'auto','No activities started',0,NULL,'2026-01-08 19:51:15'),(16,'activity',2,'in-progress','not-started',0,0,'auto',NULL,0,NULL,'2026-01-08 19:51:24'),(17,'activity',1,'not-started','on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-08 19:51:53'),(18,'component',1,'not-started','on-track',25,25,'auto','1 activities in progress',0,NULL,'2026-01-08 19:51:53'),(19,'activity',4,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-13 11:26:53'),(20,'activity',1,'in-progress','on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-16 13:01:37'),(21,'component',1,'on-track','completed',100,100,'auto','All activities completed',0,NULL,'2026-01-16 13:01:56'),(22,'activity',1,'not-started','on-track',100,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2026-01-16 13:02:03'),(23,'component',1,'completed','on-track',100,100,'auto','1 activities in progress',0,NULL,'2026-01-16 13:02:03');
/*!40000 ALTER TABLE `status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `strategic_goals`
--

DROP TABLE IF EXISTS `strategic_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `strategic_goals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_goal_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `target_date` date NOT NULL,
  `progress_percentage` int DEFAULT '0',
  `status` enum('active','completed','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_goal_id` (`clickup_goal_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_target_date` (`target_date`),
  KEY `idx_clickup` (`clickup_goal_id`),
  CONSTRAINT `strategic_goals_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `goal_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `strategic_goals_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Strategic Goals (High-Level Objectives) - ClickUp Goals';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `strategic_goals`
--

LOCK TABLES `strategic_goals` WRITE;
/*!40000 ALTER TABLE `strategic_goals` DISABLE KEYS */;
INSERT INTO `strategic_goals` VALUES (1,1,'Reduce extreme poverty by 50% in target communities','Through livelihood programs, cash transfers, and economic empowerment initiatives',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(2,2,'Ensure food security for 20,000 vulnerable households','Through agricultural support, food assistance, and nutrition programs',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(3,3,'Provide quality health services to 50,000 people annually','Through health facilities support, community health workers, and health camps',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(4,4,'Improve Quality Education outcomes','Strategic goal to improve Quality Education outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(5,5,'Improve Gender Equality outcomes','Strategic goal to improve Gender Equality outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(6,6,'Improve WASH outcomes','Strategic goal to improve WASH outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(7,7,'Improve Economic Growth outcomes','Strategic goal to improve Economic Growth outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(8,8,'Improve Infrastructure Development outcomes','Strategic goal to improve Infrastructure Development outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(9,9,'Improve Peace & Justice outcomes','Strategic goal to improve Peace & Justice outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(10,10,'Improve Climate Action outcomes','Strategic goal to improve Climate Action outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(11,11,'Improve Protection outcomes','Strategic goal to improve Protection outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15'),(12,12,'Improve Community Empowerment outcomes','Strategic goal to improve Community Empowerment outcomes for vulnerable communities by 2027',NULL,NULL,NULL,NULL,'2027-12-31',0,'active',1,'pending',NULL,'2026-01-08 11:26:15','2026-01-08 11:26:15');
/*!40000 ALTER TABLE `strategic_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_activities`
--

DROP TABLE IF EXISTS `sub_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_activity_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_subtask_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','in-progress','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assigned_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_subtask_id` (`clickup_subtask_id`),
  KEY `idx_parent` (`parent_activity_id`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_subtask_id`),
  CONSTRAINT `sub_activities_ibfk_1` FOREIGN KEY (`parent_activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sub-Activities (Optional breakdown) - ClickUp Subtasks';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_activities`
--

LOCK TABLES `sub_activities` WRITE;
/*!40000 ALTER TABLE `sub_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_programs`
--

DROP TABLE IF EXISTS `sub_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `clickup_folder_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `actual_cost` decimal(15,2) DEFAULT '0.00',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `progress_percentage` int DEFAULT '0',
  `manager_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_beneficiaries` int DEFAULT NULL,
  `actual_beneficiaries` int DEFAULT '0',
  `location` json DEFAULT NULL COMMENT 'Geographic details',
  `status` enum('planning','active','on-hold','completed','cancelled','on-track','at-risk','delayed','off-track') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `logframe_outcome` text COLLATE utf8mb4_unicode_ci COMMENT 'Expected outcome statement',
  `outcome_indicators` text COLLATE utf8mb4_unicode_ci COMMENT 'Key outcome indicators (optional text summary)',
  `overall_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rolled-up status',
  `status_override` tinyint(1) DEFAULT '0',
  `auto_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manual_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_status_update` timestamp NULL DEFAULT NULL,
  `risk_level` enum('none','low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_folder_id` (`clickup_folder_id`),
  KEY `idx_module` (`module_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_clickup` (`clickup_folder_id`),
  CONSTRAINT `sub_programs_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sub_programs_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 2: Sub-Programs/Projects (Specific Initiatives) - ClickUp Folders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_programs`
--

LOCK TABLES `sub_programs` WRITE;
/*!40000 ALTER TABLE `sub_programs` DISABLE KEYS */;
INSERT INTO `sub_programs` VALUES (1,6,'Financial Planning & Budgeting','FPB-OO1','Financial Planning & Budgeting',NULL,20000.00,0.00,'2026-01-09','2026-12-31',100,'Jame Text',NULL,2000,0,'\"Nairobi\"','active','urgent',1,'pending',NULL,NULL,'2026-01-08 06:51:34','2026-01-16 13:02:03',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2026-01-16 13:02:03','none'),(2,6,'Financial Operations & Controls','CHI-002','Financial Operations & Controls',NULL,21000.00,0.00,'2026-01-05','2026-12-31',0,'Zach doe',NULL,2000,0,'\"Nairobi\"','active','high',1,'pending',NULL,NULL,'2026-01-08 07:17:16','2026-01-08 07:18:55',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'none'),(3,6,'Grants & Donor Financial Management','GDFM-003','Grants & Donor Financial Management',NULL,23000.00,0.00,'2026-01-01','2026-12-31',0,'Zach doe',NULL,NULL,0,'\"Nairobi\"','active','high',1,'pending',NULL,NULL,'2026-01-08 07:20:55','2026-01-08 07:20:55',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'none');
/*!40000 ALTER TABLE `sub_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_config`
--

DROP TABLE IF EXISTS `sync_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `clickup_api_token_encrypted` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `clickup_webhook_secret` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auto_sync_enabled` tinyint(1) DEFAULT '1',
  `sync_interval_minutes` int DEFAULT '15',
  `last_full_sync` datetime DEFAULT NULL,
  `last_push_sync` datetime DEFAULT NULL,
  `last_pull_sync` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_organization` (`organization_id`),
  CONSTRAINT `sync_config_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ClickUp API Configuration and Sync Settings';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_config`
--

LOCK TABLES `sync_config` WRITE;
/*!40000 ALTER TABLE `sync_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_conflicts`
--

DROP TABLE IF EXISTS `sync_conflicts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_conflicts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('program','project','activity','task','indicator','result') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `field_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `local_value` text COLLATE utf8mb4_unicode_ci,
  `clickup_value` text COLLATE utf8mb4_unicode_ci,
  `local_updated_at` datetime DEFAULT NULL,
  `clickup_updated_at` datetime DEFAULT NULL,
  `resolution_strategy` enum('pending','local_wins','clickup_wins','manual_merge') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `resolved_value` text COLLATE utf8mb4_unicode_ci,
  `resolved_by` int DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `detected_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_resolution` (`resolution_strategy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_conflicts`
--

LOCK TABLES `sync_conflicts` WRITE;
/*!40000 ALTER TABLE `sync_conflicts` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_conflicts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_log`
--

DROP TABLE IF EXISTS `sync_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operation_type` enum('create','update','delete','pull','push') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int DEFAULT NULL,
  `direction` enum('push','pull') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('success','failed','partial') COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `error_details` text COLLATE utf8mb4_unicode_ci,
  `sync_duration_ms` int DEFAULT NULL,
  `records_affected` int DEFAULT '1',
  `clickup_request_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clickup_response_code` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_log`
--

LOCK TABLES `sync_log` WRITE;
/*!40000 ALTER TABLE `sync_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_queue`
--

DROP TABLE IF EXISTS `sync_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operation_type` enum('create','update','delete') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` enum('program','project','activity','task','indicator','result') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `direction` enum('push','pull') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` int DEFAULT '5',
  `retry_count` int DEFAULT '0',
  `max_retries` int DEFAULT '3',
  `last_error` text COLLATE utf8mb4_unicode_ci,
  `scheduled_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_queue`
--

LOCK TABLES `sync_queue` WRITE;
/*!40000 ALTER TABLE `sync_queue` DISABLE KEYS */;
INSERT INTO `sync_queue` VALUES (1,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:53:52',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52'),(2,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:57:01',NULL,NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01'),(3,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:59:56',NULL,NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56'),(4,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 19:22:55',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55'),(5,'create','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 13:05:56',NULL,NULL,'2025-11-24 10:05:56','2025-11-24 10:05:56'),(6,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:32:42',NULL,NULL,'2025-11-24 11:32:42','2025-11-24 11:32:42'),(7,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:38:45',NULL,NULL,'2025-11-24 11:38:45','2025-11-24 11:38:45'),(8,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:03:43',NULL,NULL,'2025-11-24 14:03:43','2025-11-24 14:03:43'),(9,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:04:26',NULL,NULL,'2025-11-24 14:04:26','2025-11-24 14:04:26'),(10,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:06',NULL,NULL,'2025-11-24 14:15:06','2025-11-24 14:15:06'),(11,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:11',NULL,NULL,'2025-11-24 14:15:11','2025-11-24 14:15:11'),(12,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:14',NULL,NULL,'2025-11-24 14:15:14','2025-11-24 14:15:14'),(13,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:18',NULL,NULL,'2025-11-24 14:15:18','2025-11-24 14:15:18'),(14,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:22',NULL,NULL,'2025-11-24 14:15:22','2025-11-24 14:15:22'),(15,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:16:33',NULL,NULL,'2025-11-24 14:16:33','2025-11-24 14:16:33'),(16,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:01',NULL,NULL,'2025-11-24 14:37:01','2025-11-24 14:37:01'),(17,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:22',NULL,NULL,'2025-11-24 14:37:22','2025-11-24 14:37:22'),(18,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:08',NULL,NULL,'2025-11-24 14:44:08','2025-11-24 14:44:08'),(19,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:12',NULL,NULL,'2025-11-24 14:44:12','2025-11-24 14:44:12'),(20,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:14',NULL,NULL,'2025-11-24 14:44:14','2025-11-24 14:44:14'),(21,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 19:50:04',NULL,NULL,'2025-11-24 16:50:04','2025-11-24 16:50:04'),(22,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:03:54',NULL,NULL,'2025-11-24 17:03:54','2025-11-24 17:03:54'),(23,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2025-11-24 20:08:48',NULL,NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48'),(24,'create','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:20',NULL,NULL,'2025-11-24 17:11:20','2025-11-24 17:11:20'),(25,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:25',NULL,NULL,'2025-11-24 17:11:25','2025-11-24 17:11:25'),(26,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:30',NULL,NULL,'2025-11-24 17:11:30','2025-11-24 17:11:30'),(27,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:55',NULL,NULL,'2025-11-24 17:11:55','2025-11-24 17:11:55'),(28,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:01',NULL,NULL,'2025-11-24 17:12:01','2025-11-24 17:12:01'),(29,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:23',NULL,NULL,'2025-11-24 17:12:23','2025-11-24 17:12:23'),(30,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:13:19',NULL,NULL,'2025-11-24 17:13:19','2025-11-24 17:13:19'),(31,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:28:38',NULL,NULL,'2025-11-24 17:28:38','2025-11-24 17:28:38'),(32,'update','activity',14,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:15',NULL,NULL,'2025-11-24 18:01:15','2025-11-24 18:01:15'),(33,'update','activity',13,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:48',NULL,NULL,'2025-11-24 18:01:48','2025-11-24 18:01:48'),(34,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:05:41',NULL,NULL,'2025-11-24 18:05:41','2025-11-24 18:05:41'),(35,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:12:20',NULL,NULL,'2025-11-24 18:12:20','2025-11-24 18:12:20'),(36,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:13:59',NULL,NULL,'2025-11-24 18:13:59','2025-11-24 18:13:59'),(37,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:39',NULL,NULL,'2025-11-24 18:22:39','2025-11-24 18:22:39'),(38,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:56',NULL,NULL,'2025-11-24 18:22:56','2025-11-24 18:22:56'),(39,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:24:55',NULL,NULL,'2025-11-24 18:24:55','2025-11-24 18:24:55'),(40,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:32:25',NULL,NULL,'2025-11-24 18:32:25','2025-11-24 18:32:25'),(41,'update','activity',8,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:37',NULL,NULL,'2025-11-25 05:24:37','2025-11-25 05:24:37'),(42,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:57',NULL,NULL,'2025-11-25 05:24:57','2025-11-25 05:24:57'),(43,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:26:21',NULL,NULL,'2025-11-25 05:26:21','2025-11-25 05:26:21'),(44,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:11',NULL,NULL,'2025-11-25 06:28:11','2025-11-25 06:28:11'),(45,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:18',NULL,NULL,'2025-11-25 06:28:18','2025-11-25 06:28:18'),(46,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:26',NULL,NULL,'2025-11-25 06:28:26','2025-11-25 06:28:26'),(47,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:30:30',NULL,NULL,'2025-11-25 06:30:30','2025-11-25 06:30:30'),(48,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:31:19',NULL,NULL,'2025-11-25 06:31:19','2025-11-25 06:31:19'),(49,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:39:52',NULL,NULL,'2025-11-25 06:39:52','2025-11-25 06:39:52'),(50,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:11:31',NULL,NULL,'2025-11-25 10:11:31','2025-11-25 10:11:31'),(51,'create','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:45:53',NULL,NULL,'2025-11-25 10:45:53','2025-11-25 10:45:53'),(52,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:46:13',NULL,NULL,'2025-11-25 10:46:13','2025-11-25 10:46:13'),(53,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:53:31',NULL,NULL,'2025-11-25 10:53:31','2025-11-25 10:53:31'),(54,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:54:07',NULL,NULL,'2025-11-25 10:54:07','2025-11-25 10:54:07'),(55,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:59:25',NULL,NULL,'2025-11-25 10:59:25','2025-11-25 10:59:25'),(56,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:04:00',NULL,NULL,'2025-11-25 11:04:00','2025-11-25 11:04:00'),(57,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:05:55',NULL,NULL,'2025-11-25 11:05:55','2025-11-25 11:05:55'),(58,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:13:26',NULL,NULL,'2025-11-25 16:13:26','2025-11-25 16:13:26'),(59,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:26:39',NULL,NULL,'2025-11-25 16:26:39','2025-11-25 16:26:39'),(60,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:39',NULL,NULL,'2025-11-25 17:54:39','2025-11-25 17:54:39'),(61,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:43',NULL,NULL,'2025-11-25 17:54:43','2025-11-25 17:54:43'),(62,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:55:35',NULL,NULL,'2025-11-25 17:55:35','2025-11-25 17:55:35'),(63,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:20',NULL,NULL,'2025-11-27 06:43:20','2025-11-27 06:43:20'),(64,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:29',NULL,NULL,'2025-11-27 06:43:29','2025-11-27 06:43:29'),(65,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 10:50:16',NULL,NULL,'2025-11-27 07:50:16','2025-11-27 07:50:16'),(66,'create','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 09:36:48',NULL,NULL,'2025-12-04 06:36:48','2025-12-04 06:36:48'),(67,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:00:13',NULL,NULL,'2025-12-04 09:00:13','2025-12-04 09:00:13'),(68,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:14:53',NULL,NULL,'2025-12-04 09:14:53','2025-12-04 09:14:53'),(69,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:15:20',NULL,NULL,'2025-12-04 09:15:20','2025-12-04 09:15:20'),(70,'create','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:11:40',NULL,NULL,'2025-12-06 15:11:40','2025-12-06 15:11:40'),(71,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:12:48',NULL,NULL,'2025-12-06 15:12:48','2025-12-06 15:12:48'),(72,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:13:12',NULL,NULL,'2025-12-06 15:13:12','2025-12-06 15:13:12'),(73,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:45',NULL,NULL,'2025-12-06 15:14:45','2025-12-06 15:14:45'),(74,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:58',NULL,NULL,'2025-12-06 15:14:58','2025-12-06 15:14:58'),(75,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:15:43',NULL,NULL,'2025-12-06 15:15:43','2025-12-06 15:15:43'),(76,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:17:25',NULL,NULL,'2025-12-06 15:17:25','2025-12-06 15:17:25'),(77,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 18:26:29',NULL,NULL,'2025-12-09 15:26:29','2025-12-09 15:26:29'),(78,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 18:26:33',NULL,NULL,'2025-12-09 15:26:33','2025-12-09 15:26:33'),(79,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 19:02:03',NULL,NULL,'2025-12-09 16:02:03','2025-12-09 16:02:03'),(80,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 19:18:00',NULL,NULL,'2025-12-09 16:18:00','2025-12-09 16:18:00'),(81,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 21:44:14',NULL,NULL,'2025-12-09 18:44:14','2025-12-09 18:44:14'),(82,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 21:53:56',NULL,NULL,'2025-12-09 18:53:56','2025-12-09 18:53:56'),(83,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:07',NULL,NULL,'2025-12-09 19:05:07','2025-12-09 19:05:07'),(84,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:37',NULL,NULL,'2025-12-09 19:05:37','2025-12-09 19:05:37'),(85,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:55',NULL,NULL,'2025-12-09 19:05:55','2025-12-09 19:05:55'),(86,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:06:29',NULL,NULL,'2025-12-09 19:06:29','2025-12-09 19:06:29'),(87,'create','',24,'push',NULL,'pending',5,0,3,NULL,'2025-12-10 06:56:46',NULL,NULL,'2025-12-10 03:56:46','2025-12-10 03:56:46'),(88,'create','activity',30,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:00:23',NULL,NULL,'2025-12-10 04:00:23','2025-12-10 04:00:23'),(89,'delete','activity',30,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:02:03',NULL,NULL,'2025-12-10 04:02:03','2025-12-10 04:02:03'),(90,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:17:54',NULL,NULL,'2025-12-10 04:17:54','2025-12-10 04:17:54'),(91,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:20:05',NULL,NULL,'2025-12-10 04:20:05','2025-12-10 04:20:05'),(92,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:21',NULL,NULL,'2025-12-11 09:27:21','2025-12-11 09:27:21'),(93,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:27',NULL,NULL,'2025-12-11 09:27:27','2025-12-11 09:27:27'),(94,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:42',NULL,NULL,'2025-12-11 09:27:42','2025-12-11 09:27:42'),(95,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:28:21',NULL,NULL,'2025-12-11 09:28:21','2025-12-11 09:28:21'),(96,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:46:10',NULL,NULL,'2025-12-11 17:46:10','2025-12-11 17:46:10'),(97,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:37',NULL,NULL,'2025-12-11 17:47:37','2025-12-11 17:47:37'),(98,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:40',NULL,NULL,'2025-12-11 17:47:40','2025-12-11 17:47:40'),(99,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:42',NULL,NULL,'2025-12-11 17:47:42','2025-12-11 17:47:42'),(100,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:56',NULL,NULL,'2025-12-11 17:47:56','2025-12-11 17:47:56'),(101,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:01',NULL,NULL,'2025-12-11 17:48:01','2025-12-11 17:48:01'),(102,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:04',NULL,NULL,'2025-12-11 17:48:04','2025-12-11 17:48:04'),(103,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:06',NULL,NULL,'2025-12-11 17:48:06','2025-12-11 17:48:06'),(104,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:09',NULL,NULL,'2025-12-11 17:48:09','2025-12-11 17:48:09'),(105,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:11',NULL,NULL,'2025-12-11 17:48:11','2025-12-11 17:48:11'),(106,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:51:57',NULL,NULL,'2025-12-11 17:51:57','2025-12-11 17:51:57'),(107,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:27',NULL,NULL,'2025-12-11 17:53:27','2025-12-11 17:53:27'),(108,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:37',NULL,NULL,'2025-12-11 17:53:37','2025-12-11 17:53:37'),(109,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:56',NULL,NULL,'2025-12-11 17:53:56','2025-12-11 17:53:56'),(110,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:54:29',NULL,NULL,'2025-12-11 17:54:29','2025-12-11 17:54:29'),(111,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:54:45',NULL,NULL,'2025-12-11 17:54:45','2025-12-11 17:54:45'),(112,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:01:10',NULL,NULL,'2025-12-11 18:01:10','2025-12-11 18:01:10'),(113,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:02:11',NULL,NULL,'2025-12-11 18:02:11','2025-12-11 18:02:11'),(114,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:18:44',NULL,NULL,'2025-12-11 18:18:44','2025-12-11 18:18:44'),(115,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:20:29',NULL,NULL,'2025-12-11 18:20:29','2025-12-11 18:20:29'),(116,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:41:44',NULL,NULL,'2025-12-11 18:41:44','2025-12-11 18:41:44'),(117,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:01',NULL,NULL,'2025-12-11 18:42:01','2025-12-11 18:42:01'),(118,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:10',NULL,NULL,'2025-12-11 18:42:10','2025-12-11 18:42:10'),(119,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:36',NULL,NULL,'2025-12-11 18:42:36','2025-12-11 18:42:36'),(120,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:06',NULL,NULL,'2025-12-11 18:52:06','2025-12-11 18:52:06'),(121,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:16',NULL,NULL,'2025-12-11 18:52:16','2025-12-11 18:52:16'),(122,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:26',NULL,NULL,'2025-12-11 18:52:26','2025-12-11 18:52:26'),(123,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:53:08',NULL,NULL,'2025-12-11 18:53:08','2025-12-11 18:53:08'),(124,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:11:09',NULL,NULL,'2025-12-11 19:11:09','2025-12-11 19:11:09'),(125,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:17:31',NULL,NULL,'2025-12-11 19:17:31','2025-12-11 19:17:31'),(126,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:07',NULL,NULL,'2025-12-11 19:34:07','2025-12-11 19:34:07'),(127,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:10',NULL,NULL,'2025-12-11 19:34:10','2025-12-11 19:34:10'),(128,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:15',NULL,NULL,'2025-12-11 19:34:15','2025-12-11 19:34:15'),(129,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:47',NULL,NULL,'2025-12-11 19:34:47','2025-12-11 19:34:47'),(130,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:35:31',NULL,NULL,'2025-12-11 19:35:31','2025-12-11 19:35:31'),(131,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:36:36',NULL,NULL,'2025-12-11 19:36:36','2025-12-11 19:36:36'),(132,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:40:50',NULL,NULL,'2025-12-11 19:40:50','2025-12-11 19:40:50'),(133,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:41:01',NULL,NULL,'2025-12-11 19:41:01','2025-12-11 19:41:01'),(134,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:44:40',NULL,NULL,'2025-12-11 19:44:40','2025-12-11 19:44:40'),(135,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:45:04',NULL,NULL,'2025-12-11 19:45:04','2025-12-11 19:45:04'),(136,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:49:33',NULL,NULL,'2025-12-11 19:49:33','2025-12-11 19:49:33'),(137,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:49:41',NULL,NULL,'2025-12-11 19:49:41','2025-12-11 19:49:41'),(138,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:51:45',NULL,NULL,'2025-12-11 19:51:45','2025-12-11 19:51:45'),(139,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:51:47',NULL,NULL,'2025-12-11 19:51:47','2025-12-11 19:51:47'),(140,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:23',NULL,NULL,'2025-12-11 19:52:23','2025-12-11 19:52:23'),(141,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:27',NULL,NULL,'2025-12-11 19:52:27','2025-12-11 19:52:27'),(142,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:31',NULL,NULL,'2025-12-11 19:52:31','2025-12-11 19:52:31'),(143,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:43',NULL,NULL,'2025-12-11 19:52:43','2025-12-11 19:52:43'),(144,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:54:08',NULL,NULL,'2025-12-11 19:54:08','2025-12-11 19:54:08'),(145,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:25',NULL,NULL,'2025-12-11 20:02:25','2025-12-11 20:02:25'),(146,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:28',NULL,NULL,'2025-12-11 20:02:28','2025-12-11 20:02:28'),(147,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:44',NULL,NULL,'2025-12-11 20:02:44','2025-12-11 20:02:44'),(148,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:05',NULL,NULL,'2025-12-11 20:03:05','2025-12-11 20:03:05'),(149,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:10',NULL,NULL,'2025-12-11 20:03:10','2025-12-11 20:03:10'),(150,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:43',NULL,NULL,'2025-12-11 20:03:43','2025-12-11 20:03:43'),(151,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:18',NULL,NULL,'2025-12-12 05:44:18','2025-12-12 05:44:18'),(152,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:21',NULL,NULL,'2025-12-12 05:44:21','2025-12-12 05:44:21'),(153,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:35',NULL,NULL,'2025-12-12 05:44:35','2025-12-12 05:44:35'),(154,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:41',NULL,NULL,'2025-12-12 05:44:41','2025-12-12 05:44:41'),(155,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:45',NULL,NULL,'2025-12-12 05:44:45','2025-12-12 05:44:45'),(156,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:10:54',NULL,NULL,'2025-12-13 06:10:54','2025-12-13 06:10:54'),(157,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:12:28',NULL,NULL,'2025-12-13 06:12:28','2025-12-13 06:12:28'),(158,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:18:39',NULL,NULL,'2025-12-13 06:18:39','2025-12-13 06:18:39'),(159,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 10:15:57',NULL,NULL,'2025-12-13 07:15:57','2025-12-13 07:15:57'),(160,'update','activity',23,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 10:53:10',NULL,NULL,'2025-12-13 07:53:10','2025-12-13 07:53:10'),(161,'update','activity',23,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:06:40',NULL,NULL,'2025-12-13 08:06:40','2025-12-13 08:06:40'),(162,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:11:44',NULL,NULL,'2025-12-13 08:11:44','2025-12-13 08:11:44'),(163,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:14:44',NULL,NULL,'2025-12-13 08:14:44','2025-12-13 08:14:44'),(164,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:16:11',NULL,NULL,'2025-12-13 08:16:11','2025-12-13 08:16:11'),(165,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:16:45',NULL,NULL,'2025-12-13 08:16:45','2025-12-13 08:16:45'),(166,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:35:10',NULL,NULL,'2025-12-13 08:35:10','2025-12-13 08:35:10'),(167,'create','',23,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 14:20:33',NULL,NULL,'2025-12-15 11:20:33','2025-12-15 11:20:33'),(168,'create','',25,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 14:21:10',NULL,NULL,'2025-12-15 11:21:10','2025-12-15 11:21:10'),(169,'create','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:22:17',NULL,NULL,'2025-12-15 11:22:17','2025-12-15 11:22:17'),(170,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:43:38',NULL,NULL,'2025-12-15 11:43:38','2025-12-15 11:43:38'),(171,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:44:12',NULL,NULL,'2025-12-15 11:44:12','2025-12-15 11:44:12'),(172,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:04:00',NULL,NULL,'2025-12-15 12:04:00','2025-12-15 12:04:00'),(173,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:07:03',NULL,NULL,'2025-12-15 12:07:03','2025-12-15 12:07:03'),(174,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:07:34',NULL,NULL,'2025-12-15 12:07:34','2025-12-15 12:07:34'),(175,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:08:14',NULL,NULL,'2025-12-15 12:08:14','2025-12-15 12:08:14'),(176,'create','',26,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 15:11:36',NULL,NULL,'2025-12-15 12:11:36','2025-12-15 12:11:36'),(177,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 20:59:32',NULL,NULL,'2025-12-15 17:59:32','2025-12-15 17:59:32'),(178,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 20:59:37',NULL,NULL,'2025-12-15 17:59:37','2025-12-15 17:59:37'),(179,'create','activity',32,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:27:24',NULL,NULL,'2025-12-16 06:27:24','2025-12-16 06:27:24'),(180,'create','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:36:08',NULL,NULL,'2025-12-16 06:36:08','2025-12-16 06:36:08'),(181,'create','activity',34,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:45:59',NULL,NULL,'2025-12-16 06:45:59','2025-12-16 06:45:59'),(182,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:40:58',NULL,NULL,'2025-12-16 07:40:58','2025-12-16 07:40:58'),(183,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:41:14',NULL,NULL,'2025-12-16 07:41:14','2025-12-16 07:41:14'),(184,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:42:08',NULL,NULL,'2025-12-16 07:42:08','2025-12-16 07:42:08'),(185,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:39:11',NULL,NULL,'2026-01-05 08:39:11','2026-01-05 08:39:11'),(186,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:40:23',NULL,NULL,'2026-01-05 08:40:23','2026-01-05 08:40:23'),(187,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:40:47',NULL,NULL,'2026-01-05 08:40:47','2026-01-05 08:40:47'),(188,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:40:55',NULL,NULL,'2026-01-05 08:40:55','2026-01-05 08:40:55'),(189,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:40:58',NULL,NULL,'2026-01-05 08:40:58','2026-01-05 08:40:58'),(190,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:01',NULL,NULL,'2026-01-05 08:41:01','2026-01-05 08:41:01'),(191,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:10',NULL,NULL,'2026-01-05 08:41:10','2026-01-05 08:41:10'),(192,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:20',NULL,NULL,'2026-01-05 08:41:20','2026-01-05 08:41:20'),(193,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:24',NULL,NULL,'2026-01-05 08:41:24','2026-01-05 08:41:24'),(194,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:32',NULL,NULL,'2026-01-05 08:41:32','2026-01-05 08:41:32'),(195,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2026-01-05 11:41:38',NULL,NULL,'2026-01-05 08:41:38','2026-01-05 08:41:38'),(196,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2026-01-08 09:51:34',NULL,NULL,'2026-01-08 06:51:34','2026-01-08 06:51:34'),(197,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2026-01-08 09:53:46',NULL,NULL,'2026-01-08 06:53:46','2026-01-08 06:53:46'),(198,'create','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 09:57:45',NULL,NULL,'2026-01-08 06:57:45','2026-01-08 06:57:45'),(199,'create','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:03:31',NULL,NULL,'2026-01-08 07:03:31','2026-01-08 07:03:31'),(200,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2026-01-08 10:17:16',NULL,NULL,'2026-01-08 07:17:16','2026-01-08 07:17:16'),(201,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2026-01-08 10:20:56',NULL,NULL,'2026-01-08 07:20:56','2026-01-08 07:20:56'),(202,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:31:32',NULL,NULL,'2026-01-08 07:31:32','2026-01-08 07:31:32'),(203,'update','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:31:47',NULL,NULL,'2026-01-08 07:31:47','2026-01-08 07:31:47'),(204,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:32:15',NULL,NULL,'2026-01-08 07:32:15','2026-01-08 07:32:15'),(205,'update','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:32:17',NULL,NULL,'2026-01-08 07:32:17','2026-01-08 07:32:17'),(206,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 10:57:34',NULL,NULL,'2026-01-08 07:57:34','2026-01-08 07:57:34'),(207,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 11:47:54',NULL,NULL,'2026-01-08 08:47:54','2026-01-08 08:47:54'),(208,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 13:06:20',NULL,NULL,'2026-01-08 10:06:20','2026-01-08 10:06:20'),(209,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 13:09:21',NULL,NULL,'2026-01-08 10:09:21','2026-01-08 10:09:21'),(210,'create','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 14:12:36',NULL,NULL,'2026-01-08 11:12:36','2026-01-08 11:12:36'),(211,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 14:12:48',NULL,NULL,'2026-01-08 11:12:48','2026-01-08 11:12:48'),(212,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 14:16:20',NULL,NULL,'2026-01-08 11:16:20','2026-01-08 11:16:20'),(213,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 14:21:47',NULL,NULL,'2026-01-08 11:21:47','2026-01-08 11:21:47'),(214,'create','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 20:35:18',NULL,NULL,'2026-01-08 17:35:18','2026-01-08 17:35:18'),(215,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 21:10:27',NULL,NULL,'2026-01-08 18:10:27','2026-01-08 18:10:27'),(216,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 21:10:32',NULL,NULL,'2026-01-08 18:10:32','2026-01-08 18:10:32'),(217,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 21:10:35',NULL,NULL,'2026-01-08 18:10:35','2026-01-08 18:10:35'),(218,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 21:11:00',NULL,NULL,'2026-01-08 18:11:00','2026-01-08 18:11:00'),(219,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 21:46:07',NULL,NULL,'2026-01-08 18:46:07','2026-01-08 18:46:07'),(220,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:08:04',NULL,NULL,'2026-01-08 19:08:04','2026-01-08 19:08:04'),(221,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:42:58',NULL,NULL,'2026-01-08 19:42:58','2026-01-08 19:42:58'),(222,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:12',NULL,NULL,'2026-01-08 19:51:12','2026-01-08 19:51:12'),(223,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:15',NULL,NULL,'2026-01-08 19:51:15','2026-01-08 19:51:15'),(224,'update','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:24',NULL,NULL,'2026-01-08 19:51:24','2026-01-08 19:51:24'),(225,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:41',NULL,NULL,'2026-01-08 19:51:41','2026-01-08 19:51:41'),(226,'update','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:44',NULL,NULL,'2026-01-08 19:51:44','2026-01-08 19:51:44'),(227,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:50',NULL,NULL,'2026-01-08 19:51:50','2026-01-08 19:51:50'),(228,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-08 22:51:53',NULL,NULL,'2026-01-08 19:51:53','2026-01-08 19:51:53'),(229,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-13 14:26:53',NULL,NULL,'2026-01-13 11:26:53','2026-01-13 11:26:53'),(230,'update','activity',3,'push',NULL,'pending',3,0,3,NULL,'2026-01-14 13:28:51',NULL,NULL,'2026-01-14 10:28:51','2026-01-14 10:28:51'),(231,'update','activity',2,'push',NULL,'pending',3,0,3,NULL,'2026-01-16 11:26:29',NULL,NULL,'2026-01-16 08:26:29','2026-01-16 08:26:29'),(232,'update','activity',4,'push',NULL,'pending',3,0,3,NULL,'2026-01-16 11:33:22',NULL,NULL,'2026-01-16 08:33:22','2026-01-16 08:33:22'),(233,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-16 16:01:37',NULL,NULL,'2026-01-16 13:01:37','2026-01-16 13:01:37'),(234,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-16 16:01:56',NULL,NULL,'2026-01-16 13:01:56','2026-01-16 13:01:56'),(235,'update','activity',1,'push',NULL,'pending',3,0,3,NULL,'2026-01-16 16:02:03',NULL,NULL,'2026-01-16 13:02:03','2026-01-16 13:02:03');
/*!40000 ALTER TABLE `sync_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_status`
--

DROP TABLE IF EXISTS `sync_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('program','project','activity','task','indicator','result') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
  `status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `last_sync_direction` enum('push','pull') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_error` text COLLATE utf8mb4_unicode_ci,
  `error_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_status`
--

LOCK TABLES `sync_status` WRITE;
/*!40000 ALTER TABLE `sync_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_task_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activity_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `program_id` int DEFAULT NULL,
  `list_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` bigint DEFAULT NULL,
  `start_date` bigint DEFAULT NULL,
  `time_estimate` bigint DEFAULT NULL,
  `progress_percentage` int DEFAULT '0',
  `sync_status` enum('synced','pending','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_task_id` (`clickup_task_id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_clickup_task` (`clickup_task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_shares`
--

DROP TABLE IF EXISTS `theme_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_shares` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `theme_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shared_with_user_id` int NOT NULL,
  `shared_by_user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_theme_share` (`theme_id`,`shared_with_user_id`),
  KEY `idx_theme_share_with` (`shared_with_user_id`),
  KEY `fk_theme_shares_by` (`shared_by_user_id`),
  CONSTRAINT `fk_theme_shares_by` FOREIGN KEY (`shared_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_theme_shares_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_theme_shares_with` FOREIGN KEY (`shared_with_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_shares`
--

LOCK TABLES `theme_shares` WRITE;
/*!40000 ALTER TABLE `theme_shares` DISABLE KEYS */;
INSERT INTO `theme_shares` VALUES (1,'custom-1768330164164',2,1,'2026-01-13 18:56:58');
/*!40000 ALTER TABLE `theme_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `themes` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colors` json NOT NULL,
  `is_custom` tinyint(1) DEFAULT '0',
  `is_default` tinyint(1) DEFAULT '0',
  `owner_user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_theme_owner` (`owner_user_id`),
  KEY `idx_theme_default` (`is_default`),
  CONSTRAINT `fk_themes_owner` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
INSERT INTO `themes` VALUES ('custom-1768330164164','Awesome','Custom Theme','🎪','{\"cardBg\": \"#e9e9f1\", \"mainBg1\": \"#174444\", \"mainBg2\": \"#0f3460\", \"mainText\": \"#5f3a3a\", \"cardBorder\": \"#00fff5\", \"cardShadow\": \"0 4px 15px rgba(0, 0, 0, 0.3)\", \"sidebarBg1\": \"#1b5043\", \"sidebarBg2\": \"#32264f\", \"sidebarText\": \"#e6e6e6\", \"sidebarHover\": \"#004cff1a\", \"accentPrimary\": \"#004cff\", \"accentGradient\": \"linear-gradient(135deg, #004cff 0%, #3a5f5f 100%)\", \"cardBackground\": \"#e9e9f1\", \"mainBackground\": \"linear-gradient(to bottom, #174444, #0f3460)\", \"accentSecondary\": \"#3a5f5f\", \"sidebarActiveBg\": \"#004cff\", \"programIconColor\": \"#004cff\", \"programCardBorder\": \"#004cff\", \"sidebarActiveItem\": \"#004cff33\", \"sidebarBackground\": \"linear-gradient(180deg, #1b5043 0%, #32264f 100%)\", \"activityCardBorder\": \"#004cff\", \"programStatusColor\": \"#004cff\", \"statCardBackground\": \"#e9e9f1\", \"sidebarActiveBorder\": \"#00fff5\", \"statCardBorderColor\": \"linear-gradient(to bottom, #004cff, #3a5f5f)\", \"programCardBackground\": \"#e9e9f1\", \"programIconBackground\": \"#004cff33\", \"activityCardBackground\": \"#004cff1a\", \"programStatusBackground\": \"#004cff33\"}',0,1,1,'2026-01-13 18:49:24','2026-01-14 11:51:29'),('theme-1','Ocean Breeze','Professional Purple/Blue','🌊','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(102, 126, 234, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(102, 126, 234, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#667eea\", \"accentGradient\": \"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #f7fafc, #edf2f7)\", \"accentSecondary\": \"#764ba2\", \"programIconColor\": \"#667eea\", \"programCardBorder\": \"#667eea\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #667eea 0%, #5a67d8 100%)\", \"activityCardBorder\": \"#667eea\", \"programStatusColor\": \"#667eea\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #667eea, #764ba2)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(102, 126, 234, 0.1)\", \"activityCardBackground\": \"rgba(102, 126, 234, 0.05)\", \"programStatusBackground\": \"rgba(102, 126, 234, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-10','Amber Sunrise','Orange/Gold Warm','🌅','{\"cardBg\": \"#928c54\", \"mainBg1\": \"#e8d173\", \"mainBg2\": \"#545040\", \"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(243, 156, 18, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(0, 0, 0, 0.3)\", \"sidebarBg1\": \"#d68910\", \"sidebarBg2\": \"#f39c12\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"#f39c121a\", \"accentPrimary\": \"#f39c12\", \"accentGradient\": \"linear-gradient(135deg, #f39c12 0%, #e67e22 100%)\", \"cardBackground\": \"#928c54\", \"mainBackground\": \"linear-gradient(to bottom, #e8d173, #545040)\", \"accentSecondary\": \"#e67e22\", \"sidebarActiveBg\": \"#f39c12\", \"programIconColor\": \"#f39c12\", \"programCardBorder\": \"#f39c12\", \"sidebarActiveItem\": \"#f39c1233\", \"sidebarBackground\": \"linear-gradient(180deg, #d68910 0%, #f39c12 100%)\", \"activityCardBorder\": \"#f39c12\", \"programStatusColor\": \"#f39c12\", \"statCardBackground\": \"#928c54\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #f39c12, #e67e22)\", \"programCardBackground\": \"#928c54\", \"programIconBackground\": \"#f39c1233\", \"activityCardBackground\": \"#f39c121a\", \"programStatusBackground\": \"#f39c1233\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 19:20:42'),('theme-2','Dark Professional','Modern Cyan/Black','🌙','{\"mainText\": \"#e0e0e0\", \"cardBorder\": \"rgba(0, 255, 245, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(0, 0, 0, 0.3)\", \"sidebarText\": \"#e0e0e0\", \"sidebarHover\": \"rgba(0, 255, 245, 0.05)\", \"accentPrimary\": \"#00fff5\", \"accentGradient\": \"linear-gradient(135deg, #00fff5 0%, #00d4d4 100%)\", \"cardBackground\": \"rgba(255, 255, 255, 0.05)\", \"mainBackground\": \"linear-gradient(to bottom, #16213e, #0f3460)\", \"accentSecondary\": \"#00d4d4\", \"programIconColor\": \"#00fff5\", \"programCardBorder\": \"#00fff5\", \"sidebarActiveItem\": \"rgba(0, 255, 245, 0.1)\", \"sidebarBackground\": \"linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)\", \"activityCardBorder\": \"#00fff5\", \"programStatusColor\": \"#00fff5\", \"statCardBackground\": \"rgba(255, 255, 255, 0.05)\", \"sidebarActiveBorder\": \"#00fff5\", \"statCardBorderColor\": \"linear-gradient(to bottom, #00fff5, #00d4d4)\", \"programCardBackground\": \"rgba(255, 255, 255, 0.05)\", \"programIconBackground\": \"rgba(0, 255, 245, 0.2)\", \"activityCardBackground\": \"rgba(0, 255, 245, 0.1)\", \"programStatusBackground\": \"rgba(0, 255, 245, 0.2)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-3','Sunset Warmth','Pink/Coral Gradient','🌅','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(245, 87, 108, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(245, 87, 108, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#f5576c\", \"accentGradient\": \"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #fff5f7, #ffe8ec)\", \"accentSecondary\": \"#f093fb\", \"programIconColor\": \"#f5576c\", \"programCardBorder\": \"#f5576c\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #f093fb 0%, #f5576c 100%)\", \"activityCardBorder\": \"#f5576c\", \"programStatusColor\": \"#f5576c\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #f093fb, #f5576c)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(245, 87, 108, 0.1)\", \"activityCardBackground\": \"rgba(245, 87, 108, 0.05)\", \"programStatusBackground\": \"rgba(245, 87, 108, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-4','Forest Green','Teal/Green Natural','🌲','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(17, 153, 142, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(17, 153, 142, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#11998e\", \"accentGradient\": \"linear-gradient(135deg, #11998e 0%, #38ef7d 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #f0fff4, #e6ffed)\", \"accentSecondary\": \"#38ef7d\", \"programIconColor\": \"#11998e\", \"programCardBorder\": \"#11998e\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #0d7377 0%, #11998e 100%)\", \"activityCardBorder\": \"#11998e\", \"programStatusColor\": \"#11998e\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #11998e, #38ef7d)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(17, 153, 142, 0.1)\", \"activityCardBackground\": \"rgba(17, 153, 142, 0.05)\", \"programStatusBackground\": \"rgba(17, 153, 142, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-5','Elegant Black & Gold','Luxury Premium','✨','{\"cardBg\": \"rgba(255, 215, 0, 0.05)\", \"mainBg1\": \"#1a1a1a\", \"mainBg2\": \"#000000\", \"mainText\": \"#e0e0e0\", \"cardBorder\": \"rgba(255, 215, 0, 0.3)\", \"cardShadow\": \"0 4px 15px rgba(0, 0, 0, 0.3)\", \"sidebarBg1\": \"#000000\", \"sidebarBg2\": \"#1a1a1a\", \"sidebarText\": \"#ffd700\", \"sidebarHover\": \"#ffd7001a\", \"accentPrimary\": \"#5c500a\", \"accentGradient\": \"linear-gradient(135deg, #5c500a 0%, #6e6302 100%)\", \"cardBackground\": \"rgba(255, 215, 0, 0.05)\", \"mainBackground\": \"linear-gradient(to bottom, #1a1a1a, #000000)\", \"accentSecondary\": \"#6e6302\", \"sidebarActiveBg\": \"#ffd700\", \"programIconColor\": \"#5c500a\", \"programCardBorder\": \"#5c500a\", \"sidebarActiveItem\": \"#ffd70033\", \"sidebarBackground\": \"linear-gradient(180deg, #000000 0%, #1a1a1a 100%)\", \"activityCardBorder\": \"#5c500a\", \"programStatusColor\": \"#5c500a\", \"statCardBackground\": \"rgba(255, 215, 0, 0.05)\", \"sidebarActiveBorder\": \"#ffd700\", \"statCardBorderColor\": \"linear-gradient(to bottom, #5c500a, #6e6302)\", \"programCardBackground\": \"rgba(255, 215, 0, 0.05)\", \"programIconBackground\": \"#5c500a33\", \"activityCardBackground\": \"#5c500a1a\", \"programStatusBackground\": \"#5c500a33\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-14 07:47:38'),('theme-6','Modern Blue','Corporate Clean','💎','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(79, 172, 254, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(79, 172, 254, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#4facfe\", \"accentGradient\": \"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #f0f9ff, #e0f2fe)\", \"accentSecondary\": \"#00f2fe\", \"programIconColor\": \"#4facfe\", \"programCardBorder\": \"#4facfe\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #2196f3 0%, #4facfe 100%)\", \"activityCardBorder\": \"#4facfe\", \"programStatusColor\": \"#4facfe\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #4facfe, #00f2fe)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(79, 172, 254, 0.1)\", \"activityCardBackground\": \"rgba(79, 172, 254, 0.05)\", \"programStatusBackground\": \"rgba(79, 172, 254, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-7','Royal Purple','Bold Sophisticated','👑','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(142, 45, 226, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(142, 45, 226, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#8e2de2\", \"accentGradient\": \"linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #faf5ff, #f3e8ff)\", \"accentSecondary\": \"#4a00e0\", \"programIconColor\": \"#8e2de2\", \"programCardBorder\": \"#8e2de2\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #6a00f4 0%, #8e2de2 100%)\", \"activityCardBorder\": \"#8e2de2\", \"programStatusColor\": \"#8e2de2\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #8e2de2, #4a00e0)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(142, 45, 226, 0.1)\", \"activityCardBackground\": \"rgba(142, 45, 226, 0.05)\", \"programStatusBackground\": \"rgba(142, 45, 226, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-8','Coral Reef','Warm Red Tones','🌺','{\"mainText\": \"#2d3748\", \"cardBorder\": \"rgba(255, 107, 107, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(255, 107, 107, 0.1)\", \"sidebarText\": \"#ffffff\", \"sidebarHover\": \"rgba(255,255,255,0.1)\", \"accentPrimary\": \"#ff6b6b\", \"accentGradient\": \"linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #fff5f5, #ffe3e3)\", \"accentSecondary\": \"#ee5a6f\", \"programIconColor\": \"#ff6b6b\", \"programCardBorder\": \"#ff6b6b\", \"sidebarActiveItem\": \"rgba(255,255,255,0.2)\", \"sidebarBackground\": \"linear-gradient(180deg, #c92a2a 0%, #ff6b6b 100%)\", \"activityCardBorder\": \"#ff6b6b\", \"programStatusColor\": \"#ff6b6b\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#ffffff\", \"statCardBorderColor\": \"linear-gradient(to bottom, #ff6b6b, #ee5a6f)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(255, 107, 107, 0.1)\", \"activityCardBackground\": \"rgba(255, 107, 107, 0.05)\", \"programStatusBackground\": \"rgba(255, 107, 107, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55'),('theme-9','Midnight Navy','Professional Blue','🌊','{\"mainText\": \"#2c3e50\", \"cardBorder\": \"rgba(52, 73, 94, 0.2)\", \"cardShadow\": \"0 4px 15px rgba(52, 73, 94, 0.1)\", \"sidebarText\": \"#ecf0f1\", \"sidebarHover\": \"rgba(52, 152, 219, 0.1)\", \"accentPrimary\": \"#3498db\", \"accentGradient\": \"linear-gradient(135deg, #3498db 0%, #2980b9 100%)\", \"cardBackground\": \"#ffffff\", \"mainBackground\": \"linear-gradient(to bottom, #ecf0f1, #d5dbdb)\", \"accentSecondary\": \"#2980b9\", \"programIconColor\": \"#3498db\", \"programCardBorder\": \"#3498db\", \"sidebarActiveItem\": \"rgba(52, 152, 219, 0.3)\", \"sidebarBackground\": \"linear-gradient(180deg, #1a252f 0%, #2c3e50 100%)\", \"activityCardBorder\": \"#3498db\", \"programStatusColor\": \"#3498db\", \"statCardBackground\": \"#ffffff\", \"sidebarActiveBorder\": \"#3498db\", \"statCardBorderColor\": \"linear-gradient(to bottom, #3498db, #2980b9)\", \"programCardBackground\": \"#ffffff\", \"programIconBackground\": \"rgba(52, 152, 219, 0.1)\", \"activityCardBackground\": \"rgba(52, 152, 219, 0.05)\", \"programStatusBackground\": \"rgba(52, 152, 219, 0.1)\"}',0,1,NULL,'2026-01-13 18:24:55','2026-01-13 18:24:55');
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_entries`
--

DROP TABLE IF EXISTS `time_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `clickup_time_entry_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` enum('staff','volunteer','contractor') COLLATE utf8mb4_unicode_ci DEFAULT 'staff',
  `hours_spent` decimal(5,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `entry_date` date NOT NULL,
  `sync_status` enum('synced','pending','syncing','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_time_entry_id` (`clickup_time_entry_id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_date` (`entry_date`),
  KEY `idx_clickup` (`clickup_time_entry_id`),
  CONSTRAINT `time_entries_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Time Tracking - ClickUp Time Entries';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_entries`
--

LOCK TABLES `time_entries` WRITE;
/*!40000 ALTER TABLE `time_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_participants`
--

DROP TABLE IF EXISTS `training_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `beneficiary_id` int NOT NULL,
  `attended` tinyint(1) DEFAULT '1',
  `attendance_days` int DEFAULT '0',
  `pre_test_score` decimal(5,2) DEFAULT NULL,
  `post_test_score` decimal(5,2) DEFAULT NULL,
  `certificate_issued` tinyint(1) DEFAULT '0',
  `satisfaction_rating` int DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_participant` (`training_id`,`beneficiary_id`),
  KEY `idx_training` (`training_id`),
  KEY `idx_beneficiary` (`beneficiary_id`),
  CONSTRAINT `training_participants_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `training_participants_ibfk_2` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_participants`
--

LOCK TABLES `training_participants` WRITE;
/*!40000 ALTER TABLE `training_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `training_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `training_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `training_title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `training_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_module_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration_days` int DEFAULT NULL,
  `venue` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_participants` int DEFAULT NULL,
  `actual_participants` int DEFAULT '0',
  `male_participants` int DEFAULT '0',
  `female_participants` int DEFAULT '0',
  `youth_participants` int DEFAULT '0',
  `training_objectives` text COLLATE utf8mb4_unicode_ci,
  `topics_covered` text COLLATE utf8mb4_unicode_ci,
  `materials_provided` text COLLATE utf8mb4_unicode_ci,
  `lead_facilitator_id` int DEFAULT NULL,
  `co_facilitators` text COLLATE utf8mb4_unicode_ci,
  `pre_test_average` decimal(5,2) DEFAULT NULL,
  `post_test_average` decimal(5,2) DEFAULT NULL,
  `satisfaction_rating` decimal(3,2) DEFAULT NULL,
  `training_report_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photos_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('planned','ongoing','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'planned',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `training_code` (`training_code`),
  KEY `lead_facilitator_id` (`lead_facilitator_id`),
  KEY `idx_training_code` (`training_code`),
  KEY `idx_program_module` (`program_module_id`),
  KEY `idx_dates` (`start_date`,`end_date`),
  CONSTRAINT `trainings_ibfk_1` FOREIGN KEY (`program_module_id`) REFERENCES `program_modules` (`id`),
  CONSTRAINT `trainings_ibfk_2` FOREIGN KEY (`lead_facilitator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_hierarchy`
--

DROP TABLE IF EXISTS `user_hierarchy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_hierarchy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supervisor_id` int NOT NULL,
  `subordinate_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_hierarchy` (`supervisor_id`,`subordinate_id`),
  KEY `idx_supervisor` (`supervisor_id`),
  KEY `idx_subordinate` (`subordinate_id`),
  CONSTRAINT `user_hierarchy_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_hierarchy_ibfk_2` FOREIGN KEY (`subordinate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_hierarchy_chk_1` CHECK ((`supervisor_id` <> `subordinate_id`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Supervisor-subordinate relationships for team-based RLS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_hierarchy`
--

LOCK TABLES `user_hierarchy` WRITE;
/*!40000 ALTER TABLE `user_hierarchy` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_hierarchy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_module_assignments`
--

DROP TABLE IF EXISTS `user_module_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_module_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `module_id` int NOT NULL COMMENT 'References program_modules table',
  `can_view` tinyint(1) DEFAULT '1',
  `can_create` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `can_approve` tinyint(1) DEFAULT '0',
  `assigned_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_module` (`user_id`,`module_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `idx_user` (`user_id`),
  KEY `idx_module` (`module_id`),
  CONSTRAINT `user_module_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_module_assignments_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_module_assignments_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User access to specific modules (RLS)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_assignments`
--

LOCK TABLES `user_module_assignments` WRITE;
/*!40000 ALTER TABLE `user_module_assignments` DISABLE KEYS */;
INSERT INTO `user_module_assignments` VALUES (16,3,6,1,1,1,1,1,2,'2026-01-25 13:25:30'),(20,2,6,1,1,1,1,1,1,'2026-01-25 13:27:45'),(21,2,1,1,1,1,1,1,1,'2026-01-25 13:27:45'),(22,2,3,1,1,1,1,1,1,'2026-01-25 13:27:45'),(24,4,6,1,0,0,0,0,1,'2026-01-28 05:39:56'),(25,5,6,1,0,0,0,0,1,'2026-01-28 06:24:45'),(26,5,1,1,0,0,0,0,1,'2026-01-28 06:24:45'),(27,5,5,1,0,0,0,0,1,'2026-01-28 06:24:45');
/*!40000 ALTER TABLE `user_module_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_by` int DEFAULT NULL COMMENT 'User ID who assigned this role',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL COMMENT 'Optional role expiration',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `idx_user` (`user_id`),
  KEY `idx_role` (`role_id`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Maps users to their roles';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,1,1,'2025-12-02 04:48:26',NULL),(30,3,13,2,'2026-01-25 13:25:30',NULL),(32,2,27,1,'2026-01-25 13:27:45',NULL),(35,4,16,1,'2026-01-28 05:39:56',NULL),(36,5,5,1,'2026-01-28 06:24:45',NULL);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'JWT token',
  `refresh_token` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Refresh token',
  `expires_at` datetime NOT NULL,
  `refresh_expires_at` datetime DEFAULT NULL COMMENT 'Refresh token expiry',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IPv4 or IPv6',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'Browser/client info',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `refresh_token` (`refresh_token`),
  KEY `idx_token` (`token`(255)),
  KEY `idx_user_active` (`user_id`,`is_active`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Active user sessions and JWT tokens';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjUxMzkyLCJleHAiOjE3NjQ3Mzc3OTJ9.8eItjqRmq74QpHqVdKW7gnARiINwtIk7AdIklVn0Vqc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1MTM5MiwiZXhwIjoxNzY1MjU2MTkyfQ.ufEWO5DKnviHfn_5JAJeITio-kXlcFyNM5T8-nYrAmg','2025-12-03 07:56:32','2025-12-09 07:56:32','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 04:56:32'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjU4NTc4LCJleHAiOjE3NjQ3NDQ5Nzh9.NU2UEFP6uKMhm2UB6hXDbERZ7ygH95FyitIsMEyQ7ts','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1ODU3OCwiZXhwIjoxNzY1MjYzMzc4fQ.9U7hyiUD0V3A-_osojMLekm1Mn-ERe8EbcqiH0cdOHg','2025-12-03 09:56:19','2025-12-09 09:56:19','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 06:56:18'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2NTAxLCJleHAiOjE3NjQ3ODI5MDF9.gHIFs92EKmcCaew7_O9C3tAqsbJcMm0nDz2N-XmPwW4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5NjUwMSwiZXhwIjoxNzY1MzAxMzAxfQ.e6FTg9_zCLSgYF1TZvOEsOgu8iHJw5oFcSFW2137Jy4','2025-12-03 20:28:21','2025-12-09 20:28:21','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:28:21'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2ODYyLCJleHAiOjE3NjQ3ODMyNjJ9.wEEUF_ruV2yCePb86Ig3qc0ni2-LqSQxziKfbZ75LQw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5Njg2MiwiZXhwIjoxNzY1MzAxNjYyfQ.-8wLh4wWbRyaU6R6BovOA_hF_psFLj9jkKXeSQJukJ0','2025-12-03 20:34:23','2025-12-09 20:34:23','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:34:22'),(8,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk4MDkxLCJleHAiOjE3NjQ3ODQ0OTF9.s75IRbqe5RXabVzul70osDVvRQx90aUHRkVz8DdZpbg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5ODA5MSwiZXhwIjoxNzY1MzAyODkxfQ.6ALhwMQ_gjUM9CDKQoAf3_-iPHHFTXicbdbfN0fGw8M','2025-12-03 20:54:51','2025-12-09 20:54:51','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:54:51'),(11,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzA5LCJleHAiOjE3NjQ3ODY3MDl9.EZdzmbeBuEnP6RCpdRAnMJ5XaxHIP7QRr-Peeop1cpY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMwOSwiZXhwIjoxNzY1MzA1MTA5fQ.BIYr5J7_PPLXI2legBPkTu77Ws7NZLSnhuz1VQ0pqt0','2025-12-03 21:31:49','2025-12-09 21:31:49','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:31:49'),(12,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzMyLCJleHAiOjE3NjQ3ODY3MzJ9.XNMBonUIViBQ3jx57yoySRfgBtGhMICOC8y6JjJORXk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMzMiwiZXhwIjoxNzY1MzA1MTMyfQ.hqVLiEGYObuS4zIb_gBJmaZCNOZFGYBHiSCCw1tXxM8','2025-12-03 21:32:13','2025-12-09 21:32:13','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-02 18:32:12'),(13,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTUwLCJleHAiOjE3NjQ4NzA1NTB9.iQncsT_Jpz9BQSzyj1iywMGJgUnhwUOuFoavTywpEYQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE1MCwiZXhwIjoxNzY1Mzg4OTUwfQ.onP5Kx5_Ka6eBPkm91ihzXhKX3KD6P7ubj3d1ielaec','2025-12-04 20:49:10','2025-12-10 20:49:10','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 17:49:10'),(14,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTkyLCJleHAiOjE3NjQ4NzA1OTJ9.PxCWXzB4xF5u-sLDdp_VFRL5rP_TPHN3rWygXmqYHfk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE5MiwiZXhwIjoxNzY1Mzg4OTkyfQ.4khF1JeH0zjs9KQ3hnVD2OkxxD4HIwCkzihYoizkd7M','2025-12-04 20:49:52','2025-12-10 20:49:52','192.168.100.5','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-03 17:49:52'),(21,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg4NTQ3LCJleHAiOjE3NjQ4NzQ5NDd9.p-xF4Kw5PyKhCqp26ok0VZrhwI6I3bT5kcBsbLdUeio','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4ODU0NywiZXhwIjoxNzY1MzkzMzQ3fQ.2_iO5WIa_tnZZ70r2KYhdggXxO7eIpLGYfqwDoa6CpM','2025-12-04 22:02:28','2025-12-10 22:02:28','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 19:02:27'),(29,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0NDY5LCJleHAiOjE3NjQ5MTA4Njl9.Y9IX2OJy8LSYGekVMAvWlSBYPWdJxw3tG6bFJ_kyKUU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDQ2OSwiZXhwIjoxNzY1NDI5MjY5fQ.ouaKq1e8HfSLou8YhM3IMnqBuFxJUCI5YvBMcpC8_XY','2025-12-05 08:01:10','2025-12-11 08:01:10','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:01:09'),(31,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0ODA3LCJleHAiOjE3NjQ5MTEyMDd9.G0ggBt6KNdHjT_JPVN2heoBK2spQJfD_a3weGtYtHD4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDgwNywiZXhwIjoxNzY1NDI5NjA3fQ.kLoq3kU9VWBJdSWWaHsW1ZCqBweFdXnQk9GeVJVS1k4','2025-12-05 08:06:48','2025-12-11 08:06:48','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:06:47'),(33,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1NjIzLCJleHAiOjE3NjQ5MTIwMjN9.8gfkDaS0rWITPufMJfQ6Q_RxnfSzYY93O_waWEEN0wo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTYyMywiZXhwIjoxNzY1NDMwNDIzfQ.olK4n72lHg6fUZKKQeNi-QClMYTdmd7iSbNBNoMt8s4','2025-12-05 08:20:24','2025-12-11 08:20:24','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:20:23'),(36,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1OTY0LCJleHAiOjE3NjQ5MTIzNjR9.5Q2Co6-wJHfH5OeliCR2wavhTu99VfYt1MDTsAjyR_Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTk2NCwiZXhwIjoxNzY1NDMwNzY0fQ.yJEGLj4VuvY7-WD2Ub5I5FSNJU12TeRtVGBh_K-Vx8w','2025-12-05 08:26:05','2025-12-11 08:26:05','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:26:04'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI2Mzc4LCJleHAiOjE3NjQ5MTI3Nzh9.MsOF8Br3sql0pgfcH4F0tIVMbiUNjwF-rM5LT58GagI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNjM3OCwiZXhwIjoxNzY1NDMxMTc4fQ.gjdDFGgMecsZ3XVPpMZF0GzVeX1S72WanCgcZihYw80','2025-12-05 08:32:58','2025-12-11 08:32:58','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 05:32:58'),(43,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4MzQzLCJleHAiOjE3NjQ5MjQ3NDN9.PErMKSQUFH52b8DT72GEVpDtLG5uNVJ4DWE_Q1VWNGQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODM0MywiZXhwIjoxNzY1NDQzMTQzfQ.ghQDil7aPcfCkczR9F78dErrI_FN5hBxFJgKHlvzTno','2025-12-05 11:52:24','2025-12-11 11:52:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:52:23'),(46,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4NjUzLCJleHAiOjE3NjQ5MjUwNTN9.QF2QWN-q-_2YuB5o6y7IPzzy94IKOFai-kZ8X8Ujvo4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODY1MywiZXhwIjoxNzY1NDQzNDUzfQ.vwjQgjoBWRDMzzf7mAiGCbKpYnVeGyLMwlH11og6YVs','2025-12-05 11:57:34','2025-12-11 11:57:34','192.168.87.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 08:57:33'),(49,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM5MDA0LCJleHAiOjE3NjQ5MjU0MDR9.prkWobEqg6d-du5S6M-p2sPxZybGlZMzv4d9GmI02BE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzOTAwNCwiZXhwIjoxNzY1NDQzODA0fQ.NoljRbknGcqgdUk4FdaprGZ-cSLJepoFQILmkUPYIDQ','2025-12-05 12:03:24','2025-12-11 12:03:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:03:24'),(60,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQzNjkzLCJleHAiOjE3NjQ5MzAwOTN9.rf3eYfT0qddCQsmWSvu7W83rDNF_8VvJEGIltwDte5o','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg0MzY5MywiZXhwIjoxNzY1NDQ4NDkzfQ.nKdzBuYwOVFR3DxHiF93HZOjVl4UUcoUSNRz2KckkdU','2025-12-05 13:21:34','2025-12-11 13:21:34','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:21:33'),(66,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODcxOTc0LCJleHAiOjE3NjQ5NTgzNzR9.GqKLqn__-3no-DrOafeomyHCi0xpfIhFHXJMQyK5YCs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3MTk3NCwiZXhwIjoxNzY1NDc2Nzc0fQ.06lShfWu1F7SwBiKnIwnxXIP65Lyn5G8rvBKRUXuS6M','2025-12-05 21:12:55','2025-12-11 21:12:55','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 18:12:54'),(67,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODc1Mzg0LCJleHAiOjE3NjQ5NjE3ODR9.S-Lmg1ubxyjbuU0gpKcKhQrOtIraYfal8cjUzPgzlTU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3NTM4NCwiZXhwIjoxNzY1NDgwMTg0fQ.fnvK-HthE8cC-Jj3kSa8FGyRVGz0m88QOZMHZosrmAY','2025-12-05 22:09:44','2025-12-11 22:09:44','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 19:09:44'),(69,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDAyMjg0LCJleHAiOjE3NjUwODg2ODR9.vFCCMcvm9cuMog5o3ABDPlo2SiTWicV5Rod5wLIzyhU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwMjI4NCwiZXhwIjoxNzY1NjA3MDg0fQ.WZxRJBNi8sj9S4ihdkgW8U2tNqdmPVwFg2UWBupwro4','2025-12-07 09:24:45','2025-12-13 09:24:45','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 06:24:44'),(71,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDA2MDM3LCJleHAiOjE3NjUwOTI0Mzd9.d4Lju_ZCksXqce9G2oDzhmeiBNlacxabpynwGv4Ha-g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwNjAzNywiZXhwIjoxNzY1NjEwODM3fQ.FndwBYGN1mjRI6ClcZAhxmcRqvNzfNn_bxzlFquq3A8','2025-12-07 10:27:17','2025-12-13 10:27:17','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-06 07:27:17'),(72,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDMzMjU0LCJleHAiOjE3NjUxMTk2NTR9.Cml4S47XCHaw4JSxqf5N82ig8Ss4eO40ligObNxhPTA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzMzI1NCwiZXhwIjoxNzY1NjM4MDU0fQ.JmOmXDslLMvXiuaKmfNArGzHrNsM5MuomOqFgXQBY7M','2025-12-07 18:00:55','2025-12-13 18:00:55','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:00:54'),(75,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM0MjkyLCJleHAiOjE3NjUxMjA2OTJ9.qV1xSxzQ11TlnXtKb4hyhSfJktdhRlElf80CYhehEc8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNDI5MiwiZXhwIjoxNzY1NjM5MDkyfQ.eCz97I8iNEFprkfUq_YzxHMheV3ae5I-3-fZkRfGNso','2025-12-07 18:18:12','2025-12-13 18:18:12','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:18:12'),(77,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM1Nzg4LCJleHAiOjE3NjUxMjIxODh9.HJwlQ90sh6tywLeWQYReptIR3i_tGHzjP_eIrjmcyaY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNTc4OCwiZXhwIjoxNzY1NjQwNTg4fQ.QNw38C_ZQXtfwcPc7LuiSqP1zkCPoHAtI6vaSOBtvRk','2025-12-07 18:43:09','2025-12-13 18:43:09','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:43:08'),(78,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM4MDYyLCJleHAiOjE3NjUxMjQ0NjJ9.3TSPfodr_jJi3yEr3O_lhnyE8xcQDLAs0aVKxVrpO-k','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzODA2MiwiZXhwIjoxNzY1NjQyODYyfQ.noSerFPWfI211ON8clwTFTN3Ga4bo3zk5F2W9kHfeEg','2025-12-07 19:21:02','2025-12-13 19:21:02','192.168.86.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 16:21:02'),(79,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjUxODgwLCJleHAiOjE3NjUzMzgyODB9.2qICfS7BqrVcAzkgPIjPx0i9hgZTkpD6qgrFRl1pxWg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1MTg4MCwiZXhwIjoxNzY1ODU2NjgwfQ.CYAZPMwKfB2endhwKHjYaA5EOHU5r1rfD527SX2MEFI','2025-12-10 06:44:40','2025-12-16 06:44:40','192.168.205.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-09 03:44:40'),(80,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjU1MjU0LCJleHAiOjE3NjUzNDE2NTR9.IgroyaTJFCtjVh3ae0Lq4qIoLyPUL8jtRxn0sbU-6mU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1NTI1NCwiZXhwIjoxNzY1ODYwMDU0fQ.gQg1VUU-bt_QgA2qXv15WrJi8x76zI5rNJBENRnGy9c','2025-12-10 07:40:54','2025-12-16 07:40:54','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:40:54'),(83,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjU2MjAzLCJleHAiOjE3NjUzNDI2MDN9.y-BzbgAAZDQiMZEzMCzJ-0nqMocrPEq8gUofivgXzC4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1NjIwMywiZXhwIjoxNzY1ODYxMDAzfQ.PvtNQArupX6vl2hbYd7aPsd898ZrvBIhpqUlz6yDuRg','2025-12-10 07:56:44','2025-12-16 07:56:44','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:56:43'),(86,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjYwMTk2LCJleHAiOjE3NjUzNDY1OTZ9.PT_2xpTVHf-A4x34jOsA9XI5mcRth1ZfCkiYKCbS3Eg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI2MDE5NiwiZXhwIjoxNzY1ODY0OTk2fQ.Sfj85ME6P4fcxLXNTeMlkW1urTACce8SQattEqc7ZOo','2025-12-10 09:03:16','2025-12-16 09:03:16','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-09 06:03:16'),(89,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjY4NDUwLCJleHAiOjE3NjUzNTQ4NTB9.TxdPVoXRB4SXBnTZGpkaNow5YtHafcHk6npjojao6Eg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI2ODQ1MCwiZXhwIjoxNzY1ODczMjUwfQ.slertTVyC17af5YiNwb794MMi4LASH_xL3YH3M1DHIk','2025-12-10 11:20:50','2025-12-16 11:20:50','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:20:50'),(91,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjcwNTk2LCJleHAiOjE3NjUzNTY5OTZ9.gM_ciK1w-EJErbWi0kNA0pHsQVaB5mQU1aZgsBBPjaw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI3MDU5NiwiZXhwIjoxNzY1ODc1Mzk2fQ.S_g6gmP4AS7CmebCaREb-MIoJ4d40FqmZGjcUFmo2QI','2025-12-10 11:56:37','2025-12-16 11:56:37','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:56:36'),(92,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MzEwNDk4LCJleHAiOjE3NjUzOTY4OTh9.y9NYi9KrdhpELP9Up6RCGY_l74AslT2o49E-TbQ_ibQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTMxMDQ5OCwiZXhwIjoxNzY1OTE1Mjk4fQ.rbW38jmZeDojHywGHMGBSbOY64bPg7ECNvC08VmYGUU','2025-12-10 23:01:39','2025-12-16 23:01:39','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-09 20:01:38'),(94,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MzQwNTMyLCJleHAiOjE3NjU0MjY5MzJ9._mRLQC_JcxQQJ6_dDNE6g0hTsj2GOCuSB6W7EBP7Phc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTM0MDUzMiwiZXhwIjoxNzY1OTQ1MzMyfQ.j4f60WboMbe-xBVizV8TXlGBvWv7oeQaPamjt1wbVpY','2025-12-11 07:22:13','2025-12-17 07:22:13','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-10 04:22:12'),(95,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDMwMjY3LCJleHAiOjE3NjU1MTY2Njd9.RaikBRifT7TaHPrny6PIdMyS1vIqgYN4Y2uKfK9cu9U','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQzMDI2NywiZXhwIjoxNzY2MDM1MDY3fQ.X0zo_d4j31s-ulFtDY_LQOjfvWjkFEUG0BcthwyeM9E','2025-12-12 08:17:48','2025-12-18 08:17:48','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 05:17:47'),(96,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxNzg1LCJleHAiOjE3NjU1MjgxODV9.LtAdMEc9fGNNEjPlLetGAp5KWCUfrUZFbxsLweynuMg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTc4NSwiZXhwIjoxNzY2MDQ2NTg1fQ.77wmLvuXgF1GY1_Labco07nfOT8U4-IX7AfGqiD-Rms','2025-12-12 11:29:45','2025-12-18 11:29:45','192.168.100.4','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',0,'2025-12-11 08:29:45'),(97,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxODIyLCJleHAiOjE3NjU1MjgyMjJ9.dWS7pu6H4I6n48Ungqo24zA6AbDxMyN6FqMdFCUnDqg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTgyMiwiZXhwIjoxNzY2MDQ2NjIyfQ.B4l70ngK0BQuT2AbO-CvpXvPR1_NsW6FrxHK_SmGUNg','2025-12-12 11:30:23','2025-12-18 11:30:23','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-11 08:30:22'),(98,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxODYxLCJleHAiOjE3NjU1MjgyNjF9.9wm0Su-NzvHHsHydVkJHGynZa3KyUog9wCFPmrpL_ak','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTg2MSwiZXhwIjoxNzY2MDQ2NjYxfQ.zNdoFbxKeNcLU4NjX-uN8PV-1RAyhzWmQi1EM8LrpAo','2025-12-12 11:31:01','2025-12-18 11:31:01','192.168.100.4','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',1,'2025-12-11 08:31:01'),(99,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQyMjIxLCJleHAiOjE3NjU1Mjg2MjF9.HqcaJOaaHBJrcqRb63A6vFqJ6DMlV2a7bBI43jQwGJU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MjIyMSwiZXhwIjoxNzY2MDQ3MDIxfQ.GwoeQxaRanXCBgdTMUVlDn8oN140u2Os7SNx59PtarI','2025-12-12 11:37:02','2025-12-18 11:37:02','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 08:37:01'),(102,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQ5NTIxLCJleHAiOjE3NjU1MzU5MjF9.-XmANsDERsn-hBd-fNnzBZFJ8kEY3pijWkI7AA5iXFQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0OTUyMSwiZXhwIjoxNzY2MDU0MzIxfQ.88pZD1n6YmNdScEmrDuQ5L4IEeLCcjndclRC4i9gRdI','2025-12-12 13:38:41','2025-12-18 13:38:41','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 10:38:41'),(104,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDc1MDU3LCJleHAiOjE3NjU1NjE0NTd9.utKqntRaJukoH5iCuLwQkgHYrgB9tmK5RVgSDyel0Z8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ3NTA1NywiZXhwIjoxNzY2MDc5ODU3fQ.PDuS2KF7pHp3ULGImnzABoAGbjnyuXtFtuFt1ylHWj8','2025-12-12 20:44:18','2025-12-18 20:44:18','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-11 17:44:17'),(105,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjAzODk5LCJleHAiOjE3NjU2OTAyOTl9.qgw16leDhVMRmzscnXiFX8yow_AND2lCQLHYEgTP06E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYwMzg5OSwiZXhwIjoxNzY2MjA4Njk5fQ.6TAfoxLw-j7_hY9oqAW01KbxJq00ICR1EQgiWvWq57I','2025-12-14 08:31:39','2025-12-20 08:31:39','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-13 05:31:39'),(106,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjEwOTUyLCJleHAiOjE3NjU2OTczNTJ9.cVuuUQh17zRw1j34EQFbY26uXfCJwvRr17OPQi6u2uw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxMDk1MiwiZXhwIjoxNzY2MjE1NzUyfQ.oE3TLiZJAsqxQaZEL2jBuacBfBIC9qBCa3I5RBUeeT4','2025-12-14 10:29:12','2025-12-20 10:29:12','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 07:29:12'),(108,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjE0MDc2LCJleHAiOjE3NjU3MDA0NzZ9.01t9PXcf5paE0kOtVPkxsR6NghG0mlrqcWWBWvua7QE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxNDA3NiwiZXhwIjoxNzY2MjE4ODc2fQ.JXi2FxRTnaNOL57chDwij03LR6w7jS7RymU1f_T6uZE','2025-12-14 11:21:16','2025-12-20 11:21:16','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 08:21:16'),(109,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjE0MjA5LCJleHAiOjE3NjU3MDA2MDl9.CKRLDzP8HXxcqgKRhsJJ1VQsbwUtrnelB2aQzsG02pI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxNDIwOSwiZXhwIjoxNzY2MjE5MDA5fQ.hsFOuOURJnU_zVYE2YljKdX5KbZLlGm7-r7BWpbSirY','2025-12-14 11:23:30','2025-12-20 11:23:30','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 08:23:29'),(111,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1Nzk2MjcxLCJleHAiOjE3NjU4ODI2NzF9.gbLomLOsI3tdCauket_X2Je3RXc_O5nNzDvcY0ApOFU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTc5NjI3MSwiZXhwIjoxNzY2NDAxMDcxfQ.wdlJBAHDkkLoXrbkjYGSQ5LwiaK1n5cq0ZgcNyelEGk','2025-12-16 13:57:52','2025-12-22 13:57:52','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-15 10:57:51'),(112,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODE4NzAzLCJleHAiOjE3NjU5MDUxMDN9.8sJiAn-Hh--aDjv31bdbZtPM0DAHhCA6MpwV6qkARzs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTgxODcwMywiZXhwIjoxNzY2NDIzNTAzfQ.CKCX1Mau5c6U2SwKpwkRcJGVwKKKZxJPsFoWhdrIOBY','2025-12-16 20:11:43','2025-12-22 20:11:43','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:11:43'),(115,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODIxMjIzLCJleHAiOjE3NjU5MDc2MjN9.teJxPNVFXEwHDN3H0B5DofJPHU8Vi2tFfuWv03k79H4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTgyMTIyMywiZXhwIjoxNzY2NDI2MDIzfQ.h7tGd_Z-K4BVmZlOEQdmTa9u7fCgFQusjGBaAaUzAUc','2025-12-16 20:53:43','2025-12-22 20:53:43','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:53:43'),(119,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODY2MzEwLCJleHAiOjE3NjU5NTI3MTB9.ZXM1JX2uqh71FgQoIuUu2IZUloNWwPIvvHW0e4fnDmo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTg2NjMxMCwiZXhwIjoxNzY2NDcxMTEwfQ.ctFo_qOWahnc6wg3f8SFMy31pA7IOYh_FqvfxmKhITs','2025-12-17 09:25:11','2025-12-23 09:25:11','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-16 06:25:10'),(120,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODY4OTU5LCJleHAiOjE3NjU5NTUzNTl9.nWQPBwBTa7UbuXpbFBXi0uOlsMslvrt3l82LIkck2bk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTg2ODk1OSwiZXhwIjoxNzY2NDczNzU5fQ.wZ_WXzO9XlKdifVC34S8W1sPzNViEP8spS7CQBmoT6U','2025-12-17 10:09:19','2025-12-23 10:09:19','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-16 07:09:19'),(121,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY2MDQyMjMyLCJleHAiOjE3NjYxMjg2MzJ9.ZhPkFnSd39EpaTnklWvqJj5ErlehlKj54OxuUz9Vpro','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjA0MjIzMiwiZXhwIjoxNzY2NjQ3MDMyfQ.03QfFcvh_k6X_uWdjsgITvxCR0u88MQcufvpgxrA_UU','2025-12-19 10:17:12','2025-12-25 10:17:12','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-18 07:17:12'),(122,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY2MDYxNjk4LCJleHAiOjE3NjYxNDgwOTh9.EHBrDxNe5YbJTZyi7sbqEKRwtRY4SrrIP4CdMOjXtW8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjA2MTY5OCwiZXhwIjoxNzY2NjY2NDk4fQ.X-aidAtlOt5DmHL271IClJcp_aGs_S3b5w7ATMLaOmo','2025-12-19 15:41:38','2025-12-25 15:41:38','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-18 12:41:38'),(123,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY2MDYxOTIwLCJleHAiOjE3NjYxNDgzMjB9.TwKCLNmheOge1wQuXcNR7X8JxthEglpMxujR9N8kQGA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjA2MTkyMCwiZXhwIjoxNzY2NjY2NzIwfQ.IhxR-lBQ5IhibiOQH-_QM7Eb5EVBxpPRhjU2Vx26SKs','2025-12-19 15:45:20','2025-12-25 15:45:20','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-18 12:45:20'),(124,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY2MDc4NjIwLCJleHAiOjE3NjYxNjUwMjB9.VjZsD1C6QG2OesmzFKMZjAciyYkzUjwZgIUb0V_3DUk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjA3ODYyMCwiZXhwIjoxNzY2NjgzNDIwfQ.e-gPwYsDELPWbW-ieLSC6OAhqgJmVnBCBctkTHzst7o','2025-12-19 20:23:41','2025-12-25 20:23:41','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-18 17:23:40'),(125,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3MjA1OTYxLCJleHAiOjE3NjcyOTIzNjF9.2T41E69x06z9okS0tWqRNALSOtaD3nLn_qAwaTi3Dx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzIwNTk2MSwiZXhwIjoxNzY3ODEwNzYxfQ.J5j2kyR37Ge1TvJzxZz1UyDs3OUFvrwF8AEXMqWcJmA','2026-01-01 21:32:42','2026-01-07 21:32:42','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-31 18:32:41'),(126,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3MjA2NDIzLCJleHAiOjE3NjcyOTI4MjN9.k7kcbzVwmeMVjN0xwxOjNZrM0GMPu1gCRF7VuuL74Ng','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzIwNjQyMywiZXhwIjoxNzY3ODExMjIzfQ.Xgo1m_G_4pV77z2F9-n9qA43LsG-Jt1NLY2gfvI2bbo','2026-01-01 21:40:23','2026-01-07 21:40:23','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2025-12-31 18:40:23'),(127,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3MjE4NDUwLCJleHAiOjE3NjczMDQ4NTB9.wJvUNEFOB6dMC5eMfVKCyMVsf_LFYyI3OO3JrlViU7A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzIxODQ1MCwiZXhwIjoxNzY3ODIzMjUwfQ.-8A-BXUW-sCCU7HbCiCGj6YrvoRdHTI1Dt7qBi1lnto','2026-01-02 01:00:51','2026-01-08 01:00:51','192.168.188.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',1,'2025-12-31 22:00:50'),(128,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3MjIxMDA3LCJleHAiOjE3NjczMDc0MDd9.775xMTLPJkrFpg9XuSavfKQzWRnMQMYv-8OiIV1Jxog','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzIyMTAwNywiZXhwIjoxNzY3ODI1ODA3fQ.jsou2D3DQ3MM1wretBA5pTz5q7LVUMK4ZQAY5vwxJrA','2026-01-02 01:43:28','2026-01-08 01:43:28','192.168.188.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-31 22:43:27'),(129,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NTQ1NDIzLCJleHAiOjE3Njc2MzE4MjN9.z8HMexGCINMGI_eoQFOeWxIaf25VsdP8lchXqiIzdYE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzU0NTQyMywiZXhwIjoxNzY4MTUwMjIzfQ.YJZP7rJS0cjGKcfORBTEZU8f28W8E7eQ96bfJbenbIY','2026-01-05 19:50:24','2026-01-11 19:50:24','192.168.248.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-04 16:50:23'),(130,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NTQ3NTE4LCJleHAiOjE3Njc2MzM5MTh9.sZbSH5UVmugnXkLMLbajJX9lgrfyL6Q1D0ghDxdtZdM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzU0NzUxOCwiZXhwIjoxNzY4MTUyMzE4fQ.qiU3VbWT2f8qiex4wU4vmeWjVmA9EujkJc_bqxlnFUg','2026-01-05 20:25:18','2026-01-11 20:25:18','192.168.248.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-04 17:25:18'),(131,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NjA1NzkyLCJleHAiOjE3Njc2OTIxOTJ9.Px3TiggO4j7cDZO4yvNiXo4TwmEIUbVdnrnhJTfQ3YM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzYwNTc5MiwiZXhwIjoxNzY4MjEwNTkyfQ.TI2HB6J7RDIZHuoCihDUEYlQ_WLPldMAs20k6cSeVTo','2026-01-06 12:36:33','2026-01-12 12:36:33','192.168.109.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-05 09:36:32'),(139,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NjA3MDQxLCJleHAiOjE3Njc2OTM0NDF9.edvxVnnvlkzxWIuzjA0d5cKOing5vYobycsO81O8tuM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzYwNzA0MSwiZXhwIjoxNzY4MjExODQxfQ.aOxA6Hco5wP_Up8l7mANS7GfrxJCgRIP502sSIUSyxk','2026-01-06 12:57:21','2026-01-12 12:57:21','192.168.109.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-05 09:57:21'),(150,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NjEyNDI4LCJleHAiOjE3Njc2OTg4Mjh9.HU3gW4200N_QAYL2sebZ8Vtcym7u9oK48k3a-v5NHac','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzYxMjQyOCwiZXhwIjoxNzY4MjE3MjI4fQ.JI2fNhh8bZ4LaXpoBcXtyyaY8ImESoiaRvtzY_jEUeY','2026-01-06 14:27:08','2026-01-12 14:27:08','192.168.109.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-05 11:27:08'),(151,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3NzAzMzE5LCJleHAiOjE3Njc3ODk3MTl9.m9jBc9grobpjiwa7metq1JDx8Hm1bffEyYkLzpqkPFE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NzcwMzMxOSwiZXhwIjoxNzY4MzA4MTE5fQ.3jaMkOKJwTN2vxj5wNFZGF_-QRC_gQEQUvuUim5F71k','2026-01-07 15:42:00','2026-01-13 15:42:00','192.168.109.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-06 12:41:59'),(152,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3ODU0MDQ3LCJleHAiOjE3Njc5NDA0NDd9.JzJgb6LwGAR1hwPSQ7MCZfNcp0Wv1Odr3AuzrpoQgvs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2Nzg1NDA0NywiZXhwIjoxNzY4NDU4ODQ3fQ.7JtwZQSaeEQZva3q5P2TwW-6qz6O6VbY32U5jCIeDVQ','2026-01-09 09:34:08','2026-01-15 09:34:08','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-08 06:34:07'),(153,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3ODc1NTkyLCJleHAiOjE3Njc5NjE5OTJ9.kvQHQ361CSwnqhV7dSDAxJLAxmgPklJ6OTeih_3K_pw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2Nzg3NTU5MiwiZXhwIjoxNzY4NDgwMzkyfQ.n7U7vEmsaglz2wzu2v7fUje1hs4TgL7omcRDwP3aNGQ','2026-01-09 15:33:13','2026-01-15 15:33:13','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',1,'2026-01-08 12:33:12'),(154,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3ODc3NzA1LCJleHAiOjE3Njc5NjQxMDV9.gHA8gzsI9rtwJQbvy_FqsTufDvrJkLWQJlj6AB6pvxc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2Nzg3NzcwNSwiZXhwIjoxNzY4NDgyNTA1fQ.KhByGzGiz-XfmXvG0G636zPeLo6mglTGyAmF8-vCkzQ','2026-01-09 16:08:25','2026-01-15 16:08:25','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-08 13:08:25'),(155,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3ODk0NzgwLCJleHAiOjE3Njc5ODExODB9.FZV19vEG2HwSjDQd77OyA95GWUpyM5W9HsWF5ZJ9ruU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2Nzg5NDc4MCwiZXhwIjoxNzY4NDk5NTgwfQ.JSJIJ94yABRjeRRrfb2Oyddqmc5Gf20T9lgnUq3s06w','2026-01-09 20:53:01','2026-01-15 20:53:01','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-08 17:53:00'),(156,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTMzMTQ2LCJleHAiOjE3NjgwMTk1NDZ9.4GT7m5NdTHAYWEGLrp5NTAXroaS8pCOg4X1nZVTl0mc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NzkzMzE0NiwiZXhwIjoxNzY4NTM3OTQ2fQ.jC3bim9UexNP8Ki7U9CIwJFQSlr0uDp2nmzNdeDTVX8','2026-01-10 07:32:27','2026-01-16 07:32:27','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-09 04:32:26'),(157,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTMzMTkzLCJleHAiOjE3NjgwMTk1OTN9.JigOzfH0tBRkXwGpAQydFHRtiTXXbHJIMRuXQSHa580','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NzkzMzE5MywiZXhwIjoxNzY4NTM3OTkzfQ.6biwTk21jYZ0NpS91FEgV6BFDSx0WJNdPhKcmPWEhbo','2026-01-10 07:33:14','2026-01-16 07:33:14','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-09 04:33:13'),(158,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTM3MzgyLCJleHAiOjE3NjgwMjM3ODJ9.jIk5WSrF4WTgj-DpLUqS2WH2zZA2s0NXUYjSCkdg_lw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NzkzNzM4MiwiZXhwIjoxNzY4NTQyMTgyfQ.S8J17NsxDsW5syC3WQXylnaQBp-qiqvlXOxgwecSaxs','2026-01-10 08:43:02','2026-01-16 08:43:02','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-09 05:43:02'),(159,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTQwNTMwLCJleHAiOjE3NjgwMjY5MzB9.uOVOtiiGJXBp4lvMXje_5S4W5WZvadoPns0-KM2Uno8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2Nzk0MDUzMCwiZXhwIjoxNzY4NTQ1MzMwfQ.fQDyk0NRO8dGi-aStxz_9KQke74A_N1qaVW_Ko740fk','2026-01-10 09:35:31','2026-01-16 09:35:31','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-09 06:35:30'),(160,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3OTQxMTg4LCJleHAiOjE3NjgwMjc1ODh9.RK_I48LE09e5qAOLi3sNU_0CgLAdtW9M9ryIb27nr-A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2Nzk0MTE4OCwiZXhwIjoxNzY4NTQ1OTg4fQ.d0J2Y8NkVuX-Ocfrc59FoIQ4TYEX7JCd9lKlgxpRy4c','2026-01-10 09:46:29','2026-01-16 09:46:29','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-09 06:46:28'),(161,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTQxMjcyLCJleHAiOjE3NjgwMjc2NzJ9.Q41ofvEJIzkjWXJ38nKF0MFDqjiKRY9Dh1-obFk8uuU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2Nzk0MTI3MiwiZXhwIjoxNzY4NTQ2MDcyfQ.IpAR-1e7A9gWrOB9hqb_qNEJUzNMBnXwMVsvAGsFbAg','2026-01-10 09:47:52','2026-01-16 09:47:52','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-09 06:47:52'),(162,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY3OTg3NTU4LCJleHAiOjE3NjgwNzM5NTh9.O1u5IHax0zSX8xhJkxOmll-XBwhRCApsgQOC1XTmldI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2Nzk4NzU1OCwiZXhwIjoxNzY4NTkyMzU4fQ.31Up2J3DA5JiUn75i3r6xZiqpfaD9f4xnPrhcJ6QJN4','2026-01-10 22:39:19','2026-01-16 22:39:19','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2026-01-09 19:39:18'),(163,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY3OTg5ODkwLCJleHAiOjE3NjgwNzYyOTB9.yvvgDj2ZM4G1GyWQr9qStLWBrsdMZftvyfXS_0MDIC0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2Nzk4OTg5MCwiZXhwIjoxNzY4NTk0NjkwfQ.v0ZqS4NjHslc3AxNQ_e5Ici1h4ZedwF3CdVmRacu0A4','2026-01-10 23:18:10','2026-01-16 23:18:10','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',1,'2026-01-09 20:18:10'),(164,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mjk2MTg1LCJleHAiOjE3NjgzODI1ODV9.Om5l02HWEb_LDddzA1qN54gZymQLncg5T5HfopjQsGM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODI5NjE4NSwiZXhwIjoxNzY4OTAwOTg1fQ.4VBzz2lyDeiksoZe0MssypG310BChnwNNGr6ejnIEtU','2026-01-14 12:23:05','2026-01-20 12:23:05','192.168.72.126','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2026-01-13 09:23:05'),(165,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mjk2MzUyLCJleHAiOjE3NjgzODI3NTJ9.-PBPmZKEP_UuYQILsv0VVDXkLHcYZWkMIafqsGtH5f0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODI5NjM1MiwiZXhwIjoxNzY4OTAxMTUyfQ.GYOUBc-aRROE1FHvpzG-LSt2bfLR6zR2yMTw-ejdUjE','2026-01-14 12:25:52','2026-01-20 12:25:52','192.168.72.234','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-13 09:25:52'),(166,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mjk2NjIxLCJleHAiOjE3NjgzODMwMjF9.G_klx41K1uzUEqZkdu6KoaoKEGPt2LgKhuPbSXE-ex0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODI5NjYyMSwiZXhwIjoxNzY4OTAxNDIxfQ.fbYnE_ULlwSTdsnAKzgp2aMheZHBgzvpSbeAiAeiNWI','2026-01-14 12:30:21','2026-01-20 12:30:21','192.168.72.234','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Safari/537.36',1,'2026-01-13 09:30:21'),(167,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mjk3OTg4LCJleHAiOjE3NjgzODQzODh9.egaDPeBes6YoOXnnVZZTvy5XLzFoBZKl1FWgtBuMxqs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODI5Nzk4OCwiZXhwIjoxNzY4OTAyNzg4fQ.hZtm9YGKcp2qzkWhT_aaxiL4LLv-VmxxaBxvIdx8XzY','2026-01-14 12:53:09','2026-01-20 12:53:09','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-13 09:53:08'),(168,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzAwMjYxLCJleHAiOjE3NjgzODY2NjF9.r7swZwZAaQKNXqXm-ZNwFcdnrK3833w3JsgA249MQWk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODMwMDI2MSwiZXhwIjoxNzY4OTA1MDYxfQ.Sq36MSf1Kkagf29j8rg_BBtcq7CSO88WEXZmWnD21Fs','2026-01-14 13:31:02','2026-01-20 13:31:02','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-13 10:31:01'),(169,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzA2NTEwLCJleHAiOjE3NjgzOTI5MTB9.YuKF4wZquj6qyhFerLY2_jj0y7eXgny4AO_7qQzH3Mk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODMwNjUxMCwiZXhwIjoxNzY4OTExMzEwfQ._zbqqfBYaYpLUxkMShxPkngfXoUtFi3JMwiQQacCJ2w','2026-01-14 15:15:10','2026-01-20 15:15:10','192.168.72.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2026-01-13 12:15:10'),(170,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzI1NTQ3LCJleHAiOjE3Njg0MTE5NDd9.Cqr6br2KbJTMldxOONek8RyWIGr9tKaWkmY6oeJ6S08','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODMyNTU0NywiZXhwIjoxNzY4OTMwMzQ3fQ.yqJLICNXKFv7rNDBEK151ulBCAcWe8LGW6ZMGVV_n1g','2026-01-14 20:32:27','2026-01-20 20:32:27','192.168.72.126','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',1,'2026-01-13 17:32:27'),(171,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzMxMjA1LCJleHAiOjE3Njg0MTc2MDV9.-ENXDQSdKIHZ8MEGn8YLz3u3RA6z6blIWjFwN9pIJ04','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODMzMTIwNSwiZXhwIjoxNzY4OTM2MDA1fQ.BzQ8ZrVWktDtBWWRcRA2oUfBIlYbYYderzFR61NWW84','2026-01-14 22:06:45','2026-01-20 22:06:45','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-13 19:06:45'),(172,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzMxODE3LCJleHAiOjE3Njg0MTgyMTd9.TiZyNtYEOWXEiCsLo3hYLQlLNejm9GFuRfwbspCthtA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODMzMTgxNywiZXhwIjoxNzY4OTM2NjE3fQ.k45ksAtzUfXM2aP0VcoJ2NJnI6Lqas4yiDEcTqiUlQQ','2026-01-14 22:16:57','2026-01-20 22:16:57','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-13 19:16:57'),(173,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4MzMxOTgwLCJleHAiOjE3Njg0MTgzODB9.mj3JM73-w-M2ln4m2GYVcuS0WwzSxKy4ur1ZGMpjuv4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODMzMTk4MCwiZXhwIjoxNzY4OTM2NzgwfQ.MNXuuntGHF6NeQrXo00Dnng_Gegmh1khvMVa4DQrZGk','2026-01-14 22:19:40','2026-01-20 22:19:40','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-13 19:19:40'),(174,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mzc2NjczLCJleHAiOjE3Njg0NjMwNzN9.F0PFbTVR9AjSp7BfuPl86CfNDxV3vpE7vlsCMeLyBOM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODM3NjY3MywiZXhwIjoxNzY4OTgxNDczfQ.6fXhJPICevUMJWk4pctV9YBgRRwruqv9SfUI-ANcfwU','2026-01-15 10:44:34','2026-01-21 10:44:34','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-14 07:44:33'),(175,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4Mzc2NzIxLCJleHAiOjE3Njg0NjMxMjF9.04EbABxVdGHFJxmOBdov6GEMBUzK27APgHvwMRznq5k','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODM3NjcyMSwiZXhwIjoxNzY4OTgxNTIxfQ.XOHWzwDvpvo33AIflvgPoyy4lkqOSUkTf8FdPEN7Td8','2026-01-15 10:45:21','2026-01-21 10:45:21','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-14 07:45:21'),(176,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY4Mzc2ODk3LCJleHAiOjE3Njg0NjMyOTd9.Lp6fN9uL8iypn1oPXpZW2g7JcbmpChcT8ztMyfcifYQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2ODM3Njg5NywiZXhwIjoxNzY4OTgxNjk3fQ.3Q5SX0ycDdGV0zdGooTwsdEXCciGY7_PfGgGoTVRnbc','2026-01-15 10:48:17','2026-01-21 10:48:17','192.168.72.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',1,'2026-01-14 07:48:17'),(177,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTQ0MzgxLCJleHAiOjE3Njg2MzA3ODF9.Bw_n8aMDyKT0pYNTC-ItkekOwC8IcZictqdP3TyQ95M','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODU0NDM4MSwiZXhwIjoxNzY5MTQ5MTgxfQ.a-1F3spG55GPzAh4kZpz92EPsGJNnV4wj1Ly1ReYxB0','2026-01-17 09:19:41','2026-01-23 09:19:41','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-16 06:19:41'),(178,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTU5MTU4LCJleHAiOjE3Njg2NDU1NTh9.pQB-SD5ixeHyWQsCOo4cGSSA4zXGNNg3VOG9ifNV_6E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODU1OTE1OCwiZXhwIjoxNzY5MTYzOTU4fQ.KeSMMLXJxqlupzmG4u6g_nZAyEoz6Ntmswe8NGi20ew','2026-01-17 13:25:59','2026-01-23 13:25:59','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-16 10:25:58'),(179,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTU5NDE2LCJleHAiOjE3Njg2NDU4MTZ9.8VhuEKywq2ottJn0B-IJIIYwwA_ubwTFGIcNg3asQuc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODU1OTQxNiwiZXhwIjoxNzY5MTY0MjE2fQ.J45o3Y6n0SsIDbZiN4aVpQxGmiySp3AL2_9xEN7s9r0','2026-01-17 13:30:16','2026-01-23 13:30:16','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-16 10:30:16'),(180,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTYwOTg4LCJleHAiOjE3Njg2NDczODh9.EDE8w5h0-uhiIx6zfTtAeI92WTVTQ5ReATS8SHjZJYo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODU2MDk4OCwiZXhwIjoxNzY5MTY1Nzg4fQ.rr5u8WziBJIbPvf-t50B8vMy2mGO8t5bN5STmHM1Os0','2026-01-17 13:56:29','2026-01-23 13:56:29','192.168.2.198','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',1,'2026-01-16 10:56:28'),(181,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY4NTY4MTYxLCJleHAiOjE3Njg2NTQ1NjF9.I6MP8gXpuQGuqTHXRbb4yG4qdoYhbxPgCJcDtT4bsdE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2ODU2ODE2MSwiZXhwIjoxNzY5MTcyOTYxfQ.Ds2cif2V0iiInQZJOYvVkqfbqKagf-sIn-uq0mp22J4','2026-01-17 15:56:01','2026-01-23 15:56:01','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2026-01-16 12:56:01'),(182,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTY4MjM2LCJleHAiOjE3Njg2NTQ2MzZ9.Ka5ZJ9fV80tSXHWGi-eklOAXvUdPUQ6rjj_nTpgbpU0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODU2ODIzNiwiZXhwIjoxNzY5MTczMDM2fQ.71_mjB4Kw_avwomvAy77aYJsmDQF1__n2ItHeMVjeI8','2026-01-17 15:57:16','2026-01-23 15:57:16','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',1,'2026-01-16 12:57:16'),(183,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NTY4NDU2LCJleHAiOjE3Njg2NTQ4NTZ9.b1NSxFuIOGKS1TIbYxUO6dUauM4NGxmwZr-nUqLcbvo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODU2ODQ1NiwiZXhwIjoxNzY5MTczMjU2fQ.HGO6SHP8cW7yIwTooJifAhLxASmauy00_MLo6A4PMPA','2026-01-17 16:00:57','2026-01-23 16:00:57','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-16 13:00:56'),(184,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NzMxMjIxLCJleHAiOjE3Njg4MTc2MjF9.CPCSX91GlZjpx--stefYWX25vXhhv4kdRHNi99StjVA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODczMTIyMSwiZXhwIjoxNzY5MzM2MDIxfQ.uTLIYyP9Z3golAZdn-h3Dzyi-DF-AZ3NKZdfn4S2OHc','2026-01-19 13:13:42','2026-01-25 13:13:42','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2026-01-18 10:13:41'),(185,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4NzQwMjc4LCJleHAiOjE3Njg4MjY2Nzh9.zA0t3hjiq9g7hR0m3UmrVyUQg3ITTsmLz4pcJoP6W_8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODc0MDI3OCwiZXhwIjoxNzY5MzQ1MDc4fQ.5jEFiwkz9HXRPMsBABOsSAHCcatQEK9NIK2WIskduDk','2026-01-19 15:44:39','2026-01-25 15:44:39','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',1,'2026-01-18 12:44:38'),(186,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY4ODg4MDA4LCJleHAiOjE3Njg5NzQ0MDh9.hDqE61NQ1SFnG_2FQm2P206_Srp3ZKyp7V5wwlJ8q6g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2ODg4ODAwOCwiZXhwIjoxNzY5NDkyODA4fQ.dw4-7BuvHR_Uo0AvnBj5GJTvdoxSH0ln2C_AsvzhEoE','2026-01-21 08:46:49','2026-01-27 08:46:49','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',1,'2026-01-20 05:46:48'),(187,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ1MTUzLCJleHAiOjE3Njk0MzE1NTN9.KF7vkHc_N1-58EkD85BvecYbp8LlV6i6E2TtencCIYk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0NTE1MywiZXhwIjoxNzY5OTQ5OTUzfQ.LgFp3arekxjQ1K3eZ6QTSB1OX5hgcypcLvVsuVEoqmM','2026-01-26 15:45:54','2026-02-01 15:45:54','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 12:45:53'),(188,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ2NTY0LCJleHAiOjE3Njk0MzI5NjR9.DLS3Zwr5e-EflKrk6HQzfg4s1mWSPr762jIItijdF7A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0NjU2NCwiZXhwIjoxNzY5OTUxMzY0fQ.ynvFS-RJ4Y01VorxDs2mnfJi4hi5tI0jKXvTYXQFMbI','2026-01-26 16:09:24','2026-02-01 16:09:24','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:09:24'),(189,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ2NjU1LCJleHAiOjE3Njk0MzMwNTV9.YvsWPBVWQlRNeHEWzd-SJ6q-DBRTwonkTkMCH2R23RI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0NjY1NSwiZXhwIjoxNzY5OTUxNDU1fQ.zdKL8kp_MJrYFJJkNnlNiwFORlCO86RgoEu2PgxYJAw','2026-01-26 16:10:56','2026-02-01 16:10:56','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:10:55'),(190,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ3Mzg1LCJleHAiOjE3Njk0MzM3ODV9.uiiamVlyMDYfIsx3gScj3mro6lXh_eJ2vbUzIXwMq08','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0NzM4NSwiZXhwIjoxNzY5OTUyMTg1fQ.ecdpls5gd2S2AtRAJFjKtyam3lEwGeD9fETxU54Z0oI','2026-01-26 16:23:05','2026-02-01 16:23:05','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:23:05'),(191,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ3NTYyLCJleHAiOjE3Njk0MzM5NjJ9.QQsNGJRb8n3JRMeNAwh-EQuvUe8ck_eoa-z2qPRCyBM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0NzU2MiwiZXhwIjoxNzY5OTUyMzYyfQ.3NrkMi3YnnbVKkUPQXu9bmCnzq-Kw_FJl2bUM5jQxH0','2026-01-26 16:26:03','2026-02-01 16:26:03','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:26:02'),(192,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ3NjIxLCJleHAiOjE3Njk0MzQwMjF9.Qm8ybTcdN_x1GSG2Ijsvzabp3hGcbLXs2foGdwvx8JY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0NzYyMSwiZXhwIjoxNzY5OTUyNDIxfQ.Sz2ciAIwtB8MCHK7Su94g-puUbisGNNMfmAxUzzCIyY','2026-01-26 16:27:01','2026-02-01 16:27:01','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:27:01'),(193,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ3NjQ0LCJleHAiOjE3Njk0MzQwNDR9.TJ9klt5aoOcTKr5Zi7yrNEc7IcH9_9YdxrxJKFERPK4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0NzY0NCwiZXhwIjoxNzY5OTUyNDQ0fQ.u-JZEOUZK38rwrPI8kJws0M4S3x9RfsnAhy176uf_nw','2026-01-26 16:27:25','2026-02-01 16:27:25','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:27:24'),(194,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5MzQ3NjcxLCJleHAiOjE3Njk0MzQwNzF9.2GaLllTm-X1VUhjgj_m443CN2JhR_GpOlEbrnSUwjDs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0NzY3MSwiZXhwIjoxNzY5OTUyNDcxfQ.ee9gjfAxohxrYEM8MCTyUmxX4U0GcDLmggr0XWPKuUQ','2026-01-26 16:27:52','2026-02-01 16:27:52','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:27:51'),(195,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ3ODI3LCJleHAiOjE3Njk0MzQyMjd9.1Pe26V194US_DJpYtaXcMeel_mLppemZBH5-YAzdUL4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0NzgyNywiZXhwIjoxNzY5OTUyNjI3fQ.wWaM3t7OcFi_fJoXo2uS2-uq34qrr4AS8z4htn5yUvg','2026-01-26 16:30:27','2026-02-01 16:30:27','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-25 13:30:27'),(196,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5MzQ4MTgzLCJleHAiOjE3Njk0MzQ1ODN9.DkZ4LBPyget0ITRUsefmhpuv6pyRFIqUOdazQG5lHZo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0ODE4MywiZXhwIjoxNzY5OTUyOTgzfQ.yIBAerDrAtqEJvyEFNWg9yDjcpUtfupQ00lZSgW16LM','2026-01-26 16:36:23','2026-02-01 16:36:23','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',1,'2026-01-25 13:36:23'),(197,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ4NTQ5LCJleHAiOjE3Njk0MzQ5NDl9.qYA5QiM_cJfwqQH-7bNNFSkIf-oN17hG487ii_weMas','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0ODU0OSwiZXhwIjoxNzY5OTUzMzQ5fQ.rQqng1Sciu4E1rf546RMSd1DHnT1V1kOYDxWRmGerck','2026-01-26 16:42:30','2026-02-01 16:42:30','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',0,'2026-01-25 13:42:29'),(198,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ5MjE4LCJleHAiOjE3Njk0MzU2MTh9.u-hzsIu_6ow9hILslRejQj5LWHmdJYFlJSl8pMixHdU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0OTIxOCwiZXhwIjoxNzY5OTU0MDE4fQ.al2MOmyKo3diTPDQVPJtvZ_VtQqG-bM4n7HfK20XY6Q','2026-01-26 16:53:38','2026-02-01 16:53:38','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-25 13:53:38'),(199,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5MzQ5NDk0LCJleHAiOjE3Njk0MzU4OTR9.yTF-PKcA23OppbEu-MSTnPLUA6eTqJU-Jd9drN94jFI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTM0OTQ5NCwiZXhwIjoxNzY5OTU0Mjk0fQ.ac4Btbz821pg9p3QDdkxGUTf8MO3_87USgoVvoThT2Y','2026-01-26 16:58:15','2026-02-01 16:58:15','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2026-01-25 13:58:14'),(200,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5MzQ5NjMwLCJleHAiOjE3Njk0MzYwMzB9.Mwm2i0SUQNZ51rjP0M3VlfzKaUyVn9ytcpRuE3k1Y0E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM0OTYzMCwiZXhwIjoxNzY5OTU0NDMwfQ.KKwyug58a1hUwSBAf5KJjrdWqsRm38d7TNy1zGyrb50','2026-01-26 17:00:30','2026-02-01 17:00:30','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',0,'2026-01-25 14:00:30'),(201,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiZmluYW5jZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImZpbmFuY2UiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2OTM0OTg2OCwiZXhwIjoxNzY5NDM2MjY4fQ.WVVtMI0cKGdJGQrfIUsY5LSFx979arfU0k-1rRMGhOI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2OTM0OTg2OCwiZXhwIjoxNzY5OTU0NjY4fQ.Xj4kRMlYgNqSXOBs0XKYw2Vy31pH3WDqZLVygylYL4c','2026-01-26 17:04:28','2026-02-01 17:04:28','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',0,'2026-01-25 14:04:28'),(202,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiZmluYW5jZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImZpbmFuY2UiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2OTM1MDkwNCwiZXhwIjoxNzY5NDM3MzA0fQ.tvgnktNpHNdqgIBSbfe63swToiUB_-CPvVKra4c0Ldk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2OTM1MDkwNCwiZXhwIjoxNzY5OTU1NzA0fQ.yakPTaCmC_k5s9ZgyAuQ7Zqn27GOnYB93pOdJUWfpDI','2026-01-26 17:21:44','2026-02-01 17:21:44','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',0,'2026-01-25 14:21:44'),(203,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiZmluYW5jZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImZpbmFuY2UiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2OTM1MTA1MiwiZXhwIjoxNzY5NDM3NDUyfQ.k_utujPHsTrYUUrcTYUl9KJPdHDDN391U3tVtWFoLb4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2OTM1MTA1MiwiZXhwIjoxNzY5OTU1ODUyfQ.0KztrQ5OdPPpXnFrINl9NSjmR8IGnMuxp5eBvJzhk3A','2026-01-26 17:24:13','2026-02-01 17:24:13','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',1,'2026-01-25 14:24:12'),(204,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5MzUxMzg2LCJleHAiOjE3Njk0Mzc3ODZ9.bDKY8AuW2C1hgahZcmI8G4sY1fzvFlSyob-cCS6P5Ms','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTM1MTM4NiwiZXhwIjoxNzY5OTU2MTg2fQ.rvR2_po0yR30-xSUS08ZwJ_RAVzgoIqMIoa1pJIa6j8','2026-01-26 17:29:47','2026-02-01 17:29:47','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',1,'2026-01-25 14:29:46'),(205,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5NTc4MTkzLCJleHAiOjE3Njk2NjQ1OTN9.ZF7GMblZLltGB1k8m68GEm_E3DG9uBkeKyzk987bLAA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTU3ODE5MywiZXhwIjoxNzcwMTgyOTkzfQ.0hDtNyX0IBkVQ0IOJq5lPHKb7qh4v5kvrWtAIohs_E4','2026-01-29 08:29:53','2026-02-04 08:29:53','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-28 05:29:53'),(206,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5NTc4NDYyLCJleHAiOjE3Njk2NjQ4NjJ9.F6082WmJ2qyVN-kom0Icn_oI67FmoN8TVpK6TXy6BQo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTU3ODQ2MiwiZXhwIjoxNzcwMTgzMjYyfQ.VgtU6hRKwI9CPjzsiM-AFZiDpPXRCp9ySZq7JIyxMPQ','2026-01-29 08:34:22','2026-02-04 08:34:22','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-28 05:34:22'),(207,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5NTc4NzUxLCJleHAiOjE3Njk2NjUxNTF9.g3NY47FN08EQegWy-BMToMlK8lwQluWw17JsCqeYBBU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTU3ODc1MSwiZXhwIjoxNzcwMTgzNTUxfQ.d7SmP4zVi9WtcntmSD2RGUj0RmR1YfevBiw01KAvHqw','2026-01-29 08:39:11','2026-02-04 08:39:11','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-28 05:39:11'),(208,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiZmluYW5jZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImZpbmFuY2UiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2OTU3ODgwNCwiZXhwIjoxNzY5NjY1MjA0fQ.Cd0FYBoOS15oZ8bMwnqp8eugb5UpcygcBNtOxAWZJpU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2OTU3ODgwNCwiZXhwIjoxNzcwMTgzNjA0fQ.GZ_GnA_3era59zElcow9aONE8QcC3FTG4qHj72UlAmY','2026-01-29 08:40:05','2026-02-04 08:40:05','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-01-28 05:40:04'),(209,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5NTgwMTg3LCJleHAiOjE3Njk2NjY1ODd9.Hv-KL5Z5GEHnfqMOT86PBzDi7yp19YiZmE-TFDv1hVY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTU4MDE4NywiZXhwIjoxNzcwMTg0OTg3fQ.PM3iTU65zDnduGS1OwkS3JyogszWtwPwUjrBzPvAkAs','2026-01-29 09:03:08','2026-02-04 09:03:08','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',1,'2026-01-28 06:03:07'),(210,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoicmVwb3J0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicmVwb3J0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3Njk1ODE1MDksImV4cCI6MTc2OTY2NzkwOX0.RkccLEiChtLiz2Ba5qwbPKWF56nxFLB60R3CUpHXLgc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2OTU4MTUwOSwiZXhwIjoxNzcwMTg2MzA5fQ.80PGObTsvQxR0Eg6MfdyzYhjG5dPZQ9359C8dn47CeM','2026-01-29 09:25:09','2026-02-04 09:25:09','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-01-28 06:25:09'),(211,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5NTg0MzMxLCJleHAiOjE3Njk2NzA3MzF9.9rOXJQWfGhDkIM7GqzgAD2yeJD1JFgpCTRgwfN4c_t8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTU4NDMzMSwiZXhwIjoxNzcwMTg5MTMxfQ.FO9Gups18rW368fYA9lpHN0hZ2QDesWM6NAk_6ce6v0','2026-01-29 10:12:11','2026-02-04 10:12:11','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',1,'2026-01-28 07:12:11'),(212,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5OTU5ODY2LCJleHAiOjE3NzAwNDYyNjZ9.FGqU42DYGZhSWlYEzE9_PByrwll-gjMO0ZGUGxRzNMw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTk1OTg2NiwiZXhwIjoxNzcwNTY0NjY2fQ.5whGV0BwLeJbyHX4-zkthsaQgsIxqJ7Nu6ERvc87Jg4','2026-02-02 18:31:06','2026-02-08 18:31:06','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-02-01 15:31:06'),(213,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY5OTYwNDI4LCJleHAiOjE3NzAwNDY4Mjh9.RfmGDP6wYPXBGhPWgR-2jTMrKgW7fo85XANPmIc1kew','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTk2MDQyOCwiZXhwIjoxNzcwNTY1MjI4fQ.P7em7U1CbTZ_boVfcfObFewnAIFliydLdRy9gQRdVG4','2026-02-02 18:40:28','2026-02-08 18:40:28','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',0,'2026-02-01 15:40:28'),(214,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY5OTYwNDU4LCJleHAiOjE3NzAwNDY4NTh9.najr9nmSxuPm7DHqj-PxYC8qg-hDg_0bLFzhhV0Gamg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTk2MDQ1OCwiZXhwIjoxNzcwNTY1MjU4fQ.nLL8Of-cNb2NgtQ3w3KZCU-fLnusDeSY8y-cqJRkb9s','2026-02-02 18:40:59','2026-02-08 18:40:59','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',1,'2026-02-01 15:40:58'),(215,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzcwMDUyOTcyLCJleHAiOjE3NzAxMzkzNzJ9.XhmNKJKRh6iJQstlPHEYEbXKZYuLu3JaTljVlCgyhWM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MDA1Mjk3MiwiZXhwIjoxNzcwNjU3NzcyfQ.1pFAACm-QR-_GBQOe9K46ZCB4m5fx817TY824H2hi8M','2026-02-03 20:22:52','2026-02-09 20:22:52','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-02-02 17:22:52'),(216,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWN0aXZpdHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY3Rpdml0eSIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzcwMDUzODEyLCJleHAiOjE3NzAxNDAyMTJ9._bQ7PFTbOYIOMC3VvROcfYVvii21xup9rs64OdeH6Uo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MDA1MzgxMiwiZXhwIjoxNzcwNjU4NjEyfQ.H1GZXm24FRIFB4im8zzN1UJYywlHfZuWgU7PnxIzEGg','2026-02-03 20:36:53','2026-02-09 20:36:53','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',0,'2026-02-02 17:36:52'),(217,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciB0ZXN0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NzAwNTM4OTEsImV4cCI6MTc3MDE0MDI5MX0.iDFa8ImytqWMiRxykUqEOuKIL_yE1Er7MuCJ6Lxve5k','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MDA1Mzg5MSwiZXhwIjoxNzcwNjU4NjkxfQ.E8bEqyZxfPM2mpdi_vtAjif3R_nLVva5__lHPmgxOos','2026-02-03 20:38:11','2026-02-09 20:38:11','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',1,'2026-02-02 17:38:11');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_theme_preferences`
--

DROP TABLE IF EXISTS `user_theme_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_theme_preferences` (
  `user_id` int NOT NULL,
  `theme_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `follow_system` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `idx_user_theme` (`theme_id`),
  CONSTRAINT `fk_user_theme_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_theme_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_theme_preferences`
--

LOCK TABLES `user_theme_preferences` WRITE;
/*!40000 ALTER TABLE `user_theme_preferences` DISABLE KEYS */;
INSERT INTO `user_theme_preferences` VALUES (1,'theme-9',0,'2026-01-13 18:52:45','2026-02-02 17:23:15'),(2,'theme-1',0,'2026-01-25 13:24:09','2026-01-28 05:37:17'),(3,'custom-1768330164164',0,'2026-01-14 07:48:36','2026-01-14 07:48:47'),(4,'theme-4',0,'2026-01-25 14:16:22','2026-01-25 14:16:22'),(5,'theme-10',0,'2026-01-28 06:27:59','2026-01-28 07:03:28');
/*!40000 ALTER TABLE `user_theme_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_picture` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','program_manager','me_officer','field_officer','viewer') COLLATE utf8mb4_unicode_ci DEFAULT 'field_officer',
  `assigned_programs` json DEFAULT NULL COMMENT 'Array of program IDs',
  `is_active` tinyint(1) DEFAULT '1',
  `is_system_admin` tinyint(1) DEFAULT '0' COMMENT 'System-wide admin flag',
  `sync_status` enum('synced','pending','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `clickup_user_id` (`clickup_user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_clickup` (`clickup_user_id`),
  KEY `idx_users_is_system_admin` (`is_system_admin`),
  KEY `idx_users_is_active` (`is_active`),
  KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System Users';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'admin','admin@gmail.com','$2a$10$KdsBLq.abN5f1C6xGHoz9OAJ6SGL4D2IWrRYcZe.rhI3JyY.4vkfS','System Administrator',NULL,'admin',NULL,1,1,'pending',NULL,'2026-02-02 20:22:52','2025-12-02 04:48:26','2026-02-02 17:22:52',NULL),(2,NULL,'activity','activity@gmail.com','$2a$10$NZMC6rmC0eD30c3dmPnjSeM3g/ApT0QQ.kG1O0o99xapf.rGz9ubm','Activity officer',NULL,'field_officer',NULL,1,0,'pending',NULL,'2026-02-02 20:36:52','2026-01-08 12:32:34','2026-02-02 17:36:52',NULL),(3,NULL,'director test','director@gmail.com','$2a$10$WhpbTMNIQr1ccvUk0nMcpuw17IJrj7AqZPbURe4wCdIaQgUOJjTUq','director program test',NULL,'field_officer',NULL,1,0,'pending',NULL,'2026-02-02 20:38:11','2026-01-08 12:37:31','2026-02-02 17:38:11',NULL),(4,NULL,'finance','finance@gmail.com','$2a$10$a7kFSpF/BOCcqVRW1Xy0Y.sIwjOcLlYNzwvUlyri2NwPv7hM80w9a','finance officer',NULL,'field_officer',NULL,1,0,'pending',NULL,'2026-01-28 08:40:04','2026-01-25 14:04:01','2026-01-28 05:40:04',NULL),(5,NULL,'report','report@gmail.com','$2a$10$eOylH0AqNG7rtfMe72k3DOUJxcjaT77m8l1pUrOfGlbo1UTejRwhy','report viewer',NULL,'field_officer',NULL,1,0,'pending',NULL,'2026-01-28 09:25:09','2026-01-28 06:24:45','2026-01-28 06:25:09',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_indicators_with_latest`
--

DROP TABLE IF EXISTS `v_indicators_with_latest`;
/*!50001 DROP VIEW IF EXISTS `v_indicators_with_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_indicators_with_latest` AS SELECT 
 1 AS `id`,
 1 AS `program_id`,
 1 AS `project_id`,
 1 AS `activity_id`,
 1 AS `name`,
 1 AS `code`,
 1 AS `description`,
 1 AS `type`,
 1 AS `category`,
 1 AS `unit_of_measure`,
 1 AS `baseline_value`,
 1 AS `target_value`,
 1 AS `current_value`,
 1 AS `collection_frequency`,
 1 AS `data_source`,
 1 AS `verification_method`,
 1 AS `disaggregation`,
 1 AS `clickup_custom_field_id`,
 1 AS `is_active`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `module_id`,
 1 AS `sub_program_id`,
 1 AS `component_id`,
 1 AS `baseline_date`,
 1 AS `target_date`,
 1 AS `last_measured_date`,
 1 AS `next_measurement_date`,
 1 AS `status`,
 1 AS `achievement_percentage`,
 1 AS `responsible_person`,
 1 AS `notes`,
 1 AS `deleted_at`,
 1 AS `latest_value`,
 1 AS `latest_measurement_date`,
 1 AS `progress_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_results_chain_detailed`
--

DROP TABLE IF EXISTS `v_results_chain_detailed`;
/*!50001 DROP VIEW IF EXISTS `v_results_chain_detailed`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_results_chain_detailed` AS SELECT 
 1 AS `id`,
 1 AS `from_entity_type`,
 1 AS `from_entity_id`,
 1 AS `to_entity_type`,
 1 AS `to_entity_id`,
 1 AS `contribution_description`,
 1 AS `contribution_weight`,
 1 AS `notes`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `from_entity_name`,
 1 AS `to_entity_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `webhook_events`
--

DROP TABLE IF EXISTS `webhook_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhook_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `webhook_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clickup_entity_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `processed` tinyint(1) DEFAULT '0',
  `processed_at` datetime DEFAULT NULL,
  `processing_error` text COLLATE utf8mb4_unicode_ci,
  `received_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `webhook_id` (`webhook_id`),
  KEY `idx_event` (`event_type`),
  KEY `idx_processed` (`processed`),
  KEY `idx_received` (`received_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Incoming Webhook Events from ClickUp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhook_events`
--

LOCK TABLES `webhook_events` WRITE;
/*!40000 ALTER TABLE `webhook_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhook_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `v_indicators_with_latest`
--

/*!50001 DROP VIEW IF EXISTS `v_indicators_with_latest`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_indicators_with_latest` AS select `i`.`id` AS `id`,`i`.`program_id` AS `program_id`,`i`.`project_id` AS `project_id`,`i`.`activity_id` AS `activity_id`,`i`.`name` AS `name`,`i`.`code` AS `code`,`i`.`description` AS `description`,`i`.`type` AS `type`,`i`.`category` AS `category`,`i`.`unit_of_measure` AS `unit_of_measure`,`i`.`baseline_value` AS `baseline_value`,`i`.`target_value` AS `target_value`,`i`.`current_value` AS `current_value`,`i`.`collection_frequency` AS `collection_frequency`,`i`.`data_source` AS `data_source`,`i`.`verification_method` AS `verification_method`,`i`.`disaggregation` AS `disaggregation`,`i`.`clickup_custom_field_id` AS `clickup_custom_field_id`,`i`.`is_active` AS `is_active`,`i`.`created_at` AS `created_at`,`i`.`updated_at` AS `updated_at`,`i`.`module_id` AS `module_id`,`i`.`sub_program_id` AS `sub_program_id`,`i`.`component_id` AS `component_id`,`i`.`baseline_date` AS `baseline_date`,`i`.`target_date` AS `target_date`,`i`.`last_measured_date` AS `last_measured_date`,`i`.`next_measurement_date` AS `next_measurement_date`,`i`.`status` AS `status`,`i`.`achievement_percentage` AS `achievement_percentage`,`i`.`responsible_person` AS `responsible_person`,`i`.`notes` AS `notes`,`i`.`deleted_at` AS `deleted_at`,`r`.`value` AS `latest_value`,`r`.`reporting_period_end` AS `latest_measurement_date`,(case when (`i`.`target_value` > 0) then ((`i`.`current_value` / `i`.`target_value`) * 100) else 0 end) AS `progress_percentage` from (`me_indicators` `i` left join `me_results` `r` on(((`i`.`id` = `r`.`indicator_id`) and (`r`.`reporting_period_end` = (select max(`me_results`.`reporting_period_end`) from `me_results` where (`me_results`.`indicator_id` = `i`.`id`)))))) where (`i`.`deleted_at` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_results_chain_detailed`
--

/*!50001 DROP VIEW IF EXISTS `v_results_chain_detailed`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_results_chain_detailed` AS select `rc`.`id` AS `id`,`rc`.`from_entity_type` AS `from_entity_type`,`rc`.`from_entity_id` AS `from_entity_id`,`rc`.`to_entity_type` AS `to_entity_type`,`rc`.`to_entity_id` AS `to_entity_id`,`rc`.`contribution_description` AS `contribution_description`,`rc`.`contribution_weight` AS `contribution_weight`,`rc`.`notes` AS `notes`,`rc`.`created_at` AS `created_at`,`rc`.`updated_at` AS `updated_at`,`rc`.`created_by` AS `created_by`,(case `rc`.`from_entity_type` when 'activity' then (select `activities`.`name` from `activities` where (`activities`.`id` = `rc`.`from_entity_id`)) when 'component' then (select `project_components`.`name` from `project_components` where (`project_components`.`id` = `rc`.`from_entity_id`)) when 'sub_program' then (select `sub_programs`.`name` from `sub_programs` where (`sub_programs`.`id` = `rc`.`from_entity_id`)) end) AS `from_entity_name`,(case `rc`.`to_entity_type` when 'component' then (select `project_components`.`name` from `project_components` where (`project_components`.`id` = `rc`.`to_entity_id`)) when 'sub_program' then (select `sub_programs`.`name` from `sub_programs` where (`sub_programs`.`id` = `rc`.`to_entity_id`)) when 'module' then (select `program_modules`.`name` from `program_modules` where (`program_modules`.`id` = `rc`.`to_entity_id`)) end) AS `to_entity_name` from `results_chain` `rc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-12 13:05:32
