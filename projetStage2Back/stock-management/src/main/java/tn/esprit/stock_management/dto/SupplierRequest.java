// src/main/java/tn/esprit/stock_management/dtos/SupplierRequest.java
package tn.esprit.stock_management.dto;

import lombok.Data;
import java.util.List;

// Un DTO (Data Transfer Object) est un objet simple qui sert à transporter
// les données entre le frontend et le backend.
@Data // Annotation Lombok qui génère getters, setters, toString, etc.
public class SupplierRequest {
    private Long id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    // C'est ici que le frontend enverra la liste des IDs des catégories cochées
    private List<Long> categoryIds;
}