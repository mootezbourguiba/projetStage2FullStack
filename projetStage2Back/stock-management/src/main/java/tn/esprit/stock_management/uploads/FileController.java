// src/main/java/tn/esprit/stock_management/controllers/FileController.java

package tn.esprit.stock_management.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.stock_management.services.FileStorageService;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        // Initialise le dossier si ce n'est pas déjà fait
        storageService.init();

        // Sauvegarde le fichier et récupère son nom unique
        String filename = storageService.save(file);

        // Crée l'URL complète pour accéder au fichier
        String url = "/uploads/" + filename; // On verra comment servir ces fichiers plus tard

        // Renvoie l'URL au front-end
        return ResponseEntity.ok(Map.of("url", url));
    }
}