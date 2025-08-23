package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Emprunt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) // Un emprunt est toujours lié à un produit
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String nomEmprunteur; // Nom de la personne qui emprunte

    private int quantite;

    private LocalDate dateEmprunt;

    private LocalDate dateRetourPrevue;

    private LocalDate dateRetourReelle; // Sera null tant que l'objet n'est pas retourné

    @Enumerated(EnumType.STRING)
    private StatutEmprunt statut; // EN_COURS, RETOURNE

    private String notes; // Pour des commentaires additionnels
}