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
  `status` enum('not-started','in-progress','completed','blocked','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
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
  CONSTRAINT `fk_activities_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_activities_subprogram` FOREIGN KEY (`project_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (6,1,'community health training','ACT-1763978755976','Went well',NULL,'2025-11-25','2025-12-03','cancelled',0,NULL,NULL,'pending',NULL,'2025-11-24 10:05:56','2025-11-24 17:28:38',NULL,1,'2025-11-23',NULL,'CC road ','Nairobi','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',20,10,'women',300.00,200.00,'approved','normal',NULL),(7,2,'Activity one','ACT-1764004280149','Activity one',NULL,'2025-11-25',NULL,'in-progress',0,NULL,NULL,'pending',NULL,'2025-11-24 17:11:20','2025-11-24 17:12:23',NULL,3,'2025-11-23',NULL,'Kibera','Nairobi','Ward-near','Nairobi',4,'susan kei, james kio','peter james, test user',100,0,'youth',1000.00,0.00,'submitted','high',NULL);
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
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('activity','goal','indicator','sub_program','comment') COLLATE utf8mb4_unicode_ci NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_type` (`attachment_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Attachments & Evidence - ClickUp Attachments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
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
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `beneficiary_id_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `age_group` enum('0-5','6-17','18-35','36-60','60+') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_type` enum('individual','household','group','organization') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `parish` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_coordinates` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_vulnerable` tinyint(1) DEFAULT '0',
  `vulnerability_category` json DEFAULT NULL COMMENT 'Array of categories',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `demographics` json DEFAULT NULL COMMENT 'Extended demographic data',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `beneficiary_id_number` (`beneficiary_id_number`),
  KEY `idx_type` (`beneficiary_type`),
  KEY `idx_location` (`location_id`),
  KEY `idx_vulnerable` (`is_vulnerable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registered Beneficiaries';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaries`
--

LOCK TABLES `beneficiaries` WRITE;
/*!40000 ALTER TABLE `beneficiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `beneficiaries` ENABLE KEYS */;
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
  `entity_type` enum('activity','goal','sub_program','component') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_comment_id` (`clickup_comment_id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_type` (`comment_type`),
  KEY `idx_clickup` (`clickup_comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Comments & Notes - ClickUp Comments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Goal Categories (Organizational Objectives) - ClickUp Goal Folders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal_categories`
--

LOCK TABLES `goal_categories` WRITE;
/*!40000 ALTER TABLE `goal_categories` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Geographic Locations (Hierarchical)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
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
  `type` enum('output','outcome','impact') COLLATE utf8mb4_unicode_ci NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `activity_id` (`activity_id`),
  KEY `idx_program` (`program_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_code` (`code`),
  CONSTRAINT `me_indicators_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_indicators`
--

LOCK TABLES `me_indicators` WRITE;
/*!40000 ALTER TABLE `me_indicators` DISABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_space_id` (`clickup_space_id`),
  KEY `idx_organization` (`organization_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_space_id`),
  CONSTRAINT `program_modules_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 1: Program Modules (Major Thematic Areas) - ClickUp Spaces';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_modules`
--

LOCK TABLES `program_modules` WRITE;
/*!40000 ALTER TABLE `program_modules` DISABLE KEYS */;
INSERT INTO `program_modules` VALUES (1,1,'Food, Water & Environment','FOOD_ENV','🌾','Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL),(2,1,'Socio-Economic Empowerment','SOCIO_ECON','💼','Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL),(3,1,'Gender, Youth & Peace','GENDER_YOUTH','👥','Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL),(4,1,'Relief & Charitable Services','RELIEF','🆘','Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL),(5,1,'Capacity Building','CAPACITY','📚','Staff Training & Development, Volunteer Mobilization & Management, Community Leadership Training, Organizational Development, and Knowledge Management',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (1,'Food & Environment','FOOD_ENV','🌾','Sustainable agriculture, food security, and environmental conservation programs',NULL,'2024-01-01',NULL,500000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(2,'Socio-Economic','SOCIO_ECON','💼','Economic empowerment, livelihoods, and poverty alleviation initiatives',NULL,'2024-01-01',NULL,450000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(3,'Gender & Youth','GENDER_YOUTH','👥','Gender equality, youth empowerment, and social inclusion programs',NULL,'2024-01-01',NULL,350000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(4,'Relief Services','RELIEF','🏥','Emergency relief, health services, and humanitarian assistance',NULL,'2024-01-01',NULL,600000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(5,'Capacity Building','CAPACITY','🎓','Training, institutional strengthening, and skills development programs',NULL,'2024-01-01',NULL,400000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL);
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
  `status` enum('not-started','in-progress','completed','blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'not-started',
  `progress_percentage` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `responsible_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_list_id` (`clickup_list_id`),
  KEY `idx_sub_program` (`sub_program_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_list_id`),
  CONSTRAINT `project_components_ibfk_1` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_components_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 3: Project Components (Work Packages) - ClickUp Lists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_components`
--

LOCK TABLES `project_components` WRITE;
/*!40000 ALTER TABLE `project_components` DISABLE KEYS */;
INSERT INTO `project_components` VALUES (1,1,'Health outreach ','COMP-001','For health outreach ',NULL,500.00,0,'not-started',0,1,'James keya','pending',NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01',NULL),(2,1,'professional volunteers training','COMP-002','professional volunteers ',NULL,500.00,0,'',0,1,'Susan susan','pending',NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56',NULL),(3,2,'Component 1','COMP-003','',NULL,2000.00,0,'not-started',0,1,'Susan kpt','pending',NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Strategic Goals (High-Level Objectives) - ClickUp Goals';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `strategic_goals`
--

LOCK TABLES `strategic_goals` WRITE;
/*!40000 ALTER TABLE `strategic_goals` DISABLE KEYS */;
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
  `status` enum('planning','active','on-hold','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','syncing','conflict','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 2: Sub-Programs/Projects (Specific Initiatives) - ClickUp Folders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_programs`
--

LOCK TABLES `sub_programs` WRITE;
/*!40000 ALTER TABLE `sub_programs` DISABLE KEYS */;
INSERT INTO `sub_programs` VALUES (1,5,'Vital practical ','CHI-001','Vital practice and energy inspiration ',NULL,2000.00,0.00,'2025-11-25','2025-11-29',0,'Peter Peter',NULL,200,0,'\"Nairobi PLC\"','active','high',1,'pending',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52',NULL),(2,5,'UDDP Follow Up training','CHI-002','UDDP Follow Up training',NULL,300.00,0.00,'2025-11-29','2025-12-02',0,NULL,NULL,20,0,'\"Kibera\"','planning','urgent',1,'pending',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_queue`
--

LOCK TABLES `sync_queue` WRITE;
/*!40000 ALTER TABLE `sync_queue` DISABLE KEYS */;
INSERT INTO `sync_queue` VALUES (1,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:53:52',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52'),(2,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:57:01',NULL,NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01'),(3,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:59:56',NULL,NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56'),(4,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 19:22:55',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55'),(5,'create','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 13:05:56',NULL,NULL,'2025-11-24 10:05:56','2025-11-24 10:05:56'),(6,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:32:42',NULL,NULL,'2025-11-24 11:32:42','2025-11-24 11:32:42'),(7,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:38:45',NULL,NULL,'2025-11-24 11:38:45','2025-11-24 11:38:45'),(8,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:03:43',NULL,NULL,'2025-11-24 14:03:43','2025-11-24 14:03:43'),(9,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:04:26',NULL,NULL,'2025-11-24 14:04:26','2025-11-24 14:04:26'),(10,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:06',NULL,NULL,'2025-11-24 14:15:06','2025-11-24 14:15:06'),(11,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:11',NULL,NULL,'2025-11-24 14:15:11','2025-11-24 14:15:11'),(12,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:14',NULL,NULL,'2025-11-24 14:15:14','2025-11-24 14:15:14'),(13,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:18',NULL,NULL,'2025-11-24 14:15:18','2025-11-24 14:15:18'),(14,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:22',NULL,NULL,'2025-11-24 14:15:22','2025-11-24 14:15:22'),(15,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:16:33',NULL,NULL,'2025-11-24 14:16:33','2025-11-24 14:16:33'),(16,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:01',NULL,NULL,'2025-11-24 14:37:01','2025-11-24 14:37:01'),(17,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:22',NULL,NULL,'2025-11-24 14:37:22','2025-11-24 14:37:22'),(18,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:08',NULL,NULL,'2025-11-24 14:44:08','2025-11-24 14:44:08'),(19,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:12',NULL,NULL,'2025-11-24 14:44:12','2025-11-24 14:44:12'),(20,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:14',NULL,NULL,'2025-11-24 14:44:14','2025-11-24 14:44:14'),(21,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 19:50:04',NULL,NULL,'2025-11-24 16:50:04','2025-11-24 16:50:04'),(22,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:03:54',NULL,NULL,'2025-11-24 17:03:54','2025-11-24 17:03:54'),(23,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2025-11-24 20:08:48',NULL,NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48'),(24,'create','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:20',NULL,NULL,'2025-11-24 17:11:20','2025-11-24 17:11:20'),(25,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:25',NULL,NULL,'2025-11-24 17:11:25','2025-11-24 17:11:25'),(26,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:30',NULL,NULL,'2025-11-24 17:11:30','2025-11-24 17:11:30'),(27,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:55',NULL,NULL,'2025-11-24 17:11:55','2025-11-24 17:11:55'),(28,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:01',NULL,NULL,'2025-11-24 17:12:01','2025-11-24 17:12:01'),(29,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:23',NULL,NULL,'2025-11-24 17:12:23','2025-11-24 17:12:23'),(30,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:13:19',NULL,NULL,'2025-11-24 17:13:19','2025-11-24 17:13:19'),(31,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:28:38',NULL,NULL,'2025-11-24 17:28:38','2025-11-24 17:28:38');
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
  `sync_status` enum('synced','pending','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_synced_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `clickup_user_id` (`clickup_user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_clickup` (`clickup_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System Users';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 20:36:18
