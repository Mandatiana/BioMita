-- ============================================================
-- BIO MITA - Données de test (INSERT uniquement)
-- Basé EXACTEMENT sur la structure fournie (biomita.sql)
-- Aucune modification de structure : pas de CREATE TABLE ici.
-- Import : mysql -u root -p biomita < bio_mita_data.sql
-- (à exécuter APRES avoir importé le fichier de structure)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Vider les tables avant réinsertion (optionnel, décommente si besoin)
-- ------------------------------------------------------------
-- TRUNCATE TABLE incidents;
-- TRUNCATE TABLE observations;
-- TRUNCATE TABLE visites;
-- TRUNCATE TABLE especes;
-- TRUNCATE TABLE aires_protegees;
-- TRUNCATE TABLE utilisateurs;

-- ============================================================
-- utilisateurs
-- Colonnes : id, nom, password, role, created_at
-- Mot de passe de test (hash bcrypt factice) pour tous : "password123"
-- Remplace par un vrai hash via password_hash() côté PHP avant usage réel.
-- ============================================================
INSERT INTO `utilisateurs` (`id`, `nom`, `password`, `role`, `created_at`) VALUES
(1, 'Jean Rakoto', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-20 08:00:00'),
(2, 'Marie Rasoa', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-20 08:05:00'),
(3, 'Tovo Andriamampianina', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-21 09:00:00'),
(4, 'Hery Razafindrakoto', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-21 09:15:00'),
(5, 'Nirina Rabemananjara', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-22 07:30:00'),
(6, 'Fanja Rakotonirina', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'agent', '2026-05-22 07:45:00'),
(7, 'Solofo Randriamanantena', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'responsable', '2026-05-15 08:00:00'),
(8, 'Lalao Ravelojaona', '$2y$10$Q7bJ9k1E3nQ6h0v3ZzM6Ke1nX0y4wq3h1jv7QO0mYVh3fSkzq0f2G', 'responsable', '2026-05-15 08:10:00');

-- ============================================================
-- aires_protegees
-- Colonnes : id, nom, localisation, tarif_ticket, tarif_guide
-- ============================================================
INSERT INTO `aires_protegees` (`id`, `nom`, `localisation`, `tarif_ticket`, `tarif_guide`) VALUES
(1, 'Parc National Andasibe-Mantadia', 'Alaotra-Mangoro, Madagascar', 65000.00, 50000.00),
(2, 'Parc National Ranomafana', 'Haute Matsiatra, Madagascar', 65000.00, 50000.00),
(3, 'Parc National Isalo', 'Ihorombe, Madagascar', 65000.00, 50000.00),
(4, 'Réserve Spéciale Ankarafantsika', 'Boeny, Madagascar', 55000.00, 45000.00),
(5, 'Parc National Masoala', 'Sava, Madagascar', 65000.00, 55000.00),
(6, 'Parc National Marojejy', 'Sava, Madagascar', 65000.00, 55000.00),
(7, 'Parc National Zombitse-Vohibasia', 'Atsimo-Andrefana, Madagascar', 55000.00, 45000.00),
(8, 'Réserve Spéciale Montagne d''Ambre', 'Diana, Madagascar', 55000.00, 45000.00),
(9, 'Parc National Tsingy de Bemaraha', 'Melaky, Madagascar', 65000.00, 55000.00),
(10, 'Réserve Forestière Kirindy', 'Menabe, Madagascar', 40000.00, 35000.00);

-- ============================================================
-- especes
-- Colonnes : id, nom, nom_scientifique, population
-- (population = estimation approximative du nombre d'individus restants)
-- ============================================================
INSERT INTO `especes` (`id`, `nom`, `nom_scientifique`, `population`) VALUES
(1, 'Indri', 'Indri indri', 10000),
(2, 'Maki catta', 'Lemur catta', 2500),
(3, 'Sifaka de Verreaux', 'Propithecus verreauxi', 47000),
(4, 'Lémur brun commun', 'Eulemur fulvus', 100000),
(5, 'Microcèbe roux', 'Microcebus rufus', 50000),
(6, 'Sifaka soyeux', 'Propithecus candidus', 250),
(7, 'Caméléon panthère', 'Furcifer pardalis', 200000),
(8, 'Caméléon de Parson', 'Calumma parsonii', 15000),
(9, 'Brookesia micra', 'Brookesia micra', 30000),
(10, 'Gecko feuille satanique', 'Uroplatus phantasticus', 20000),
(11, 'Boa de Madagascar', 'Acrantophis madagascariensis', 8000),
(12, 'Coua bleu', 'Coua caerulea', 40000),
(13, 'Vanga écorcheur', 'Vanga curvirostris', 60000),
(14, 'Ibis huppé de Madagascar', 'Lophotibis cristata', 12000),
(15, 'Fossa', 'Cryptoprocta ferox', 2500),
(16, 'Grenouille tomate', 'Dyscophus antongilii', 18000);

-- ============================================================
-- visites
-- Colonnes : id, representant_nom, cin_passeport, nationalite,
--            nombre_visiteurs, aire_id, agent_id, montant_total, date_visite
-- ============================================================
INSERT INTO `visites` (`id`, `representant_nom`, `cin_passeport`, `nationalite`, `nombre_visiteurs`, `aire_id`, `agent_id`, `montant_total`, `date_visite`) VALUES
(1, 'Herizo Randria', '301021012345', 'Malgache', 4, 1, 1, 310000.00, '2026-06-02 08:15:00'),
(2, 'Sophie Dubois', 'P1234567', 'Française', 2, 1, 1, 180000.00, '2026-06-03 09:30:00'),
(3, 'John Miller', 'P9876543', 'Américaine', 3, 2, 2, 245000.00, '2026-06-04 10:00:00'),
(4, 'Andry Rakoto', '301031023456', 'Malgache', 6, 2, 2, 440000.00, '2026-06-05 07:45:00'),
(5, 'Laura Meier', 'P4561237', 'Suisse', 2, 3, 3, 180000.00, '2026-06-06 11:20:00'),
(6, 'Marco Rossi', 'P7418529', 'Italienne', 5, 4, 4, 320000.00, '2026-06-07 08:00:00'),
(7, 'Voahangy Rasolofo', '301041034567', 'Malgache', 3, 5, 5, 250000.00, '2026-06-08 09:00:00'),
(8, 'Emma Johnson', 'P3692581', 'Britannique', 4, 9, 6, 315000.00, '2026-06-09 13:10:00'),
(9, 'Tahina Rabe', '301051045678', 'Malgache', 1, 1, 1, 115000.00, '2026-06-10 08:30:00'),
(10, 'Chen Wei', 'P1597534', 'Chinoise', 2, 3, 3, 180000.00, '2026-06-11 10:15:00');

-- ============================================================
-- observations
-- Colonnes : id, nombre_observe, localisation, commentaire,
--            espece_id, aire_id, agent_id, date_observation
-- ============================================================
INSERT INTO `observations` (`id`, `nombre_observe`, `localisation`, `commentaire`, `espece_id`, `aire_id`, `agent_id`, `date_observation`) VALUES
(1, 2, 'Circuit Indri', 'Groupe familial entendu chantant tôt le matin.', 1, 1, 1, '2026-06-02 07:00:00'),
(2, 5, 'Circuit Indri', 'Groupe actif dans la canopée.', 4, 1, 1, '2026-06-03 08:00:00'),
(3, 3, 'Sentier Varibolo', 'Observation nocturne, individus timides.', 5, 2, 2, '2026-06-04 19:30:00'),
(4, 1, 'Sentier Varibolo', 'Caméléon adulte de belle taille sur une branche basse.', 8, 2, 2, '2026-06-05 14:00:00'),
(5, 8, 'Canyon des makis', 'Groupe habitué aux visiteurs, proche du sentier.', 2, 3, 3, '2026-06-06 09:00:00'),
(6, 2, 'Canyon des makis', 'Deux individus observés en vol.', 12, 3, 3, '2026-06-06 09:45:00'),
(7, 4, 'Zone sèche nord', 'Sifakas observés sautant entre les arbres.', 3, 4, 4, '2026-06-07 10:30:00'),
(8, 1, 'Lisière forestière', 'Trace et observation directe furtive, très rare.', 15, 5, 5, '2026-06-08 06:15:00'),
(9, 1, 'Sentier tsingy', 'Individu minuscule repéré sur une feuille morte.', 9, 9, 6, '2026-06-09 15:00:00'),
(10, 3, 'Circuit Indri', 'Plusieurs individus aux couleurs vives.', 7, 1, 1, '2026-06-10 11:00:00'),
(11, 2, 'Canyon des makis', 'Espèce rare, observation exceptionnelle.', 6, 3, 3, '2026-06-11 08:50:00');

-- ============================================================
-- incidents
-- Colonnes : id, type_incident, localisation, description,
--            statut, aire_id, agent_id, date_incident
-- ============================================================
INSERT INTO `incidents` (`id`, `type_incident`, `localisation`, `description`, `statut`, `aire_id`, `agent_id`, `date_incident`) VALUES
(1, 'deforestation', 'Zone périphérique nord', 'Défrichement suspect détecté en bordure du parc.', 'en_cours', 1, 1, '2026-06-03 16:00:00'),
(2, 'braconnage', 'Secteur sud', 'Traces de pièges à lémuriens découvertes par une équipe de patrouille.', 'signale', 2, 2, '2026-06-05 12:30:00'),
(3, 'feu_de_brousse', 'Limite ouest de la réserve', 'Départ de feu maîtrisé rapidement par les agents locaux.', 'resolu', 4, 4, '2026-06-06 15:45:00'),
(4, 'braconnage', 'Zone côtière', 'Signalement de pêche illégale dans la zone marine protégée.', 'en_cours', 5, 5, '2026-06-08 09:20:00'),
(5, 'pollution', 'Point d''eau principal', 'Déchets plastiques laissés par des visiteurs près des piscines naturelles.', 'resolu', 3, 3, '2026-06-09 10:00:00'),
(6, 'deforestation', 'Accès sud des tsingy', 'Coupe de bois illégale signalée par la population locale.', 'signale', 9, 6, '2026-06-11 07:30:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Fin du script
-- ============================================================
