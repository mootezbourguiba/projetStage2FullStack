// src/main/java/tn/esprit/stock_management/repositories/ProductRepository.java

package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Bonne pratique d'ajouter cette annotation
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * NOUVEAU: Méthode générée automatiquement par Spring Data JPA.
     * Elle compte le nombre d'entités 'Product' où le champ 'id' de la
     * propriété 'category' correspond à l'id fourni.
     * C'est la clé pour vérifier si une catégorie est utilisée.
     * @param categoryId L'ID de la catégorie à vérifier.
     * @return Le nombre de produits liés à cette catégorie.
     */
    long countByCategoryId(Long categoryId);
}