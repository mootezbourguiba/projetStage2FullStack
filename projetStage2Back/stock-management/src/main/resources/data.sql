-- Ce script est exécuté au démarrage pour créer un utilisateur admin par défaut.
-- Le mot de passe simple correspondant à ce hash est 'admin123'.

-- On vide la table pour garantir qu'on repart de zéro à chaque redémarrage.
TRUNCATE TABLE _user;

-- On insère l'utilisateur admin avec l'ID 1 et le bon mot de passe haché.
INSERT INTO _user (id, name, email, password, role)
VALUES (1, 'Admin Esprim', 'admin@esprim.com', '$2a$10$Nn/RnjL0Y5rR6ZbkDSUb5O6MoLNwF0QTRBjlAIWnINOw.pXNvI9j2', 'ADMIN');