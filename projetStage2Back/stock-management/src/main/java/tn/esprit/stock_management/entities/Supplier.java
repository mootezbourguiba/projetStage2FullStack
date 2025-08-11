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

    // --- ASSUREZ-VOUS QUE CE BLOC EST BIEN PRÉSENT ---
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}