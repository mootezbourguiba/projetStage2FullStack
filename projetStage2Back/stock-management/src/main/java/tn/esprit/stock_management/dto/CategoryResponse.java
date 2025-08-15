// src/main/java/tn/esprit/stock_management/dtos/CategoryResponse.java
package tn.esprit.stock_management.dto;

import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
}