// src/main/java/tn/esprit/stock_management/services/CategoryService.java

package tn.esprit.stock_management.services;

import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.repositories.CategoryRepository;
import tn.esprit.stock_management.repositories.ProductRepository; // <-- NOUVEAU : Importer le repository des produits
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // <-- NOUVEAU : Importer pour les statuts HTTP
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException; // <-- NOUVEAU : Pour renvoyer des erreurs propres

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // NOUVEAU : Injection du ProductRepository pour pouvoir l'utiliser
    @Autowired
    private ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // --- Logique de mise à jour AMÉLIORÉE ---
    // Utilise ResponseStatusException pour renvoyer une erreur 404 propre
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie non trouvée avec l'id : " + id));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    // --- Logique de suppression COMPLÈTEMENT RÉÉCRITE et SÉCURISÉE ---
    public void deleteCategory(Long id) {
        // ÉTAPE 1: Vérifier si la catégorie existe. Sinon, renvoyer une erreur 404.
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Impossible de supprimer, la catégorie avec l'id " + id + " n'existe pas.");
        }

        // ÉTAPE 2: Vérifier si des produits sont liés à cette catégorie.
        long productCount = productRepository.countByCategoryId(id);

        // ÉTAPE 3: Si la catégorie est utilisée, refuser la suppression et renvoyer une erreur 409 Conflict.
        if (productCount > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Impossible de supprimer. Cette catégorie est utilisée par " + productCount + " produit(s).");
        }

        // ÉTAPE 4: Si la catégorie n'est pas utilisée, la supprimer en toute sécurité.
        categoryRepository.deleteById(id);
    }
}