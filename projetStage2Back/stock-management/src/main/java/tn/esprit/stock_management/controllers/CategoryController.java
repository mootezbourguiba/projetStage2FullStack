// src/main/java/tn/esprit/stock_management/controllers/CategoryController.java

package tn.esprit.stock_management.controllers;

// NOUVEAU: Import des DTOs
import tn.esprit.stock_management.dto.CategoryRequest;
import tn.esprit.stock_management.dto.CategoryResponse;
import tn.esprit.stock_management.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
// Il est recommandé d'avoir une configuration CORS globale, mais si vous en avez besoin ici, décommentez-la.
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // --- MODIFIÉ ---
    // GET /api/categories -> Renvoie une liste de DTOs sécurisés, pas les entités complètes
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // --- MODIFIÉ ---
    // POST /api/categories -> Reçoit un DTO simple et renvoie le DTO de la catégorie créée
    @PostMapping
    public CategoryResponse createCategory(@RequestBody CategoryRequest request) {
        // Le service gère la logique de création à partir du DTO
        return categoryService.saveCategory(request);
    }

    // --- MODIFIÉ ---
    // PUT /api/categories/{id} -> Reçoit un DTO et l'ID, puis renvoie le DTO de la catégorie mise à jour
    @PutMapping("/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        // Le service gère la logique de mise à jour
        return categoryService.updateCategory(id, request);
    }

    // --- INCHANGÉ (Déjà correct) ---
    // DELETE /api/categories/{id} -> Supprimer une catégorie
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build(); // Renvoie une réponse 204 No Content (succès)
    }
}