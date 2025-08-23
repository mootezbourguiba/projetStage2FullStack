-- Ce script est exécuté au démarrage pour créer ou mettre à jour l'utilisateur admin par défaut.

-- D'abord, on supprime l'utilisateur admin s'il existe déjà pour éviter les duplications.
-- C'est plus sûr que TRUNCATE car ça ne pose pas de problème avec les clés étrangères.
DELETE FROM _user WHERE email = 'admin@esprim.com';

-- Ensuite, on insère l'utilisateur admin avec un ID fixe et un mot de passe haché VALIDE.
-- Remplacez la ligne ci-dessous par le hash que vous avez généré avec PasswordGenerator.java
INSERT INTO _user (id, name, email, password, role)
VALUES (1, 'Admin Esprim', 'admin@esprim.com', '$2a$10$AbCdEfGhIjKlMnOpQrStU.AbCdEfGhIjKlMnOpQrStUAbCdEfG', 'ADMIN');