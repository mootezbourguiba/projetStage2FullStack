// src/main/java/tn/esprit/stock_management/repositories/ProductRepository.java

package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}