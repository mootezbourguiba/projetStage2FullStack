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

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // =================================================================
    // --- NOUVEAU: Ajout de la méthode manquante pour corriger l'erreur ---
    // =================================================================
    /**
     * Calcule à la volée si le produit est en état critique.
     * Cette méthode n'est pas une colonne de la base de données.
     * L'annotation @Transient indique à JPA d'ignorer cette méthode
     * lors des opérations de base de données.
     * @return true si le stock actuel est inférieur ou égal au seuil d'alerte.
     */
    @Transient // Indique à JPA de ne PAS essayer de sauvegarder ce champ.
    public boolean isCritical() {
        // La condition est simple: le stock est-il en dessous du seuil ?
        return this.currentStock <= this.alertThreshold;
    }
    // =================================================================
}