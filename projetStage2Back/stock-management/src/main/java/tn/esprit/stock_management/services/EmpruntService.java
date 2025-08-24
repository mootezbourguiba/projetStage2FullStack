// src/main/java/tn/esprit/stock_management/services/EmpruntService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.controllers.EmpruntController.EmpruntRequestDTO;
import tn.esprit.stock_management.entities.Emprunt;
import tn.esprit.stock_management.entities.Product;
import tn.esprit.stock_management.entities.StatutEmprunt;
import tn.esprit.stock_management.repositories.EmpruntRepository;
import tn.esprit.stock_management.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmpruntService {

    @Autowired
    private EmpruntRepository empruntRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    @Transactional
    public Emprunt createEmprunt(EmpruntRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé"));

        if (product.getCurrentStock() < request.getQuantite()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuffisant");
        }

        product.setCurrentStock(product.getCurrentStock() - request.getQuantite());
        productRepository.save(product);

        Emprunt newLoan = new Emprunt();
        newLoan.setProduct(product);
        newLoan.setNomEmprunteur(request.getNomEmprunteur());
        newLoan.setQuantite(request.getQuantite());
        newLoan.setDateEmprunt(LocalDate.now());
        newLoan.setDateRetourPrevue(request.getDateRetourPrevue());
        newLoan.setStatut(StatutEmprunt.EN_COURS);
        newLoan.setNotes(request.getNotes());

        return empruntRepository.save(newLoan);
    }

    @Transactional
    public Emprunt returnEmprunt(Long id) {
        Emprunt loan = empruntRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emprunt non trouvé"));

        if (loan.getStatut() == StatutEmprunt.RETOURNE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cet emprunt a déjà été retourné.");
        }

        Product product = loan.getProduct();
        product.setCurrentStock(product.getCurrentStock() + loan.getQuantite());
        productRepository.save(product);

        loan.setStatut(StatutEmprunt.RETOURNE);
        loan.setDateRetourReelle(LocalDate.now());
        return empruntRepository.save(loan);
    }
}