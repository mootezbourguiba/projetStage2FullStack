// src/main/java/tn/esprit/stock_management/entities/Category.java
package tn.esprit.stock_management.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // --- NOUVEAU: Ajout de la relation inverse ---
    // "mappedBy" pointe vers le champ "categories" dans l'entité Supplier.
    @ManyToMany(mappedBy = "categories")
    @JsonIgnore // Indispensable pour éviter les boucles infinies lors de la conversion en JSON
    private Set<Supplier> suppliers = new HashSet<>();
}