// src/main/java/tn/esprit/stock_management/repositories/ProductRepository.java

package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Import manquant
import org.springframework.stereotype.Repository;

import java.util.List; // <-- Import manquant

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    long countByCategoryId(Long categoryId);

    // --- NOUVELLE MÉTHODE POUR TROUVER LES PRODUITS EN ALERTE ---
    // Elle sélectionne les produits où la quantité en stock (currentStock)
    // est inférieure ou égale au seuil d'alerte (alertThreshold).
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.alertThreshold")
    List<Product> findProductsInAlert();
}