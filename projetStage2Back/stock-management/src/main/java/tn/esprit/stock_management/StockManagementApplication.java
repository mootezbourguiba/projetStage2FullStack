// src/main/java/tn/esprit/stock_management/StockManagementApplication.java

package tn.esprit.stock_management;

import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import tn.esprit.stock_management.services.FileStorageService;

@SpringBootApplication
public class StockManagementApplication implements CommandLineRunner { // On implémente CommandLineRunner

	@Resource // On injecte notre service
	FileStorageService storageService;

	public static void main(String[] args) {
		SpringApplication.run(StockManagementApplication.class, args);
	}

	@Override // Cette méthode s'exécute une fois que l'application a démarré
	public void run(String... arg) throws Exception {
		storageService.init();
	}
}