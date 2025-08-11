package tn.esprit.stock_management.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // Dit à Spring que cette classe représente une table dans la base de données
@Getter   // Lombok génère automatiquement les getters (ex: getId(), getName())
@Setter   // Lombok génère automatiquement les setters (ex: setId(), setName())
@NoArgsConstructor // Lombok génère un constructeur vide
@AllArgsConstructor // Lombok génère un constructeur avec tous les champs
public class Category {

    @Id // Marque ce champ comme la clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY) // L'ID sera auto-incrémenté par MySQL
    private Long id;

    private String name;
    private String description;
}
