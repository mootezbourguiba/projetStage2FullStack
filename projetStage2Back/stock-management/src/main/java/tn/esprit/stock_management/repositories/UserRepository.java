package tn.esprit.stock_management.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.stock_management.entities.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}