// src/main/java/tn/esprit/stock_management/services/FileStorageService.java

package tn.esprit.stock_management.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // Le chemin où nous allons sauvegarder les images.
    // Créez ce dossier manuellement à la racine de votre projet backend.
    private final Path root = Paths.get("uploads");

    // Initialise le dossier de sauvegarde au démarrage
    public void init() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    // La méthode principale pour sauvegarder un fichier
    public String save(MultipartFile file) {
        try {
            // Génère un nom de fichier unique pour éviter les conflits
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Copie le fichier dans le dossier 'uploads'
            Files.copy(file.getInputStream(), this.root.resolve(uniqueFilename));

            // Retourne le nom unique du fichier pour le sauvegarder en base de données
            return uniqueFilename;

        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}