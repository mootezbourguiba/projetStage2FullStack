package tn.esprit.stock_management;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Choisissez le mot de passe que vous voulez. Gardons "admin123" pour être clairs.
        String rawPassword = "admin123";

        String encodedPassword = encoder.encode(rawPassword);

        System.out.println("====================================================================");
        System.out.println("Voici le hash BCrypt pour le mot de passe : '" + rawPassword + "'");
        System.out.println("Copiez cette ligne entière :");
        System.out.println(encodedPassword);
        System.out.println("====================================================================");
    }
}