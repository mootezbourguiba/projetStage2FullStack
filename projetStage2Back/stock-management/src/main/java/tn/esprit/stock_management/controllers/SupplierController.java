// src/main/java/tn/esprit/stock_management/controllers/SupplierController.java
package tn.esprit.stock_management.controllers;

import tn.esprit.stock_management.dto.SupplierRequest; // Utilise le DTO
import tn.esprit.stock_management.entities.Supplier;
import tn.esprit.stock_management.services.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
// SUPPRIMÉ : @CrossOrigin car géré globalement par SecurityConfig
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // Renvoie la liste complète des fournisseurs (pour l'affichage)
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    // Renvoie un fournisseur spécifique
    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id);
    }

    // Reçoit un DTO pour créer le fournisseur
    @PostMapping
    public Supplier createSupplier(@RequestBody SupplierRequest request) {
        return supplierService.saveSupplier(request);
    }

    // Reçoit un DTO pour mettre à jour le fournisseur
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody SupplierRequest request) {
        request.setId(id); // S'assure que l'ID est bien présent dans la requête
        return supplierService.saveSupplier(request);
    }

    // La suppression reste identique
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}