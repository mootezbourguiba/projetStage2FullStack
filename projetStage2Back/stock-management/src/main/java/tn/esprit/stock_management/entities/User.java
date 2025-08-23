// src/main/java/tn/esprit/stock_management/entities/User.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Builder; // Ajoutez cet import si vous utilisez @Builder
import lombok.Data; // Remplace @Getter et @Setter et plus
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Data // Utilise @Data de Lombok pour générer getters, setters, toString, etc.
@Builder // Utile pour construire des objets facilement
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true, nullable = false) // Bonne pratique d'ajouter nullable=false
    private String email;

    // --- LA CORRECTION DÉFINITIVE EST ICI ---
    @Column(length = 255, nullable = false) // On spécifie la longueur pour stocker le hash
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() { return email; }

    // On garde ces méthodes qui retournent 'true'
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}