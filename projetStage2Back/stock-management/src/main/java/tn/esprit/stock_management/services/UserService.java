package tn.esprit.stock_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.stock_management.entities.User;
import tn.esprit.stock_management.repositories.UserRepository;

// package...
@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        // Hacher le mot de passe avant de sauvegarder
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}