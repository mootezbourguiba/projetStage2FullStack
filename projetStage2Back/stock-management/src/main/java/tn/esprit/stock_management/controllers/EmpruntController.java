// src/main/java/tn/esprit/stock_management/controllers/EmpruntController.java
package tn.esprit.stock_management.controllers;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.stock_management.entities.Emprunt;
import tn.esprit.stock_management.services.EmpruntService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/emprunts")
@CrossOrigin(origins = "http://localhost:5173")
public class EmpruntController {

    @Autowired
    private EmpruntService empruntService;

    @GetMapping
    public List<Emprunt> getAllEmprunts() {
        return empruntService.getAllEmprunts();
    }

    @PostMapping
    public Emprunt createEmprunt(@RequestBody EmpruntRequestDTO empruntRequest) {
        return empruntService.createEmprunt(empruntRequest);
    }

    @PutMapping("/{id}/retour")
    public Emprunt returnEmprunt(@PathVariable Long id) {
        return empruntService.returnEmprunt(id);
    }

    // Le DTO peut rester ici ou être déplacé dans un fichier séparé
    @Data
    public static class EmpruntRequestDTO {
        public Long productId;
        public String nomEmprunteur;
        public int quantite = 1; // Quantité par défaut à 1
        public LocalDate dateRetourPrevue;
        public String notes;
    }
}