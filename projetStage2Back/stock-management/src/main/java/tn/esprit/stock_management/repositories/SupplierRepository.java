// src/main/java/tn/esprit/stock_management/repositories/SupplierRepository.java
package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}