package tn.esprit.stock_management.dto;
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
    private String password;
}