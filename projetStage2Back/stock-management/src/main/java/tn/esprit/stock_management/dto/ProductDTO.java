// src/main/java/tn/esprit/stock_management/dto/ProductDTO.java
package tn.esprit.stock_management.dto;

import lombok.Data;
import tn.esprit.stock_management.entities.Category;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String reference;
    private String barcode;
    private int currentStock;
    private int alertThreshold;
    private String photoUrl;
    private Category category;
    private boolean critical;
}