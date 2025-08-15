// src/main/java/tn/esprit/stock_management/services/ClientService.java
package tn.esprit.stock_management.services;

import tn.esprit.stock_management.entities.Client;
import tn.esprit.stock_management.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // Nous ajouterons les méthodes pour créer, modifier, supprimer plus tard
    // public Client saveClient(Client client) {
    //     return clientRepository.save(client);
    // }
}