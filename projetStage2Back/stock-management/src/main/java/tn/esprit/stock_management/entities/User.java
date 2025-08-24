package tn.esprit.stock_management.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user") // Utiliser "_user" car "user" est un mot-clé réservé
public class User implements UserDetails { // <<--- 1. IMPLÉMENTER L'INTERFACE

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ==================================================================
    // --- 2. AJOUTER LES MÉTHODES DE L'INTERFACE USERDETAILS ---
    // ==================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // C'est la méthode la plus importante.
        // Elle transforme notre rôle (ex: Role.ADMIN) en une autorité que Spring Security comprend.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        // Pour notre application, le "nom d'utilisateur" est l'email.
        return email;
    }

    // Les méthodes suivantes peuvent rester à `true` par défaut.
    // Elles servent à gérer le blocage de compte, l'expiration, etc.
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