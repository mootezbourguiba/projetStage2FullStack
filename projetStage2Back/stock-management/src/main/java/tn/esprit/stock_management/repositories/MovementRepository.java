// src/main/java/tn/esprit/stock_management/repositories/MovementRepository.java
package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Movement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {
}