// src/main/java/tn/esprit/stock_management/entities/Supplier.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactPerson;
    private String email;
    private String phone;

    // --- MODIFICATION MAJEURE: Passage à une relation Plusieurs-à-Plusieurs ---
    @ManyToMany(fetch = FetchType.EAGER) // EAGER pour simplifier le chargement des catégories associées
    @JoinTable(
            name = "supplier_categories",  // Nom de la table de jointure qui sera créée automatiquement
            joinColumns = @JoinColumn(name = "supplier_id"), // Clé vers cette entité (Supplier)
            inverseJoinColumns = @JoinColumn(name = "category_id") // Clé vers l'autre entité (Category)
    )
    private Set<Category> categories = new HashSet<>(); // Un fournisseur a maintenant un ENSEMBLE de catégories
}