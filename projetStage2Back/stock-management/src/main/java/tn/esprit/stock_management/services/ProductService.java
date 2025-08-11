// src/main/java/tn/esprit/stock_management/services/ProductService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.dto.ProductDTO;
import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.entities.Product;
import tn.esprit.stock_management.repositories.CategoryRepository;
import tn.esprit.stock_management.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setReference(product.getReference());
        dto.setBarcode(product.getBarcode());
        dto.setCurrentStock(product.getCurrentStock());
        dto.setAlertThreshold(product.getAlertThreshold());
        dto.setPhotoUrl(product.getPhotoUrl());
        dto.setCategory(product.getCategory());
        dto.setCritical(product.getCurrentStock() <= product.getAlertThreshold());
        return dto;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));

        product.setName(productDetails.getName());
        product.setReference(productDetails.getReference());
        product.setBarcode(productDetails.getBarcode());
        product.setCurrentStock(productDetails.getCurrentStock());
        product.setAlertThreshold(productDetails.getAlertThreshold());
        product.setPhotoUrl(productDetails.getPhotoUrl());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));
        productRepository.delete(product);
    }
}