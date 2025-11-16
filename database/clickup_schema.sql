-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: clickup_sync
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
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `task_id` bigint DEFAULT NULL,
  `attachment_type` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` text,
  `comment_id` bigint DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `filename` varchar(500) NOT NULL,
  `original_filename` varchar(500) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_url` varchar(1000) DEFAULT NULL,
  `local_file_path` varchar(1000) DEFAULT NULL,
  `thumbnail_url` varchar(1000) DEFAULT NULL,
  `is_hidden` tinyint(1) DEFAULT '0',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attachments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attachments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (30,'885fcfd7-b630-4d6a-8c07-03a137221741.txt',4,'1','clickup_token.txt','https://t90121198535.p.clickup-attachments.com/t90121198535/885fcfd7-b630-4d6a-8c07-03a137221741/clickup_token.txt',NULL,1,'clickup_token.txt',NULL,119,NULL,'https://t90121198535.p.clickup-attachments.com/t90121198535/885fcfd7-b630-4d6a-8c07-03a137221741/clickup_token.txt',NULL,NULL,0,'2025-09-10 16:42:42','2025-09-15 07:09:43',NULL,'synced','2025-09-15 07:09:43');
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `change_history`
--

DROP TABLE IF EXISTS `change_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `change_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `entity_type` enum('team','space','folder','list','task','user','comment','attachment','time_entry') NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `clickup_id` varchar(50) DEFAULT NULL,
  `change_type` enum('create','update','delete','restore') NOT NULL,
  `changed_by` int DEFAULT NULL,
  `change_source` enum('local','clickup','webhook','sync') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `field_changes` json DEFAULT NULL,
  `change_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sync_operation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `changed_by` (`changed_by`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_change_timestamp` (`change_timestamp`),
  KEY `idx_change_source` (`change_source`),
  KEY `idx_sync_operation_id` (`sync_operation_id`),
  CONSTRAINT `change_history_ibfk_1` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `change_history_ibfk_2` FOREIGN KEY (`sync_operation_id`) REFERENCES `sync_operations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `change_history`
--

LOCK TABLES `change_history` WRITE;
/*!40000 ALTER TABLE `change_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `change_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channels`
--

DROP TABLE IF EXISTS `channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `team_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('chat','email','slack','webhook','other') DEFAULT 'chat',
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `channels_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channels`
--

LOCK TABLES `channels` WRITE;
/*!40000 ALTER TABLE `channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charts`
--

DROP TABLE IF EXISTS `charts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `team_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `chart_type` enum('bar','line','pie','gauge','table','other') DEFAULT 'other',
  `config` json DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `charts_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charts`
--

LOCK TABLES `charts` WRITE;
/*!40000 ALTER TABLE `charts` DISABLE KEYS */;
/*!40000 ALTER TABLE `charts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklist_items`
--

DROP TABLE IF EXISTS `checklist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklist_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `checklist_id` bigint NOT NULL,
  `name` varchar(500) NOT NULL,
  `order_index` int DEFAULT '0',
  `is_resolved` tinyint(1) DEFAULT '0',
  `assignee_id` int DEFAULT NULL,
  `resolved_by` int DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_checklist_id` (`checklist_id`),
  KEY `idx_assignee_id` (`assignee_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `checklist_items_ibfk_1` FOREIGN KEY (`checklist_id`) REFERENCES `checklists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `checklist_items_ibfk_2` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `checklist_items_ibfk_3` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklist_items`
--

LOCK TABLES `checklist_items` WRITE;
/*!40000 ALTER TABLE `checklist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `task_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `order_index` int DEFAULT '0',
  `is_resolved` tinyint(1) DEFAULT '0',
  `resolved_by` int DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `checklists_ibfk_2` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `task_id` bigint NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `user_id` int NOT NULL,
  `comment_text` text NOT NULL,
  `is_resolved` tinyint(1) DEFAULT '0',
  `resolved_by` int DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_parent_comment_id` (`parent_comment_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_comments_task_created` (`task_id`,`clickup_created_at`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'90120153714103',16,NULL,2,'as soon as possible\n',0,NULL,NULL,'2025-09-09 10:24:31','2025-09-15 10:55:18','2025-09-08 19:36:23','2025-09-08 19:36:23','synced','2025-09-15 10:55:18'),(2,'90120153714091',16,NULL,2,'need adjustment \n',0,NULL,NULL,'2025-09-09 10:24:31','2025-09-15 10:55:18','2025-09-08 19:36:08','2025-09-08 19:36:08','synced','2025-09-15 10:55:18'),(3,'90120153868689',5,NULL,2,'Priotize this today\n',0,NULL,NULL,'2025-09-09 10:38:20','2025-09-15 10:55:07','2025-09-09 10:37:20','2025-09-09 10:37:20','synced','2025-09-15 10:55:07'),(4,'90120153868536',6,NULL,2,'take care\n',0,NULL,NULL,'2025-09-09 10:38:21','2025-09-15 10:55:08','2025-09-09 10:37:01','2025-09-09 10:37:01','synced','2025-09-15 10:55:08'),(5,'90120153868460',6,NULL,2,'Hey hope everyone is ok \n',0,NULL,NULL,'2025-09-09 10:38:21','2025-09-15 10:55:08','2025-09-09 10:36:50','2025-09-09 10:36:50','synced','2025-09-15 10:55:08');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_fields`
--

DROP TABLE IF EXISTS `custom_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `list_id` int DEFAULT NULL,
  `space_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('text','textarea','number','money','date','datetime','dropdown','checkbox','url','email','phone','progress','rating','formula','location','people','relationship') NOT NULL,
  `type_config` json DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_clickup_id` (`clickup_id`),
  KEY `idx_list_id` (`list_id`),
  KEY `idx_space_id` (`space_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `custom_fields_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `custom_fields_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_fields`
--

LOCK TABLES `custom_fields` WRITE;
/*!40000 ALTER TABLE `custom_fields` DISABLE KEYS */;
INSERT INTO `custom_fields` VALUES (1,'435fa732-f4fb-4906-b178-04c286366d1c',3,NULL,'Progress','','{\"tracking\": {\"subtasks\": true, \"checklists\": true, \"assigned_comments\": true}, \"complete_on\": 3}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(2,'5638fea6-973a-4376-b4fc-bad6a88b8b58',3,NULL,'Type','','{\"options\": [{\"id\": \"0d6eda60-5c57-4a02-8b3f-c2d9e2ed051e\", \"color\": \"#e50000\", \"label\": \"Advertisment\", \"orderindex\": 0}, {\"id\": \"0e30302b-52f8-43f3-bc22-00eaa617b209\", \"color\": \"#2ecd6f\", \"label\": \"Landing Page\", \"orderindex\": 1}, {\"id\": \"c3269091-1c1b-489f-a679-d074f980ccd6\", \"color\": \"#04A9F4\", \"label\": \"Email\", \"orderindex\": 2}]}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(3,'6c78bf3c-436d-4637-ab6d-dc0ae280137f',3,NULL,'Conversion rate A','text','{}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(4,'99e565ea-6769-4ab3-858f-d999d2e9e9b6',3,NULL,'Results','','{\"default\": 0, \"options\": [{\"id\": \"c999eba1-5007-4851-93f3-29b417546d47\", \"name\": \"A\", \"color\": \"#81B1FF\", \"orderindex\": 0}, {\"id\": \"773619f8-1f22-46c8-8e6b-27c63e19e981\", \"name\": \"B\", \"color\": \"#3397dd\", \"orderindex\": 1}, {\"id\": \"890dd856-3fa2-4b1b-a8b4-c2cc21891c01\", \"name\": \"Same\", \"color\": \"#b5bcc2\", \"orderindex\": 2}], \"placeholder\": null, \"new_drop_down\": true}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(5,'b149da55-7abb-4fc9-9084-d62163609e94',3,NULL,'Version B','text','{}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(6,'b799c38b-baca-4d42-8e55-942f03f41777',3,NULL,'Notes','text','{}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(7,'c19051e1-2fcf-4198-910f-1f95d900f366',3,NULL,'Version A','text','{}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(8,'d67f014d-c5cc-4e6e-b04d-64780b500b27',3,NULL,'Draft ','','{\"default\": 0, \"options\": [{\"id\": \"9de3c4e8-ce0d-4da8-8d2e-e1b4f8435f0d\", \"name\": \"Draft 1\", \"color\": \"#81B1FF\", \"orderindex\": 0}, {\"id\": \"acc51b3e-6a89-46ed-bf3b-6f890f18c23f\", \"name\": \"Draft 2\", \"color\": \"#ff7800\", \"orderindex\": 1}, {\"id\": \"9fd967fe-7aba-447a-b312-910c55beb02f\", \"name\": \"Draft 3\", \"color\": \"#bf55ec\", \"orderindex\": 2}, {\"id\": \"5bc431af-410e-406d-acc2-6829ea90046d\", \"name\": \"Final\", \"color\": \"#2ecd6f\", \"orderindex\": 3}], \"placeholder\": null, \"new_drop_down\": true}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(9,'e527ca84-df6b-4924-ab4c-d5e9d9768c5d',3,NULL,'Conversion Rate B','text','{}',0,1,'2025-09-10 09:40:14','2025-10-12 11:14:15','2025-09-10 09:40:14','2025-09-10 09:40:14','synced','2025-10-12 11:14:15'),(856,'2f8d1e42-c2d5-4f7c-93bc-88a82f17b6db',2,NULL,'Progress Updates','','{\"ai\": {\"prompt\": \"\", \"source\": \"custom_dropdown\"}, \"options\": [{\"id\": \"15b75620-0681-4407-ab0d-f0b115dccb5a\", \"name\": \"No Progress\", \"color\": \"#fff\", \"orderindex\": 0}, {\"id\": \"ca158e11-417f-4d3b-b9b5-69bb2106da10\", \"name\": \"Waiting\", \"color\": \"#ff7800\", \"orderindex\": 1}, {\"id\": \"f6b2b9be-6e5e-4ee1-b751-2a3585422c62\", \"name\": \"In progress\", \"color\": \"#0231E8\", \"orderindex\": 2}, {\"id\": \"f34fd6e3-8bfc-4f73-bc3b-c9d7989edb9a\", \"name\": \"Done\", \"color\": \"#2ecd6f\", \"orderindex\": 3}, {\"id\": \"5b5cad94-167a-4dc8-a73c-1ec0cc2fc633\", \"name\": \"Deffered\", \"color\": \"#E65100\", \"orderindex\": 4}], \"sorting\": \"manual\"}',0,1,'2025-09-10 13:06:13','2025-10-12 11:14:14','2025-09-10 13:06:13','2025-09-10 13:06:13','synced','2025-10-12 11:14:14');
/*!40000 ALTER TABLE `custom_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `space_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `orderindex` int DEFAULT NULL,
  `is_hidden` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_space_id` (`space_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES (1,'90127203141',1,'A/B Testing',0,0,0,1,'2025-09-09 09:45:03','2025-10-12 11:14:05',NULL,NULL,'synced','2025-10-12 11:14:05'),(2,'90126183826',1,'Projects',1,0,0,1,'2025-09-09 09:45:03','2025-10-12 11:14:05',NULL,NULL,'synced','2025-10-12 11:14:05');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal_targets`
--

DROP TABLE IF EXISTS `goal_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goal_targets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `goal_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `target_type` enum('number','true_false','currency','tasks') NOT NULL DEFAULT 'number',
  `start_value` decimal(15,4) DEFAULT '0.0000',
  `target_value` decimal(15,4) DEFAULT NULL,
  `current_value` decimal(15,4) DEFAULT '0.0000',
  `unit` varchar(50) DEFAULT NULL,
  `owner_id` varchar(50) DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_goal_id` (`goal_id`),
  CONSTRAINT `goal_targets_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal_targets`
--

LOCK TABLES `goal_targets` WRITE;
/*!40000 ALTER TABLE `goal_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `goal_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `team_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `percent_completed` decimal(5,2) DEFAULT '0.00',
  `is_archived` tinyint(1) DEFAULT '0',
  `owner_id` int DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_owner_id` (`owner_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `goals_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES (1,'c90be1b9-ec26-4f85-916e-191982b5d2fe',2,'By the end of september complete the clickup frontend Amen','This is a good action point since am developing a customed fronted that depends on clickup server \n\n','2025-10-01 00:00:00',NULL,0.00,0,NULL,'2025-09-10 12:19:58','2025-09-15 10:55:02','2025-09-10 12:17:41','2025-09-15 06:57:21','synced','2025-09-15 10:55:02');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `space_id` int DEFAULT NULL,
  `folder_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `orderindex` varchar(45) DEFAULT NULL,
  `content` text,
  `status` varchar(50) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `due_date_time` tinyint(1) DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `start_date_time` tinyint(1) DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `assignee_id` int DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `is_archived` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_space_id` (`space_id`),
  KEY `idx_folder_id` (`folder_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lists_ibfk_2` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (1,'901212333011',2,NULL,'Project 2','0','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-09 09:51:07','2025-10-12 11:14:09',NULL,NULL,'synced','2025-10-12 11:14:09'),(2,'901212333010',2,NULL,'Project 1','0','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-09 09:51:07','2025-10-12 11:14:09',NULL,NULL,'synced','2025-10-12 11:14:09'),(3,'901212004101',1,1,'Tests','1','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-09 09:51:08','2025-10-12 11:14:11',NULL,NULL,'synced','2025-10-12 11:14:11'),(4,'901210447668',1,2,'Project 1','0','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-09 09:51:09','2025-10-12 11:14:12',NULL,NULL,'synced','2025-10-12 11:14:12'),(5,'901210447669',1,2,'Project 2','1','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-09 09:51:09','2025-10-12 11:14:12',NULL,NULL,'synced','2025-10-12 11:14:12'),(6,'901212362348',3,NULL,'List','0','','active',NULL,0,NULL,0,NULL,NULL,NULL,0,1,'2025-09-10 08:40:08','2025-10-12 11:14:10',NULL,NULL,'synced','2025-10-12 11:14:10');
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `entity_type` enum('task','comment','attachment','goal','checklist','space','other') DEFAULT 'task',
  `entity_id` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `priority` enum('low','normal','high','urgent') DEFAULT 'normal',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spaces`
--

DROP TABLE IF EXISTS `spaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spaces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `team_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spaces`
--

LOCK TABLES `spaces` WRITE;
/*!40000 ALTER TABLE `spaces` DISABLE KEYS */;
INSERT INTO `spaces` VALUES (1,'90124144806',1,'Team Space','#03A2FD',NULL,0,0,1,'2025-09-09 09:35:02','2025-10-12 11:14:03',NULL,NULL,'synced','2025-10-12 11:14:03'),(2,'90125044322',2,'Team Space','#03A2FD',NULL,0,0,1,'2025-09-09 09:35:03','2025-10-12 11:14:04',NULL,NULL,'synced','2025-10-12 11:14:04'),(3,'90125058805',2,'space for enm admin',NULL,NULL,0,0,1,'2025-09-10 08:26:03','2025-10-12 11:14:04',NULL,NULL,'synced','2025-10-12 11:14:04');
/*!40000 ALTER TABLE `spaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `space_id` int NOT NULL,
  `status` varchar(100) NOT NULL,
  `type` enum('open','closed','custom') DEFAULT 'custom',
  `order_index` int DEFAULT '0',
  `color` varchar(20) DEFAULT '#000000',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_clickup_id` (`clickup_id`),
  KEY `idx_space_id` (`space_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `statuses_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_config`
--

DROP TABLE IF EXISTS `sync_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workspace_id` varchar(50) NOT NULL,
  `api_token_encrypted` text NOT NULL,
  `webhook_secret` varchar(255) DEFAULT NULL,
  `last_full_sync` datetime DEFAULT NULL,
  `sync_status` enum('active','paused','error') DEFAULT 'active',
  `sync_interval_minutes` int DEFAULT '15',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_config`
--

LOCK TABLES `sync_config` WRITE;
/*!40000 ALTER TABLE `sync_config` DISABLE KEYS */;
INSERT INTO `sync_config` VALUES (1,'default_workspace','bf28ea90f85d2ee3f6c612783ad753cb:a1fe993f4ecc8ad65f64455036212d1cb93dc7ce9c6495690d83ba6580cd7674944da9f3be2b8c07336c0c80b2107b72','myWebhookSecret123','2025-09-15 13:53:00','active',1,'2025-08-27 13:23:04','2025-09-15 10:55:26');
/*!40000 ALTER TABLE `sync_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_conflicts`
--

DROP TABLE IF EXISTS `sync_conflicts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_conflicts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `entity_type` enum('team','space','folder','list','task','user','comment','attachment','time_entry') NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `clickup_id` varchar(50) NOT NULL,
  `local_data` json NOT NULL,
  `clickup_data` json NOT NULL,
  `conflict_type` enum('simultaneous_edit','delete_conflict','permission_conflict') NOT NULL,
  `resolution_status` enum('pending','local_wins','clickup_wins','manual_merge','ignored') DEFAULT 'pending',
  `resolved_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`resolution_status`),
  KEY `idx_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_conflicts`
--

LOCK TABLES `sync_conflicts` WRITE;
/*!40000 ALTER TABLE `sync_conflicts` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_conflicts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_operations`
--

DROP TABLE IF EXISTS `sync_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_operations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `operation_type` enum('pull','push','webhook') NOT NULL,
  `entity_type` enum('team','space','folder','list','task','user','comment','attachment','time_entry') NOT NULL,
  `entity_id` varchar(50) DEFAULT NULL,
  `clickup_id` varchar(50) DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','conflict') NOT NULL,
  `error_message` text,
  `retry_count` int DEFAULT '0',
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `payload` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status_type` (`status`,`entity_type`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_started_at` (`started_at`),
  KEY `idx_sync_ops_status_created` (`status`,`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_operations`
--

LOCK TABLES `sync_operations` WRITE;
/*!40000 ALTER TABLE `sync_operations` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `space_id` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `tag_fg` varchar(50) DEFAULT NULL,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_clickup_id_space` (`clickup_id`,`space_id`),
  KEY `idx_space_id` (`space_id`)
) ENGINE=InnoDB AUTO_INCREMENT=851 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'paused',1,'paused','#6E56CF',NULL,NULL,'2025-09-10 12:45:24','2025-10-12 11:14:24',1,'synced','2025-10-12 11:14:24'),(50,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 14:52:49','2025-09-10 14:52:49',1,'synced','2025-09-10 14:52:49'),(52,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 14:55:49','2025-09-10 14:55:49',1,'synced','2025-09-10 14:55:49'),(54,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 14:58:50','2025-09-10 14:58:50',1,'synced','2025-09-10 14:58:50'),(56,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:01:50','2025-09-10 15:01:50',1,'synced','2025-09-10 15:01:50'),(58,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:04:50','2025-09-10 15:04:50',1,'synced','2025-09-10 15:04:50'),(60,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:06:49','2025-09-10 15:06:49',1,'synced','2025-09-10 15:06:49'),(62,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:09:49','2025-09-10 15:09:49',1,'synced','2025-09-10 15:09:49'),(64,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:12:49','2025-09-10 15:12:49',1,'synced','2025-09-10 15:12:49'),(66,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:15:50','2025-09-10 15:15:50',1,'synced','2025-09-10 15:15:50'),(68,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:18:49','2025-09-10 15:18:49',1,'synced','2025-09-10 15:18:49'),(70,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:20:50','2025-09-10 15:20:50',1,'synced','2025-09-10 15:20:50'),(73,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:24:49','2025-09-10 15:24:49',1,'synced','2025-09-10 15:24:49'),(76,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:28:50','2025-09-10 15:28:50',1,'synced','2025-09-10 15:28:50'),(78,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:31:49','2025-09-10 15:31:49',1,'synced','2025-09-10 15:31:49'),(81,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:35:49','2025-09-10 15:35:49',1,'synced','2025-09-10 15:35:49'),(83,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:38:50','2025-09-10 15:38:50',1,'synced','2025-09-10 15:38:50'),(85,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:41:49','2025-09-10 15:41:49',1,'synced','2025-09-10 15:41:49'),(87,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:44:50','2025-09-10 15:44:50',1,'synced','2025-09-10 15:44:50'),(89,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:47:51','2025-09-10 15:47:51',1,'synced','2025-09-10 15:47:51'),(91,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:50:50','2025-09-10 15:50:50',1,'synced','2025-09-10 15:50:50'),(93,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:53:49','2025-09-10 15:53:49',1,'synced','2025-09-10 15:53:49'),(95,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:56:49','2025-09-10 15:56:49',1,'synced','2025-09-10 15:56:49'),(97,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 15:59:49','2025-09-10 15:59:49',1,'synced','2025-09-10 15:59:49'),(99,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:02:50','2025-09-10 16:02:50',1,'synced','2025-09-10 16:02:50'),(101,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:05:50','2025-09-10 16:05:50',1,'synced','2025-09-10 16:05:50'),(103,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:08:50','2025-09-10 16:08:50',1,'synced','2025-09-10 16:08:50'),(105,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:11:50','2025-09-10 16:11:50',1,'synced','2025-09-10 16:11:50'),(107,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:14:50','2025-09-10 16:14:50',1,'synced','2025-09-10 16:14:50'),(109,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:17:49','2025-09-10 16:17:49',1,'synced','2025-09-10 16:17:49'),(111,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:20:49','2025-09-10 16:20:49',1,'synced','2025-09-10 16:20:49'),(113,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:23:49','2025-09-10 16:23:49',1,'synced','2025-09-10 16:23:49'),(115,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:26:49','2025-09-10 16:26:49',1,'synced','2025-09-10 16:26:49'),(117,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:29:50','2025-09-10 16:29:50',1,'synced','2025-09-10 16:29:50'),(119,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:32:50','2025-09-10 16:32:50',1,'synced','2025-09-10 16:32:50'),(121,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:35:50','2025-09-10 16:35:50',1,'synced','2025-09-10 16:35:50'),(123,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:38:50','2025-09-10 16:38:50',1,'synced','2025-09-10 16:38:50'),(125,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:41:49','2025-09-10 16:41:49',1,'synced','2025-09-10 16:41:49'),(127,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:44:49','2025-09-10 16:44:49',1,'synced','2025-09-10 16:44:49'),(129,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:46:51','2025-09-10 16:46:51',1,'synced','2025-09-10 16:46:51'),(131,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 16:49:49','2025-09-10 16:49:49',1,'synced','2025-09-10 16:49:49'),(133,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:14:49','2025-09-10 17:14:49',1,'synced','2025-09-10 17:14:49'),(135,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:17:49','2025-09-10 17:17:49',1,'synced','2025-09-10 17:17:49'),(137,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:20:50','2025-09-10 17:20:50',1,'synced','2025-09-10 17:20:50'),(139,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:23:49','2025-09-10 17:23:49',1,'synced','2025-09-10 17:23:49'),(141,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:26:50','2025-09-10 17:26:50',1,'synced','2025-09-10 17:26:50'),(143,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:29:50','2025-09-10 17:29:50',1,'synced','2025-09-10 17:29:50'),(145,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:32:50','2025-09-10 17:32:50',1,'synced','2025-09-10 17:32:50'),(147,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:35:50','2025-09-10 17:35:50',1,'synced','2025-09-10 17:35:50'),(149,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:37:49','2025-09-10 17:37:49',1,'synced','2025-09-10 17:37:49'),(151,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:40:50','2025-09-10 17:40:50',1,'synced','2025-09-10 17:40:50'),(153,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:43:49','2025-09-10 17:43:49',1,'synced','2025-09-10 17:43:49'),(155,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:46:50','2025-09-10 17:46:50',1,'synced','2025-09-10 17:46:50'),(157,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:49:50','2025-09-10 17:49:50',1,'synced','2025-09-10 17:49:50'),(159,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:52:50','2025-09-10 17:52:50',1,'synced','2025-09-10 17:52:50'),(161,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:55:50','2025-09-10 17:55:50',1,'synced','2025-09-10 17:55:50'),(163,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 17:58:49','2025-09-10 17:58:49',1,'synced','2025-09-10 17:58:49'),(165,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:01:49','2025-09-10 18:01:49',1,'synced','2025-09-10 18:01:49'),(167,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:04:49','2025-09-10 18:04:49',1,'synced','2025-09-10 18:04:49'),(169,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:07:49','2025-09-10 18:07:49',1,'synced','2025-09-10 18:07:49'),(171,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:10:50','2025-09-10 18:10:50',1,'synced','2025-09-10 18:10:50'),(173,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:13:50','2025-09-10 18:13:50',1,'synced','2025-09-10 18:13:50'),(175,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:16:50','2025-09-10 18:16:50',1,'synced','2025-09-10 18:16:50'),(177,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:19:50','2025-09-10 18:19:50',1,'synced','2025-09-10 18:19:50'),(179,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:22:50','2025-09-10 18:22:50',1,'synced','2025-09-10 18:22:50'),(181,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:25:49','2025-09-10 18:25:49',1,'synced','2025-09-10 18:25:49'),(183,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:28:49','2025-09-10 18:28:49',1,'synced','2025-09-10 18:28:49'),(185,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:31:49','2025-09-10 18:31:49',1,'synced','2025-09-10 18:31:49'),(187,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:34:49','2025-09-10 18:34:49',1,'synced','2025-09-10 18:34:49'),(189,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:37:50','2025-09-10 18:37:50',1,'synced','2025-09-10 18:37:50'),(191,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:40:50','2025-09-10 18:40:50',1,'synced','2025-09-10 18:40:50'),(193,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:43:50','2025-09-10 18:43:50',1,'synced','2025-09-10 18:43:50'),(195,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:46:50','2025-09-10 18:46:50',1,'synced','2025-09-10 18:46:50'),(197,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:49:50','2025-09-10 18:49:50',1,'synced','2025-09-10 18:49:50'),(199,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:52:49','2025-09-10 18:52:49',1,'synced','2025-09-10 18:52:49'),(201,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:55:49','2025-09-10 18:55:49',1,'synced','2025-09-10 18:55:49'),(203,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 18:58:49','2025-09-10 18:58:49',1,'synced','2025-09-10 18:58:49'),(205,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:01:50','2025-09-10 19:01:50',1,'synced','2025-09-10 19:01:50'),(207,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:04:50','2025-09-10 19:04:50',1,'synced','2025-09-10 19:04:50'),(209,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:07:52','2025-09-10 19:07:52',1,'synced','2025-09-10 19:07:52'),(211,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:10:50','2025-09-10 19:10:50',1,'synced','2025-09-10 19:10:50'),(213,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:13:50','2025-09-10 19:13:50',1,'synced','2025-09-10 19:13:50'),(215,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:16:50','2025-09-10 19:16:50',1,'synced','2025-09-10 19:16:50'),(217,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:19:49','2025-09-10 19:19:49',1,'synced','2025-09-10 19:19:49'),(219,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:22:49','2025-09-10 19:22:49',1,'synced','2025-09-10 19:22:49'),(221,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:25:49','2025-09-10 19:25:49',1,'synced','2025-09-10 19:25:49'),(223,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:28:50','2025-09-10 19:28:50',1,'synced','2025-09-10 19:28:50'),(225,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:31:50','2025-09-10 19:31:50',1,'synced','2025-09-10 19:31:50'),(227,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:34:50','2025-09-10 19:34:50',1,'synced','2025-09-10 19:34:50'),(229,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:37:50','2025-09-10 19:37:50',1,'synced','2025-09-10 19:37:50'),(231,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:40:50','2025-09-10 19:40:50',1,'synced','2025-09-10 19:40:50'),(233,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:43:50','2025-09-10 19:43:50',1,'synced','2025-09-10 19:43:50'),(235,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:46:49','2025-09-10 19:46:49',1,'synced','2025-09-10 19:46:49'),(237,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:49:50','2025-09-10 19:49:50',1,'synced','2025-09-10 19:49:50'),(239,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:52:49','2025-09-10 19:52:49',1,'synced','2025-09-10 19:52:49'),(241,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:55:49','2025-09-10 19:55:49',1,'synced','2025-09-10 19:55:49'),(243,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 19:58:50','2025-09-10 19:58:50',1,'synced','2025-09-10 19:58:50'),(245,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:01:50','2025-09-10 20:01:50',1,'synced','2025-09-10 20:01:50'),(247,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:04:50','2025-09-10 20:04:50',1,'synced','2025-09-10 20:04:50'),(249,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:07:50','2025-09-10 20:07:50',1,'synced','2025-09-10 20:07:50'),(251,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:10:50','2025-09-10 20:10:50',1,'synced','2025-09-10 20:10:50'),(253,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:13:49','2025-09-10 20:13:49',1,'synced','2025-09-10 20:13:49'),(255,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:16:50','2025-09-10 20:16:50',1,'synced','2025-09-10 20:16:50'),(257,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:19:51','2025-09-10 20:19:51',1,'synced','2025-09-10 20:19:51'),(259,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:22:49','2025-09-10 20:22:49',1,'synced','2025-09-10 20:22:49'),(261,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:25:50','2025-09-10 20:25:50',1,'synced','2025-09-10 20:25:50'),(263,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:28:50','2025-09-10 20:28:50',1,'synced','2025-09-10 20:28:50'),(265,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:31:50','2025-09-10 20:31:50',1,'synced','2025-09-10 20:31:50'),(267,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:34:50','2025-09-10 20:34:50',1,'synced','2025-09-10 20:34:50'),(269,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:37:50','2025-09-10 20:37:50',1,'synced','2025-09-10 20:37:50'),(271,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:40:49','2025-09-10 20:40:49',1,'synced','2025-09-10 20:40:49'),(273,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:43:50','2025-09-10 20:43:50',1,'synced','2025-09-10 20:43:50'),(275,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:46:49','2025-09-10 20:46:49',1,'synced','2025-09-10 20:46:49'),(277,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:49:49','2025-09-10 20:49:49',1,'synced','2025-09-10 20:49:49'),(279,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:52:50','2025-09-10 20:52:50',1,'synced','2025-09-10 20:52:50'),(281,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:55:50','2025-09-10 20:55:50',1,'synced','2025-09-10 20:55:50'),(283,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 20:58:50','2025-09-10 20:58:50',1,'synced','2025-09-10 20:58:50'),(285,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:02:53','2025-09-10 21:02:53',1,'synced','2025-09-10 21:02:53'),(287,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:05:50','2025-09-10 21:05:50',1,'synced','2025-09-10 21:05:50'),(289,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:08:49','2025-09-10 21:08:49',1,'synced','2025-09-10 21:08:49'),(291,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:11:50','2025-09-10 21:11:50',1,'synced','2025-09-10 21:11:50'),(293,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:14:50','2025-09-10 21:14:50',1,'synced','2025-09-10 21:14:50'),(295,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:17:50','2025-09-10 21:17:50',1,'synced','2025-09-10 21:17:50'),(297,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:20:50','2025-09-10 21:20:50',1,'synced','2025-09-10 21:20:50'),(299,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:23:50','2025-09-10 21:23:50',1,'synced','2025-09-10 21:23:50'),(301,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:26:49','2025-09-10 21:26:49',1,'synced','2025-09-10 21:26:49'),(303,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:29:49','2025-09-10 21:29:49',1,'synced','2025-09-10 21:29:49'),(305,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:32:50','2025-09-10 21:32:50',1,'synced','2025-09-10 21:32:50'),(307,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:35:50','2025-09-10 21:35:50',1,'synced','2025-09-10 21:35:50'),(309,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:38:50','2025-09-10 21:38:50',1,'synced','2025-09-10 21:38:50'),(311,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:41:51','2025-09-10 21:41:51',1,'synced','2025-09-10 21:41:51'),(313,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:44:49','2025-09-10 21:44:49',1,'synced','2025-09-10 21:44:49'),(315,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:47:49','2025-09-10 21:47:49',1,'synced','2025-09-10 21:47:49'),(317,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:50:49','2025-09-10 21:50:49',1,'synced','2025-09-10 21:50:49'),(319,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:53:50','2025-09-10 21:53:50',1,'synced','2025-09-10 21:53:50'),(321,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:56:50','2025-09-10 21:56:50',1,'synced','2025-09-10 21:56:50'),(323,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 21:59:50','2025-09-10 21:59:50',1,'synced','2025-09-10 21:59:50'),(325,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:02:49','2025-09-10 22:02:49',1,'synced','2025-09-10 22:02:49'),(327,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:05:49','2025-09-10 22:05:49',1,'synced','2025-09-10 22:05:49'),(329,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:08:49','2025-09-10 22:08:49',1,'synced','2025-09-10 22:08:49'),(331,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:11:50','2025-09-10 22:11:50',1,'synced','2025-09-10 22:11:50'),(333,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:14:50','2025-09-10 22:14:50',1,'synced','2025-09-10 22:14:50'),(335,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:17:50','2025-09-10 22:17:50',1,'synced','2025-09-10 22:17:50'),(337,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:20:49','2025-09-10 22:20:49',1,'synced','2025-09-10 22:20:49'),(339,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:23:49','2025-09-10 22:23:49',1,'synced','2025-09-10 22:23:49'),(341,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:26:50','2025-09-10 22:26:50',1,'synced','2025-09-10 22:26:50'),(343,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:29:50','2025-09-10 22:29:50',1,'synced','2025-09-10 22:29:50'),(345,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:32:50','2025-09-10 22:32:50',1,'synced','2025-09-10 22:32:50'),(347,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:35:50','2025-09-10 22:35:50',1,'synced','2025-09-10 22:35:50'),(349,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:38:50','2025-09-10 22:38:50',1,'synced','2025-09-10 22:38:50'),(351,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:41:50','2025-09-10 22:41:50',1,'synced','2025-09-10 22:41:50'),(353,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:44:49','2025-09-10 22:44:49',1,'synced','2025-09-10 22:44:49'),(355,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:47:49','2025-09-10 22:47:49',1,'synced','2025-09-10 22:47:49'),(357,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:50:49','2025-09-10 22:50:49',1,'synced','2025-09-10 22:50:49'),(359,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:53:50','2025-09-10 22:53:50',1,'synced','2025-09-10 22:53:50'),(361,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:56:52','2025-09-10 22:56:52',1,'synced','2025-09-10 22:56:52'),(363,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 22:59:50','2025-09-10 22:59:50',1,'synced','2025-09-10 22:59:50'),(365,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:02:52','2025-09-10 23:02:52',1,'synced','2025-09-10 23:02:52'),(367,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:05:50','2025-09-10 23:05:50',1,'synced','2025-09-10 23:05:50'),(369,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:08:50','2025-09-10 23:08:50',1,'synced','2025-09-10 23:08:50'),(371,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:11:50','2025-09-10 23:11:50',1,'synced','2025-09-10 23:11:50'),(373,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:14:50','2025-09-10 23:14:50',1,'synced','2025-09-10 23:14:50'),(375,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:17:50','2025-09-10 23:17:50',1,'synced','2025-09-10 23:17:50'),(377,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:20:49','2025-09-10 23:20:49',1,'synced','2025-09-10 23:20:49'),(379,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:23:49','2025-09-10 23:23:49',1,'synced','2025-09-10 23:23:49'),(381,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:26:49','2025-09-10 23:26:49',1,'synced','2025-09-10 23:26:49'),(383,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:29:50','2025-09-10 23:29:50',1,'synced','2025-09-10 23:29:50'),(385,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:32:52','2025-09-10 23:32:52',1,'synced','2025-09-10 23:32:52'),(387,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:35:50','2025-09-10 23:35:50',1,'synced','2025-09-10 23:35:50'),(389,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:38:50','2025-09-10 23:38:50',1,'synced','2025-09-10 23:38:50'),(391,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:41:50','2025-09-10 23:41:50',1,'synced','2025-09-10 23:41:50'),(393,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:44:49','2025-09-10 23:44:49',1,'synced','2025-09-10 23:44:49'),(395,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:47:49','2025-09-10 23:47:49',1,'synced','2025-09-10 23:47:49'),(397,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:50:49','2025-09-10 23:50:49',1,'synced','2025-09-10 23:50:49'),(399,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:53:50','2025-09-10 23:53:50',1,'synced','2025-09-10 23:53:50'),(401,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:56:50','2025-09-10 23:56:50',1,'synced','2025-09-10 23:56:50'),(403,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-10 23:59:50','2025-09-10 23:59:50',1,'synced','2025-09-10 23:59:50'),(405,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:02:50','2025-09-11 00:02:50',1,'synced','2025-09-11 00:02:50'),(407,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:05:50','2025-09-11 00:05:50',1,'synced','2025-09-11 00:05:50'),(409,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:08:50','2025-09-11 00:08:50',1,'synced','2025-09-11 00:08:50'),(411,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:11:49','2025-09-11 00:11:49',1,'synced','2025-09-11 00:11:49'),(413,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:14:50','2025-09-11 00:14:50',1,'synced','2025-09-11 00:14:50'),(415,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:17:49','2025-09-11 00:17:49',1,'synced','2025-09-11 00:17:49'),(417,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:20:50','2025-09-11 00:20:50',1,'synced','2025-09-11 00:20:50'),(419,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:23:50','2025-09-11 00:23:50',1,'synced','2025-09-11 00:23:50'),(421,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:26:50','2025-09-11 00:26:50',1,'synced','2025-09-11 00:26:50'),(423,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:29:50','2025-09-11 00:29:50',1,'synced','2025-09-11 00:29:50'),(425,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:32:50','2025-09-11 00:32:50',1,'synced','2025-09-11 00:32:50'),(427,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:35:50','2025-09-11 00:35:50',1,'synced','2025-09-11 00:35:50'),(429,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:38:49','2025-09-11 00:38:49',1,'synced','2025-09-11 00:38:49'),(431,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:41:49','2025-09-11 00:41:49',1,'synced','2025-09-11 00:41:49'),(433,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:44:49','2025-09-11 00:44:49',1,'synced','2025-09-11 00:44:49'),(435,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:47:49','2025-09-11 00:47:49',1,'synced','2025-09-11 00:47:49'),(437,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:50:50','2025-09-11 00:50:50',1,'synced','2025-09-11 00:50:50'),(439,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:53:50','2025-09-11 00:53:50',1,'synced','2025-09-11 00:53:50'),(441,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:56:50','2025-09-11 00:56:50',1,'synced','2025-09-11 00:56:50'),(443,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 00:59:50','2025-09-11 00:59:50',1,'synced','2025-09-11 00:59:50'),(445,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 01:02:49','2025-09-11 01:02:49',1,'synced','2025-09-11 01:02:49'),(447,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 01:05:49','2025-09-11 01:05:49',1,'synced','2025-09-11 01:05:49'),(449,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 06:53:49','2025-09-11 06:53:49',1,'synced','2025-09-11 06:53:49'),(451,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 06:56:49','2025-09-11 06:56:49',1,'synced','2025-09-11 06:56:49'),(453,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 06:59:50','2025-09-11 06:59:50',1,'synced','2025-09-11 06:59:50'),(455,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:02:50','2025-09-11 07:02:50',1,'synced','2025-09-11 07:02:50'),(457,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:05:50','2025-09-11 07:05:50',1,'synced','2025-09-11 07:05:50'),(459,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:08:50','2025-09-11 07:08:50',1,'synced','2025-09-11 07:08:50'),(461,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:11:50','2025-09-11 07:11:50',1,'synced','2025-09-11 07:11:50'),(463,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:14:51','2025-09-11 07:14:51',1,'synced','2025-09-11 07:14:51'),(465,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:17:49','2025-09-11 07:17:49',1,'synced','2025-09-11 07:17:49'),(467,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:20:49','2025-09-11 07:20:49',1,'synced','2025-09-11 07:20:49'),(469,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:23:50','2025-09-11 07:23:50',1,'synced','2025-09-11 07:23:50'),(471,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:26:50','2025-09-11 07:26:50',1,'synced','2025-09-11 07:26:50'),(473,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:29:50','2025-09-11 07:29:50',1,'synced','2025-09-11 07:29:50'),(475,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:32:50','2025-09-11 07:32:50',1,'synced','2025-09-11 07:32:50'),(477,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:35:51','2025-09-11 07:35:51',1,'synced','2025-09-11 07:35:51'),(479,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:38:50','2025-09-11 07:38:50',1,'synced','2025-09-11 07:38:50'),(481,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:41:49','2025-09-11 07:41:49',1,'synced','2025-09-11 07:41:49'),(483,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:44:50','2025-09-11 07:44:50',1,'synced','2025-09-11 07:44:50'),(485,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:47:49','2025-09-11 07:47:49',1,'synced','2025-09-11 07:47:49'),(487,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:50:51','2025-09-11 07:50:51',1,'synced','2025-09-11 07:50:51'),(489,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:53:50','2025-09-11 07:53:50',1,'synced','2025-09-11 07:53:50'),(491,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:56:50','2025-09-11 07:56:50',1,'synced','2025-09-11 07:56:50'),(493,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 07:59:50','2025-09-11 07:59:50',1,'synced','2025-09-11 07:59:50'),(495,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:02:50','2025-09-11 08:02:50',1,'synced','2025-09-11 08:02:50'),(497,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:05:50','2025-09-11 08:05:50',1,'synced','2025-09-11 08:05:50'),(499,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:08:50','2025-09-11 08:08:50',1,'synced','2025-09-11 08:08:50'),(501,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:11:50','2025-09-11 08:11:50',1,'synced','2025-09-11 08:11:50'),(503,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:14:54','2025-09-11 08:14:54',1,'synced','2025-09-11 08:14:54'),(505,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:17:50','2025-09-11 08:17:50',1,'synced','2025-09-11 08:17:50'),(507,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:20:50','2025-09-11 08:20:50',1,'synced','2025-09-11 08:20:50'),(509,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:23:49','2025-09-11 08:23:49',1,'synced','2025-09-11 08:23:49'),(511,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:26:51','2025-09-11 08:26:51',1,'synced','2025-09-11 08:26:51'),(513,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:29:51','2025-09-11 08:29:51',1,'synced','2025-09-11 08:29:51'),(515,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:32:50','2025-09-11 08:32:50',1,'synced','2025-09-11 08:32:50'),(517,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:35:50','2025-09-11 08:35:50',1,'synced','2025-09-11 08:35:50'),(519,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:38:50','2025-09-11 08:38:50',1,'synced','2025-09-11 08:38:50'),(521,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:41:50','2025-09-11 08:41:50',1,'synced','2025-09-11 08:41:50'),(523,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:44:49','2025-09-11 08:44:49',1,'synced','2025-09-11 08:44:49'),(525,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:47:50','2025-09-11 08:47:50',1,'synced','2025-09-11 08:47:50'),(527,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:50:50','2025-09-11 08:50:50',1,'synced','2025-09-11 08:50:50'),(529,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:53:50','2025-09-11 08:53:50',1,'synced','2025-09-11 08:53:50'),(531,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:56:49','2025-09-11 08:56:49',1,'synced','2025-09-11 08:56:49'),(533,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 08:59:49','2025-09-11 08:59:49',1,'synced','2025-09-11 08:59:49'),(535,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:02:50','2025-09-11 09:02:50',1,'synced','2025-09-11 09:02:50'),(537,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:05:50','2025-09-11 09:05:50',1,'synced','2025-09-11 09:05:50'),(539,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:08:50','2025-09-11 09:08:50',1,'synced','2025-09-11 09:08:50'),(541,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:11:50','2025-09-11 09:11:50',1,'synced','2025-09-11 09:11:50'),(543,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:14:50','2025-09-11 09:14:50',1,'synced','2025-09-11 09:14:50'),(545,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:17:49','2025-09-11 09:17:49',1,'synced','2025-09-11 09:17:49'),(547,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:20:49','2025-09-11 09:20:49',1,'synced','2025-09-11 09:20:49'),(549,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:23:50','2025-09-11 09:23:50',1,'synced','2025-09-11 09:23:50'),(551,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:26:50','2025-09-11 09:26:50',1,'synced','2025-09-11 09:26:50'),(553,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:29:50','2025-09-11 09:29:50',1,'synced','2025-09-11 09:29:50'),(555,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:32:50','2025-09-11 09:32:50',1,'synced','2025-09-11 09:32:50'),(557,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:35:50','2025-09-11 09:35:50',1,'synced','2025-09-11 09:35:50'),(559,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:38:52','2025-09-11 09:38:52',1,'synced','2025-09-11 09:38:52'),(561,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:41:50','2025-09-11 09:41:50',1,'synced','2025-09-11 09:41:50'),(563,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:44:51','2025-09-11 09:44:51',1,'synced','2025-09-11 09:44:51'),(565,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:47:50','2025-09-11 09:47:50',1,'synced','2025-09-11 09:47:50'),(567,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:50:50','2025-09-11 09:50:50',1,'synced','2025-09-11 09:50:50'),(569,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:53:50','2025-09-11 09:53:50',1,'synced','2025-09-11 09:53:50'),(571,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:56:49','2025-09-11 09:56:49',1,'synced','2025-09-11 09:56:49'),(573,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 09:59:50','2025-09-11 09:59:50',1,'synced','2025-09-11 09:59:50'),(575,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:02:50','2025-09-11 10:02:50',1,'synced','2025-09-11 10:02:50'),(577,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:05:50','2025-09-11 10:05:50',1,'synced','2025-09-11 10:05:50'),(579,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:14:49','2025-09-11 10:14:49',1,'synced','2025-09-11 10:14:49'),(581,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:17:50','2025-09-11 10:17:50',1,'synced','2025-09-11 10:17:50'),(583,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:20:50','2025-09-11 10:20:50',1,'synced','2025-09-11 10:20:50'),(585,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:23:50','2025-09-11 10:23:50',1,'synced','2025-09-11 10:23:50'),(587,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:26:50','2025-09-11 10:26:50',1,'synced','2025-09-11 10:26:50'),(589,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:29:49','2025-09-11 10:29:49',1,'synced','2025-09-11 10:29:49'),(591,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:32:49','2025-09-11 10:32:49',1,'synced','2025-09-11 10:32:49'),(593,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:35:50','2025-09-11 10:35:50',1,'synced','2025-09-11 10:35:50'),(595,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:38:50','2025-09-11 10:38:50',1,'synced','2025-09-11 10:38:50'),(597,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:41:50','2025-09-11 10:41:50',1,'synced','2025-09-11 10:41:50'),(599,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:44:51','2025-09-11 10:44:51',1,'synced','2025-09-11 10:44:51'),(601,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:47:49','2025-09-11 10:47:49',1,'synced','2025-09-11 10:47:49'),(603,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:50:50','2025-09-11 10:50:50',1,'synced','2025-09-11 10:50:50'),(605,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:53:50','2025-09-11 10:53:50',1,'synced','2025-09-11 10:53:50'),(607,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:56:50','2025-09-11 10:56:50',1,'synced','2025-09-11 10:56:50'),(609,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 10:59:51','2025-09-11 10:59:51',1,'synced','2025-09-11 10:59:51'),(611,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:02:49','2025-09-11 11:02:49',1,'synced','2025-09-11 11:02:49'),(613,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:05:49','2025-09-11 11:05:49',1,'synced','2025-09-11 11:05:49'),(615,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:08:50','2025-09-11 11:08:50',1,'synced','2025-09-11 11:08:50'),(617,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:11:50','2025-09-11 11:11:50',1,'synced','2025-09-11 11:11:50'),(619,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:14:50','2025-09-11 11:14:50',1,'synced','2025-09-11 11:14:50'),(621,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:17:50','2025-09-11 11:17:50',1,'synced','2025-09-11 11:17:50'),(623,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:20:50','2025-09-11 11:20:50',1,'synced','2025-09-11 11:20:50'),(625,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:23:50','2025-09-11 11:23:50',1,'synced','2025-09-11 11:23:50'),(627,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:26:50','2025-09-11 11:26:50',1,'synced','2025-09-11 11:26:50'),(629,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:29:50','2025-09-11 11:29:50',1,'synced','2025-09-11 11:29:50'),(631,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:32:50','2025-09-11 11:32:50',1,'synced','2025-09-11 11:32:50'),(633,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:35:50','2025-09-11 11:35:50',1,'synced','2025-09-11 11:35:50'),(635,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:38:51','2025-09-11 11:38:51',1,'synced','2025-09-11 11:38:51'),(637,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:41:49','2025-09-11 11:41:49',1,'synced','2025-09-11 11:41:49'),(639,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:44:50','2025-09-11 11:44:50',1,'synced','2025-09-11 11:44:50'),(641,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:47:50','2025-09-11 11:47:50',1,'synced','2025-09-11 11:47:50'),(643,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:50:50','2025-09-11 11:50:50',1,'synced','2025-09-11 11:50:50'),(645,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-11 11:54:49','2025-09-11 11:54:49',1,'synced','2025-09-11 11:54:49'),(647,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 05:24:51','2025-09-15 05:24:51',1,'synced','2025-09-15 05:24:51'),(649,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 05:37:50','2025-09-15 05:37:50',1,'synced','2025-09-15 05:37:50'),(651,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 05:50:50','2025-09-15 05:50:50',1,'synced','2025-09-15 05:50:50'),(653,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 05:53:50','2025-09-15 05:53:50',1,'synced','2025-09-15 05:53:50'),(656,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 05:58:50','2025-09-15 05:58:50',1,'synced','2025-09-15 05:58:50'),(658,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:01:51','2025-09-15 06:01:51',1,'synced','2025-09-15 06:01:51'),(660,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:04:50','2025-09-15 06:04:50',1,'synced','2025-09-15 06:04:50'),(662,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:06:50','2025-09-15 06:06:50',1,'synced','2025-09-15 06:06:50'),(664,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:09:49','2025-09-15 06:09:49',1,'synced','2025-09-15 06:09:49'),(666,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:12:50','2025-09-15 06:12:50',1,'synced','2025-09-15 06:12:50'),(668,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:15:50','2025-09-15 06:15:50',1,'synced','2025-09-15 06:15:50'),(670,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:18:49','2025-09-15 06:18:49',1,'synced','2025-09-15 06:18:49'),(672,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:21:49','2025-09-15 06:21:49',1,'synced','2025-09-15 06:21:49'),(674,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:24:50','2025-09-15 06:24:50',1,'synced','2025-09-15 06:24:50'),(677,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:31:50','2025-09-15 06:31:50',1,'synced','2025-09-15 06:31:50'),(679,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:42:50','2025-09-15 06:42:50',1,'synced','2025-09-15 06:42:50'),(681,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:46:50','2025-09-15 06:46:50',1,'synced','2025-09-15 06:46:50'),(683,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:49:49','2025-09-15 06:49:49',1,'synced','2025-09-15 06:49:49'),(685,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:51:50','2025-09-15 06:51:50',1,'synced','2025-09-15 06:51:50'),(687,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:55:50','2025-09-15 06:55:50',1,'synced','2025-09-15 06:55:50'),(689,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 06:58:50','2025-09-15 06:58:50',1,'synced','2025-09-15 06:58:50'),(692,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:02:50','2025-09-15 07:02:50',1,'synced','2025-09-15 07:02:50'),(694,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:05:51','2025-09-15 07:05:51',1,'synced','2025-09-15 07:05:51'),(696,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:08:50','2025-09-15 07:08:50',1,'synced','2025-09-15 07:08:50'),(698,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:11:50','2025-09-15 07:11:50',1,'synced','2025-09-15 07:11:50'),(700,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:13:50','2025-09-15 07:13:50',1,'synced','2025-09-15 07:13:50'),(702,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:16:50','2025-09-15 07:16:50',1,'synced','2025-09-15 07:16:50'),(704,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:20:49','2025-09-15 07:20:49',1,'synced','2025-09-15 07:20:49'),(706,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:23:49','2025-09-15 07:23:49',1,'synced','2025-09-15 07:23:49'),(708,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:26:50','2025-09-15 07:26:50',1,'synced','2025-09-15 07:26:50'),(710,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:29:50','2025-09-15 07:29:50',1,'synced','2025-09-15 07:29:50'),(712,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:32:50','2025-09-15 07:32:50',1,'synced','2025-09-15 07:32:50'),(714,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:35:50','2025-09-15 07:35:50',1,'synced','2025-09-15 07:35:50'),(716,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:38:50','2025-09-15 07:38:50',1,'synced','2025-09-15 07:38:50'),(718,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:41:49','2025-09-15 07:41:49',1,'synced','2025-09-15 07:41:49'),(720,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:44:49','2025-09-15 07:44:49',1,'synced','2025-09-15 07:44:49'),(722,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:47:49','2025-09-15 07:47:49',1,'synced','2025-09-15 07:47:49'),(724,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:50:50','2025-09-15 07:50:50',1,'synced','2025-09-15 07:50:50'),(726,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:53:50','2025-09-15 07:53:50',1,'synced','2025-09-15 07:53:50'),(728,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:56:50','2025-09-15 07:56:50',1,'synced','2025-09-15 07:56:50'),(730,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 07:59:50','2025-09-15 07:59:50',1,'synced','2025-09-15 07:59:50'),(732,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:02:50','2025-09-15 08:02:50',1,'synced','2025-09-15 08:02:50'),(734,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:05:49','2025-09-15 08:05:49',1,'synced','2025-09-15 08:05:49'),(736,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:08:49','2025-09-15 08:08:49',1,'synced','2025-09-15 08:08:49'),(738,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:11:50','2025-09-15 08:11:50',1,'synced','2025-09-15 08:11:50'),(740,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:14:50','2025-09-15 08:14:50',1,'synced','2025-09-15 08:14:50'),(742,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:17:50','2025-09-15 08:17:50',1,'synced','2025-09-15 08:17:50'),(744,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:20:50','2025-09-15 08:20:50',1,'synced','2025-09-15 08:20:50'),(746,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:23:50','2025-09-15 08:23:50',1,'synced','2025-09-15 08:23:50'),(748,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:26:49','2025-09-15 08:26:49',1,'synced','2025-09-15 08:26:49'),(750,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:29:49','2025-09-15 08:29:49',1,'synced','2025-09-15 08:29:49'),(752,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:32:49','2025-09-15 08:32:49',1,'synced','2025-09-15 08:32:49'),(754,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:35:50','2025-09-15 08:35:50',1,'synced','2025-09-15 08:35:50'),(756,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:38:50','2025-09-15 08:38:50',1,'synced','2025-09-15 08:38:50'),(758,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:41:50','2025-09-15 08:41:50',1,'synced','2025-09-15 08:41:50'),(760,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:44:50','2025-09-15 08:44:50',1,'synced','2025-09-15 08:44:50'),(762,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:47:50','2025-09-15 08:47:50',1,'synced','2025-09-15 08:47:50'),(764,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:50:49','2025-09-15 08:50:49',1,'synced','2025-09-15 08:50:49'),(766,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:54:07','2025-09-15 08:54:07',1,'synced','2025-09-15 08:54:07'),(768,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:57:10','2025-09-15 08:57:10',1,'synced','2025-09-15 08:57:10'),(770,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 08:59:50','2025-09-15 08:59:50',1,'synced','2025-09-15 08:59:50'),(772,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:02:52','2025-09-15 09:02:52',1,'synced','2025-09-15 09:02:52'),(774,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:05:50','2025-09-15 09:05:50',1,'synced','2025-09-15 09:05:50'),(776,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:08:50','2025-09-15 09:08:50',1,'synced','2025-09-15 09:08:50'),(778,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:11:51','2025-09-15 09:11:51',1,'synced','2025-09-15 09:11:51'),(780,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:14:50','2025-09-15 09:14:50',1,'synced','2025-09-15 09:14:50'),(782,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:17:49','2025-09-15 09:17:49',1,'synced','2025-09-15 09:17:49'),(784,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:20:50','2025-09-15 09:20:50',1,'synced','2025-09-15 09:20:50'),(786,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:23:50','2025-09-15 09:23:50',1,'synced','2025-09-15 09:23:50'),(788,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:26:50','2025-09-15 09:26:50',1,'synced','2025-09-15 09:26:50'),(790,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:29:50','2025-09-15 09:29:50',1,'synced','2025-09-15 09:29:50'),(792,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:32:51','2025-09-15 09:32:51',1,'synced','2025-09-15 09:32:51'),(794,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:35:51','2025-09-15 09:35:51',1,'synced','2025-09-15 09:35:51'),(796,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:38:50','2025-09-15 09:38:50',1,'synced','2025-09-15 09:38:50'),(798,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:41:50','2025-09-15 09:41:50',1,'synced','2025-09-15 09:41:50'),(800,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:44:50','2025-09-15 09:44:50',1,'synced','2025-09-15 09:44:50'),(802,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:47:50','2025-09-15 09:47:50',1,'synced','2025-09-15 09:47:50'),(804,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:50:50','2025-09-15 09:50:50',1,'synced','2025-09-15 09:50:50'),(806,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:53:50','2025-09-15 09:53:50',1,'synced','2025-09-15 09:53:50'),(808,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:56:50','2025-09-15 09:56:50',1,'synced','2025-09-15 09:56:50'),(810,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 09:59:49','2025-09-15 09:59:49',1,'synced','2025-09-15 09:59:49'),(812,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:02:50','2025-09-15 10:02:50',1,'synced','2025-09-15 10:02:50'),(814,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:05:50','2025-09-15 10:05:50',1,'synced','2025-09-15 10:05:50'),(816,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:08:49','2025-09-15 10:08:49',1,'synced','2025-09-15 10:08:49'),(818,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:11:50','2025-09-15 10:11:50',1,'synced','2025-09-15 10:11:50'),(820,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:14:50','2025-09-15 10:14:50',1,'synced','2025-09-15 10:14:50'),(822,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:17:50','2025-09-15 10:17:50',1,'synced','2025-09-15 10:17:50'),(824,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:20:50','2025-09-15 10:20:50',1,'synced','2025-09-15 10:20:50'),(826,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:23:50','2025-09-15 10:23:50',1,'synced','2025-09-15 10:23:50'),(828,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:26:53','2025-09-15 10:26:53',1,'synced','2025-09-15 10:26:53'),(830,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:29:49','2025-09-15 10:29:49',1,'synced','2025-09-15 10:29:49'),(832,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:32:49','2025-09-15 10:32:49',1,'synced','2025-09-15 10:32:49'),(834,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:35:50','2025-09-15 10:35:50',1,'synced','2025-09-15 10:35:50'),(836,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:38:50','2025-09-15 10:38:50',1,'synced','2025-09-15 10:38:50'),(838,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:41:50','2025-09-15 10:41:50',1,'synced','2025-09-15 10:41:50'),(840,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:44:50','2025-09-15 10:44:50',1,'synced','2025-09-15 10:44:50'),(842,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:47:50','2025-09-15 10:47:50',1,'synced','2025-09-15 10:47:50'),(844,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:50:50','2025-09-15 10:50:50',1,'synced','2025-09-15 10:50:50'),(846,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:53:49','2025-09-15 10:53:49',1,'synced','2025-09-15 10:53:49'),(848,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-09-15 10:56:53','2025-09-15 10:56:53',1,'synced','2025-09-15 10:56:53'),(850,'paused',NULL,'paused','#6E56CF',NULL,NULL,'2025-10-12 11:14:50','2025-10-12 11:14:50',1,'synced','2025-10-12 11:14:50');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_assignees`
--

DROP TABLE IF EXISTS `task_assignees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_assignees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_task_assignee` (`task_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `task_assignees_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignees_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1019 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_assignees`
--

LOCK TABLES `task_assignees` WRITE;
/*!40000 ALTER TABLE `task_assignees` DISABLE KEYS */;
INSERT INTO `task_assignees` VALUES (1014,1,3,'2025-10-12 11:14:28',NULL,1),(1015,2,1,'2025-10-12 11:14:28',NULL,1),(1016,22,2,'2025-10-12 11:14:29',NULL,1),(1017,5,4,'2025-10-12 11:14:29',NULL,1),(1018,17,1,'2025-10-12 11:14:31',NULL,1);
/*!40000 ALTER TABLE `task_assignees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_custom_fields`
--

DROP TABLE IF EXISTS `task_custom_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_custom_fields` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `custom_field_id` int NOT NULL,
  `value_text` text,
  `value_number` decimal(15,4) DEFAULT NULL,
  `value_date` datetime DEFAULT NULL,
  `value_boolean` tinyint(1) DEFAULT NULL,
  `value_json` json DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_task_field` (`task_id`,`custom_field_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_custom_field_id` (`custom_field_id`),
  KEY `idx_sync_status` (`sync_status`),
  CONSTRAINT `task_custom_fields_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_custom_fields_ibfk_2` FOREIGN KEY (`custom_field_id`) REFERENCES `custom_fields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40501 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_custom_fields`
--

LOCK TABLES `task_custom_fields` WRITE;
/*!40000 ALTER TABLE `task_custom_fields` DISABLE KEYS */;
INSERT INTO `task_custom_fields` VALUES (1,7,9,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(2,7,3,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(3,7,8,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(4,7,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(5,7,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(6,7,4,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(7,7,2,'[\"0e30302b-52f8-43f3-bc22-00eaa617b209\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(8,7,7,'Include all items',NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(9,7,5,'Include only most important items',NULL,NULL,NULL,NULL,'2025-09-10 09:40:30','2025-10-12 11:15:02','synced','2025-10-12 11:15:02'),(10,8,9,'6%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(11,8,3,'13.6%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(12,8,8,'3',3.0000,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(13,8,6,'Try orange button\n',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(14,8,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(15,8,4,'1',1.0000,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(16,8,2,'[\"0e30302b-52f8-43f3-bc22-00eaa617b209\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(17,8,7,'Orange button',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(18,8,5,'Green button',NULL,NULL,NULL,NULL,'2025-09-10 09:40:31','2025-10-12 11:15:03','synced','2025-10-12 11:15:03'),(19,9,9,'13%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(20,9,3,'15%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(21,9,8,'3',3.0000,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(22,9,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(23,9,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(24,9,4,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(25,9,2,'[\"0d6eda60-5c57-4a02-8b3f-c2d9e2ed051e\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(26,9,7,'Include \"CHEAP\"',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(27,9,5,'Include \"FREE\"',NULL,NULL,NULL,NULL,'2025-09-10 09:40:32','2025-10-12 11:15:04','synced','2025-10-12 11:15:04'),(28,10,9,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(29,10,3,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(30,10,8,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(31,10,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(32,10,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(33,10,4,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(34,10,2,'[\"0d6eda60-5c57-4a02-8b3f-c2d9e2ed051e\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(35,10,7,'Link to checkout',NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(36,10,5,'Link to product page',NULL,NULL,NULL,NULL,'2025-09-10 09:40:33','2025-10-12 11:15:05','synced','2025-10-12 11:15:05'),(37,11,9,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(38,11,3,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(39,11,8,'1',1.0000,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(40,11,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(41,11,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(42,11,4,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(43,11,2,'[\"c3269091-1c1b-489f-a679-d074f980ccd6\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(44,11,7,'Header image 1',NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(45,11,5,'Header image 2',NULL,NULL,NULL,NULL,'2025-09-10 09:40:34','2025-10-12 11:15:06','synced','2025-10-12 11:15:06'),(46,12,9,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(47,12,3,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(48,12,8,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(49,12,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(50,12,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(51,12,4,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(52,12,2,'[\"c3269091-1c1b-489f-a679-d074f980ccd6\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(53,12,7,'Subject Line A',NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(54,12,5,'Subject Line B',NULL,NULL,NULL,NULL,'2025-09-10 09:40:35','2025-10-12 11:15:07','synced','2025-10-12 11:15:07'),(55,13,9,'10%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(56,13,3,'14%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(57,13,8,'3',3.0000,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(58,13,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(59,13,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(60,13,4,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(61,13,2,'[\"c3269091-1c1b-489f-a679-d074f980ccd6\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(62,13,7,'Send to paid users',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(63,13,5,'Sent to free users',NULL,NULL,NULL,NULL,'2025-09-10 09:40:36','2025-10-12 11:15:08','synced','2025-10-12 11:15:08'),(64,14,9,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(65,14,3,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(66,14,8,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(67,14,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(68,14,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(69,14,4,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(70,14,2,'[\"0d6eda60-5c57-4a02-8b3f-c2d9e2ed051e\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(71,14,7,'With introduction',NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(72,14,5,'Without introduction',NULL,NULL,NULL,NULL,'2025-09-10 09:40:37','2025-10-12 11:15:09','synced','2025-10-12 11:15:09'),(73,15,9,'13%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(74,15,3,'19%',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(75,15,8,'3',3.0000,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(76,15,6,NULL,NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(77,15,1,'{\"percent_complete\":0}',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(78,15,4,'1',1.0000,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(79,15,2,'[\"0e30302b-52f8-43f3-bc22-00eaa617b209\"]',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(80,15,7,'Bright red',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(81,15,5,'Soft pink',NULL,NULL,NULL,NULL,'2025-09-10 09:40:38','2025-10-12 11:15:10','synced','2025-10-12 11:15:10'),(3783,4,856,'2',2.0000,NULL,NULL,NULL,'2025-09-10 13:06:59','2025-10-12 11:14:59','synced','2025-10-12 11:14:59'),(3784,5,856,NULL,0.0000,NULL,NULL,NULL,'2025-09-10 13:07:01','2025-10-12 11:15:00','synced','2025-10-12 11:15:00'),(3785,6,856,'2',2.0000,NULL,NULL,NULL,'2025-09-10 13:07:01','2025-10-12 11:15:01','synced','2025-10-12 11:15:01'),(3867,22,856,'3',3.0000,NULL,NULL,NULL,'2025-09-10 13:07:17','2025-10-12 11:15:17','synced','2025-10-12 11:15:17');
/*!40000 ALTER TABLE `task_custom_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_priorities`
--

DROP TABLE IF EXISTS `task_priorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_priorities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `priority_value` int NOT NULL,
  `priority_name` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_priorities`
--

LOCK TABLES `task_priorities` WRITE;
/*!40000 ALTER TABLE `task_priorities` DISABLE KEYS */;
INSERT INTO `task_priorities` VALUES (1,1,'Urgent','#f50000',1),(2,2,'High','#ffcc00',1),(3,3,'Normal','#6fddff',1),(4,4,'Low','#d8d8d8',1);
/*!40000 ALTER TABLE `task_priorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_statuses`
--

DROP TABLE IF EXISTS `task_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `list_id` int NOT NULL,
  `status` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL,
  `order_index` int NOT NULL,
  `type` enum('open','custom','done') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_list_id` (`list_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `task_statuses_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_statuses`
--

LOCK TABLES `task_statuses` WRITE;
/*!40000 ALTER TABLE `task_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_tags`
--

DROP TABLE IF EXISTS `task_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_tags` (
  `task_id` bigint NOT NULL,
  `tag_id` int NOT NULL,
  `tagged_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`task_id`,`tag_id`),
  KEY `task_tags_ibfk_2` (`tag_id`),
  CONSTRAINT `task_tags_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_tags`
--

LOCK TABLES `task_tags` WRITE;
/*!40000 ALTER TABLE `task_tags` DISABLE KEYS */;
INSERT INTO `task_tags` VALUES (17,1,'2025-09-10 12:45:49',NULL,NULL,'2025-09-10 12:45:49','2025-09-10 12:45:49','synced',NULL),(17,50,'2025-09-10 14:52:49',NULL,NULL,'2025-09-10 14:52:49','2025-09-10 14:52:49','synced','2025-09-10 14:52:49'),(17,52,'2025-09-10 14:55:49',NULL,NULL,'2025-09-10 14:55:49','2025-09-10 14:55:49','synced','2025-09-10 14:55:49'),(17,54,'2025-09-10 14:58:50',NULL,NULL,'2025-09-10 14:58:50','2025-09-10 14:58:50','synced','2025-09-10 14:58:50'),(17,56,'2025-09-10 15:01:50',NULL,NULL,'2025-09-10 15:01:50','2025-09-10 15:01:50','synced','2025-09-10 15:01:50'),(17,58,'2025-09-10 15:04:50',NULL,NULL,'2025-09-10 15:04:50','2025-09-10 15:04:50','synced','2025-09-10 15:04:50'),(17,60,'2025-09-10 15:06:49',NULL,NULL,'2025-09-10 15:06:49','2025-09-10 15:06:49','synced','2025-09-10 15:06:49'),(17,62,'2025-09-10 15:09:49',NULL,NULL,'2025-09-10 15:09:49','2025-09-10 15:09:49','synced','2025-09-10 15:09:49'),(17,64,'2025-09-10 15:12:49',NULL,NULL,'2025-09-10 15:12:49','2025-09-10 15:12:49','synced','2025-09-10 15:12:49'),(17,66,'2025-09-10 15:15:50',NULL,NULL,'2025-09-10 15:15:50','2025-09-10 15:15:50','synced','2025-09-10 15:15:50'),(17,68,'2025-09-10 15:18:50',NULL,NULL,'2025-09-10 15:18:50','2025-09-10 15:18:50','synced','2025-09-10 15:18:50'),(17,70,'2025-09-10 15:20:50',NULL,NULL,'2025-09-10 15:20:50','2025-09-10 15:20:50','synced','2025-09-10 15:20:50'),(17,73,'2025-09-10 15:24:49',NULL,NULL,'2025-09-10 15:24:49','2025-09-10 15:24:49','synced','2025-09-10 15:24:49'),(17,76,'2025-09-10 15:28:50',NULL,NULL,'2025-09-10 15:28:50','2025-09-10 15:28:50','synced','2025-09-10 15:28:50'),(17,78,'2025-09-10 15:31:49',NULL,NULL,'2025-09-10 15:31:49','2025-09-10 15:31:49','synced','2025-09-10 15:31:49'),(17,81,'2025-09-10 15:35:49',NULL,NULL,'2025-09-10 15:35:49','2025-09-10 15:35:49','synced','2025-09-10 15:35:49'),(17,83,'2025-09-10 15:38:50',NULL,NULL,'2025-09-10 15:38:50','2025-09-10 15:38:50','synced','2025-09-10 15:38:50'),(17,85,'2025-09-10 15:41:50',NULL,NULL,'2025-09-10 15:41:50','2025-09-10 15:41:50','synced','2025-09-10 15:41:50'),(17,87,'2025-09-10 15:44:50',NULL,NULL,'2025-09-10 15:44:50','2025-09-10 15:44:50','synced','2025-09-10 15:44:50'),(17,89,'2025-09-10 15:47:51',NULL,NULL,'2025-09-10 15:47:51','2025-09-10 15:47:51','synced','2025-09-10 15:47:51'),(17,91,'2025-09-10 15:50:50',NULL,NULL,'2025-09-10 15:50:50','2025-09-10 15:50:50','synced','2025-09-10 15:50:50'),(17,93,'2025-09-10 15:53:49',NULL,NULL,'2025-09-10 15:53:49','2025-09-10 15:53:49','synced','2025-09-10 15:53:49'),(17,95,'2025-09-10 15:56:49',NULL,NULL,'2025-09-10 15:56:49','2025-09-10 15:56:49','synced','2025-09-10 15:56:49'),(17,97,'2025-09-10 15:59:49',NULL,NULL,'2025-09-10 15:59:49','2025-09-10 15:59:49','synced','2025-09-10 15:59:49'),(17,99,'2025-09-10 16:02:50',NULL,NULL,'2025-09-10 16:02:50','2025-09-10 16:02:50','synced','2025-09-10 16:02:50'),(17,101,'2025-09-10 16:05:50',NULL,NULL,'2025-09-10 16:05:50','2025-09-10 16:05:50','synced','2025-09-10 16:05:50'),(17,103,'2025-09-10 16:08:50',NULL,NULL,'2025-09-10 16:08:50','2025-09-10 16:08:50','synced','2025-09-10 16:08:50'),(17,105,'2025-09-10 16:11:50',NULL,NULL,'2025-09-10 16:11:50','2025-09-10 16:11:50','synced','2025-09-10 16:11:50'),(17,107,'2025-09-10 16:14:50',NULL,NULL,'2025-09-10 16:14:50','2025-09-10 16:14:50','synced','2025-09-10 16:14:50'),(17,109,'2025-09-10 16:17:49',NULL,NULL,'2025-09-10 16:17:49','2025-09-10 16:17:49','synced','2025-09-10 16:17:49'),(17,111,'2025-09-10 16:20:49',NULL,NULL,'2025-09-10 16:20:49','2025-09-10 16:20:49','synced','2025-09-10 16:20:49'),(17,113,'2025-09-10 16:23:49',NULL,NULL,'2025-09-10 16:23:49','2025-09-10 16:23:49','synced','2025-09-10 16:23:49'),(17,115,'2025-09-10 16:26:50',NULL,NULL,'2025-09-10 16:26:50','2025-09-10 16:26:50','synced','2025-09-10 16:26:50'),(17,117,'2025-09-10 16:29:50',NULL,NULL,'2025-09-10 16:29:50','2025-09-10 16:29:50','synced','2025-09-10 16:29:50'),(17,119,'2025-09-10 16:32:50',NULL,NULL,'2025-09-10 16:32:50','2025-09-10 16:32:50','synced','2025-09-10 16:32:50'),(17,121,'2025-09-10 16:35:50',NULL,NULL,'2025-09-10 16:35:50','2025-09-10 16:35:50','synced','2025-09-10 16:35:50'),(17,123,'2025-09-10 16:38:50',NULL,NULL,'2025-09-10 16:38:50','2025-09-10 16:38:50','synced','2025-09-10 16:38:50'),(17,125,'2025-09-10 16:41:49',NULL,NULL,'2025-09-10 16:41:49','2025-09-10 16:41:49','synced','2025-09-10 16:41:49'),(17,127,'2025-09-10 16:44:49',NULL,NULL,'2025-09-10 16:44:49','2025-09-10 16:44:49','synced','2025-09-10 16:44:49'),(17,129,'2025-09-10 16:46:51',NULL,NULL,'2025-09-10 16:46:51','2025-09-10 16:46:51','synced','2025-09-10 16:46:51'),(17,131,'2025-09-10 16:49:49',NULL,NULL,'2025-09-10 16:49:49','2025-09-10 16:49:49','synced','2025-09-10 16:49:49'),(17,133,'2025-09-10 17:14:50',NULL,NULL,'2025-09-10 17:14:50','2025-09-10 17:14:50','synced','2025-09-10 17:14:50'),(17,135,'2025-09-10 17:17:49',NULL,NULL,'2025-09-10 17:17:49','2025-09-10 17:17:49','synced','2025-09-10 17:17:49'),(17,137,'2025-09-10 17:20:50',NULL,NULL,'2025-09-10 17:20:50','2025-09-10 17:20:50','synced','2025-09-10 17:20:50'),(17,139,'2025-09-10 17:23:49',NULL,NULL,'2025-09-10 17:23:49','2025-09-10 17:23:49','synced','2025-09-10 17:23:49'),(17,141,'2025-09-10 17:26:50',NULL,NULL,'2025-09-10 17:26:50','2025-09-10 17:26:50','synced','2025-09-10 17:26:50'),(17,143,'2025-09-10 17:29:50',NULL,NULL,'2025-09-10 17:29:50','2025-09-10 17:29:50','synced','2025-09-10 17:29:50'),(17,145,'2025-09-10 17:32:50',NULL,NULL,'2025-09-10 17:32:50','2025-09-10 17:32:50','synced','2025-09-10 17:32:50'),(17,147,'2025-09-10 17:35:50',NULL,NULL,'2025-09-10 17:35:50','2025-09-10 17:35:50','synced','2025-09-10 17:35:50'),(17,149,'2025-09-10 17:37:49',NULL,NULL,'2025-09-10 17:37:49','2025-09-10 17:37:49','synced','2025-09-10 17:37:49'),(17,151,'2025-09-10 17:40:50',NULL,NULL,'2025-09-10 17:40:50','2025-09-10 17:40:50','synced','2025-09-10 17:40:50'),(17,153,'2025-09-10 17:43:50',NULL,NULL,'2025-09-10 17:43:50','2025-09-10 17:43:50','synced','2025-09-10 17:43:50'),(17,155,'2025-09-10 17:46:50',NULL,NULL,'2025-09-10 17:46:50','2025-09-10 17:46:50','synced','2025-09-10 17:46:50'),(17,157,'2025-09-10 17:49:50',NULL,NULL,'2025-09-10 17:49:50','2025-09-10 17:49:50','synced','2025-09-10 17:49:50'),(17,159,'2025-09-10 17:52:50',NULL,NULL,'2025-09-10 17:52:50','2025-09-10 17:52:50','synced','2025-09-10 17:52:50'),(17,161,'2025-09-10 17:55:50',NULL,NULL,'2025-09-10 17:55:50','2025-09-10 17:55:50','synced','2025-09-10 17:55:50'),(17,163,'2025-09-10 17:58:49',NULL,NULL,'2025-09-10 17:58:49','2025-09-10 17:58:49','synced','2025-09-10 17:58:49'),(17,165,'2025-09-10 18:01:49',NULL,NULL,'2025-09-10 18:01:49','2025-09-10 18:01:49','synced','2025-09-10 18:01:49'),(17,167,'2025-09-10 18:04:49',NULL,NULL,'2025-09-10 18:04:49','2025-09-10 18:04:49','synced','2025-09-10 18:04:49'),(17,169,'2025-09-10 18:07:50',NULL,NULL,'2025-09-10 18:07:50','2025-09-10 18:07:50','synced','2025-09-10 18:07:50'),(17,171,'2025-09-10 18:10:50',NULL,NULL,'2025-09-10 18:10:50','2025-09-10 18:10:50','synced','2025-09-10 18:10:50'),(17,173,'2025-09-10 18:13:50',NULL,NULL,'2025-09-10 18:13:50','2025-09-10 18:13:50','synced','2025-09-10 18:13:50'),(17,175,'2025-09-10 18:16:50',NULL,NULL,'2025-09-10 18:16:50','2025-09-10 18:16:50','synced','2025-09-10 18:16:50'),(17,177,'2025-09-10 18:19:50',NULL,NULL,'2025-09-10 18:19:50','2025-09-10 18:19:50','synced','2025-09-10 18:19:50'),(17,179,'2025-09-10 18:22:50',NULL,NULL,'2025-09-10 18:22:50','2025-09-10 18:22:50','synced','2025-09-10 18:22:50'),(17,181,'2025-09-10 18:25:49',NULL,NULL,'2025-09-10 18:25:49','2025-09-10 18:25:49','synced','2025-09-10 18:25:49'),(17,183,'2025-09-10 18:28:49',NULL,NULL,'2025-09-10 18:28:49','2025-09-10 18:28:49','synced','2025-09-10 18:28:49'),(17,185,'2025-09-10 18:31:49',NULL,NULL,'2025-09-10 18:31:49','2025-09-10 18:31:49','synced','2025-09-10 18:31:49'),(17,187,'2025-09-10 18:34:50',NULL,NULL,'2025-09-10 18:34:50','2025-09-10 18:34:50','synced','2025-09-10 18:34:50'),(17,189,'2025-09-10 18:37:50',NULL,NULL,'2025-09-10 18:37:50','2025-09-10 18:37:50','synced','2025-09-10 18:37:50'),(17,191,'2025-09-10 18:40:50',NULL,NULL,'2025-09-10 18:40:50','2025-09-10 18:40:50','synced','2025-09-10 18:40:50'),(17,193,'2025-09-10 18:43:50',NULL,NULL,'2025-09-10 18:43:50','2025-09-10 18:43:50','synced','2025-09-10 18:43:50'),(17,195,'2025-09-10 18:46:50',NULL,NULL,'2025-09-10 18:46:50','2025-09-10 18:46:50','synced','2025-09-10 18:46:50'),(17,197,'2025-09-10 18:49:50',NULL,NULL,'2025-09-10 18:49:50','2025-09-10 18:49:50','synced','2025-09-10 18:49:50'),(17,199,'2025-09-10 18:52:49',NULL,NULL,'2025-09-10 18:52:49','2025-09-10 18:52:49','synced','2025-09-10 18:52:49'),(17,201,'2025-09-10 18:55:49',NULL,NULL,'2025-09-10 18:55:49','2025-09-10 18:55:49','synced','2025-09-10 18:55:49'),(17,203,'2025-09-10 18:58:49',NULL,NULL,'2025-09-10 18:58:49','2025-09-10 18:58:49','synced','2025-09-10 18:58:49'),(17,205,'2025-09-10 19:01:50',NULL,NULL,'2025-09-10 19:01:50','2025-09-10 19:01:50','synced','2025-09-10 19:01:50'),(17,207,'2025-09-10 19:04:50',NULL,NULL,'2025-09-10 19:04:50','2025-09-10 19:04:50','synced','2025-09-10 19:04:50'),(17,209,'2025-09-10 19:07:52',NULL,NULL,'2025-09-10 19:07:52','2025-09-10 19:07:52','synced','2025-09-10 19:07:52'),(17,211,'2025-09-10 19:10:50',NULL,NULL,'2025-09-10 19:10:50','2025-09-10 19:10:50','synced','2025-09-10 19:10:50'),(17,213,'2025-09-10 19:13:50',NULL,NULL,'2025-09-10 19:13:50','2025-09-10 19:13:50','synced','2025-09-10 19:13:50'),(17,215,'2025-09-10 19:16:50',NULL,NULL,'2025-09-10 19:16:50','2025-09-10 19:16:50','synced','2025-09-10 19:16:50'),(17,217,'2025-09-10 19:19:49',NULL,NULL,'2025-09-10 19:19:49','2025-09-10 19:19:49','synced','2025-09-10 19:19:49'),(17,219,'2025-09-10 19:22:49',NULL,NULL,'2025-09-10 19:22:49','2025-09-10 19:22:49','synced','2025-09-10 19:22:49'),(17,221,'2025-09-10 19:25:49',NULL,NULL,'2025-09-10 19:25:49','2025-09-10 19:25:49','synced','2025-09-10 19:25:49'),(17,223,'2025-09-10 19:28:50',NULL,NULL,'2025-09-10 19:28:50','2025-09-10 19:28:50','synced','2025-09-10 19:28:50'),(17,225,'2025-09-10 19:31:50',NULL,NULL,'2025-09-10 19:31:50','2025-09-10 19:31:50','synced','2025-09-10 19:31:50'),(17,227,'2025-09-10 19:34:50',NULL,NULL,'2025-09-10 19:34:50','2025-09-10 19:34:50','synced','2025-09-10 19:34:50'),(17,229,'2025-09-10 19:37:50',NULL,NULL,'2025-09-10 19:37:50','2025-09-10 19:37:50','synced','2025-09-10 19:37:50'),(17,231,'2025-09-10 19:40:50',NULL,NULL,'2025-09-10 19:40:50','2025-09-10 19:40:50','synced','2025-09-10 19:40:50'),(17,233,'2025-09-10 19:43:50',NULL,NULL,'2025-09-10 19:43:50','2025-09-10 19:43:50','synced','2025-09-10 19:43:50'),(17,235,'2025-09-10 19:46:49',NULL,NULL,'2025-09-10 19:46:49','2025-09-10 19:46:49','synced','2025-09-10 19:46:49'),(17,237,'2025-09-10 19:49:50',NULL,NULL,'2025-09-10 19:49:50','2025-09-10 19:49:50','synced','2025-09-10 19:49:50'),(17,239,'2025-09-10 19:52:49',NULL,NULL,'2025-09-10 19:52:49','2025-09-10 19:52:49','synced','2025-09-10 19:52:49'),(17,241,'2025-09-10 19:55:50',NULL,NULL,'2025-09-10 19:55:50','2025-09-10 19:55:50','synced','2025-09-10 19:55:50'),(17,243,'2025-09-10 19:58:50',NULL,NULL,'2025-09-10 19:58:50','2025-09-10 19:58:50','synced','2025-09-10 19:58:50'),(17,245,'2025-09-10 20:01:50',NULL,NULL,'2025-09-10 20:01:50','2025-09-10 20:01:50','synced','2025-09-10 20:01:50'),(17,247,'2025-09-10 20:04:50',NULL,NULL,'2025-09-10 20:04:50','2025-09-10 20:04:50','synced','2025-09-10 20:04:50'),(17,249,'2025-09-10 20:07:50',NULL,NULL,'2025-09-10 20:07:50','2025-09-10 20:07:50','synced','2025-09-10 20:07:50'),(17,251,'2025-09-10 20:10:50',NULL,NULL,'2025-09-10 20:10:50','2025-09-10 20:10:50','synced','2025-09-10 20:10:50'),(17,253,'2025-09-10 20:13:49',NULL,NULL,'2025-09-10 20:13:49','2025-09-10 20:13:49','synced','2025-09-10 20:13:49'),(17,255,'2025-09-10 20:16:50',NULL,NULL,'2025-09-10 20:16:50','2025-09-10 20:16:50','synced','2025-09-10 20:16:50'),(17,257,'2025-09-10 20:19:51',NULL,NULL,'2025-09-10 20:19:51','2025-09-10 20:19:51','synced','2025-09-10 20:19:51'),(17,259,'2025-09-10 20:22:49',NULL,NULL,'2025-09-10 20:22:49','2025-09-10 20:22:49','synced','2025-09-10 20:22:49'),(17,261,'2025-09-10 20:25:50',NULL,NULL,'2025-09-10 20:25:50','2025-09-10 20:25:50','synced','2025-09-10 20:25:50'),(17,263,'2025-09-10 20:28:50',NULL,NULL,'2025-09-10 20:28:50','2025-09-10 20:28:50','synced','2025-09-10 20:28:50'),(17,265,'2025-09-10 20:31:50',NULL,NULL,'2025-09-10 20:31:50','2025-09-10 20:31:50','synced','2025-09-10 20:31:50'),(17,267,'2025-09-10 20:34:50',NULL,NULL,'2025-09-10 20:34:50','2025-09-10 20:34:50','synced','2025-09-10 20:34:50'),(17,269,'2025-09-10 20:37:50',NULL,NULL,'2025-09-10 20:37:50','2025-09-10 20:37:50','synced','2025-09-10 20:37:50'),(17,271,'2025-09-10 20:40:49',NULL,NULL,'2025-09-10 20:40:49','2025-09-10 20:40:49','synced','2025-09-10 20:40:49'),(17,273,'2025-09-10 20:43:50',NULL,NULL,'2025-09-10 20:43:50','2025-09-10 20:43:50','synced','2025-09-10 20:43:50'),(17,275,'2025-09-10 20:46:50',NULL,NULL,'2025-09-10 20:46:50','2025-09-10 20:46:50','synced','2025-09-10 20:46:50'),(17,277,'2025-09-10 20:49:50',NULL,NULL,'2025-09-10 20:49:50','2025-09-10 20:49:50','synced','2025-09-10 20:49:50'),(17,279,'2025-09-10 20:52:50',NULL,NULL,'2025-09-10 20:52:50','2025-09-10 20:52:50','synced','2025-09-10 20:52:50'),(17,281,'2025-09-10 20:55:50',NULL,NULL,'2025-09-10 20:55:50','2025-09-10 20:55:50','synced','2025-09-10 20:55:50'),(17,283,'2025-09-10 20:58:50',NULL,NULL,'2025-09-10 20:58:50','2025-09-10 20:58:50','synced','2025-09-10 20:58:50'),(17,285,'2025-09-10 21:02:53',NULL,NULL,'2025-09-10 21:02:53','2025-09-10 21:02:53','synced','2025-09-10 21:02:53'),(17,287,'2025-09-10 21:05:50',NULL,NULL,'2025-09-10 21:05:50','2025-09-10 21:05:50','synced','2025-09-10 21:05:50'),(17,289,'2025-09-10 21:08:49',NULL,NULL,'2025-09-10 21:08:49','2025-09-10 21:08:49','synced','2025-09-10 21:08:49'),(17,291,'2025-09-10 21:11:50',NULL,NULL,'2025-09-10 21:11:50','2025-09-10 21:11:50','synced','2025-09-10 21:11:50'),(17,293,'2025-09-10 21:14:50',NULL,NULL,'2025-09-10 21:14:50','2025-09-10 21:14:50','synced','2025-09-10 21:14:50'),(17,295,'2025-09-10 21:17:50',NULL,NULL,'2025-09-10 21:17:50','2025-09-10 21:17:50','synced','2025-09-10 21:17:50'),(17,297,'2025-09-10 21:20:50',NULL,NULL,'2025-09-10 21:20:50','2025-09-10 21:20:50','synced','2025-09-10 21:20:50'),(17,299,'2025-09-10 21:23:50',NULL,NULL,'2025-09-10 21:23:50','2025-09-10 21:23:50','synced','2025-09-10 21:23:50'),(17,301,'2025-09-10 21:26:49',NULL,NULL,'2025-09-10 21:26:49','2025-09-10 21:26:49','synced','2025-09-10 21:26:49'),(17,303,'2025-09-10 21:29:49',NULL,NULL,'2025-09-10 21:29:49','2025-09-10 21:29:49','synced','2025-09-10 21:29:49'),(17,305,'2025-09-10 21:32:50',NULL,NULL,'2025-09-10 21:32:50','2025-09-10 21:32:50','synced','2025-09-10 21:32:50'),(17,307,'2025-09-10 21:35:50',NULL,NULL,'2025-09-10 21:35:50','2025-09-10 21:35:50','synced','2025-09-10 21:35:50'),(17,309,'2025-09-10 21:38:50',NULL,NULL,'2025-09-10 21:38:50','2025-09-10 21:38:50','synced','2025-09-10 21:38:50'),(17,311,'2025-09-10 21:41:51',NULL,NULL,'2025-09-10 21:41:51','2025-09-10 21:41:51','synced','2025-09-10 21:41:51'),(17,313,'2025-09-10 21:44:49',NULL,NULL,'2025-09-10 21:44:49','2025-09-10 21:44:49','synced','2025-09-10 21:44:49'),(17,315,'2025-09-10 21:47:49',NULL,NULL,'2025-09-10 21:47:49','2025-09-10 21:47:49','synced','2025-09-10 21:47:49'),(17,317,'2025-09-10 21:50:49',NULL,NULL,'2025-09-10 21:50:49','2025-09-10 21:50:49','synced','2025-09-10 21:50:49'),(17,319,'2025-09-10 21:53:50',NULL,NULL,'2025-09-10 21:53:50','2025-09-10 21:53:50','synced','2025-09-10 21:53:50'),(17,321,'2025-09-10 21:56:50',NULL,NULL,'2025-09-10 21:56:50','2025-09-10 21:56:50','synced','2025-09-10 21:56:50'),(17,323,'2025-09-10 21:59:50',NULL,NULL,'2025-09-10 21:59:50','2025-09-10 21:59:50','synced','2025-09-10 21:59:50'),(17,325,'2025-09-10 22:02:49',NULL,NULL,'2025-09-10 22:02:49','2025-09-10 22:02:49','synced','2025-09-10 22:02:49'),(17,327,'2025-09-10 22:05:49',NULL,NULL,'2025-09-10 22:05:49','2025-09-10 22:05:49','synced','2025-09-10 22:05:49'),(17,329,'2025-09-10 22:08:50',NULL,NULL,'2025-09-10 22:08:50','2025-09-10 22:08:50','synced','2025-09-10 22:08:50'),(17,331,'2025-09-10 22:11:50',NULL,NULL,'2025-09-10 22:11:50','2025-09-10 22:11:50','synced','2025-09-10 22:11:50'),(17,333,'2025-09-10 22:14:50',NULL,NULL,'2025-09-10 22:14:50','2025-09-10 22:14:50','synced','2025-09-10 22:14:50'),(17,335,'2025-09-10 22:17:50',NULL,NULL,'2025-09-10 22:17:50','2025-09-10 22:17:50','synced','2025-09-10 22:17:50'),(17,337,'2025-09-10 22:20:49',NULL,NULL,'2025-09-10 22:20:49','2025-09-10 22:20:49','synced','2025-09-10 22:20:49'),(17,339,'2025-09-10 22:23:49',NULL,NULL,'2025-09-10 22:23:49','2025-09-10 22:23:49','synced','2025-09-10 22:23:49'),(17,341,'2025-09-10 22:26:50',NULL,NULL,'2025-09-10 22:26:50','2025-09-10 22:26:50','synced','2025-09-10 22:26:50'),(17,343,'2025-09-10 22:29:50',NULL,NULL,'2025-09-10 22:29:50','2025-09-10 22:29:50','synced','2025-09-10 22:29:50'),(17,345,'2025-09-10 22:32:50',NULL,NULL,'2025-09-10 22:32:50','2025-09-10 22:32:50','synced','2025-09-10 22:32:50'),(17,347,'2025-09-10 22:35:50',NULL,NULL,'2025-09-10 22:35:50','2025-09-10 22:35:50','synced','2025-09-10 22:35:50'),(17,349,'2025-09-10 22:38:50',NULL,NULL,'2025-09-10 22:38:50','2025-09-10 22:38:50','synced','2025-09-10 22:38:50'),(17,351,'2025-09-10 22:41:50',NULL,NULL,'2025-09-10 22:41:50','2025-09-10 22:41:50','synced','2025-09-10 22:41:50'),(17,353,'2025-09-10 22:44:49',NULL,NULL,'2025-09-10 22:44:49','2025-09-10 22:44:49','synced','2025-09-10 22:44:49'),(17,355,'2025-09-10 22:47:49',NULL,NULL,'2025-09-10 22:47:49','2025-09-10 22:47:49','synced','2025-09-10 22:47:49'),(17,357,'2025-09-10 22:50:50',NULL,NULL,'2025-09-10 22:50:50','2025-09-10 22:50:50','synced','2025-09-10 22:50:50'),(17,359,'2025-09-10 22:53:50',NULL,NULL,'2025-09-10 22:53:50','2025-09-10 22:53:50','synced','2025-09-10 22:53:50'),(17,361,'2025-09-10 22:56:52',NULL,NULL,'2025-09-10 22:56:52','2025-09-10 22:56:52','synced','2025-09-10 22:56:52'),(17,363,'2025-09-10 22:59:50',NULL,NULL,'2025-09-10 22:59:50','2025-09-10 22:59:50','synced','2025-09-10 22:59:50'),(17,365,'2025-09-10 23:02:52',NULL,NULL,'2025-09-10 23:02:52','2025-09-10 23:02:52','synced','2025-09-10 23:02:52'),(17,367,'2025-09-10 23:05:50',NULL,NULL,'2025-09-10 23:05:50','2025-09-10 23:05:50','synced','2025-09-10 23:05:50'),(17,369,'2025-09-10 23:08:50',NULL,NULL,'2025-09-10 23:08:50','2025-09-10 23:08:50','synced','2025-09-10 23:08:50'),(17,371,'2025-09-10 23:11:50',NULL,NULL,'2025-09-10 23:11:50','2025-09-10 23:11:50','synced','2025-09-10 23:11:50'),(17,373,'2025-09-10 23:14:50',NULL,NULL,'2025-09-10 23:14:50','2025-09-10 23:14:50','synced','2025-09-10 23:14:50'),(17,375,'2025-09-10 23:17:50',NULL,NULL,'2025-09-10 23:17:50','2025-09-10 23:17:50','synced','2025-09-10 23:17:50'),(17,377,'2025-09-10 23:20:49',NULL,NULL,'2025-09-10 23:20:49','2025-09-10 23:20:49','synced','2025-09-10 23:20:49'),(17,379,'2025-09-10 23:23:49',NULL,NULL,'2025-09-10 23:23:49','2025-09-10 23:23:49','synced','2025-09-10 23:23:49'),(17,381,'2025-09-10 23:26:49',NULL,NULL,'2025-09-10 23:26:49','2025-09-10 23:26:49','synced','2025-09-10 23:26:49'),(17,383,'2025-09-10 23:29:50',NULL,NULL,'2025-09-10 23:29:50','2025-09-10 23:29:50','synced','2025-09-10 23:29:50'),(17,385,'2025-09-10 23:32:52',NULL,NULL,'2025-09-10 23:32:52','2025-09-10 23:32:52','synced','2025-09-10 23:32:52'),(17,387,'2025-09-10 23:35:50',NULL,NULL,'2025-09-10 23:35:50','2025-09-10 23:35:50','synced','2025-09-10 23:35:50'),(17,389,'2025-09-10 23:38:50',NULL,NULL,'2025-09-10 23:38:50','2025-09-10 23:38:50','synced','2025-09-10 23:38:50'),(17,391,'2025-09-10 23:41:50',NULL,NULL,'2025-09-10 23:41:50','2025-09-10 23:41:50','synced','2025-09-10 23:41:50'),(17,393,'2025-09-10 23:44:49',NULL,NULL,'2025-09-10 23:44:49','2025-09-10 23:44:49','synced','2025-09-10 23:44:49'),(17,395,'2025-09-10 23:47:49',NULL,NULL,'2025-09-10 23:47:49','2025-09-10 23:47:49','synced','2025-09-10 23:47:49'),(17,397,'2025-09-10 23:50:49',NULL,NULL,'2025-09-10 23:50:49','2025-09-10 23:50:49','synced','2025-09-10 23:50:49'),(17,399,'2025-09-10 23:53:50',NULL,NULL,'2025-09-10 23:53:50','2025-09-10 23:53:50','synced','2025-09-10 23:53:50'),(17,401,'2025-09-10 23:56:50',NULL,NULL,'2025-09-10 23:56:50','2025-09-10 23:56:50','synced','2025-09-10 23:56:50'),(17,403,'2025-09-10 23:59:50',NULL,NULL,'2025-09-10 23:59:50','2025-09-10 23:59:50','synced','2025-09-10 23:59:50'),(17,405,'2025-09-11 00:02:50',NULL,NULL,'2025-09-11 00:02:50','2025-09-11 00:02:50','synced','2025-09-11 00:02:50'),(17,407,'2025-09-11 00:05:50',NULL,NULL,'2025-09-11 00:05:50','2025-09-11 00:05:50','synced','2025-09-11 00:05:50'),(17,409,'2025-09-11 00:08:50',NULL,NULL,'2025-09-11 00:08:50','2025-09-11 00:08:50','synced','2025-09-11 00:08:50'),(17,411,'2025-09-11 00:11:49',NULL,NULL,'2025-09-11 00:11:49','2025-09-11 00:11:49','synced','2025-09-11 00:11:49'),(17,413,'2025-09-11 00:14:50',NULL,NULL,'2025-09-11 00:14:50','2025-09-11 00:14:50','synced','2025-09-11 00:14:50'),(17,415,'2025-09-11 00:17:49',NULL,NULL,'2025-09-11 00:17:49','2025-09-11 00:17:49','synced','2025-09-11 00:17:49'),(17,417,'2025-09-11 00:20:50',NULL,NULL,'2025-09-11 00:20:50','2025-09-11 00:20:50','synced','2025-09-11 00:20:50'),(17,419,'2025-09-11 00:23:50',NULL,NULL,'2025-09-11 00:23:50','2025-09-11 00:23:50','synced','2025-09-11 00:23:50'),(17,421,'2025-09-11 00:26:50',NULL,NULL,'2025-09-11 00:26:50','2025-09-11 00:26:50','synced','2025-09-11 00:26:50'),(17,423,'2025-09-11 00:29:50',NULL,NULL,'2025-09-11 00:29:50','2025-09-11 00:29:50','synced','2025-09-11 00:29:50'),(17,425,'2025-09-11 00:32:50',NULL,NULL,'2025-09-11 00:32:50','2025-09-11 00:32:50','synced','2025-09-11 00:32:50'),(17,427,'2025-09-11 00:35:50',NULL,NULL,'2025-09-11 00:35:50','2025-09-11 00:35:50','synced','2025-09-11 00:35:50'),(17,429,'2025-09-11 00:38:49',NULL,NULL,'2025-09-11 00:38:49','2025-09-11 00:38:49','synced','2025-09-11 00:38:49'),(17,431,'2025-09-11 00:41:49',NULL,NULL,'2025-09-11 00:41:49','2025-09-11 00:41:49','synced','2025-09-11 00:41:49'),(17,433,'2025-09-11 00:44:49',NULL,NULL,'2025-09-11 00:44:49','2025-09-11 00:44:49','synced','2025-09-11 00:44:49'),(17,435,'2025-09-11 00:47:49',NULL,NULL,'2025-09-11 00:47:49','2025-09-11 00:47:49','synced','2025-09-11 00:47:49'),(17,437,'2025-09-11 00:50:50',NULL,NULL,'2025-09-11 00:50:50','2025-09-11 00:50:50','synced','2025-09-11 00:50:50'),(17,439,'2025-09-11 00:53:50',NULL,NULL,'2025-09-11 00:53:50','2025-09-11 00:53:50','synced','2025-09-11 00:53:50'),(17,441,'2025-09-11 00:56:50',NULL,NULL,'2025-09-11 00:56:50','2025-09-11 00:56:50','synced','2025-09-11 00:56:50'),(17,443,'2025-09-11 00:59:50',NULL,NULL,'2025-09-11 00:59:50','2025-09-11 00:59:50','synced','2025-09-11 00:59:50'),(17,445,'2025-09-11 01:02:49',NULL,NULL,'2025-09-11 01:02:49','2025-09-11 01:02:49','synced','2025-09-11 01:02:49'),(17,447,'2025-09-11 01:05:49',NULL,NULL,'2025-09-11 01:05:49','2025-09-11 01:05:49','synced','2025-09-11 01:05:49'),(17,449,'2025-09-11 06:53:49',NULL,NULL,'2025-09-11 06:53:49','2025-09-11 06:53:49','synced','2025-09-11 06:53:49'),(17,451,'2025-09-11 06:56:49',NULL,NULL,'2025-09-11 06:56:49','2025-09-11 06:56:49','synced','2025-09-11 06:56:49'),(17,453,'2025-09-11 06:59:50',NULL,NULL,'2025-09-11 06:59:50','2025-09-11 06:59:50','synced','2025-09-11 06:59:50'),(17,455,'2025-09-11 07:02:50',NULL,NULL,'2025-09-11 07:02:50','2025-09-11 07:02:50','synced','2025-09-11 07:02:50'),(17,457,'2025-09-11 07:05:50',NULL,NULL,'2025-09-11 07:05:50','2025-09-11 07:05:50','synced','2025-09-11 07:05:50'),(17,459,'2025-09-11 07:08:50',NULL,NULL,'2025-09-11 07:08:50','2025-09-11 07:08:50','synced','2025-09-11 07:08:50'),(17,461,'2025-09-11 07:11:50',NULL,NULL,'2025-09-11 07:11:50','2025-09-11 07:11:50','synced','2025-09-11 07:11:50'),(17,463,'2025-09-11 07:14:51',NULL,NULL,'2025-09-11 07:14:51','2025-09-11 07:14:51','synced','2025-09-11 07:14:51'),(17,465,'2025-09-11 07:17:49',NULL,NULL,'2025-09-11 07:17:49','2025-09-11 07:17:49','synced','2025-09-11 07:17:49'),(17,467,'2025-09-11 07:20:49',NULL,NULL,'2025-09-11 07:20:49','2025-09-11 07:20:49','synced','2025-09-11 07:20:49'),(17,469,'2025-09-11 07:23:50',NULL,NULL,'2025-09-11 07:23:50','2025-09-11 07:23:50','synced','2025-09-11 07:23:50'),(17,471,'2025-09-11 07:26:50',NULL,NULL,'2025-09-11 07:26:50','2025-09-11 07:26:50','synced','2025-09-11 07:26:50'),(17,473,'2025-09-11 07:29:50',NULL,NULL,'2025-09-11 07:29:50','2025-09-11 07:29:50','synced','2025-09-11 07:29:50'),(17,475,'2025-09-11 07:32:50',NULL,NULL,'2025-09-11 07:32:50','2025-09-11 07:32:50','synced','2025-09-11 07:32:50'),(17,477,'2025-09-11 07:35:51',NULL,NULL,'2025-09-11 07:35:51','2025-09-11 07:35:51','synced','2025-09-11 07:35:51'),(17,479,'2025-09-11 07:38:50',NULL,NULL,'2025-09-11 07:38:50','2025-09-11 07:38:50','synced','2025-09-11 07:38:50'),(17,481,'2025-09-11 07:41:49',NULL,NULL,'2025-09-11 07:41:49','2025-09-11 07:41:49','synced','2025-09-11 07:41:49'),(17,483,'2025-09-11 07:44:50',NULL,NULL,'2025-09-11 07:44:50','2025-09-11 07:44:50','synced','2025-09-11 07:44:50'),(17,485,'2025-09-11 07:47:49',NULL,NULL,'2025-09-11 07:47:49','2025-09-11 07:47:49','synced','2025-09-11 07:47:49'),(17,487,'2025-09-11 07:50:51',NULL,NULL,'2025-09-11 07:50:51','2025-09-11 07:50:51','synced','2025-09-11 07:50:51'),(17,489,'2025-09-11 07:53:50',NULL,NULL,'2025-09-11 07:53:50','2025-09-11 07:53:50','synced','2025-09-11 07:53:50'),(17,491,'2025-09-11 07:56:50',NULL,NULL,'2025-09-11 07:56:50','2025-09-11 07:56:50','synced','2025-09-11 07:56:50'),(17,493,'2025-09-11 07:59:50',NULL,NULL,'2025-09-11 07:59:50','2025-09-11 07:59:50','synced','2025-09-11 07:59:50'),(17,495,'2025-09-11 08:02:50',NULL,NULL,'2025-09-11 08:02:50','2025-09-11 08:02:50','synced','2025-09-11 08:02:50'),(17,497,'2025-09-11 08:05:50',NULL,NULL,'2025-09-11 08:05:50','2025-09-11 08:05:50','synced','2025-09-11 08:05:50'),(17,499,'2025-09-11 08:08:50',NULL,NULL,'2025-09-11 08:08:50','2025-09-11 08:08:50','synced','2025-09-11 08:08:50'),(17,501,'2025-09-11 08:11:50',NULL,NULL,'2025-09-11 08:11:50','2025-09-11 08:11:50','synced','2025-09-11 08:11:50'),(17,503,'2025-09-11 08:14:54',NULL,NULL,'2025-09-11 08:14:54','2025-09-11 08:14:54','synced','2025-09-11 08:14:54'),(17,505,'2025-09-11 08:17:50',NULL,NULL,'2025-09-11 08:17:50','2025-09-11 08:17:50','synced','2025-09-11 08:17:50'),(17,507,'2025-09-11 08:20:50',NULL,NULL,'2025-09-11 08:20:50','2025-09-11 08:20:50','synced','2025-09-11 08:20:50'),(17,509,'2025-09-11 08:23:49',NULL,NULL,'2025-09-11 08:23:49','2025-09-11 08:23:49','synced','2025-09-11 08:23:49'),(17,511,'2025-09-11 08:26:51',NULL,NULL,'2025-09-11 08:26:51','2025-09-11 08:26:51','synced','2025-09-11 08:26:51'),(17,513,'2025-09-11 08:29:51',NULL,NULL,'2025-09-11 08:29:51','2025-09-11 08:29:51','synced','2025-09-11 08:29:51'),(17,515,'2025-09-11 08:32:50',NULL,NULL,'2025-09-11 08:32:50','2025-09-11 08:32:50','synced','2025-09-11 08:32:50'),(17,517,'2025-09-11 08:35:50',NULL,NULL,'2025-09-11 08:35:50','2025-09-11 08:35:50','synced','2025-09-11 08:35:50'),(17,519,'2025-09-11 08:38:50',NULL,NULL,'2025-09-11 08:38:50','2025-09-11 08:38:50','synced','2025-09-11 08:38:50'),(17,521,'2025-09-11 08:41:50',NULL,NULL,'2025-09-11 08:41:50','2025-09-11 08:41:50','synced','2025-09-11 08:41:50'),(17,523,'2025-09-11 08:44:49',NULL,NULL,'2025-09-11 08:44:49','2025-09-11 08:44:49','synced','2025-09-11 08:44:49'),(17,525,'2025-09-11 08:47:50',NULL,NULL,'2025-09-11 08:47:50','2025-09-11 08:47:50','synced','2025-09-11 08:47:50'),(17,527,'2025-09-11 08:50:50',NULL,NULL,'2025-09-11 08:50:50','2025-09-11 08:50:50','synced','2025-09-11 08:50:50'),(17,529,'2025-09-11 08:53:50',NULL,NULL,'2025-09-11 08:53:50','2025-09-11 08:53:50','synced','2025-09-11 08:53:50'),(17,531,'2025-09-11 08:56:49',NULL,NULL,'2025-09-11 08:56:49','2025-09-11 08:56:49','synced','2025-09-11 08:56:49'),(17,533,'2025-09-11 08:59:49',NULL,NULL,'2025-09-11 08:59:49','2025-09-11 08:59:49','synced','2025-09-11 08:59:49'),(17,535,'2025-09-11 09:02:50',NULL,NULL,'2025-09-11 09:02:50','2025-09-11 09:02:50','synced','2025-09-11 09:02:50'),(17,537,'2025-09-11 09:05:50',NULL,NULL,'2025-09-11 09:05:50','2025-09-11 09:05:50','synced','2025-09-11 09:05:50'),(17,539,'2025-09-11 09:08:50',NULL,NULL,'2025-09-11 09:08:50','2025-09-11 09:08:50','synced','2025-09-11 09:08:50'),(17,541,'2025-09-11 09:11:50',NULL,NULL,'2025-09-11 09:11:50','2025-09-11 09:11:50','synced','2025-09-11 09:11:50'),(17,543,'2025-09-11 09:14:50',NULL,NULL,'2025-09-11 09:14:50','2025-09-11 09:14:50','synced','2025-09-11 09:14:50'),(17,545,'2025-09-11 09:17:49',NULL,NULL,'2025-09-11 09:17:49','2025-09-11 09:17:49','synced','2025-09-11 09:17:49'),(17,547,'2025-09-11 09:20:49',NULL,NULL,'2025-09-11 09:20:49','2025-09-11 09:20:49','synced','2025-09-11 09:20:49'),(17,549,'2025-09-11 09:23:50',NULL,NULL,'2025-09-11 09:23:50','2025-09-11 09:23:50','synced','2025-09-11 09:23:50'),(17,551,'2025-09-11 09:26:50',NULL,NULL,'2025-09-11 09:26:50','2025-09-11 09:26:50','synced','2025-09-11 09:26:50'),(17,553,'2025-09-11 09:29:50',NULL,NULL,'2025-09-11 09:29:50','2025-09-11 09:29:50','synced','2025-09-11 09:29:50'),(17,555,'2025-09-11 09:32:50',NULL,NULL,'2025-09-11 09:32:50','2025-09-11 09:32:50','synced','2025-09-11 09:32:50'),(17,557,'2025-09-11 09:35:50',NULL,NULL,'2025-09-11 09:35:50','2025-09-11 09:35:50','synced','2025-09-11 09:35:50'),(17,559,'2025-09-11 09:38:52',NULL,NULL,'2025-09-11 09:38:52','2025-09-11 09:38:52','synced','2025-09-11 09:38:52'),(17,561,'2025-09-11 09:41:50',NULL,NULL,'2025-09-11 09:41:50','2025-09-11 09:41:50','synced','2025-09-11 09:41:50'),(17,563,'2025-09-11 09:44:51',NULL,NULL,'2025-09-11 09:44:51','2025-09-11 09:44:51','synced','2025-09-11 09:44:51'),(17,565,'2025-09-11 09:47:50',NULL,NULL,'2025-09-11 09:47:50','2025-09-11 09:47:50','synced','2025-09-11 09:47:50'),(17,567,'2025-09-11 09:50:50',NULL,NULL,'2025-09-11 09:50:50','2025-09-11 09:50:50','synced','2025-09-11 09:50:50'),(17,569,'2025-09-11 09:53:50',NULL,NULL,'2025-09-11 09:53:50','2025-09-11 09:53:50','synced','2025-09-11 09:53:50'),(17,571,'2025-09-11 09:56:49',NULL,NULL,'2025-09-11 09:56:49','2025-09-11 09:56:49','synced','2025-09-11 09:56:49'),(17,573,'2025-09-11 09:59:50',NULL,NULL,'2025-09-11 09:59:50','2025-09-11 09:59:50','synced','2025-09-11 09:59:50'),(17,575,'2025-09-11 10:02:50',NULL,NULL,'2025-09-11 10:02:50','2025-09-11 10:02:50','synced','2025-09-11 10:02:50'),(17,577,'2025-09-11 10:05:50',NULL,NULL,'2025-09-11 10:05:50','2025-09-11 10:05:50','synced','2025-09-11 10:05:50'),(17,579,'2025-09-11 10:14:49',NULL,NULL,'2025-09-11 10:14:49','2025-09-11 10:14:49','synced','2025-09-11 10:14:49'),(17,581,'2025-09-11 10:17:50',NULL,NULL,'2025-09-11 10:17:50','2025-09-11 10:17:50','synced','2025-09-11 10:17:50'),(17,583,'2025-09-11 10:20:50',NULL,NULL,'2025-09-11 10:20:50','2025-09-11 10:20:50','synced','2025-09-11 10:20:50'),(17,585,'2025-09-11 10:23:50',NULL,NULL,'2025-09-11 10:23:50','2025-09-11 10:23:50','synced','2025-09-11 10:23:50'),(17,587,'2025-09-11 10:26:50',NULL,NULL,'2025-09-11 10:26:50','2025-09-11 10:26:50','synced','2025-09-11 10:26:50'),(17,589,'2025-09-11 10:29:49',NULL,NULL,'2025-09-11 10:29:49','2025-09-11 10:29:49','synced','2025-09-11 10:29:49'),(17,591,'2025-09-11 10:32:49',NULL,NULL,'2025-09-11 10:32:49','2025-09-11 10:32:49','synced','2025-09-11 10:32:49'),(17,593,'2025-09-11 10:35:50',NULL,NULL,'2025-09-11 10:35:50','2025-09-11 10:35:50','synced','2025-09-11 10:35:50'),(17,595,'2025-09-11 10:38:50',NULL,NULL,'2025-09-11 10:38:50','2025-09-11 10:38:50','synced','2025-09-11 10:38:50'),(17,597,'2025-09-11 10:41:50',NULL,NULL,'2025-09-11 10:41:50','2025-09-11 10:41:50','synced','2025-09-11 10:41:50'),(17,599,'2025-09-11 10:44:51',NULL,NULL,'2025-09-11 10:44:51','2025-09-11 10:44:51','synced','2025-09-11 10:44:51'),(17,601,'2025-09-11 10:47:49',NULL,NULL,'2025-09-11 10:47:49','2025-09-11 10:47:49','synced','2025-09-11 10:47:49'),(17,603,'2025-09-11 10:50:50',NULL,NULL,'2025-09-11 10:50:50','2025-09-11 10:50:50','synced','2025-09-11 10:50:50'),(17,605,'2025-09-11 10:53:50',NULL,NULL,'2025-09-11 10:53:50','2025-09-11 10:53:50','synced','2025-09-11 10:53:50'),(17,607,'2025-09-11 10:56:50',NULL,NULL,'2025-09-11 10:56:50','2025-09-11 10:56:50','synced','2025-09-11 10:56:50'),(17,609,'2025-09-11 10:59:51',NULL,NULL,'2025-09-11 10:59:51','2025-09-11 10:59:51','synced','2025-09-11 10:59:51'),(17,611,'2025-09-11 11:02:49',NULL,NULL,'2025-09-11 11:02:49','2025-09-11 11:02:49','synced','2025-09-11 11:02:49'),(17,613,'2025-09-11 11:05:49',NULL,NULL,'2025-09-11 11:05:49','2025-09-11 11:05:49','synced','2025-09-11 11:05:49'),(17,615,'2025-09-11 11:08:50',NULL,NULL,'2025-09-11 11:08:50','2025-09-11 11:08:50','synced','2025-09-11 11:08:50'),(17,617,'2025-09-11 11:11:50',NULL,NULL,'2025-09-11 11:11:50','2025-09-11 11:11:50','synced','2025-09-11 11:11:50'),(17,619,'2025-09-11 11:14:50',NULL,NULL,'2025-09-11 11:14:50','2025-09-11 11:14:50','synced','2025-09-11 11:14:50'),(17,621,'2025-09-11 11:17:50',NULL,NULL,'2025-09-11 11:17:50','2025-09-11 11:17:50','synced','2025-09-11 11:17:50'),(17,623,'2025-09-11 11:20:50',NULL,NULL,'2025-09-11 11:20:50','2025-09-11 11:20:50','synced','2025-09-11 11:20:50'),(17,625,'2025-09-11 11:23:50',NULL,NULL,'2025-09-11 11:23:50','2025-09-11 11:23:50','synced','2025-09-11 11:23:50'),(17,627,'2025-09-11 11:26:50',NULL,NULL,'2025-09-11 11:26:50','2025-09-11 11:26:50','synced','2025-09-11 11:26:50'),(17,629,'2025-09-11 11:29:50',NULL,NULL,'2025-09-11 11:29:50','2025-09-11 11:29:50','synced','2025-09-11 11:29:50'),(17,631,'2025-09-11 11:32:50',NULL,NULL,'2025-09-11 11:32:50','2025-09-11 11:32:50','synced','2025-09-11 11:32:50'),(17,633,'2025-09-11 11:35:50',NULL,NULL,'2025-09-11 11:35:50','2025-09-11 11:35:50','synced','2025-09-11 11:35:50'),(17,635,'2025-09-11 11:38:51',NULL,NULL,'2025-09-11 11:38:51','2025-09-11 11:38:51','synced','2025-09-11 11:38:51'),(17,637,'2025-09-11 11:41:49',NULL,NULL,'2025-09-11 11:41:49','2025-09-11 11:41:49','synced','2025-09-11 11:41:49'),(17,639,'2025-09-11 11:44:50',NULL,NULL,'2025-09-11 11:44:50','2025-09-11 11:44:50','synced','2025-09-11 11:44:50'),(17,641,'2025-09-11 11:47:50',NULL,NULL,'2025-09-11 11:47:50','2025-09-11 11:47:50','synced','2025-09-11 11:47:50'),(17,643,'2025-09-11 11:50:50',NULL,NULL,'2025-09-11 11:50:50','2025-09-11 11:50:50','synced','2025-09-11 11:50:50'),(17,645,'2025-09-11 11:54:49',NULL,NULL,'2025-09-11 11:54:49','2025-09-11 11:54:49','synced','2025-09-11 11:54:49'),(17,647,'2025-09-15 05:24:51',NULL,NULL,'2025-09-15 05:24:51','2025-09-15 05:24:51','synced','2025-09-15 05:24:51'),(17,649,'2025-09-15 05:37:50',NULL,NULL,'2025-09-15 05:37:50','2025-09-15 05:37:50','synced','2025-09-15 05:37:50'),(17,651,'2025-09-15 05:50:50',NULL,NULL,'2025-09-15 05:50:50','2025-09-15 05:50:50','synced','2025-09-15 05:50:50'),(17,653,'2025-09-15 05:53:50',NULL,NULL,'2025-09-15 05:53:50','2025-09-15 05:53:50','synced','2025-09-15 05:53:50'),(17,656,'2025-09-15 05:58:50',NULL,NULL,'2025-09-15 05:58:50','2025-09-15 05:58:50','synced','2025-09-15 05:58:50'),(17,658,'2025-09-15 06:01:51',NULL,NULL,'2025-09-15 06:01:51','2025-09-15 06:01:51','synced','2025-09-15 06:01:51'),(17,660,'2025-09-15 06:04:50',NULL,NULL,'2025-09-15 06:04:50','2025-09-15 06:04:50','synced','2025-09-15 06:04:50'),(17,662,'2025-09-15 06:06:51',NULL,NULL,'2025-09-15 06:06:51','2025-09-15 06:06:51','synced','2025-09-15 06:06:51'),(17,664,'2025-09-15 06:09:49',NULL,NULL,'2025-09-15 06:09:49','2025-09-15 06:09:49','synced','2025-09-15 06:09:49'),(17,666,'2025-09-15 06:12:50',NULL,NULL,'2025-09-15 06:12:50','2025-09-15 06:12:50','synced','2025-09-15 06:12:50'),(17,668,'2025-09-15 06:15:50',NULL,NULL,'2025-09-15 06:15:50','2025-09-15 06:15:50','synced','2025-09-15 06:15:50'),(17,670,'2025-09-15 06:18:49',NULL,NULL,'2025-09-15 06:18:49','2025-09-15 06:18:49','synced','2025-09-15 06:18:49'),(17,672,'2025-09-15 06:21:50',NULL,NULL,'2025-09-15 06:21:50','2025-09-15 06:21:50','synced','2025-09-15 06:21:50'),(17,674,'2025-09-15 06:24:50',NULL,NULL,'2025-09-15 06:24:50','2025-09-15 06:24:50','synced','2025-09-15 06:24:50'),(17,677,'2025-09-15 06:31:50',NULL,NULL,'2025-09-15 06:31:50','2025-09-15 06:31:50','synced','2025-09-15 06:31:50'),(17,679,'2025-09-15 06:42:50',NULL,NULL,'2025-09-15 06:42:50','2025-09-15 06:42:50','synced','2025-09-15 06:42:50'),(17,681,'2025-09-15 06:46:50',NULL,NULL,'2025-09-15 06:46:50','2025-09-15 06:46:50','synced','2025-09-15 06:46:50'),(17,683,'2025-09-15 06:49:50',NULL,NULL,'2025-09-15 06:49:50','2025-09-15 06:49:50','synced','2025-09-15 06:49:50'),(17,685,'2025-09-15 06:51:50',NULL,NULL,'2025-09-15 06:51:50','2025-09-15 06:51:50','synced','2025-09-15 06:51:50'),(17,687,'2025-09-15 06:55:50',NULL,NULL,'2025-09-15 06:55:50','2025-09-15 06:55:50','synced','2025-09-15 06:55:50'),(17,689,'2025-09-15 06:58:50',NULL,NULL,'2025-09-15 06:58:50','2025-09-15 06:58:50','synced','2025-09-15 06:58:50'),(17,692,'2025-09-15 07:02:50',NULL,NULL,'2025-09-15 07:02:50','2025-09-15 07:02:50','synced','2025-09-15 07:02:50'),(17,694,'2025-09-15 07:05:51',NULL,NULL,'2025-09-15 07:05:51','2025-09-15 07:05:51','synced','2025-09-15 07:05:51'),(17,696,'2025-09-15 07:08:50',NULL,NULL,'2025-09-15 07:08:50','2025-09-15 07:08:50','synced','2025-09-15 07:08:50'),(17,698,'2025-09-15 07:11:50',NULL,NULL,'2025-09-15 07:11:50','2025-09-15 07:11:50','synced','2025-09-15 07:11:50'),(17,700,'2025-09-15 07:13:50',NULL,NULL,'2025-09-15 07:13:50','2025-09-15 07:13:50','synced','2025-09-15 07:13:50'),(17,702,'2025-09-15 07:16:50',NULL,NULL,'2025-09-15 07:16:50','2025-09-15 07:16:50','synced','2025-09-15 07:16:50'),(17,704,'2025-09-15 07:20:49',NULL,NULL,'2025-09-15 07:20:49','2025-09-15 07:20:49','synced','2025-09-15 07:20:49'),(17,706,'2025-09-15 07:23:49',NULL,NULL,'2025-09-15 07:23:49','2025-09-15 07:23:49','synced','2025-09-15 07:23:49'),(17,708,'2025-09-15 07:26:50',NULL,NULL,'2025-09-15 07:26:50','2025-09-15 07:26:50','synced','2025-09-15 07:26:50'),(17,710,'2025-09-15 07:29:50',NULL,NULL,'2025-09-15 07:29:50','2025-09-15 07:29:50','synced','2025-09-15 07:29:50'),(17,712,'2025-09-15 07:32:50',NULL,NULL,'2025-09-15 07:32:50','2025-09-15 07:32:50','synced','2025-09-15 07:32:50'),(17,714,'2025-09-15 07:35:50',NULL,NULL,'2025-09-15 07:35:50','2025-09-15 07:35:50','synced','2025-09-15 07:35:50'),(17,716,'2025-09-15 07:38:50',NULL,NULL,'2025-09-15 07:38:50','2025-09-15 07:38:50','synced','2025-09-15 07:38:50'),(17,718,'2025-09-15 07:41:49',NULL,NULL,'2025-09-15 07:41:49','2025-09-15 07:41:49','synced','2025-09-15 07:41:49'),(17,720,'2025-09-15 07:44:49',NULL,NULL,'2025-09-15 07:44:49','2025-09-15 07:44:49','synced','2025-09-15 07:44:49'),(17,722,'2025-09-15 07:47:49',NULL,NULL,'2025-09-15 07:47:49','2025-09-15 07:47:49','synced','2025-09-15 07:47:49'),(17,724,'2025-09-15 07:50:50',NULL,NULL,'2025-09-15 07:50:50','2025-09-15 07:50:50','synced','2025-09-15 07:50:50'),(17,726,'2025-09-15 07:53:50',NULL,NULL,'2025-09-15 07:53:50','2025-09-15 07:53:50','synced','2025-09-15 07:53:50'),(17,728,'2025-09-15 07:56:50',NULL,NULL,'2025-09-15 07:56:50','2025-09-15 07:56:50','synced','2025-09-15 07:56:50'),(17,730,'2025-09-15 07:59:50',NULL,NULL,'2025-09-15 07:59:50','2025-09-15 07:59:50','synced','2025-09-15 07:59:50'),(17,732,'2025-09-15 08:02:50',NULL,NULL,'2025-09-15 08:02:50','2025-09-15 08:02:50','synced','2025-09-15 08:02:50'),(17,734,'2025-09-15 08:05:49',NULL,NULL,'2025-09-15 08:05:49','2025-09-15 08:05:49','synced','2025-09-15 08:05:49'),(17,736,'2025-09-15 08:08:50',NULL,NULL,'2025-09-15 08:08:50','2025-09-15 08:08:50','synced','2025-09-15 08:08:50'),(17,738,'2025-09-15 08:11:50',NULL,NULL,'2025-09-15 08:11:50','2025-09-15 08:11:50','synced','2025-09-15 08:11:50'),(17,740,'2025-09-15 08:14:50',NULL,NULL,'2025-09-15 08:14:50','2025-09-15 08:14:50','synced','2025-09-15 08:14:50'),(17,742,'2025-09-15 08:17:50',NULL,NULL,'2025-09-15 08:17:50','2025-09-15 08:17:50','synced','2025-09-15 08:17:50'),(17,744,'2025-09-15 08:20:50',NULL,NULL,'2025-09-15 08:20:50','2025-09-15 08:20:50','synced','2025-09-15 08:20:50'),(17,746,'2025-09-15 08:23:50',NULL,NULL,'2025-09-15 08:23:50','2025-09-15 08:23:50','synced','2025-09-15 08:23:50'),(17,748,'2025-09-15 08:26:49',NULL,NULL,'2025-09-15 08:26:49','2025-09-15 08:26:49','synced','2025-09-15 08:26:49'),(17,750,'2025-09-15 08:29:49',NULL,NULL,'2025-09-15 08:29:49','2025-09-15 08:29:49','synced','2025-09-15 08:29:49'),(17,752,'2025-09-15 08:32:49',NULL,NULL,'2025-09-15 08:32:49','2025-09-15 08:32:49','synced','2025-09-15 08:32:49'),(17,754,'2025-09-15 08:35:50',NULL,NULL,'2025-09-15 08:35:50','2025-09-15 08:35:50','synced','2025-09-15 08:35:50'),(17,756,'2025-09-15 08:38:50',NULL,NULL,'2025-09-15 08:38:50','2025-09-15 08:38:50','synced','2025-09-15 08:38:50'),(17,758,'2025-09-15 08:41:50',NULL,NULL,'2025-09-15 08:41:50','2025-09-15 08:41:50','synced','2025-09-15 08:41:50'),(17,760,'2025-09-15 08:44:50',NULL,NULL,'2025-09-15 08:44:50','2025-09-15 08:44:50','synced','2025-09-15 08:44:50'),(17,762,'2025-09-15 08:47:50',NULL,NULL,'2025-09-15 08:47:50','2025-09-15 08:47:50','synced','2025-09-15 08:47:50'),(17,764,'2025-09-15 08:50:49',NULL,NULL,'2025-09-15 08:50:49','2025-09-15 08:50:49','synced','2025-09-15 08:50:49'),(17,766,'2025-09-15 08:54:07',NULL,NULL,'2025-09-15 08:54:07','2025-09-15 08:54:07','synced','2025-09-15 08:54:07'),(17,768,'2025-09-15 08:57:10',NULL,NULL,'2025-09-15 08:57:10','2025-09-15 08:57:10','synced','2025-09-15 08:57:10'),(17,770,'2025-09-15 08:59:50',NULL,NULL,'2025-09-15 08:59:50','2025-09-15 08:59:50','synced','2025-09-15 08:59:50'),(17,772,'2025-09-15 09:02:52',NULL,NULL,'2025-09-15 09:02:52','2025-09-15 09:02:52','synced','2025-09-15 09:02:52'),(17,774,'2025-09-15 09:05:50',NULL,NULL,'2025-09-15 09:05:50','2025-09-15 09:05:50','synced','2025-09-15 09:05:50'),(17,776,'2025-09-15 09:08:50',NULL,NULL,'2025-09-15 09:08:50','2025-09-15 09:08:50','synced','2025-09-15 09:08:50'),(17,778,'2025-09-15 09:11:51',NULL,NULL,'2025-09-15 09:11:51','2025-09-15 09:11:51','synced','2025-09-15 09:11:51'),(17,780,'2025-09-15 09:14:50',NULL,NULL,'2025-09-15 09:14:50','2025-09-15 09:14:50','synced','2025-09-15 09:14:50'),(17,782,'2025-09-15 09:17:49',NULL,NULL,'2025-09-15 09:17:49','2025-09-15 09:17:49','synced','2025-09-15 09:17:49'),(17,784,'2025-09-15 09:20:50',NULL,NULL,'2025-09-15 09:20:50','2025-09-15 09:20:50','synced','2025-09-15 09:20:50'),(17,786,'2025-09-15 09:23:50',NULL,NULL,'2025-09-15 09:23:50','2025-09-15 09:23:50','synced','2025-09-15 09:23:50'),(17,788,'2025-09-15 09:26:50',NULL,NULL,'2025-09-15 09:26:50','2025-09-15 09:26:50','synced','2025-09-15 09:26:50'),(17,790,'2025-09-15 09:29:50',NULL,NULL,'2025-09-15 09:29:50','2025-09-15 09:29:50','synced','2025-09-15 09:29:50'),(17,792,'2025-09-15 09:32:51',NULL,NULL,'2025-09-15 09:32:51','2025-09-15 09:32:51','synced','2025-09-15 09:32:51'),(17,794,'2025-09-15 09:35:51',NULL,NULL,'2025-09-15 09:35:51','2025-09-15 09:35:51','synced','2025-09-15 09:35:51'),(17,796,'2025-09-15 09:38:50',NULL,NULL,'2025-09-15 09:38:50','2025-09-15 09:38:50','synced','2025-09-15 09:38:50'),(17,798,'2025-09-15 09:41:50',NULL,NULL,'2025-09-15 09:41:50','2025-09-15 09:41:50','synced','2025-09-15 09:41:50'),(17,800,'2025-09-15 09:44:50',NULL,NULL,'2025-09-15 09:44:50','2025-09-15 09:44:50','synced','2025-09-15 09:44:50'),(17,802,'2025-09-15 09:47:50',NULL,NULL,'2025-09-15 09:47:50','2025-09-15 09:47:50','synced','2025-09-15 09:47:50'),(17,804,'2025-09-15 09:50:50',NULL,NULL,'2025-09-15 09:50:50','2025-09-15 09:50:50','synced','2025-09-15 09:50:50'),(17,806,'2025-09-15 09:53:50',NULL,NULL,'2025-09-15 09:53:50','2025-09-15 09:53:50','synced','2025-09-15 09:53:50'),(17,808,'2025-09-15 09:56:50',NULL,NULL,'2025-09-15 09:56:50','2025-09-15 09:56:50','synced','2025-09-15 09:56:50'),(17,810,'2025-09-15 09:59:49',NULL,NULL,'2025-09-15 09:59:49','2025-09-15 09:59:49','synced','2025-09-15 09:59:49'),(17,812,'2025-09-15 10:02:50',NULL,NULL,'2025-09-15 10:02:50','2025-09-15 10:02:50','synced','2025-09-15 10:02:50'),(17,814,'2025-09-15 10:05:50',NULL,NULL,'2025-09-15 10:05:50','2025-09-15 10:05:50','synced','2025-09-15 10:05:50'),(17,816,'2025-09-15 10:08:49',NULL,NULL,'2025-09-15 10:08:49','2025-09-15 10:08:49','synced','2025-09-15 10:08:49'),(17,818,'2025-09-15 10:11:50',NULL,NULL,'2025-09-15 10:11:50','2025-09-15 10:11:50','synced','2025-09-15 10:11:50'),(17,820,'2025-09-15 10:14:50',NULL,NULL,'2025-09-15 10:14:50','2025-09-15 10:14:50','synced','2025-09-15 10:14:50'),(17,822,'2025-09-15 10:17:50',NULL,NULL,'2025-09-15 10:17:50','2025-09-15 10:17:50','synced','2025-09-15 10:17:50'),(17,824,'2025-09-15 10:20:51',NULL,NULL,'2025-09-15 10:20:51','2025-09-15 10:20:51','synced','2025-09-15 10:20:51'),(17,826,'2025-09-15 10:23:50',NULL,NULL,'2025-09-15 10:23:50','2025-09-15 10:23:50','synced','2025-09-15 10:23:50'),(17,828,'2025-09-15 10:26:53',NULL,NULL,'2025-09-15 10:26:53','2025-09-15 10:26:53','synced','2025-09-15 10:26:53'),(17,830,'2025-09-15 10:29:49',NULL,NULL,'2025-09-15 10:29:49','2025-09-15 10:29:49','synced','2025-09-15 10:29:49'),(17,832,'2025-09-15 10:32:49',NULL,NULL,'2025-09-15 10:32:49','2025-09-15 10:32:49','synced','2025-09-15 10:32:49'),(17,834,'2025-09-15 10:35:50',NULL,NULL,'2025-09-15 10:35:50','2025-09-15 10:35:50','synced','2025-09-15 10:35:50'),(17,836,'2025-09-15 10:38:50',NULL,NULL,'2025-09-15 10:38:50','2025-09-15 10:38:50','synced','2025-09-15 10:38:50'),(17,838,'2025-09-15 10:41:50',NULL,NULL,'2025-09-15 10:41:50','2025-09-15 10:41:50','synced','2025-09-15 10:41:50'),(17,840,'2025-09-15 10:44:50',NULL,NULL,'2025-09-15 10:44:50','2025-09-15 10:44:50','synced','2025-09-15 10:44:50'),(17,842,'2025-09-15 10:47:50',NULL,NULL,'2025-09-15 10:47:50','2025-09-15 10:47:50','synced','2025-09-15 10:47:50'),(17,844,'2025-09-15 10:50:50',NULL,NULL,'2025-09-15 10:50:50','2025-09-15 10:50:50','synced','2025-09-15 10:50:50'),(17,846,'2025-09-15 10:53:49',NULL,NULL,'2025-09-15 10:53:49','2025-09-15 10:53:49','synced','2025-09-15 10:53:49'),(17,848,'2025-09-15 10:56:53',NULL,NULL,'2025-09-15 10:56:53','2025-09-15 10:56:53','synced','2025-09-15 10:56:53'),(17,850,'2025-10-12 11:14:50',NULL,NULL,'2025-10-12 11:14:50','2025-10-12 11:14:50','synced','2025-10-12 11:14:50');
/*!40000 ALTER TABLE `task_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_watchers`
--

DROP TABLE IF EXISTS `task_watchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_watchers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `watched_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_task_watcher` (`task_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `task_watchers_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_watchers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_watchers`
--

LOCK TABLES `task_watchers` WRITE;
/*!40000 ALTER TABLE `task_watchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_watchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `list_id` int NOT NULL,
  `parent_task_id` bigint DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `description` text,
  `status_id` int DEFAULT NULL,
  `priority_id` int DEFAULT NULL,
  `assignee_id` int DEFAULT NULL,
  `creator_id` int NOT NULL,
  `order_index` decimal(20,10) DEFAULT '0.0000000000',
  `due_date` datetime DEFAULT NULL,
  `due_date_time` tinyint(1) DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `start_date_time` tinyint(1) DEFAULT '0',
  `time_estimate` bigint DEFAULT NULL,
  `time_spent` bigint DEFAULT '0',
  `is_archived` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `url` varchar(500) DEFAULT NULL,
  `text_content` text,
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `creator_id` (`creator_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_list_id` (`list_id`),
  KEY `idx_parent_task_id` (`parent_task_id`),
  KEY `idx_assignee_id` (`assignee_id`),
  KEY `idx_status_priority` (`status_id`,`priority_id`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_order_index` (`order_index`),
  KEY `idx_tasks_list_status` (`list_id`,`status_id`,`is_active`),
  KEY `idx_tasks_assignee_due` (`assignee_id`,`due_date`,`is_active`),
  KEY `idx_tasks_sync_updated` (`sync_status`,`local_updated_at`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_ibfk_4` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'869adgn6h',1,NULL,'Task 3','',NULL,NULL,3,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6h','','2025-09-09 10:24:11','2025-10-12 11:14:28','2025-09-08 19:47:09','2025-09-15 10:55:22','synced','2025-10-12 11:14:28'),(2,'869adgn6g',1,NULL,'Task 1','',NULL,NULL,1,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6g','','2025-09-09 10:24:11','2025-10-12 11:14:28','2025-09-08 19:47:09','2025-09-15 10:55:16','synced','2025-10-12 11:14:28'),(3,'869adgn6f',1,NULL,'Task 2','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6f','','2025-09-09 10:24:11','2025-10-12 11:14:28','2025-09-08 19:47:09','2025-09-08 19:47:09','synced','2025-10-12 11:14:28'),(4,'869adgn6e',2,NULL,'‎Task 2','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6e','','2025-09-09 10:24:11','2025-10-12 11:14:29','2025-09-08 19:47:08','2025-09-10 13:03:38','synced','2025-10-12 11:14:29'),(5,'869adgn6d',2,NULL,'Task 3','',NULL,NULL,4,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6d','','2025-09-09 10:24:12','2025-10-12 11:14:29','2025-09-08 19:47:08','2025-09-15 11:15:19','synced','2025-10-12 11:14:29'),(6,'869adgn6c',2,NULL,'‎Task 1','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869adgn6c','','2025-09-09 10:24:12','2025-10-12 11:14:29','2025-09-08 19:47:08','2025-09-10 13:03:37','synced','2025-10-12 11:14:29'),(7,'869a8nfnf',3,NULL,'Pricing table','',NULL,NULL,NULL,2,0.0000000000,'2019-12-31 14:00:00',0,'2019-12-02 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfnf','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:27','2025-08-26 12:18:27','synced','2025-10-12 11:14:30'),(8,'869a8nfnc',3,NULL,'Signup buttons','',NULL,NULL,NULL,2,0.0000000000,'2019-12-01 14:00:00',0,'2019-11-01 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfnc','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:27','2025-08-26 12:18:27','synced','2025-10-12 11:14:30'),(9,'869a8nfnb',3,NULL,'Adwords search term','',NULL,NULL,NULL,2,0.0000000000,'2019-12-01 14:00:00',0,'2019-10-01 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfnb','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:27','2025-08-26 12:18:27','synced','2025-10-12 11:14:30'),(10,'869a8nfn9',3,NULL,'Facebook post','',NULL,NULL,NULL,2,0.0000000000,'2019-11-15 14:00:00',0,'2019-11-01 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfn9','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:27','2025-08-26 12:18:27','synced','2025-10-12 11:14:30'),(11,'869a8nfkk',3,NULL,'Fall campaign','',NULL,NULL,NULL,2,0.0000000000,'2019-10-31 14:00:00',0,'2019-10-16 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfkk','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:24','2025-08-26 12:18:24','synced','2025-10-12 11:14:30'),(12,'869a8nfkj',3,NULL,'Promo announcement','',NULL,NULL,NULL,2,0.0000000000,'2019-10-31 14:00:00',0,'2019-10-01 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfkj','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:24','2025-08-26 12:18:24','synced','2025-10-12 11:14:30'),(13,'869a8nfkh',3,NULL,'Welcome to ClickUp','',NULL,NULL,NULL,2,0.0000000000,'2019-09-30 14:00:00',0,'2019-09-11 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfkh','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:24','2025-08-26 12:18:24','synced','2025-10-12 11:14:30'),(14,'869a8nfkg',3,NULL,'YouTube commercial','',NULL,NULL,NULL,2,0.0000000000,'2019-09-17 14:00:00',0,'2019-09-01 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfkg','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:24','2025-08-26 12:18:24','synced','2025-10-12 11:14:30'),(15,'869a8nfke',3,NULL,'Homepage banner','',NULL,NULL,NULL,2,0.0000000000,'2019-08-30 14:00:00',0,'2019-08-14 14:00:00',0,NULL,0,0,1,'https://app.clickup.com/t/869a8nfke','','2025-09-09 10:24:13','2025-10-12 11:14:30','2025-08-26 12:18:23','2025-08-26 12:18:23','synced','2025-10-12 11:14:30'),(16,'8699dxv2x',4,NULL,'‎Task 2','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/8699dxv2x','','2025-09-09 10:24:13','2025-10-12 11:14:31','2025-06-13 08:30:10','2025-09-08 19:36:33','synced','2025-10-12 11:14:31'),(17,'8699dxv2w',4,NULL,'‎Task 1','',NULL,NULL,1,2,0.0000000000,'2025-08-26 04:00:00',0,NULL,0,86400000,0,0,1,'https://app.clickup.com/t/8699dxv2w','','2025-09-09 10:24:14','2025-10-12 11:14:31','2025-06-13 08:30:10','2025-09-08 19:36:39','synced','2025-10-12 11:14:31'),(18,'8699dxv2v',4,NULL,'Task 3','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/8699dxv2v','','2025-09-09 10:24:14','2025-10-12 11:14:31','2025-06-13 08:30:10','2025-06-13 08:30:10','synced','2025-10-12 11:14:31'),(19,'8699dxv3b',5,NULL,'Task 1','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/8699dxv3b','','2025-09-09 10:24:14','2025-10-12 11:14:32','2025-06-13 08:30:11','2025-09-08 19:37:59','synced','2025-10-12 11:14:32'),(20,'8699dxv3a',5,NULL,'Task 3','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/8699dxv3a','','2025-09-09 10:24:14','2025-10-12 11:14:32','2025-06-13 08:30:11','2025-06-13 08:30:11','synced','2025-10-12 11:14:32'),(21,'8699dxv39',5,NULL,'Task 2','',NULL,NULL,NULL,2,0.0000000000,NULL,0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/8699dxv39','','2025-09-09 10:24:15','2025-10-12 11:14:32','2025-06-13 08:30:11','2025-09-08 19:37:38','synced','2025-10-12 11:14:32'),(22,'869aeba5n',2,NULL,'Sub task','',NULL,NULL,2,2,0.0000000000,'2025-09-10 04:00:00',0,NULL,0,NULL,0,0,1,'https://app.clickup.com/t/869aeba5n','','2025-09-10 12:57:28','2025-10-12 11:14:29','2025-09-10 12:56:17','2025-09-10 17:45:36','synced','2025-10-12 11:14:29');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ALLOW_INVALID_DATES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tasks_after_update` AFTER UPDATE ON `tasks` FOR EACH ROW BEGIN
    
    IF NEW.sync_status != 'pending' AND 
       (OLD.name != NEW.name OR 
        OLD.description != NEW.description OR 
        OLD.status_id != NEW.status_id OR
        OLD.priority_id != NEW.priority_id OR
        OLD.due_date != NEW.due_date OR
        OLD.assignee_id != NEW.assignee_id) THEN
        
        UPDATE tasks 
        SET sync_status = 'pending' 
        WHERE id = NEW.id;
        
        CALL MarkForSync('task', NEW.clickup_id, 'push');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('owner','admin','member','guest') DEFAULT 'member',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_team_user` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_sync_status` (`sync_status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'90121001003','Workspace KPI',NULL,'#40BC86',1,'2025-09-08 18:00:01','2025-09-08 18:00:01','0000-00-00 00:00:00','0000-00-00 00:00:00','synced','2025-09-08 18:00:01'),(2,'90121198535','Clickup Custom frontend ',NULL,'#40BC86',1,'2025-09-08 20:00:01','2025-09-08 20:00:01','0000-00-00 00:00:00','0000-00-00 00:00:00','synced','2025-09-08 20:00:01');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_entries`
--

DROP TABLE IF EXISTS `time_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `task_id` bigint DEFAULT NULL,
  `user_id` int NOT NULL,
  `description` text,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `duration` bigint NOT NULL,
  `billable` tinyint(1) DEFAULT '0',
  `is_running` tinyint(1) DEFAULT '0',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_time_entries_user_date` (`user_id`,`start_time`),
  CONSTRAINT `time_entries_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `time_entries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `clickup_id` varchar(50) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `initials` varchar(5) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `role` enum('owner','admin','member','guest') DEFAULT 'member',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_clickup_id` (`clickup_id`),
  KEY `idx_email` (`email`),
  KEY `idx_sync_status` (`sync_status`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'93618632','Nyaencha Evans','evansnyaencha@gmail.com','#827718',NULL,'NE',1,'member','2025-09-09 10:24:01','2025-10-12 11:14:02',NULL,NULL,'synced','2025-10-12 11:14:02'),(2,'206421374','Nyaencha Evans','enyaencha@gmail.com','#000000',NULL,'NE',1,'member','2025-09-09 10:24:01','2025-10-12 11:14:02',NULL,NULL,'synced','2025-10-12 11:14:02'),(3,'93711821','Enm Admin','nyaenchaevans@gmail.com','#000000','https://attachments.clickup.com/profilePictures/93711821_A3m.jpg','EA',1,'member','2025-09-09 10:24:01','2025-10-12 11:14:02',NULL,NULL,'synced','2025-10-12 11:14:02'),(4,'93713295','','afyastattable@gmail.com','#000000',NULL,'A',1,'member','2025-09-10 08:26:01','2025-10-12 11:14:02',NULL,NULL,'synced','2025-10-12 11:14:02'),(51,'0','ClickUp System','system@clickup.local',NULL,NULL,NULL,1,'member','2025-09-10 16:42:00','2025-09-10 16:46:29',NULL,NULL,'synced','2025-09-10 16:42:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `views`
--

DROP TABLE IF EXISTS `views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clickup_id` varchar(50) NOT NULL,
  `list_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `order_index` int DEFAULT NULL,
  `query` json DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `local_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `local_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clickup_created_at` timestamp NULL DEFAULT NULL,
  `clickup_updated_at` timestamp NULL DEFAULT NULL,
  `sync_status` enum('synced','pending','conflict','error') DEFAULT 'synced',
  `last_sync_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clickup_id` (`clickup_id`),
  KEY `idx_list_id` (`list_id`),
  CONSTRAINT `views_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8922 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `views`
--

LOCK TABLES `views` WRITE;
/*!40000 ALTER TABLE `views` DISABLE KEYS */;
INSERT INTO `views` VALUES (1,'2kxu8py7-572',1,'Calendar','calendar',4,NULL,0,1,'2025-09-10 10:38:21','2025-10-12 11:14:19',NULL,NULL,'synced','2025-10-12 11:14:19'),(2,'2kxu8py7-632',1,'Gantt','gantt',5,NULL,0,1,'2025-09-10 10:38:21','2025-10-12 11:14:19',NULL,NULL,'synced','2025-10-12 11:14:19'),(3,'2kxu8py7-552',1,'Table','table',6,NULL,0,1,'2025-09-10 10:38:21','2025-10-12 11:14:19',NULL,NULL,'synced','2025-10-12 11:14:19'),(4,'2kxu8py7-452',2,'Calendar','calendar',4,NULL,0,1,'2025-09-10 10:38:22','2025-10-12 11:14:20',NULL,NULL,'synced','2025-10-12 11:14:20'),(5,'2kxu8py7-512',2,'Gantt','gantt',5,NULL,0,1,'2025-09-10 10:38:22','2025-10-12 11:14:20',NULL,NULL,'synced','2025-10-12 11:14:20'),(6,'2kxu8py7-472',2,'Table','table',6,NULL,0,1,'2025-09-10 10:38:22','2025-10-12 11:14:20',NULL,NULL,'synced','2025-10-12 11:14:20'),(7,'2kxu2p1b-772',3,'Priorities','board',1,NULL,0,1,'2025-09-10 10:38:23','2025-10-12 11:14:21',NULL,NULL,'synced','2025-10-12 11:14:21'),(8,'2kxu2p1b-832',3,'Schedule','calendar',3,NULL,0,1,'2025-09-10 10:38:23','2025-10-12 11:14:21',NULL,NULL,'synced','2025-10-12 11:14:21'),(9,'2kxu2p1b-812',3,'Timeline','timeline',9,NULL,0,1,'2025-09-10 10:38:23','2025-10-12 11:14:21',NULL,NULL,'synced','2025-10-12 11:14:21'),(10,'2kxu2p1b-392',4,'Calendar','calendar',2,NULL,0,1,'2025-09-10 10:38:24','2025-10-12 11:14:22',NULL,NULL,'synced','2025-10-12 11:14:22'),(11,'2kxu2p1b-412',4,'Gantt','gantt',3,NULL,0,1,'2025-09-10 10:38:24','2025-10-12 11:14:22',NULL,NULL,'synced','2025-10-12 11:14:22'),(12,'2kxu2p1b-372',4,'Table','table',4,NULL,0,1,'2025-09-10 10:38:24','2025-10-12 11:14:22',NULL,NULL,'synced','2025-10-12 11:14:22'),(13,'6-901210447668-8',4,'Project 1','conversation',5,NULL,0,1,'2025-09-10 10:38:24','2025-10-12 11:14:22',NULL,NULL,'synced','2025-10-12 11:14:22'),(14,'2kxu2p1b-672',4,'Feedback Form','form',6,NULL,0,1,'2025-09-10 10:38:24','2025-10-12 11:14:22',NULL,NULL,'synced','2025-10-12 11:14:22'),(15,'2kxu2p1b-472',5,'Calendar','calendar',2,NULL,0,1,'2025-09-10 10:38:25','2025-10-12 11:14:23',NULL,NULL,'synced','2025-10-12 11:14:23'),(16,'2kxu2p1b-452',5,'Table','table',3,NULL,0,1,'2025-09-10 10:38:25','2025-10-12 11:14:23',NULL,NULL,'synced','2025-10-12 11:14:23'),(17,'2kxu2p1b-492',5,'Gantt','gantt',4,NULL,0,1,'2025-09-10 10:38:25','2025-10-12 11:14:23',NULL,NULL,'synced','2025-10-12 11:14:23'),(18,'6-901210447669-8',5,'Project 2','conversation',5,NULL,0,1,'2025-09-10 10:38:25','2025-10-12 11:14:23',NULL,NULL,'synced','2025-10-12 11:14:23');
/*!40000 ALTER TABLE `views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhook_events`
--

DROP TABLE IF EXISTS `webhook_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhook_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `webhook_id` varchar(100) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `clickup_id` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `payload` json NOT NULL,
  `processed` tinyint(1) DEFAULT '0',
  `processed_at` timestamp NULL DEFAULT NULL,
  `error_message` text,
  `received_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_processed` (`processed`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_entity_type` (`entity_type`),
  KEY `idx_received_at` (`received_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

-- Dump completed on 2025-11-16 23:11:38
