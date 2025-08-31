// src/main/java/tn/esprit/stock_management/repositories/UserRepository.java
package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Assurez-vous que cet import est présent

public interface UserRepository extends JpaRepository<User, Long> {

    // --- AJOUT DE CETTE LIGNE ---
    // Spring Data JPA va automatiquement comprendre cette méthode et générer la requête SQL "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);

}