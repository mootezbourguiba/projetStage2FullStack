package tn.esprit.stock_management.config; // ou un autre package de configuration

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tn.esprit.stock_management.entities.User;
import tn.esprit.stock_management.entities.Role;
import tn.esprit.stock_management.repositories.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Spring va injecter automatiquement les beans nécessaires
    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Cette méthode est appelée une seule fois au démarrage de l'application
        createAdminUserIfNeeded();
    }

    private void createAdminUserIfNeeded() {
        String adminEmail = "admin@esprim.com";

        // On vérifie si l'utilisateur admin n'existe pas déjà
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Admin Esprim");
            adminUser.setEmail(adminEmail);

            // C'est ici la magie : on hashe le mot de passe directement avec le bean PasswordEncoder
            adminUser.setPassword(passwordEncoder.encode("admin123"));

            adminUser.setRole(Role.ADMIN);

            userRepository.save(adminUser);
            System.out.println("====================================================================");
            System.out.println("Utilisateur admin créé avec le mot de passe par défaut 'admin123'");
            System.out.println("====================================================================");
        }
    }
}