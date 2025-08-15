// src/main/java/tn/esprit/stock_management/dtos/CategoryRequest.java
package tn.esprit.stock_management.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
}