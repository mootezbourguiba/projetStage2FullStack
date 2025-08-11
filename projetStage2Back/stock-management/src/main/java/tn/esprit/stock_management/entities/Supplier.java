// src/main/java/tn/esprit/stock_management/entities/Supplier.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    // --- AJOUT DE LA RELATION ICI ---
    // Un fournisseur est principalement associé à une catégorie de produits.
    @ManyToOne
    @JoinColumn(name = "category_id") // Crée une colonne 'category_id' dans la table 'supplier'
    private Category category;
}