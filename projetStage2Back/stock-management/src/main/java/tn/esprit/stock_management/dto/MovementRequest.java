// src/main/java/tn/esprit/stock_management/dto/MovementRequest.java
package tn.esprit.stock_management.dto;

import lombok.Data;
import tn.esprit.stock_management.entities.MovementType;
import java.time.LocalDateTime;

@Data
public class MovementRequest {
    private Long productId;
    private Long supplierId; // Peut être null
    private Long clientId;   // Peut être null
    private MovementType type;
    private int quantity;
    private LocalDateTime movementDate;
    private String notes;
}