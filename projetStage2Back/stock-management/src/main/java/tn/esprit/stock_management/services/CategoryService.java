// src/main/java/com/esprim/stockmanagement/services/CategoryService.java

package tn.esprit.stock_management.services;

import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // --- NOUVEAU: Logique de mise à jour ---
    public Category updateCategory(Long id, Category categoryDetails) {
        // On cherche la catégorie existante par son ID
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'id : " + id));

        // On met à jour ses informations
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());

        // On la sauvegarde et on la retourne
        return categoryRepository.save(category);
    }

    // --- NOUVEAU: Logique de suppression ---
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'id : " + id));

        categoryRepository.delete(category);
    }
}