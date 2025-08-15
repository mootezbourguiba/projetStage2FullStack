// src/main/java/tn/esprit/stock_management/services/ProductService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.dto.ProductDTO;
import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.entities.Product;
import tn.esprit.stock_management.repositories.CategoryRepository;
import tn.esprit.stock_management.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    // --- Méthodes de conversion (helpers) ---

    // Convertit une entité Product en un DTO ProductDTO pour l'envoyer au frontend
    private ProductDTO toDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setReference(product.getReference());
        dto.setBarcode(product.getBarcode());
        dto.setCurrentStock(product.getCurrentStock());
        dto.setAlertThreshold(product.getAlertThreshold());
        dto.setPhotoUrl(product.getPhotoUrl());
        dto.setCategory(product.getCategory());
        dto.setCritical(product.isCritical());
        return dto;
    }

    // Applique les données d'un DTO ProductDTO à une entité Product (pour la sauvegarde)
    private Product toEntity(ProductDTO dto, Product product) {
        product.setName(dto.getName());
        product.setReference(dto.getReference());
        product.setBarcode(dto.getBarcode());
        product.setCurrentStock(dto.getCurrentStock());
        product.setAlertThreshold(dto.getAlertThreshold());
        product.setPhotoUrl(dto.getPhotoUrl());

        // Gère l'association avec la catégorie
        if (dto.getCategory() != null && dto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(dto.getCategory().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catégorie avec l'ID " + dto.getCategory().getId() + " non trouvée"));
            product.setCategory(category);
        } else {
            product.setCategory(null); // Permet de dissocier un produit d'une catégorie
        }
        return product;
    }

    // --- Méthodes publiques du service (API) ---

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé avec l'id : " + id));
        return toDto(product);
    }

    // NOUVEAU: Méthode pour créer ou mettre à jour à partir d'un DTO
    public ProductDTO saveProduct(ProductDTO dto) {
        Product product = new Product();
        product = toEntity(dto, product); // Applique les données du DTO à la nouvelle entité
        Product savedProduct = productRepository.save(product);
        return toDto(savedProduct); // Renvoie un DTO du produit sauvegardé
    }

    // NOUVEAU: Méthode pour mettre à jour à partir d'un DTO
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé avec l'id : " + id));
        product = toEntity(dto, product); // Applique les données du DTO à l'entité existante
        Product updatedProduct = productRepository.save(product);
        return toDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé avec l'id : " + id);
        }
        // Ajouter ici une vérification si le produit est lié à des mouvements de stock
        productRepository.deleteById(id);
    }
}