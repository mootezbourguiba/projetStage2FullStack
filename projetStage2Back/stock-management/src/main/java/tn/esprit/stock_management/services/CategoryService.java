// src/main/java/tn/esprit/stock_management/services/CategoryService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.dto.CategoryRequest;   // <-- Importer les DTOs
import tn.esprit.stock_management.dto.CategoryResponse;  // <-- Importer les DTOs
import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.repositories.CategoryRepository;
import tn.esprit.stock_management.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    // Méthode privée pour convertir une entité Category en DTO CategoryResponse
    private CategoryResponse toCategoryResponse(Category category) {
        CategoryResponse dto = new CategoryResponse();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }

    // --- CORRECTION POUR L'ERREUR 1 ---
    // Cette méthode renvoie maintenant une List<CategoryResponse> comme attendu par le contrôleur.
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toCategoryResponse) // On utilise la méthode de conversion
                .collect(Collectors.toList());
    }

    // --- CORRECTION POUR L'ERREUR 2 ---
    // Cette méthode s'appelle bien saveCategory et accepte un CategoryRequest.
    public CategoryResponse saveCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        Category savedCategory = categoryRepository.save(category);
        return toCategoryResponse(savedCategory); // On renvoie un DTO de réponse
    }

    // --- CORRECTION POUR LA MISE À JOUR ---
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie non trouvée avec l'id : " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        Category updatedCategory = categoryRepository.save(category);
        return toCategoryResponse(updatedCategory);
    }

    // --- Logique de suppression robuste (déjà bonne, mais je la garde pour la cohérence) ---
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie non trouvée avec l'id : " + id);
        }
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Impossible de supprimer, cette catégorie est utilisée par " + productCount + " produit(s).");
        }
        categoryRepository.deleteById(id);
    }
}