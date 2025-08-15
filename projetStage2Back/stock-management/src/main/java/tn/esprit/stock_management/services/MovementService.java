// src/main/java/tn/esprit/stock_management/services/MovementService.java
package tn.esprit.stock_management.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.stock_management.dto.MovementRequest;
import tn.esprit.stock_management.dto.MovementResponse;
import tn.esprit.stock_management.dto.ProductDTO;
import tn.esprit.stock_management.entities.*;
import tn.esprit.stock_management.repositories.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovementService {

    @Autowired private MovementRepository movementRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private ClientRepository clientRepository;

    // Helper pour convertir Entité -> DTO
    private MovementResponse toResponse(Movement movement) {
        MovementResponse res = new MovementResponse();
        res.setId(movement.getId());
        res.setType(movement.getType());
        res.setQuantity(movement.getQuantity());
        res.setMovementDate(movement.getMovementDate());
        res.setNotes(movement.getNotes());
        res.setSupplier(movement.getSupplier());
        res.setClient(movement.getClient());

        // Convertir le produit associé en ProductDTO
        Product product = movement.getProduct();
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        // ... ajoutez d'autres champs de produit si nécessaire
        res.setProduct(productDTO);

        return res;
    }

    public List<MovementResponse> getAllMovements() {
        return movementRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional // Indispensable ! Garantit que la mise à jour du stock et la création du mouvement réussissent ou échouent ensemble.
    public MovementResponse createMovement(MovementRequest request) {
        // 1. Récupérer le produit de la BDD
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé"));

        // 2. Mettre à jour le stock du produit
        if (request.getType() == MovementType.ENTREE) {
            product.setCurrentStock(product.getCurrentStock() + request.getQuantity());
        } else if (request.getType() == MovementType.SORTIE) {
            if (product.getCurrentStock() < request.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuffisant pour le produit: " + product.getName());
            }
            product.setCurrentStock(product.getCurrentStock() - request.getQuantity());
        }
        productRepository.save(product); // Sauvegarder le stock mis à jour

        // 3. Créer l'objet Mouvement
        Movement movement = new Movement();
        movement.setProduct(product);
        movement.setType(request.getType());
        movement.setQuantity(request.getQuantity());
        movement.setMovementDate(request.getMovementDate() != null ? request.getMovementDate() : java.time.LocalDateTime.now());
        movement.setNotes(request.getNotes());

        // 4. Lier le fournisseur ou le client
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
            movement.setSupplier(supplier);
        }
        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId()).orElse(null);
            movement.setClient(client);
        }

        // 5. Sauvegarder le mouvement et renvoyer la réponse
        Movement savedMovement = movementRepository.save(movement);
        return toResponse(savedMovement);
    }
}