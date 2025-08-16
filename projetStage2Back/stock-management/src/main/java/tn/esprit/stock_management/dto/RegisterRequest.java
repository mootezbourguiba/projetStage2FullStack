package tn.esprit.stock_management.dto;
import lombok.Data;
import tn.esprit.stock_management.entities.Role;
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}