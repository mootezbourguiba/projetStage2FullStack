package tn.esprit.stock_management;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class StockManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockManagementApplication.class, args);
	}

	/**
	 * CE BLOC EST TEMPORAIRE.
	 * Son seul but est d'afficher le mot de passe haché dans la console
	 * pour que nous puissions le copier dans data.sql.
	 */
	@Bean
	public CommandLineRunner commandLineRunner(PasswordEncoder passwordEncoder) {
		return args -> {
			String passwordToHash = "admin123"; // Le mot de passe simple que nous voulons utiliser
			String hashedPassword = passwordEncoder.encode(passwordToHash);
			System.out.println("====================================================================");
			System.out.println("HASH POUR data.sql (mot de passe 'admin123'):");
			System.out.println(hashedPassword);
			System.out.println("====================================================================");
		};
	}
}