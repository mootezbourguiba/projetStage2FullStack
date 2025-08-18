-- Ce script est exécuté au démarrage pour créer un utilisateur admin par défaut.
-- Le mot de passe simple correspondant à ce hash est 'admin123'.

-- On supprime l'utilisateur avec l'ID 1 s'il existe pour garantir une insertion propre,
-- puis on réinitialise l'auto-incrémentation.
TRUNCATE TABLE _user;

-- On insère le nouvel utilisateur avec l'ID 1.
INSERT INTO _user (id, name, email, password, role)
VALUES (1, 'Admin Esprim', 'admin@esprim.com', '$2a$10$3zZ.N/uV5yvA6.WlG13hU.kK257/2iY8u.X.A5p.m3bQc8s9t.9tG', 'ADMIN');