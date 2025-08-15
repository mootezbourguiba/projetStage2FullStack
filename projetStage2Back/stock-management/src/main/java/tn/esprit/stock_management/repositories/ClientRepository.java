// src/main/java/tn/esprit/stock_management/repositories/ClientRepository.java
package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}