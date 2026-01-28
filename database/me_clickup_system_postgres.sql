-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: me_clickup_system
-- ------------------------------------------------------
-- Server version	8.0.39
--
-- Table structure for table "access_audit_log"
--
DROP TABLE IF EXISTS "access_audit_log";
CREATE TABLE "access_audit_log" (
  "id" BIGSERIAL,
  "user_id" INTEGER NOT NULL,
  "action" VARCHAR(50)  NOT NULL,
  "resource" VARCHAR(50)  NOT NULL,
  "resource_id" INTEGER DEFAULT NULL,
  "module_id" INTEGER DEFAULT NULL,
  "access_granted" BOOLEAN NOT NULL,
  "denial_reason" VARCHAR(255)  DEFAULT NULL,
  "ip_address" VARCHAR(45)  DEFAULT NULL,
  "user_agent" TEXT ,
  "request_data" JSONB DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "access_audit_log_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "access_audit_log"
--
INSERT INTO "access_audit_log" VALUES (1,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 04:56:32'),(2,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 06:56:18'),(3,2,'LOGIN','users',2,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:08:45'),(4,3,'LOGIN','users',3,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:10:49'),(5,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:28:21'),(6,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:34:22'),(7,4,'LOGIN','users',4,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:51:17'),(8,1,'LOGIN','users',1,NULL,1,NULL,'::1',NULL,NULL,'2025-12-02 17:54:51'),(9,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:20:21'),(10,2,'LOGIN','users',2,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:20:33'),(11,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:31:49'),(12,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-02 18:32:12'),(13,1,'LOGIN','users',1,NULL,0,'Invalid password','192.168.100.4',NULL,NULL,'2025-12-03 17:48:58'),(14,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 17:49:10'),(15,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 17:49:52'),(16,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:09:23'),(17,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:10:26'),(18,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:11:05'),(19,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:44:40'),(20,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 18:45:02'),(21,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:02:01'),(22,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:02:27'),(23,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 19:07:38'),(24,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-03 19:12:07'),(25,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:12:30'),(26,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:12:49'),(27,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:13:46'),(28,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:14:03'),(29,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-03 19:14:34'),(30,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:01:09'),(31,3,'LOGIN','users',3,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:01:25'),(32,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:06:47'),(33,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-04 05:08:45'),(34,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:20:23'),(35,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:22:15'),(36,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:25:24'),(37,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:26:04'),(38,1,'LOGIN','users',1,NULL,0,'Invalid password','192.168.2.245',NULL,NULL,'2025-12-04 05:32:48'),(39,1,'LOGIN','users',1,NULL,1,NULL,'192.168.2.245',NULL,NULL,'2025-12-04 05:32:58'),(40,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:39:00'),(41,5,'LOGIN','users',5,NULL,1,NULL,'192.168.2.85',NULL,NULL,'2025-12-04 05:40:51'),(42,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 06:02:18'),(43,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.202',NULL,NULL,'2025-12-04 06:31:12'),(44,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:48:56'),(45,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:52:23'),(46,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:52:33'),(47,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:53:14'),(48,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.202',NULL,NULL,'2025-12-04 08:57:33'),(49,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 08:58:54'),(50,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:02:18'),(51,1,'LOGIN','users',1,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:03:24'),(52,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:11:11'),(53,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:12:59'),(54,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:13:15'),(55,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:14:11'),(56,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:21:46'),(57,4,'LOGIN','users',4,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:41:40'),(58,5,'LOGIN','users',5,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:43:01'),(59,3,'LOGIN','users',3,NULL,1,NULL,'192.168.87.119',NULL,NULL,'2025-12-04 09:43:40'),(60,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:19:08'),(61,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:20:27'),(62,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:21:33'),(63,3,'LOGIN','users',3,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:22:10'),(64,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:34:22'),(65,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:34:41'),(66,2,'LOGIN','users',2,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:35:16'),(67,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.93',NULL,NULL,'2025-12-04 10:36:24'),(68,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-04 18:12:54'),(69,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-04 19:09:44'),(70,4,'LOGIN','users',4,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 06:11:23'),(71,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 06:24:45'),(72,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.5',NULL,NULL,'2025-12-06 07:02:32'),(73,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-06 07:27:17'),(74,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:00:54'),(75,5,'LOGIN','users',5,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:07:56'),(76,2,'LOGIN','users',2,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:08:42'),(77,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:18:12'),(78,5,'LOGIN','users',5,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:35:47'),(79,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 15:43:08'),(80,1,'LOGIN','users',1,NULL,1,NULL,'192.168.86.119',NULL,NULL,'2025-12-06 16:21:02'),(81,1,'LOGIN','users',1,NULL,1,NULL,'192.168.205.119',NULL,NULL,'2025-12-09 03:44:40'),(82,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 04:40:54'),(83,6,'LOGIN','users',6,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 04:42:51'),(84,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 04:52:27'),(85,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 04:56:43'),(86,7,'LOGIN','users',7,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 04:59:45'),(87,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 05:03:15'),(88,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 06:03:16'),(89,6,'LOGIN','users',6,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 08:14:49'),(90,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 08:20:15'),(91,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 08:20:50'),(92,5,'LOGIN','users',5,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 08:23:35'),(93,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 08:56:36'),(94,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-09 20:01:38'),(95,6,'LOGIN','users',6,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-10 04:17:40'),(96,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-10 04:22:12'),(97,1,'LOGIN','users',1,NULL,1,NULL,'127.0.0.1',NULL,NULL,'2025-12-11 05:17:47'),(98,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 08:29:45'),(99,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-11 08:30:22'),(100,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 08:31:01'),(101,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 08:37:01'),(102,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 10:37:01'),(103,7,'LOGIN','users',7,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 10:37:36'),(104,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 10:38:41'),(105,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-11 11:01:46'),(106,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-11 17:44:17'),(107,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-13 05:31:39'),(108,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-13 07:29:12'),(109,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-13 07:42:40'),(110,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-13 08:21:16'),(111,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-13 08:23:29'),(112,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-13 08:47:48'),(113,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-15 10:57:51'),(114,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-15 17:11:43'),(115,5,'LOGIN','users',5,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-15 17:48:08'),(116,6,'LOGIN','users',6,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-15 17:49:10'),(117,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-15 17:53:43'),(118,6,'LOGIN','users',6,NULL,1,NULL,'192.168.100.9',NULL,NULL,'2025-12-15 17:57:06'),(119,6,'LOGIN','users',6,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-15 18:25:55'),(120,6,'LOGIN','users',6,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-15 18:31:32'),(121,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-16 06:25:10'),(122,1,'LOGIN','users',1,NULL,1,NULL,'192.168.100.4',NULL,NULL,'2025-12-16 07:09:19');
--
-- Table structure for table "activities"
--
DROP TABLE IF EXISTS "activities";
CREATE TABLE "activities" (
  "id" SERIAL,
  "project_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "description" TEXT ,
  "clickup_list_id" VARCHAR(50)  DEFAULT NULL,
  "start_date" date DEFAULT NULL,
  "end_date" date DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'not-started',
  "progress_percentage" INTEGER DEFAULT '0',
  "responsible_person" VARCHAR(255)  DEFAULT NULL,
  "budget" DECIMAL(10,2) DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  "component_id" INTEGER DEFAULT NULL,
  "activity_date" date DEFAULT NULL,
  "location_id" INTEGER DEFAULT NULL,
  "location_details" VARCHAR(500)  DEFAULT NULL,
  "gps_latitude" DECIMAL(10,8) DEFAULT NULL,
  "gps_longitude" DECIMAL(11,8) DEFAULT NULL,
  "parish" VARCHAR(100)  DEFAULT NULL,
  "ward" VARCHAR(100)  DEFAULT NULL,
  "county" VARCHAR(100)  DEFAULT NULL,
  "duration_hours" INTEGER DEFAULT NULL,
  "facilitators" TEXT ,
  "staff_assigned" TEXT ,
  "target_beneficiaries" INTEGER DEFAULT NULL,
  "actual_beneficiaries" INTEGER DEFAULT '0',
  "beneficiary_type" VARCHAR(100)  DEFAULT NULL,
  "budget_allocated" DECIMAL(10,2) DEFAULT NULL,
  "budget_spent" DECIMAL(10,2) DEFAULT '0.00',
  "approval_status" VARCHAR(100)  DEFAULT 'draft',
  "priority" VARCHAR(100)  DEFAULT 'normal',
  "created_by" INTEGER DEFAULT NULL,
  "owned_by" INTEGER DEFAULT NULL,
  "last_modified_by" INTEGER DEFAULT NULL,
  "status_override" BOOLEAN DEFAULT '0',
  "auto_status" VARCHAR(50)  DEFAULT NULL,
  "manual_status" VARCHAR(50)  DEFAULT NULL,
  "status_reason" TEXT,
  "last_status_update" TIMESTAMP NULL DEFAULT NULL,
  "risk_level" VARCHAR(100)  DEFAULT 'none',
  "outcome_notes" TEXT,
  "challenges_faced" TEXT,
  "lessons_learned" TEXT,
  "recommendations" TEXT,
  "immediate_objectives" TEXT,
  "expected_results" TEXT,
  "module_specific_data" JSONB DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_activities_component" FOREIGN KEY ("component_id") REFERENCES "project_components" ("id") ON DELETE CASCADE,
  CONSTRAINT "fk_activities_subprogram" FOREIGN KEY ("project_id") REFERENCES "sub_programs" ("id") ON DELETE CASCADE
)    ;
--
-- Dumping data for table "activities"
--
INSERT INTEGERO "activities" VALUES (6,1,'community health training','ACT-1763978755976','Went well',NULL,'2025-11-25','2025-12-03','completed',100,NULL,NULL,'pending',NULL,'2025-11-24 10:05:56','2025-12-11 20:03:10',NULL,1,'2025-11-17',NULL,'CC road ',NULL,NULL,'Nairobi','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',20,10,'women',300.00,200.00,'approved','normal',NULL,NULL,NULL,0,'completed','completed',NULL,'2025-12-11 20:03:10','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,2,'Activity one','ACT-1764004280149','Activity one',NULL,'2025-11-25',NULL,'completed',100,NULL,NULL,'pending',NULL,'2025-11-24 17:11:20','2025-12-09 19:04:21',NULL,3,'2025-11-23',NULL,'Kibera',NULL,NULL,'Nairobi','Ward-near','Nairobi',4,'susan kei, james kio','peter james, test user',100,0,'youth',1000.00,0.00,'rejected','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,1,'INTEGERroduction to Climate-Smart Agriculture','ACT-FE-001','Workshop covering basics of climate-resilient farming techniques',NULL,'2025-02-10','2025-02-10','completed',100,'Mary Wanjiku',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,1,'2025-02-10',NULL,'Kiambu Agricultural Center',NULL,NULL,'Kiambu Town','Municipality','Kiambu',6,'Mary Wanjiku, John Maina, Agricultural Officer','Field Team Alpha',50,48,'farmers',3000.00,2800.00,'rejected','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,1,'Water Harvesting Techniques Training','ACT-FE-002','Practical training on rainwater harvesting and storage methods',NULL,'2025-03-15','2025-03-15','not-started',0,'John Maina',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-13 08:35:10',NULL,1,'2025-03-14',NULL,'Community Hall - Githunguri',NULL,NULL,'Githunguri','Central Ward','Kiambu',5,'John Maina, Water Engineer Peter','Field Team Alpha',50,25,'farmers',3500.00,1500.00,'submitted','high',NULL,NULL,NULL,0,'on-track','completed','Activity is on track (0.0% ahead/on schedule)','2025-12-13 08:35:10','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,1,'Demonstration Plot Land Preparation','ACT-FE-003','Clearing, plowing, and preparing land for demonstration plots',NULL,'2025-01-20','2025-01-25','completed',100,'Farm Supervisor',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,2,'2025-01-22',NULL,'Kiambu Demo Farm',NULL,NULL,'Kiambu Town','Central','Kiambu',40,'Farm Workers Team','Field Team Alpha',100,95,'farmers',5000.00,4800.00,'approved','',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,2,'Water PoINTEGER Technical Survey','ACT-FE-004','Engineering survey and condition assessment of 15 water poINTEGERs',NULL,'2025-02-05','2025-02-12','completed',100,'Engineer Peter',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,3,'2025-02-08',NULL,'Various locations Machakos',NULL,NULL,'Multiple','Multiple','Machakos',56,'Engineer Peter, Survey Team','Technical Team',2000,2000,'community',15000.00,14500.00,'approved','urgent',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,2,'Mwala Water PoINTEGER Rehabilitation TEST','ACT-FE-005','Complete rehabilitation of Mwala community water poINTEGER',NULL,'2025-03-01','2025-03-10','on-track',100,'John Kamau',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,4,'2025-03-05',NULL,'Mwala Market Area',NULL,NULL,'Mwala','Mwala Ward','Machakos',80,'Engineer Peter, Construction Team','Technical Team',500,0,'community',50000.00,28000.00,'approved','urgent',NULL,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,5,'Kibera VSLA Group Mobilization','ACT-SE-001','Community mobilization and formation of new VSLA groups in Kibera',NULL,'2025-02-01','2025-02-15','completed',100,'Sarah Njeri',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,5,'2025-02-10',NULL,'Kibera Soweto Zone',NULL,NULL,'Kibera','Laini Saba','Nairobi',12,'Sarah Njeri, Community Mobilizers','VSLA Team',150,140,'women',8000.00,7500.00,'approved','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,5,'VSLA Starter Kit Distribution','ACT-SE-002','Distribution of VSLA boxes, record books, and training materials',NULL,'2025-02-20','2025-02-20','completed',100,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,5,'2025-02-20',NULL,'Kibera Community Hall',NULL,NULL,'Kibera','Laini Saba','Nairobi',4,'Sarah Njeri, James Muturi','VSLA Team',150,145,'women',12000.00,11800.00,'approved','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,5,'Basic Financial Management Workshop','ACT-SE-003','Training on budgeting, saving, and financial planning',NULL,'2025-03-05','2025-03-05','completed',100,'James Muturi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-15 17:59:37',NULL,6,'2025-03-05',NULL,'Olympic Community Center',NULL,NULL,'Kibera','Olympic Ward','Nairobi',5,'Financial Trainer, James Muturi','VSLA Team',150,70,'women',6000.00,2800.00,'approved','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-15 17:59:37','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,6,'Youth Entrepreneurship Bootcamp - Day 1','ACT-SE-004','INTEGERroduction to entrepreneurship and business opportunity identification',NULL,'2025-03-10','2025-03-10','completed',100,'James Omondi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,7,'2025-03-10',NULL,'Kisumu Youth Center',NULL,NULL,'Kisumu Town','Market Ward','Kisumu',6,'James Omondi, Business Trainer Sarah','Youth Enterprise Team',40,38,'youth',15000.00,14200.00,'approved','urgent',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,6,'Business Plan Development Workshop','ACT-SE-005','Guided workshop on creating comprehensive business plans',NULL,'2025-03-17','2025-03-17','on-track',0,'Business Trainer Sarah',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,7,'2025-03-17',NULL,'Kisumu Youth Center',NULL,NULL,'Kisumu Town','Market Ward','Kisumu',8,'Business Trainer Sarah, Finance Officer','Youth Enterprise Team',40,0,'youth',18000.00,0.00,'draft','urgent',NULL,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,9,'Community GBV Awareness Rally','ACT-GY-001','Public awareness rally on GBV prevention and reporting mechanisms',NULL,'2025-02-25','2025-02-25','completed',100,'Faith Akinyi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,9,'2025-02-25',NULL,'Mukuru Kwa Njenga',NULL,NULL,'Mukuru','Kwa Njenga Ward','Nairobi',4,'Faith Akinyi, Community Mobilizers, Police Rep','Gender Team',500,480,'community',12000.00,11500.00,'approved','urgent',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,9,'GBV Survivor Counseling Sessions','ACT-GY-002','Individual and group counseling for GBV survivors',NULL,'2025-03-01','2025-03-31','on-track',100,'Counselor Jane',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,10,'2025-03-15',NULL,'Caritas Counseling Center',NULL,NULL,'Nairobi CBD','Central Ward','Nairobi',60,'Counselor Jane, Psychologist Dr. Mary','Gender Team',50,18,'women',20000.00,7500.00,'approved','urgent',NULL,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,10,'Beacon Boys Mentor Recruitment','ACT-GY-003','Recruiting and vetting community mentors for at-risk youth',NULL,'2025-02-10','2025-02-20','completed',100,'Michael Otieno',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,11,'2025-02-15',NULL,'Mombasa Community Centers',NULL,NULL,'Changamwe','Multiple Wards','Mombasa',20,'Michael Otieno, HR Coordinator','Youth Team',30,28,'youth',8000.00,7800.00,'approved','high',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,10,'Life Skills Training - Conflict Resolution','ACT-GY-004','Workshop on conflict resolution and anger management for youth',NULL,'2025-03-08','2025-03-08','on-track',0,'Youth Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-13 08:14:44',NULL,12,'2025-03-05',NULL,'Mombasa Youth Hall',NULL,NULL,'Changamwe','Changamwe Ward','Mombasa',5,'Psychologist Dr. James, Youth Coordinator','Youth Team',50,0,'youth',9000.00,0.00,'rejected','high',NULL,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-13 08:14:44','none',NULL,NULL,NULL,NULL,'Test','Test',NULL),(22,13,'Food Aid Beneficiary Verification','ACT-RL-001','House-to-house verification of drought-affected households',NULL,'2025-01-15','2025-01-30','completed',100,'Agnes Wambui',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,13,'2025-01-22',NULL,'Turkana Villages',NULL,NULL,'Multiple','Multiple','Turkana',120,'Field Assessment Team','Relief Team Alpha',1000,980,'households',15000.00,14800.00,'approved','urgent',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,13,'February Food Distribution Exercise','ACT-RL-002','Monthly food ration distribution to registered beneficiaries',NULL,'2025-02-20','2025-02-22','completed',100,'Logistics Coordinator',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-13 08:06:40',NULL,14,'2025-02-19',NULL,'Lodwar Distribution PoINTEGERs',NULL,NULL,'Lodwar Town','Multiple Wards','Turkana',24,'Distribution Team, Logistics Team','Relief Team Alpha',1000,975,'households',85000.00,84500.00,'approved','urgent',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-13 08:06:40','none',NULL,NULL,NULL,NULL,'Test objective edit','Test expected edit',NULL),(24,14,'Refugee Tailoring Skills Training','ACT-RL-003','Vocational training in tailoring and garment making for refugees',NULL,'2025-02-05','2025-03-15','off-track',0,'Hassan Mohammed',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-13 08:16:45',NULL,15,'2025-02-17',NULL,'Kakuma Vocational Center',NULL,NULL,'Kakuma Camp','Kakuma Ward','Turkana',120,'Hassan Mohammed, Tailoring Instructor','Refugee Support Team',30,28,'refugees',35000.00,18000.00,'approved','high',NULL,NULL,NULL,0,'off-track',NULL,'Activity is critically behind schedule (NaN% behind)','2025-12-13 08:16:45','none','testsss','testsssss','testsss','testsss','test','test',NULL),(25,17,'INTEGERroduction to M&E Systems','ACT-CB-001','Training on monitoring and evaluation fundamentals and tools',NULL,'2025-02-28','2025-03-01','completed',100,'Patrick Mwangi',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,17,'2025-03-01',NULL,'Caritas Training Room',NULL,NULL,'Nairobi CBD','Central','Nairobi',12,'Patrick Mwangi, External M&E Expert','Capacity Building Team',15,14,'staff',12000.00,11500.00,'approved','',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,18,'Community Volunteer Recruitment Event','ACT-CB-002','Public recruitment event for community volunteers across target areas',NULL,'2025-02-18','2025-02-18','completed',100,'Susan Njoki',NULL,'pending',NULL,'2025-11-24 17:59:30','2025-12-09 19:04:21',NULL,19,'2025-02-18',NULL,'Various Community Centers',NULL,NULL,'Multiple','Multiple','Various',8,'Susan Njoki, Volunteer Coordinators','Volunteer Team',100,92,'community',8000.00,7600.00,'approved','',NULL,NULL,NULL,0,'completed',NULL,NULL,'2025-12-09 19:04:21','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,1,'community health trainings','ACT-1764067553465','',NULL,'2025-11-24',NULL,'completed',100,NULL,NULL,'pending',NULL,'2025-11-25 10:45:53','2025-12-11 20:03:43',NULL,1,'2025-11-15',NULL,'Mombasa Youth Hall',NULL,NULL,'Changamwe','Wardnear ','Nairobi',4,'James kai, Peter zech, Susan mendi','James kia, Peterson mbatha, Susuan ndei',100,200,'farmers',1000.00,0.00,'submitted','high',NULL,NULL,NULL,0,'completed','blocked',NULL,'2025-12-11 20:03:43','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,1,'Health sensitive information training ','ACT-1764830207713','Health informatics technical training ',NULL,'2025-12-05',NULL,'in-progress',0,NULL,NULL,'pending',NULL,'2025-12-04 06:36:48','2025-12-13 07:15:57',NULL,1,'2025-11-29',NULL,'Local support Collaborate center ',NULL,NULL,'Nairobi','Kibra','Nairobi ',NULL,'James, Peter, Jude ','Peter,  Evans ',100,120,'Opus team',2000.00,2250.00,'submitted','normal',NULL,NULL,NULL,0,'on-track','completed','Activity is on track (0.0% ahead/on schedule)','2025-12-13 07:15:57','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,1,'Health sensitive information training repeat','ACT-1765033900745','Health sensitive information training repeat',NULL,NULL,NULL,'completed',100,NULL,NULL,'pending',NULL,'2025-12-06 15:11:40','2025-12-13 06:18:39',NULL,1,'2025-11-29',NULL,'Mombasa Youth Hall',NULL,NULL,'Nairobi','Wardnear ','Nairobi',8,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',100,130,'CHVs',2000.00,20000.00,'approved','normal',2,NULL,NULL,0,'completed','completed',NULL,'2025-12-13 06:18:39','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,15,'Emergency Food Distribution activity','ACT-1765339223591','Emergency Food Distribution activity',NULL,NULL,NULL,'on-track',0,NULL,NULL,'pending',NULL,'2025-12-10 04:00:23','2025-12-10 04:04:53','0000-00-00 00:00:00',24,'2025-12-02',NULL,'Community Hall - Githunguri',NULL,NULL,'Nairobi','Wardnear ','Nairobi',NULL,'James kai, Peter zech, Susan mendi','James kia, Peterson mbatha, Susuan ndei',100,0,'farmers',10000.00,0.00,'draft','normal',1,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-10 04:00:23','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,23,'Finance','ACT-1765797737214','finance',NULL,NULL,NULL,'in-progress',0,'Teddy Zach',NULL,'pending',NULL,'2025-12-15 11:22:17','2025-12-16 07:42:08',NULL,25,'2025-12-10',NULL,'CC road',NULL,NULL,'Nairobi','Wardnear ','Nairobi',NULL,'James, James, Susan','Keya june, Peter Eddie',NULL,0,NULL,1050.00,0.00,'approved','normal',1,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-16 07:42:08','none',NULL,NULL,NULL,NULL,'Test objective Finance','Should work as expected',NULL),(32,3,'Test food','ACT-1765866444357','Test food',NULL,NULL,NULL,'',0,NULL,NULL,'pending',NULL,'2025-12-16 06:27:24','2025-12-16 06:27:24',NULL,26,'2025-12-17',NULL,'Community Hall - Githunguri',NULL,NULL,'Changamwe','Wardnear ','Nairobi',NULL,'James kai, Peter zech, Susan mendi','Keya june, Peter Eddie',100,0,'Everyone',1000.00,0.00,'draft','normal',1,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-16 06:27:24','none',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,23,'Budget approval ','ACT-1765866968481','Budget approval test',NULL,NULL,NULL,'',0,NULL,NULL,'pending',NULL,'2025-12-16 06:36:08','2025-12-16 07:41:14',NULL,25,'2025-12-16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,100.00,0.00,'draft','normal',1,NULL,NULL,0,'on-track',NULL,'Activity is on track (0.0% ahead/on schedule)','2025-12-16 07:41:14','none',NULL,NULL,NULL,NULL,NULL,NULL,'{\"budget_line\": \"bl-2025-0001\", \"vendor_payee\": \"Vendor zzz\", \"approval_level\": \"department\", \"invoice_number\": \"inv-00098\", \"payment_method\": \"bank_transfer\", \"receipt_number\": \"rcp-0008\", \"expected_amount\": \"2000\", \"expense_category\": \"program\", \"transaction_type\": \"expense\"}'),(34,1,'Facility allocation','ACT-1765867559970','facility allocation',NULL,'2025-12-17','2025-12-19','',0,NULL,NULL,'pending',NULL,'2025-12-16 06:45:59','2025-12-16 06:45:59',NULL,4,'2025-12-17',NULL,'Community Hall - Githunguri',NULL,NULL,'Nairobi','Wardnear ','Nairobi',16,'susan kei, james kio','peter james, test user',NULL,0,NULL,NULL,0.00,'draft','normal',1,NULL,NULL,0,'not-started',NULL,NULL,'2025-12-16 06:45:59','none',NULL,NULL,NULL,NULL,NULL,NULL,'{\"resource_id\": \"\", \"activity_type\": \"resource_allocation\", \"training_topic\": \"\", \"duration_of_use\": \"2\", \"quantity_needed\": \"1\", \"maINTEGERenance_type\": \"\", \"resource_category\": \"facility\", \"participants_count\": \"\"}');

--
-- Table structure for table "activity_beneficiaries"
--
DROP TABLE IF EXISTS "activity_beneficiaries";
CREATE TABLE "activity_beneficiaries" (
  "id" SERIAL,
  "activity_id" INTEGER NOT NULL,
  "beneficiary_id" INTEGER NOT NULL,
  "role" VARCHAR(100)  DEFAULT 'participant',
  "attended" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "activity_beneficiaries_ibfk_1" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE,
  CONSTRAINT "activity_beneficiaries_ibfk_2" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "activity_beneficiaries"
--
INSERT INTO "activity_beneficiaries" VALUES (1,1,1,'participant',1,'2025-11-24 17:59:30'),(2,1,2,'participant',1,'2025-11-24 17:59:30'),(3,1,10,'participant',1,'2025-11-24 17:59:30'),(4,2,1,'participant',1,'2025-11-24 17:59:30'),(5,2,2,'participant',0,'2025-11-24 17:59:30'),(6,6,3,'participant',1,'2025-11-24 17:59:30'),(7,6,5,'participant',1,'2025-11-24 17:59:30'),(8,6,9,'participant',1,'2025-11-24 17:59:30'),(9,7,3,'participant',1,'2025-11-24 17:59:30'),(10,7,5,'participant',1,'2025-11-24 17:59:30'),(11,8,3,'participant',1,'2025-11-24 17:59:30'),(12,8,5,'participant',1,'2025-11-24 17:59:30'),(13,8,9,'participant',0,'2025-11-24 17:59:30'),(14,9,4,'participant',1,'2025-11-24 17:59:30'),(15,9,11,'participant',1,'2025-11-24 17:59:30'),(16,11,3,'participant',1,'2025-11-24 17:59:30'),(17,11,5,'participant',1,'2025-11-24 17:59:30'),(18,11,15,'participant',1,'2025-11-24 17:59:30');
--
-- Table structure for table "activity_checklists"
--
DROP TABLE IF EXISTS "activity_checklists";
CREATE TABLE "activity_checklists" (
  "id" SERIAL,
  "activity_id" INTEGER NOT NULL,
  "item_name" VARCHAR(255)  NOT NULL,
  "orderindex" INTEGER DEFAULT '0',
  "clickup_checklist_id" VARCHAR(50)  DEFAULT NULL,
  "clickup_checklist_item_id" VARCHAR(50)  DEFAULT NULL,
  "is_completed" BOOLEAN DEFAULT '0',
  "completed_at" TIMESTAMP DEFAULT NULL,
  "completed_by" INTEGER DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "activity_checklists_ibfk_1" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "activity_checklists"
--
INSERT INTO "activity_checklists" VALUES (1,6,'Register the beneficiaries',0,NULL,NULL,1,'2025-11-25 14:03:36',1,'pending',NULL,'2025-11-25 10:52:29','2025-11-25 11:03:35'),(2,6,'Get the training materials and support staff',1,NULL,NULL,1,'2025-11-25 14:03:28',1,'pending',NULL,'2025-11-25 10:52:44','2025-11-25 11:03:27'),(3,6,'Find the venue for the activity',2,NULL,NULL,1,'2025-11-25 14:03:12',1,'pending',NULL,'2025-11-25 10:53:17','2025-11-25 11:03:11'),(4,27,'Register new beneficiaries',0,NULL,NULL,1,'2025-11-25 19:26:33',1,'pending',NULL,'2025-11-25 11:05:08','2025-11-25 16:26:33'),(5,27,'Take ground checks',1,NULL,NULL,1,'2025-11-25 14:50:07',NULL,'pending',NULL,'2025-11-25 11:05:51','2025-11-25 11:50:07'),(6,28,'Beneficialies training',0,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-04 06:37:48','2025-12-04 09:15:18'),(7,29,'Look for venue',0,NULL,NULL,1,'2025-12-06 18:14:36',1,'pending',NULL,'2025-12-06 15:12:08','2025-12-06 15:14:36'),(8,29,'Conduct mobilization',1,NULL,NULL,1,'2025-12-06 18:14:39',1,'pending',NULL,'2025-12-06 15:12:29','2025-12-06 15:14:38'),(9,29,'Budget approval',2,NULL,NULL,1,'2025-12-06 18:14:42',1,'pending',NULL,'2025-12-06 15:12:43','2025-12-06 15:14:41'),(10,31,'Test finace module',0,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-15 11:42:54','2025-12-15 11:42:54'),(11,31,'Add activity form launch as per the Module',1,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-15 11:43:28','2025-12-15 11:45:11'),(12,31,'Module responsiveness be fast',2,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-15 11:45:02','2025-12-15 11:45:02'),(13,33,'Test',0,NULL,NULL,0,NULL,NULL,'pending',NULL,'2025-12-16 07:40:45','2025-12-16 07:40:45');
--
-- Table structure for table "activity_expenses"
--
DROP TABLE IF EXISTS "activity_expenses";
CREATE TABLE "activity_expenses" (
  "id" SERIAL,
  "activity_id" INTEGER NOT NULL,
  "category" VARCHAR(100)  DEFAULT NULL,
  "description" TEXT ,
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(10)  DEFAULT 'KES',
  "expense_date" date NOT NULL,
  "receipt_number" VARCHAR(100)  DEFAULT NULL,
  "approval_status" VARCHAR(100)  DEFAULT 'pending',
  "created_by" INTEGER DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "activity_expenses_ibfk_1" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "activity_expenses"
--
--
-- Table structure for table "activity_risks"
--
DROP TABLE IF EXISTS "activity_risks";
CREATE TABLE "assumptions" (
  "id" SERIAL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "assumption_TEXT" TEXT  NOT NULL,
  "assumption_category" VARCHAR(100)  NOT NULL,
  "likelihood" VARCHAR(100)  DEFAULT 'medium',
  "impact" VARCHAR(100)  DEFAULT 'medium',
  "risk_level" VARCHAR(100)  DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'needs-review',
  "validation_date" date DEFAULT NULL,
  "validation_notes" TEXT ,
  "mitigation_strategy" TEXT ,
  "mitigation_status" VARCHAR(100)  DEFAULT 'not-started',
  "last_reviewed_date" date DEFAULT NULL,
  "next_review_date" date DEFAULT NULL,
  "responsible_person" VARCHAR(255)  DEFAULT NULL,
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "assumptions"
--
INSERT INTEGERO "assumptions" VALUES (1,'module',1,'Stable climatic conditions with normal rainfall patterns','environmental','medium','high','medium','partially-valid','2025-11-26','','Promote climate-resilient agricultural practices and early warning systems','in-progress','2025-11-26',NULL,NULL,NULL,'2025-11-25 15:37:00','2025-11-26 13:26:39',NULL,NULL),(2,'module',5,'All formers must be trained ','external','medium','medium','medium','valid','2025-11-26','','Mobilize all of them to come out ','implemented','2025-11-26',NULL,'Peter',NULL,'2025-11-26 05:52:44','2025-11-26 13:25:09',NULL,NULL);

--
-- Table structure for table "attachments"
--
DROP TABLE IF EXISTS "attachments";
CREATE TABLE "attachments" (
  "id" SERIAL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "clickup_attachment_id" VARCHAR(50)  DEFAULT NULL,
  "file_name" VARCHAR(255)  NOT NULL,
  "file_path" VARCHAR(500)  DEFAULT NULL,
  "file_url" VARCHAR(500)  DEFAULT NULL,
  "file_type" VARCHAR(100)  DEFAULT NULL,
  "file_size" INTEGER DEFAULT NULL,
  "attachment_type" VARCHAR(100)  DEFAULT 'other',
  "description" TEXT ,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "uploaded_by" INTEGER DEFAULT NULL,
  "uploaded_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  "updated_at" TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "attachments"
--
INSERT INTO "attachments" VALUES (1,'verification',1,NULL,'Pharmacy System Requirements.pdf','/uploads/Pharmacy System Requirements-1764239469012-877332348.pdf',NULL,'application/pdf',25488,'document','Pharmacy System Requirements.pdf','pending',NULL,1,'2025-11-27 10:31:09',NULL,NULL,'2025-12-13 06:58:30'),(2,'verification',1,NULL,'Pharmacy System Requirements.pdf','/uploads/Pharmacy System Requirements-1764239503309-524230919.pdf',NULL,'application/pdf',25488,'document','Pharmacy System Requirements.pdf','pending',NULL,1,'2025-11-27 10:31:43',NULL,NULL,'2025-12-13 06:58:30'),(3,'verification',1,NULL,'Screenshot from 2025-09-11 11-09-04.png','/uploads/Screenshot from 2025-09-11 11-09-04-1764240814408-519977795.png',NULL,'image/png',462794,'document','Screenshot from 2025-09-11 11-09-04.png','pending',NULL,1,'2025-11-27 10:53:34',NULL,NULL,'2025-12-13 06:58:30'),(4,'verification',2,NULL,'Gicharu George Ngugi - Professional CV.pdf','/uploads/Gicharu George Ngugi - Professional CV-1764241131855-672290407.pdf',NULL,'application/pdf',652093,'document','Gicharu George Ngugi - Professional CV.pdf','pending',NULL,1,'2025-11-27 10:58:51',NULL,NULL,'2025-12-13 06:58:30'),(5,'verification',2,NULL,'WhatsApp Image 2025-10-29 at 16.53.32.jpeg','/uploads/WhatsApp Image 2025-10-29 at 16.53.32-1764264544156-576971808.jpeg',NULL,'image/jpeg',157086,'document','WhatsApp Image 2025-10-29 at 16.53.32.jpeg','pending',NULL,1,'2025-11-27 17:29:04',NULL,NULL,'2025-12-13 06:58:30');
--
-- Table structure for table "beneficiaries"
--
DROP TABLE IF EXISTS "beneficiaries";
CREATE TABLE "beneficiaries" (
  "id" SERIAL,
  "registration_number" VARCHAR(50)  NOT NULL,
  "first_name" VARCHAR(100)  NOT NULL,
  "middle_name" VARCHAR(100)  DEFAULT NULL,
  "last_name" VARCHAR(100)  NOT NULL,
  "date_of_birth" date DEFAULT NULL,
  "age" INTEGER DEFAULT NULL,
  "gender" VARCHAR(100)  NOT NULL,
  "id_number" VARCHAR(50)  DEFAULT NULL,
  "phone_number" VARCHAR(20)  DEFAULT NULL,
  "alternative_phone" VARCHAR(20)  DEFAULT NULL,
  "email" VARCHAR(100)  DEFAULT NULL,
  "county" VARCHAR(100)  DEFAULT NULL,
  "sub_county" VARCHAR(100)  DEFAULT NULL,
  "ward" VARCHAR(100)  DEFAULT NULL,
  "village" VARCHAR(100)  DEFAULT NULL,
  "gps_latitude" DECIMAL(10,8) DEFAULT NULL,
  "gps_longitude" DECIMAL(11,8) DEFAULT NULL,
  "household_size" INTEGER DEFAULT NULL,
  "household_head" BOOLEAN DEFAULT '0',
  "marital_status" VARCHAR(100)  DEFAULT NULL,
  "disability_status" VARCHAR(100)  DEFAULT 'none',
  "disability_details" TEXT ,
  "vulnerability_category" VARCHAR(100)  DEFAULT NULL,
  "vulnerability_notes" TEXT ,
  "eligible_programs" JSONB DEFAULT NULL,
  "current_programs" JSONB DEFAULT NULL,
  "photo_url" VARCHAR(255)  DEFAULT NULL,
  "registration_date" date NOT NULL,
  "registered_by" INTEGER DEFAULT NULL,
  "program_module_id" INTEGER DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'active',
  "exit_date" date DEFAULT NULL,
  "exit_reason" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "beneficiaries"
--
INSERT INTEGERO "beneficiaries" VALUES (1,'BEN-2024-001','Mary','Wanjiku','Kamau','1985-03-15',39,'female',NULL,'0712345601',NULL,'mary.kamau@email.com','Nairobi','Dagoretti','Kawangware','Kawangware North',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-01-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(2,'BEN-2024-002','John','Mwangi','Ochieng','1990-07-22',34,'male',NULL,'0723456702',NULL,'john.ochieng@email.com','Kisumu','Kisumu East','Manyatta','Nyalenda B',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-01-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(3,'BEN-2024-003','Grace','Akinyi','Otieno','1995-11-08',29,'female',NULL,'0734567803',NULL,NULL,'Mombasa','Mvita','Tononoka','Majengo',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-02-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(4,'BEN-2024-004','David','Kipchoge','Rotich','1978-05-30',46,'male',NULL,'0745678904',NULL,'david.rotich@email.com','Uasin Gishu','Ainabkoi','Kapsoya','Kapsoya Estate',NULL,NULL,7,1,'married','physical',NULL,'pwd',NULL,NULL,NULL,NULL,'2024-02-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(5,'BEN-2024-005','Faith','Nyambura','Kariuki','2002-09-12',22,'female',NULL,'0756789005',NULL,NULL,'Kiambu','Kikuyu','Kikuyu','Kikuyu Town',NULL,NULL,3,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-02-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(6,'BEN-2024-006','Peter','Kamau','Muturi','1965-12-25',59,'male',NULL,'0767890106',NULL,NULL,'Murang\'a','Kigumo','Kinyona','Kinyona Village',NULL,NULL,2,1,'widowed','visual',NULL,'elderly',NULL,NULL,NULL,NULL,'2024-02-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(7,'BEN-2024-007','Sarah','Wambui','Ndungu','1988-04-18',36,'female',NULL,'0778901207',NULL,'sarah.ndungu@email.com','Nakuru','Nakuru West','Kaptembwo','Section 58',NULL,NULL,8,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(8,'BEN-2024-008','James','Otieno','Omondi','1992-08-05',32,'male',NULL,'0789012308',NULL,NULL,'Kisumu','Kisumu Central','Kondele','Nyalenda A',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(9,'BEN-2024-009','Lucy','Njeri','Wanjiru','1999-01-14',25,'female',NULL,'0790123409',NULL,'lucy.wanjiru@email.com','Nairobi','Embakasi','Umoja','Umoja 1',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-03-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(10,'BEN-2024-010','Daniel','Kiprono','Koech','1983-06-20',41,'male',NULL,'0701234510',NULL,NULL,'Kericho','Bureti','Litein','Litein Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-03-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(11,'BEN-2024-011','Esther','Mumbi','Githui','1970-10-10',54,'female',NULL,'0712345611',NULL,'esther.githui@email.com','Kirinyaga','Mwea','Wamumu','Wamumu Village',NULL,NULL,3,1,'divorced','hearing',NULL,'pwd',NULL,NULL,NULL,NULL,'2024-03-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(12,'BEN-2024-012','Michael','Juma','Hassan','1987-02-28',37,'male',NULL,'0723456712',NULL,NULL,'Garissa','Garissa Township','Township','Iftin',NULL,NULL,9,1,'married','none',NULL,'refugee',NULL,NULL,NULL,NULL,'2024-03-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(13,'BEN-2024-013','Alice','Chebet','Sang','1996-11-30',28,'female',NULL,'0734567813',NULL,'alice.sang@email.com','Bomet','Bomet Central','Silibwet','Silibwet Town',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,'null','null',NULL,'2024-04-01',NULL,NULL,'graduated',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:44:02',NULL),(14,'BEN-2024-014','Joseph','Wekesa','Wafula','1975-07-19',49,'male',NULL,'0745678914',NULL,NULL,'Bungoma','Kanduyi','Bukembe','Bukembe West',NULL,NULL,7,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(15,'BEN-2024-015','Rose','Nyokabi','Maina','2003-03-22',21,'female',NULL,'0756789015',NULL,NULL,'Nyeri','Nyeri Central','Ruringu','Ruringu Estate',NULL,NULL,4,0,'single','none',NULL,'ovc',NULL,NULL,NULL,NULL,'2024-04-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(16,'BEN-2024-016','Patrick','Kibet','Kiptoo','1980-11-30',44,'male',NULL,'0767890116',NULL,'patrick.kiptoo@email.com','Nandi','Nandi Hills','Nandi Hills','Nandi Hills Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(17,'BEN-2024-017','Jane','Wangari','Ngugi','1993-09-07',31,'female',NULL,'0778901217',NULL,NULL,'Kajiado','Kajiado Central','Ildamat','Ildamat Village',NULL,NULL,5,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-04-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(18,'BEN-2024-018','Samuel','Mburu','Karanja','1968-05-14',56,'male',NULL,'0789012318',NULL,'samuel.karanja@email.com','Embu','Manyatta','Gaturi North','Gaturi',NULL,NULL,2,1,'widowed','multiple',NULL,'elderly',NULL,NULL,NULL,NULL,'2024-04-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(19,'BEN-2024-019','Catherine','Achieng','Awino','1998-01-25',26,'female',NULL,'0790123419',NULL,NULL,'Siaya','Bondo','West Sakwa','Usonga',NULL,NULL,4,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-05-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(20,'BEN-2024-020','George','Macharia','Njoroge','1986-08-11',38,'male',NULL,'0701234520',NULL,'george.njoroge@email.com','Laikipia','Laikipia East','Nanyuki','Nanyuki Town',NULL,NULL,6,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-05',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(21,'BEN-2024-021','Margaret','Wanjiru','Kimani','1972-04-08',52,'female',NULL,'0712345621',NULL,NULL,'Nyandarua','Ol Kalou','Rurii','Rurii Village',NULL,NULL,3,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-10',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(22,'BEN-2024-022','Francis','Ouma','Odhiambo','1991-10-16',33,'male',NULL,'0723456722',NULL,'francis.odhiambo@email.com','Homa Bay','Ndhiwa','Kwabwai','Kwabwai Market',NULL,NULL,7,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-15',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(23,'BEN-2024-023','Joyce','Wangui','Kimathi','2000-06-29',24,'female',NULL,'0734567823',NULL,NULL,'Meru','Imenti North','Ntima','Ntima East',NULL,NULL,5,0,'single','none',NULL,'youth_at_risk',NULL,NULL,NULL,NULL,'2024-05-20',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(24,'BEN-2024-024','Thomas','Kiptanui','Biwott','1977-12-12',47,'male',NULL,'0745678924',NULL,NULL,'Elgeyo Marakwet','Marakwet West','Kapsowar','Kapsowar Town',NULL,NULL,8,1,'married','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-05-25',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL),(25,'BEN-2024-025','Ann','Njoki','Wachira','1989-02-17',35,'female',NULL,'0756789025',NULL,'ann.wachira@email.com','Tharaka Nithi','Chuka','Karingani','Karingani Village',NULL,NULL,4,1,'divorced','none',NULL,'poor_household',NULL,NULL,NULL,NULL,'2024-06-01',NULL,NULL,'active',NULL,NULL,'2025-12-05 16:22:38','2025-12-05 16:22:38',NULL);

--
-- Table structure for table "budget_revisions"
--
DROP TABLE IF EXISTS "budget_revisions";
CREATE TABLE "comments" (
  "id" SERIAL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "clickup_comment_id" VARCHAR(50)  DEFAULT NULL,
  "comment_TEXT" TEXT  NOT NULL,
  "comment_type" VARCHAR(100)  DEFAULT 'general',
  "user_id" INTEGER DEFAULT NULL,
  "user_name" VARCHAR(255)  DEFAULT NULL,
  "user_email" VARCHAR(255)  DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "comments"
--
--
-- Table structure for table "component_budgets"
--
DROP TABLE IF EXISTS "component_budgets";
CREATE TABLE "gbv_cases" (
  "id" SERIAL,
  "case_number" VARCHAR(50)  NOT NULL,
  "survivor_code" VARCHAR(50)  NOT NULL,
  "beneficiary_id" INTEGER DEFAULT NULL,
  "survivor_age_group" VARCHAR(100)  NOT NULL,
  "gender" VARCHAR(100)  NOT NULL,
  "incident_date" date DEFAULT NULL,
  "incident_type" VARCHAR(100)  NOT NULL,
  "incident_description" TEXT ,
  "incident_location" VARCHAR(100)  DEFAULT NULL,
  "INTEGERake_date" date NOT NULL,
  "case_status" VARCHAR(100)  DEFAULT 'open',
  "risk_level" VARCHAR(100)  DEFAULT 'medium',
  "counseling_sessions" INTEGER DEFAULT '0',
  "medical_referral" BOOLEAN DEFAULT '0',
  "legal_referral" BOOLEAN DEFAULT '0',
  "shelter_provided" BOOLEAN DEFAULT '0',
  "economic_support" BOOLEAN DEFAULT '0',
  "education_support" BOOLEAN DEFAULT '0',
  "referred_to" TEXT ,
  "referral_outcome" TEXT ,
  "last_contact_date" date DEFAULT NULL,
  "next_followup_date" date DEFAULT NULL,
  "case_closure_date" date DEFAULT NULL,
  "closure_reason" TEXT ,
  "program_module_id" INTEGER DEFAULT NULL,
  "case_worker_id" INTEGER DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  "consent_obtained" TEXT ,
  "referral_source" VARCHAR(45)  DEFAULT NULL,
  "age_group" VARCHAR(100)  DEFAULT NULL,
  "location_type" VARCHAR(100)  DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "gbv_cases_ibfk_1" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id"),
  CONSTRAINT "gbv_cases_ibfk_2" FOREIGN KEY ("program_module_id") REFERENCES "program_modules" ("id"),
  CONSTRAINT "gbv_cases_ibfk_3" FOREIGN KEY ("case_worker_id") REFERENCES "users" ("id"),
  CONSTRAINT "gbv_cases_ibfk_4" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
)    ;
--
-- Dumping data for table "gbv_cases"
--
INSERT INTEGERO "gbv_cases" VALUES (1,'GBV-2024-001','SUR-A001',NULL,'','female','2024-01-15','',NULL,'Nairobi, Kawangware','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital',NULL,NULL),(2,'GBV-2024-002','SUR-B002',NULL,'','female','2024-01-22','',NULL,'Kisumu, Nyalenda','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station',NULL,NULL),(3,'GBV-2024-003','SUR-C003',NULL,'','female','2024-02-05','',NULL,'Mombasa, Majengo','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader',NULL,NULL),(4,'GBV-2024-004','SUR-D004',NULL,'','female','2024-02-12','',NULL,'Uasin Gishu, Kapsoya','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','School',NULL,NULL),(5,'GBV-2024-005','SUR-E005',NULL,'','female','2024-02-20','',NULL,'Kiambu, Kikuyu','0000-00-00','closed','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center',NULL,NULL),(6,'GBV-2024-006','SUR-F006',NULL,'','female','2024-03-01','',NULL,'Murang\'a, Kinyona','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station',NULL,NULL),(7,'GBV-2024-007','SUR-G007',NULL,'','female','2024-03-10','',NULL,'Nakuru, Kaptembwo','0000-00-00','follow_up','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','NGO',NULL,NULL),(8,'GBV-2024-008','SUR-H008',NULL,'','female','2024-03-18','',NULL,'Kisumu, Kondele','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital',NULL,NULL),(9,'GBV-2024-009','SUR-I009',NULL,'','female','2024-03-25','',NULL,'Nairobi, Umoja','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Neighbor',NULL,NULL),(10,'GBV-2024-010','SUR-J010',NULL,'','female','2024-04-02','',NULL,'Kericho, Litein','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station',NULL,NULL),(11,'GBV-2024-011','SUR-K011',NULL,'','female','2024-04-08','',NULL,'Kirinyaga, Wamumu','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center',NULL,NULL),(12,'GBV-2024-012','SUR-L012',NULL,'','female','2024-04-15','',NULL,'Bomet, Silibwet','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','School',NULL,NULL),(13,'GBV-2024-013','SUR-M013',NULL,'','female','2024-04-22','',NULL,'Bungoma, Bukembe','0000-00-00','follow_up','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader',NULL,NULL),(14,'GBV-2024-014','SUR-N014',NULL,'','female','2024-05-01','',NULL,'Nyeri, Ruringu','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital',NULL,NULL),(15,'GBV-2024-015','SUR-O015',NULL,'','female','2024-05-08','',NULL,'Nandi, Nandi Hills','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','NGO',NULL,NULL),(16,'GBV-2024-016','SUR-P016',NULL,'','female','2024-05-15','',NULL,'Kajiado, Ildamat','0000-00-00','closed','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station',NULL,NULL),(17,'GBV-2024-017','SUR-Q017',NULL,'','female','2024-05-22','',NULL,'Embu, Gaturi','0000-00-00','follow_up','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Hospital',NULL,NULL),(18,'GBV-2024-018','SUR-R018',NULL,'','female','2024-05-29','',NULL,'Siaya, Usonga','0000-00-00','','medium',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Community Leader',NULL,NULL),(19,'GBV-2024-019','SUR-S019',NULL,'','female','2024-06-05','',NULL,'Laikipia, Nanyuki','0000-00-00','','critical',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Police Station',NULL,NULL),(20,'GBV-2024-020','SUR-T020',NULL,'','female','2024-06-10','',NULL,'Nyandarua, Rurii','0000-00-00','','high',0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,'2025-12-05 17:10:30','2025-12-05 17:10:30',NULL,'1','Health Center',NULL,NULL);

--
-- Table structure for table "goal_categories"
--
DROP TABLE IF EXISTS "goal_categories";
CREATE TABLE "goal_categories" (
  "id" SERIAL,
  "organization_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "description" TEXT ,
  "period" VARCHAR(100)  DEFAULT NULL,
  "clickup_goal_folder_id" VARCHAR(50)  DEFAULT NULL,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "goal_categories_ibfk_1" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "goal_categories"
--
--
-- Table structure for table "indicator_activity_links"
--
DROP TABLE IF EXISTS "indicator_activity_links";
CREATE TABLE "indicator_activity_links" (
  "id" SERIAL,
  "indicator_id" INTEGER NOT NULL,
  "activity_id" INTEGER NOT NULL,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "indicator_activity_links_ibfk_1" FOREIGN KEY ("indicator_id") REFERENCES "indicators" ("id") ON DELETE CASCADE,
  CONSTRAINT "indicator_activity_links_ibfk_2" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "indicator_activity_links"
--
--
-- Table structure for table "indicator_values"
--
DROP TABLE IF EXISTS "indicator_values";
CREATE TABLE "indicators" (
  "id" SERIAL,
  "goal_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "description" TEXT ,
  "clickup_target_id" VARCHAR(50)  DEFAULT NULL,
  "indicator_type" VARCHAR(100)  NOT NULL,
  "target_value" DECIMAL(15,2) DEFAULT NULL,
  "current_value" DECIMAL(15,2) DEFAULT '0.00',
  "unit" VARCHAR(50)  DEFAULT NULL,
  "target_amount" DECIMAL(15,2) DEFAULT NULL,
  "current_amount" DECIMAL(15,2) DEFAULT '0.00',
  "currency" VARCHAR(10)  DEFAULT 'KES',
  "is_completed" BOOLEAN DEFAULT '0',
  "linked_activities_count" INTEGER DEFAULT '0',
  "completed_activities_count" INTEGER DEFAULT '0',
  "progress_percentage" INTEGER DEFAULT '0',
  "tracking_method" VARCHAR(100)  DEFAULT 'manual',
  "is_active" BOOLEAN DEFAULT '1',
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "indicators_ibfk_1" FOREIGN KEY ("goal_id") REFERENCES "strategic_goals" ("id") ON DELETE CASCADE,
  CONSTRAINT "indicators_chk_1" CHECK (("progress_percentage" between 0 and 100))
);

--
-- Dumping data for table "indicators"
--
--
-- Table structure for table "loan_repayments"
--
DROP TABLE IF EXISTS "loan_repayments";
CREATE TABLE "loans" (
  "id" SERIAL,
  "loan_number" VARCHAR(50)  NOT NULL,
  "shg_group_id" INTEGER NOT NULL,
  "member_id" INTEGER NOT NULL,
  "beneficiary_id" INTEGER NOT NULL,
  "loan_type" VARCHAR(100)  DEFAULT 'individual_loan',
  "loan_amount" DECIMAL(15,2) NOT NULL,
  "INTEGERerest_rate" DECIMAL(5,2) NOT NULL,
  "loan_tenure_months" INTEGER NOT NULL,
  "repayment_frequency" VARCHAR(100)  DEFAULT 'monthly',
  "application_date" date NOT NULL,
  "approval_date" date DEFAULT NULL,
  "disbursement_date" date DEFAULT NULL,
  "expected_completion_date" date DEFAULT NULL,
  "actual_completion_date" date DEFAULT NULL,
  "loan_purpose" TEXT  NOT NULL,
  "business_plan_url" VARCHAR(255)  DEFAULT NULL,
  "total_INTEGERerest" DECIMAL(15,2) DEFAULT NULL,
  "total_repayable" DECIMAL(15,2) DEFAULT NULL,
  "amount_repaid" DECIMAL(15,2) DEFAULT '0.00',
  "outstanding_balance" DECIMAL(15,2) DEFAULT NULL,
  "overdue_amount" DECIMAL(15,2) DEFAULT '0.00',
  "loan_status" VARCHAR(100)  DEFAULT 'pending',
  "repayment_status" VARCHAR(100)  DEFAULT 'on_track',
  "days_overdue" INTEGER DEFAULT '0',
  "guarantor1_id" INTEGER DEFAULT NULL,
  "guarantor2_id" INTEGER DEFAULT NULL,
  "approved_by" INTEGER DEFAULT NULL,
  "disbursed_by" INTEGER DEFAULT NULL,
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "loans_ibfk_1" FOREIGN KEY ("shg_group_id") REFERENCES "shg_groups" ("id"),
  CONSTRAINT "loans_ibfk_2" FOREIGN KEY ("member_id") REFERENCES "shg_members" ("id"),
  CONSTRAINT "loans_ibfk_3" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id"),
  CONSTRAINT "loans_ibfk_4" FOREIGN KEY ("guarantor1_id") REFERENCES "shg_members" ("id"),
  CONSTRAINT "loans_ibfk_5" FOREIGN KEY ("guarantor2_id") REFERENCES "shg_members" ("id"),
  CONSTRAINT "loans_ibfk_6" FOREIGN KEY ("approved_by") REFERENCES "users" ("id"),
  CONSTRAINT "loans_ibfk_7" FOREIGN KEY ("disbursed_by") REFERENCES "users" ("id")
)    ;
--
-- Dumping data for table "loans"
--
INSERT INTEGERO "loans" VALUES (1,'LOAN-2024-001',1,0,1,'',50000.00,10.00,12,'monthly','2024-01-20',NULL,NULL,NULL,NULL,'Small shop expansion',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(2,'LOAN-2024-002',1,0,3,'',30000.00,10.00,6,'monthly','2024-02-01',NULL,NULL,NULL,NULL,'Farm inputs purchase',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(3,'LOAN-2024-003',2,0,2,'',40000.00,8.00,12,'monthly','2024-02-10',NULL,NULL,NULL,NULL,'School fees payment',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(4,'LOAN-2024-004',2,0,4,'',60000.00,10.00,12,'monthly','2024-02-15',NULL,NULL,NULL,NULL,'Tailoring business',NULL,NULL,NULL,0.00,NULL,0.00,'active','overdue',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(5,'LOAN-2024-005',3,0,7,'',20000.00,8.00,6,'monthly','2024-03-01',NULL,NULL,NULL,NULL,'Medical emergency',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(6,'LOAN-2024-006',3,0,9,'',45000.00,10.00,12,'monthly','2024-03-05',NULL,NULL,NULL,NULL,'Beauty salon',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(7,'LOAN-2024-007',4,0,10,'',80000.00,12.00,18,'monthly','2024-03-10',NULL,NULL,NULL,NULL,'Dairy farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(8,'LOAN-2024-008',4,0,12,'',55000.00,10.00,12,'monthly','2024-03-15',NULL,NULL,NULL,NULL,'Motorcycle taxi',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(9,'LOAN-2024-009',5,0,13,'',35000.00,8.00,12,'monthly','2024-03-20',NULL,NULL,NULL,NULL,'Vocational training',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(10,'LOAN-2024-010',5,0,15,'',25000.00,10.00,6,'monthly','2024-03-25',NULL,NULL,NULL,NULL,'Vegetable vending',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(11,'LOAN-2024-011',1,0,5,'',40000.00,10.00,12,'monthly','2024-04-01',NULL,NULL,NULL,NULL,'Poultry farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(12,'LOAN-2024-012',2,0,6,'',70000.00,12.00,18,'monthly','2024-04-05',NULL,NULL,NULL,NULL,'Hardware shop',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(13,'LOAN-2024-013',3,0,11,'',15000.00,8.00,6,'monthly','2024-04-10',NULL,NULL,NULL,NULL,'House repair',NULL,NULL,NULL,0.00,NULL,0.00,'completed','completed',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(14,'LOAN-2024-014',4,0,14,'',50000.00,10.00,12,'monthly','2024-04-15',NULL,NULL,NULL,NULL,'Grocery store',NULL,NULL,NULL,0.00,NULL,0.00,'active','overdue',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(15,'LOAN-2024-015',5,0,17,'',35000.00,10.00,12,'monthly','2024-04-20',NULL,NULL,NULL,NULL,'Crop farming',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(16,'LOAN-2024-016',1,0,7,'',45000.00,10.00,12,'monthly','2024-04-25',NULL,NULL,NULL,NULL,'Clothing business',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(17,'LOAN-2024-017',2,0,8,'',30000.00,8.00,12,'monthly','2024-05-01',NULL,NULL,NULL,NULL,'College fees',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(18,'LOAN-2024-018',3,0,13,'',55000.00,10.00,12,'monthly','2024-05-05',NULL,NULL,NULL,NULL,'Restaurant',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(19,'LOAN-2024-019',4,0,16,'',65000.00,12.00,18,'monthly','2024-05-10',NULL,NULL,NULL,NULL,'Greenhouse farming',NULL,NULL,NULL,0.00,NULL,0.00,'disbursed','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(20,'LOAN-2024-020',5,0,19,'',40000.00,10.00,12,'monthly','2024-05-15',NULL,NULL,NULL,NULL,'Fish vending',NULL,NULL,NULL,0.00,NULL,0.00,'approved','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(21,'LOAN-2024-021',1,0,9,'',18000.00,8.00,6,'monthly','2024-05-20',NULL,NULL,NULL,NULL,'Family emergency',NULL,NULL,NULL,0.00,NULL,0.00,'active','on_track',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(22,'LOAN-2024-022',2,0,20,'',60000.00,10.00,12,'monthly','2024-05-25',NULL,NULL,NULL,NULL,'Barbershop',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(23,'LOAN-2024-023',3,0,21,'',75000.00,12.00,18,'monthly','2024-06-01',NULL,NULL,NULL,NULL,'Livestock purchase',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(24,'LOAN-2024-024',4,0,22,'',50000.00,10.00,12,'monthly','2024-06-05',NULL,NULL,NULL,NULL,'Welding workshop',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL),(25,'LOAN-2024-025',5,0,23,'',32000.00,8.00,12,'monthly','2024-06-10',NULL,NULL,NULL,NULL,'Driving school',NULL,NULL,NULL,0.00,NULL,0.00,'pending','',0,NULL,NULL,NULL,NULL,NULL,'2025-12-05 16:48:38','2025-12-05 16:48:38',NULL);

--
-- Table structure for table "locations"
--
DROP TABLE IF EXISTS "locations";
CREATE TABLE "locations" (
  "id" SERIAL,
  "name" VARCHAR(255)  NOT NULL,
  "type" VARCHAR(100)  NOT NULL,
  "parent_id" INTEGER DEFAULT NULL,
  "coordinates" JSONB DEFAULT NULL,
  "boundary_data" JSONB DEFAULT NULL,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "locations_ibfk_1" FOREIGN KEY ("parent_id") REFERENCES "locations" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "locations"
--
--
-- Table structure for table "me_indicators"
--
DROP TABLE IF EXISTS "me_indicators";
CREATE TABLE "me_indicators" (
  "id" SERIAL,
  "program_id" INTEGER DEFAULT NULL,
  "project_id" INTEGER DEFAULT NULL,
  "activity_id" INTEGER DEFAULT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "description" TEXT ,
  "type" VARCHAR(100)  NOT NULL,
  "category" VARCHAR(100)  DEFAULT NULL,
  "unit_of_measure" VARCHAR(50)  DEFAULT NULL,
  "baseline_value" DECIMAL(15,2) DEFAULT NULL,
  "target_value" DECIMAL(15,2) NOT NULL,
  "current_value" DECIMAL(15,2) DEFAULT '0.00',
  "collection_frequency" VARCHAR(100)  DEFAULT 'monthly',
  "data_source" TEXT ,
  "verification_method" TEXT ,
  "disaggregation" JSONB DEFAULT NULL,
  "clickup_custom_field_id" VARCHAR(50)  DEFAULT NULL,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "module_id" INTEGER DEFAULT NULL,
  "sub_program_id" INTEGER DEFAULT NULL,
  "component_id" INTEGER DEFAULT NULL,
  "baseline_date" date DEFAULT NULL,
  "target_date" date DEFAULT NULL,
  "last_measured_date" date DEFAULT NULL,
  "next_measurement_date" date DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'not-started',
  "achievement_percentage" DECIMAL(5,2) DEFAULT '0.00',
  "responsible_person" VARCHAR(255)  DEFAULT NULL,
  "notes" TEXT,
  "created_by" INTEGER DEFAULT NULL,
  "owned_by" INTEGER DEFAULT NULL,
  "last_modified_by" INTEGER DEFAULT NULL,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  "variance" DECIMAL(15,2) DEFAULT '0.00',
  "performance_status" VARCHAR(100)  DEFAULT 'not-started',
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_me_indicators_component" FOREIGN KEY ("component_id") REFERENCES "project_components" ("id") ON DELETE CASCADE,
  CONSTRAINT "fk_me_indicators_module" FOREIGN KEY ("module_id") REFERENCES "program_modules" ("id") ON DELETE CASCADE,
  CONSTRAINT "fk_me_indicators_sub_program" FOREIGN KEY ("sub_program_id") REFERENCES "sub_programs" ("id") ON DELETE CASCADE,
  CONSTRAINT "me_indicators_ibfk_1" FOREIGN KEY ("program_id") REFERENCES "programs" ("id") ON DELETE CASCADE,
  CONSTRAINT "me_indicators_ibfk_2" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
  CONSTRAINT "me_indicators_ibfk_3" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
)    ;
--
-- Dumping data for table "me_indicators"
--
INSERT INTEGERO "me_indicators" VALUES (1,NULL,NULL,NULL,'Number of beneficiaries reached','SEED-MODULE-001','Total number of beneficiaries reached through Capacity Building','impact',NULL,'people',0.00,5000.00,1250.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-12-09 15:19:32',5,NULL,NULL,'2024-12-31','2025-12-30',NULL,NULL,'off-track',25.00,'Project Manager','Q1 progress on track',NULL,NULL,NULL,NULL,-3750.00,'not-started'),(2,NULL,NULL,NULL,'Training sessions completed','SEED-MODULE-002','Number of training sessions delivered under Capacity Building','output','','sessionszz',0.00,50.00,0.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-12-09 15:19:32',5,NULL,NULL,'2024-12-29','2025-12-28',NULL,NULL,'not-started',0.00,'Training Coordinator','Ahead of schedule in regional offices',NULL,NULL,NULL,NULL,-50.00,'not-started'),(3,NULL,NULL,NULL,'Satisfaction rate','SEED-MODULE-003','Beneficiary satisfaction rate for Capacity Building','outcome','Hts','percentage',65.00,85.00,84.00,'monthly','M&E reports','Field verification',NULL,NULL,1,'2025-11-26 19:31:56','2025-12-09 15:19:32',5,NULL,NULL,'2025-11-24','2025-11-24',NULL,NULL,'on-track',98.82,'M&E Officer','Need to improve service delivery in some areas',NULL,NULL,NULL,NULL,-1.00,'not-started'),(4,NULL,NULL,NULL,'test','code','','output','test','test',200.00,400.00,1.00,'monthly','','',NULL,NULL,1,'2025-11-27 05:45:36','2025-12-09 15:19:32',5,NULL,NULL,'0000-00-00','2025-11-22',NULL,NULL,'off-track',0.25,'Peterson James',NULL,NULL,NULL,NULL,NULL,-399.00,'not-started'),(5,NULL,NULL,NULL,'customer care service','ccs12','how the staff INTEGEReract and engage with our clients','output','health','people',2.50,5.00,1.50,'monthly','clients','review forms',NULL,NULL,1,'2025-11-27 06:08:49','2025-12-09 15:19:32',NULL,19,NULL,'2025-10-27','2025-11-27',NULL,NULL,'off-track',30.00,'customer relations manager',NULL,NULL,NULL,NULL,NULL,-3.50,'not-started'),(6,NULL,NULL,NULL,'success of the training','sot 34','if the training is having any positive impact to the community','outcome','education','%',30.00,100.00,40.00,'monthly','trainees','list of the attendees',NULL,NULL,1,'2025-11-27 06:20:29','2025-12-09 15:19:32',NULL,21,NULL,'2025-09-27','2025-12-27',NULL,NULL,'off-track',40.00,'M&E',NULL,NULL,NULL,NULL,NULL,-60.00,'not-started'),(7,NULL,NULL,6,'Community healt','ch-ooo2','test','output','health','people',100.00,200.00,150.00,'daily',NULL,NULL,NULL,NULL,1,'2025-11-27 07:47:26','2025-12-09 15:19:32',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',75.00,'Training team',NULL,NULL,NULL,NULL,NULL,-50.00,'not-started'),(8,NULL,NULL,NULL,'Number oF participant Trained','NPT-001','','output','Health','People',400.00,499.98,350.00,'daily','Attendance sheet','Physical attendance list',NULL,NULL,1,'2025-12-06 15:25:51','2025-12-09 15:19:32',5,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'at-risk',70.00,'Abel',NULL,NULL,NULL,NULL,NULL,-149.98,'not-started'),(9,NULL,NULL,24,'Refugee Tailoring Skills Training Acquired','rft-002','test if the skills were acquired','outcome','Education','Skill %',50.00,100.00,20.00,'daily','Assessments','INTEGERerview ',NULL,NULL,1,'2025-12-09 15:45:47','2025-12-11 05:35:00',NULL,NULL,NULL,'0000-00-00','0000-00-00',NULL,NULL,'off-track',20.00,'SEEP team',NULL,NULL,NULL,NULL,NULL,0.00,'not-started'),(10,NULL,NULL,24,'Refugee Tailoring Skills Training are acqured to the target','TCS-234','objective ','impact','Education','People',200.00,200.00,200.00,'daily',NULL,NULL,NULL,NULL,1,'2025-12-10 03:04:28','2025-12-10 03:04:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'on-track',100.00,'Jaiden Test',NULL,NULL,NULL,NULL,NULL,0.00,'not-started');

--
-- Table structure for table "me_reports"
--
DROP TABLE IF EXISTS "me_reports";
CREATE TABLE "means_of_verification" (
  "id" SERIAL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "verification_method" VARCHAR(255)  NOT NULL,
  "description" TEXT ,
  "evidence_type" VARCHAR(100)  NOT NULL,
  "document_name" VARCHAR(255)  DEFAULT NULL,
  "document_path" VARCHAR(500)  DEFAULT NULL,
  "document_date" date DEFAULT NULL,
  "verification_status" VARCHAR(100)  DEFAULT 'pending',
  "verified_by" INTEGER DEFAULT NULL,
  "verified_date" date DEFAULT NULL,
  "verification_notes" TEXT ,
  "collection_frequency" VARCHAR(100)  DEFAULT 'monthly',
  "responsible_person" VARCHAR(255)  DEFAULT NULL,
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "owned_by" INTEGER DEFAULT NULL,
  "last_modified_by" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "means_of_verification"
--
INSERT INTEGERO "means_of_verification" VALUES (1,'module',1,'Household surveys and field reports','Annual household food security surveys conducted in target communities','report','','','0000-00-00','verified',1,'2025-11-27','Perfect','annual','','','2025-11-25 15:37:00','2025-11-27 10:33:00',NULL,NULL,NULL,NULL),(2,'indicator',5,'Observation','taken some observation and recorded','','Observation Report','','2025-11-24','rejected',1,'2025-12-10','Not valid ','daily','Training Team','Finished well','2025-11-27 10:58:06','2025-12-10 04:16:04',NULL,NULL,NULL,NULL),(3,'activity',24,'Assessment','Asses the team who under went the training for skills understanding and level acquired ','',NULL,NULL,NULL,'needs-update',1,NULL,'Go ahead and give the evidence since this is crutial','daily','SEEP team',NULL,'2025-12-09 15:50:05','2025-12-13 05:32:22',NULL,NULL,NULL,NULL),(4,'module',2,'test','test','report','test','test','2025-12-08','verified',1,'2025-12-09','For testing purposes','','Test person','test ones','2025-12-09 15:55:35','2025-12-09 15:55:56',NULL,NULL,NULL,NULL),(5,'activity',29,'Attendance sheet','Verification','document','Attendance sheet',NULL,'2025-12-13','pending',NULL,NULL,NULL,'','Jane','Need support','2025-12-13 05:35:11','2025-12-13 05:35:11',NULL,NULL,NULL,NULL);

--
-- Table structure for table "nutrition_assessments"
--
DROP TABLE IF EXISTS "nutrition_assessments";
CREATE TABLE "organizations" (
  "id" SERIAL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "description" TEXT ,
  "clickup_team_id" VARCHAR(50)  DEFAULT NULL,
  "clickup_workspace_id" VARCHAR(50)  DEFAULT NULL,
  "settings" JSONB DEFAULT NULL,
  "email" VARCHAR(255)  DEFAULT NULL,
  "phone" VARCHAR(50)  DEFAULT NULL,
  "address" TEXT ,
  "country" VARCHAR(100)  DEFAULT 'Kenya',
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "organizations"
--
INSERT INTO "organizations" VALUES (1,'Caritas Nairobi','CARITAS_NBO','Caritas Nairobi - Catholic Archdiocese of Nairobi',NULL,NULL,NULL,NULL,NULL,NULL,'Kenya',1,'2025-11-17 07:39:02','2025-11-17 07:39:02');
--
-- Table structure for table "performance_comments"
--
DROP TABLE IF EXISTS "performance_comments";
CREATE TABLE "permissions" (
  "id" SERIAL,
  "name" VARCHAR(100)  NOT NULL,
  "resource" VARCHAR(50)  NOT NULL,
  "action" VARCHAR(50)  NOT NULL,
  "description" TEXT,
  "applies_to" VARCHAR(100)  DEFAULT 'all',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "permissions"
--
INSERT INTO "permissions" VALUES (1,'activities.create','activities','create','Create new activities','module','2025-11-27 18:31:40'),(2,'activities.read.all','activities','read','View all activities','all','2025-11-27 18:31:40'),(3,'activities.read.own','activities','read','View own activities','own','2025-11-27 18:31:40'),(4,'activities.read.module','activities','read','View module activities','module','2025-11-27 18:31:40'),(5,'activities.update.all','activities','update','Edit all activities','all','2025-11-27 18:31:40'),(6,'activities.update.own','activities','update','Edit own activities','own','2025-11-27 18:31:40'),(7,'activities.update.module','activities','update','Edit module activities','module','2025-11-27 18:31:40'),(8,'activities.delete.all','activities','delete','Delete all activities','all','2025-11-27 18:31:40'),(9,'activities.delete.own','activities','delete','Delete own activities','own','2025-11-27 18:31:40'),(10,'activities.approve','activities','approve','Approve activities','module','2025-11-27 18:31:40'),(11,'activities.reject','activities','reject','Reject activities','module','2025-11-27 18:31:40'),(12,'activities.submit','activities','submit','Submit for approval','own','2025-11-27 18:31:40'),(13,'verifications.create','verifications','create','Create verifications','module','2025-11-27 18:31:40'),(14,'verifications.read.all','verifications','read','View all verifications','all','2025-11-27 18:31:40'),(15,'verifications.read.module','verifications','read','View module verifications','module','2025-11-27 18:31:40'),(16,'verifications.update.all','verifications','update','Edit all verifications','all','2025-11-27 18:31:40'),(17,'verifications.update.module','verifications','update','Edit module verifications','module','2025-11-27 18:31:40'),(18,'verifications.delete.all','verifications','delete','Delete all verifications','all','2025-11-27 18:31:40'),(19,'verifications.verify','verifications','verify','Verify evidence','module','2025-11-27 18:31:40'),(20,'verifications.reject','verifications','reject','Reject evidence','module','2025-11-27 18:31:40'),(21,'indicators.create','indicators','create','Create indicators','module','2025-11-27 18:31:40'),(22,'indicators.read.all','indicators','read','View all indicators','all','2025-11-27 18:31:40'),(23,'indicators.read.module','indicators','read','View module indicators','module','2025-11-27 18:31:40'),(24,'indicators.update.all','indicators','update','Edit all indicators','all','2025-11-27 18:31:40'),(25,'indicators.update.module','indicators','update','Edit module indicators','module','2025-11-27 18:31:40'),(26,'indicators.delete.all','indicators','delete','Delete all indicators','all','2025-11-27 18:31:40'),(27,'settings.view','settings','read','View settings','all','2025-11-27 18:31:40'),(28,'settings.manage','settings','manage','Manage system settings','all','2025-11-27 18:31:40'),(29,'users.create','users','create','Create new users','','2025-11-27 18:31:40'),(30,'users.read.all','users','read','View all users','all','2025-11-27 18:31:40'),(31,'users.read.team','users','read','View team members','team','2025-11-27 18:31:40'),(32,'users.update.all','users','update','Edit all users','all','2025-11-27 18:31:40'),(33,'users.delete','users','delete','Delete users','','2025-11-27 18:31:40'),(34,'users.manage_roles','users','manage','Assign roles to users','all','2025-11-27 18:31:40'),(35,'reports.view.all','reports','read','View all reports','all','2025-11-27 18:31:40'),(36,'reports.view.module','reports','read','View module reports','module','2025-11-27 18:31:40'),(37,'reports.export','reports','export','Export reports','module','2025-11-27 18:31:40'),(38,'budget.view.all','budget','read','View all budgets','all','2025-11-27 18:31:40'),(39,'budget.view.module','budget','read','View module budgets','module','2025-11-27 18:31:40'),(40,'budget.update.all','budget','update','Edit all budgets','all','2025-11-27 18:31:40'),(41,'budget.update.module','budget','update','Edit module budgets','module','2025-11-27 18:31:40'),(42,'modules.read','modules','read','View program modules','','2025-11-27 18:31:40'),(43,'modules.manage','modules','manage','Manage modules','all','2025-11-27 18:31:40'),(44,'users.read','users','read','View user information','','2025-12-09 04:17:10'),(45,'users.update','users','update','Update user information','','2025-12-09 04:17:10'),(46,'activities.read','activities','read','View activities','module','2025-12-09 04:17:10'),(47,'activities.update','activities','update','Update activities','module','2025-12-09 04:17:10'),(48,'activities.delete','activities','delete','Delete activities','module','2025-12-09 04:17:10'),(49,'reports.create','reports','create','Create reports','module','2025-12-09 04:17:10'),(50,'reports.read','reports','read','View reports','module','2025-12-09 04:17:10'),(51,'reports.update','reports','update','Update reports','module','2025-12-09 04:17:10'),(52,'reports.delete','reports','delete','Delete reports','module','2025-12-09 04:17:10'),(53,'modules.create','modules','create','Create program modules','','2025-12-09 04:17:10'),(54,'modules.update','modules','update','Update program modules','','2025-12-09 04:17:10'),(55,'modules.delete','modules','delete','Delete program modules','','2025-12-09 04:17:10'),(56,'settings.read','settings','read','View system settings','','2025-12-09 04:17:10'),(57,'settings.update','settings','update','Update system settings','','2025-12-09 04:17:10');
--
-- Table structure for table "program_budgets"
--
DROP TABLE IF EXISTS "program_budgets";
CREATE TABLE "program_modules" (
  "id" SERIAL,
  "organization_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "icon" VARCHAR(10)  DEFAULT NULL,
  "description" TEXT ,
  "color" VARCHAR(20)  DEFAULT NULL,
  "clickup_space_id" VARCHAR(50)  DEFAULT NULL,
  "budget" DECIMAL(15,2) DEFAULT NULL,
  "start_date" date DEFAULT NULL,
  "end_date" date DEFAULT NULL,
  "manager_name" VARCHAR(255)  DEFAULT NULL,
  "manager_email" VARCHAR(255)  DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'active',
  "is_active" BOOLEAN DEFAULT '1',
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  "logframe_goal" TEXT,
  "goal_indicators" TEXT,
  "overall_status" VARCHAR(50)  DEFAULT 'not-started',
  "status_override" BOOLEAN DEFAULT '0',
  "last_status_update" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "program_modules_ibfk_1" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "program_modules"
--
INSERT INTO "program_modules" VALUES (1,1,'Food, Water & Environment','FOOD_ENV','🌾','Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(2,1,'Socio-Economic Empowerment','SEEP','💼','Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-12 06:04:25',NULL,NULL,NULL,'not-started',0,NULL),(3,1,'Gender, Youth & Peace','GENDER_YOUTH','👥','Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(4,1,'Relief & Charitable Services','RELIEF','🆘','Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-11-17 07:39:02',NULL,NULL,NULL,'not-started',0,NULL),(5,1,'Resource Management','RESOURCE_MGMT','🏗️','Resource Allocation & Management, Capacity Building, Infrastructure Development, Material Resources, and Strategic Resource Planning',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-15 10:25:36',NULL,NULL,NULL,'not-started',0,NULL),(6,1,'Finance Management','FINANCE_MGMT','💰','Budget Management, Financial Planning, Expenditure Tracking, Program Funding Allocation, and Financial Reporting',NULL,NULL,NULL,'2024-01-01',NULL,NULL,NULL,'active',1,'pending',NULL,NULL,'2025-11-17 07:39:02','2025-12-15 11:26:33',NULL,NULL,'Finance','not-started',0,NULL);
--
-- Table structure for table "programs"
--
DROP TABLE IF EXISTS "programs";
CREATE TABLE "programs" (
  "id" SERIAL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "icon" VARCHAR(10)  DEFAULT NULL,
  "description" TEXT ,
  "clickup_space_id" VARCHAR(50)  DEFAULT NULL,
  "start_date" date NOT NULL,
  "end_date" date DEFAULT NULL,
  "budget" DECIMAL(15,2) DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'active',
  "manager_id" INTEGER DEFAULT NULL,
  "manager_name" VARCHAR(255)  DEFAULT NULL,
  "manager_email" VARCHAR(255)  DEFAULT NULL,
  "country" VARCHAR(100)  DEFAULT NULL,
  "region" VARCHAR(100)  DEFAULT NULL,
  "district" VARCHAR(100)  DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "programs"
--
INSERT INTEGERO "programs" VALUES (1,'Food & Environment','FOOD_ENV','🌾','Sustainable agriculture, food security, and environmental conservation programs',NULL,'2024-01-01',NULL,500000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(2,'Socio-Economic','SOCIO_ECON','💼','Economic empowerment, livelihoods, and poverty alleviation initiatives',NULL,'2024-01-01',NULL,450000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(3,'Gender & Youth','GENDER_YOUTH','👥','Gender equality, youth empowerment, and social inclusion programs',NULL,'2024-01-01',NULL,350000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(4,'Relief Services','RELIEF','🏥','Emergency relief, health services, and humanitarian assistance',NULL,'2024-01-01',NULL,600000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL),(5,'Capacity Building','CAPACITY','🎓','Training, institutional strengthening, and skills development programs',NULL,'2024-01-01',NULL,400000.00,'active',NULL,NULL,NULL,NULL,NULL,NULL,'pending',NULL,NULL,'2025-11-17 06:25:29','2025-11-17 06:25:29',NULL);

--
-- Table structure for table "project_components"
--
DROP TABLE IF EXISTS "project_components";
CREATE TABLE "project_components" (
  "id" SERIAL,
  "sub_program_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "description" TEXT ,
  "clickup_list_id" VARCHAR(50)  DEFAULT NULL,
  "budget" DECIMAL(10,2) DEFAULT NULL,
  "orderindex" INTEGER DEFAULT '0',
  "status" VARCHAR(100)  DEFAULT 'not-started',
  "progress_percentage" INTEGER DEFAULT '0',
  "is_active" BOOLEAN DEFAULT '1',
  "responsible_person" VARCHAR(255)  DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  "logframe_output" TEXT,
  "output_indicators" TEXT,
  "overall_status" VARCHAR(50)  DEFAULT NULL,
  "status_override" BOOLEAN DEFAULT '0',
  "auto_status" VARCHAR(50)  DEFAULT NULL,
  "manual_status" VARCHAR(50)  DEFAULT NULL,
  "last_status_update" TIMESTAMP NULL DEFAULT NULL,
  "risk_level" VARCHAR(100)  DEFAULT 'none',
  PRIMARY KEY ("id"),
  CONSTRAINT "project_components_ibfk_1" FOREIGN KEY ("sub_program_id") REFERENCES "sub_programs" ("id") ON DELETE CASCADE,
  CONSTRAINT "project_components_chk_1" CHECK (("progress_percentage" between 0 and 100))
);

--
-- Dumping data for table "project_components"
--
INSERT INTO "project_components" VALUES (1,1,'Health outreach ','COMP-001','For health outreach ',NULL,500.00,0,'not-started',67,1,'James keya','pending',NULL,'2025-11-23 12:57:01','2025-12-13 08:35:10',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-13 08:35:10','none'),(2,1,'professional volunteers training','COMP-002','professional volunteers ',NULL,500.00,0,'',100,1,'Susan susan','pending',NULL,'2025-11-23 12:59:56','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(3,2,'Component 1','COMP-003','',NULL,2000.00,0,'not-started',100,1,'Susan kpt','pending',NULL,'2025-11-24 17:08:48','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(4,1,'Farmer Training Workshops','COMP-FE-001','Conducting hands-on training workshops for farmers on climate-smart practices',NULL,50000.00,1,'in-progress',50,1,'Mary Wanjiku','pending',NULL,'2025-11-24 17:59:29','2025-12-16 06:46:00',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 06:46:00','none'),(5,1,'Demonstration Plots Setup','COMP-FE-002','Establishing demonstration plots for practical learning',NULL,35000.00,2,'in-progress',100,1,'John Maina','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(6,2,'Water Point Assessment','COMP-FE-003','Technical assessment of existing water points needing rehabilitation',NULL,25000.00,1,'completed',100,1,'Engineer Peter','pending',NULL,'2025-11-24 17:59:29','2025-12-15 17:59:37',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-15 17:59:37','none'),(7,2,'Rehabilitation Works','COMP-FE-004','Physical rehabilitation and repair of water points',NULL,180000.00,2,'in-progress',50,1,'John Kamau','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-09 19:04:21','none'),(8,5,'VSLA Group Formation','COMP-SE-001','Identifying and forming new VSLA groups in target communities',NULL,30000.00,1,'in-progress',0,1,'Sarah Njeri','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(9,5,'Financial Literacy Training','COMP-SE-002','Training VSLA members on financial management and record-keeping',NULL,40000.00,2,'in-progress',100,1,'James Muturi','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(10,6,'Business Skills Workshops','COMP-SE-003','Training youth on business planning, marketing, and management',NULL,80000.00,1,'in-progress',100,1,'James Omondi','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-09 19:04:21','none'),(11,6,'Startup Capital Grants','COMP-SE-004','Providing seed capital grants to trained youth entrepreneurs',NULL,100000.00,2,'not-started',100,1,'Finance Team','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(12,9,'Community Awareness Campaigns','COMP-GY-001','Public awareness campaigns on GBV prevention and reporting',NULL,45000.00,1,'in-progress',0,1,'Faith Akinyi','pending',NULL,'2025-11-24 17:59:29','2025-12-13 08:14:44',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-13 08:14:44','none'),(13,9,'Survivor Support Services','COMP-GY-002','Providing counseling and legal support to GBV survivors',NULL,55000.00,2,'in-progress',100,1,'Social Worker Team','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(14,10,'Mentorship Program Setup','COMP-GY-003','Recruiting and training mentors for at-risk youth',NULL,40000.00,1,'in-progress',100,1,'Michael Otieno','pending',NULL,'2025-11-24 17:59:29','2025-12-13 08:06:40',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-13 08:06:40','none'),(15,10,'Life Skills Workshops','COMP-GY-004','Conducting life skills and vocational training sessions',NULL,45000.00,2,'in-progress',0,1,'Youth Coordinator','pending',NULL,'2025-11-24 17:59:29','2025-12-13 08:16:45',NULL,NULL,NULL,'off-track',0,'off-track',NULL,'2025-12-13 08:16:45','none'),(16,13,'Beneficiary Registration','COMP-RL-001','Registering and verifying eligible households for food assistance',NULL,35000.00,1,'in-progress',0,1,'Agnes Wambui','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(17,13,'Food Distribution Events','COMP-RL-002','Organizing and conducting monthly food distribution exercises',NULL,220000.00,2,'in-progress',100,1,'Logistics Team','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(18,14,'Livelihood Support Programs','COMP-RL-003','Skills training and income generation activities for refugees',NULL,120000.00,1,'in-progress',0,1,'Hassan Mohammed','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(19,14,'Education Support Services','COMP-RL-004','Providing educational materials and support to refugee children',NULL,100000.00,2,'in-progress',100,1,'Education Coordinator','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'completed',0,'completed',NULL,'2025-12-09 19:04:21','none'),(20,17,'M&E Training Module','COMP-CB-001','Training staff on monitoring, evaluation, and reporting systems',NULL,35000.00,1,'in-progress',0,1,'Patrick Mwangi','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(21,17,'Project Management Certification','COMP-CB-002','Professional project management certification courses for senior staff',NULL,40000.00,2,'not-started',0,1,'HR Department','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(22,18,'Volunteer Recruitment Drive','COMP-CB-003','Community outreach and volunteer recruitment campaigns',NULL,25000.00,1,'in-progress',0,1,'Susan Njoki','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(23,18,'Volunteer Training & Orientation','COMP-CB-004','Comprehensive training program for new volunteers',NULL,35000.00,2,'in-progress',0,1,'Training Team','pending',NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(24,15,'Emergency Food Distribution','Emc-001','Emergency Food Distribution',NULL,NULL,0,'',0,1,'Susan kpt','pending',NULL,'2025-12-10 03:56:46','2025-12-10 04:00:23',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-10 04:00:23','none'),(25,23,'Finance','f-oo001','',NULL,NULL,0,'',0,1,NULL,'pending',NULL,'2025-12-15 11:21:10','2025-12-16 07:42:08',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 07:42:08','none'),(26,3,'Test food ','test-food','test food',NULL,2000.00,0,'',0,1,'Susan kpt','pending',NULL,'2025-12-15 12:11:36','2025-12-16 06:27:24',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 06:27:24','none');
--
-- Table structure for table "projects"
--
DROP TABLE IF EXISTS "projects";
CREATE TABLE "relief_distributions" (
  "id" SERIAL,
  "distribution_code" VARCHAR(50)  NOT NULL,
  "distribution_date" date NOT NULL,
  "program_module_id" INTEGER NOT NULL,
  "distribution_type" VARCHAR(100)  NOT NULL,
  "location" VARCHAR(200)  NOT NULL,
  "ward" VARCHAR(100)  DEFAULT NULL,
  "sub_county" VARCHAR(100)  DEFAULT NULL,
  "county" VARCHAR(100)  DEFAULT NULL,
  "item_description" TEXT  NOT NULL,
  "quantity_distributed" INTEGER DEFAULT NULL,
  "unit_of_measure" VARCHAR(50)  DEFAULT NULL,
  "total_value" DECIMAL(15,2) DEFAULT NULL,
  "total_beneficiaries" INTEGER DEFAULT '0',
  "male_beneficiaries" INTEGER DEFAULT '0',
  "female_beneficiaries" INTEGER DEFAULT '0',
  "children_beneficiaries" INTEGER DEFAULT '0',
  "donor" VARCHAR(200)  DEFAULT NULL,
  "project_code" VARCHAR(100)  DEFAULT NULL,
  "distributed_by" INTEGER DEFAULT NULL,
  "verified_by" INTEGER DEFAULT NULL,
  "notes" TEXT ,
  "distribution_report_url" VARCHAR(255)  DEFAULT NULL,
  "target_beneficiaries" INTEGER DEFAULT NULL,
  "status" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "relief_distributions_ibfk_1" FOREIGN KEY ("program_module_id") REFERENCES "program_modules" ("id"),
  CONSTRAINT "relief_distributions_ibfk_2" FOREIGN KEY ("distributed_by") REFERENCES "users" ("id"),
  CONSTRAINT "relief_distributions_ibfk_3" FOREIGN KEY ("verified_by") REFERENCES "users" ("id")
)    ;
--
-- Dumping data for table "relief_distributions"
--
INSERT INTEGERO "relief_distributions" VALUES (1,'REL-2024-001','2024-01-15',3,'food','Kawangware, Nairobi',NULL,'Dagoretti','Nairobi','Maize flour, beans, cooking oil',500,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(2,'REL-2024-002','2024-01-20',3,'nfis','Nyalenda, Kisumu',NULL,'Kisumu East','Kisumu','Blankets, mosquito nets, jerry cans',200,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,40,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(3,'REL-2024-003','2024-02-01',3,'food','Majengo, Mombasa',NULL,'Mvita','Mombasa','Rice, sugar, salt',750,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,75,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(4,'REL-2024-004','2024-02-10',3,'cash','Kapsoya, Uasin Gishu',NULL,'Ainabkoi','Uasin Gishu','Cash transfer',50,'households',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(5,'REL-2024-005','2024-02-15',3,'food','Kikuyu, Kiambu',NULL,'Kikuyu','Kiambu','Maize, beans, cooking oil',400,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,40,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(6,'REL-2024-006','2024-03-01',3,'medical','Kinyona, Murang\'a',NULL,'Kigumo','Murang\'a','First aid kits, medicine',100,'kits',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,30,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(7,'REL-2024-007','2024-03-10',3,'food','Kaptembwo, Nakuru',NULL,'Nakuru West','Nakuru','Maize flour, rice, oil',1000,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,100,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(8,'REL-2024-008','2024-03-15',3,'voucher','Kondele, Kisumu',NULL,'Kisumu Central','Kisumu','Food vouchers',80,'vouchers',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,80,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(9,'REL-2024-009','2024-03-20',3,'nfis','Umoja, Nairobi',NULL,'Embakasi','Nairobi','Bedding, utensils, hygiene kits',150,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,45,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(10,'REL-2024-010','2024-04-01',3,'food','Litein, Kericho',NULL,'Bureti','Kericho','Maize, beans, salt',600,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,60,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(11,'REL-2024-011','2024-04-05',3,'shelter','Wamumu, Kirinyaga',NULL,'Mwea','Kirinyaga','Iron sheets, timber',200,'sheets',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,25,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(12,'REL-2024-012','2024-04-10',3,'food','Silibwet, Bomet',NULL,'Bomet Central','Bomet','Maize flour, cooking oil',450,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,45,'in_progress','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(13,'REL-2024-013','2024-04-15',3,'education','Bukembe, Bungoma',NULL,'Kanduyi','Bungoma','School supplies, uniforms',120,'sets',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,120,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(14,'REL-2024-014','2024-04-20',3,'food','Ruringu, Nyeri',NULL,'Nyeri Central','Nyeri','Rice, sugar, tea leaves',350,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,35,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(15,'REL-2024-015','2024-05-01',3,'cash','Nandi Hills',NULL,'Nandi Hills','Nandi','Cash transfer',60,'households',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,60,'completed','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(16,'REL-2024-016','2024-05-05',3,'food','Ildamat, Kajiado',NULL,'Kajiado Central','Kajiado','Maize, beans, oil',550,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,55,'in_progress','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(17,'REL-2024-017','2024-05-10',3,'medical','Gaturi, Embu',NULL,'Manyatta','Embu','Medicine, first aid supplies',80,'kits',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,25,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(18,'REL-2024-018','2024-05-14',3,'nfis','Usonga, Siaya','','Bondo','Siaya','Blankets, mosquito nets',180,'pieces',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'planned','2025-12-05 17:36:15','2025-12-06 06:35:21',NULL),(19,'REL-2024-019','2024-05-20',3,'food','Nanyuki, Laikipia',NULL,'Laikipia East','Laikipia','Maize flour, beans, salt',700,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,70,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(20,'REL-2024-020','2024-05-25',3,'voucher','Rurii, Nyandarua',NULL,'Ol Kalou','Nyandarua','Food vouchers',50,'vouchers',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,50,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL),(21,'REL-2024-021','2024-05-31',3,'food','Kwabwai, Homa Bay','','Ndhiwa','Homa Bay','Maize, rice, cooking oil, Sugar',800,'kg',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,80,'planned','2025-12-05 17:36:15','2025-12-05 17:38:30',NULL),(22,'REL-2024-022','2024-06-05',3,'shelter','Ntima, Meru',NULL,'Imenti North','Meru','Building materials',150,'bundles',NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,30,'planned','2025-12-05 17:36:15','2025-12-05 17:36:15',NULL);

--
-- Table structure for table "resource_maintenance"
--
DROP TABLE IF EXISTS "resource_maintenance";
CREATE TABLE "resource_types" (
  "id" SERIAL,
  "name" VARCHAR(100)  NOT NULL,
  "category" VARCHAR(100)  NOT NULL,
  "description" TEXT ,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "resource_types"
--
INSERT INTEGERO "resource_types" VALUES (1,'Desktop Computer','equipment','Desktop computers and workstations',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(2,'Laptop','equipment','Portable computers',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(3,'PrINTEGERer','equipment','PrINTEGERing devices',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(4,'Projector','equipment','Video projectors for presentations',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(5,'Vehicle - 4WD','vehicle','Four-wheel drive vehicles',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(6,'Vehicle - Motorcycle','vehicle','Motorcycles for field work',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(7,'Office Space','facility','Office facilities and spaces',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(8,'Training Hall','facility','Training and meeting halls',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(9,'Warehouse','facility','Storage facilities',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(10,'Office Furniture','material','Desks, chairs, cabinets',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(11,'Training Materials','material','Educational and training materials',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(12,'Software License','technology','Software and system licenses',1,'2025-12-15 11:01:00','2025-12-15 11:16:55'),(13,'Mobile Devices','technology','Smartphones and tablets',1,'2025-12-15 11:01:00','2025-12-15 11:16:55');

--
-- Table structure for table "resources"
--
DROP TABLE IF EXISTS "resources";
CREATE TABLE "results_chain" (
  "id" SERIAL,
  "from_entity_type" VARCHAR(100)  NOT NULL,
  "from_entity_id" INTEGER NOT NULL,
  "to_entity_type" VARCHAR(100)  NOT NULL,
  "to_entity_id" INTEGER NOT NULL,
  "contribution_description" TEXT,
  "contribution_weight" DECIMAL(5,2) DEFAULT '100.00',
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "results_chain"
--
INSERT INTEGERO "results_chain" VALUES (1,'activity',6,'component',1,'Health wise',100.00,'Need suport to achieve this','2025-11-27 08:09:17','2025-11-27 08:09:17',NULL),(2,'component',1,'sub_program',1,'test level',50.00,'as test','2025-11-27 08:14:13','2025-11-27 08:14:13',NULL),(3,'activity',13,'component',5,'here',10.00,NULL,'2025-11-27 08:26:51','2025-11-27 08:26:51',NULL),(4,'activity',19,'component',10,'Helps',100.00,'','2025-11-27 08:37:05','2025-12-04 09:08:16',NULL);

--
-- Table structure for table "role_permissions"
--
DROP TABLE IF EXISTS "role_permissions";
CREATE TABLE "role_permissions" (
  "id" SERIAL,
  "role_id" INTEGER NOT NULL,
  "permission_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "role_permissions_ibfk_1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE,
  CONSTRAINT "role_permissions_ibfk_2" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "role_permissions"
--
INSERT INTO "role_permissions" VALUES (1,1,2,'2025-11-27 18:31:40'),(2,1,5,'2025-11-27 18:31:40'),(3,1,8,'2025-11-27 18:31:40'),(4,1,14,'2025-11-27 18:31:40'),(5,1,16,'2025-11-27 18:31:40'),(6,1,18,'2025-11-27 18:31:40'),(7,1,22,'2025-11-27 18:31:40'),(8,1,24,'2025-11-27 18:31:40'),(9,1,26,'2025-11-27 18:31:40'),(10,1,27,'2025-11-27 18:31:40'),(11,1,28,'2025-11-27 18:31:40'),(12,1,29,'2025-11-27 18:31:40'),(13,1,30,'2025-11-27 18:31:40'),(14,1,32,'2025-11-27 18:31:40'),(15,1,33,'2025-11-27 18:31:40'),(16,1,34,'2025-11-27 18:31:40'),(17,1,35,'2025-11-27 18:31:40'),(18,1,38,'2025-11-27 18:31:40'),(19,1,40,'2025-11-27 18:31:40'),(20,1,42,'2025-11-27 18:31:40'),(21,1,43,'2025-11-27 18:31:40'),(22,1,3,'2025-11-27 18:31:40'),(23,1,6,'2025-11-27 18:31:40'),(24,1,9,'2025-11-27 18:31:40'),(25,1,12,'2025-11-27 18:31:40'),(26,1,1,'2025-11-27 18:31:40'),(27,1,4,'2025-11-27 18:31:40'),(28,1,7,'2025-11-27 18:31:40'),(29,1,10,'2025-11-27 18:31:40'),(30,1,11,'2025-11-27 18:31:40'),(31,1,13,'2025-11-27 18:31:40'),(32,1,15,'2025-11-27 18:31:40'),(33,1,17,'2025-11-27 18:31:40'),(34,1,19,'2025-11-27 18:31:40'),(35,1,20,'2025-11-27 18:31:40'),(36,1,21,'2025-11-27 18:31:40'),(37,1,23,'2025-11-27 18:31:40'),(38,1,25,'2025-11-27 18:31:40'),(39,1,36,'2025-11-27 18:31:40'),(40,1,37,'2025-11-27 18:31:40'),(41,1,39,'2025-11-27 18:31:40'),(42,1,41,'2025-11-27 18:31:40'),(43,1,31,'2025-11-27 18:31:40'),(64,2,10,'2025-11-27 18:31:40'),(65,2,2,'2025-11-27 18:31:40'),(66,2,11,'2025-11-27 18:31:40'),(67,2,5,'2025-11-27 18:31:40'),(68,2,38,'2025-11-27 18:31:40'),(69,2,22,'2025-11-27 18:31:40'),(70,2,24,'2025-11-27 18:31:40'),(71,2,42,'2025-11-27 18:31:40'),(72,2,37,'2025-11-27 18:31:40'),(73,2,35,'2025-11-27 18:31:40'),(74,2,27,'2025-11-27 18:31:40'),(75,2,30,'2025-11-27 18:31:40'),(76,2,31,'2025-11-27 18:31:40'),(77,2,14,'2025-11-27 18:31:40'),(78,2,20,'2025-11-27 18:31:40'),(79,2,16,'2025-11-27 18:31:40'),(80,2,19,'2025-11-27 18:31:40'),(95,3,10,'2025-11-27 18:31:40'),(96,3,2,'2025-11-27 18:31:40'),(97,3,11,'2025-11-27 18:31:40'),(98,3,5,'2025-11-27 18:31:40'),(99,3,38,'2025-11-27 18:31:40'),(100,3,22,'2025-11-27 18:31:40'),(101,3,25,'2025-11-27 18:31:40'),(102,3,42,'2025-11-27 18:31:40'),(103,3,37,'2025-11-27 18:31:40'),(104,3,35,'2025-11-27 18:31:40'),(105,3,27,'2025-11-27 18:31:40'),(106,3,31,'2025-11-27 18:31:40'),(107,3,14,'2025-11-27 18:31:40'),(108,3,20,'2025-11-27 18:31:40'),(109,3,16,'2025-11-27 18:31:40'),(110,3,19,'2025-11-27 18:31:40'),(126,4,2,'2025-11-27 18:31:40'),(127,4,40,'2025-11-27 18:31:40'),(128,4,38,'2025-11-27 18:31:40'),(129,4,22,'2025-11-27 18:31:40'),(130,4,37,'2025-11-27 18:31:40'),(131,4,35,'2025-11-27 18:31:40'),(132,4,14,'2025-11-27 18:31:40'),(133,5,2,'2025-11-27 18:31:40'),(134,5,38,'2025-11-27 18:31:40'),(135,5,22,'2025-11-27 18:31:40'),(136,5,37,'2025-11-27 18:31:40'),(137,5,35,'2025-11-27 18:31:40'),(138,5,14,'2025-11-27 18:31:40'),(140,6,10,'2025-11-27 18:31:40'),(141,6,1,'2025-11-27 18:31:40'),(142,6,9,'2025-11-27 18:31:40'),(143,6,4,'2025-11-27 18:31:40'),(144,6,11,'2025-11-27 18:31:40'),(145,6,7,'2025-11-27 18:31:40'),(146,6,41,'2025-11-27 18:31:40'),(147,6,39,'2025-11-27 18:31:40'),(148,6,21,'2025-11-27 18:31:40'),(149,6,26,'2025-11-27 18:31:40'),(150,6,23,'2025-11-27 18:31:40'),(151,6,25,'2025-11-27 18:31:40'),(152,6,37,'2025-11-27 18:31:40'),(153,6,36,'2025-11-27 18:31:40'),(154,6,31,'2025-11-27 18:31:40'),(155,6,13,'2025-11-27 18:31:40'),(156,6,18,'2025-11-27 18:31:40'),(157,6,15,'2025-11-27 18:31:40'),(158,6,20,'2025-11-27 18:31:40'),(159,6,17,'2025-11-27 18:31:40'),(160,6,19,'2025-11-27 18:31:40'),(171,7,1,'2025-11-27 18:31:40'),(172,7,4,'2025-11-27 18:31:40'),(173,7,12,'2025-11-27 18:31:40'),(174,7,6,'2025-11-27 18:31:40'),(175,7,39,'2025-11-27 18:31:40'),(176,7,21,'2025-11-27 18:31:40'),(177,7,23,'2025-11-27 18:31:40'),(178,7,25,'2025-11-27 18:31:40'),(179,7,36,'2025-11-27 18:31:40'),(180,7,31,'2025-11-27 18:31:40'),(181,7,13,'2025-11-27 18:31:40'),(182,7,15,'2025-11-27 18:31:40'),(183,7,17,'2025-11-27 18:31:40'),(186,8,1,'2025-11-27 18:31:40'),(187,8,3,'2025-11-27 18:31:40'),(188,8,12,'2025-11-27 18:31:40'),(189,8,6,'2025-11-27 18:31:40'),(190,8,23,'2025-11-27 18:31:40'),(191,8,36,'2025-11-27 18:31:40'),(192,8,13,'2025-11-27 18:31:40'),(193,8,15,'2025-11-27 18:31:40'),(201,9,4,'2025-11-27 18:31:40'),(202,9,23,'2025-11-27 18:31:40'),(203,9,36,'2025-11-27 18:31:40'),(204,9,13,'2025-11-27 18:31:40'),(205,9,15,'2025-11-27 18:31:40'),(206,9,20,'2025-11-27 18:31:40'),(207,9,17,'2025-11-27 18:31:40'),(208,9,19,'2025-11-27 18:31:40'),(216,10,1,'2025-11-27 18:31:40'),(217,10,3,'2025-11-27 18:31:40'),(218,10,23,'2025-11-27 18:31:40'),(219,10,13,'2025-11-27 18:31:40'),(223,11,4,'2025-11-27 18:31:40'),(224,11,39,'2025-11-27 18:31:40'),(225,11,23,'2025-11-27 18:31:40'),(226,11,36,'2025-11-27 18:31:40'),(227,11,15,'2025-11-27 18:31:40');
--
-- Table structure for table "roles"
--
DROP TABLE IF EXISTS "roles";
CREATE TABLE "roles" (
  "id" SERIAL,
  "name" VARCHAR(100)  NOT NULL,
  "display_name" VARCHAR(100)  NOT NULL,
  "description" TEXT,
  "scope" VARCHAR(100)  NOT NULL DEFAULT 'module',
  "level" INTEGER NOT NULL DEFAULT '10',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "roles"
--
INSERT INTO "roles" VALUES (1,'system_admin','System Administrator','Full system access with all permissions','',1,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(2,'me_director','M&E Director','Oversees all M&E activities and reporting','',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(3,'me_manager','M&E Manager','Manages M&E data collection and analysis','module',3,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(4,'finance_officer','Finance Officer','Handles financial transactions and reporting','',4,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(5,'report_viewer','Report Viewer','View-only access to reports and dashboards','',6,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(6,'module_manager','Module Manager','Manages specific program modules','module',2,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(7,'module_coordinator','Module Coordinator','Coordinate activities within modules','module',4,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(8,'field_officer','Field Officer','Implements field activities and collects data','',5,'2025-11-27 18:31:40','2025-12-09 04:17:10'),(9,'verification_officer','Verification Officer','Manage verification and evidence','module',5,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(10,'data_entry_clerk','Data Entry Clerk','Basic data entry only','module',8,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(11,'module_viewer','Module Viewer','Read-only access to module data','module',9,'2025-11-27 18:31:40','2025-11-27 18:31:40'),(13,'program_director','Program Director','Oversees entire programs and strategic planning','',2,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(16,'finance_manager','Finance Manager','Manages budgets and financial tracking','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(17,'logistics_manager','Logistics Manager','Manages logistics and procurement','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(18,'program_manager','Program Manager','Manages program implementation','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(20,'me_officer','M&E Officer','Collects and validates M&E data','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(21,'data_analyst','Data Analyst','Analyzes data and generates reports','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(22,'procurement_officer','Procurement Officer','Manages procurement processes','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(23,'program_officer','Program Officer','Implements program activities','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(24,'technical_advisor','Technical Advisor','Provides technical guidance and support','',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(26,'community_mobilizer','Community Mobilizer','Mobilizes communities and facilitates activities','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(27,'data_entry_officer','Data Entry Officer','Enters and validates field data','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(28,'enumerator','Enumerator','Conducts surveys and data collection','',5,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(30,'approver','Approver','Reviews and approves activities and reports','module',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(31,'external_auditor','External Auditor','Audits program data and compliance','',6,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(33,'gbv_specialist','GBV Specialist','Specialized in Gender-Based Violence programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(34,'nutrition_specialist','Nutrition Specialist','Specialized in Nutrition programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(35,'agriculture_specialist','Agriculture Specialist','Specialized in Agriculture programs','module',4,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(36,'relief_coordinator','Relief Coordinator','Coordinates relief and emergency response','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10'),(37,'seep_coordinator','SEEP Coordinator','Coordinates SEEP economic empowerment activities','module',3,'2025-12-09 04:17:10','2025-12-09 04:17:10');
--
-- Table structure for table "savings_accounts"
--
DROP TABLE IF EXISTS "savings_accounts";
CREATE TABLE "shg_groups" (
  "id" SERIAL,
  "group_code" VARCHAR(50)  NOT NULL,
  "group_name" VARCHAR(200)  NOT NULL,
  "program_module_id" INTEGER NOT NULL,
  "formation_date" date NOT NULL,
  "registration_status" VARCHAR(100)  DEFAULT 'forming',
  "registration_number" VARCHAR(100)  DEFAULT NULL,
  "registration_authority" VARCHAR(200)  DEFAULT NULL,
  "county" VARCHAR(100)  DEFAULT NULL,
  "sub_county" VARCHAR(100)  DEFAULT NULL,
  "ward" VARCHAR(100)  DEFAULT NULL,
  "village" VARCHAR(100)  DEFAULT NULL,
  "meeting_venue" VARCHAR(200)  DEFAULT NULL,
  "gps_latitude" DECIMAL(10,8) DEFAULT NULL,
  "gps_longitude" DECIMAL(11,8) DEFAULT NULL,
  "total_members" INTEGER DEFAULT '0',
  "male_members" INTEGER DEFAULT '0',
  "female_members" INTEGER DEFAULT '0',
  "youth_members" INTEGER DEFAULT '0',
  "pwd_members" INTEGER DEFAULT '0',
  "total_savings" DECIMAL(15,2) DEFAULT '0.00',
  "total_shares" DECIMAL(15,2) DEFAULT '0.00',
  "share_value" DECIMAL(10,2) DEFAULT '0.00',
  "total_loans_disbursed" DECIMAL(15,2) DEFAULT '0.00',
  "total_loans_outstanding" DECIMAL(15,2) DEFAULT '0.00',
  "loan_INTEGERerest_rate" DECIMAL(5,2) DEFAULT '10.00',
  "meeting_frequency" VARCHAR(100)  DEFAULT 'monthly',
  "meeting_day" VARCHAR(20)  DEFAULT NULL,
  "last_meeting_date" date DEFAULT NULL,
  "chairperson_id" INTEGER DEFAULT NULL,
  "secretary_id" INTEGER DEFAULT NULL,
  "treasurer_id" INTEGER DEFAULT NULL,
  "facilitator_id" INTEGER DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'active',
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "shg_groups_ibfk_1" FOREIGN KEY ("program_module_id") REFERENCES "program_modules" ("id"),
  CONSTRAINT "shg_groups_ibfk_2" FOREIGN KEY ("facilitator_id") REFERENCES "users" ("id"),
  CONSTRAINT "shg_groups_ibfk_3" FOREIGN KEY ("chairperson_id") REFERENCES "beneficiaries" ("id"),
  CONSTRAINT "shg_groups_ibfk_4" FOREIGN KEY ("secretary_id") REFERENCES "beneficiaries" ("id"),
  CONSTRAINT "shg_groups_ibfk_5" FOREIGN KEY ("treasurer_id") REFERENCES "beneficiaries" ("id")
)    ;
--
-- Dumping data for table "shg_groups"
--
INSERT INTEGERO "shg_groups" VALUES (21,'SHG-001','Tumaini Women Group',1,'2023-01-15','registered',NULL,NULL,'Nairobi','Dagoretti','Kawangware','Kawangware North',NULL,NULL,NULL,15,0,15,0,0,450000.00,150000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(22,'SHG-002','Umoja Self Help',1,'2023-02-10','registered',NULL,NULL,'Kisumu','Kisumu East','Manyatta','Nyalenda B',NULL,NULL,NULL,20,8,12,0,0,600000.00,200000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(23,'SHG-003','Harambee Group',1,'2023-03-05','mature',NULL,NULL,'Mombasa','Mvita','Tononoka','Majengo',NULL,NULL,NULL,12,4,8,0,0,360000.00,120000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(24,'SHG-004','Mwangaza Farmers',1,'2023-03-20','registered',NULL,NULL,'Uasin Gishu','Ainabkoi','Kapsoya','Kapsoya Estate',NULL,NULL,NULL,18,9,9,0,0,540000.00,180000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(25,'SHG-005','Furaha Women',1,'2023-04-12','registered',NULL,NULL,'Kiambu','Kikuyu','Kikuyu','Kikuyu Town',NULL,NULL,NULL,10,2,8,0,0,300000.00,100000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(26,'SHG-006','Amani Group',1,'2023-05-08','forming',NULL,NULL,'Murang\'a','Kigumo','Kinyona','Kinyona Village',NULL,NULL,NULL,8,3,5,0,0,120000.00,40000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(27,'SHG-007','Upendo Wetu',1,'2023-06-01','registered',NULL,NULL,'Nakuru','Nakuru West','Kaptembwo','Section 58',NULL,NULL,NULL,25,10,15,0,0,750000.00,250000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(28,'SHG-008','Maendeleo Group',1,'2023-06-20','mature',NULL,NULL,'Kisumu','Kisumu Central','Kondele','Nyalenda A',NULL,NULL,NULL,16,6,10,0,0,480000.00,160000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(29,'SHG-009','Pamoja Women',1,'2023-07-10','registered',NULL,NULL,'Nairobi','Embakasi','Umoja','Umoja 1',NULL,NULL,NULL,14,0,14,0,0,420000.00,140000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(30,'SHG-010','Vijana Farmers',1,'2023-08-05','registered',NULL,NULL,'Kericho','Bureti','Litein','Litein Town',NULL,NULL,NULL,22,12,10,0,0,660000.00,220000.00,0.00,0.00,0.00,10.00,'',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(31,'SHG-011','Uzima Group',1,'2023-09-01','forming',NULL,NULL,'Kirinyaga','Mwea','Wamumu','Wamumu Village',NULL,NULL,NULL,9,4,5,0,0,135000.00,45000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(32,'SHG-012','Imani Women',1,'2023-09-25','registered',NULL,NULL,'Bomet','Bomet Central','Silibwet','Silibwet Town',NULL,NULL,NULL,17,5,12,0,0,510000.00,170000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(33,'SHG-013','Baraka Group',1,'2023-10-10','registered',NULL,NULL,'Bungoma','Kanduyi','Bukembe','Bukembe West',NULL,NULL,NULL,19,8,11,0,0,570000.00,190000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(34,'SHG-014','Neema Women',1,'2023-11-01','forming',NULL,NULL,'Nyeri','Nyeri Central','Ruringu','Ruringu Estate',NULL,NULL,NULL,11,2,9,0,0,165000.00,55000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(35,'SHG-015','Jamii Yetu',1,'2023-11-20','registered',NULL,NULL,'Nandi','Nandi Hills','Nandi Hills','Nandi Hills Town',NULL,NULL,NULL,21,9,12,0,0,630000.00,210000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(36,'SHG-016','Tujenge Group',1,'2023-12-05','mature',NULL,NULL,'Kajiado','Kajiado Central','Ildamat','Ildamat Village',NULL,NULL,NULL,13,5,8,0,0,390000.00,130000.00,0.00,0.00,0.00,10.00,'',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(37,'SHG-017','Wanawake Hodari',1,'2024-01-10','forming',NULL,NULL,'Embu','Manyatta','Gaturi North','Gaturi',NULL,NULL,NULL,7,0,7,0,0,105000.00,35000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(38,'SHG-018','Unity Group',1,'2024-02-01','registered',NULL,NULL,'Siaya','Bondo','West Sakwa','Usonga',NULL,NULL,NULL,15,6,9,0,0,450000.00,150000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(39,'SHG-019','Faida Group',1,'2024-03-01','forming',NULL,NULL,'Laikipia','Laikipia East','Nanyuki','Nanyuki Town',NULL,NULL,NULL,12,5,7,0,0,180000.00,60000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL),(40,'SHG-020','Shujaa Women',1,'2024-04-01','forming',NULL,NULL,'Nyandarua','Ol Kalou','Rurii','Rurii Village',NULL,NULL,NULL,10,3,7,0,0,150000.00,50000.00,0.00,0.00,0.00,10.00,'weekly',NULL,NULL,NULL,NULL,NULL,NULL,'active',NULL,'2025-12-05 16:39:58','2025-12-05 16:39:58',NULL);

--
-- Table structure for table "shg_meeting_attendance"
--
DROP TABLE IF EXISTS "shg_meeting_attendance";
CREATE TABLE "shg_members" (
  "id" SERIAL,
  "shg_group_id" INTEGER NOT NULL,
  "beneficiary_id" INTEGER NOT NULL,
  "join_date" date NOT NULL,
  "membership_status" VARCHAR(100)  DEFAULT 'active',
  "exit_date" date DEFAULT NULL,
  "exit_reason" TEXT ,
  "position" VARCHAR(100)  DEFAULT 'member',
  "total_savings" DECIMAL(15,2) DEFAULT '0.00',
  "total_shares" INTEGER DEFAULT '0',
  "loans_taken" INTEGER DEFAULT '0',
  "loans_repaid" INTEGER DEFAULT '0',
  "current_loan_balance" DECIMAL(15,2) DEFAULT '0.00',
  "trainings_attended" INTEGER DEFAULT '0',
  "last_training_date" date DEFAULT NULL,
  "notes" TEXT ,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "shg_members_ibfk_1" FOREIGN KEY ("shg_group_id") REFERENCES "shg_groups" ("id") ON DELETE CASCADE,
  CONSTRAINT "shg_members_ibfk_2" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id")
)    ;
--
-- Dumping data for table "shg_members"
--
INSERT INTEGERO "shg_members" VALUES (2,1,2,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(3,1,4,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(4,1,1,'2023-01-15','active',NULL,NULL,'chairperson',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(5,1,3,'2023-01-15','active',NULL,NULL,'secretary',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(6,1,5,'2023-01-15','active',NULL,NULL,'treasurer',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(7,1,7,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(8,1,9,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(9,1,11,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(10,1,13,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(11,1,15,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(12,1,17,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(13,1,19,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(14,1,21,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(15,1,23,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(16,1,25,'2023-01-15','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(17,2,2,'2023-02-10','active',NULL,NULL,'chairperson',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(18,2,4,'2023-02-10','active',NULL,NULL,'secretary',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(19,2,6,'2023-02-10','active',NULL,NULL,'treasurer',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(20,2,8,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(21,2,10,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(22,2,12,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(23,2,14,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(24,2,16,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(25,2,18,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(26,2,20,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(27,2,22,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(28,2,24,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(29,2,1,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(30,2,3,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(31,2,5,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(32,2,7,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(33,2,9,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(34,2,11,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(35,2,13,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(36,2,15,'2023-02-10','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(48,3,1,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(49,3,2,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(50,3,3,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(51,3,4,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(52,3,5,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(53,3,6,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(54,3,7,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(55,3,8,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(56,3,9,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(57,3,10,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(58,3,11,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(59,3,12,'2023-03-05','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(63,4,5,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(64,4,6,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(65,4,7,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(66,4,8,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(67,4,9,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(68,4,10,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(69,4,11,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(70,4,12,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(71,4,13,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(72,4,14,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(73,4,15,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(74,4,16,'2023-03-20','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(78,5,1,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(79,5,2,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(80,5,3,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(81,5,4,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(82,5,5,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(83,5,6,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(84,5,7,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(85,5,8,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(86,5,9,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL),(87,5,10,'2023-04-12','active',NULL,NULL,'member',0.00,0,0,0,0.00,0,NULL,NULL,'2025-12-05 16:49:40','2025-12-05 16:49:40',NULL);

--
-- Table structure for table "status_history"
--
DROP TABLE IF EXISTS "status_history";
CREATE TABLE "status_history" (
  "id" SERIAL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "old_status" VARCHAR(50)  DEFAULT NULL,
  "new_status" VARCHAR(50)  NOT NULL,
  "old_progress" INTEGER DEFAULT NULL,
  "new_progress" INTEGER DEFAULT NULL,
  "change_type" VARCHAR(100)  NOT NULL,
  "change_reason" TEXT ,
  "override_applied" BOOLEAN DEFAULT '0',
  "changed_by" INTEGER DEFAULT NULL,
  "changed_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "status_history"
--
INSERT INTEGERO "status_history" VALUES (1,'component',9,'in-progress','completed',45,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(2,'activity',19,'in-progress','on-track',40,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(3,'component',10,'in-progress','on-track',50,100,'auto','1 activities in progress',0,NULL,'2025-12-09 18:51:21'),(4,'component',11,'not-started','completed',0,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(5,'activity',21,'in-progress','on-track',50,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(6,'component',12,'in-progress','on-track',55,0,'auto','1 activities in progress',0,NULL,'2025-12-09 18:51:21'),(7,'component',13,'in-progress','completed',35,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(8,'component',14,'in-progress','completed',50,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(9,'activity',24,'not-started','off-track',100,41,'auto','Activity is critically behind schedule (59.4% behind)',0,NULL,'2025-12-09 18:51:21'),(10,'component',15,'in-progress','off-track',40,41,'auto','1 activities are off-track',0,NULL,'2025-12-09 18:51:21'),(11,'component',16,'in-progress','not-started',70,0,'auto',NULL,0,NULL,'2025-12-09 18:51:21'),(12,'component',17,'in-progress','completed',50,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(13,'component',18,'in-progress','not-started',45,0,'auto',NULL,0,NULL,'2025-12-09 18:51:21'),(14,'component',19,'in-progress','completed',50,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(15,'component',20,'in-progress','not-started',60,0,'auto',NULL,0,NULL,'2025-12-09 18:51:21'),(16,'component',22,'in-progress','not-started',55,0,'auto',NULL,0,NULL,'2025-12-09 18:51:21'),(17,'component',23,'in-progress','not-started',45,0,'auto',NULL,0,NULL,'2025-12-09 18:51:21'),(18,'activity',27,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(19,'activity',28,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(20,'component',1,'not-started','on-track',0,67,'auto','2 activities in progress',0,NULL,'2025-12-09 18:51:21'),(21,'component',2,NULL,'completed',0,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(22,'activity',12,'in-progress','on-track',60,100,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(23,'component',4,'in-progress','on-track',40,100,'auto','1 activities in progress',0,NULL,'2025-12-09 18:51:21'),(24,'component',5,'in-progress','completed',30,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(25,'component',3,'not-started','completed',0,100,'auto','All activities completed',0,NULL,'2025-12-09 18:51:21'),(26,'activity',15,'in-progress','on-track',50,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(27,'component',6,'completed','on-track',100,0,'auto','1 activities in progress',0,NULL,'2025-12-09 18:51:21'),(28,'activity',17,'not-started','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-09 18:51:21'),(29,'component',7,'in-progress','on-track',50,50,'auto','1 activities in progress',0,NULL,'2025-12-09 18:51:21'),(30,'activity',24,'in-progress','off-track',41,41,'auto','Activity is critically behind schedule (59.4% behind)',0,NULL,'2025-12-09 19:04:21'),(31,'activity',24,'not-started','off-track',41,41,'auto','Activity is critically behind schedule (59.4% behind)',0,NULL,'2025-12-09 19:05:07'),(32,'activity',24,'in-progress','off-track',41,41,'auto','Activity is critically behind schedule (59.4% behind)',0,NULL,'2025-12-09 19:05:37'),(33,'component',15,'off-track','completed',41,100,'auto','All activities completed',0,NULL,'2025-12-09 19:05:55'),(34,'activity',24,'not-started','off-track',100,41,'auto','Activity is critically behind schedule (59.4% behind)',0,NULL,'2025-12-09 19:06:29'),(35,'component',15,'completed','off-track',100,41,'auto','1 activities are off-track',0,NULL,'2025-12-09 19:06:29'),(36,'activity',30,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-10 04:00:23'),(37,'component',24,NULL,'on-track',0,0,'auto','1 activities in progress',0,NULL,'2025-12-10 04:00:23'),(38,'activity',29,'in-progress','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 09:27:21'),(39,'activity',29,'blocked','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 09:27:27'),(40,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 09:27:42'),(41,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:46:10'),(42,'activity',9,'in-progress','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:47:37'),(43,'activity',9,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:47:40'),(44,'activity',27,'not-started','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:48:01'),(45,'activity',27,'blocked','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:48:04'),(46,'activity',27,'blocked','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:48:09'),(47,'activity',29,'not-started','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:51:57'),(48,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:53:37'),(49,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:53:56'),(50,'activity',29,'in-progress','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 17:54:45'),(51,'activity',29,'blocked','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:01:10'),(52,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:18:44'),(53,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:20:29'),(54,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:41:44'),(55,'activity',29,'not-started','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:42:10'),(56,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:42:36'),(57,'activity',29,'not-started','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:52:16'),(58,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 18:52:26'),(59,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:11:09'),(60,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:17:31'),(61,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:52:23'),(62,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:52:27'),(63,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:52:31'),(64,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-11 19:52:43'),(65,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-12 05:44:18'),(66,'activity',28,'in-progress','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-12 05:44:35'),(67,'activity',29,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-12 05:44:41'),(68,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-13 06:12:28'),(69,'activity',28,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-13 07:15:57'),(70,'activity',9,'not-started','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-13 08:35:10'),(71,'activity',31,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-15 11:22:17'),(72,'component',25,NULL,'on-track',0,0,'auto','1 activities in progress',0,NULL,'2025-12-15 11:22:17'),(73,'activity',31,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-15 11:43:38'),(74,'activity',31,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-15 11:44:12'),(75,'activity',31,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-15 12:07:34'),(76,'component',25,'on-track','completed',0,100,'auto','All activities completed',0,NULL,'2025-12-15 12:08:14'),(77,'activity',15,'in-progress','on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-15 17:59:32'),(78,'component',6,'on-track','completed',0,100,'auto','All activities completed',0,NULL,'2025-12-15 17:59:37'),(79,'activity',32,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-16 06:27:24'),(80,'component',26,NULL,'on-track',0,0,'auto','1 activities in progress',0,NULL,'2025-12-16 06:27:24'),(81,'activity',33,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-16 06:36:08'),(82,'component',25,'completed','on-track',100,50,'auto','1 activities in progress',0,NULL,'2025-12-16 06:36:08'),(83,'activity',34,NULL,'not-started',0,0,'auto',NULL,0,NULL,'2025-12-16 06:46:00'),(84,'activity',33,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-16 07:40:58'),(85,'activity',33,NULL,'on-track',0,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-16 07:41:14'),(86,'activity',31,'in-progress','on-track',100,0,'auto','Activity is on track (0.0% ahead/on schedule)',0,NULL,'2025-12-16 07:42:08');

--
-- Table structure for table "strategic_goals"
--
DROP TABLE IF EXISTS "strategic_goals";
CREATE TABLE "strategic_goals" (
  "id" SERIAL,
  "category_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "description" TEXT ,
  "clickup_goal_id" VARCHAR(50)  DEFAULT NULL,
  "owner_name" VARCHAR(255)  DEFAULT NULL,
  "owner_email" VARCHAR(255)  DEFAULT NULL,
  "start_date" date DEFAULT NULL,
  "target_date" date NOT NULL,
  "progress_percentage" INTEGER DEFAULT '0',
  "status" VARCHAR(100)  DEFAULT 'active',
  "is_active" BOOLEAN DEFAULT '1',
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "strategic_goals_ibfk_1" FOREIGN KEY ("category_id") REFERENCES "goal_categories" ("id") ON DELETE CASCADE,
  CONSTRAINT "strategic_goals_chk_1" CHECK (("progress_percentage" between 0 and 100))
);

--
-- Dumping data for table "strategic_goals"
--
--
-- Table structure for table "sub_activities"
--
DROP TABLE IF EXISTS "sub_activities";
CREATE TABLE "sub_activities" (
  "id" SERIAL,
  "parent_activity_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "description" TEXT ,
  "clickup_subtask_id" VARCHAR(50)  DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'pending',
  "assigned_to" VARCHAR(255)  DEFAULT NULL,
  "due_date" date DEFAULT NULL,
  "is_completed" BOOLEAN DEFAULT '0',
  "completed_at" TIMESTAMP DEFAULT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "sub_activities_ibfk_1" FOREIGN KEY ("parent_activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "sub_activities"
--
--
-- Table structure for table "sub_programs"
--
DROP TABLE IF EXISTS "sub_programs";
CREATE TABLE "sub_programs" (
  "id" SERIAL,
  "module_id" INTEGER NOT NULL,
  "name" VARCHAR(255)  NOT NULL,
  "code" VARCHAR(50)  NOT NULL,
  "description" TEXT ,
  "clickup_folder_id" VARCHAR(50)  DEFAULT NULL,
  "budget" DECIMAL(15,2) DEFAULT NULL,
  "actual_cost" DECIMAL(15,2) DEFAULT '0.00',
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "progress_percentage" INTEGER DEFAULT '0',
  "manager_name" VARCHAR(255)  DEFAULT NULL,
  "manager_email" VARCHAR(255)  DEFAULT NULL,
  "target_beneficiaries" INTEGER DEFAULT NULL,
  "actual_beneficiaries" INTEGER DEFAULT '0',
  "location" JSONB DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'active',
  "priority" VARCHAR(100)  DEFAULT 'medium',
  "is_active" BOOLEAN DEFAULT '1',
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  "logframe_outcome" TEXT,
  "outcome_indicators" TEXT,
  "overall_status" VARCHAR(50)  DEFAULT NULL,
  "status_override" BOOLEAN DEFAULT '0',
  "auto_status" VARCHAR(50)  DEFAULT NULL,
  "manual_status" VARCHAR(50)  DEFAULT NULL,
  "last_status_update" TIMESTAMP NULL DEFAULT NULL,
  "risk_level" VARCHAR(100)  DEFAULT 'none',
  PRIMARY KEY ("id"),
  CONSTRAINT "sub_programs_ibfk_1" FOREIGN KEY ("module_id") REFERENCES "program_modules" ("id") ON DELETE CASCADE,
  CONSTRAINT "sub_programs_chk_1" CHECK (("progress_percentage" between 0 and 100))
);

--
-- Dumping data for table "sub_programs"
--
INSERT INTO "sub_programs" VALUES (1,5,'Vital practical ','CHI-001','Vital practice and energy inspiration ',NULL,2000.00,0.00,'2025-11-25','2025-11-29',79,'Peter Peter',NULL,200,0,'\"Nairobi PLC\"','active','high',1,'pending',NULL,NULL,'2025-11-23 12:53:52','2025-12-16 06:46:00',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 06:46:00','none'),(2,5,'UDDP Follow Up training','CHI-002','UDDP Follow Up training',NULL,300.00,0.00,'2025-11-29','2025-12-02',83,NULL,NULL,20,0,'\"Kibera\"','planning','urgent',1,'pending',NULL,NULL,'2025-11-23 16:22:55','2025-12-15 17:59:37',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-15 17:59:37','none'),(3,1,'Climate-Smart Agriculture Training','SUB-FE-001','Training farmers on climate-resilient farming techniques and water conservation',NULL,150000.00,45000.00,'2025-01-15','2025-12-31',0,'Mary Wanjiku','mary.w@caritas.org',500,150,'\"Kiambu County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-16 06:27:24',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 06:27:24','none'),(4,1,'Community Water Points Rehabilitation','SUB-FE-002','Rehabilitating and maintaining community water access points in drought-affected areas',NULL,250000.00,120000.00,'2025-02-01','2025-11-30',0,'John Kamau','john.k@caritas.org',2000,800,'\"Machakos County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(5,1,'Tree Planting Initiative','SUB-FE-003','Agroforestry and environmental conservation through community tree planting',NULL,80000.00,25000.00,'2025-03-01','2025-12-31',50,'Grace Muthoni','grace.m@caritas.org',1500,450,'\"Murang\'a County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(6,1,'Drip Irrigation Systems','SUB-FE-004','Installing water-efficient drip irrigation systems for small-scale farmers',NULL,180000.00,60000.00,'2025-01-10','2025-10-31',100,'Peter Ochieng','peter.o@caritas.org',300,100,'\"Makueni County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-09 19:04:21','none'),(7,2,'Village Savings and Loans Groups','SUB-SE-001','Establishing and supporting VSLAs for financial inclusion and savings mobilization',NULL,120000.00,55000.00,'2025-01-20','2025-12-31',0,'Sarah Njeri','sarah.n@caritas.org',800,380,'\"Nairobi County - Kibera\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(8,2,'Youth Micro-Enterprise Development','SUB-SE-002','Business skills training and startup capital for youth entrepreneurs',NULL,200000.00,80000.00,'2025-02-15','2025-12-31',0,'James Omondi','james.o@caritas.org',200,85,'\"Kisumu County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(9,2,'Women Artisan Cooperative','SUB-SE-003','Supporting women artisans with skills training and market linkages',NULL,90000.00,35000.00,'2025-03-01','2025-12-31',50,'Lucy Wangari','lucy.w@caritas.org',150,60,'\"Nakuru County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-13 08:14:44',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-13 08:14:44','none'),(10,2,'Dairy Farming Value Chain','SUB-SE-004','Strengthening dairy value chain from production to market access',NULL,160000.00,70000.00,'2025-01-25','2025-11-30',50,'Daniel Kiprop','daniel.k@caritas.org',250,110,'\"Nyandarua County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-13 08:16:45',NULL,NULL,NULL,'off-track',0,'off-track',NULL,'2025-12-13 08:16:45','none'),(11,3,'Gender-Based Violence Prevention','SUB-GY-001','Community awareness and support services for GBV survivors',NULL,110000.00,45000.00,'2025-01-10','2025-12-31',0,'Faith Akinyi','faith.a@caritas.org',1000,420,'\"Nairobi County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(12,3,'Beacon Boys Youth Mentorship','SUB-GY-002','Mentorship program for at-risk youth promoting positive masculinity',NULL,95000.00,40000.00,'2025-02-01','2025-12-31',0,'Michael Otieno','michael.o@caritas.org',300,130,'\"Mombasa County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(13,3,'Women Economic Empowerment','SUB-GY-003','Business training and financial support for women-led businesses',NULL,140000.00,55000.00,'2025-01-15','2025-12-31',50,'Rose Chebet','rose.c@caritas.org',200,80,'\"Eldoret Town\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(14,3,'Peacebuilding Dialogues','SUB-GY-004','Inter-community dialogue and conflict resolution initiatives',NULL,75000.00,30000.00,'2025-03-01','2025-11-30',50,'David Mutua','david.m@caritas.org',500,200,'\"Isiolo County\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(15,4,'Emergency Food Distribution','SUB-RL-001','Food relief for drought-affected communities and vulnerable households',NULL,300000.00,150000.00,'2025-01-05','2025-12-31',0,'Agnes Wambui','agnes.w@caritas.org',5000,2500,'\"Turkana County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-10 04:00:23',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-10 04:00:23','none'),(16,4,'Refugee Support Services','SUB-RL-002','Comprehensive support services for refugees in Kakuma and Dadaab camps',NULL,250000.00,120000.00,'2025-01-10','2025-12-31',0,'Hassan Mohammed','hassan.m@caritas.org',3000,1450,'\"Turkana & Garissa Counties\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(17,4,'Child Care Center Operations','SUB-RL-003','Operating day care centers for orphaned and vulnerable children',NULL,180000.00,85000.00,'2025-01-01','2025-12-31',0,'Catherine Nyambura','catherine.n@caritas.org',150,72,'\"Nairobi County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(18,4,'Health Outreach Clinics','SUB-RL-004','Mobile health clinics providing basic healthcare in underserved areas',NULL,220000.00,100000.00,'2025-02-01','2025-12-31',0,'Dr. James Kariuki','james.kar@caritas.org',2000,920,'\"Garissa County\"','active','urgent',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(19,5,'Staff Professional Development','SUB-CB-001','Training programs for Caritas staff on M&E, project management, and leadership',NULL,85000.00,35000.00,'2025-01-20','2025-12-31',0,'Patrick Mwangi','patrick.m@caritas.org',50,22,'\"Nairobi - Caritas HQ\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(20,5,'Volunteer Mobilization Program','SUB-CB-002','Recruiting, training, and managing community volunteers',NULL,70000.00,28000.00,'2025-02-01','2025-12-31',0,'Susan Njoki','susan.nj@caritas.org',200,85,'\"Various Counties\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(21,5,'Community Leadership Training','SUB-CB-003','Building leadership capacity among community leaders and committee members',NULL,95000.00,40000.00,'2025-01-15','2025-12-31',0,'Thomas Kimani','thomas.k@caritas.org',150,65,'\"Trans-Nzoia County\"','active','high',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(22,5,'Digital Literacy for Field Staff','SUB-CB-004','Training field staff on digital tools, data collection, and reporting systems',NULL,60000.00,22000.00,'2025-03-01','2025-11-30',0,'Betty Mwikali','betty.m@caritas.org',80,30,'\"Various Field Offices\"','active','medium',1,'pending',NULL,NULL,'2025-11-24 17:59:29','2025-12-09 19:04:21',NULL,NULL,NULL,'not-started',0,'not-started',NULL,'2025-12-09 19:04:21','none'),(23,6,'Test','Test','Test',NULL,10000.00,0.00,'2025-12-01','2027-01-16',0,'Manager',NULL,NULL,0,'{}','active','medium',1,'pending',NULL,NULL,'2025-12-15 11:20:33','2025-12-16 07:42:08',NULL,NULL,NULL,'on-track',0,'on-track',NULL,'2025-12-16 07:42:08','none');
--
-- Table structure for table "sync_config"
--
DROP TABLE IF EXISTS "sync_config";
CREATE TABLE "sync_config" (
  "id" SERIAL,
  "organization_id" INTEGER NOT NULL,
  "clickup_api_token_encrypted" TEXT  NOT NULL,
  "clickup_webhook_secret" VARCHAR(255)  DEFAULT NULL,
  "auto_sync_enabled" BOOLEAN DEFAULT '1',
  "sync_INTEGERerval_minutes" INTEGER DEFAULT '15',
  "last_full_sync" TIMESTAMP DEFAULT NULL,
  "last_push_sync" TIMESTAMP DEFAULT NULL,
  "last_pull_sync" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "sync_config_ibfk_1" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "sync_config"
--
--
-- Table structure for table "sync_conflicts"
--
DROP TABLE IF EXISTS "sync_conflicts";
CREATE TABLE "sync_queue" (
  "id" SERIAL,
  "operation_type" VARCHAR(100)  NOT NULL,
  "entity_type" VARCHAR(100)  NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "direction" VARCHAR(100)  NOT NULL,
  "payload" JSONB DEFAULT NULL,
  "status" VARCHAR(100)  DEFAULT 'pending',
  "priority" INTEGER DEFAULT '5',
  "retry_count" INTEGER DEFAULT '0',
  "max_retries" INTEGER DEFAULT '3',
  "last_error" TEXT ,
  "scheduled_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "started_at" TIMESTAMP DEFAULT NULL,
  "completed_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)    ;
--
-- Dumping data for table "sync_queue"
--
INSERT INTEGERO "sync_queue" VALUES (1,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:53:52',NULL,NULL,'2025-11-23 12:53:52','2025-11-23 12:53:52'),(2,'create','',1,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:57:01',NULL,NULL,'2025-11-23 12:57:01','2025-11-23 12:57:01'),(3,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 15:59:56',NULL,NULL,'2025-11-23 12:59:56','2025-11-23 12:59:56'),(4,'create','',2,'push',NULL,'pending',5,0,3,NULL,'2025-11-23 19:22:55',NULL,NULL,'2025-11-23 16:22:55','2025-11-23 16:22:55'),(5,'create','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 13:05:56',NULL,NULL,'2025-11-24 10:05:56','2025-11-24 10:05:56'),(6,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:32:42',NULL,NULL,'2025-11-24 11:32:42','2025-11-24 11:32:42'),(7,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 14:38:45',NULL,NULL,'2025-11-24 11:38:45','2025-11-24 11:38:45'),(8,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:03:43',NULL,NULL,'2025-11-24 14:03:43','2025-11-24 14:03:43'),(9,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:04:26',NULL,NULL,'2025-11-24 14:04:26','2025-11-24 14:04:26'),(10,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:06',NULL,NULL,'2025-11-24 14:15:06','2025-11-24 14:15:06'),(11,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:11',NULL,NULL,'2025-11-24 14:15:11','2025-11-24 14:15:11'),(12,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:14',NULL,NULL,'2025-11-24 14:15:14','2025-11-24 14:15:14'),(13,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:18',NULL,NULL,'2025-11-24 14:15:18','2025-11-24 14:15:18'),(14,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:15:22',NULL,NULL,'2025-11-24 14:15:22','2025-11-24 14:15:22'),(15,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:16:33',NULL,NULL,'2025-11-24 14:16:33','2025-11-24 14:16:33'),(16,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:01',NULL,NULL,'2025-11-24 14:37:01','2025-11-24 14:37:01'),(17,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:37:22',NULL,NULL,'2025-11-24 14:37:22','2025-11-24 14:37:22'),(18,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:08',NULL,NULL,'2025-11-24 14:44:08','2025-11-24 14:44:08'),(19,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:12',NULL,NULL,'2025-11-24 14:44:12','2025-11-24 14:44:12'),(20,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 17:44:14',NULL,NULL,'2025-11-24 14:44:14','2025-11-24 14:44:14'),(21,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 19:50:04',NULL,NULL,'2025-11-24 16:50:04','2025-11-24 16:50:04'),(22,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:03:54',NULL,NULL,'2025-11-24 17:03:54','2025-11-24 17:03:54'),(23,'create','',3,'push',NULL,'pending',5,0,3,NULL,'2025-11-24 20:08:48',NULL,NULL,'2025-11-24 17:08:48','2025-11-24 17:08:48'),(24,'create','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:20',NULL,NULL,'2025-11-24 17:11:20','2025-11-24 17:11:20'),(25,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:25',NULL,NULL,'2025-11-24 17:11:25','2025-11-24 17:11:25'),(26,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:30',NULL,NULL,'2025-11-24 17:11:30','2025-11-24 17:11:30'),(27,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:11:55',NULL,NULL,'2025-11-24 17:11:55','2025-11-24 17:11:55'),(28,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:01',NULL,NULL,'2025-11-24 17:12:01','2025-11-24 17:12:01'),(29,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:12:23',NULL,NULL,'2025-11-24 17:12:23','2025-11-24 17:12:23'),(30,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:13:19',NULL,NULL,'2025-11-24 17:13:19','2025-11-24 17:13:19'),(31,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 20:28:38',NULL,NULL,'2025-11-24 17:28:38','2025-11-24 17:28:38'),(32,'update','activity',14,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:15',NULL,NULL,'2025-11-24 18:01:15','2025-11-24 18:01:15'),(33,'update','activity',13,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:01:48',NULL,NULL,'2025-11-24 18:01:48','2025-11-24 18:01:48'),(34,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:05:41',NULL,NULL,'2025-11-24 18:05:41','2025-11-24 18:05:41'),(35,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:12:20',NULL,NULL,'2025-11-24 18:12:20','2025-11-24 18:12:20'),(36,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:13:59',NULL,NULL,'2025-11-24 18:13:59','2025-11-24 18:13:59'),(37,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:39',NULL,NULL,'2025-11-24 18:22:39','2025-11-24 18:22:39'),(38,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:22:56',NULL,NULL,'2025-11-24 18:22:56','2025-11-24 18:22:56'),(39,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:24:55',NULL,NULL,'2025-11-24 18:24:55','2025-11-24 18:24:55'),(40,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-11-24 21:32:25',NULL,NULL,'2025-11-24 18:32:25','2025-11-24 18:32:25'),(41,'update','activity',8,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:37',NULL,NULL,'2025-11-25 05:24:37','2025-11-25 05:24:37'),(42,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:24:57',NULL,NULL,'2025-11-25 05:24:57','2025-11-25 05:24:57'),(43,'update','activity',7,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 08:26:21',NULL,NULL,'2025-11-25 05:26:21','2025-11-25 05:26:21'),(44,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:11',NULL,NULL,'2025-11-25 06:28:11','2025-11-25 06:28:11'),(45,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:18',NULL,NULL,'2025-11-25 06:28:18','2025-11-25 06:28:18'),(46,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:28:26',NULL,NULL,'2025-11-25 06:28:26','2025-11-25 06:28:26'),(47,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:30:30',NULL,NULL,'2025-11-25 06:30:30','2025-11-25 06:30:30'),(48,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:31:19',NULL,NULL,'2025-11-25 06:31:19','2025-11-25 06:31:19'),(49,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 09:39:52',NULL,NULL,'2025-11-25 06:39:52','2025-11-25 06:39:52'),(50,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:11:31',NULL,NULL,'2025-11-25 10:11:31','2025-11-25 10:11:31'),(51,'create','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:45:53',NULL,NULL,'2025-11-25 10:45:53','2025-11-25 10:45:53'),(52,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:46:13',NULL,NULL,'2025-11-25 10:46:13','2025-11-25 10:46:13'),(53,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:53:31',NULL,NULL,'2025-11-25 10:53:31','2025-11-25 10:53:31'),(54,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:54:07',NULL,NULL,'2025-11-25 10:54:07','2025-11-25 10:54:07'),(55,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 13:59:25',NULL,NULL,'2025-11-25 10:59:25','2025-11-25 10:59:25'),(56,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:04:00',NULL,NULL,'2025-11-25 11:04:00','2025-11-25 11:04:00'),(57,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 14:05:55',NULL,NULL,'2025-11-25 11:05:55','2025-11-25 11:05:55'),(58,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:13:26',NULL,NULL,'2025-11-25 16:13:26','2025-11-25 16:13:26'),(59,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 19:26:39',NULL,NULL,'2025-11-25 16:26:39','2025-11-25 16:26:39'),(60,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:39',NULL,NULL,'2025-11-25 17:54:39','2025-11-25 17:54:39'),(61,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:54:43',NULL,NULL,'2025-11-25 17:54:43','2025-11-25 17:54:43'),(62,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-25 20:55:35',NULL,NULL,'2025-11-25 17:55:35','2025-11-25 17:55:35'),(63,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:20',NULL,NULL,'2025-11-27 06:43:20','2025-11-27 06:43:20'),(64,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 09:43:29',NULL,NULL,'2025-11-27 06:43:29','2025-11-27 06:43:29'),(65,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-11-27 10:50:16',NULL,NULL,'2025-11-27 07:50:16','2025-11-27 07:50:16'),(66,'create','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 09:36:48',NULL,NULL,'2025-12-04 06:36:48','2025-12-04 06:36:48'),(67,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:00:13',NULL,NULL,'2025-12-04 09:00:13','2025-12-04 09:00:13'),(68,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:14:53',NULL,NULL,'2025-12-04 09:14:53','2025-12-04 09:14:53'),(69,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-04 12:15:20',NULL,NULL,'2025-12-04 09:15:20','2025-12-04 09:15:20'),(70,'create','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:11:40',NULL,NULL,'2025-12-06 15:11:40','2025-12-06 15:11:40'),(71,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:12:48',NULL,NULL,'2025-12-06 15:12:48','2025-12-06 15:12:48'),(72,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:13:12',NULL,NULL,'2025-12-06 15:13:12','2025-12-06 15:13:12'),(73,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:45',NULL,NULL,'2025-12-06 15:14:45','2025-12-06 15:14:45'),(74,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:14:58',NULL,NULL,'2025-12-06 15:14:58','2025-12-06 15:14:58'),(75,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:15:43',NULL,NULL,'2025-12-06 15:15:43','2025-12-06 15:15:43'),(76,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-06 18:17:25',NULL,NULL,'2025-12-06 15:17:25','2025-12-06 15:17:25'),(77,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 18:26:29',NULL,NULL,'2025-12-09 15:26:29','2025-12-09 15:26:29'),(78,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 18:26:33',NULL,NULL,'2025-12-09 15:26:33','2025-12-09 15:26:33'),(79,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 19:02:03',NULL,NULL,'2025-12-09 16:02:03','2025-12-09 16:02:03'),(80,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 19:18:00',NULL,NULL,'2025-12-09 16:18:00','2025-12-09 16:18:00'),(81,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 21:44:14',NULL,NULL,'2025-12-09 18:44:14','2025-12-09 18:44:14'),(82,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 21:53:56',NULL,NULL,'2025-12-09 18:53:56','2025-12-09 18:53:56'),(83,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:07',NULL,NULL,'2025-12-09 19:05:07','2025-12-09 19:05:07'),(84,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:37',NULL,NULL,'2025-12-09 19:05:37','2025-12-09 19:05:37'),(85,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:05:55',NULL,NULL,'2025-12-09 19:05:55','2025-12-09 19:05:55'),(86,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-09 22:06:29',NULL,NULL,'2025-12-09 19:06:29','2025-12-09 19:06:29'),(87,'create','',24,'push',NULL,'pending',5,0,3,NULL,'2025-12-10 06:56:46',NULL,NULL,'2025-12-10 03:56:46','2025-12-10 03:56:46'),(88,'create','activity',30,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:00:23',NULL,NULL,'2025-12-10 04:00:23','2025-12-10 04:00:23'),(89,'delete','activity',30,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:02:03',NULL,NULL,'2025-12-10 04:02:03','2025-12-10 04:02:03'),(90,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:17:54',NULL,NULL,'2025-12-10 04:17:54','2025-12-10 04:17:54'),(91,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-12-10 07:20:05',NULL,NULL,'2025-12-10 04:20:05','2025-12-10 04:20:05'),(92,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:21',NULL,NULL,'2025-12-11 09:27:21','2025-12-11 09:27:21'),(93,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:27',NULL,NULL,'2025-12-11 09:27:27','2025-12-11 09:27:27'),(94,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:27:42',NULL,NULL,'2025-12-11 09:27:42','2025-12-11 09:27:42'),(95,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 12:28:21',NULL,NULL,'2025-12-11 09:28:21','2025-12-11 09:28:21'),(96,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:46:10',NULL,NULL,'2025-12-11 17:46:10','2025-12-11 17:46:10'),(97,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:37',NULL,NULL,'2025-12-11 17:47:37','2025-12-11 17:47:37'),(98,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:40',NULL,NULL,'2025-12-11 17:47:40','2025-12-11 17:47:40'),(99,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:42',NULL,NULL,'2025-12-11 17:47:42','2025-12-11 17:47:42'),(100,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:47:56',NULL,NULL,'2025-12-11 17:47:56','2025-12-11 17:47:56'),(101,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:01',NULL,NULL,'2025-12-11 17:48:01','2025-12-11 17:48:01'),(102,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:04',NULL,NULL,'2025-12-11 17:48:04','2025-12-11 17:48:04'),(103,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:06',NULL,NULL,'2025-12-11 17:48:06','2025-12-11 17:48:06'),(104,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:09',NULL,NULL,'2025-12-11 17:48:09','2025-12-11 17:48:09'),(105,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:48:11',NULL,NULL,'2025-12-11 17:48:11','2025-12-11 17:48:11'),(106,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:51:57',NULL,NULL,'2025-12-11 17:51:57','2025-12-11 17:51:57'),(107,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:27',NULL,NULL,'2025-12-11 17:53:27','2025-12-11 17:53:27'),(108,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:37',NULL,NULL,'2025-12-11 17:53:37','2025-12-11 17:53:37'),(109,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:53:56',NULL,NULL,'2025-12-11 17:53:56','2025-12-11 17:53:56'),(110,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:54:29',NULL,NULL,'2025-12-11 17:54:29','2025-12-11 17:54:29'),(111,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 20:54:45',NULL,NULL,'2025-12-11 17:54:45','2025-12-11 17:54:45'),(112,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:01:10',NULL,NULL,'2025-12-11 18:01:10','2025-12-11 18:01:10'),(113,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:02:11',NULL,NULL,'2025-12-11 18:02:11','2025-12-11 18:02:11'),(114,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:18:44',NULL,NULL,'2025-12-11 18:18:44','2025-12-11 18:18:44'),(115,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:20:29',NULL,NULL,'2025-12-11 18:20:29','2025-12-11 18:20:29'),(116,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:41:44',NULL,NULL,'2025-12-11 18:41:44','2025-12-11 18:41:44'),(117,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:01',NULL,NULL,'2025-12-11 18:42:01','2025-12-11 18:42:01'),(118,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:10',NULL,NULL,'2025-12-11 18:42:10','2025-12-11 18:42:10'),(119,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:42:36',NULL,NULL,'2025-12-11 18:42:36','2025-12-11 18:42:36'),(120,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:06',NULL,NULL,'2025-12-11 18:52:06','2025-12-11 18:52:06'),(121,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:16',NULL,NULL,'2025-12-11 18:52:16','2025-12-11 18:52:16'),(122,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:52:26',NULL,NULL,'2025-12-11 18:52:26','2025-12-11 18:52:26'),(123,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 21:53:08',NULL,NULL,'2025-12-11 18:53:08','2025-12-11 18:53:08'),(124,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:11:09',NULL,NULL,'2025-12-11 19:11:09','2025-12-11 19:11:09'),(125,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:17:31',NULL,NULL,'2025-12-11 19:17:31','2025-12-11 19:17:31'),(126,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:07',NULL,NULL,'2025-12-11 19:34:07','2025-12-11 19:34:07'),(127,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:10',NULL,NULL,'2025-12-11 19:34:10','2025-12-11 19:34:10'),(128,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:15',NULL,NULL,'2025-12-11 19:34:15','2025-12-11 19:34:15'),(129,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:34:47',NULL,NULL,'2025-12-11 19:34:47','2025-12-11 19:34:47'),(130,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:35:31',NULL,NULL,'2025-12-11 19:35:31','2025-12-11 19:35:31'),(131,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:36:36',NULL,NULL,'2025-12-11 19:36:36','2025-12-11 19:36:36'),(132,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:40:50',NULL,NULL,'2025-12-11 19:40:50','2025-12-11 19:40:50'),(133,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:41:01',NULL,NULL,'2025-12-11 19:41:01','2025-12-11 19:41:01'),(134,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:44:40',NULL,NULL,'2025-12-11 19:44:40','2025-12-11 19:44:40'),(135,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:45:04',NULL,NULL,'2025-12-11 19:45:04','2025-12-11 19:45:04'),(136,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:49:33',NULL,NULL,'2025-12-11 19:49:33','2025-12-11 19:49:33'),(137,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:49:41',NULL,NULL,'2025-12-11 19:49:41','2025-12-11 19:49:41'),(138,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:51:45',NULL,NULL,'2025-12-11 19:51:45','2025-12-11 19:51:45'),(139,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:51:47',NULL,NULL,'2025-12-11 19:51:47','2025-12-11 19:51:47'),(140,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:23',NULL,NULL,'2025-12-11 19:52:23','2025-12-11 19:52:23'),(141,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:27',NULL,NULL,'2025-12-11 19:52:27','2025-12-11 19:52:27'),(142,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:31',NULL,NULL,'2025-12-11 19:52:31','2025-12-11 19:52:31'),(143,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:52:43',NULL,NULL,'2025-12-11 19:52:43','2025-12-11 19:52:43'),(144,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 22:54:08',NULL,NULL,'2025-12-11 19:54:08','2025-12-11 19:54:08'),(145,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:25',NULL,NULL,'2025-12-11 20:02:25','2025-12-11 20:02:25'),(146,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:28',NULL,NULL,'2025-12-11 20:02:28','2025-12-11 20:02:28'),(147,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:02:44',NULL,NULL,'2025-12-11 20:02:44','2025-12-11 20:02:44'),(148,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:05',NULL,NULL,'2025-12-11 20:03:05','2025-12-11 20:03:05'),(149,'update','activity',6,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:10',NULL,NULL,'2025-12-11 20:03:10','2025-12-11 20:03:10'),(150,'update','activity',27,'push',NULL,'pending',3,0,3,NULL,'2025-12-11 23:03:43',NULL,NULL,'2025-12-11 20:03:43','2025-12-11 20:03:43'),(151,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:18',NULL,NULL,'2025-12-12 05:44:18','2025-12-12 05:44:18'),(152,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:21',NULL,NULL,'2025-12-12 05:44:21','2025-12-12 05:44:21'),(153,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:35',NULL,NULL,'2025-12-12 05:44:35','2025-12-12 05:44:35'),(154,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:41',NULL,NULL,'2025-12-12 05:44:41','2025-12-12 05:44:41'),(155,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-12 08:44:45',NULL,NULL,'2025-12-12 05:44:45','2025-12-12 05:44:45'),(156,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:10:54',NULL,NULL,'2025-12-13 06:10:54','2025-12-13 06:10:54'),(157,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:12:28',NULL,NULL,'2025-12-13 06:12:28','2025-12-13 06:12:28'),(158,'update','activity',29,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 09:18:39',NULL,NULL,'2025-12-13 06:18:39','2025-12-13 06:18:39'),(159,'update','activity',28,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 10:15:57',NULL,NULL,'2025-12-13 07:15:57','2025-12-13 07:15:57'),(160,'update','activity',23,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 10:53:10',NULL,NULL,'2025-12-13 07:53:10','2025-12-13 07:53:10'),(161,'update','activity',23,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:06:40',NULL,NULL,'2025-12-13 08:06:40','2025-12-13 08:06:40'),(162,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:11:44',NULL,NULL,'2025-12-13 08:11:44','2025-12-13 08:11:44'),(163,'update','activity',21,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:14:44',NULL,NULL,'2025-12-13 08:14:44','2025-12-13 08:14:44'),(164,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:16:11',NULL,NULL,'2025-12-13 08:16:11','2025-12-13 08:16:11'),(165,'update','activity',24,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:16:45',NULL,NULL,'2025-12-13 08:16:45','2025-12-13 08:16:45'),(166,'update','activity',9,'push',NULL,'pending',3,0,3,NULL,'2025-12-13 11:35:10',NULL,NULL,'2025-12-13 08:35:10','2025-12-13 08:35:10'),(167,'create','',23,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 14:20:33',NULL,NULL,'2025-12-15 11:20:33','2025-12-15 11:20:33'),(168,'create','',25,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 14:21:10',NULL,NULL,'2025-12-15 11:21:10','2025-12-15 11:21:10'),(169,'create','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:22:17',NULL,NULL,'2025-12-15 11:22:17','2025-12-15 11:22:17'),(170,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:43:38',NULL,NULL,'2025-12-15 11:43:38','2025-12-15 11:43:38'),(171,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 14:44:12',NULL,NULL,'2025-12-15 11:44:12','2025-12-15 11:44:12'),(172,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:04:00',NULL,NULL,'2025-12-15 12:04:00','2025-12-15 12:04:00'),(173,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:07:03',NULL,NULL,'2025-12-15 12:07:03','2025-12-15 12:07:03'),(174,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:07:34',NULL,NULL,'2025-12-15 12:07:34','2025-12-15 12:07:34'),(175,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 15:08:14',NULL,NULL,'2025-12-15 12:08:14','2025-12-15 12:08:14'),(176,'create','',26,'push',NULL,'pending',5,0,3,NULL,'2025-12-15 15:11:36',NULL,NULL,'2025-12-15 12:11:36','2025-12-15 12:11:36'),(177,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 20:59:32',NULL,NULL,'2025-12-15 17:59:32','2025-12-15 17:59:32'),(178,'update','activity',15,'push',NULL,'pending',3,0,3,NULL,'2025-12-15 20:59:37',NULL,NULL,'2025-12-15 17:59:37','2025-12-15 17:59:37'),(179,'create','activity',32,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:27:24',NULL,NULL,'2025-12-16 06:27:24','2025-12-16 06:27:24'),(180,'create','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:36:08',NULL,NULL,'2025-12-16 06:36:08','2025-12-16 06:36:08'),(181,'create','activity',34,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 09:45:59',NULL,NULL,'2025-12-16 06:45:59','2025-12-16 06:45:59'),(182,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:40:58',NULL,NULL,'2025-12-16 07:40:58','2025-12-16 07:40:58'),(183,'update','activity',33,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:41:14',NULL,NULL,'2025-12-16 07:41:14','2025-12-16 07:41:14'),(184,'update','activity',31,'push',NULL,'pending',3,0,3,NULL,'2025-12-16 10:42:08',NULL,NULL,'2025-12-16 07:42:08','2025-12-16 07:42:08');

--
-- Table structure for table "sync_status"
--
DROP TABLE IF EXISTS "sync_status";
CREATE TABLE "time_entries" (
  "id" SERIAL,
  "activity_id" INTEGER NOT NULL,
  "clickup_time_entry_id" VARCHAR(50)  DEFAULT NULL,
  "user_id" INTEGER DEFAULT NULL,
  "user_name" VARCHAR(255)  DEFAULT NULL,
  "user_type" VARCHAR(100)  DEFAULT 'staff',
  "hours_spent" DECIMAL(5,2) NOT NULL,
  "description" TEXT ,
  "entry_date" date NOT NULL,
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "time_entries_ibfk_1" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "time_entries"
--
--
-- Table structure for table "training_participants"
--
DROP TABLE IF EXISTS "training_participants";
CREATE TABLE "user_hierarchy" (
  "id" SERIAL,
  "supervisor_id" INTEGER NOT NULL,
  "subordinate_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_hierarchy_ibfk_1" FOREIGN KEY ("supervisor_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_hierarchy_ibfk_2" FOREIGN KEY ("subordinate_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_hierarchy_chk_1" CHECK (("supervisor_id" <> "subordinate_id"))
);

--
-- Dumping data for table "user_hierarchy"
--
--
-- Table structure for table "user_module_assignments"
--
DROP TABLE IF EXISTS "user_module_assignments";
CREATE TABLE "user_module_assignments" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "module_id" INTEGER NOT NULL,
  "can_view" BOOLEAN DEFAULT '1',
  "can_create" BOOLEAN DEFAULT '0',
  "can_edit" BOOLEAN DEFAULT '0',
  "can_delete" BOOLEAN DEFAULT '0',
  "can_approve" BOOLEAN DEFAULT '0',
  "assigned_by" INTEGER DEFAULT NULL,
  "assigned_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_module_assignments_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_module_assignments_ibfk_2" FOREIGN KEY ("module_id") REFERENCES "programs" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_module_assignments_ibfk_3" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id") ON DELETE SET NULL
);

--
-- Dumping data for table "user_module_assignments"
--
INSERT INTO "user_module_assignments" VALUES (8,5,5,1,1,1,1,1,1,'2025-12-04 05:40:05'),(9,5,1,1,1,1,1,1,1,'2025-12-04 05:40:05'),(13,4,1,1,0,0,0,0,2,'2025-12-04 10:36:02'),(14,6,5,1,0,0,0,0,1,'2025-12-15 17:56:34');
--
-- Table structure for table "user_roles"
--
DROP TABLE IF EXISTS "user_roles";
CREATE TABLE "user_roles" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "role_id" INTEGER NOT NULL,
  "assigned_by" INTEGER DEFAULT NULL,
  "assigned_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_roles_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_roles_ibfk_2" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE,
  CONSTRAINT "user_roles_ibfk_3" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id") ON DELETE SET NULL
);

--
-- Dumping data for table "user_roles"
--
INSERT INTO "user_roles" VALUES (1,1,1,1,'2025-12-02 04:48:26',NULL),(17,5,6,1,'2025-12-04 05:40:05',NULL),(23,3,11,1,'2025-12-04 10:22:00',NULL),(24,4,11,2,'2025-12-04 10:36:02',NULL),(26,7,11,1,'2025-12-09 04:59:15',NULL),(27,6,30,1,'2025-12-15 17:56:34',NULL);
--
-- Table structure for table "user_sessions"
--
DROP TABLE IF EXISTS "user_sessions";
CREATE TABLE "user_sessions" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "token" VARCHAR(500)  NOT NULL,
  "refresh_token" VARCHAR(500)  DEFAULT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "refresh_expires_at" TIMESTAMP DEFAULT NULL,
  "ip_address" VARCHAR(45)  DEFAULT NULL,
  "user_agent" TEXT,
  "is_active" BOOLEAN DEFAULT '1',
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_sessions_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

--
-- Dumping data for table "user_sessions"
--
INSERT INTO "user_sessions" VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjUxMzkyLCJleHAiOjE3NjQ3Mzc3OTJ9.8eItjqRmq74QpHqVdKW7gnARiINwtIk7AdIklVn0Vqc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1MTM5MiwiZXhwIjoxNzY1MjU2MTkyfQ.ufEWO5DKnviHfn_5JAJeITio-kXlcFyNM5T8-nYrAmg','2025-12-03 07:56:32','2025-12-09 07:56:32','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 04:56:32'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NjU4NTc4LCJleHAiOjE3NjQ3NDQ5Nzh9.NU2UEFP6uKMhm2UB6hXDbERZ7ygH95FyitIsMEyQ7ts','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY1ODU3OCwiZXhwIjoxNzY1MjYzMzc4fQ.9U7hyiUD0V3A-_osojMLekm1Mn-ERe8EbcqiH0cdOHg','2025-12-03 09:56:19','2025-12-09 09:56:19','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 06:56:18'),(3,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk1MzI1LCJleHAiOjE3NjQ3ODE3MjV9.K77PNvFj2grXCMyQu2vNN9McImWd9n5tYhQIH8oAzUI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDY5NTMyNSwiZXhwIjoxNzY1MzAwMTI1fQ.cDu2hGQZUq3PcxjCe9Z5lwmMUBVfUz9ZsbLJAvvcCyQ','2025-12-03 20:08:45','2025-12-09 20:08:45','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:08:45'),(4,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5NTQ0OSwiZXhwIjoxNzY0NzgxODQ5fQ.TEeqf_XauW_AI3Im20DnTGl5MxLGyK6Vu5wJvhw2e80','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDY5NTQ0OSwiZXhwIjoxNzY1MzAwMjQ5fQ.OlBTf-Y2k24EyUIonyaZcRtaOoSUbS3CRpDdXE5431o','2025-12-03 20:10:49','2025-12-09 20:10:49','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:10:49'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2NTAxLCJleHAiOjE3NjQ3ODI5MDF9.gHIFs92EKmcCaew7_O9C3tAqsbJcMm0nDz2N-XmPwW4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5NjUwMSwiZXhwIjoxNzY1MzAxMzAxfQ.e6FTg9_zCLSgYF1TZvOEsOgu8iHJw5oFcSFW2137Jy4','2025-12-03 20:28:21','2025-12-09 20:28:21','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:28:21'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk2ODYyLCJleHAiOjE3NjQ3ODMyNjJ9.wEEUF_ruV2yCePb86Ig3qc0ni2-LqSQxziKfbZ75LQw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5Njg2MiwiZXhwIjoxNzY1MzAxNjYyfQ.-8wLh4wWbRyaU6R6BovOA_hF_psFLj9jkKXeSQJukJ0','2025-12-03 20:34:23','2025-12-09 20:34:23','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:34:22'),(7,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5Nzg3NywiZXhwIjoxNzY0Nzg0Mjc3fQ.FNXGr-d-V4y4aVudgvdfRT6VzLJneZ86mEOgFSXUDzw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDY5Nzg3NywiZXhwIjoxNzY1MzAyNjc3fQ.1imRSqhe93u_wsAEyhRvVAkPdfYUqqIyokB0yZX5ZVg','2025-12-03 20:51:17','2025-12-09 20:51:17','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:51:17'),(8,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk4MDkxLCJleHAiOjE3NjQ3ODQ0OTF9.s75IRbqe5RXabVzul70osDVvRQx90aUHRkVz8DdZpbg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDY5ODA5MSwiZXhwIjoxNzY1MzAyODkxfQ.6ALhwMQ_gjUM9CDKQoAf3_-iPHHFTXicbdbfN0fGw8M','2025-12-03 20:54:51','2025-12-09 20:54:51','::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 17:54:51'),(9,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDY5OTYyMSwiZXhwIjoxNzY0Nzg2MDIxfQ.g393m5sFQ5z4ZdG9T3EvyWY94-xC_r3ALZ9l7SqHCeM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDY5OTYyMSwiZXhwIjoxNzY1MzA0NDIxfQ.aUdfdRZxMd9yk4PnW89O9XCqNWyiqjgV94_fqW2nXGo','2025-12-03 21:20:21','2025-12-09 21:20:21','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:20:21'),(10,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Njk5NjMzLCJleHAiOjE3NjQ3ODYwMzN9.mzf64RKeOmUwQUwhKv7fNmyS6q5ztFQN4q_OZI7PwSU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDY5OTYzMywiZXhwIjoxNzY1MzA0NDMzfQ.ysm3zcgtqpNYakYTADj8Zn_XENaSpHskuDWFVORCiB0','2025-12-03 21:20:34','2025-12-09 21:20:34','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:20:33'),(11,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzA5LCJleHAiOjE3NjQ3ODY3MDl9.EZdzmbeBuEnP6RCpdRAnMJ5XaxHIP7QRr-Peeop1cpY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMwOSwiZXhwIjoxNzY1MzA1MTA5fQ.BIYr5J7_PPLXI2legBPkTu77Ws7NZLSnhuz1VQ0pqt0','2025-12-03 21:31:49','2025-12-09 21:31:49','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-02 18:31:49'),(12,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0NzAwMzMyLCJleHAiOjE3NjQ3ODY3MzJ9.XNMBonUIViBQ3jx57yoySRfgBtGhMICOC8y6JjJORXk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDcwMDMzMiwiZXhwIjoxNzY1MzA1MTMyfQ.hqVLiEGYObuS4zIb_gBJmaZCNOZFGYBHiSCCw1tXxM8','2025-12-03 21:32:13','2025-12-09 21:32:13','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-02 18:32:12'),(13,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTUwLCJleHAiOjE3NjQ4NzA1NTB9.iQncsT_Jpz9BQSzyj1iywMGJgUnhwUOuFoavTywpEYQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE1MCwiZXhwIjoxNzY1Mzg4OTUwfQ.onP5Kx5_Ka6eBPkm91ihzXhKX3KD6P7ubj3d1ielaec','2025-12-04 20:49:10','2025-12-10 20:49:10','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 17:49:10'),(14,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg0MTkyLCJleHAiOjE3NjQ4NzA1OTJ9.PxCWXzB4xF5u-sLDdp_VFRL5rP_TPHN3rWygXmqYHfk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4NDE5MiwiZXhwIjoxNzY1Mzg4OTkyfQ.4khF1JeH0zjs9KQ3hnVD2OkxxD4HIwCkzihYoizkd7M','2025-12-04 20:49:52','2025-12-10 20:49:52','192.168.100.5','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-03 17:49:52'),(15,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NTM2MywiZXhwIjoxNzY0ODcxNzYzfQ.I-30Pd3fS4JoitLTPba2mig9hJ7czFflVPu4xvZtgko','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDc4NTM2MywiZXhwIjoxNzY1MzkwMTYzfQ.niIa2Gv9DvNzr_HilvdnUKGvA3-Iq2ZFxxXT2pkXxTQ','2025-12-04 21:09:23','2025-12-10 21:09:23','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 18:09:23'),(16,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NTQyNiwiZXhwIjoxNzY0ODcxODI2fQ.0kPNrz_5CURnnfJ_3jovZrFjOWIsgUDz3Fic0SNaY7E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4NTQyNiwiZXhwIjoxNzY1MzkwMjI2fQ.N9wpazRPfTQIT-h8H9-vYyq-c2nZ2oQUdUjHTfL0Trw','2025-12-04 21:10:26','2025-12-10 21:10:26','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:10:26'),(17,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg1NDY1LCJleHAiOjE3NjQ4NzE4NjV9.UDrW0wp8DvUPt3ELwdsacEpb8VpVWd8wOKuU77xVJhE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4NTQ2NSwiZXhwIjoxNzY1MzkwMjY1fQ.FHDIwBrgbfyCaZaAtsXJr_2Q9xmsDkIhDugGZZbHZxg','2025-12-04 21:11:06','2025-12-10 21:11:06','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:11:05'),(18,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4NzQ4MCwiZXhwIjoxNzY0ODczODgwfQ.8Z-xfKq4SXhhORsgI4rb0vdMbomTcjitFPCXoyel1xU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4NzQ4MCwiZXhwIjoxNzY1MzkyMjgwfQ.1cdQuy8r5EURD4gDIvOhDXBdduLDmI93JzYE2VnTdFY','2025-12-04 21:44:40','2025-12-10 21:44:40','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:44:40'),(19,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg3NTAyLCJleHAiOjE3NjQ4NzM5MDJ9.AGs5B9iRFqgvzLT73l4THqQuqtnm-yoPtqrWiRE6KYI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4NzUwMiwiZXhwIjoxNzY1MzkyMzAyfQ.3xO7MFSbMVBruvEw5gPTRIHVWW1N3kOl2LUXLoi4Y_c','2025-12-04 21:45:03','2025-12-10 21:45:03','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 18:45:02'),(20,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDc4ODUyMSwiZXhwIjoxNzY0ODc0OTIxfQ.Zv8eO85iGAbTU09itT54kn_SHl_nWy_ajreEvBvwTjg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDc4ODUyMSwiZXhwIjoxNzY1MzkzMzIxfQ.Yqt-74GjkWVZYWL3niUKlscSEoydROqR3iaJU911qKA','2025-12-04 22:02:02','2025-12-10 22:02:02','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 19:02:01'),(21,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg4NTQ3LCJleHAiOjE3NjQ4NzQ5NDd9.p-xF4Kw5PyKhCqp26ok0VZrhwI6I3bT5kcBsbLdUeio','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDc4ODU0NywiZXhwIjoxNzY1MzkzMzQ3fQ.2_iO5WIa_tnZZ70r2KYhdggXxO7eIpLGYfqwDoa6CpM','2025-12-04 22:02:28','2025-12-10 22:02:28','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-03 19:02:27'),(22,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODg4NTgsImV4cCI6MTc2NDg3NTI1OH0.yT16yGoyyof1atyFZTPNfmwxfwpTETqJrVfk3Qmo-n8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4ODg1OCwiZXhwIjoxNzY1MzkzNjU4fQ.mLPAItBxyiTOewKbuAXros5OcMQfiVrrM12BipsG5Mc','2025-12-04 22:07:38','2025-12-10 22:07:38','192.168.100.5','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:07:38'),(23,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkxMjcsImV4cCI6MTc2NDg3NTUyN30.4SyfqOcbo7KmAZyxiV97V0uyLshSq4quzNs7v4ROWyM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTEyNywiZXhwIjoxNzY1MzkzOTI3fQ.ZuQoH5DKnRBcv6EWSNSgh8gzt6SDbyAqswECEmUgsfg','2025-12-04 22:12:07','2025-12-10 22:12:07','192.168.100.5','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:07'),(24,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkxNTAsImV4cCI6MTc2NDg3NTU1MH0.zlr9lm51_gFf20r92CqBg-gOaazbbcHch8UH66EHiCw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTE1MCwiZXhwIjoxNzY1MzkzOTUwfQ.oJP0U0un7eqHvaRGmztnoIb105u8I6oBjg6U_dOucrM','2025-12-04 22:12:30','2025-12-10 22:12:30','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:30'),(25,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg5MTY5LCJleHAiOjE3NjQ4NzU1Njl9.-fWNFLxSBrNa1XnahbuK3o8xR5G04p1jJfGYJOGHYmA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4OTE2OSwiZXhwIjoxNzY1MzkzOTY5fQ.0PG86TJvmL01N2aQUqaVQYo2r00JYZPC-wLSvNN8Jxw','2025-12-04 22:12:50','2025-12-10 22:12:50','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:12:49'),(26,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ3ODkyMjYsImV4cCI6MTc2NDg3NTYyNn0.OnZGnPebsWrsocf2vRcAONpD5eCinDWXFnVsPaSBl2A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTIyNiwiZXhwIjoxNzY1Mzk0MDI2fQ.3mTOWrlqkSS9SEJtuCC9HdFsBJOPI88fFgDVPZtJ7Yk','2025-12-04 22:13:47','2025-12-10 22:13:47','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:13:46'),(27,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0Nzg5MjQzLCJleHAiOjE3NjQ4NzU2NDN9.RMwO0uHkzSnmytE1EAXqzcrncslp7zZFT7uTnBMzMqY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDc4OTI0MywiZXhwIjoxNzY1Mzk0MDQzfQ.jXL7GIzgQd6MUjZJb6pyn3XRFmogDh3GdTqEJExoJ24','2025-12-04 22:14:04','2025-12-10 22:14:04','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 19:14:03'),(28,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjoxLCJpYXQiOjE3NjQ3ODkyNzQsImV4cCI6MTc2NDg3NTY3NH0.MK4YI01AMO33C74OHWAGNXY02Sbq8mCPM00VgUozuUE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDc4OTI3NCwiZXhwIjoxNzY1Mzk0MDc0fQ.VZ_OzRTE6CypUq-n6RXVNSHxu-cdsO9Y_q2KY6_Zrgc','2025-12-04 22:14:35','2025-12-10 22:14:35','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-03 19:14:34'),(29,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0NDY5LCJleHAiOjE3NjQ5MTA4Njl9.Y9IX2OJy8LSYGekVMAvWlSBYPWdJxw3tG6bFJ_kyKUU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDQ2OSwiZXhwIjoxNzY1NDI5MjY5fQ.ouaKq1e8HfSLou8YhM3IMnqBuFxJUCI5YvBMcpC8_XY','2025-12-05 08:01:10','2025-12-11 08:01:10','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:01:09'),(30,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgyNDQ4NSwiZXhwIjoxNzY0OTEwODg1fQ.woveUYSiqMEaDlBIeSJAo8DT9FZCeMsp4tmb3Lh3g9g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDgyNDQ4NSwiZXhwIjoxNzY1NDI5Mjg1fQ.1-BF4eIv7x23dUpRFk68vswz57j03KeyBMX7SKGVRWk','2025-12-05 08:01:25','2025-12-11 08:01:25','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:01:25'),(31,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI0ODA3LCJleHAiOjE3NjQ5MTEyMDd9.G0ggBt6KNdHjT_JPVN2heoBK2spQJfD_a3weGtYtHD4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNDgwNywiZXhwIjoxNzY1NDI5NjA3fQ.kLoq3kU9VWBJdSWWaHsW1ZCqBweFdXnQk9GeVJVS1k4','2025-12-05 08:06:48','2025-12-11 08:06:48','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:06:47'),(32,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjQ5MjUsImV4cCI6MTc2NDkxMTMyNX0.xj0OnOR3gQMIyyJo_r0grQ-LQdPxJV3YSKpXs1B0vtE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNDkyNSwiZXhwIjoxNzY1NDI5NzI1fQ.VDDepYpPlQZloHGuEPiYwZUGPfuduGbgK9h8GgUw-8g','2025-12-05 08:08:46','2025-12-11 08:08:46','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:08:45'),(33,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1NjIzLCJleHAiOjE3NjQ5MTIwMjN9.8gfkDaS0rWITPufMJfQ6Q_RxnfSzYY93O_waWEEN0wo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTYyMywiZXhwIjoxNzY1NDMwNDIzfQ.olK4n72lHg6fUZKKQeNi-QClMYTdmd7iSbNBNoMt8s4','2025-12-05 08:20:24','2025-12-11 08:20:24','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:20:23'),(34,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjU3MzUsImV4cCI6MTc2NDkxMjEzNX0.3pfeSX1VJxqZVEuicTMtE432Qum_tgKukgLqjl7wtiA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNTczNSwiZXhwIjoxNzY1NDMwNTM1fQ.ggjOK5YG7uHf6CtOVv843Rye1vTgO4mz5hY4U_RVHNE','2025-12-05 08:22:16','2025-12-11 08:22:16','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 05:22:15'),(35,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjU5MjQsImV4cCI6MTc2NDkxMjMyNH0._og8ewI0783V2Vjlzhr9KNjhEnLw9KXqOhLwg8oOH_A','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNTkyNCwiZXhwIjoxNzY1NDMwNzI0fQ.r8z9WgQwgEtc0XEjZr-Q0a0G8DLbXUqXX1qooi9W19I','2025-12-05 08:25:24','2025-12-11 08:25:24','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 05:25:24'),(36,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI1OTY0LCJleHAiOjE3NjQ5MTIzNjR9.5Q2Co6-wJHfH5OeliCR2wavhTu99VfYt1MDTsAjyR_Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNTk2NCwiZXhwIjoxNzY1NDMwNzY0fQ.yJEGLj4VuvY7-WD2Ub5I5FSNJU12TeRtVGBh_K-Vx8w','2025-12-05 08:26:05','2025-12-11 08:26:05','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:26:04'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODI2Mzc4LCJleHAiOjE3NjQ5MTI3Nzh9.MsOF8Br3sql0pgfcH4F0tIVMbiUNjwF-rM5LT58GagI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgyNjM3OCwiZXhwIjoxNzY1NDMxMTc4fQ.gjdDFGgMecsZ3XVPpMZF0GzVeX1S72WanCgcZihYw80','2025-12-05 08:32:58','2025-12-11 08:32:58','192.168.2.245','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 05:32:58'),(38,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjY3NDAsImV4cCI6MTc2NDkxMzE0MH0.pRxM6r6juR_q78dqxjM2bvQVk83pbJaa0mDln6rlJrA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNjc0MCwiZXhwIjoxNzY1NDMxNTQwfQ.FkdPXOXXynTA2UpZl8WHGZMnndaD4DIqdiAhIy5pIMw','2025-12-05 08:39:01','2025-12-11 08:39:01','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-04 05:39:00'),(39,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjY4NTEsImV4cCI6MTc2NDkxMzI1MX0.IlsGSTU2cbYAlAd2MxHm1E2CPsWxvJJYLBwwxyze8RU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyNjg1MSwiZXhwIjoxNzY1NDMxNjUxfQ.Jm9TKr2oLhO80GxkDtB_N4lsyskEN1JUh5cDxlXEMKo','2025-12-05 08:40:51','2025-12-11 08:40:51','192.168.2.85','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 05:40:51'),(40,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MjgxMzgsImV4cCI6MTc2NDkxNDUzOH0.DHB8dytl6atjItAi_pLUChhP53nK69nrxEZmWgTKEm4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyODEzOCwiZXhwIjoxNzY1NDMyOTM4fQ.cMTCKDJnTn2bJP8HX8eqvNUOZS4R1Eo5y_eluZrBEdE','2025-12-05 09:02:18','2025-12-11 09:02:18','192.168.87.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-04 06:02:18'),(41,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4Mjk4NzIsImV4cCI6MTc2NDkxNjI3Mn0.SKyzWdtytZUgXqdHVQB0wVQLZ9S5FbjCsTwWlu8RkNY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgyOTg3MiwiZXhwIjoxNzY1NDM0NjcyfQ.og_p9thBi44C7XONsH5yVVt-PVG8ioKi6hphQ9CsfgM','2025-12-05 09:31:13','2025-12-11 09:31:13','192.168.87.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-04 06:31:12'),(42,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MzgxMzYsImV4cCI6MTc2NDkyNDUzNn0.uw2WWwkNVEZtiRq3QIolTeR4mpLX9DJUyBI9ApmkkLQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgzODEzNiwiZXhwIjoxNzY1NDQyOTM2fQ.2QbQvB2mUZSbcK5eb_RoK3XbF2nNwX6ovXy-M6incYU','2025-12-05 11:48:57','2025-12-11 11:48:57','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:48:56'),(43,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4MzQzLCJleHAiOjE3NjQ5MjQ3NDN9.PErMKSQUFH52b8DT72GEVpDtLG5uNVJ4DWE_Q1VWNGQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODM0MywiZXhwIjoxNzY1NDQzMTQzfQ.ghQDil7aPcfCkczR9F78dErrI_FN5hBxFJgKHlvzTno','2025-12-05 11:52:24','2025-12-11 11:52:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:52:23'),(44,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4MzgzNTMsImV4cCI6MTc2NDkyNDc1M30.4gNMWIIjouQXX19cHD5oJ1Ai7Mg8-STn1n_zY_7ZzQY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDgzODM1MywiZXhwIjoxNzY1NDQzMTUzfQ.chzvwzA6YaErw77wumm3jpL_8JK5zuOGbviIWDM-CYo','2025-12-05 11:52:33','2025-12-11 11:52:33','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:52:33'),(45,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODM5NCwiZXhwIjoxNzY0OTI0Nzk0fQ._LrMPW9FBqcHBHeDQ7tDZ_QS7NO7g2A7Kv57a-PcUXw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODM5NCwiZXhwIjoxNzY1NDQzMTk0fQ.x2ZM4imTOC5aGHTMRvUWvRlr9_4uuxhHkyl9OtKRkwE','2025-12-05 11:53:14','2025-12-11 11:53:14','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:53:14'),(46,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM4NjUzLCJleHAiOjE3NjQ5MjUwNTN9.QF2QWN-q-_2YuB5o6y7IPzzy94IKOFai-kZ8X8Ujvo4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzODY1MywiZXhwIjoxNzY1NDQzNDUzfQ.vwjQgjoBWRDMzzf7mAiGCbKpYnVeGyLMwlH11og6YVs','2025-12-05 11:57:34','2025-12-11 11:57:34','192.168.87.202','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-12-04 08:57:33'),(47,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODczNCwiZXhwIjoxNzY0OTI1MTM0fQ.9zcMZxh0gRoo1XTzA8vZPNHXl4-B8tsUntWH-E0aCPA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODczNCwiZXhwIjoxNzY1NDQzNTM0fQ.Wg9DueiaQBd0qrVnkSN7c4-8J0JojIpVf5QEamaoPLE','2025-12-05 11:58:55','2025-12-11 11:58:55','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 08:58:54'),(48,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzODkzOCwiZXhwIjoxNzY0OTI1MzM4fQ.iQqyiqNQ679OVH4MURCeJhqsZvX7QQt3srkDSy1AFoQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzODkzOCwiZXhwIjoxNzY1NDQzNzM4fQ.v5H8pYkQt46QmwEzHuXPY_jOVfT9H1AT8HgkFjWbPmY','2025-12-05 12:02:18','2025-12-11 12:02:18','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:02:18'),(49,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODM5MDA0LCJleHAiOjE3NjQ5MjU0MDR9.prkWobEqg6d-du5S6M-p2sPxZybGlZMzv4d9GmI02BE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDgzOTAwNCwiZXhwIjoxNzY1NDQzODA0fQ.NoljRbknGcqgdUk4FdaprGZ-cSLJepoFQILmkUPYIDQ','2025-12-05 12:03:24','2025-12-11 12:03:24','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:03:24'),(50,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTQ3MSwiZXhwIjoxNzY0OTI1ODcxfQ.92HTY4SNcfB5IS3G8CoNVmXMDdBxHwRCpP7WQWZVxok','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTQ3MSwiZXhwIjoxNzY1NDQ0MjcxfQ.0VpQ3mlX1ZvCPpwxPs30TdcXgZYzPD8o_diX7RAx6GE','2025-12-05 12:11:11','2025-12-11 12:11:11','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:11:11'),(51,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTU3OSwiZXhwIjoxNzY0OTI1OTc5fQ.8ugF-AqY9L7IuBlcU-1AJCO8WG8yy7I0FoHJpwzvGnI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTU3OSwiZXhwIjoxNzY1NDQ0Mzc5fQ.S_ANn5SY1rrJEDbauIMZtCTBgGkxZmYkA4DkwNVwhVY','2025-12-05 12:12:59','2025-12-11 12:12:59','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:12:59'),(52,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTU5NSwiZXhwIjoxNzY0OTI1OTk1fQ.M3sobwTQxPfgfGj9mIzinYj7LLUm_vmPt-_4a3FAnj0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTU5NSwiZXhwIjoxNzY1NDQ0Mzk1fQ.U6uuB6TF2adVhQkp2U-aumIwtqbAbV28aiUdPDTX9L8','2025-12-05 12:13:16','2025-12-11 12:13:16','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:13:15'),(53,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDgzOTY1MSwiZXhwIjoxNzY0OTI2MDUxfQ.bjGJf29YtF6-P_pxDDJZCsp7WH2CgMLZF6Jq8HLZ73Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDgzOTY1MSwiZXhwIjoxNzY1NDQ0NDUxfQ.UIz_U7LnQaT7_lM-9IeMl9nd1r7z2JeDsRHPEFM2cZA','2025-12-05 12:14:12','2025-12-11 12:14:12','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:14:11'),(54,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDAxMDYsImV4cCI6MTc2NDkyNjUwNn0.rjAhObWUeEKwPAzYSt1QmXTA4Ko5p15uqpK7rAT-ezU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0MDEwNiwiZXhwIjoxNzY1NDQ0OTA2fQ.QK7LsdpTp4b6DZPkhcu4eXz1DAdZ7MiZXEkAwWYWB1w','2025-12-05 12:21:46','2025-12-11 12:21:46','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:21:46'),(55,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MTMwMCwiZXhwIjoxNzY0OTI3NzAwfQ.7tQzYJyDicIhuUoG059sxodkXNq6RKKQ0GV83Ij8L44','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDg0MTMwMCwiZXhwIjoxNzY1NDQ2MTAwfQ.ZWY4E8lFid2tXXS862pS6a2VX7LfuGz6NZdbrTNb_os','2025-12-05 12:41:40','2025-12-11 12:41:40','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:41:40'),(56,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDEzODEsImV4cCI6MTc2NDkyNzc4MX0.YWvyg3pSkEyaA4SzC4pg9mXf1zhd29_TfttBzHuJU-c','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0MTM4MSwiZXhwIjoxNzY1NDQ2MTgxfQ.1iOtt8_c1P2-pDdzrfvky3h2gIzalHOrBNhMLnvwLJc','2025-12-05 12:43:02','2025-12-11 12:43:02','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 09:43:01'),(57,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MTQxOSwiZXhwIjoxNzY0OTI3ODE5fQ.EScojCYVMMobue9c7M9W_sCOYUk3vFoQ0g9jphy95Kw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MTQxOSwiZXhwIjoxNzY1NDQ2MjE5fQ.VQt77HIKIFlCNorVxPHN4bnb9RZ81eyCnIB6te0Vcio','2025-12-05 12:43:40','2025-12-11 12:43:40','192.168.87.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 09:43:39'),(58,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzU0OCwiZXhwIjoxNzY0OTI5OTQ4fQ.LX23N3P-Q2JuOGBnJaJ--0ulxgAoQhhawHWeC-Cla6Q','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzU0OCwiZXhwIjoxNzY1NDQ4MzQ4fQ.42LK6RnA2K9fgqgUvznhROfPdoYRTssHHZeXiELBzTg','2025-12-05 13:19:09','2025-12-11 13:19:09','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:19:08'),(59,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzYyNywiZXhwIjoxNzY0OTMwMDI3fQ.DEtBAOebELdtA7FN4Da3kOX3JRxLL99vanTff9Tvrxw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzYyNywiZXhwIjoxNzY1NDQ4NDI3fQ.Hp7ycr1Zp5VPjc6ZFwKFVyb8KJ5qBZ-Da3wM6DPuins','2025-12-05 13:20:28','2025-12-11 13:20:28','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:20:27'),(60,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQzNjkzLCJleHAiOjE3NjQ5MzAwOTN9.rf3eYfT0qddCQsmWSvu7W83rDNF_8VvJEGIltwDte5o','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg0MzY5MywiZXhwIjoxNzY1NDQ4NDkzfQ.nKdzBuYwOVFR3DxHiF93HZOjVl4UUcoUSNRz2KckkdU','2025-12-05 13:21:34','2025-12-11 13:21:34','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:21:33'),(61,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZGF0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhdGEiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0MzczMCwiZXhwIjoxNzY0OTMwMTMwfQ.NzbdkeSAY0mKJbj0VKcaVm72Sis3dkmz9hkbAelifsM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NDg0MzczMCwiZXhwIjoxNzY1NDQ4NTMwfQ.1B-8CQlDJjcfAgMO2lLN2GRN_Aoh04YPjHfLffLJuy8','2025-12-05 13:22:11','2025-12-11 13:22:11','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:22:10'),(62,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQ0NDYyLCJleHAiOjE3NjQ5MzA4NjJ9.67vLMN_K7KcWGQKZXpBRBVzMGzsdp0eJzUABnSxAZBY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDg0NDQ2MiwiZXhwIjoxNzY1NDQ5MjYyfQ.pbu4hPxU8oLN8mkVq3NANbjUsw43KoZhOCoXpJVKAD4','2025-12-05 13:34:22','2025-12-11 13:34:22','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:34:22'),(63,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjQ4NDQ0ODEsImV4cCI6MTc2NDkzMDg4MX0.YJ1IKbFwdY3SCaaJOsHjPRPnnqDiSc11SPQV7TZOYCs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NDg0NDQ4MSwiZXhwIjoxNzY1NDQ5MjgxfQ.fWg1FEujJdRrE1wRER0JDcAHmhZNclmnmaiz2gGUqB4','2025-12-05 13:34:42','2025-12-11 13:34:42','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:34:41'),(64,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODQ0NTE2LCJleHAiOjE3NjQ5MzA5MTZ9.Y5sf-CKmIM8_56318SY-pYMUG-NivrbgIEYECjY9ZDs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NDg0NDUxNiwiZXhwIjoxNzY1NDQ5MzE2fQ.xRdDSdQ7dypK1fo2CDFRs1t9nLgwhsOGPvMdKzhR00k','2025-12-05 13:35:17','2025-12-11 13:35:17','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 10:35:16'),(65,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NDg0NDU4NCwiZXhwIjoxNzY0OTMwOTg0fQ.GweubpFD9EiR6Ua2Z3q7WKIFHhcus_CVGwgxttEgYp8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NDg0NDU4NCwiZXhwIjoxNzY1NDQ5Mzg0fQ.E9hav2D3USllVjWngkYvqvdXWa4348A02tRRgu3xF84','2025-12-05 13:36:24','2025-12-11 13:36:24','192.168.100.93','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 10:36:24'),(66,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODcxOTc0LCJleHAiOjE3NjQ5NTgzNzR9.GqKLqn__-3no-DrOafeomyHCi0xpfIhFHXJMQyK5YCs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3MTk3NCwiZXhwIjoxNzY1NDc2Nzc0fQ.06lShfWu1F7SwBiKnIwnxXIP65Lyn5G8rvBKRUXuS6M','2025-12-05 21:12:55','2025-12-11 21:12:55','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 18:12:54'),(67,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY0ODc1Mzg0LCJleHAiOjE3NjQ5NjE3ODR9.S-Lmg1ubxyjbuU0gpKcKhQrOtIraYfal8cjUzPgzlTU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDg3NTM4NCwiZXhwIjoxNzY1NDgwMTg0fQ.fnvK-HthE8cC-Jj3kSa8FGyRVGz0m88QOZMHZosrmAY','2025-12-05 22:09:44','2025-12-11 22:09:44','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-04 19:09:44'),(68,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYmFzZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InJvbGUiLCJpc19zeXN0ZW1fYWRtaW4iOjAsImlhdCI6MTc2NTAwMTQ4MywiZXhwIjoxNzY1MDg3ODgzfQ.UxUZpQKO-dhHORgZiTjMXwVB-PIwmldh3JaQ8ibRWjs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc2NTAwMTQ4MywiZXhwIjoxNzY1NjA2MjgzfQ.FKZXDMCPxfbFxH6XPPlRFn5-LK7giwBW5JgaA6cQZPA','2025-12-07 09:11:24','2025-12-13 09:11:24','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 06:11:23'),(69,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDAyMjg0LCJleHAiOjE3NjUwODg2ODR9.vFCCMcvm9cuMog5o3ABDPlo2SiTWicV5Rod5wLIzyhU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwMjI4NCwiZXhwIjoxNzY1NjA3MDg0fQ.WZxRJBNi8sj9S4ihdkgW8U2tNqdmPVwFg2UWBupwro4','2025-12-07 09:24:45','2025-12-13 09:24:45','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 06:24:44'),(70,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMDQ1NTIsImV4cCI6MTc2NTA5MDk1Mn0.ojw_u2rbnhmqOgB0fAKy6pM_3Ig8cKfNQE83GQNYJcE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAwNDU1MiwiZXhwIjoxNzY1NjA5MzUyfQ.1bhiE6OZSEGGc8iqADySCbQV8TXBXq5_EalVVg6sGq8','2025-12-07 10:02:33','2025-12-13 10:02:33','192.168.100.5','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-06 07:02:32'),(71,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDA2MDM3LCJleHAiOjE3NjUwOTI0Mzd9.d4Lju_ZCksXqce9G2oDzhmeiBNlacxabpynwGv4Ha-g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAwNjAzNywiZXhwIjoxNzY1NjEwODM3fQ.FndwBYGN1mjRI6ClcZAhxmcRqvNzfNn_bxzlFquq3A8','2025-12-07 10:27:17','2025-12-13 10:27:17','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-06 07:27:17'),(72,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDMzMjU0LCJleHAiOjE3NjUxMTk2NTR9.Cml4S47XCHaw4JSxqf5N82ig8Ss4eO40ligObNxhPTA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzMzI1NCwiZXhwIjoxNzY1NjM4MDU0fQ.JmOmXDslLMvXiuaKmfNArGzHrNsM5MuomOqFgXQBY7M','2025-12-07 18:00:55','2025-12-13 18:00:55','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:00:54'),(73,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMzM2NzYsImV4cCI6MTc2NTEyMDA3Nn0.zT6pTmcLNRb1V3oP5KVUHBmSRcjuxG35BoP6hnAxqKY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAzMzY3NiwiZXhwIjoxNzY1NjM4NDc2fQ.vlH0S6M2FQ3y50m-Ct7fx1PreKnzSO0N-brFGBz3GDY','2025-12-07 18:07:56','2025-12-13 18:07:56','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:07:56'),(74,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGlyZWN0b3JAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkaXJlY3RvciIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDMzNzIyLCJleHAiOjE3NjUxMjAxMjJ9.YpHxGhHzXZOPZNteNscoNegu6wGy4axnnuo1_d4riUU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NTAzMzcyMiwiZXhwIjoxNzY1NjM4NTIyfQ.tuQ28jlFIQvgFYipvQ6busTXNfLHI_FAUSEbvXf9vm4','2025-12-07 18:08:42','2025-12-13 18:08:42','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:08:42'),(75,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM0MjkyLCJleHAiOjE3NjUxMjA2OTJ9.qV1xSxzQ11TlnXtKb4hyhSfJktdhRlElf80CYhehEc8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNDI5MiwiZXhwIjoxNzY1NjM5MDkyfQ.eCz97I8iNEFprkfUq_YzxHMheV3ae5I-3-fZkRfGNso','2025-12-07 18:18:12','2025-12-13 18:18:12','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:18:12'),(76,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUwMzUzNDcsImV4cCI6MTc2NTEyMTc0N30.Ma37oosGcZTUReSKx5YhinTHioVyKwe8nMiAVS_rrpM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTAzNTM0NywiZXhwIjoxNzY1NjQwMTQ3fQ.zEa4HR--rl1lmrMncPBMAEFOqIKwSpqKG5Ci9Xzz22U','2025-12-07 18:35:48','2025-12-13 18:35:48','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:35:47'),(77,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM1Nzg4LCJleHAiOjE3NjUxMjIxODh9.HJwlQ90sh6tywLeWQYReptIR3i_tGHzjP_eIrjmcyaY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzNTc4OCwiZXhwIjoxNzY1NjQwNTg4fQ.QNw38C_ZQXtfwcPc7LuiSqP1zkCPoHAtI6vaSOBtvRk','2025-12-07 18:43:09','2025-12-13 18:43:09','192.168.86.119','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-06 15:43:08'),(78,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MDM4MDYyLCJleHAiOjE3NjUxMjQ0NjJ9.3TSPfodr_jJi3yEr3O_lhnyE8xcQDLAs0aVKxVrpO-k','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTAzODA2MiwiZXhwIjoxNzY1NjQyODYyfQ.noSerFPWfI211ON8clwTFTN3Ga4bo3zk5F2W9kHfeEg','2025-12-07 19:21:02','2025-12-13 19:21:02','192.168.86.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-06 16:21:02'),(79,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjUxODgwLCJleHAiOjE3NjUzMzgyODB9.2qICfS7BqrVcAzkgPIjPx0i9hgZTkpD6qgrFRl1pxWg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1MTg4MCwiZXhwIjoxNzY1ODU2NjgwfQ.CYAZPMwKfB2endhwKHjYaA5EOHU5r1rfD527SX2MEFI','2025-12-10 06:44:40','2025-12-16 06:44:40','192.168.205.119','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',1,'2025-12-09 03:44:40'),(80,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjU1MjU0LCJleHAiOjE3NjUzNDE2NTR9.IgroyaTJFCtjVh3ae0Lq4qIoLyPUL8jtRxn0sbU-6mU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1NTI1NCwiZXhwIjoxNzY1ODYwMDU0fQ.gQg1VUU-bt_QgA2qXv15WrJi8x76zI5rNJBENRnGy9c','2025-12-10 07:40:54','2025-12-16 07:40:54','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:40:54'),(81,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1MjU1MzcxLCJleHAiOjE3NjUzNDE3NzF9.Yiolb5pzcITVM0_jewJDlHcCsNWnZud0RVpFdn4iKFU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTI1NTM3MSwiZXhwIjoxNzY1ODYwMTcxfQ.0hhrf3ZX41i1ortVslzVjVU57bwHvrGgn7vdxNFs4N0','2025-12-10 07:42:52','2025-12-16 07:42:52','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:42:51'),(82,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUyNTU5NDcsImV4cCI6MTc2NTM0MjM0N30.AlzWfXEgq6uWfWz26AFWTA3MvZB4HCjM2UUqJOKKv6o','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTI1NTk0NywiZXhwIjoxNzY1ODYwNzQ3fQ.zVeVPVHhxuTUiD_XthUJOQu9br4NADV0cW4-mu_FBBM','2025-12-10 07:52:27','2025-12-16 07:52:27','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:52:27'),(83,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjU2MjAzLCJleHAiOjE3NjUzNDI2MDN9.y-BzbgAAZDQiMZEzMCzJ-0nqMocrPEq8gUofivgXzC4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI1NjIwMywiZXhwIjoxNzY1ODYxMDAzfQ.PvtNQArupX6vl2hbYd7aPsd898ZrvBIhpqUlz6yDuRg','2025-12-10 07:56:44','2025-12-16 07:56:44','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:56:43'),(84,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoibW9kdWxldmlld2VyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibW9kdWxlIiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUyNTYzODUsImV4cCI6MTc2NTM0Mjc4NX0.zInsE7e7fRmBoSnpua5rwexyAaZoct2KNwcuF5nEitA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc2NTI1NjM4NSwiZXhwIjoxNzY1ODYxMTg1fQ.X9pb5t9BeZA_zmuC7XPwukTf4EJA7Tpy-7pwC_i7da4','2025-12-10 07:59:46','2025-12-16 07:59:46','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 04:59:45'),(85,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUyNTY1OTUsImV4cCI6MTc2NTM0Mjk5NX0.rfO-hzzyIMapeLM1NbxTT3NTIpwz2juCmwDCsalDaNI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTI1NjU5NSwiZXhwIjoxNzY1ODYxMzk1fQ.hwruHHynVGNp9g-Uty92BTc5kH1AGhNCH6G7uHltPC4','2025-12-10 08:03:16','2025-12-16 08:03:16','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 05:03:15'),(86,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjYwMTk2LCJleHAiOjE3NjUzNDY1OTZ9.PT_2xpTVHf-A4x34jOsA9XI5mcRth1ZfCkiYKCbS3Eg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI2MDE5NiwiZXhwIjoxNzY1ODY0OTk2fQ.Sfj85ME6P4fcxLXNTeMlkW1urTACce8SQattEqc7ZOo','2025-12-10 09:03:16','2025-12-16 09:03:16','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-09 06:03:16'),(87,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1MjY4MDg5LCJleHAiOjE3NjUzNTQ0ODl9.0qDiP3kydyE3yvOHmh-9dTW0LOf-nH9wED4fd2nHGAg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTI2ODA4OSwiZXhwIjoxNzY1ODcyODg5fQ.ylgWtSNj_m5zyH4ynfySkNkViFs2pD0ayH5jczjxCbc','2025-12-10 11:14:50','2025-12-16 11:14:50','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:14:49'),(88,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUyNjg0MTUsImV4cCI6MTc2NTM1NDgxNX0.z-Ehr9e6mOYDowxHgDmPfbgywSR9rposD5HVWlKkoik','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTI2ODQxNSwiZXhwIjoxNzY1ODczMjE1fQ._7SpAWD8NCAliNKSnyLRpRdwwdBDIC7dGgxXSt6fSds','2025-12-10 11:20:16','2025-12-16 11:20:16','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:20:15'),(89,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjY4NDUwLCJleHAiOjE3NjUzNTQ4NTB9.TxdPVoXRB4SXBnTZGpkaNow5YtHafcHk6npjojao6Eg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI2ODQ1MCwiZXhwIjoxNzY1ODczMjUwfQ.slertTVyC17af5YiNwb794MMi4LASH_xL3YH3M1DHIk','2025-12-10 11:20:50','2025-12-16 11:20:50','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:20:50'),(90,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjUyNjg2MTUsImV4cCI6MTc2NTM1NTAxNX0.-ICm5RkUsKrR46LQMpZF_nIuDapGLYi8zmuim7Amzxs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTI2ODYxNSwiZXhwIjoxNzY1ODczNDE1fQ.uNFs-E59dVL52lHfVbQUX93s3S303i4nU8-qXyhLw9I','2025-12-10 11:23:36','2025-12-16 11:23:36','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:23:35'),(91,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MjcwNTk2LCJleHAiOjE3NjUzNTY5OTZ9.gM_ciK1w-EJErbWi0kNA0pHsQVaB5mQU1aZgsBBPjaw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTI3MDU5NiwiZXhwIjoxNzY1ODc1Mzk2fQ.S_g6gmP4AS7CmebCaREb-MIoJ4d40FqmZGjcUFmo2QI','2025-12-10 11:56:37','2025-12-16 11:56:37','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-09 08:56:36'),(92,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MzEwNDk4LCJleHAiOjE3NjUzOTY4OTh9.y9NYi9KrdhpELP9Up6RCGY_l74AslT2o49E-TbQ_ibQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTMxMDQ5OCwiZXhwIjoxNzY1OTE1Mjk4fQ.rbW38jmZeDojHywGHMGBSbOY64bPg7ECNvC08VmYGUU','2025-12-10 23:01:39','2025-12-16 23:01:39','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-09 20:01:38'),(93,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1MzQwMjYwLCJleHAiOjE3NjU0MjY2NjB9.z3tvzxde-69cmQ0qQSy7TxYYJ_fHsRzS8PZMnNStSuQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTM0MDI2MCwiZXhwIjoxNzY1OTQ1MDYwfQ.gyUVMx79YhgXGhcYP1UXyQ6KwtA1QPsDH1-WH1qEfiE','2025-12-11 07:17:41','2025-12-17 07:17:41','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-10 04:17:40'),(94,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1MzQwNTMyLCJleHAiOjE3NjU0MjY5MzJ9._mRLQC_JcxQQJ6_dDNE6g0hTsj2GOCuSB6W7EBP7Phc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTM0MDUzMiwiZXhwIjoxNzY1OTQ1MzMyfQ.j4f60WboMbe-xBVizV8TXlGBvWv7oeQaPamjt1wbVpY','2025-12-11 07:22:13','2025-12-17 07:22:13','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-10 04:22:12'),(95,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDMwMjY3LCJleHAiOjE3NjU1MTY2Njd9.RaikBRifT7TaHPrny6PIdMyS1vIqgYN4Y2uKfK9cu9U','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQzMDI2NywiZXhwIjoxNzY2MDM1MDY3fQ.X0zo_d4j31s-ulFtDY_LQOjfvWjkFEUG0BcthwyeM9E','2025-12-12 08:17:48','2025-12-18 08:17:48','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 05:17:47'),(96,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxNzg1LCJleHAiOjE3NjU1MjgxODV9.LtAdMEc9fGNNEjPlLetGAp5KWCUfrUZFbxsLweynuMg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTc4NSwiZXhwIjoxNzY2MDQ2NTg1fQ.77wmLvuXgF1GY1_Labco07nfOT8U4-IX7AfGqiD-Rms','2025-12-12 11:29:45','2025-12-18 11:29:45','192.168.100.4','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',0,'2025-12-11 08:29:45'),(97,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxODIyLCJleHAiOjE3NjU1MjgyMjJ9.dWS7pu6H4I6n48Ungqo24zA6AbDxMyN6FqMdFCUnDqg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTgyMiwiZXhwIjoxNzY2MDQ2NjIyfQ.B4l70ngK0BQuT2AbO-CvpXvPR1_NsW6FrxHK_SmGUNg','2025-12-12 11:30:23','2025-12-18 11:30:23','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-11 08:30:22'),(98,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQxODYxLCJleHAiOjE3NjU1MjgyNjF9.9wm0Su-NzvHHsHydVkJHGynZa3KyUog9wCFPmrpL_ak','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MTg2MSwiZXhwIjoxNzY2MDQ2NjYxfQ.zNdoFbxKeNcLU4NjX-uN8PV-1RAyhzWmQi1EM8LrpAo','2025-12-12 11:31:01','2025-12-18 11:31:01','192.168.100.4','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',1,'2025-12-11 08:31:01'),(99,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQyMjIxLCJleHAiOjE3NjU1Mjg2MjF9.HqcaJOaaHBJrcqRb63A6vFqJ6DMlV2a7bBI43jQwGJU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0MjIyMSwiZXhwIjoxNzY2MDQ3MDIxfQ.GwoeQxaRanXCBgdTMUVlDn8oN140u2Os7SNx59PtarI','2025-12-12 11:37:02','2025-12-18 11:37:02','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 08:37:01'),(100,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU0NDk0MjEsImV4cCI6MTc2NTUzNTgyMX0.xublREvHSLs4wEcNYfi8EUF3w11ko9s4r6pdz6WnXm8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTQ0OTQyMSwiZXhwIjoxNzY2MDU0MjIxfQ.4iRXeePy_jMJuz18VC1m9PNICNYE-8B0hFHuPEGSeq0','2025-12-12 13:37:01','2025-12-18 13:37:01','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 10:37:01'),(101,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoibW9kdWxldmlld2VyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibW9kdWxlIiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU0NDk0NTYsImV4cCI6MTc2NTUzNTg1Nn0.s2yH0bM_RY6CQ5ncmDd1xP1P6DdFlnh9jrceG2n0mI4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc2NTQ0OTQ1NiwiZXhwIjoxNzY2MDU0MjU2fQ.mV_wtFsE5XnF8R44GiTbZrbmWTzFnH26Jb74KIYozE0','2025-12-12 13:37:37','2025-12-18 13:37:37','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 10:37:36'),(102,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDQ5NTIxLCJleHAiOjE3NjU1MzU5MjF9.-XmANsDERsn-hBd-fNnzBZFJ8kEY3pijWkI7AA5iXFQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0OTUyMSwiZXhwIjoxNzY2MDU0MzIxfQ.88pZD1n6YmNdScEmrDuQ5L4IEeLCcjndclRC4i9gRdI','2025-12-12 13:38:41','2025-12-18 13:38:41','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-11 10:38:41'),(103,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU0NTA5MDYsImV4cCI6MTc2NTUzNzMwNn0.2dA444waidd4LK3Yt6veGaKLYUgKrHXBg-37-pszUHg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTQ1MDkwNiwiZXhwIjoxNzY2MDU1NzA2fQ.SId5KVPq7uGS0R4gPg3Tpo81xB27jk0q8HKn4Rqayj0','2025-12-12 14:01:46','2025-12-18 14:01:46','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-12-11 11:01:46'),(104,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NDc1MDU3LCJleHAiOjE3NjU1NjE0NTd9.utKqntRaJukoH5iCuLwQkgHYrgB9tmK5RVgSDyel0Z8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ3NTA1NywiZXhwIjoxNzY2MDc5ODU3fQ.PDuS2KF7pHp3ULGImnzABoAGbjnyuXtFtuFt1ylHWj8','2025-12-12 20:44:18','2025-12-18 20:44:18','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-11 17:44:17'),(105,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjAzODk5LCJleHAiOjE3NjU2OTAyOTl9.qgw16leDhVMRmzscnXiFX8yow_AND2lCQLHYEgTP06E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYwMzg5OSwiZXhwIjoxNzY2MjA4Njk5fQ.6TAfoxLw-j7_hY9oqAW01KbxJq00ICR1EQgiWvWq57I','2025-12-14 08:31:39','2025-12-20 08:31:39','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-13 05:31:39'),(106,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjEwOTUyLCJleHAiOjE3NjU2OTczNTJ9.cVuuUQh17zRw1j34EQFbY26uXfCJwvRr17OPQi6u2uw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxMDk1MiwiZXhwIjoxNzY2MjE1NzUyfQ.oE3TLiZJAsqxQaZEL2jBuacBfBIC9qBCa3I5RBUeeT4','2025-12-14 10:29:12','2025-12-20 10:29:12','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 07:29:12'),(107,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU2MTE3NjAsImV4cCI6MTc2NTY5ODE2MH0.jqr8fJHtUTPeosz7ZYdmaqM7L_cVZ-ipXf3WF4arVvc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTYxMTc2MCwiZXhwIjoxNzY2MjE2NTYwfQ.vZjMVMD0_gQZ9aiQ-RTQVXQX-2FjwLT5ePj_QU-XvRo','2025-12-14 10:42:40','2025-12-20 10:42:40','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 07:42:40'),(108,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjE0MDc2LCJleHAiOjE3NjU3MDA0NzZ9.01t9PXcf5paE0kOtVPkxsR6NghG0mlrqcWWBWvua7QE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxNDA3NiwiZXhwIjoxNzY2MjE4ODc2fQ.JXi2FxRTnaNOL57chDwij03LR6w7jS7RymU1f_T6uZE','2025-12-14 11:21:16','2025-12-20 11:21:16','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 08:21:16'),(109,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1NjE0MjA5LCJleHAiOjE3NjU3MDA2MDl9.CKRLDzP8HXxcqgKRhsJJ1VQsbwUtrnelB2aQzsG02pI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTYxNDIwOSwiZXhwIjoxNzY2MjE5MDA5fQ.hsFOuOURJnU_zVYE2YljKdX5KbZLlGm7-r7BWpbSirY','2025-12-14 11:23:30','2025-12-20 11:23:30','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 08:23:29'),(110,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU2MTU2NjgsImV4cCI6MTc2NTcwMjA2OH0.C2cowwnWOvtf3uZVfhpPs4PSKq_mYLxAQUhn-oeph8Y','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTYxNTY2OCwiZXhwIjoxNzY2MjIwNDY4fQ.kXzZa9K7bIKMgbGRsuZdgDUTjDxEgrcO6PBBf57ifRI','2025-12-14 11:47:48','2025-12-20 11:47:48','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-13 08:47:48'),(111,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1Nzk2MjcxLCJleHAiOjE3NjU4ODI2NzF9.gbLomLOsI3tdCauket_X2Je3RXc_O5nNzDvcY0ApOFU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTc5NjI3MSwiZXhwIjoxNzY2NDAxMDcxfQ.wdlJBAHDkkLoXrbkjYGSQ5LwiaK1n5cq0ZgcNyelEGk','2025-12-16 13:57:52','2025-12-22 13:57:52','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-15 10:57:51'),(112,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODE4NzAzLCJleHAiOjE3NjU5MDUxMDN9.8sJiAn-Hh--aDjv31bdbZtPM0DAHhCA6MpwV6qkARzs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTgxODcwMywiZXhwIjoxNzY2NDIzNTAzfQ.CKCX1Mau5c6U2SwKpwkRcJGVwKKKZxJPsFoWhdrIOBY','2025-12-16 20:11:43','2025-12-22 20:11:43','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:11:43'),(113,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGlubmV0QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGlubmV0IiwiaXNfc3lzdGVtX2FkbWluIjowLCJpYXQiOjE3NjU4MjA4ODgsImV4cCI6MTc2NTkwNzI4OH0.hDYcoF7x_-gJbTn4NO886DzRNeZBoS19t-hMjYF6xtE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2NTgyMDg4OCwiZXhwIjoxNzY2NDI1Njg4fQ.uYh14wkcOXICM_bUyGbGTb3_K7pioGRf6yRSH_sQd-k','2025-12-16 20:48:08','2025-12-22 20:48:08','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:48:08'),(114,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1ODIwOTUwLCJleHAiOjE3NjU5MDczNTB9.HnE671ilmgsA1HkFRtm81uGGEryB0bajtwo77p_Ugjo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTgyMDk1MCwiZXhwIjoxNzY2NDI1NzUwfQ.60yw1WtJGVM-__S8Q1HRFUUs65vOeGhkFt8dExemmg0','2025-12-16 20:49:10','2025-12-22 20:49:10','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:49:10'),(115,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODIxMjIzLCJleHAiOjE3NjU5MDc2MjN9.teJxPNVFXEwHDN3H0B5DofJPHU8Vi2tFfuWv03k79H4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTgyMTIyMywiZXhwIjoxNzY2NDI2MDIzfQ.h7tGd_Z-K4BVmZlOEQdmTa9u7fCgFQusjGBaAaUzAUc','2025-12-16 20:53:43','2025-12-22 20:53:43','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',0,'2025-12-15 17:53:43'),(116,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1ODIxNDI2LCJleHAiOjE3NjU5MDc4MjZ9.fkG9RiIRTQdGBvXBeiGaE4MkfTiN4YCgg4S1JU9sKEA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTgyMTQyNiwiZXhwIjoxNzY2NDI2MjI2fQ.-yt_VoyjrXQz3_oiNyiJIFd8DaMV1HoFXNqZDD1B_hs','2025-12-16 20:57:06','2025-12-22 20:57:06','192.168.100.9','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36',1,'2025-12-15 17:57:06'),(117,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1ODIzMTU1LCJleHAiOjE3NjU5MDk1NTV9.aCOwpHsZ_QnaxUFUbjNEhIdfEaiXQO1eRU3ZCKSvlgw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTgyMzE1NSwiZXhwIjoxNzY2NDI3OTU1fQ.ogvAMZt6doxtTe2gqFuFTj52sZQPtATycY2YrgNFY7s','2025-12-16 21:25:56','2025-12-22 21:25:56','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-15 18:25:55'),(118,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYXBwcm92ZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJBcHByb3ZlciIsImlzX3N5c3RlbV9hZG1pbiI6MCwiaWF0IjoxNzY1ODIzNDkyLCJleHAiOjE3NjU5MDk4OTJ9.9d3UjT3LRoKV9j94DwYEiz1N1PzY-XvvjD28DpN6NHE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NTgyMzQ5MiwiZXhwIjoxNzY2NDI4MjkyfQ.ZyMrl5GR6i4wIy0jmEBrbLnypk5e6mPbc0hg4EJ7Wvk','2025-12-16 21:31:32','2025-12-22 21:31:32','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',0,'2025-12-15 18:31:32'),(119,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODY2MzEwLCJleHAiOjE3NjU5NTI3MTB9.ZXM1JX2uqh71FgQoIuUu2IZUloNWwPIvvHW0e4fnDmo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTg2NjMxMCwiZXhwIjoxNzY2NDcxMTEwfQ.ctFo_qOWahnc6wg3f8SFMy31pA7IOYh_FqvfxmKhITs','2025-12-17 09:25:11','2025-12-23 09:25:11','192.168.100.4','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',0,'2025-12-16 06:25:10'),(120,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzX3N5c3RlbV9hZG1pbiI6MSwiaWF0IjoxNzY1ODY4OTU5LCJleHAiOjE3NjU5NTUzNTl9.nWQPBwBTa7UbuXpbFBXi0uOlsMslvrt3l82LIkck2bk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTg2ODk1OSwiZXhwIjoxNzY2NDczNzU5fQ.wZ_WXzO9XlKdifVC34S8W1sPzNViEP8spS7CQBmoT6U','2025-12-17 10:09:19','2025-12-23 10:09:19','192.168.100.4','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',1,'2025-12-16 07:09:19');
--
-- Table structure for table "users"
--
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "id" SERIAL,
  "clickup_user_id" VARCHAR(50)  DEFAULT NULL,
  "username" VARCHAR(100)  NOT NULL,
  "email" VARCHAR(255)  NOT NULL,
  "password_hash" VARCHAR(255)  DEFAULT NULL,
  "full_name" VARCHAR(255)  DEFAULT NULL,
  "profile_picture" VARCHAR(500)  DEFAULT NULL,
  "role" VARCHAR(100)  DEFAULT 'field_officer',
  "assigned_programs" JSONB DEFAULT NULL,
  "is_active" BOOLEAN DEFAULT '1',
  "is_system_admin" BOOLEAN DEFAULT '0',
  "sync_status" VARCHAR(100)  DEFAULT 'pending',
  "last_synced_at" TIMESTAMP DEFAULT NULL,
  "last_login_at" TIMESTAMP DEFAULT NULL,
  "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "users"
--
INSERT INTO "users" VALUES (1,NULL,'admin','admin@gmail.com','$2a$10$KdsBLq.abN5f1C6xGHoz9OAJ6SGL4D2IWrRYcZe.rhI3JyY.4vkfS','System Administrator',NULL,'admin',NULL,1,1,'pending',NULL,'2025-12-16 10:09:19','2025-12-02 04:48:26','2025-12-16 07:09:19',NULL),(2,NULL,'director','director@gmail.com','$2a$10$cW7xFdTMcMZq2OBLZ0dipuFS0Yw..qH15IWRQkCyCaCTZqkpF412u','me director',NULL,'field_officer',NULL,1,1,'pending',NULL,'2025-12-06 18:08:42','2025-12-02 14:08:57','2025-12-06 15:08:42',NULL),(3,NULL,'Data','data@gmail.com','$2a$10$vNqTLFPEfzfpbsJ.SjdtiuDk5erJGYv7H4gD9LxKpV2zmpWbEsacS','Data Entry Clerk',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-04 13:22:10','2025-12-02 17:10:24','2025-12-04 10:22:10',NULL),(4,NULL,'role','base@gmail.com','$2a$10$mfdo/ED13yKaJPiArJWESuzJWQJ5vZRTukl5vclC1sbSuwWHBc2CW','base',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-06 09:11:23','2025-12-02 17:50:55','2025-12-06 06:11:23',NULL),(5,NULL,'Linnet','linnet@gmail.com','$2a$10$2UmuVkjIH6nXuZhp1CQb7.p5FZlBjiKqNNtURNai3hXt4hY3l5LsC','Linnet Linnet',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-15 20:48:08','2025-12-03 18:48:51','2025-12-15 17:48:08',NULL),(6,NULL,'Approver','approver@gmail.com','$2a$10$WEyB/HNunHv2yjX/D53z1OZVfxcbF0nmj9MXcLDGnxZy8BbQoopti','Approver Approver ',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-15 21:31:32','2025-12-09 04:42:42','2025-12-15 18:31:32',NULL),(7,NULL,'module','moduleviewer@gmail.com','$2a$10$HBxD6T4kO4Jg/0niyKyNyeWZ/n1hLQu6a.vsvhJmx3ZRPCa0v/ZSW','Module Viewer',NULL,'field_officer',NULL,1,0,'pending',NULL,'2025-12-11 13:37:36','2025-12-09 04:59:15','2025-12-11 10:37:36',NULL);
--
-- Temporary view structure for view "v_indicators_with_latest"
--
DROP TABLE IF EXISTS "v_indicators_with_latest";
SET @saved_cs_client     = @@character_set_client;
 1 AS "id",
 1 AS "program_id",
 1 AS "project_id",
 1 AS "activity_id",
 1 AS "name",
 1 AS "code",
 1 AS "description",
 1 AS "type",
 1 AS "category",
 1 AS "unit_of_measure",
 1 AS "baseline_value",
 1 AS "target_value",
 1 AS "current_value",
 1 AS "collection_frequency",
 1 AS "data_source",
 1 AS "verification_method",
 1 AS "disaggregation",
 1 AS "clickup_custom_field_id",
 1 AS "is_active",
 1 AS "created_at",
 1 AS "updated_at",
 1 AS "module_id",
 1 AS "sub_program_id",
 1 AS "component_id",
 1 AS "baseline_date",
 1 AS "target_date",
 1 AS "last_measured_date",
 1 AS "next_measurement_date",
 1 AS "status",
 1 AS "achievement_percentage",
 1 AS "responsible_person",
 1 AS "notes",
 1 AS "deleted_at",
 1 AS "latest_value",
 1 AS "latest_measurement_date",
 1 AS "progress_percentage"*/;
SET character_set_client = @saved_cs_client;
--
-- Temporary view structure for view "v_results_chain_detailed"
--
DROP TABLE IF EXISTS "v_results_chain_detailed";
SET @saved_cs_client     = @@character_set_client;
 1 AS "id",
 1 AS "from_entity_type",
 1 AS "from_entity_id",
 1 AS "to_entity_type",
 1 AS "to_entity_id",
 1 AS "contribution_description",
 1 AS "contribution_weight",
 1 AS "notes",
 1 AS "created_at",
 1 AS "updated_at",
 1 AS "created_by",
 1 AS "from_entity_name",
 1 AS "to_entity_name"*/;
SET character_set_client = @saved_cs_client;
--
-- Table structure for table "webhook_events"
--
DROP TABLE IF EXISTS "webhook_events";
CREATE TABLE "webhook_events" (
  "id" SERIAL,
  "webhook_id" VARCHAR(100)  NOT NULL,
  "event_type" VARCHAR(100)  NOT NULL,
  "entity_type" VARCHAR(50)  DEFAULT NULL,
  "clickup_entity_id" VARCHAR(50)  DEFAULT NULL,
  "payload" JSONB DEFAULT NULL,
  "processed" BOOLEAN DEFAULT '0',
  "processed_at" TIMESTAMP DEFAULT NULL,
  "processing_error" TEXT ,
  "received_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

--
-- Dumping data for table "webhook_events"
--
--
-- Final view structure for view "v_indicators_with_latest"
--
--
-- Final view structure for view "v_results_chain_detailed"
--
-- Dump completed on 2025-12-16 16:26:53