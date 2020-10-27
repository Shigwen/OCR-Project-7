-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 27, 2020 at 07:31 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `groupomania_social_network`
--

-- --------------------------------------------------------

--
-- Table structure for table `discussions`
--

DROP TABLE IF EXISTS `discussions`;
CREATE TABLE IF NOT EXISTS `discussions` (
  `id` bigint(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` smallint(1) UNSIGNED NOT NULL,
  `first_message_id` bigint(1) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `discussions`
--

INSERT INTO `discussions` (`id`, `creation_date`, `user_id`, `first_message_id`, `title`) VALUES
(7, '2020-10-26 21:50:34', 3, 6, 'Voici la recette des fameux muffins à la banane que j\'avais amenés jeudi dernier !'),
(8, '2020-10-27 02:54:09', 3, 8, 'Vidéo d\'animaux trop marrants !'),
(9, '2020-10-27 03:03:59', 4, 10, 'Quelle musique mettez-vous pour vous détendre ?');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` smallint(1) NOT NULL AUTO_INCREMENT,
  `creation_date` datetime NOT NULL,
  `user_id` smallint(1) NOT NULL,
  `message_id` smallint(1) NOT NULL,
  `value` smallint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` smallint(1) UNSIGNED NOT NULL,
  `discussion_id` bigint(1) UNSIGNED DEFAULT NULL,
  `content` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `creation_date`, `user_id`, `discussion_id`, `content`) VALUES
(1, '2020-10-24 23:41:43', 3, 3, 'Test 1234'),
(2, '2020-10-24 23:44:47', 3, 4, 'Test 1234'),
(3, '2020-10-25 01:19:38', 3, 5, 'Banane 1234'),
(4, '2020-10-25 19:04:43', 3, 4, 'test 1234 mouton'),
(5, '2020-10-25 20:40:49', 3, 6, 'PonyPonyPonyPonyPonyPonyPonyPonyPonyPony'),
(6, '2020-10-26 21:50:34', 3, 7, 'Ecraser les bananes. Ajouter le sucre et l\'oeuf légèrement battu. Ajouter le beurre fondu, puis les ingrédients secs (farine, levure, bicarbonate). \r\n\r\nPlacer dans des moules à muffin.\r\n\r\nCuire à 190°C pendant 20 min. \r\n\r\nDéguster avec modération ;)'),
(7, '2020-10-27 01:34:00', 3, 7, 'Je peux vous proposer une version à la cerise si vous préférez ! :)'),
(8, '2020-10-27 02:54:09', 3, 8, 'https://www.youtube.com/watch?v=z6EchXyieos'),
(9, '2020-10-27 03:02:51', 4, 7, 'Je confirme qu\'ils sont délicieux !'),
(10, '2020-10-27 03:03:59', 4, 9, 'Voici mon mix préféré !\r\n\r\nhttps://www.youtube.com/watch?v=TDcJJYY5sms&t=5654s'),
(11, '2020-10-27 03:04:10', 4, 8, 'Haha, énorme !'),
(12, '2020-10-27 20:06:29', 3, 8, 'Test');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` smallint(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  `salt` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `job` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `creation_date`, `email`, `salt`, `hash`, `firstname`, `lastname`, `job`, `admin`) VALUES
(3, '2020-10-24 22:14:56', 'michael.donati@hotmail.com', 'ee9962125d659e10f6b6f2c74600a4328b32954c174bc8a25b9f74baf50ad855', 'ece0db38889438cbea493cac16994cfe4ec115e2e066006d47cc3465f4d819b5', 'Michael', 'Donati', 'Expert Comptable', 0),
(4, '2020-10-26 17:58:34', '1d1vf351fdv1@outlook.com', 'b6bd66e90ad48a8d5cb12ac2e53815d4df8fdecc1cf704a627393d491bda20d1', 'c533d21874c1aeb2b6f99713f18b2e687fea4cf850094bbb08ba23e3aee77109', 'Jean', 'Dupont', 'Chef de projet', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
