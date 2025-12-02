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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit log for access control and RLS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_audit_log`
--

LOCK TABLES `access_audit_log` WRITE;
/*!40000 ALTER TABLE `access_audit_log` DISABLE KEYS */;
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
  `owned_by` int DEFAULT NULL COMMENT 'User who owns this record',
  `last_modified_by` int DEFAULT NULL COMMENT 'User who last modified',
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
  CONSTRAINT `fk_activities_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_activities_subprogram` FOREIGN KEY (`project_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (6,1,'community health training','ACT-1763978755976','Went well',NULL,'2025-11-25','2025-12-03','completed',0,NULL,NULL,'pending',NULL,'2025-11-24 10:05:56','2025-11-27 07:50:16',NULL,1,'2025-11-17',NULL,'CC road ','Nairobi','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',20,10,'women',300.00,200.00,'approved','normal',NULL,NULL,NULL),(7,2,'Activity one','ACT-1764004280149','Activity one',NULL,'2025-11-25',NULL,'completed',0,NULL,NULL,'pending',NULL,'2025-11-24 17:11:20','2025-11-25 05:26:21',NULL,3,'2025-11-23',NULL,'Kibera','Nairobi','Ward-near','Nairobi',4,'susan kei, james kio','peter james, test user',100,0,'youth',1000.00,0.00,'rejected','high',NULL,NULL,NULL),(8,1,'Introduction to Climate-Smart Agriculture','ACT-FE-001','Workshop covering basics of climate-resilient farming techniques',NULL,'2025-02-10','2025-02-10','in-progress',100,'Mary Wanjiku',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-25 05:24:37',NULL,1,'2025-02-10',NULL,'Kiambu Agricultural Center','Kiambu Town','Municipality','Kiambu',6,'Mary Wanjiku, John Maina, Agricultural Officer','Field Team Alpha',50,48,'farmers',3000.00,2800.00,'rejected','high',NULL,NULL,NULL),(9,1,'Water Harvesting Techniques Training','ACT-FE-002','Practical training on rainwater harvesting and storage methods',NULL,'2025-03-15','2025-03-15','completed',50,'John Maina',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-25 10:11:31',NULL,1,'2025-03-15',NULL,'Community Hall - Githunguri','Githunguri','Central Ward','Kiambu',5,'John Maina, Water Engineer Peter','Field Team Alpha',50,25,'farmers',3500.00,1500.00,'submitted','high',NULL,NULL,NULL),(10,1,'Demonstration Plot Land Preparation','ACT-FE-003','Clearing, plowing, and preparing land for demonstration plots',NULL,'2025-01-20','2025-01-25','completed',100,'Farm Supervisor',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,2,'2025-01-22',NULL,'Kiambu Demo Farm','Kiambu Town','Central','Kiambu',40,'Farm Workers Team','Field Team Alpha',100,95,'farmers',5000.00,4800.00,'approved','',NULL,NULL,NULL),(11,2,'Water Point Technical Survey','ACT-FE-004','Engineering survey and condition assessment of 15 water points',NULL,'2025-02-05','2025-02-12','completed',100,'Engineer Peter',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,3,'2025-02-08',NULL,'Various locations Machakos','Multiple','Multiple','Machakos',56,'Engineer Peter, Survey Team','Technical Team',2000,2000,'community',15000.00,14500.00,'approved','urgent',NULL,NULL,NULL),(12,2,'Mwala Water Point Rehabilitation','ACT-FE-005','Complete rehabilitation of Mwala community water point',NULL,'2025-03-01','2025-03-10','in-progress',60,'John Kamau',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,4,'2025-03-05',NULL,'Mwala Market Area','Mwala','Mwala Ward','Machakos',80,'Engineer Peter, Construction Team','Technical Team',500,0,'community',50000.00,28000.00,'approved','urgent',NULL,NULL,NULL),(13,5,'Kibera VSLA Group Mobilization','ACT-SE-001','Community mobilization and formation of new VSLA groups in Kibera',NULL,'2025-02-01','2025-02-15','blocked',100,'Sarah Njeri',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:01:47',NULL,5,'2025-02-10',NULL,'Kibera Soweto Zone','Kibera','Laini Saba','Nairobi',12,'Sarah Njeri, Community Mobilizers','VSLA Team',150,140,'women',8000.00,7500.00,'approved','high',NULL,NULL,NULL),(14,5,'VSLA Starter Kit Distribution','ACT-SE-002','Distribution of VSLA boxes, record books, and training materials',NULL,'2025-02-20','2025-02-20','in-progress',100,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:01:15',NULL,5,'2025-02-20',NULL,'Kibera Community Hall','Kibera','Laini Saba','Nairobi',4,'Sarah Njeri, James Muturi','VSLA Team',150,145,'women',12000.00,11800.00,'approved','high',NULL,NULL,NULL),(15,5,'Basic Financial Management Workshop','ACT-SE-003','Training on budgeting, saving, and financial planning',NULL,'2025-03-05','2025-03-05','in-progress',50,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:32:25',NULL,6,'2025-03-05',NULL,'Olympic Community Center','Kibera','Olympic Ward','Nairobi',5,'Financial Trainer, James Muturi','VSLA Team',150,70,'women',6000.00,2800.00,'submitted','high',NULL,NULL,NULL),(16,6,'Youth Entrepreneurship Bootcamp - Day 1','ACT-SE-004','Introduction to entrepreneurship and business opportunity identification',NULL,'2025-03-10','2025-03-10','completed',100,'James Omondi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,7,'2025-03-10',NULL,'Kisumu Youth Center','Kisumu Town','Market Ward','Kisumu',6,'James Omondi, Business Trainer Sarah','Youth Enterprise Team',40,38,'youth',15000.00,14200.00,'approved','urgent',NULL,NULL,NULL),(17,6,'Business Plan Development Workshop','ACT-SE-005','Guided workshop on creating comprehensive business plans',NULL,'2025-03-17','2025-03-17','not-started',0,'Business Trainer Sarah',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,7,'2025-03-17',NULL,'Kisumu Youth Center','Kisumu Town','Market Ward','Kisumu',8,'Business Trainer Sarah, Finance Officer','Youth Enterprise Team',40,0,'youth',18000.00,0.00,'draft','urgent',NULL,NULL,NULL),(18,9,'Community GBV Awareness Rally','ACT-GY-001','Public awareness rally on GBV prevention and reporting mechanisms',NULL,'2025-02-25','2025-02-25','completed',100,'Faith Akinyi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,9,'2025-02-25',NULL,'Mukuru Kwa Njenga','Mukuru','Kwa Njenga Ward','Nairobi',4,'Faith Akinyi, Community Mobilizers, Police Rep','Gender Team',500,480,'community',12000.00,11500.00,'approved','urgent',NULL,NULL,NULL),(19,9,'GBV Survivor Counseling Sessions','ACT-GY-002','Individual and group counseling for GBV survivors',NULL,'2025-03-01','2025-03-31','in-progress',40,'Counselor Jane',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,10,'2025-03-15',NULL,'Caritas Counseling Center','Nairobi CBD','Central Ward','Nairobi',60,'Counselor Jane, Psychologist Dr. Mary','Gender Team',50,18,'women',20000.00,7500.00,'approved','urgent',NULL,NULL,NULL),(20,10,'Beacon Boys Mentor Recruitment','ACT-GY-003','Recruiting and vetting community mentors for at-risk youth',NULL,'2025-02-10','2025-02-20','completed',100,'Michael Otieno',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,11,'2025-02-15',NULL,'Mombasa Community Centers','Changamwe','Multiple Wards','Mombasa',20,'Michael Otieno, HR Coordinator','Youth Team',30,28,'youth',8000.00,7800.00,'approved','high',NULL,NULL,NULL),(21,10,'Life Skills Training - Conflict Resolution','ACT-GY-004','Workshop on conflict resolution and anger management for youth',NULL,'2025-03-08','2025-03-08','not-started',50,'Youth Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:22:56',NULL,12,'2025-03-06',NULL,'Mombasa Youth Hall','Changamwe','Changamwe Ward','Mombasa',5,'Psychologist Dr. James, Youth Coordinator','Youth Team',50,0,'youth',9000.00,0.00,'submitted','high',NULL,NULL,NULL),(22,13,'Food Aid Beneficiary Verification','ACT-RL-001','House-to-house verification of drought-affected households',NULL,'2025-01-15','2025-01-30','completed',100,'Agnes Wambui',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,13,'2025-01-22',NULL,'Turkana Villages','Multiple','Multiple','Turkana',120,'Field Assessment Team','Relief Team Alpha',1000,980,'households',15000.00,14800.00,'approved','urgent',NULL,NULL,NULL),(23,13,'February Food Distribution Exercise','ACT-RL-002','Monthly food ration distribution to registered beneficiaries',NULL,'2025-02-20','2025-02-22','completed',100,'Logistics Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,14,'2025-02-21',NULL,'Lodwar Distribution Points','Lodwar Town','Multiple Wards','Turkana',24,'Distribution Team, Logistics Team','Relief Team Alpha',1000,975,'households',85000.00,84500.00,'approved','urgent',NULL,NULL,NULL),(24,14,'Refugee Tailoring Skills Training','ACT-RL-003','Vocational training in tailoring and garment making for refugees',NULL,'2025-02-05','2025-03-15','in-progress',55,'Hassan Mohammed',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,15,'2025-02-20',NULL,'Kakuma Vocational Center','Kakuma Camp','Kakuma Ward','Turkana',120,'Hassan Mohammed, Tailoring Instructor','Refugee Support Team',30,28,'refugees',35000.00,18000.00,'approved','high',NULL,NULL,NULL),(25,17,'Introduction to M&E Systems','ACT-CB-001','Training on monitoring and evaluation fundamentals and tools',NULL,'2025-02-28','2025-03-01','completed',100,'Patrick Mwangi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,17,'2025-03-01',NULL,'Caritas Training Room','Nairobi CBD','Central','Nairobi',12,'Patrick Mwangi, External M&E Expert','Capacity Building Team',15,14,'staff',12000.00,11500.00,'approved','',NULL,NULL,NULL),(26,18,'Community Volunteer Recruitment Event','ACT-CB-002','Public recruitment event for community volunteers across target areas',NULL,'2025-02-18','2025-02-18','completed',100,'Susan Njoki',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,19,'2025-02-18',NULL,'Various Community Centers','Multiple','Multiple','Various',8,'Susan Njoki, Volunteer Coordinators','Volunteer Team',100,92,'community',8000.00,7600.00,'approved','',NULL,NULL,NULL),(27,1,'community health trainings','ACT-1764067553465','',NULL,'2025-11-24',NULL,'in-progress',0,NULL,NULL,'pending',NULL,'2025-11-25 10:45:53','2025-11-27 06:43:29',NULL,1,'2025-11-15',NULL,'Mombasa Youth Hall','Changamwe','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','James kia, Peterson mbatha, Susuan ndei',100,200,'farmers',1000.00,0.00,'submitted','high',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Links Beneficiaries to Activities';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_beneficiaries`
--

LOCK TABLES `activity_beneficiaries` WRITE;
/*!40000 ALTER TABLE `activity_beneficiaries` DISABLE KEYS */;
INSERT INTO `activity_beneficiaries` VALUES (1,1,1,'participant',1,'2025-11-24 17:59:30'),(2,1,2,'participant',1,'2025-11-24 17:59:30'),(3,1,10,'participant',1,'2025-11-24 17:59:30'),(4,2,1,'participant',1,'2025-11-24 17:59:30'),(5,2,2,'participant',0,'2025-11-24 17:59:30'),(6,6,3,'participant',1,'2025-11-24 17:59:30'),(7,6,5,'participant',1,'2025-11-24 17:59:30'),(8,6,9,'participant',1,'2025-11-24 17:59:30'),(9,7,3,'participant',1,'2025-11-24 17:59:30'),(10,7,5,'participant',1,'2025-11-24 17:59:30'),(11,8,3,'participant',1,'2025-11-24 17:59:30'),(12,8,5,'participant',1,'2025-11-24 17:59:30'),(13,8,9,'participant',0,'2025-11-24 17:59:30'),(14,9,4,'participant',1,'2025-11-24 17:59:30'),(15,9,11,'participant',1,'2025-11-24 17:59:30'),(16,11,3,'participant',1,'2025-11-24 17:59:30'),(17,11,5,'participant',1,'2025-11-24 17:59:30'),(18,11,15,'participant',1,'2025-11-24 17:59:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity Checklists (Implementation Steps) - ClickUp Checklists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_checklists`
--

LOCK TABLES `activity_checklists` WRITE;
/*!40000 ALTER TABLE `activity_checklists` DISABLE KEYS */;
INSERT INTO `activity_checklists` VALUES (1,6,'Register the beneficiaries',0,NULL,NULL,1,'2025-11-25 14:03:36',1,'pending',NULL,'2025-11-25 10:52:29','2025-11-25 11:03:35'),(2,6,'Get the training materials and support staff',1,NULL,NULL,1,'2025-11-25 14:03:28',1,'pending',NULL,'2025-11-25 10:52:44','2025-11-25 11:03:27'),(3,6,'Find the venue for the activity',2,NULL,NULL,1,'2025-11-25 14:03:12',1,'pending',NULL,'2025-11-25 10:53:17','2025-11-25 11:03:11'),(4,27,'Register new beneficiaries',0,NULL,NULL,1,'2025-11-25 19:26:33',1,'pending',NULL,'2025-11-25 11:05:08','2025-11-25 16:26:33'),(5,27,'Take ground checks',1,NULL,NULL,1,'2025-11-25 14:50:07',NULL,'pending',NULL,'2025-11-25 11:05:51','2025-11-25 11:50:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assumptions`
--

LOCK TABLES `assumptions` WRITE;
/*!40000 ALTER TABLE `assumptions` DISABLE KEYS */;
INSERT INTO `assumptions` VALUES (1,'module',1,'Stable climatic conditions with normal rainfall patterns','environmental','medium','high','medium','partially-valid','2025-11-26','','Promote climate-resilient agricultural practices and early warning systems','in-progress','2025-11-26',NULL,NULL,NULL,'2025-11-25 15:37:00','2025-11-26 13:26:39',NULL,NULL),(2,'module',5,'All formers must be trained ','external','medium','medium','medium','valid','2025-11-26','','Mobilize all of them to come out ','implemented','2025-11-26',NULL,'Peter',NULL,'2025-11-26 05:52:44','2025-11-26 13:25:09',NULL,NULL);
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
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_type` (`attachment_type`),
  KEY `idx_deleted_at` (`deleted_at`),
  KEY `idx_entity_lookup` (`entity_type`,`entity_id`,`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Attachments & Evidence - ClickUp Attachments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,'verification',1,NULL,'Pharmacy System Requirements.pdf','/uploads/Pharmacy System Requirements-1764239469012-877332348.pdf',NULL,'application/pdf',25488,'document','Pharmacy System Requirements.pdf','pending',NULL,1,'2025-11-27 10:31:09',NULL,NULL),(2,'verification',1,NULL,'Pharmacy System Requirements.pdf','/uploads/Pharmacy System Requirements-1764239503309-524230919.pdf',NULL,'application/pdf',25488,'document','Pharmacy System Requirements.pdf','pending',NULL,1,'2025-11-27 10:31:43',NULL,NULL),(3,'verification',1,NULL,'Screenshot from 2025-09-11 11-09-04.png','/uploads/Screenshot from 2025-09-11 11-09-04-1764240814408-519977795.png',NULL,'image/png',462794,'document','Screenshot from 2025-09-11 11-09-04.png','pending',NULL,1,'2025-11-27 10:53:34',NULL,NULL),(4,'verification',2,NULL,'Gicharu George Ngugi - Professional CV.pdf','/uploads/Gicharu George Ngugi - Professional CV-1764241131855-672290407.pdf',NULL,'application/pdf',652093,'document','Gicharu George Ngugi - Professional CV.pdf','pending',NULL,1,'2025-11-27 10:58:51',NULL,NULL),(5,'verification',2,NULL,'WhatsApp Image 2025-10-29 at 16.53.32.jpeg','/uploads/WhatsApp Image 2025-10-29 at 16.53.32-1764264544156-576971808.jpeg',NULL,'image/jpeg',157086,'document','WhatsApp Image 2025-10-29 at 16.53.32.jpeg','pending',NULL,1,'2025-11-27 17:29:04',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registered Beneficiaries';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaries`
--

LOCK TABLES `beneficiaries` WRITE;
/*!40000 ALTER TABLE `beneficiaries` DISABLE KEYS */;
INSERT INTO `beneficiaries` VALUES (1,'Mary Njoki Kamau','BEN-2025-001','female',34,'18-35','individual',NULL,'Githunguri','Central Ward','Kiambu','-1.0692,36.8219',1,'[\"single_mother\", \"low_income\"]','+254712345001',NULL,'{\"education\": \"primary\", \"occupation\": \"farmer\", \"household_size\": 5}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(2,'John Mwangi Kariuki','BEN-2025-002','male',45,'36-60','individual',NULL,'Mwala','Mwala Ward','Machakos','-1.4318,37.2411',0,NULL,'+254712345002',NULL,'{\"education\": \"secondary\", \"occupation\": \"farmer\", \"household_size\": 6}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(3,'Grace Wanjiru Ndungu','BEN-2025-003','female',28,'18-35','individual',NULL,'Kibera','Laini Saba','Nairobi','-1.3133,36.7894',1,'[\"unemployed\", \"single_mother\"]','+254712345003',NULL,'{\"education\": \"secondary\", \"occupation\": \"casual_worker\", \"household_size\": 3}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(4,'Peter Ochieng Otieno','BEN-2025-004','male',23,'18-35','individual',NULL,'Kisumu Town','Market Ward','Kisumu','-0.0917,34.7680',0,NULL,'+254712345004','peter.o@gmail.com','{\"education\": \"tertiary\", \"occupation\": \"unemployed\", \"household_size\": 1}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(5,'Faith Auma Okello','BEN-2025-005','female',31,'18-35','individual',NULL,'Mukuru','Kwa Njenga','Nairobi','-1.3028,36.8739',1,'[\"gvb_survivor\", \"low_income\"]','+254712345005',NULL,'{\"education\": \"primary\", \"occupation\": \"small_business\", \"household_size\": 4}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(6,'David Kiplagat Korir','BEN-2025-006','male',19,'18-35','individual',NULL,'Changamwe','Changamwe Ward','Mombasa','-4.0950,39.6544',0,NULL,'+254712345006',NULL,'{\"education\": \"secondary\", \"occupation\": \"student\", \"household_size\": 7}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(7,'Sarah Nyambura Githinji','BEN-2025-007','female',52,'36-60','individual',NULL,'Lodwar Town','Lodwar Ward','Turkana','3.1190,35.5977',1,'[\"elderly\", \"chronic_illness\", \"drought_affected\"]','+254712345007',NULL,'{\"education\": \"none\", \"occupation\": \"subsistence_farmer\", \"household_size\": 8}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(8,'Hassan Ali Mohammed','BEN-2025-008','male',29,'','individual',NULL,'Kakuma Camp','Kakuma Ward','Turkana','3.7368,34.8608',1,'[\"refugee\", \"displaced\"]','+254712345008',NULL,'{\"education\": \"secondary\", \"occupation\": \"unemployed\", \"household_size\": 5, \"country_of_origin\": \"Somalia\"}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(9,'Lucy Wangari Maina','BEN-2025-009','female',38,'36-60','individual',NULL,'Nakuru Town','Central Ward','Nakuru','-0.3031,36.0800',0,NULL,'+254712345009','lucy.w@gmail.com','{\"education\": \"secondary\", \"occupation\": \"artisan\", \"household_size\": 4}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(10,'James Mutua Musyoki','BEN-2025-010','male',41,'36-60','individual',NULL,'Makueni Town','Central Ward','Makueni','-1.8044,37.6214',0,NULL,'+254712345010',NULL,'{\"education\": \"primary\", \"occupation\": \"farmer\", \"household_size\": 5}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(11,'Agnes Chebet Rotich','BEN-2025-011','female',26,'18-35','individual',NULL,'Eldoret Town','Central Ward','Uasin Gishu','0.5143,35.2698',1,'[\"youth\", \"low_income\"]','+254712345011','agnes.c@gmail.com','{\"education\": \"tertiary\", \"occupation\": \"unemployed\", \"household_size\": 2}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(12,'Michael Kamau Njoroge','BEN-2025-012','male',17,'6-17','individual',NULL,'Mombasa','Changamwe Ward','Mombasa','-4.0950,39.6544',1,'[\"ovc\", \"at_risk_youth\"]','+254712345012',NULL,'{\"guardian\": \"uncle\", \"education\": \"secondary\", \"occupation\": \"student\", \"household_size\": 1}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(13,'Rose Wambui Kimani','BEN-2025-013','female',65,'60+','individual',NULL,'Nyandarua','Central Ward','Nyandarua','-0.0536,36.5214',1,'[\"elderly\", \"disabled\"]','+254712345013',NULL,'{\"education\": \"none\", \"occupation\": \"retired\", \"household_size\": 2, \"disability_type\": \"mobility\"}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(14,'Daniel Kiprop Bett','BEN-2025-014','male',35,'18-35','individual',NULL,'Nyandarua','Central Ward','Nyandarua','-0.0536,36.5214',0,NULL,'+254712345014',NULL,'{\"education\": \"secondary\", \"occupation\": \"dairy_farmer\", \"household_size\": 6}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(15,'Catherine Nyokabi Mugo','BEN-2025-015','female',42,'36-60','individual',NULL,'Nairobi','Central Ward','Nairobi','-1.2864,36.8172',1,'[\"gvb_survivor\"]','+254712345015','catherine.n@gmail.com','{\"education\": \"secondary\", \"occupation\": \"employed\", \"household_size\": 3}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(16,'Patrick Mwangi Kuria','BEN-2025-016','male',27,'18-35','individual',NULL,'Trans-Nzoia','Central Ward','Trans-Nzoia','1.0667,34.9500',0,NULL,'+254712345016','patrick.m@gmail.com','{\"education\": \"tertiary\", \"occupation\": \"community_leader\", \"household_size\": 4}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(17,'Susan Njeri Waweru','BEN-2025-017','female',30,'18-35','individual',NULL,'Various','Multiple','Various',NULL,0,NULL,'+254712345017','susan.nj@gmail.com','{\"education\": \"tertiary\", \"occupation\": \"volunteer\", \"household_size\": 2}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(18,'Thomas Kimani Njenga','BEN-2025-018','male',48,'36-60','individual',NULL,'Trans-Nzoia','Central Ward','Trans-Nzoia','1.0667,34.9500',0,NULL,'+254712345018','thomas.k@gmail.com','{\"education\": \"secondary\", \"occupation\": \"farmer\", \"household_size\": 7}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(19,'Betty Mwikali Mutua','BEN-2025-019','female',33,'18-35','individual',NULL,'Various','Multiple','Various',NULL,0,NULL,'+254712345019','betty.m@gmail.com','{\"education\": \"tertiary\", \"occupation\": \"trainer\", \"household_size\": 3}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30'),(20,'Fatuma Hassan Ali','BEN-2025-020','female',24,'18-35','individual',NULL,'Garissa Town','Central Ward','Garissa','-0.4534,39.6461',1,'[\"refugee\", \"single_mother\"]','+254712345020',NULL,'{\"education\": \"primary\", \"occupation\": \"unemployed\", \"household_size\": 3, \"country_of_origin\": \"Somalia\"}',1,'2025-11-24 17:59:30','2025-11-24 17:59:30');
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
  CONSTRAINT `fk_me_indicators_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_me_indicators_module` FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_me_indicators_sub_program` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `me_indicators_ibfk_3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_indicators`
--

LOCK TABLES `me_indicators` WRITE;
/*!40000 ALTER TABLE `me_indicators` DISABLE KEYS */;
INSERT INTO `me_indicators` VALUES (1,NULL,NULL,NULL,'Number of beneficiaries reached','SEED-MODULE-001','Total number of beneficiaries reached through Capacity Building','impact',NULL,'people',0.00,5000.00,1250.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-26 19:37:39',5,NULL,NULL,'2024-12-31','2025-12-30',NULL,NULL,'off-track',25.00,'Project Manager','Q1 progress on track',NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,'Training sessions completed','SEED-MODULE-002','Number of training sessions delivered under Capacity Building','output',NULL,'sessionszz',0.00,50.00,100.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-26 20:21:37',5,NULL,NULL,'2024-12-30','2025-12-29',NULL,NULL,'on-track',100.00,'Training Coordinator','Ahead of schedule in regional offices',NULL,NULL,NULL,NULL),(3,NULL,NULL,NULL,'Satisfaction rate','SEED-MODULE-003','Beneficiary satisfaction rate for Capacity Building','outcome','Hts','percentage',65.00,85.00,84.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-27 04:46:59',5,NULL,NULL,'2025-11-24','2025-11-24',NULL,NULL,'on-track',98.82,'M&E Officer','Need to improve service delivery in some areas',NULL,NULL,NULL,NULL),(4,NULL,NULL,NULL,'test','code','','output','test','test',200.00,499.97,399.00,'monthly','','',NULL,NULL,1,'2025-11-27 05:45:36','2025-11-27 07:44:07',5,NULL,NULL,'0000-00-00','2025-11-25',NULL,NULL,'on-track',79.80,'Peterson James',NULL,NULL,NULL,NULL,NULL),(5,NULL,NULL,NULL,'customer care service','ccs12','how the staff interact and engage with our clients','output','health','people',2.50,5.00,1.50,'monthly','clients','review forms',NULL,NULL,1,'2025-11-27 06:08:49','2025-11-27 06:08:49',NULL,19,NULL,'2025-10-27','2025-11-27',NULL,NULL,'off-track',30.00,'customer relations manager',NULL,NULL,NULL,NULL,NULL),(6,NULL,NULL,NULL,'success of the training','sot 34','if the training is having any positive impact to the community','outcome','education','%',30.00,100.00,40.00,'monthly','trainees','list of the attendees',NULL,NULL,1,'2025-11-27 06:20:29','2025-11-27 06:20:29',NULL,21,NULL,'2025-09-27','2025-12-27',NULL,NULL,'off-track',40.00,'M&E',NULL,NULL,NULL,NULL,NULL),(7,NULL,NULL,6,'Community healt','ch-ooo2','test','output','health','people',100.00,200.00,150.00,'daily',NULL,NULL,NULL,NULL,1,'2025-11-27 07:47:26','2025-11-27 07:47:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',75.00,'Training team',NULL,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `means_of_verification`
--

LOCK TABLES `means_of_verification` WRITE;
/*!40000 ALTER TABLE `means_of_verification` DISABLE KEYS */;
INSERT INTO `means_of_verification` VALUES (1,'module',1,'Household surveys and field reports','Annual household food security surveys conducted in target communities','report','','','0000-00-00','verified',1,'2025-11-27','Perfect','annual','','','2025-11-25 15:37:00','2025-11-27 10:33:00',NULL,NULL,NULL,NULL),(2,'indicator',5,'Observation','taken some observation and recorded','','Observation Report','','2025-11-25','pending',NULL,NULL,NULL,'daily','Training Team','Finished well','2025-11-27 10:58:06','2025-11-27 11:01:50',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `means_of_verification` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Available permissions in the system';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'activities.create','activities','create','Create new activities','module','2025-11-27 18:31:40'),(2,'activities.read.all','activities','read','View all activities','all','2025-11-27 18:31:40'),(3,'activities.read.own','activities','read','View own activities','own','2025-11-27 18:31:40'),(4,'activities.read.module','activities','read','View module activities','module','2025-11-27 18:31:40'),(5,'activities.update.all','activities','update','Edit all activities','all','2025-11-27 18:31:40'),(6,'activities.update.own','activities','update','Edit own activities','own','2025-11-27 18:31:40'),(7,'activities.update.module','activities','update','Edit module activities','module','2025-11-27 18:31:40'),(8,'activities.delete.all','activities','delete','Delete all activities','all','2025-11-27 18:31:40'),(9,'activities.delete.own','activities','delete','Delete own activities','own','2025-11-27 18:31:40'),(10,'activities.approve','activities','approve','Approve activities','module','2025-11-27 18:31:40'),(11,'activities.reject','activities','reject','Reject activities','module','2025-11-27 18:31:40'),(12,'activities.submit','activities','submit','Submit for approval','own','2025-11-27 18:31:40'),(13,'verifications.create','verifications','create','Create verifications','module','2025-11-27 18:31:40'),(14,'verifications.read.all','verifications','read','View all verifications','all','2025-11-27 18:31:40'),(15,'verifications.read.module','verifications','read','View module verifications','module','2025-11-27 18:31:40'),(16,'verifications.update.all','verifications','update','Edit all verifications','all','2025-11-27 18:31:40'),(17,'verifications.update.module','verifications','update','Edit module verifications','module','2025-11-27 18:31:40'),(18,'verifications.delete.all','verifications','delete','Delete all verifications','all','2025-11-27 18:31:40'),(19,'verifications.verify','verifications','verify','Verify evidence','module','2025-11-27 18:31:40'),(20,'verifications.reject','verifications','reject','Reject evidence','module','2025-11-27 18:31:40'),(21,'indicators.create','indicators','create','Create indicators','module','2025-11-27 18:31:40'),(22,'indicators.read.all','indicators','read','View all indicators','all','2025-11-27 18:31:40'),(23,'indicators.read.module','indicators','read','View module indicators','module','2025-11-27 18:31:40'),(24,'indicators.update.all','indicators','update','Edit all indicators','all','2025-11-27 18:31:40'),(25,'indicators.update.module','indicators','update','Edit module indicators','module','2025-11-27 18:31:40'),(26,'indicators.delete.all','indicators','delete','Delete all indicators','all','2025-11-27 18:31:40'),(27,'settings.view','settings','read','View settings','all','2025-11-27 18:31:40'),(28,'settings.manage','settings','manage','Manage system settings','all','2025-11-27 18:31:40'),(29,'users.create','users','create','Create users','all','2025-11-27 18:31:40'),(30,'users.read.all','users','read','View all users','all','2025-11-27 18:31:40'),(31,'users.read.team','users','read','View team members','team','2025-11-27 18:31:40'),(32,'users.update.all','users','update','Edit all users','all','2025-11-27 18:31:40'),(33,'users.delete','users','delete','Delete users','all','2025-11-27 18:31:40'),(34,'users.manage_roles','users','manage','Assign roles to users','all','2025-11-27 18:31:40'),(35,'reports.view.all','reports','read','View all reports','all','2025-11-27 18:31:40'),(36,'reports.view.module','reports','read','View module reports','module','2025-11-27 18:31:40'),(37,'reports.export','reports','export','Export reports','module','2025-11-27 18:31:40'),(38,'budget.view.all','budget','read','View all budgets','all','2025-11-27 18:31:40'),(39,'budget.view.module','budget','read','View module budgets','module','2025-11-27 18:31:40'),(40,'budget.update.all','budget','update','Edit all budgets','all','2025-11-27 18:31:40'),(41,'budget.update.module','budget','update','Edit module budgets','module','2025-11-27 18:31:40'),(42,'modules.read','modules','read','View modules','all','2025-11-27 18:31:40'),(43,'modules.manage','modules','manage','Manage modules','all','2025-11-27 18:31:40');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
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
INSERT INTO `program_modules` VALUES (1,1,'Food, Water & Environment','FOOD_ENV','🌾','Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(2,1,'Socio-Economic Empowerment','SOCIO_ECON','💼','Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(3,1,'Gender, Youth & Peace','GENDER_YOUTH','👥','Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(4,1,'Relief & Charitable Services','RELIEF','🆘','Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(5,1,'Capacity Building','CAPACITY','📚','Staff Training & Development, Volunteer Mobilization & Management, Community Leadership Training, Organizational Development, and Knowledge Management',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL);
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
  `logframe_output` text COLLATE utf8mb4_unicode_ci COMMENT 'Expected output statement',
  `output_indicators` text COLLATE utf8mb4_unicode_ci COMMENT 'Key output indicators (optional text summary)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `clickup_list_id` (`clickup_list_id`),
  KEY `idx_sub_program` (`sub_program_id`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_clickup` (`clickup_list_id`),
  CONSTRAINT `project_components_ibfk_1` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_components_chk_1` CHECK ((`progress_percentage` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 3: Project Components (Work Packages) - ClickUp Lists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_components`
--

LOCK TABLES `project_components` WRITE;
/*!40000 ALTER TABLE `project_components` DISABLE KEYS */;
INSERT INTO `project_components` VALUES (1,1,'Health outreach ','COMP-001','For health outreach ',NULL,500.00,0,'not-started',0,1,'James keya','pending',NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01',NULL,NULL,NULL),(2,1,'professional volunteers training','COMP-002','professional volunteers ',NULL,500.00,0,'',0,1,'Susan susan','pending',NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56',NULL,NULL,NULL),(3,2,'Component 1','COMP-003','',NULL,2000.00,0,'not-started',0,1,'Susan kpt','pending',NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48',NULL,NULL,NULL),(4,1,'Farmer Training Workshops','COMP-FE-001','Conducting hands-on training workshops for farmers on climate-smart practices',NULL,50000.00,1,'in-progress',40,1,'Mary Wanjiku','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(5,1,'Demonstration Plots Setup','COMP-FE-002','Establishing demonstration plots for practical learning',NULL,35000.00,2,'in-progress',30,1,'John Maina','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(6,2,'Water Point Assessment','COMP-FE-003','Technical assessment of existing water points needing rehabilitation',NULL,25000.00,1,'completed',100,1,'Engineer Peter','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(7,2,'Rehabilitation Works','COMP-FE-004','Physical rehabilitation and repair of water points',NULL,180000.00,2,'in-progress',50,1,'John Kamau','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(8,5,'VSLA Group Formation','COMP-SE-001','Identifying and forming new VSLA groups in target communities',NULL,30000.00,1,'in-progress',60,1,'Sarah Njeri','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(9,5,'Financial Literacy Training','COMP-SE-002','Training VSLA members on financial management and record-keeping',NULL,40000.00,2,'in-progress',45,1,'James Muturi','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(10,6,'Business Skills Workshops','COMP-SE-003','Training youth on business planning, marketing, and management',NULL,80000.00,1,'in-progress',50,1,'James Omondi','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(11,6,'Startup Capital Grants','COMP-SE-004','Providing seed capital grants to trained youth entrepreneurs',NULL,100000.00,2,'not-started',0,1,'Finance Team','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(12,9,'Community Awareness Campaigns','COMP-GY-001','Public awareness campaigns on GBV prevention and reporting',NULL,45000.00,1,'in-progress',55,1,'Faith Akinyi','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(13,9,'Survivor Support Services','COMP-GY-002','Providing counseling and legal support to GBV survivors',NULL,55000.00,2,'in-progress',35,1,'Social Worker Team','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(14,10,'Mentorship Program Setup','COMP-GY-003','Recruiting and training mentors for at-risk youth',NULL,40000.00,1,'in-progress',50,1,'Michael Otieno','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(15,10,'Life Skills Workshops','COMP-GY-004','Conducting life skills and vocational training sessions',NULL,45000.00,2,'in-progress',40,1,'Youth Coordinator','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(16,13,'Beneficiary Registration','COMP-RL-001','Registering and verifying eligible households for food assistance',NULL,35000.00,1,'in-progress',70,1,'Agnes Wambui','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(17,13,'Food Distribution Events','COMP-RL-002','Organizing and conducting monthly food distribution exercises',NULL,220000.00,2,'in-progress',50,1,'Logistics Team','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(18,14,'Livelihood Support Programs','COMP-RL-003','Skills training and income generation activities for refugees',NULL,120000.00,1,'in-progress',45,1,'Hassan Mohammed','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(19,14,'Education Support Services','COMP-RL-004','Providing educational materials and support to refugee children',NULL,100000.00,2,'in-progress',50,1,'Education Coordinator','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(20,17,'M&E Training Module','COMP-CB-001','Training staff on monitoring, evaluation, and reporting systems',NULL,35000.00,1,'in-progress',60,1,'Patrick Mwangi','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(21,17,'Project Management Certification','COMP-CB-002','Professional project management certification courses for senior staff',NULL,40000.00,2,'not-started',0,1,'HR Department','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(22,18,'Volunteer Recruitment Drive','COMP-CB-003','Community outreach and volunteer recruitment campaigns',NULL,25000.00,1,'in-progress',55,1,'Susan Njoki','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(23,18,'Volunteer Training & Orientation','COMP-CB-004','Comprehensive training program for new volunteers',NULL,35000.00,2,'in-progress',45,1,'Training Team','pending',NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results_chain`
--

LOCK TABLES `results_chain` WRITE;
/*!40000 ALTER TABLE `results_chain` DISABLE KEYS */;
INSERT INTO `results_chain` VALUES (1,'activity',6,'component',1,'Health wise',100.00,'Need suport to achieve this','2025-11-27 08:09:17','2025-11-27 08:09:17',NULL),(2,'component',1,'sub_program',1,'test level',50.00,'as test','2025-11-27 08:14:13','2025-11-27 08:14:13',NULL),(3,'activity',13,'component',5,'here',10.00,NULL,'2025-11-27 08:26:51','2025-11-27 08:26:51',NULL),(4,'activity',19,'component',10,'Helps',100.00,NULL,'2025-11-27 08:37:05','2025-11-27 08:37:05',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User roles for RBAC system';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'system_admin','System Administrator','Full system access and configuration','system',1,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(2,'me_director','M&E Director','Director-level access across all modules','system',2,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(3,'me_manager','M&E Manager','Manager-level access across all modules','system',3,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(4,'finance_officer','Finance Officer','Access to budget and financial data','system',4,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(5,'report_viewer','Report Viewer','Read-only access to reports','system',5,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(6,'module_manager','Module Manager','Full control within assigned modules','module',3,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(7,'module_coordinator','Module Coordinator','Coordinate activities within modules','module',4,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(8,'field_officer','Field Officer','Field-level data collection and entry','module',6,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(9,'verification_officer','Verification Officer','Manage verification and evidence','module',5,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(10,'data_entry_clerk','Data Entry Clerk','Basic data entry only','module',8,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(11,'module_viewer','Module Viewer','Read-only access to module data','module',9,'2025-11-27 18:31:40','2025-11-27 18:31:40');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
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
  `logframe_outcome` text COLLATE utf8mb4_unicode_ci COMMENT 'Expected outcome statement',
  `outcome_indicators` text COLLATE utf8mb4_unicode_ci COMMENT 'Key outcome indicators (optional text summary)',
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Level 2: Sub-Programs/Projects (Specific Initiatives) - ClickUp Folders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_programs`
--

LOCK TABLES `sub_programs` WRITE;
/*!40000 ALTER TABLE `sub_programs` DISABLE KEYS */;
INSERT INTO `sub_programs` VALUES (1,5,'Vital practical ','CHI-001','Vital practice and energy inspiration ',NULL,2000.00,0.00,'2025-11-25','2025-11-29',0,'Peter Peter',NULL,200,0,'\"Nairobi PLC\"','active','high',1,'pending',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52',NULL,NULL,NULL),(2,5,'UDDP Follow Up training','CHI-002','UDDP Follow Up training',NULL,300.00,0.00,'2025-11-29','2025-12-02',0,NULL,NULL,20,0,'\"Kibera\"','planning','urgent',1,'pending',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55',NULL,NULL,NULL),(3,1,'Climate-Smart Agriculture Training','SUB-FE-001','Training farmers on climate-resilient farming techniques and water conservation',NULL,150000.00,45000.00,'2025-01-15','2025-12-31',30,'Mary Wanjiku','mary.w@caritas.org',500,150,'\"Kiambu County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(4,1,'Community Water Points Rehabilitation','SUB-FE-002','Rehabilitating and maintaining community water access points in drought-affected areas',NULL,250000.00,120000.00,'2025-02-01','2025-11-30',48,'John Kamau','john.k@caritas.org',2000,800,'\"Machakos County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(5,1,'Tree Planting Initiative','SUB-FE-003','Agroforestry and environmental conservation through community tree planting',NULL,80000.00,25000.00,'2025-03-01','2025-12-31',31,'Grace Muthoni','grace.m@caritas.org',1500,450,'\"Murang\'a County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(6,1,'Drip Irrigation Systems','SUB-FE-004','Installing water-efficient drip irrigation systems for small-scale farmers',NULL,180000.00,60000.00,'2025-01-10','2025-10-31',33,'Peter Ochieng','peter.o@caritas.org',300,100,'\"Makueni County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(7,2,'Village Savings and Loans Groups','SUB-SE-001','Establishing and supporting VSLAs for financial inclusion and savings mobilization',NULL,120000.00,55000.00,'2025-01-20','2025-12-31',46,'Sarah Njeri','sarah.n@caritas.org',800,380,'\"Nairobi County - Kibera\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(8,2,'Youth Micro-Enterprise Development','SUB-SE-002','Business skills training and startup capital for youth entrepreneurs',NULL,200000.00,80000.00,'2025-02-15','2025-12-31',40,'James Omondi','james.o@caritas.org',200,85,'\"Kisumu County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(9,2,'Women Artisan Cooperative','SUB-SE-003','Supporting women artisans with skills training and market linkages',NULL,90000.00,35000.00,'2025-03-01','2025-12-31',39,'Lucy Wangari','lucy.w@caritas.org',150,60,'\"Nakuru County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(10,2,'Dairy Farming Value Chain','SUB-SE-004','Strengthening dairy value chain from production to market access',NULL,160000.00,70000.00,'2025-01-25','2025-11-30',44,'Daniel Kiprop','daniel.k@caritas.org',250,110,'\"Nyandarua County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(11,3,'Gender-Based Violence Prevention','SUB-GY-001','Community awareness and support services for GBV survivors',NULL,110000.00,45000.00,'2025-01-10','2025-12-31',41,'Faith Akinyi','faith.a@caritas.org',1000,420,'\"Nairobi County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(12,3,'Beacon Boys Youth Mentorship','SUB-GY-002','Mentorship program for at-risk youth promoting positive masculinity',NULL,95000.00,40000.00,'2025-02-01','2025-12-31',42,'Michael Otieno','michael.o@caritas.org',300,130,'\"Mombasa County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(13,3,'Women Economic Empowerment','SUB-GY-003','Business training and financial support for women-led businesses',NULL,140000.00,55000.00,'2025-01-15','2025-12-31',39,'Rose Chebet','rose.c@caritas.org',200,80,'\"Eldoret Town\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(14,3,'Peacebuilding Dialogues','SUB-GY-004','Inter-community dialogue and conflict resolution initiatives',NULL,75000.00,30000.00,'2025-03-01','2025-11-30',40,'David Mutua','david.m@caritas.org',500,200,'\"Isiolo County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(15,4,'Emergency Food Distribution','SUB-RL-001','Food relief for drought-affected communities and vulnerable households',NULL,300000.00,150000.00,'2025-01-05','2025-12-31',50,'Agnes Wambui','agnes.w@caritas.org',5000,2500,'\"Turkana County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(16,4,'Refugee Support Services','SUB-RL-002','Comprehensive support services for refugees in Kakuma and Dadaab camps',NULL,250000.00,120000.00,'2025-01-10','2025-12-31',48,'Hassan Mohammed','hassan.m@caritas.org',3000,1450,'\"Turkana & Garissa Counties\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(17,4,'Child Care Center Operations','SUB-RL-003','Operating day care centers for orphaned and vulnerable children',NULL,180000.00,85000.00,'2025-01-01','2025-12-31',47,'Catherine Nyambura','catherine.n@caritas.org',150,72,'\"Nairobi County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(18,4,'Health Outreach Clinics','SUB-RL-004','Mobile health clinics providing basic healthcare in underserved areas',NULL,220000.00,100000.00,'2025-02-01','2025-12-31',45,'Dr. James Kariuki','james.kar@caritas.org',2000,920,'\"Garissa County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(19,5,'Staff Professional Development','SUB-CB-001','Training programs for Caritas staff on M&E, project management, and leadership',NULL,85000.00,35000.00,'2025-01-20','2025-12-31',41,'Patrick Mwangi','patrick.m@caritas.org',50,22,'\"Nairobi - Caritas HQ\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(20,5,'Volunteer Mobilization Program','SUB-CB-002','Recruiting, training, and managing community volunteers',NULL,70000.00,28000.00,'2025-02-01','2025-12-31',40,'Susan Njoki','susan.nj@caritas.org',200,85,'\"Various Counties\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(21,5,'Community Leadership Training','SUB-CB-003','Building leadership capacity among community leaders and committee members',NULL,95000.00,40000.00,'2025-01-15','2025-12-31',42,'Thomas Kimani','thomas.k@caritas.org',150,65,'\"Trans-Nzoia County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL),(22,5,'Digital Literacy for Field Staff','SUB-CB-004','Training field staff on digital tools, data collection, and reporting systems',NULL,60000.00,22000.00,'2025-03-01','2025-11-30',37,'Betty Mwikali','betty.m@caritas.org',80,30,'\"Various Field Offices\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-11-24 17:59:29',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_queue`
--

LOCK TABLES `sync_queue` WRITE;
/*!40000 ALTER TABLE `sync_queue` DISABLE KEYS */;
INSERT INTO `sync_queue` VALUES (1,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:53:52',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52'),(2,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:57:01',NULL,NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01'),(3,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:59:56',NULL,NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56'),(4,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 19:22:55',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55'),(5,'create','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 13:05:56',NULL,NULL,'2025-11-24 10:05:56','2025-11-24 10:05:56'),(6,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:32:42',NULL,NULL,'2025-11-24 11:32:42','2025-11-24 11:32:42'),(7,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:38:45',NULL,NULL,'2025-11-24 11:38:45','2025-11-24 11:38:45'),(8,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:03:43',NULL,NULL,'2025-11-24 14:03:43','2025-11-24 14:03:43'),(9,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:04:26',NULL,NULL,'2025-11-24 14:04:26','2025-11-24 14:04:26'),(10,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:06',NULL,NULL,'2025-11-24 14:15:06','2025-11-24 14:15:06'),(11,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:11',NULL,NULL,'2025-11-24 14:15:11','2025-11-24 14:15:11'),(12,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:14',NULL,NULL,'2025-11-24 14:15:14','2025-11-24 14:15:14'),(13,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:18',NULL,NULL,'2025-11-24 14:15:18','2025-11-24 14:15:18'),(14,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:22',NULL,NULL,'2025-11-24 14:15:22','2025-11-24 14:15:22'),(15,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:16:33',NULL,NULL,'2025-11-24 14:16:33','2025-11-24 14:16:33'),(16,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:01',NULL,NULL,'2025-11-24 14:37:01','2025-11-24 14:37:01'),(17,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:22',NULL,NULL,'2025-11-24 14:37:22','2025-11-24 14:37:22'),(18,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:08',NULL,NULL,'2025-11-24 14:44:08','2025-11-24 14:44:08'),(19,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:12',NULL,NULL,'2025-11-24 14:44:12','2025-11-24 14:44:12'),(20,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:14',NULL,NULL,'2025-11-24 14:44:14','2025-11-24 14:44:14'),(21,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 19:50:04',NULL,NULL,'2025-11-24 16:50:04','2025-11-24 16:50:04'),(22,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:03:54',NULL,NULL,'2025-11-24 17:03:54','2025-11-24 17:03:54'),(23,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2025-11-24 20:08:48',NULL,NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48'),(24,'create','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:20',NULL,NULL,'2025-11-24 17:11:20','2025-11-24 17:11:20'),(25,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:25',NULL,NULL,'2025-11-24 17:11:25','2025-11-24 17:11:25'),(26,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:30',NULL,NULL,'2025-11-24 17:11:30','2025-11-24 17:11:30'),(27,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:55',NULL,NULL,'2025-11-24 17:11:55','2025-11-24 17:11:55'),(28,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:01',NULL,NULL,'2025-11-24 17:12:01','2025-11-24 17:12:01'),(29,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:23',NULL,NULL,'2025-11-24 17:12:23','2025-11-24 17:12:23'),(30,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:13:19',NULL,NULL,'2025-11-24 17:13:19','2025-11-24 17:13:19'),(31,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:28:38',NULL,NULL,'2025-11-24 17:28:38','2025-11-24 17:28:38'),(32,'update','activity',14,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:15',NULL,NULL,'2025-11-24 18:01:15','2025-11-24 18:01:15'),(33,'update','activity',13,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:48',NULL,NULL,'2025-11-24 18:01:48','2025-11-24 18:01:48'),(34,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:05:41',NULL,NULL,'2025-11-24 18:05:41','2025-11-24 18:05:41'),(35,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:12:20',NULL,NULL,'2025-11-24 18:12:20','2025-11-24 18:12:20'),(36,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:13:59',NULL,NULL,'2025-11-24 18:13:59','2025-11-24 18:13:59'),(37,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:39',NULL,NULL,'2025-11-24 18:22:39','2025-11-24 18:22:39'),(38,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:56',NULL,NULL,'2025-11-24 18:22:56','2025-11-24 18:22:56'),(39,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:24:55',NULL,NULL,'2025-11-24 18:24:55','2025-11-24 18:24:55'),(40,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:32:25',NULL,NULL,'2025-11-24 18:32:25','2025-11-24 18:32:25'),(41,'update','activity',8,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:37',NULL,NULL,'2025-11-25 05:24:37','2025-11-25 05:24:37'),(42,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:57',NULL,NULL,'2025-11-25 05:24:57','2025-11-25 05:24:57'),(43,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:26:21',NULL,NULL,'2025-11-25 05:26:21','2025-11-25 05:26:21'),(44,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:11',NULL,NULL,'2025-11-25 06:28:11','2025-11-25 06:28:11'),(45,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:18',NULL,NULL,'2025-11-25 06:28:18','2025-11-25 06:28:18'),(46,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:26',NULL,NULL,'2025-11-25 06:28:26','2025-11-25 06:28:26'),(47,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:30:30',NULL,NULL,'2025-11-25 06:30:30','2025-11-25 06:30:30'),(48,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:31:19',NULL,NULL,'2025-11-25 06:31:19','2025-11-25 06:31:19'),(49,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:39:52',NULL,NULL,'2025-11-25 06:39:52','2025-11-25 06:39:52'),(50,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:11:31',NULL,NULL,'2025-11-25 10:11:31','2025-11-25 10:11:31'),(51,'create','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:45:53',NULL,NULL,'2025-11-25 10:45:53','2025-11-25 10:45:53'),(52,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:46:13',NULL,NULL,'2025-11-25 10:46:13','2025-11-25 10:46:13'),(53,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:53:31',NULL,NULL,'2025-11-25 10:53:31','2025-11-25 10:53:31'),(54,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:54:07',NULL,NULL,'2025-11-25 10:54:07','2025-11-25 10:54:07'),(55,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:59:25',NULL,NULL,'2025-11-25 10:59:25','2025-11-25 10:59:25'),(56,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:04:00',NULL,NULL,'2025-11-25 11:04:00','2025-11-25 11:04:00'),(57,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:05:55',NULL,NULL,'2025-11-25 11:05:55','2025-11-25 11:05:55'),(58,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:13:26',NULL,NULL,'2025-11-25 16:13:26','2025-11-25 16:13:26'),(59,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:26:39',NULL,NULL,'2025-11-25 16:26:39','2025-11-25 16:26:39'),(60,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:39',NULL,NULL,'2025-11-25 17:54:39','2025-11-25 17:54:39'),(61,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:43',NULL,NULL,'2025-11-25 17:54:43','2025-11-25 17:54:43'),(62,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:55:35',NULL,NULL,'2025-11-25 17:55:35','2025-11-25 17:55:35'),(63,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:20',NULL,NULL,'2025-11-27 06:43:20','2025-11-27 06:43:20'),(64,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:29',NULL,NULL,'2025-11-27 06:43:29','2025-11-27 06:43:29'),(65,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 10:50:16',NULL,NULL,'2025-11-27 07:50:16','2025-11-27 07:50:16');
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
  `module_id` int NOT NULL COMMENT 'References programs table (modules)',
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
  CONSTRAINT `user_module_assignments_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_module_assignments_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User access to specific modules (RLS)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_assignments`
--

LOCK TABLES `user_module_assignments` WRITE;
/*!40000 ALTER TABLE `user_module_assignments` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Maps users to their roles';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Active user sessions and JWT tokens';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `clickup_user_id` (`clickup_user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_clickup` (`clickup_user_id`),
  KEY `idx_users_is_system_admin` (`is_system_admin`),
  KEY `idx_users_is_active` (`is_active`)
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

-- Dump completed on 2025-12-02  7:19:33
