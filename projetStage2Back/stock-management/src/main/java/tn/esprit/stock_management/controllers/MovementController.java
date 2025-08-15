// src/main/java/tn/esprit/stock_management/controllers/MovementController.java
package tn.esprit.stock_management.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.stock_management.dto.MovementRequest;
import tn.esprit.stock_management.dto.MovementResponse;
import tn.esprit.stock_management.services.MovementService;
import java.util.List;

@RestController
@RequestMapping("/api/movements")
public class MovementController {

    @Autowired
    private MovementService movementService;

    @GetMapping
    public List<MovementResponse> getAllMovements() {
        return movementService.getAllMovements();
    }

    @PostMapping
    public MovementResponse createMovement(@RequestBody MovementRequest request) {
        return movementService.createMovement(request);
    }
}