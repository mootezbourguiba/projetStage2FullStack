
package tn.esprit.stock_management.repositories;

import tn.esprit.stock_management.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

// On étend JpaRepository, en lui disant de gérer des objets 'Category' dont la clé est de type 'Long'
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // C'est tout ! Spring Data JPA va implémenter toutes les méthodes pour nous.
}