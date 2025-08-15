// src/main/java/tn/esprit/stock_management/services/SupplierService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.dto.SupplierRequest;
import tn.esprit.stock_management.entities.Category;
import tn.esprit.stock_management.entities.Supplier;
import tn.esprit.stock_management.repositories.CategoryRepository;
import tn.esprit.stock_management.repositories.SupplierRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
    }

    @Transactional
    public Supplier saveSupplier(SupplierRequest request) {
        Supplier supplier = (request.getId() != null)
                ? supplierRepository.findById(request.getId()).orElse(new Supplier())
                : new Supplier();

        supplier.setName(request.getName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            supplier.setCategories(categories);
        } else {
            supplier.getCategories().clear();
        }

        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        // NOTE: Il faudra ajouter ici une logique pour vérifier les mouvements de stock avant suppression.
        supplierRepository.deleteById(id);
    }
}