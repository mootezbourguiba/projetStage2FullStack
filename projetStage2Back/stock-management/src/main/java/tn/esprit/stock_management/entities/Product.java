// src/main/java/tn/esprit/stock_management/entities/Product.java

package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String reference;
    private String barcode;
    private int currentStock;
    private int alertThreshold;
    private String photoUrl;

    // --- C'est ici que la magie opère ---
    @ManyToOne // Indique une relation "Plusieurs produits pour Une catégorie"
    @JoinColumn(name = "category_id") // Crée une colonne 'category_id' dans la table 'product'
    private Category category;
}