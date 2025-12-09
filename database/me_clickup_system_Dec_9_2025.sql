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
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit log for access control and RLS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_audit_log`
--

LOCK TABLES `access_audit_log` WRITE;
/*!40000 ALTER TABLE `access_audit_log` DISABLE KEYS */;
INSERT INTO `access_audit_log` VALUES (1,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 04:56:32'),(2,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 06:56:18'),(3,2,'LOGIN','users',2,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:08:45'),(4,3,'LOGIN','users',3,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:10:49'),(5,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:28:21'),(6,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:34:22'),(7,4,'LOGIN','users',4,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:51:17'),(8,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:54:51'),(9,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:20:21'),(10,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:20:33'),(11,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:31:49'),(12,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:32:12'),(13,1,'LOGIN','users',1,NULL,0,'Invalid password','192.168.100.4',NULL,NULL,'2025-12-03 17:48:58'),(14,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 17:49:10'),(15,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 17:49:52'),(16,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:09:23'),(17,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:10:26'),(18,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:11:05'),(19,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:44:40'),(20,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:45:02'),(21,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:02:01'),(22,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:02:27'),(23,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 19:07:38'),(24,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 19:12:07'),(25,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:12:30'),(26,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:12:49'),(27,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:13:46'),(28,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:14:03'),(29,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:14:34'),(30,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:01:09'),(31,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:01:25'),(32,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:06:47'),(33,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:08:45'),(34,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:20:23'),(35,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:22:15'),(36,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:25:24'),(37,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:26:04'),(38,1,'LOGIN','users',1,NULL,0,'Invalid password','192.168.2.245',NULL,NULL,'2025-12-04 05:32:48'),(39,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:32:58'),(40,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:39:00'),(41,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:40:51'),(42,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 06:02:18'),(43,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.202',NULL,NULL,'2025-12-04 06:31:12'),(44,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:48:56'),(45,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:52:23'),(46,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:52:33'),(47,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:53:14'),(48,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.202',NULL,NULL,'2025-12-04 08:57:33'),(49,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:58:54'),(50,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:02:18'),(51,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:03:24'),(52,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:11:11'),(53,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:12:59'),(54,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:13:15'),(55,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:14:11'),(56,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:21:46'),(57,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:41:40'),(58,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:43:01'),(59,3,'LOGIN','users',3,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:43:40'),(60,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:19:08'),(61,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:20:27'),(62,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:21:33'),(63,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:22:10'),(64,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:34:22'),(65,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:34:41'),(66,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:35:16'),(67,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:36:24'),(68,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-04 18:12:54'),(69,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-04 19:09:44'),(70,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 06:11:23'),(71,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 06:24:45'),(72,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-06 07:02:32'),(73,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 07:27:17'),(74,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:00:54'),(75,5,'LOGIN','users',5,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:07:56'),(76,2,'LOGIN','users',2,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:08:42'),(77,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:18:12'),(78,5,'LOGIN','users',5,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:35:47'),(79,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:43:08'),(80,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 16:21:02'),(81,1,'LOGIN','users',1,NULL,1,NULL,'192.168.205.119',NULL,NULL,'2025-12-09 03:44:40');
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
  CONSTRAINT `fk_activities_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_activities_subprogram` FOREIGN KEY (`project_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (6,1,'community health training','ACT-1763978755976','Went well',NULL,'2025-11-25','2025-12-03','completed',0,NULL,NULL,'pending',NULL,'2025-11-24 10:05:56','2025-11-27 07:50:16',NULL,1,'2025-11-17',NULL,'CC road ',NULL,NULL,'Nairobi','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',20,10,'women',300.00,200.00,'approved','normal',NULL,NULL,NULL),(7,2,'Activity one','ACT-1764004280149','Activity one',NULL,'2025-11-25',NULL,'completed',0,NULL,NULL,'pending',NULL,'2025-11-24 17:11:20','2025-11-25 05:26:21',NULL,3,'2025-11-23',NULL,'Kibera',NULL,NULL,'Nairobi','Ward-near','Nairobi',4,'susan kei, james kio','peter james, test user',100,0,'youth',1000.00,0.00,'rejected','high',NULL,NULL,NULL),(8,1,'Introduction to Climate-Smart Agriculture','ACT-FE-001','Workshop covering basics of climate-resilient farming techniques',NULL,'2025-02-10','2025-02-10','in-progress',100,'Mary Wanjiku',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-25 05:24:37',NULL,1,'2025-02-10',NULL,'Kiambu Agricultural Center',NULL,NULL,'Kiambu Town','Municipality','Kiambu',6,'Mary Wanjiku, John Maina, Agricultural Officer','Field Team Alpha',50,48,'farmers',3000.00,2800.00,'rejected','high',NULL,NULL,NULL),(9,1,'Water Harvesting Techniques Training','ACT-FE-002','Practical training on rainwater harvesting and storage methods',NULL,'2025-03-15','2025-03-15','completed',50,'John Maina',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-25 10:11:31',NULL,1,'2025-03-15',NULL,'Community Hall - Githunguri',NULL,NULL,'Githunguri','Central Ward','Kiambu',5,'John Maina, Water Engineer Peter','Field Team Alpha',50,25,'farmers',3500.00,1500.00,'submitted','high',NULL,NULL,NULL),(10,1,'Demonstration Plot Land Preparation','ACT-FE-003','Clearing, plowing, and preparing land for demonstration plots',NULL,'2025-01-20','2025-01-25','completed',100,'Farm Supervisor',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,2,'2025-01-22',NULL,'Kiambu Demo Farm',NULL,NULL,'Kiambu Town','Central','Kiambu',40,'Farm Workers Team','Field Team Alpha',100,95,'farmers',5000.00,4800.00,'approved','',NULL,NULL,NULL),(11,2,'Water Point Technical Survey','ACT-FE-004','Engineering survey and condition assessment of 15 water points',NULL,'2025-02-05','2025-02-12','completed',100,'Engineer Peter',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,3,'2025-02-08',NULL,'Various locations Machakos',NULL,NULL,'Multiple','Multiple','Machakos',56,'Engineer Peter, Survey Team','Technical Team',2000,2000,'community',15000.00,14500.00,'approved','urgent',NULL,NULL,NULL),(12,2,'Mwala Water Point Rehabilitation','ACT-FE-005','Complete rehabilitation of Mwala community water point',NULL,'2025-03-01','2025-03-10','in-progress',60,'John Kamau',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,4,'2025-03-05',NULL,'Mwala Market Area',NULL,NULL,'Mwala','Mwala Ward','Machakos',80,'Engineer Peter, Construction Team','Technical Team',500,0,'community',50000.00,28000.00,'approved','urgent',NULL,NULL,NULL),(13,5,'Kibera VSLA Group Mobilization','ACT-SE-001','Community mobilization and formation of new VSLA groups in Kibera',NULL,'2025-02-01','2025-02-15','blocked',100,'Sarah Njeri',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:01:47',NULL,5,'2025-02-10',NULL,'Kibera Soweto Zone',NULL,NULL,'Kibera','Laini Saba','Nairobi',12,'Sarah Njeri, Community Mobilizers','VSLA Team',150,140,'women',8000.00,7500.00,'approved','high',NULL,NULL,NULL),(14,5,'VSLA Starter Kit Distribution','ACT-SE-002','Distribution of VSLA boxes, record books, and training materials',NULL,'2025-02-20','2025-02-20','in-progress',100,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:01:15',NULL,5,'2025-02-20',NULL,'Kibera Community Hall',NULL,NULL,'Kibera','Laini Saba','Nairobi',4,'Sarah Njeri, James Muturi','VSLA Team',150,145,'women',12000.00,11800.00,'approved','high',NULL,NULL,NULL),(15,5,'Basic Financial Management Workshop','ACT-SE-003','Training on budgeting, saving, and financial planning',NULL,'2025-03-05','2025-03-05','in-progress',50,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:32:25',NULL,6,'2025-03-05',NULL,'Olympic Community Center',NULL,NULL,'Kibera','Olympic Ward','Nairobi',5,'Financial Trainer, James Muturi','VSLA Team',150,70,'women',6000.00,2800.00,'submitted','high',NULL,NULL,NULL),(16,6,'Youth Entrepreneurship Bootcamp - Day 1','ACT-SE-004','Introduction to entrepreneurship and business opportunity identification',NULL,'2025-03-10','2025-03-10','completed',100,'James Omondi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,7,'2025-03-10',NULL,'Kisumu Youth Center',NULL,NULL,'Kisumu Town','Market Ward','Kisumu',6,'James Omondi, Business Trainer Sarah','Youth Enterprise Team',40,38,'youth',15000.00,14200.00,'approved','urgent',NULL,NULL,NULL),(17,6,'Business Plan Development Workshop','ACT-SE-005','Guided workshop on creating comprehensive business plans',NULL,'2025-03-17','2025-03-17','not-started',0,'Business Trainer Sarah',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,7,'2025-03-17',NULL,'Kisumu Youth Center',NULL,NULL,'Kisumu Town','Market Ward','Kisumu',8,'Business Trainer Sarah, Finance Officer','Youth Enterprise Team',40,0,'youth',18000.00,0.00,'draft','urgent',NULL,NULL,NULL),(18,9,'Community GBV Awareness Rally','ACT-GY-001','Public awareness rally on GBV prevention and reporting mechanisms',NULL,'2025-02-25','2025-02-25','completed',100,'Faith Akinyi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,9,'2025-02-25',NULL,'Mukuru Kwa Njenga',NULL,NULL,'Mukuru','Kwa Njenga Ward','Nairobi',4,'Faith Akinyi, Community Mobilizers, Police Rep','Gender Team',500,480,'community',12000.00,11500.00,'approved','urgent',NULL,NULL,NULL),(19,9,'GBV Survivor Counseling Sessions','ACT-GY-002','Individual and group counseling for GBV survivors',NULL,'2025-03-01','2025-03-31','in-progress',40,'Counselor Jane',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,10,'2025-03-15',NULL,'Caritas Counseling Center',NULL,NULL,'Nairobi CBD','Central Ward','Nairobi',60,'Counselor Jane, Psychologist Dr. Mary','Gender Team',50,18,'women',20000.00,7500.00,'approved','urgent',NULL,NULL,NULL),(20,10,'Beacon Boys Mentor Recruitment','ACT-GY-003','Recruiting and vetting community mentors for at-risk youth',NULL,'2025-02-10','2025-02-20','completed',100,'Michael Otieno',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,11,'2025-02-15',NULL,'Mombasa Community Centers',NULL,NULL,'Changamwe','Multiple Wards','Mombasa',20,'Michael Otieno, HR Coordinator','Youth Team',30,28,'youth',8000.00,7800.00,'approved','high',NULL,NULL,NULL),(21,10,'Life Skills Training - Conflict Resolution','ACT-GY-004','Workshop on conflict resolution and anger management for youth',NULL,'2025-03-08','2025-03-08','not-started',50,'Youth Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 18:22:56',NULL,12,'2025-03-06',NULL,'Mombasa Youth Hall',NULL,NULL,'Changamwe','Changamwe Ward','Mombasa',5,'Psychologist Dr. James, Youth Coordinator','Youth Team',50,0,'youth',9000.00,0.00,'submitted','high',NULL,NULL,NULL),(22,13,'Food Aid Beneficiary Verification','ACT-RL-001','House-to-house verification of drought-affected households',NULL,'2025-01-15','2025-01-30','completed',100,'Agnes Wambui',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,13,'2025-01-22',NULL,'Turkana Villages',NULL,NULL,'Multiple','Multiple','Turkana',120,'Field Assessment Team','Relief Team Alpha',1000,980,'households',15000.00,14800.00,'approved','urgent',NULL,NULL,NULL),(23,13,'February Food Distribution Exercise','ACT-RL-002','Monthly food ration distribution to registered beneficiaries',NULL,'2025-02-20','2025-02-22','completed',100,'Logistics Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,14,'2025-02-21',NULL,'Lodwar Distribution Points',NULL,NULL,'Lodwar Town','Multiple Wards','Turkana',24,'Distribution Team, Logistics Team','Relief Team Alpha',1000,975,'households',85000.00,84500.00,'approved','urgent',NULL,NULL,NULL),(24,14,'Refugee Tailoring Skills Training','ACT-RL-003','Vocational training in tailoring and garment making for refugees',NULL,'2025-02-05','2025-03-15','in-progress',55,'Hassan Mohammed',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,15,'2025-02-20',NULL,'Kakuma Vocational Center',NULL,NULL,'Kakuma Camp','Kakuma Ward','Turkana',120,'Hassan Mohammed, Tailoring Instructor','Refugee Support Team',30,28,'refugees',35000.00,18000.00,'approved','high',NULL,NULL,NULL),(25,17,'Introduction to M&E Systems','ACT-CB-001','Training on monitoring and evaluation fundamentals and tools',NULL,'2025-02-28','2025-03-01','completed',100,'Patrick Mwangi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,17,'2025-03-01',NULL,'Caritas Training Room',NULL,NULL,'Nairobi CBD','Central','Nairobi',12,'Patrick Mwangi, External M&E Expert','Capacity Building Team',15,14,'staff',12000.00,11500.00,'approved','',NULL,NULL,NULL),(26,18,'Community Volunteer Recruitment Event','ACT-CB-002','Public recruitment event for community volunteers across target areas',NULL,'2025-02-18','2025-02-18','completed',100,'Susan Njoki',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-11-24 17:59:30',NULL,19,'2025-02-18',NULL,'Various Community Centers',NULL,NULL,'Multiple','Multiple','Various',8,'Susan Njoki, Volunteer Coordinators','Volunteer Team',100,92,'community',8000.00,7600.00,'approved','',NULL,NULL,NULL),(27,1,'community health trainings','ACT-1764067553465','',NULL,'2025-11-24',NULL,'in-progress',0,NULL,NULL,'pending',NULL,'2025-11-25 10:45:53','2025-11-27 06:43:29',NULL,1,'2025-11-15',NULL,'Mombasa Youth Hall',NULL,NULL,'Changamwe','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','James kia, Peterson mbatha, Susuan ndei',100,200,'farmers',1000.00,0.00,'submitted','high',NULL,NULL,NULL),(28,1,'Health sensitive information training ','ACT-1764830207713','Health informatics technical training ',NULL,'2025-12-05',NULL,'',0,NULL,NULL,'pending',NULL,'2025-12-04 06:36:48','2025-12-04 09:15:20',NULL,1,'2025-12-03',NULL,'Local support Collaborate center ',NULL,NULL,'Nairobi','Kibra','Nairobi ',NULL,'James, Peter, Jude ','Peter,  Evans ',100,0,'Opus team',2000.00,0.00,'draft','normal',NULL,NULL,NULL),(29,1,'Health sensitive information training repeat','ACT-1765033900745','Health sensitive information training repeat',NULL,NULL,NULL,'completed',0,NULL,NULL,'pending',NULL,'2025-12-06 15:11:40','2025-12-06 15:17:25',NULL,1,'2025-12-05',NULL,'Mombasa Youth Hall',NULL,NULL,'Nairobi','Wardnear ','Nairobi',8,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',100,0,'CHVs',2000.00,0.00,'approved','normal',2,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity Checklists (Implementation Steps) - ClickUp Checklists';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_checklists`
--

LOCK TABLES `activity_checklists` WRITE;
/*!40000 ALTER TABLE `activity_checklists` DISABLE KEYS */;
INSERT INTO `activity_checklists` VALUES (1,6,'Register the beneficiaries',0,NULL,NULL,1,'2025-11-25 14:03:36',1,'pending',NULL,'2025-11-25 10:52:29','2025-11-25 11:03:35'),(2,6,'Get the training materials and support staff',1,NULL,NULL,1,'2025-11-25 14:03:28',1,'pending',NULL,'2025-11-25 10:52:44','2025-11-25 11:03:27'),(3,6,'Find the venue for the activity',2,NULL,NULL,1,'2025-11-25 14:03:12',1,'pending',NULL,'2025-11-25 10:53:17','2025-11-25 11:03:11'),(4,27,'Register new beneficiaries',0,NULL,NULL,1,'2025-11-25 19:26:33',1,'pending',NULL,'2025-11-25 11:05:08','2025-11-25 16:26:33'),(5,27,'Take ground checks',1,NULL,NULL,1,'2025-11-25 14:50:07',NULL,'pending',NULL,'2025-11-25 11:05:51','2025-11-25 11:50:07'),(6,28,'Beneficialies training',0,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-04 06:37:48','2025-12-04 09:15:18'),(7,29,'Look for venue',0,NULL,NULL,1,'2025-12-06 18:14:36',1,'pending',NULL,'2025-12-06 15:12:08','2025-12-06 15:14:36'),(8,29,'Conduct mobilization',1,NULL,NULL,1,'2025-12-06 18:14:39',1,'pending',NULL,'2025-12-06 15:12:29','2025-12-06 15:14:38'),(9,29,'Budget approval',2,NULL,NULL,1,'2025-12-06 18:14:42',1,'pending',NULL,'2025-12-06 15:12:43','2025-12-06 15:14:41');
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaries`
--

LOCK TABLES `beneficiaries` WRITE;
/*!40000 ALTER TABLE `beneficiaries` DISABLE KEYS */;
INSERT INTO `beneficiaries` VALUES (1,'BEN-2024-001','Mary','Wanjiku','Kamau','1985-03-15',39,'female',NULL,'0712345601',NULL,'mary.kamau@email.com','Nairobi','Dagoretti','Kawangware','Kawangware North',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-01-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(2,'BEN-2024-002','John','Mwangi','Ochieng','1990-07-22',34,'male',NULL,'0723456702',NULL,'john.ochieng@email.com','Kisumu','Kisumu East','Manyatta','Nyalenda B',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-01-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(3,'BEN-2024-003','Grace','Akinyi','Otieno','1995-11-08',29,'female',NULL,'0734567803',NULL,NULL,'Mombasa','Mvita','Tononoka','Majengo',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-02-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(4,'BEN-2024-004','David','Kipchoge','Rotich','1978-05-30',46,'male',NULL,'0745678904',NULL,'david.rotich@email.com','Uasin Gishu','Ainabkoi','Kapsoya','Kapsoya Estate',NULL,NULL,7,1,'married','physical',NULL,'pwd',NULL,NULL,NULL,NULL,'2024-02-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(5,'BEN-2024-005','Faith','Nyambura','Kariuki','2002-09-12',22,'female',NULL,'0756789005',NULL,NULL,'Kiambu','Kikuyu','Kikuyu','Kikuyu Town',NULL,NULL,3,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-02-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(6,'BEN-2024-006','Peter','Kamau','Muturi','1965-12-25',59,'male',NULL,'0767890106',NULL,NULL,'Murang\'a','Kigumo','Kinyona','Kinyona Village',NULL,NULL,2,1,'widowed','visual',NULL,'elderly',NULL,NULL,NULL,NULL,'2024-02-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(7,'BEN-2024-007','Sarah','Wambui','Ndungu','1988-04-18',36,'female',NULL,'0778901207',NULL,'sarah.ndungu@email.com','Nakuru','Nakuru West','Kaptembwo','Section 58',NULL,NULL,8,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(8,'BEN-2024-008','James','Otieno','Omondi','1992-08-05',32,'male',NULL,'0789012308',NULL,NULL,'Kisumu','Kisumu Central','Kondele','Nyalenda A',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(9,'BEN-2024-009','Lucy','Njeri','Wanjiru','1999-01-14',25,'female',NULL,'0790123409',NULL,'lucy.wanjiru@email.com','Nairobi','Embakasi','Umoja','Umoja 1',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-03-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(10,'BEN-2024-010','Daniel','Kiprono','Koech','1983-06-20',41,'male',NULL,'0701234510',NULL,NULL,'Kericho','Bureti','Litein','Litein Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(11,'BEN-2024-011','Esther','Mumbi','Githui','1970-10-10',54,'female',NULL,'0712345611',NULL,'esther.githui@email.com','Kirinyaga','Mwea','Wamumu','Wamumu Village',NULL,NULL,3,1,'divorced','hearing',NULL,'pwd',NULL,NULL,NULL,NULL,'2024-03-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(12,'BEN-2024-012','Michael','Juma','Hassan','1987-02-28',37,'male',NULL,'0723456712',NULL,NULL,'Garissa','Garissa Township','Township','Iftin',NULL,NULL,9,1,'married','none',NULL,'refugee',NULL,NULL,NULL,NULL,'2024-03-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(13,'BEN-2024-013','Alice','Chebet','Sang','1996-11-30',28,'female',NULL,'0734567813',NULL,'alice.sang@email.com','Bomet','Bomet Central','Silibwet','Silibwet Town',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,'null','null',NULL,'2024-04-01',NULL,NULL,'graduated',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:44:02',NULL),(14,'BEN-2024-014','Joseph','Wekesa','Wafula','1975-07-19',49,'male',NULL,'0745678914',NULL,NULL,'Bungoma','Kanduyi','Bukembe','Bukembe West',NULL,NULL,7,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(15,'BEN-2024-015','Rose','Nyokabi','Maina','2003-03-22',21,'female',NULL,'0756789015',NULL,NULL,'Nyeri','Nyeri Central','Ruringu','Ruringu Estate',NULL,NULL,4,0,'single','none',NULL,'ovc',NULL,NULL,NULL,NULL,'2024-04-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(16,'BEN-2024-016','Patrick','Kibet','Kiptoo','1980-11-30',44,'male',NULL,'0767890116',NULL,'patrick.kiptoo@email.com','Nandi','Nandi Hills','Nandi Hills','Nandi Hills Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(17,'BEN-2024-017','Jane','Wangari','Ngugi','1993-09-07',31,'female',NULL,'0778901217',NULL,NULL,'Kajiado','Kajiado Central','Ildamat','Ildamat Village',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(18,'BEN-2024-018','Samuel','Mburu','Karanja','1968-05-14',56,'male',NULL,'0789012318',NULL,'samuel.karanja@email.com','Embu','Manyatta','Gaturi North','Gaturi',NULL,NULL,2,1,'widowed','multiple',NULL,'elderly',NULL,NULL,NULL,NULL,'2024-04-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(19,'BEN-2024-019','Catherine','Achieng','Awino','1998-01-25',26,'female',NULL,'0790123419',NULL,NULL,'Siaya','Bondo','West Sakwa','Usonga',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-05-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(20,'BEN-2024-020','George','Macharia','Njoroge','1986-08-11',38,'male',NULL,'0701234520',NULL,'george.njoroge@email.com','Laikipia','Laikipia East','Nanyuki','Nanyuki Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(21,'BEN-2024-021','Margaret','Wanjiru','Kimani','1972-04-08',52,'female',NULL,'0712345621',NULL,NULL,'Nyandarua','Ol Kalou','Rurii','Rurii Village',NULL,NULL,3,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(22,'BEN-2024-022','Francis','Ouma','Odhiambo','1991-10-16',33,'male',NULL,'0723456722',NULL,'francis.odhiambo@email.com','Homa Bay','Ndhiwa','Kwabwai','Kwabwai Market',NULL,NULL,7,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(23,'BEN-2024-023','Joyce','Wangui','Kimathi','2000-06-29',24,'female',NULL,'0734567823',NULL,NULL,'Meru','Imenti North','Ntima','Ntima East',NULL,NULL,5,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-05-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(24,'BEN-2024-024','Thomas','Kiptanui','Biwott','1977-12-12',47,'male',NULL,'0745678924',NULL,NULL,'Elgeyo Marakwet','Marakwet West','Kapsowar','Kapsowar Town',NULL,NULL,8,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(25,'BEN-2024-025','Ann','Njoki','Wachira','1989-02-17',35,'female',NULL,'0756789025',NULL,'ann.wachira@email.com','Tharaka Nithi','Chuka','Karingani','Karingani Village',NULL,NULL,4,1,'divorced','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-06-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL);
/*!40000 ALTER TABLE `beneficiaries` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gbv_cases`
--

LOCK TABLES `gbv_cases` WRITE;
/*!40000 ALTER TABLE `gbv_cases` DISABLE KEYS */;
INSERT INTO `gbv_cases` VALUES (1,'GBV-2024-001','SUR-A001',NULL,'','female','2024-01-15','',NULL,'Nairobi, Kawangware','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital'),(2,'GBV-2024-002','SUR-B002',NULL,'','female','2024-01-22','',NULL,'Kisumu, Nyalenda','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station'),(3,'GBV-2024-003','SUR-C003',NULL,'','female','2024-02-05','',NULL,'Mombasa, Majengo','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader'),(4,'GBV-2024-004','SUR-D004',NULL,'','female','2024-02-12','',NULL,'Uasin Gishu, Kapsoya','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','School'),(5,'GBV-2024-005','SUR-E005',NULL,'','female','2024-02-20','',NULL,'Kiambu, Kikuyu','0000-00-00','closed','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center'),(6,'GBV-2024-006','SUR-F006',NULL,'','female','2024-03-01','',NULL,'Murang\'a, Kinyona','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station'),(7,'GBV-2024-007','SUR-G007',NULL,'','female','2024-03-10','',NULL,'Nakuru, Kaptembwo','0000-00-00','follow_up','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','NGO'),(8,'GBV-2024-008','SUR-H008',NULL,'','female','2024-03-18','',NULL,'Kisumu, Kondele','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital'),(9,'GBV-2024-009','SUR-I009',NULL,'','female','2024-03-25','',NULL,'Nairobi, Umoja','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Neighbor'),(10,'GBV-2024-010','SUR-J010',NULL,'','female','2024-04-02','',NULL,'Kericho, Litein','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station'),(11,'GBV-2024-011','SUR-K011',NULL,'','female','2024-04-08','',NULL,'Kirinyaga, Wamumu','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center'),(12,'GBV-2024-012','SUR-L012',NULL,'','female','2024-04-15','',NULL,'Bomet, Silibwet','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','School'),(13,'GBV-2024-013','SUR-M013',NULL,'','female','2024-04-22','',NULL,'Bungoma, Bukembe','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader'),(14,'GBV-2024-014','SUR-N014',NULL,'','female','2024-05-01','',NULL,'Nyeri, Ruringu','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital'),(15,'GBV-2024-015','SUR-O015',NULL,'','female','2024-05-08','',NULL,'Nandi, Nandi Hills','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','NGO'),(16,'GBV-2024-016','SUR-P016',NULL,'','female','2024-05-15','',NULL,'Kajiado, Ildamat','0000-00-00','closed','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station'),(17,'GBV-2024-017','SUR-Q017',NULL,'','female','2024-05-22','',NULL,'Embu, Gaturi','0000-00-00','follow_up','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital'),(18,'GBV-2024-018','SUR-R018',NULL,'','female','2024-05-29','',NULL,'Siaya, Usonga','0000-00-00','','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader'),(19,'GBV-2024-019','SUR-S019',NULL,'','female','2024-06-05','',NULL,'Laikipia, Nanyuki','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station'),(20,'GBV-2024-020','SUR-T020',NULL,'','female','2024-06-10','',NULL,'Nyandarua, Rurii','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center');
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,'LOAN-2024-001',1,0,1,'',50000.00,10.00,12,'monthly','2024-01-20',NULL,NULL,NULL,NULL,'Small shop expansion',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(2,'LOAN-2024-002',1,0,3,'',30000.00,10.00,6,'monthly','2024-02-01',NULL,NULL,NULL,NULL,'Farm inputs purchase',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(3,'LOAN-2024-003',2,0,2,'',40000.00,8.00,12,'monthly','2024-02-10',NULL,NULL,NULL,NULL,'School fees payment',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(4,'LOAN-2024-004',2,0,4,'',60000.00,10.00,12,'monthly','2024-02-15',NULL,NULL,NULL,NULL,'Tailoring business',NULL,NULL,NULL,0.00,NULL,0.00,'active','overdue',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(5,'LOAN-2024-005',3,0,7,'',20000.00,8.00,6,'monthly','2024-03-01',NULL,NULL,NULL,NULL,'Medical emergency',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(6,'LOAN-2024-006',3,0,9,'',45000.00,10.00,12,'monthly','2024-03-05',NULL,NULL,NULL,NULL,'Beauty salon',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(7,'LOAN-2024-007',4,0,10,'',80000.00,12.00,18,'monthly','2024-03-10',NULL,NULL,NULL,NULL,'Dairy farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(8,'LOAN-2024-008',4,0,12,'',55000.00,10.00,12,'monthly','2024-03-15',NULL,NULL,NULL,NULL,'Motorcycle taxi',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(9,'LOAN-2024-009',5,0,13,'',35000.00,8.00,12,'monthly','2024-03-20',NULL,NULL,NULL,NULL,'Vocational training',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(10,'LOAN-2024-010',5,0,15,'',25000.00,10.00,6,'monthly','2024-03-25',NULL,NULL,NULL,NULL,'Vegetable vending',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(11,'LOAN-2024-011',1,0,5,'',40000.00,10.00,12,'monthly','2024-04-01',NULL,NULL,NULL,NULL,'Poultry farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(12,'LOAN-2024-012',2,0,6,'',70000.00,12.00,18,'monthly','2024-04-05',NULL,NULL,NULL,NULL,'Hardware shop',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(13,'LOAN-2024-013',3,0,11,'',15000.00,8.00,6,'monthly','2024-04-10',NULL,NULL,NULL,NULL,'House repair',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(14,'LOAN-2024-014',4,0,14,'',50000.00,10.00,12,'monthly','2024-04-15',NULL,NULL,NULL,NULL,'Grocery store',NULL,NULL,NULL,0.00,NULL,0.00,'active','overdue',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(15,'LOAN-2024-015',5,0,17,'',35000.00,10.00,12,'monthly','2024-04-20',NULL,NULL,NULL,NULL,'Crop farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(16,'LOAN-2024-016',1,0,7,'',45000.00,10.00,12,'monthly','2024-04-25',NULL,NULL,NULL,NULL,'Clothing business',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(17,'LOAN-2024-017',2,0,8,'',30000.00,8.00,12,'monthly','2024-05-01',NULL,NULL,NULL,NULL,'College fees',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(18,'LOAN-2024-018',3,0,13,'',55000.00,10.00,12,'monthly','2024-05-05',NULL,NULL,NULL,NULL,'Restaurant',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(19,'LOAN-2024-019',4,0,16,'',65000.00,12.00,18,'monthly','2024-05-10',NULL,NULL,NULL,NULL,'Greenhouse farming',NULL,NULL,NULL,0.00,NULL,0.00,'disbursed','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(20,'LOAN-2024-020',5,0,19,'',40000.00,10.00,12,'monthly','2024-05-15',NULL,NULL,NULL,NULL,'Fish vending',NULL,NULL,NULL,0.00,NULL,0.00,'approved','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(21,'LOAN-2024-021',1,0,9,'',18000.00,8.00,6,'monthly','2024-05-20',NULL,NULL,NULL,NULL,'Family emergency',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(22,'LOAN-2024-022',2,0,20,'',60000.00,10.00,12,'monthly','2024-05-25',NULL,NULL,NULL,NULL,'Barbershop',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(23,'LOAN-2024-023',3,0,21,'',75000.00,12.00,18,'monthly','2024-06-01',NULL,NULL,NULL,NULL,'Livestock purchase',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(24,'LOAN-2024-024',4,0,22,'',50000.00,10.00,12,'monthly','2024-06-05',NULL,NULL,NULL,NULL,'Welding workshop',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(25,'LOAN-2024-025',5,0,23,'',32000.00,8.00,12,'monthly','2024-06-10',NULL,NULL,NULL,NULL,'Driving school',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_indicators`
--

LOCK TABLES `me_indicators` WRITE;
/*!40000 ALTER TABLE `me_indicators` DISABLE KEYS */;
INSERT INTO `me_indicators` VALUES (1,NULL,NULL,NULL,'Number of beneficiaries reached','SEED-MODULE-001','Total number of beneficiaries reached through Capacity Building','impact',NULL,'people',0.00,5000.00,1250.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-26 19:37:39',5,NULL,NULL,'2024-12-31','2025-12-30',NULL,NULL,'off-track',25.00,'Project Manager','Q1 progress on track',NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,'Training sessions completed','SEED-MODULE-002','Number of training sessions delivered under Capacity Building','output',NULL,'sessionszz',0.00,50.00,100.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-26 20:21:37',5,NULL,NULL,'2024-12-30','2025-12-29',NULL,NULL,'on-track',100.00,'Training Coordinator','Ahead of schedule in regional offices',NULL,NULL,NULL,NULL),(3,NULL,NULL,NULL,'Satisfaction rate','SEED-MODULE-003','Beneficiary satisfaction rate for Capacity Building','outcome','Hts','percentage',65.00,85.00,84.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-11-27 04:46:59',5,NULL,NULL,'2025-11-24','2025-11-24',NULL,NULL,'on-track',98.82,'M&E Officer','Need to improve service delivery in some areas',NULL,NULL,NULL,NULL),(4,NULL,NULL,NULL,'test','code','','output','test','test',200.00,499.97,399.00,'monthly','','',NULL,NULL,1,'2025-11-27 05:45:36','2025-11-27 07:44:07',5,NULL,NULL,'0000-00-00','2025-11-25',NULL,NULL,'on-track',79.80,'Peterson James',NULL,NULL,NULL,NULL,NULL),(5,NULL,NULL,NULL,'customer care service','ccs12','how the staff interact and engage with our clients','output','health','people',2.50,5.00,1.50,'monthly','clients','review forms',NULL,NULL,1,'2025-11-27 06:08:49','2025-11-27 06:08:49',NULL,19,NULL,'2025-10-27','2025-11-27',NULL,NULL,'off-track',30.00,'customer relations manager',NULL,NULL,NULL,NULL,NULL),(6,NULL,NULL,NULL,'success of the training','sot 34','if the training is having any positive impact to the community','outcome','education','%',30.00,100.00,40.00,'monthly','trainees','list of the attendees',NULL,NULL,1,'2025-11-27 06:20:29','2025-11-27 06:20:29',NULL,21,NULL,'2025-09-27','2025-12-27',NULL,NULL,'off-track',40.00,'M&E',NULL,NULL,NULL,NULL,NULL),(7,NULL,NULL,6,'Community healt','ch-ooo2','test','output','health','people',100.00,200.00,150.00,'daily',NULL,NULL,NULL,NULL,1,'2025-11-27 07:47:26','2025-11-27 07:47:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',75.00,'Training team',NULL,NULL,NULL,NULL,NULL),(8,NULL,NULL,NULL,'Number oF participant Trained','NPT-001','','output','Health','People',400.00,499.98,350.00,'daily','Attendance sheet','Physical attendance list',NULL,NULL,1,'2025-12-06 15:25:51','2025-12-06 15:26:33',5,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'at-risk',70.00,'Abel',NULL,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Available permissions in the system';
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
INSERT INTO `program_modules` VALUES (1,1,'Food, Water & Environment','FOOD_ENV','🌾','Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(2,1,'Socio-Economic Empowerment','SOCIO_ECON','💼','Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(3,1,'Gender, Youth & Peace','GENDER_YOUTH','👥','Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(4,1,'Relief & Charitable Services','RELIEF','🆘','Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL),(5,1,'Resource management','CAPACITY','📚','Staff Training & Development, Volunteer Mobilization & Management, Community Leadership Training, Organizational Development, and Knowledge Management',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-06 17:03:04',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relief_distributions`
--

LOCK TABLES `relief_distributions` WRITE;
/*!40000 ALTER TABLE `relief_distributions` DISABLE KEYS */;
INSERT INTO `relief_distributions` VALUES (1,'REL-2024-001','2024-01-15',3,'food','Kawangware, Nairobi',NULL,'Dagoretti','Nairobi','Maize flour, beans, cooking oil',500,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(2,'REL-2024-002','2024-01-20',3,'nfis','Nyalenda, Kisumu',NULL,'Kisumu East','Kisumu','Blankets, mosquito nets, jerry cans',200,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,40,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(3,'REL-2024-003','2024-02-01',3,'food','Majengo, Mombasa',NULL,'Mvita','Mombasa','Rice, sugar, salt',750,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,75,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(4,'REL-2024-004','2024-02-10',3,'cash','Kapsoya, Uasin Gishu',NULL,'Ainabkoi','Uasin Gishu','Cash transfer',50,'households',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(5,'REL-2024-005','2024-02-15',3,'food','Kikuyu, Kiambu',NULL,'Kikuyu','Kiambu','Maize, beans, cooking oil',400,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,40,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(6,'REL-2024-006','2024-03-01',3,'medical','Kinyona, Murang\'a',NULL,'Kigumo','Murang\'a','First aid kits, medicine',100,'kits',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,30,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(7,'REL-2024-007','2024-03-10',3,'food','Kaptembwo, Nakuru',NULL,'Nakuru West','Nakuru','Maize flour, rice, oil',1000,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,100,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(8,'REL-2024-008','2024-03-15',3,'voucher','Kondele, Kisumu',NULL,'Kisumu Central','Kisumu','Food vouchers',80,'vouchers',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,80,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(9,'REL-2024-009','2024-03-20',3,'nfis','Umoja, Nairobi',NULL,'Embakasi','Nairobi','Bedding, utensils, hygiene kits',150,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,45,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(10,'REL-2024-010','2024-04-01',3,'food','Litein, Kericho',NULL,'Bureti','Kericho','Maize, beans, salt',600,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,60,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(11,'REL-2024-011','2024-04-05',3,'shelter','Wamumu, Kirinyaga',NULL,'Mwea','Kirinyaga','Iron sheets, timber',200,'sheets',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,25,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(12,'REL-2024-012','2024-04-10',3,'food','Silibwet, Bomet',NULL,'Bomet Central','Bomet','Maize flour, cooking oil',450,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,45,'in_progress','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(13,'REL-2024-013','2024-04-15',3,'education','Bukembe, Bungoma',NULL,'Kanduyi','Bungoma','School supplies, uniforms',120,'sets',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,120,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(14,'REL-2024-014','2024-04-20',3,'food','Ruringu, Nyeri',NULL,'Nyeri Central','Nyeri','Rice, sugar, tea leaves',350,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,35,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(15,'REL-2024-015','2024-05-01',3,'cash','Nandi Hills',NULL,'Nandi Hills','Nandi','Cash transfer',60,'households',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,60,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(16,'REL-2024-016','2024-05-05',3,'food','Ildamat, Kajiado',NULL,'Kajiado Central','Kajiado','Maize, beans, oil',550,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,55,'in_progress','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(17,'REL-2024-017','2024-05-10',3,'medical','Gaturi, Embu',NULL,'Manyatta','Embu','Medicine, first aid supplies',80,'kits',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,25,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(18,'REL-2024-018','2024-05-14',3,'nfis','Usonga, Siaya','','Bondo','Siaya','Blankets, mosquito nets',180,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'planned','2025-12-05 17:36:15','2025-12-06 06:35:21',NULL),(19,'REL-2024-019','2024-05-20',3,'food','Nanyuki, Laikipia',NULL,'Laikipia East','Laikipia','Maize flour, beans, salt',700,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,70,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(20,'REL-2024-020','2024-05-25',3,'voucher','Rurii, Nyandarua',NULL,'Ol Kalou','Nyandarua','Food vouchers',50,'vouchers',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(21,'REL-2024-021','2024-05-31',3,'food','Kwabwai, Homa Bay','','Ndhiwa','Homa Bay','Maize, rice, cooking oil, Sugar',800,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,80,'planned','2025-12-05 17:36:15','2025-12-05 17:38:30',NULL),(22,'REL-2024-022','2024-06-05',3,'shelter','Ntima, Meru',NULL,'Imenti North','Meru','Building materials',150,'bundles',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,30,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL);
/*!40000 ALTER TABLE `relief_distributions` ENABLE KEYS */;
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
INSERT INTO `results_chain` VALUES (1,'activity',6,'component',1,'Health wise',100.00,'Need suport to achieve this','2025-11-27 08:09:17','2025-11-27 08:09:17',NULL),(2,'component',1,'sub_program',1,'test level',50.00,'as test','2025-11-27 08:14:13','2025-11-27 08:14:13',NULL),(3,'activity',13,'component',5,'here',10.00,NULL,'2025-11-27 08:26:51','2025-11-27 08:26:51',NULL),(4,'activity',19,'component',10,'Helps',100.00,'','2025-11-27 08:37:05','2025-12-04 09:08:16',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shg_members`
--

LOCK TABLES `shg_members` WRITE;
/*!40000 ALTER TABLE `shg_members` DISABLE KEYS */;
INSERT INTO `shg_members` VALUES (2,1,2,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(3,1,4,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(4,1,1,'2023-01-15','active',NULL,NULL,'chairperson',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(5,1,3,'2023-01-15','active',NULL,NULL,'secretary',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(6,1,5,'2023-01-15','active',NULL,NULL,'treasurer',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(7,1,7,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(8,1,9,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(9,1,11,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(10,1,13,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(11,1,15,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(12,1,17,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(13,1,19,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(14,1,21,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(15,1,23,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(16,1,25,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(17,2,2,'2023-02-10','active',NULL,NULL,'chairperson',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(18,2,4,'2023-02-10','active',NULL,NULL,'secretary',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(19,2,6,'2023-02-10','active',NULL,NULL,'treasurer',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(20,2,8,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(21,2,10,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(22,2,12,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(23,2,14,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(24,2,16,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(25,2,18,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(26,2,20,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(27,2,22,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(28,2,24,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(29,2,1,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(30,2,3,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(31,2,5,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(32,2,7,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(33,2,9,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(34,2,11,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(35,2,13,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(36,2,15,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(48,3,1,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(49,3,2,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(50,3,3,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(51,3,4,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(52,3,5,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(53,3,6,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(54,3,7,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(55,3,8,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(56,3,9,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(57,3,10,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(58,3,11,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(59,3,12,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(63,4,5,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(64,4,6,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(65,4,7,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(66,4,8,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(67,4,9,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(68,4,10,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(69,4,11,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(70,4,12,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(71,4,13,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(72,4,14,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(73,4,15,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(74,4,16,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(78,5,1,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(79,5,2,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(80,5,3,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(81,5,4,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(82,5,5,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(83,5,6,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(84,5,7,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(85,5,8,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(86,5,9,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(87,5,10,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL);
/*!40000 ALTER TABLE `shg_members` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_queue`
--

LOCK TABLES `sync_queue` WRITE;
/*!40000 ALTER TABLE `sync_queue` DISABLE KEYS */;
INSERT INTO `sync_queue` VALUES (1,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:53:52',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52'),(2,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:57:01',NULL,NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01'),(3,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:59:56',NULL,NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56'),(4,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 19:22:55',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55'),(5,'create','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 13:05:56',NULL,NULL,'2025-11-24 10:05:56','2025-11-24 10:05:56'),(6,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:32:42',NULL,NULL,'2025-11-24 11:32:42','2025-11-24 11:32:42'),(7,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:38:45',NULL,NULL,'2025-11-24 11:38:45','2025-11-24 11:38:45'),(8,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:03:43',NULL,NULL,'2025-11-24 14:03:43','2025-11-24 14:03:43'),(9,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:04:26',NULL,NULL,'2025-11-24 14:04:26','2025-11-24 14:04:26'),(10,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:06',NULL,NULL,'2025-11-24 14:15:06','2025-11-24 14:15:06'),(11,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:11',NULL,NULL,'2025-11-24 14:15:11','2025-11-24 14:15:11'),(12,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:14',NULL,NULL,'2025-11-24 14:15:14','2025-11-24 14:15:14'),(13,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:18',NULL,NULL,'2025-11-24 14:15:18','2025-11-24 14:15:18'),(14,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:22',NULL,NULL,'2025-11-24 14:15:22','2025-11-24 14:15:22'),(15,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:16:33',NULL,NULL,'2025-11-24 14:16:33','2025-11-24 14:16:33'),(16,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:01',NULL,NULL,'2025-11-24 14:37:01','2025-11-24 14:37:01'),(17,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:22',NULL,NULL,'2025-11-24 14:37:22','2025-11-24 14:37:22'),(18,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:08',NULL,NULL,'2025-11-24 14:44:08','2025-11-24 14:44:08'),(19,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:12',NULL,NULL,'2025-11-24 14:44:12','2025-11-24 14:44:12'),(20,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:14',NULL,NULL,'2025-11-24 14:44:14','2025-11-24 14:44:14'),(21,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 19:50:04',NULL,NULL,'2025-11-24 16:50:04','2025-11-24 16:50:04'),(22,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:03:54',NULL,NULL,'2025-11-24 17:03:54','2025-11-24 17:03:54'),(23,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2025-11-24 20:08:48',NULL,NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48'),(24,'create','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:20',NULL,NULL,'2025-11-24 17:11:20','2025-11-24 17:11:20'),(25,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:25',NULL,NULL,'2025-11-24 17:11:25','2025-11-24 17:11:25'),(26,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:30',NULL,NULL,'2025-11-24 17:11:30','2025-11-24 17:11:30'),(27,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:55',NULL,NULL,'2025-11-24 17:11:55','2025-11-24 17:11:55'),(28,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:01',NULL,NULL,'2025-11-24 17:12:01','2025-11-24 17:12:01'),(29,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:23',NULL,NULL,'2025-11-24 17:12:23','2025-11-24 17:12:23'),(30,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:13:19',NULL,NULL,'2025-11-24 17:13:19','2025-11-24 17:13:19'),(31,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:28:38',NULL,NULL,'2025-11-24 17:28:38','2025-11-24 17:28:38'),(32,'update','activity',14,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:15',NULL,NULL,'2025-11-24 18:01:15','2025-11-24 18:01:15'),(33,'update','activity',13,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:48',NULL,NULL,'2025-11-24 18:01:48','2025-11-24 18:01:48'),(34,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:05:41',NULL,NULL,'2025-11-24 18:05:41','2025-11-24 18:05:41'),(35,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:12:20',NULL,NULL,'2025-11-24 18:12:20','2025-11-24 18:12:20'),(36,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:13:59',NULL,NULL,'2025-11-24 18:13:59','2025-11-24 18:13:59'),(37,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:39',NULL,NULL,'2025-11-24 18:22:39','2025-11-24 18:22:39'),(38,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:56',NULL,NULL,'2025-11-24 18:22:56','2025-11-24 18:22:56'),(39,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:24:55',NULL,NULL,'2025-11-24 18:24:55','2025-11-24 18:24:55'),(40,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:32:25',NULL,NULL,'2025-11-24 18:32:25','2025-11-24 18:32:25'),(41,'update','activity',8,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:37',NULL,NULL,'2025-11-25 05:24:37','2025-11-25 05:24:37'),(42,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:57',NULL,NULL,'2025-11-25 05:24:57','2025-11-25 05:24:57'),(43,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:26:21',NULL,NULL,'2025-11-25 05:26:21','2025-11-25 05:26:21'),(44,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:11',NULL,NULL,'2025-11-25 06:28:11','2025-11-25 06:28:11'),(45,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:18',NULL,NULL,'2025-11-25 06:28:18','2025-11-25 06:28:18'),(46,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:26',NULL,NULL,'2025-11-25 06:28:26','2025-11-25 06:28:26'),(47,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:30:30',NULL,NULL,'2025-11-25 06:30:30','2025-11-25 06:30:30'),(48,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:31:19',NULL,NULL,'2025-11-25 06:31:19','2025-11-25 06:31:19'),(49,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:39:52',NULL,NULL,'2025-11-25 06:39:52','2025-11-25 06:39:52'),(50,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:11:31',NULL,NULL,'2025-11-25 10:11:31','2025-11-25 10:11:31'),(51,'create','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:45:53',NULL,NULL,'2025-11-25 10:45:53','2025-11-25 10:45:53'),(52,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:46:13',NULL,NULL,'2025-11-25 10:46:13','2025-11-25 10:46:13'),(53,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:53:31',NULL,NULL,'2025-11-25 10:53:31','2025-11-25 10:53:31'),(54,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:54:07',NULL,NULL,'2025-11-25 10:54:07','2025-11-25 10:54:07'),(55,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:59:25',NULL,NULL,'2025-11-25 10:59:25','2025-11-25 10:59:25'),(56,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:04:00',NULL,NULL,'2025-11-25 11:04:00','2025-11-25 11:04:00'),(57,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:05:55',NULL,NULL,'2025-11-25 11:05:55','2025-11-25 11:05:55'),(58,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:13:26',NULL,NULL,'2025-11-25 16:13:26','2025-11-25 16:13:26'),(59,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:26:39',NULL,NULL,'2025-11-25 16:26:39','2025-11-25 16:26:39'),(60,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:39',NULL,NULL,'2025-11-25 17:54:39','2025-11-25 17:54:39'),(61,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:43',NULL,NULL,'2025-11-25 17:54:43','2025-11-25 17:54:43'),(62,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:55:35',NULL,NULL,'2025-11-25 17:55:35','2025-11-25 17:55:35'),(63,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:20',NULL,NULL,'2025-11-27 06:43:20','2025-11-27 06:43:20'),(64,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:29',NULL,NULL,'2025-11-27 06:43:29','2025-11-27 06:43:29'),(65,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 10:50:16',NULL,NULL,'2025-11-27 07:50:16','2025-11-27 07:50:16'),(66,'create','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 09:36:48',NULL,NULL,'2025-12-04 06:36:48','2025-12-04 06:36:48'),(67,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:00:13',NULL,NULL,'2025-12-04 09:00:13','2025-12-04 09:00:13'),(68,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:14:53',NULL,NULL,'2025-12-04 09:14:53','2025-12-04 09:14:53'),(69,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:15:20',NULL,NULL,'2025-12-04 09:15:20','2025-12-04 09:15:20'),(70,'create','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:11:40',NULL,NULL,'2025-12-06 15:11:40','2025-12-06 15:11:40'),(71,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:12:48',NULL,NULL,'2025-12-06 15:12:48','2025-12-06 15:12:48'),(72,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:13:12',NULL,NULL,'2025-12-06 15:13:12','2025-12-06 15:13:12'),(73,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:45',NULL,NULL,'2025-12-06 15:14:45','2025-12-06 15:14:45'),(74,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:58',NULL,NULL,'2025-12-06 15:14:58','2025-12-06 15:14:58'),(75,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:15:43',NULL,NULL,'2025-12-06 15:15:43','2025-12-06 15:15:43'),(76,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:17:25',NULL,NULL,'2025-12-06 15:17:25','2025-12-06 15:17:25');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User access to specific modules (RLS)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_assignments`
--

LOCK TABLES `user_module_assignments` WRITE;
/*!40000 ALTER TABLE `user_module_assignments` DISABLE KEYS */;
INSERT INTO `user_module_assignments` VALUES (8,5,5,1,1,1,1,1,1,'2025-12-04 05:40:05'),(9,5,1,1,1,1,1,1,1,'2025-12-04 05:40:05'),(13,4,1,1,0,0,0,0,2,'2025-12-04 10:36:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Maps users to their roles';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,1,1,'2025-12-02 04:48:26',NULL),(17,5,6,1,'2025-12-04 05:40:05',NULL),(23,3,11,1,'2025-12-04 10:22:00',NULL),(24,4,11,2,'2025-12-04 10:36:02',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Active user sessions and JWT tokens';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjUxMzkyLCJleHAiOjE3NjQ3Mzc3OTJ9.8eItjqRmq74QpHqVdKW7gnARiINwtIk7AdIklVn0Vqc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1MTM5MiwiZXhwIjoxNzY1MjU2MTkyfQ.ufEWO5DKnviHfn_5JAJeITio-kXlcFyNM5T8-nYrAmg','2025-12-03 07:56:32','2025-12-09 07:56:32','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 04:56:32'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjU4NTc4LCJleHAiOjE3NjQ3NDQ5Nzh9.NU2UEFP6uKMhm2UB6hXDbERZ7ygH95FyitIsMEyQ7ts','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1ODU3OCwiZXhwIjoxNzY1MjYzMzc4fQ.9U7hyiUD0V3A-_osojMLekm1Mn-ERe8EbcqiH0cdOHg','2025-12-03 09:56:19','2025-12-09 09:56:19','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 06:56:18'),(3,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk1MzI1LCJleHAiOjE3NjQ3ODE3MjV9.K77PNvFj2grXCMyQu2vNN9McImWd9n5tYhQIH8oAzUI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDY5NTMyNSwiZXhwIjoxNzY1MzAwMTI1fQ.cDu2hGQZUq3PcxjCe9Z5lwmMUBVfUz9ZsbLJAvvcCyQ','2025-12-03 20:08:45','2025-12-09 20:08:45','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:08:45'),(4,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5NTQ0OSwiZXhwIjoxNzY0NzgxODQ5fQ.TEeqf_XauW_AI3Im20DnTGl5MxLGyK6Vu5wJvhw2e80','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDY5NTQ0OSwiZXhwIjoxNzY1MzAwMjQ5fQ.OlBTf-Y2k24EyUIonyaZcRtaOoSUbS3CRpDdXE5431o','2025-12-03 20:10:49','2025-12-09 20:10:49','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:10:49'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2NTAxLCJleHAiOjE3NjQ3ODI5MDF9.gHIFs92EKmcCaew7_O9C3tAqsbJcMm0nDz2N-XmPwW4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5NjUwMSwiZXhwIjoxNzY1MzAxMzAxfQ.e6FTg9_zCLSgYF1TZvOEsOgu8iHJw5oFcSFW2137Jy4','2025-12-03 20:28:21','2025-12-09 20:28:21','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:28:21'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2ODYyLCJleHAiOjE3NjQ3ODMyNjJ9.wEEUF_ruV2yCePb86Ig3qc0ni2-LqSQxziKfbZ75LQw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5Njg2MiwiZXhwIjoxNzY1MzAxNjYyfQ.-8wLh4wWbRyaU6R6BovOA_hF_psFLj9jkKXeSQJukJ0','2025-12-03 20:34:23','2025-12-09 20:34:23','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:34:22'),(7,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5Nzg3NywiZXhwIjoxNzY0Nzg0Mjc3fQ.FNXGr-d-V4y4aVudgvdfRT6VzLJneZ86mEOgFSXUDzw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDY5Nzg3NywiZXhwIjoxNzY1MzAyNjc3fQ.1imRSqhe93u_wsAEyhRvVAkPdfYUqqIyokB0yZX5ZVg','2025-12-03 20:51:17','2025-12-09 20:51:17','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:51:17'),(8,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk4MDkxLCJleHAiOjE3NjQ3ODQ0OTF9.s75IRbqe5RXabVzul70osDVvRQx90aUHRkVz8DdZpbg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5ODA5MSwiZXhwIjoxNzY1MzAyODkxfQ.6ALhwMQ_gjUM9CDKQoAf3_-iPHHFTXicbdbfN0fGw8M','2025-12-03 20:54:51','2025-12-09 20:54:51','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:54:51'),(9,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5OTYyMSwiZXhwIjoxNzY0Nzg2MDIxfQ.g393m5sFQ5z4ZdG9T3EvyWY94-xC_r3ALZ9l7SqHCeM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDY5OTYyMSwiZXhwIjoxNzY1MzA0NDIxfQ.aUdfdRZxMd9yk4PnW89O9XCqNWyiqjgV94_fqW2nXGo','2025-12-03 21:20:21','2025-12-09 21:20:21','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:20:21'),(10,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk5NjMzLCJleHAiOjE3NjQ3ODYwMzN9.mzf64RKeOmUwQUwhKv7fNmyS6q5ztFQN4q_OZI7PwSU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDY5OTYzMywiZXhwIjoxNzY1MzA0NDMzfQ.ysm3zcgtqpNYakYTADj8Zn_XENaSpHskuDWFVORCiB0','2025-12-03 21:20:34','2025-12-09 21:20:34','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:20:33'),(11,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzA5LCJleHAiOjE3NjQ3ODY3MDl9.EZdzmbeBuEnP6RCpdRAnMJ5XaxHIP7QRr-Peeop1cpY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMwOSwiZXhwIjoxNzY1MzA1MTA5fQ.BIYr5J7_PPLXI2legBPkTu77Ws7NZLSnhuz1VQ0pqt0','2025-12-03 21:31:49','2025-12-09 21:31:49','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:31:49'),(12,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzMyLCJleHAiOjE3NjQ3ODY3MzJ9.XNMBonUIViBQ3jx57yoySRfgBtGhMICOC8y6JjJORXk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMzMiwiZXhwIjoxNzY1MzA1MTMyfQ.hqVLiEGYObuS4zIb_gBJmaZCNOZFGYBHiSCCw1tXxM8','2025-12-03 21:32:13','2025-12-09 21:32:13','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-02 18:32:12'),(13,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTUwLCJleHAiOjE3NjQ4NzA1NTB9.iQncsT_Jpz9BQSzyj1iywMGJgUnhwUOuFoavTywpEYQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE1MCwiZXhwIjoxNzY1Mzg4OTUwfQ.onP5Kx5_Ka6eBPkm91ihzXhKX3KD6P7ubj3d1ielaec','2025-12-04 20:49:10','2025-12-10 20:49:10','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 17:49:10'),(14,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTkyLCJleHAiOjE3NjQ4NzA1OTJ9.PxCWXzB4xF5u-sLDdp_VFRL5rP_TPHN3rWygXmqYHfk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE5MiwiZXhwIjoxNzY1Mzg4OTkyfQ.4khF1JeH0zjs9KQ3hnVD2OkxxD4HIwCkzihYoizkd7M','2025-12-04 20:49:52','2025-12-10 20:49:52','192.168.100.5','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-03 17:49:52'),(15,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NTM2MywiZXhwIjoxNzY0ODcxNzYzfQ.I-30Pd3fS4JoitLTPba2mig9hJ7czFflVPu4xvZtgko','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDc4NTM2MywiZXhwIjoxNzY1MzkwMTYzfQ.niIa2Gv9DvNzr_HilvdnUKGvA3-Iq2ZFxxXT2pkXxTQ','2025-12-04 21:09:23','2025-12-10 21:09:23','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 18:09:23'),(16,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NTQyNiwiZXhwIjoxNzY0ODcxODI2fQ.0kPNrz_5CURnnfJ_3jovZrFjOWIsgUDz3Fic0SNaY7E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4NTQyNiwiZXhwIjoxNzY1MzkwMjI2fQ.N9wpazRPfTQIT-h8H9-vYyq-c2nZ2oQUdUjHTfL0Trw','2025-12-04 21:10:26','2025-12-10 21:10:26','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:10:26'),(17,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg1NDY1LCJleHAiOjE3NjQ4NzE4NjV9.UDrW0wp8DvUPt3ELwdsacEpb8VpVWd8wOKuU77xVJhE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4NTQ2NSwiZXhwIjoxNzY1MzkwMjY1fQ.FHDIwBrgbfyCaZaAtsXJr_2Q9xmsDkIhDugGZZbHZxg','2025-12-04 21:11:06','2025-12-10 21:11:06','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:11:05'),(18,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NzQ4MCwiZXhwIjoxNzY0ODczODgwfQ.8Z-xfKq4SXhhORsgI4rb0vdMbomTcjitFPCXoyel1xU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4NzQ4MCwiZXhwIjoxNzY1MzkyMjgwfQ.1cdQuy8r5EURD4gDIvOhDXBdduLDmI93JzYE2VnTdFY','2025-12-04 21:44:40','2025-12-10 21:44:40','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:44:40'),(19,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg3NTAyLCJleHAiOjE3NjQ4NzM5MDJ9.AGs5B9iRFqgvzLT73l4THqQuqtnm-yoPtqrWiRE6KYI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4NzUwMiwiZXhwIjoxNzY1MzkyMzAyfQ.3xO7MFSbMVBruvEw5gPTRIHVWW1N3kOl2LUXLoi4Y_c','2025-12-04 21:45:03','2025-12-10 21:45:03','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:45:02'),(20,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4ODUyMSwiZXhwIjoxNzY0ODc0OTIxfQ.Zv8eO85iGAbTU09itT54kn_SHl_nWy_ajreEvBvwTjg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4ODUyMSwiZXhwIjoxNzY1MzkzMzIxfQ.Yqt-74GjkWVZYWL3niUKlscSEoydROqR3iaJU911qKA','2025-12-04 22:02:02','2025-12-10 22:02:02','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 19:02:01'),(21,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg4NTQ3LCJleHAiOjE3NjQ4NzQ5NDd9.p-xF4Kw5PyKhCqp26ok0VZrhwI6I3bT5kcBsbLdUeio','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4ODU0NywiZXhwIjoxNzY1MzkzMzQ3fQ.2_iO5WIa_tnZZ70r2KYhdggXxO7eIpLGYfqwDoa6CpM','2025-12-04 22:02:28','2025-12-10 22:02:28','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 19:02:27'),(22,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODg4NTgsImV4cCI6MTc2NDg3NTI1OH0.yT16yGoyyof1atyFZTPNfmwxfwpTETqJrVfk3Qmo-n8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4ODg1OCwiZXhwIjoxNzY1MzkzNjU4fQ.mLPAItBxyiTOewKbuAXros5OcMQfiVrrM12BipsG5Mc','2025-12-04 22:07:38','2025-12-10 22:07:38','192.168.100.5','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:07:38'),(23,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkxMjcsImV4cCI6MTc2NDg3NTUyN30.4SyfqOcbo7KmAZyxiV97V0uyLshSq4quzNs7v4ROWyM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTEyNywiZXhwIjoxNzY1MzkzOTI3fQ.ZuQoH5DKnRBcv6EWSNSgh8gzt6SDbyAqswECEmUgsfg','2025-12-04 22:12:07','2025-12-10 22:12:07','192.168.100.5','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:07'),(24,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkxNTAsImV4cCI6MTc2NDg3NTU1MH0.zlr9lm51_gFf20r92CqBg-gOaazbbcHch8UH66EHiCw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTE1MCwiZXhwIjoxNzY1MzkzOTUwfQ.oJP0U0un7eqHvaRGmztnoIb105u8I6oBjg6U_dOucrM','2025-12-04 22:12:30','2025-12-10 22:12:30','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:30'),(25,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg5MTY5LCJleHAiOjE3NjQ4NzU1Njl9.-fWNFLxSBrNa1XnahbuK3o8xR5G04p1jJfGYJOGHYmA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4OTE2OSwiZXhwIjoxNzY1MzkzOTY5fQ.0PG86TJvmL01N2aQUqaVQYo2r00JYZPC-wLSvNN8Jxw','2025-12-04 22:12:50','2025-12-10 22:12:50','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:49'),(26,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkyMjYsImV4cCI6MTc2NDg3NTYyNn0.OnZGnPebsWrsocf2vRcAONpD5eCinDWXFnVsPaSBl2A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTIyNiwiZXhwIjoxNzY1Mzk0MDI2fQ.3mTOWrlqkSS9SEJtuCC9HdFsBJOPI88fFgDVPZtJ7Yk','2025-12-04 22:13:47','2025-12-10 22:13:47','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:13:46'),(27,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg5MjQzLCJleHAiOjE3NjQ4NzU2NDN9.RMwO0uHkzSnmytE1EAXqzcrncslp7zZFT7uTnBMzMqY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4OTI0MywiZXhwIjoxNzY1Mzk0MDQzfQ.jXL7GIzgQd6MUjZJb6pyn3XRFmogDh3GdTqEJExoJ24','2025-12-04 22:14:04','2025-12-10 22:14:04','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:14:03'),(28,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjoxLCJpYXQiOjE3NjQ3ODkyNzQsImV4cCI6MTc2NDg3NTY3NH0.MK4YI01AMO33C74OHWAGNXY02Sbq8mCPM00VgUozuUE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTI3NCwiZXhwIjoxNzY1Mzk0MDc0fQ.VZ_OzRTE6CypUq-n6RXVNSHxu-cdsO9Y_q2KY6_Zrgc','2025-12-04 22:14:35','2025-12-10 22:14:35','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-03 19:14:34'),(29,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0NDY5LCJleHAiOjE3NjQ5MTA4Njl9.Y9IX2OJy8LSYGekVMAvWlSBYPWdJxw3tG6bFJ_kyKUU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDQ2OSwiZXhwIjoxNzY1NDI5MjY5fQ.ouaKq1e8HfSLou8YhM3IMnqBuFxJUCI5YvBMcpC8_XY','2025-12-05 08:01:10','2025-12-11 08:01:10','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:01:09'),(30,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgyNDQ4NSwiZXhwIjoxNzY0OTEwODg1fQ.woveUYSiqMEaDlBIeSJAo8DT9FZCeMsp4tmb3Lh3g9g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDgyNDQ4NSwiZXhwIjoxNzY1NDI5Mjg1fQ.1-BF4eIv7x23dUpRFk68vswz57j03KeyBMX7SKGVRWk','2025-12-05 08:01:25','2025-12-11 08:01:25','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:01:25'),(31,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0ODA3LCJleHAiOjE3NjQ5MTEyMDd9.G0ggBt6KNdHjT_JPVN2heoBK2spQJfD_a3weGtYtHD4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDgwNywiZXhwIjoxNzY1NDI5NjA3fQ.kLoq3kU9VWBJdSWWaHsW1ZCqBweFdXnQk9GeVJVS1k4','2025-12-05 08:06:48','2025-12-11 08:06:48','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:06:47'),(32,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjQ5MjUsImV4cCI6MTc2NDkxMTMyNX0.xj0OnOR3gQMIyyJo_r0grQ-LQdPxJV3YSKpXs1B0vtE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNDkyNSwiZXhwIjoxNzY1NDI5NzI1fQ.VDDepYpPlQZloHGuEPiYwZUGPfuduGbgK9h8GgUw-8g','2025-12-05 08:08:46','2025-12-11 08:08:46','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:08:45'),(33,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1NjIzLCJleHAiOjE3NjQ5MTIwMjN9.8gfkDaS0rWITPufMJfQ6Q_RxnfSzYY93O_waWEEN0wo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTYyMywiZXhwIjoxNzY1NDMwNDIzfQ.olK4n72lHg6fUZKKQeNi-QClMYTdmd7iSbNBNoMt8s4','2025-12-05 08:20:24','2025-12-11 08:20:24','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:20:23'),(34,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjU3MzUsImV4cCI6MTc2NDkxMjEzNX0.3pfeSX1VJxqZVEuicTMtE432Qum_tgKukgLqjl7wtiA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNTczNSwiZXhwIjoxNzY1NDMwNTM1fQ.ggjOK5YG7uHf6CtOVv843Rye1vTgO4mz5hY4U_RVHNE','2025-12-05 08:22:16','2025-12-11 08:22:16','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 05:22:15'),(35,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjU5MjQsImV4cCI6MTc2NDkxMjMyNH0._og8ewI0783V2Vjlzhr9KNjhEnLw9KXqOhLwg8oOH_A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNTkyNCwiZXhwIjoxNzY1NDMwNzI0fQ.r8z9WgQwgEtc0XEjZr-Q0a0G8DLbXUqXX1qooi9W19I','2025-12-05 08:25:24','2025-12-11 08:25:24','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 05:25:24'),(36,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1OTY0LCJleHAiOjE3NjQ5MTIzNjR9.5Q2Co6-wJHfH5OeliCR2wavhTu99VfYt1MDTsAjyR_Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTk2NCwiZXhwIjoxNzY1NDMwNzY0fQ.yJEGLj4VuvY7-WD2Ub5I5FSNJU12TeRtVGBh_K-Vx8w','2025-12-05 08:26:05','2025-12-11 08:26:05','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:26:04'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI2Mzc4LCJleHAiOjE3NjQ5MTI3Nzh9.MsOF8Br3sql0pgfcH4F0tIVMbiUNjwF-rM5LT58GagI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNjM3OCwiZXhwIjoxNzY1NDMxMTc4fQ.gjdDFGgMecsZ3XVPpMZF0GzVeX1S72WanCgcZihYw80','2025-12-05 08:32:58','2025-12-11 08:32:58','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 05:32:58'),(38,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjY3NDAsImV4cCI6MTc2NDkxMzE0MH0.pRxM6r6juR_q78dqxjM2bvQVk83pbJaa0mDln6rlJrA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNjc0MCwiZXhwIjoxNzY1NDMxNTQwfQ.FkdPXOXXynTA2UpZl8WHGZMnndaD4DIqdiAhIy5pIMw','2025-12-05 08:39:01','2025-12-11 08:39:01','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:39:00'),(39,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjY4NTEsImV4cCI6MTc2NDkxMzI1MX0.IlsGSTU2cbYAlAd2MxHm1E2CPsWxvJJYLBwwxyze8RU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNjg1MSwiZXhwIjoxNzY1NDMxNjUxfQ.Jm9TKr2oLhO80GxkDtB_N4lsyskEN1JUh5cDxlXEMKo','2025-12-05 08:40:51','2025-12-11 08:40:51','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:40:51'),(40,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjgxMzgsImV4cCI6MTc2NDkxNDUzOH0.DHB8dytl6atjItAi_pLUChhP53nK69nrxEZmWgTKEm4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyODEzOCwiZXhwIjoxNzY1NDMyOTM4fQ.cMTCKDJnTn2bJP8HX8eqvNUOZS4R1Eo5y_eluZrBEdE','2025-12-05 09:02:18','2025-12-11 09:02:18','192.168.87.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 06:02:18'),(41,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4Mjk4NzIsImV4cCI6MTc2NDkxNjI3Mn0.SKyzWdtytZUgXqdHVQB0wVQLZ9S5FbjCsTwWlu8RkNY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyOTg3MiwiZXhwIjoxNzY1NDM0NjcyfQ.og_p9thBi44C7XONsH5yVVt-PVG8ioKi6hphQ9CsfgM','2025-12-05 09:31:13','2025-12-11 09:31:13','192.168.87.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 06:31:12'),(42,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MzgxMzYsImV4cCI6MTc2NDkyNDUzNn0.uw2WWwkNVEZtiRq3QIolTeR4mpLX9DJUyBI9ApmkkLQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgzODEzNiwiZXhwIjoxNzY1NDQyOTM2fQ.2QbQvB2mUZSbcK5eb_RoK3XbF2nNwX6ovXy-M6incYU','2025-12-05 11:48:57','2025-12-11 11:48:57','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:48:56'),(43,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4MzQzLCJleHAiOjE3NjQ5MjQ3NDN9.PErMKSQUFH52b8DT72GEVpDtLG5uNVJ4DWE_Q1VWNGQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODM0MywiZXhwIjoxNzY1NDQzMTQzfQ.ghQDil7aPcfCkczR9F78dErrI_FN5hBxFJgKHlvzTno','2025-12-05 11:52:24','2025-12-11 11:52:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:52:23'),(44,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MzgzNTMsImV4cCI6MTc2NDkyNDc1M30.4gNMWIIjouQXX19cHD5oJ1Ai7Mg8-STn1n_zY_7ZzQY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgzODM1MywiZXhwIjoxNzY1NDQzMTUzfQ.chzvwzA6YaErw77wumm3jpL_8JK5zuOGbviIWDM-CYo','2025-12-05 11:52:33','2025-12-11 11:52:33','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:52:33'),(45,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODM5NCwiZXhwIjoxNzY0OTI0Nzk0fQ._LrMPW9FBqcHBHeDQ7tDZ_QS7NO7g2A7Kv57a-PcUXw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODM5NCwiZXhwIjoxNzY1NDQzMTk0fQ.x2ZM4imTOC5aGHTMRvUWvRlr9_4uuxhHkyl9OtKRkwE','2025-12-05 11:53:14','2025-12-11 11:53:14','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:53:14'),(46,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4NjUzLCJleHAiOjE3NjQ5MjUwNTN9.QF2QWN-q-_2YuB5o6y7IPzzy94IKOFai-kZ8X8Ujvo4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODY1MywiZXhwIjoxNzY1NDQzNDUzfQ.vwjQgjoBWRDMzzf7mAiGCbKpYnVeGyLMwlH11og6YVs','2025-12-05 11:57:34','2025-12-11 11:57:34','192.168.87.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 08:57:33'),(47,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODczNCwiZXhwIjoxNzY0OTI1MTM0fQ.9zcMZxh0gRoo1XTzA8vZPNHXl4-B8tsUntWH-E0aCPA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODczNCwiZXhwIjoxNzY1NDQzNTM0fQ.Wg9DueiaQBd0qrVnkSN7c4-8J0JojIpVf5QEamaoPLE','2025-12-05 11:58:55','2025-12-11 11:58:55','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:58:54'),(48,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODkzOCwiZXhwIjoxNzY0OTI1MzM4fQ.iQqyiqNQ679OVH4MURCeJhqsZvX7QQt3srkDSy1AFoQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODkzOCwiZXhwIjoxNzY1NDQzNzM4fQ.v5H8pYkQt46QmwEzHuXPY_jOVfT9H1AT8HgkFjWbPmY','2025-12-05 12:02:18','2025-12-11 12:02:18','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:02:18'),(49,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM5MDA0LCJleHAiOjE3NjQ5MjU0MDR9.prkWobEqg6d-du5S6M-p2sPxZybGlZMzv4d9GmI02BE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzOTAwNCwiZXhwIjoxNzY1NDQzODA0fQ.NoljRbknGcqgdUk4FdaprGZ-cSLJepoFQILmkUPYIDQ','2025-12-05 12:03:24','2025-12-11 12:03:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:03:24'),(50,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTQ3MSwiZXhwIjoxNzY0OTI1ODcxfQ.92HTY4SNcfB5IS3G8CoNVmXMDdBxHwRCpP7WQWZVxok','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTQ3MSwiZXhwIjoxNzY1NDQ0MjcxfQ.0VpQ3mlX1ZvCPpwxPs30TdcXgZYzPD8o_diX7RAx6GE','2025-12-05 12:11:11','2025-12-11 12:11:11','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:11:11'),(51,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTU3OSwiZXhwIjoxNzY0OTI1OTc5fQ.8ugF-AqY9L7IuBlcU-1AJCO8WG8yy7I0FoHJpwzvGnI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTU3OSwiZXhwIjoxNzY1NDQ0Mzc5fQ.S_ANn5SY1rrJEDbauIMZtCTBgGkxZmYkA4DkwNVwhVY','2025-12-05 12:12:59','2025-12-11 12:12:59','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:12:59'),(52,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTU5NSwiZXhwIjoxNzY0OTI1OTk1fQ.M3sobwTQxPfgfGj9mIzinYj7LLUm_vmPt-_4a3FAnj0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTU5NSwiZXhwIjoxNzY1NDQ0Mzk1fQ.U6uuB6TF2adVhQkp2U-aumIwtqbAbV28aiUdPDTX9L8','2025-12-05 12:13:16','2025-12-11 12:13:16','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:13:15'),(53,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTY1MSwiZXhwIjoxNzY0OTI2MDUxfQ.bjGJf29YtF6-P_pxDDJZCsp7WH2CgMLZF6Jq8HLZ73Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTY1MSwiZXhwIjoxNzY1NDQ0NDUxfQ.UIz_U7LnQaT7_lM-9IeMl9nd1r7z2JeDsRHPEFM2cZA','2025-12-05 12:14:12','2025-12-11 12:14:12','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:14:11'),(54,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDAxMDYsImV4cCI6MTc2NDkyNjUwNn0.rjAhObWUeEKwPAzYSt1QmXTA4Ko5p15uqpK7rAT-ezU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0MDEwNiwiZXhwIjoxNzY1NDQ0OTA2fQ.QK7LsdpTp4b6DZPkhcu4eXz1DAdZ7MiZXEkAwWYWB1w','2025-12-05 12:21:46','2025-12-11 12:21:46','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:21:46'),(55,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MTMwMCwiZXhwIjoxNzY0OTI3NzAwfQ.7tQzYJyDicIhuUoG059sxodkXNq6RKKQ0GV83Ij8L44','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDg0MTMwMCwiZXhwIjoxNzY1NDQ2MTAwfQ.ZWY4E8lFid2tXXS862pS6a2VX7LfuGz6NZdbrTNb_os','2025-12-05 12:41:40','2025-12-11 12:41:40','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:41:40'),(56,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDEzODEsImV4cCI6MTc2NDkyNzc4MX0.YWvyg3pSkEyaA4SzC4pg9mXf1zhd29_TfttBzHuJU-c','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0MTM4MSwiZXhwIjoxNzY1NDQ2MTgxfQ.1iOtt8_c1P2-pDdzrfvky3h2gIzalHOrBNhMLnvwLJc','2025-12-05 12:43:02','2025-12-11 12:43:02','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:43:01'),(57,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MTQxOSwiZXhwIjoxNzY0OTI3ODE5fQ.EScojCYVMMobue9c7M9W_sCOYUk3vFoQ0g9jphy95Kw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MTQxOSwiZXhwIjoxNzY1NDQ2MjE5fQ.VQt77HIKIFlCNorVxPHN4bnb9RZ81eyCnIB6te0Vcio','2025-12-05 12:43:40','2025-12-11 12:43:40','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 09:43:39'),(58,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzU0OCwiZXhwIjoxNzY0OTI5OTQ4fQ.LX23N3P-Q2JuOGBnJaJ--0ulxgAoQhhawHWeC-Cla6Q','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzU0OCwiZXhwIjoxNzY1NDQ4MzQ4fQ.42LK6RnA2K9fgqgUvznhROfPdoYRTssHHZeXiELBzTg','2025-12-05 13:19:09','2025-12-11 13:19:09','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:19:08'),(59,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzYyNywiZXhwIjoxNzY0OTMwMDI3fQ.DEtBAOebELdtA7FN4Da3kOX3JRxLL99vanTff9Tvrxw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzYyNywiZXhwIjoxNzY1NDQ4NDI3fQ.Hp7ycr1Zp5VPjc6ZFwKFVyb8KJ5qBZ-Da3wM6DPuins','2025-12-05 13:20:28','2025-12-11 13:20:28','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:20:27'),(60,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQzNjkzLCJleHAiOjE3NjQ5MzAwOTN9.rf3eYfT0qddCQsmWSvu7W83rDNF_8VvJEGIltwDte5o','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg0MzY5MywiZXhwIjoxNzY1NDQ4NDkzfQ.nKdzBuYwOVFR3DxHiF93HZOjVl4UUcoUSNRz2KckkdU','2025-12-05 13:21:34','2025-12-11 13:21:34','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:21:33'),(61,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzczMCwiZXhwIjoxNzY0OTMwMTMwfQ.NzbdkeSAY0mKJbj0VKcaVm72Sis3dkmz9hkbAelifsM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzczMCwiZXhwIjoxNzY1NDQ4NTMwfQ.1B-8CQlDJjcfAgMO2lLN2GRN_Aoh04YPjHfLffLJuy8','2025-12-05 13:22:11','2025-12-11 13:22:11','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:22:10'),(62,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQ0NDYyLCJleHAiOjE3NjQ5MzA4NjJ9.67vLMN_K7KcWGQKZXpBRBVzMGzsdp0eJzUABnSxAZBY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDg0NDQ2MiwiZXhwIjoxNzY1NDQ5MjYyfQ.pbu4hPxU8oLN8mkVq3NANbjUsw43KoZhOCoXpJVKAD4','2025-12-05 13:34:22','2025-12-11 13:34:22','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:34:22'),(63,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDQ0ODEsImV4cCI6MTc2NDkzMDg4MX0.YJ1IKbFwdY3SCaaJOsHjPRPnnqDiSc11SPQV7TZOYCs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0NDQ4MSwiZXhwIjoxNzY1NDQ5MjgxfQ.fWg1FEujJdRrE1wRER0JDcAHmhZNclmnmaiz2gGUqB4','2025-12-05 13:34:42','2025-12-11 13:34:42','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:34:41'),(64,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQ0NTE2LCJleHAiOjE3NjQ5MzA5MTZ9.Y5sf-CKmIM8_56318SY-pYMUG-NivrbgIEYECjY9ZDs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDg0NDUxNiwiZXhwIjoxNzY1NDQ5MzE2fQ.xRdDSdQ7dypK1fo2CDFRs1t9nLgwhsOGPvMdKzhR00k','2025-12-05 13:35:17','2025-12-11 13:35:17','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:35:16'),(65,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0NDU4NCwiZXhwIjoxNzY0OTMwOTg0fQ.GweubpFD9EiR6Ua2Z3q7WKIFHhcus_CVGwgxttEgYp8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDg0NDU4NCwiZXhwIjoxNzY1NDQ5Mzg0fQ.E9hav2D3USllVjWngkYvqvdXWa4348A02tRRgu3xF84','2025-12-05 13:36:24','2025-12-11 13:36:24','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 10:36:24'),(66,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODcxOTc0LCJleHAiOjE3NjQ5NTgzNzR9.GqKLqn__-3no-DrOafeomyHCi0xpfIhFHXJMQyK5YCs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3MTk3NCwiZXhwIjoxNzY1NDc2Nzc0fQ.06lShfWu1F7SwBiKnIwnxXIP65Lyn5G8rvBKRUXuS6M','2025-12-05 21:12:55','2025-12-11 21:12:55','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 18:12:54'),(67,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODc1Mzg0LCJleHAiOjE3NjQ5NjE3ODR9.S-Lmg1ubxyjbuU0gpKcKhQrOtIraYfal8cjUzPgzlTU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3NTM4NCwiZXhwIjoxNzY1NDgwMTg0fQ.fnvK-HthE8cC-Jj3kSa8FGyRVGz0m88QOZMHZosrmAY','2025-12-05 22:09:44','2025-12-11 22:09:44','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 19:09:44'),(68,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NTAwMTQ4MywiZXhwIjoxNzY1MDg3ODgzfQ.UxUZpQKO-dhHORgZiTjMXwVB-PIwmldh3JaQ8ibRWjs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NTAwMTQ4MywiZXhwIjoxNzY1NjA2MjgzfQ.FKZXDMCPxfbFxH6XPPlRFn5-LK7giwBW5JgaA6cQZPA','2025-12-07 09:11:24','2025-12-13 09:11:24','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 06:11:23'),(69,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDAyMjg0LCJleHAiOjE3NjUwODg2ODR9.vFCCMcvm9cuMog5o3ABDPlo2SiTWicV5Rod5wLIzyhU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwMjI4NCwiZXhwIjoxNzY1NjA3MDg0fQ.WZxRJBNi8sj9S4ihdkgW8U2tNqdmPVwFg2UWBupwro4','2025-12-07 09:24:45','2025-12-13 09:24:45','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 06:24:44'),(70,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMDQ1NTIsImV4cCI6MTc2NTA5MDk1Mn0.ojw_u2rbnhmqOgB0fAKy6pM_3Ig8cKfNQE83GQNYJcE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAwNDU1MiwiZXhwIjoxNzY1NjA5MzUyfQ.1bhiE6OZSEGGc8iqADySCbQV8TXBXq5_EalVVg6sGq8','2025-12-07 10:02:33','2025-12-13 10:02:33','192.168.100.5','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-06 07:02:32'),(71,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDA2MDM3LCJleHAiOjE3NjUwOTI0Mzd9.d4Lju_ZCksXqce9G2oDzhmeiBNlacxabpynwGv4Ha-g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwNjAzNywiZXhwIjoxNzY1NjEwODM3fQ.FndwBYGN1mjRI6ClcZAhxmcRqvNzfNn_bxzlFquq3A8','2025-12-07 10:27:17','2025-12-13 10:27:17','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-06 07:27:17'),(72,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDMzMjU0LCJleHAiOjE3NjUxMTk2NTR9.Cml4S47XCHaw4JSxqf5N82ig8Ss4eO40ligObNxhPTA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzMzI1NCwiZXhwIjoxNzY1NjM4MDU0fQ.JmOmXDslLMvXiuaKmfNArGzHrNsM5MuomOqFgXQBY7M','2025-12-07 18:00:55','2025-12-13 18:00:55','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:00:54'),(73,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMzM2NzYsImV4cCI6MTc2NTEyMDA3Nn0.zT6pTmcLNRb1V3oP5KVUHBmSRcjuxG35BoP6hnAxqKY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAzMzY3NiwiZXhwIjoxNzY1NjM4NDc2fQ.vlH0S6M2FQ3y50m-Ct7fx1PreKnzSO0N-brFGBz3GDY','2025-12-07 18:07:56','2025-12-13 18:07:56','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:07:56'),(74,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDMzNzIyLCJleHAiOjE3NjUxMjAxMjJ9.YpHxGhHzXZOPZNteNscoNegu6wGy4axnnuo1_d4riUU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NTAzMzcyMiwiZXhwIjoxNzY1NjM4NTIyfQ.tuQ28jlFIQvgFYipvQ6busTXNfLHI_FAUSEbvXf9vm4','2025-12-07 18:08:42','2025-12-13 18:08:42','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:08:42'),(75,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM0MjkyLCJleHAiOjE3NjUxMjA2OTJ9.qV1xSxzQ11TlnXtKb4hyhSfJktdhRlElf80CYhehEc8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNDI5MiwiZXhwIjoxNzY1NjM5MDkyfQ.eCz97I8iNEFprkfUq_YzxHMheV3ae5I-3-fZkRfGNso','2025-12-07 18:18:12','2025-12-13 18:18:12','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:18:12'),(76,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMzUzNDcsImV4cCI6MTc2NTEyMTc0N30.Ma37oosGcZTUReSKx5YhinTHioVyKwe8nMiAVS_rrpM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAzNTM0NywiZXhwIjoxNzY1NjQwMTQ3fQ.zEa4HR--rl1lmrMncPBMAEFOqIKwSpqKG5Ci9Xzz22U','2025-12-07 18:35:48','2025-12-13 18:35:48','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:35:47'),(77,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM1Nzg4LCJleHAiOjE3NjUxMjIxODh9.HJwlQ90sh6tywLeWQYReptIR3i_tGHzjP_eIrjmcyaY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNTc4OCwiZXhwIjoxNzY1NjQwNTg4fQ.QNw38C_ZQXtfwcPc7LuiSqP1zkCPoHAtI6vaSOBtvRk','2025-12-07 18:43:09','2025-12-13 18:43:09','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:43:08'),(78,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM4MDYyLCJleHAiOjE3NjUxMjQ0NjJ9.3TSPfodr_jJi3yEr3O_lhnyE8xcQDLAs0aVKxVrpO-k','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzODA2MiwiZXhwIjoxNzY1NjQyODYyfQ.noSerFPWfI211ON8clwTFTN3Ga4bo3zk5F2W9kHfeEg','2025-12-07 19:21:02','2025-12-13 19:21:02','192.168.86.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 16:21:02'),(79,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjUxODgwLCJleHAiOjE3NjUzMzgyODB9.2qICfS7BqrVcAzkgPIjPx0i9hgZTkpD6qgrFRl1pxWg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1MTg4MCwiZXhwIjoxNzY1ODU2NjgwfQ.CYAZPMwKfB2endhwKHjYaA5EOHU5r1rfD527SX2MEFI','2025-12-10 06:44:40','2025-12-16 06:44:40','192.168.205.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-09 03:44:40');
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
INSERT INTO `users` VALUES (1,NULL,'admin','admin@gmail.com','$2a$10$KdsBLq.abN5f1C6xGHoz9OAJ6SGL4D2IWrRYcZe.rhI3JyY.4vkfS','System Administrator',NULL,'admin',NULL,1,1,'pending',NULL,'2025-12-09 06:44:40','2025-12-02 04:48:26','2025-12-09 03:44:40',NULL),(2,NULL,'director','director@gmail.com','$2a$10$cW7xFdTMcMZq2OBLZ0dipuFS0Yw..qH15IWRQkCyCaCTZqkpF412u','me director',NULL,'field_officer',NULL,1,1,'pending',NULL,'2025-12-06 18:08:42','2025-12-02 14:08:57','2025-12-06 15:08:42',NULL),(3,NULL,'Data','data@gmail.com','$2a$10$vNqTLFPEfzfpbsJ.SjdtiuDk5erJGYv7H4gD9LxKpV2zmpWbEsacS','Data Entry Clerk',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-04 13:22:10','2025-12-02 17:10:24','2025-12-04 10:22:10',NULL),(4,NULL,'role','base@gmail.com','$2a$10$mfdo/ED13yKaJPiArJWESuzJWQJ5vZRTukl5vclC1sbSuwWHBc2CW','base',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-06 09:11:23','2025-12-02 17:50:55','2025-12-06 06:11:23',NULL),(5,NULL,'Linnet','linnet@gmail.com','$2a$10$2UmuVkjIH6nXuZhp1CQb7.p5FZlBjiKqNNtURNai3hXt4hY3l5LsC','Linnet Linnet',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-06 18:35:47','2025-12-03 18:48:51','2025-12-06 15:35:47',NULL);
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

-- Dump completed on 2025-12-09  7:19:24
