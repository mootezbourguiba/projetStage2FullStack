package tn.esprit.stock_management.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.stock_management.entities.Emprunt;

public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {
}