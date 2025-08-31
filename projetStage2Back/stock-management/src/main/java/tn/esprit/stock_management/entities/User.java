// src/main/java/tn/esprit/stock_management/entities/User.java
package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User implements UserDetails { // <-- ON IMPLÉMENTE UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // On utilise un ENUM pour les rôles, c'est une meilleure pratique.
    @Enumerated(EnumType.STRING)
    private Role role;

    // --- MÉTHODES REQUISES PAR LE CONTRAT UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // On transforme notre rôle (ex: ADMIN) en une "autorité" que Spring Security comprend.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        // Pour notre application, l'email est le nom d'utilisateur.
        return email;
    }

    // Les méthodes suivantes sont pour gérer des cas plus complexes (compte expiré, etc.)
    // Pour notre projet, on les met simplement à 'true'.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}