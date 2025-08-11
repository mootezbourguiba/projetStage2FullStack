// src/main/java/tn/esprit/stock_management/entities/Movement.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "in" or "out"
    private int quantity;
    private LocalDate date;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // On peut ajouter plus tard la relation avec l'utilisateur
    // @ManyToOne
    // @JoinColumn(name = "user_id")
    // private User user;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = true) // nullable = true car seulement pour les entrées
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true) // nullable = true car seulement pour les sorties
    private Client client;
}