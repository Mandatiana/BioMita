-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20260707.3e756d69dd
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 13, 2026 at 07:46 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `biomita`
--

-- --------------------------------------------------------

--
-- Table structure for table `aires_protegees`
--

CREATE TABLE `aires_protegees` (
  `id` int NOT NULL,
  `nom` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `localisation` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tarif_ticket` decimal(10,2) NOT NULL,
  `tarif_guide` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `especes`
--

CREATE TABLE `especes` (
  `id` int NOT NULL,
  `nom` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `nom_scientifique` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `population` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int NOT NULL,
  `type_incident` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `localisation` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `statut` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'signale',
  `aire_id` int NOT NULL,
  `agent_id` int NOT NULL,
  `date_incident` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `observations`
--

CREATE TABLE `observations` (
  `id` int NOT NULL,
  `nombre_observe` int NOT NULL,
  `localisation` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `commentaire` text COLLATE utf8mb4_general_ci,
  `espece_id` int NOT NULL,
  `aire_id` int NOT NULL,
  `agent_id` int NOT NULL,
  `date_observation` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visites`
--

CREATE TABLE `visites` (
  `id` int NOT NULL,
  `representant_nom` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `cin_passeport` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `nationalite` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre_visiteurs` int NOT NULL,
  `aire_id` int NOT NULL,
  `agent_id` int NOT NULL,
  `montant_total` decimal(10,2) NOT NULL,
  `date_visite` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aires_protegees`
--
ALTER TABLE `aires_protegees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `especes`
--
ALTER TABLE `especes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidents_aire_id_foreign` (`aire_id`),
  ADD KEY `incidents_agent_id_foreign` (`agent_id`);

--
-- Indexes for table `observations`
--
ALTER TABLE `observations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `observations_aire_id_foreign` (`aire_id`),
  ADD KEY `observations_agent_id_foreign` (`agent_id`),
  ADD KEY `observations_espece_id_foreign` (`espece_id`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visites`
--
ALTER TABLE `visites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `visites_aire_id_foreign` (`aire_id`),
  ADD KEY `visites_agent_id_foreign` (`agent_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aires_protegees`
--
ALTER TABLE `aires_protegees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `especes`
--
ALTER TABLE `especes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `observations`
--
ALTER TABLE `observations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visites`
--
ALTER TABLE `visites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_aire_id_foreign` FOREIGN KEY (`aire_id`) REFERENCES `aires_protegees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `observations`
--
ALTER TABLE `observations`
  ADD CONSTRAINT `observations_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `observations_aire_id_foreign` FOREIGN KEY (`aire_id`) REFERENCES `aires_protegees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `observations_espece_id_foreign` FOREIGN KEY (`espece_id`) REFERENCES `especes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `visites`
--
ALTER TABLE `visites`
  ADD CONSTRAINT `visites_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `visites_aire_id_foreign` FOREIGN KEY (`aire_id`) REFERENCES `aires_protegees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
