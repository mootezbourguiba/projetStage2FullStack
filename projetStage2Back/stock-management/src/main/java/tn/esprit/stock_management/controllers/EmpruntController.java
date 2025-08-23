package tn.esprit.stock_management.controllers;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.stock_management.entities.Emprunt;
import tn.esprit.stock_management.entities.Product;
import tn.esprit.stock_management.entities.StatutEmprunt;
import tn.esprit.stock_management.repositories.EmpruntRepository;
import tn.esprit.stock_management.repositories.ProductRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/emprunts")
@CrossOrigin(origins = "http://localhost:5174") // Assurez-vous que le port est correct
public class EmpruntController {

    private final EmpruntRepository empruntRepository;
    private final ProductRepository productRepository;

    public EmpruntController(EmpruntRepository empruntRepository, ProductRepository productRepository) {
        this.empruntRepository = empruntRepository;
        this.productRepository = productRepository;
    }

    // Obtenir tous les emprunts
    @GetMapping
    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    // Créer un nouvel emprunt
    @PostMapping
    public ResponseEntity<Emprunt> createEmprunt(@RequestBody EmpruntRequestDTO empruntRequest) {
        Optional<Product> productOpt = productRepository.findById(empruntRequest.getProductId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Produit non trouvé
        }
        Product product = productOpt.get();

        // Vérifier si le stock est suffisant
        if (product.getCurrentStock() < empruntRequest.getQuantite()) {
            return ResponseEntity.status(409).build(); // 409 Conflict: stock insuffisant
        }

        // 1. Mettre à jour le stock du produit
        product.setCurrentStock(product.getCurrentStock() - empruntRequest.getQuantite());
        productRepository.save(product);

        // 2. Créer l'emprunt
        Emprunt nouvelEmprunt = new Emprunt();
        nouvelEmprunt.setProduct(product);
        nouvelEmprunt.setNomEmprunteur(empruntRequest.getNomEmprunteur());
        nouvelEmprunt.setQuantite(empruntRequest.getQuantite());
        nouvelEmprunt.setDateEmprunt(LocalDate.now());
        nouvelEmprunt.setDateRetourPrevue(empruntRequest.getDateRetourPrevue());
        nouvelEmprunt.setStatut(StatutEmprunt.EN_COURS);
        nouvelEmprunt.setNotes(empruntRequest.getNotes());

        return ResponseEntity.ok(empruntRepository.save(nouvelEmprunt));
    }

    // Marquer un emprunt comme retourné
    @PutMapping("/{id}/retour")
    public ResponseEntity<Emprunt> returnEmprunt(@PathVariable Long id) {
        Optional<Emprunt> empruntOpt = empruntRepository.findById(id);
        if (empruntOpt.isEmpty() || empruntOpt.get().getStatut() == StatutEmprunt.RETOURNE) {
            return ResponseEntity.notFound().build(); // Emprunt non trouvé ou déjà retourné
        }

        Emprunt emprunt = empruntOpt.get();
        Product product = emprunt.getProduct();

        // 1. Mettre à jour le stock (le produit revient)
        product.setCurrentStock(product.getCurrentStock() + emprunt.getQuantite());
        productRepository.save(product);

        // 2. Mettre à jour l'emprunt
        emprunt.setStatut(StatutEmprunt.RETOURNE);
        emprunt.setDateRetourReelle(LocalDate.now());

        return ResponseEntity.ok(empruntRepository.save(emprunt));
    }

    // DTO pour la création d'emprunt
    // Vous pouvez créer une classe séparée pour cela
    @Data
    public static class EmpruntRequestDTO {
        public Long productId;
        public String nomEmprunteur;
        public int quantite;
        public LocalDate dateRetourPrevue;
        public String notes;

        // Getters et setters...
    }
    // Dans la classe EmpruntController

// ... (Les méthodes existantes : getAllEmprunts, createEmprunt, returnEmprunt) ...

    // --- AJOUTER CETTE MÉTHODE POUR MODIFIER UN EMPRUNT ---
    @PutMapping("/{id}")
    public ResponseEntity<Emprunt> updateEmprunt(@PathVariable Long id, @RequestBody EmpruntRequestDTO empruntRequest) {
        Optional<Emprunt> empruntOpt = empruntRepository.findById(id);
        if (empruntOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Note : On ne modifie pas le produit ou la quantité ici pour garder la logique simple.
        // On pourrait ajouter des contrôles plus complexes si nécessaire.
        Emprunt empruntAModifier = empruntOpt.get();
        empruntAModifier.setNomEmprunteur(empruntRequest.getNomEmprunteur());
        empruntAModifier.setDateRetourPrevue(empruntRequest.getDateRetourPrevue());
        empruntAModifier.setNotes(empruntRequest.getNotes());

        return ResponseEntity.ok(empruntRepository.save(empruntAModifier));
    }

    // --- AJOUTER CETTE MÉTHODE POUR SUPPRIMER UN EMPRUNT ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmprunt(@PathVariable Long id) {
        Optional<Emprunt> empruntOpt = empruntRepository.findById(id);
        if (empruntOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Emprunt empruntASupprimer = empruntOpt.get();

        // LOGIQUE CRUCIALE : Si on supprime un emprunt qui était "EN_COURS",
        // il faut restituer la quantité au stock du produit !
        if (empruntASupprimer.getStatut() == StatutEmprunt.EN_COURS) {
            Product product = empruntASupprimer.getProduct();
            product.setCurrentStock(product.getCurrentStock() + empruntASupprimer.getQuantite());
            productRepository.save(product);
        }

        empruntRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Standard pour une suppression réussie
    }
}