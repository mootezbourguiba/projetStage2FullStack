// src/main/java/tn/esprit/stock_management/controllers/ClientController.java
package tn.esprit.stock_management.controllers;

import tn.esprit.stock_management.entities.Client;
import tn.esprit.stock_management.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    // Nous ajouterons les autres endpoints (POST, PUT, DELETE) plus tard
    // quand nous créerons la page de gestion des clients.
}