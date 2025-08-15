// src/main/java/tn/esprit/stock_management/dto/MovementResponse.java
package tn.esprit.stock_management.dto;

import lombok.Data;
import tn.esprit.stock_management.entities.Client;
import tn.esprit.stock_management.entities.MovementType;
import tn.esprit.stock_management.entities.Supplier;
import java.time.LocalDateTime;

@Data
public class MovementResponse {
    private Long id;
    private MovementType type;
    private int quantity;
    private LocalDateTime movementDate;
    private String notes;
    private ProductDTO product; // On réutilise ProductDTO !
    private Supplier supplier;
    private Client client;
    // private String username; // Pour plus tard
}