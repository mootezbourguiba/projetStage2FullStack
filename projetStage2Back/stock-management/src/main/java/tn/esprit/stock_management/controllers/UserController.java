// src/main/java/tn/esprit/stock_management/controllers/UserController.java
package tn.esprit.stock_management.controllers;

import tn.esprit.stock_management.entities.User;
import tn.esprit.stock_management.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Les routes PUT et DELETE seront ajoutées ici
}