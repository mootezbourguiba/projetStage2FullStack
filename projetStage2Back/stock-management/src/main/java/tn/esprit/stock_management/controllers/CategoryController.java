// src/main/java/com/esprim/stockmanagement/controllers/CategoryController.java

package tn.esprit.stock_management.controllers;

import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
// @CrossOrigin(origins = "*") // Plus nécessaire grâce à la config globale
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // GET /api/categories -> Récupérer toutes les catégories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // POST /api/categories -> Créer une nouvelle catégorie
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    // --- NOUVEAU: Endpoint pour PUT /api/categories/{id} -> Modifier une catégorie ---
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        Category updatedCategory = categoryService.updateCategory(id, categoryDetails);
        return ResponseEntity.ok(updatedCategory);
    }

    // --- NOUVEAU: Endpoint pour DELETE /api/categories/{id} -> Supprimer une catégorie ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build(); // Renvoie une réponse 204 No Content (succès)
    }
}