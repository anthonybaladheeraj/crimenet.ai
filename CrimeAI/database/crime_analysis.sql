-- MySQL dump 10.13  Distrib 26.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: crime_analysis
-- ------------------------------------------------------
-- Server version	26.7.0

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
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cases`
--

DROP TABLE IF EXISTS `cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cases` (
  `case_id` int NOT NULL AUTO_INCREMENT,
  `crime_type` varchar(100) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `description` text,
  `severity` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`case_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `cases_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cases`
--

LOCK TABLES `cases` WRITE;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
INSERT INTO `cases` VALUES (1,'Theft','2026-01-12','20:30:00',1,'A mobile phone and wallet were stolen from a customer inside a crowded shopping area.','Medium','Under Investigation'),(2,'Theft','2026-01-25','19:45:00',2,'A smartphone was stolen from a person near a restaurant parking area.','Medium','Closed'),(3,'Theft','2026-02-08','21:10:00',4,'A laptop bag containing electronic equipment was stolen from a parked vehicle.','Medium','Under Investigation'),(4,'Theft','2026-02-20','18:30:00',1,'A wallet and mobile phone were reported missing after the victim visited a busy market.','Low','Closed'),(5,'Robbery','2026-03-03','22:15:00',3,'Two masked individuals threatened a shop employee with a knife and took cash.','High','Under Investigation'),(6,'Robbery','2026-03-15','21:40:00',5,'Two individuals on a motorcycle threatened a pedestrian and stole a mobile phone and wallet.','High','Under Investigation'),(7,'Robbery','2026-04-02','23:05:00',7,'Two suspects entered a small store at night and escaped with cash and electronic items.','High','Open'),(8,'Robbery','2026-04-18','20:50:00',3,'Two suspects wearing helmets threatened a shop owner and escaped with cash on a motorcycle.','High','Under Investigation'),(9,'Burglary','2026-05-04','02:30:00',6,'A residential house was entered during the night through a rear window. Jewellery and electronics were stolen.','High','Under Investigation'),(10,'Burglary','2026-05-17','03:15:00',9,'Unknown individuals entered a house at night and stole electronic devices and jewellery.','High','Open'),(11,'Burglary','2026-06-01','01:50:00',10,'A locked apartment was broken into during the early morning hours. A laptop and valuables were taken.','High','Under Investigation'),(12,'Assault','2026-06-10','19:20:00',4,'An argument between two individuals resulted in a physical assault outside a commercial building.','Medium','Closed'),(13,'Assault','2026-06-22','22:00:00',8,'A person was assaulted after an argument near a public parking area. A witness reported the incident.','Medium','Under Investigation'),(14,'Assault','2026-07-05','20:10:00',5,'Two individuals were involved in a fight outside a restaurant. One person suffered minor injuries.','Medium','Closed'),(15,'Vehicle Theft','2026-07-12','23:30:00',2,'A black motorcycle was stolen from outside an apartment complex during the night.','High','Under Investigation'),(16,'Vehicle Theft','2026-07-20','22:45:00',6,'A red motorcycle was stolen from a parking area. CCTV footage captured a suspect near the vehicle.','High','Under Investigation'),(17,'Vehicle Theft','2026-08-03','01:20:00',7,'A motorcycle was stolen from outside a residential building during the early morning.','High','Open'),(18,'Cybercrime','2026-08-10','14:30:00',2,'A victim received a fraudulent message and transferred money to an unknown online account.','High','Under Investigation'),(19,'Cybercrime','2026-08-18','16:45:00',6,'A victim reported an online payment fraud after receiving a fake customer support call.','High','Under Investigation'),(20,'Cybercrime','2026-08-25','11:20:00',8,'An individual reported unauthorized transactions after responding to a fraudulent banking message.','High','Open');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidence`
--

DROP TABLE IF EXISTS `evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence` (
  `evidence_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `description` text,
  `file_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`evidence_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `evidence_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence`
--

LOCK TABLES `evidence` WRITE;
/*!40000 ALTER TABLE `evidence` DISABLE KEYS */;
INSERT INTO `evidence` VALUES (1,1,'CCTV','CCTV footage from shopping area','case01_cctv.mp4'),(2,1,'Fingerprint','Fingerprint found near counter','case01_fingerprint.jpg'),(3,2,'CCTV','Parking area CCTV footage','case02_cctv.mp4'),(4,3,'Fingerprint','Fingerprint recovered from vehicle','case03_fingerprint.jpg'),(5,3,'CCTV','Parking area CCTV recording','case03_cctv.mp4'),(6,4,'CCTV','Market CCTV footage','case04_cctv.mp4'),(7,5,'CCTV','Shop security camera footage','case05_cctv.mp4'),(8,5,'Weapon','Recovered knife','case05_weapon.jpg'),(9,6,'CCTV','Roadside CCTV footage','case06_cctv.mp4'),(10,7,'CCTV','Store CCTV footage','case07_cctv.mp4'),(11,8,'CCTV','Shop CCTV footage showing suspects','case08_cctv.mp4'),(12,8,'Weapon','Recovered knife','case08_weapon.jpg'),(13,9,'Fingerprint','Fingerprint found near window','case09_fingerprint.jpg'),(14,9,'CCTV','Residential area CCTV footage','case09_cctv.mp4'),(15,10,'Fingerprint','Fingerprint recovered from entry point','case10_fingerprint.jpg'),(16,11,'Fingerprint','Fingerprint found near apartment entrance','case11_fingerprint.jpg'),(17,12,'CCTV','Commercial building CCTV footage','case12_cctv.mp4'),(18,13,'Witness Statement','Statement recorded from eyewitness','case13_statement.txt'),(19,14,'CCTV','Restaurant area CCTV footage','case14_cctv.mp4'),(20,15,'CCTV','Apartment parking CCTV footage','case15_cctv.mp4'),(21,16,'CCTV','Parking area CCTV footage','case16_cctv.mp4'),(22,17,'CCTV','Residential building CCTV footage','case17_cctv.mp4'),(23,18,'Digital Record','Fraudulent message and transaction record','case18_transaction.pdf'),(24,19,'Call Record','Fake customer support call details','case19_call.txt'),(25,20,'Digital Record','Unauthorized transaction records','case20_transaction.pdf');
/*!40000 ALTER TABLE `evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Banjara Hills','Hyderabad',17.4156000,78.4347000),(2,'Madhapur','Hyderabad',17.4483000,78.3915000),(3,'Kukatpally','Hyderabad',17.4849000,78.4138000),(4,'Ameerpet','Hyderabad',17.4375000,78.4483000),(5,'Secunderabad','Hyderabad',17.4399000,78.4983000),(6,'Gachibowli','Hyderabad',17.4401000,78.3489000),(7,'Dilsukhnagar','Hyderabad',17.3688000,78.5247000),(8,'Abids','Hyderabad',17.3919000,78.4760000),(9,'Mehdipatnam','Hyderabad',17.3954000,78.4411000),(10,'Begumpet','Hyderabad',17.4435000,78.4582000),(11,'Banjara Hills','Hyderabad',17.4156000,78.4347000),(12,'Madhapur','Hyderabad',17.4483000,78.3915000),(13,'Kukatpally','Hyderabad',17.4849000,78.4138000),(14,'Ameerpet','Hyderabad',17.4375000,78.4483000),(15,'Secunderabad','Hyderabad',17.4399000,78.4983000),(16,'Gachibowli','Hyderabad',17.4401000,78.3489000),(17,'Dilsukhnagar','Hyderabad',17.3688000,78.5247000),(18,'Abids','Hyderabad',17.3919000,78.4760000),(19,'Mehdipatnam','Hyderabad',17.3954000,78.4411000),(20,'Begumpet','Hyderabad',17.4435000,78.4582000);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `person_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `name_alias` varchar(100) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`person_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `persons_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES (1,1,'Person_A1','Suspect'),(2,1,'Person_A2','Victim'),(3,2,'Person_B1','Suspect'),(4,2,'Person_B2','Victim'),(5,3,'Person_C1','Suspect'),(6,3,'Person_C2','Victim'),(7,4,'Person_D1','Suspect'),(8,4,'Person_D2','Victim'),(9,5,'Person_E1','Suspect'),(10,5,'Person_E2','Suspect'),(11,5,'Person_E3','Victim'),(12,6,'Person_F1','Suspect'),(13,6,'Person_F2','Suspect'),(14,6,'Person_F3','Victim'),(15,7,'Person_G1','Suspect'),(16,7,'Person_G2','Suspect'),(17,7,'Person_G3','Victim'),(18,8,'Person_H1','Suspect'),(19,8,'Person_H2','Suspect'),(20,8,'Person_H3','Victim'),(21,9,'Person_I1','Suspect'),(22,9,'Person_I2','Victim'),(23,10,'Person_J1','Suspect'),(24,10,'Person_J2','Victim'),(25,11,'Person_K1','Suspect'),(26,11,'Person_K2','Victim'),(27,12,'Person_L1','Suspect'),(28,12,'Person_L2','Victim'),(29,13,'Person_M1','Suspect'),(30,13,'Person_M2','Victim'),(31,14,'Person_N1','Suspect'),(32,14,'Person_N2','Victim'),(33,15,'Person_O1','Suspect'),(34,15,'Person_O2','Victim'),(35,16,'Person_P1','Suspect'),(36,16,'Person_P2','Victim'),(37,17,'Person_Q1','Suspect'),(38,17,'Person_Q2','Victim'),(39,18,'Person_R1','Suspect'),(40,18,'Person_R2','Victim'),(41,19,'Person_S1','Suspect'),(42,19,'Person_S2','Victim'),(43,20,'Person_T1','Suspect'),(44,20,'Person_T2','Victim');
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin01','demo_hash_admin','Admin'),(2,'officer01','demo_hash_officer','Officer'),(3,'analyst01','demo_hash_analyst','Analyst');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `vehicle_type` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `registration` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,3,'Car','Hyundai i20','White','DEMO-003'),(2,5,'Motorcycle','Honda Shine','Black','DEMO-005'),(3,6,'Motorcycle','Bajaj Pulsar','Black','DEMO-006'),(4,7,'Motorcycle','TVS Apache','Red','DEMO-007'),(5,8,'Motorcycle','Bajaj Pulsar','Black','DEMO-008'),(6,9,'Car','Maruti Swift','White','DEMO-009'),(7,10,'Car','Hyundai i20','Silver','DEMO-010'),(8,11,'Car','Maruti Baleno','White','DEMO-011'),(9,15,'Motorcycle','Honda Shine','Black','DEMO-015'),(10,16,'Motorcycle','Bajaj Pulsar','Red','DEMO-016'),(11,17,'Motorcycle','TVS Apache','Black','DEMO-017');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weapons`
--

DROP TABLE IF EXISTS `weapons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weapons` (
  `weapon_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `weapon_type` varchar(100) DEFAULT NULL,
  `description` text,
  `recovered` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`weapon_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `weapons_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapons`
--

LOCK TABLES `weapons` WRITE;
/*!40000 ALTER TABLE `weapons` DISABLE KEYS */;
INSERT INTO `weapons` VALUES (1,5,'Knife','Small folding knife reported during shop robbery',1),(2,6,'Knife','Knife used to threaten the victim',0),(3,7,'Metal Rod','Metal rod reportedly used during the incident',0),(4,8,'Knife','Knife used to threaten shop owner',1),(5,12,'None','No weapon reported',0),(6,13,'None','No weapon reported',0),(7,14,'None','No weapon reported',0);
/*!40000 ALTER TABLE `weapons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `witnesses`
--

DROP TABLE IF EXISTS `witnesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `witnesses` (
  `witness_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `name_alias` varchar(100) DEFAULT NULL,
  `statement` text,
  PRIMARY KEY (`witness_id`),
  KEY `case_id` (`case_id`),
  CONSTRAINT `witnesses_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `witnesses`
--

LOCK TABLES `witnesses` WRITE;
/*!40000 ALTER TABLE `witnesses` DISABLE KEYS */;
INSERT INTO `witnesses` VALUES (1,1,'Witness_01','Witness reported seeing a person near the victim before the theft.'),(2,2,'Witness_02','Witness noticed a suspicious person near the parking area.'),(3,3,'Witness_03','Security guard reported seeing a person near the parked vehicle.'),(4,4,'Witness_04','Market visitor reported noticing suspicious activity.'),(5,5,'Witness_05','Shop employee reported that two masked suspects entered the store.'),(6,6,'Witness_06','Pedestrian reported seeing two suspects on a motorcycle.'),(7,7,'Witness_07','Nearby shop employee heard the suspects threatening the victim.'),(8,8,'Witness_08','Shop employee reported seeing two helmet-wearing suspects.'),(9,9,'Witness_09','Neighbour reported suspicious movement near the house during the night.'),(10,10,'Witness_10','Neighbour reported hearing movement during early morning hours.'),(11,11,'Witness_11','Security guard reported suspicious activity near the apartment.'),(12,12,'Witness_12','Employee reported seeing the argument before the assault.'),(13,13,'Witness_13','Eyewitness described the individuals involved in the fight.'),(14,14,'Witness_14','Restaurant employee reported seeing the physical fight.'),(15,15,'Witness_15','Security guard reported seeing a motorcycle near the parking area.'),(16,16,'Witness_16','CCTV operator reported suspicious activity near the stolen motorcycle.'),(17,17,'Witness_17','Neighbour reported hearing a motorcycle leaving the area.'),(18,18,'Witness_18','Victim provided details of the fraudulent message.'),(19,19,'Witness_19','Victim described the fake customer support call.'),(20,20,'Witness_20','Victim reported unauthorized banking transactions.');
/*!40000 ALTER TABLE `witnesses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 15:42:24
