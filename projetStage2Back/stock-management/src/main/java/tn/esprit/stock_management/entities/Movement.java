// src/main/java/tn/esprit/stock_management/entities/Movement.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) // Stocke l'enum sous forme de texte ("ENTREE", "SORTIE")
    private MovementType type;

    private int quantity;
    private LocalDateTime movementDate;
    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id") // Null si c'est une sortie
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id") // Null si c'est une entrée
    private Client client;

    // Vous pouvez ajouter plus tard une relation vers l'utilisateur qui a fait l'opération
    // @ManyToOne
    // @JoinColumn(name = "user_id")
    // private User user;
}