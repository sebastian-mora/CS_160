-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: 10.0.0.219    Database: cs160
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `email` varchar(100) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `userid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('seb@dev.com','Sebastian','Mora','asd',2),('jeff@dev.com','Jeff','Person','asd',3),('asd','dev-test',NULL,'asd',4);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtasks`
--

DROP TABLE IF EXISTS `subtasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subtasks` (
  `subtask_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `task_id` int NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`subtask_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtasks`
--

LOCK TABLES `subtasks` WRITE;
/*!40000 ALTER TABLE `subtasks` DISABLE KEYS */;
INSERT INTO `subtasks` VALUES (1,'Stay outside for 30mins',50,'open'),(2,'Go watch some dogs',50,'open'),(3,'Walk 1 mile',50,'open');
/*!40000 ALTER TABLE `subtasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_due` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `priority` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `userid` int NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (30,'2020-05-02 18:23:05','2020-05-12','Take out the trash','Take out the the trash for garbage pick up on Friday','high','open','personal',2),(31,'2020-05-08 18:23:05','2020-05-12','Do Math HW','Do math HW on my mathlab','medium','open','school',2),(32,'2020-05-02 18:23:05','2020-05-12','Send email to client','Send marketing emails','low','open','work',2),(33,'2020-05-10 18:23:05','2020-05-13','Mops the floors','Mop the floors in the house','low','open','personal',3),(34,'2020-05-11 18:23:05','2020-05-20','Email professor','Ask professor for an A','high','open','school',3),(35,'2020-05-15 18:23:05','2020-06-03','Complete excel sheet','Finish creating the formuals','medium','open','work',3),(36,'2020-05-17 18:23:05','2020-06-05','Buy a new phone charager','Phone charger broke again','medium','open','personal',3),(37,'2020-05-23 18:23:05','2020-06-05','Get Milk from the store','Go to the store and get milk','high','open','personal',3),(38,'2020-05-27 18:23:05','2020-07-03','Pick up kids from school','Kids are off at 3pm','low','open','personal',3),(39,'2020-06-02 18:23:05','2020-06-10','Mow the lawn','The front lawn is a way to long','medium','open','work',3),(40,'2020-06-08 18:23:05','2020-06-11','Complete essay','Almosts done need 200 words','high','open','school',3),(41,'2020-06-09 18:23:05','2020-06-10','Email class mates','Follow up on group progress','low','open','work',3),(42,'2020-06-10 18:23:05','2020-06-19','Club meeting ','CS club meeting 3pm','medium','open','school',3),(43,'2020-06-13 18:23:05','2020-07-02','Soccer','Practive 7pm','low','open','school',3),(44,'2020-06-15 18:23:05','2020-07-08','Go for a run','Need to get in better shape','low','open','personal',3),(45,'2020-06-20 18:23:05','2020-07-10','Check savings','How are we doing on money','high','open','personal',2),(46,'2020-06-22 18:23:05','2020-07-15','File for taxes','Taxes are comming up soon','medium','open','work',2),(47,'2020-06-22 18:23:05','2020-07-10','Get face mask','Need this for COVID','high','open','personal',2),(48,'2020-06-24 18:23:05','2020-07-10','Shop for clothes','Looking a bit raggy could use some new clothes','high','open','personal',2),(49,'2020-07-02 18:23:05','2020-08-01','Get new shoes','Shoes are worn out as well','medium','open','personal',2),(50,'2020-07-02 18:23:05','2020-08-08','Go for a walk','Get some fresh air','medium','open','personal',2),(51,'2020-07-05 18:23:05','2020-08-10','Attend meeting','Need to have a standup with team','low','open','work',2),(52,'2020-07-02 18:23:05','2020-08-13','Get a new desk','Get a stand up desk from IT','medium','open','work',2),(53,'2020-08-02 18:23:05','2020-08-20','Move offices','Move stuff into the new office','high','open','work',2);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'cs160'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-05  0:46:39