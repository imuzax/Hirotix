package com.hirotix.backend.config;

import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize Default Admin Account
        String adminEmail = "admin@hirotix.com";
        Optional<User> adminExists = userRepository.findFirstByEmail(adminEmail);

        if (adminExists.isEmpty()) {
            User admin = new User();
            admin.setFullName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword("admin123"); // Default temporary password
            admin.setRole("ADMIN");
            
            userRepository.save(admin);
            System.out.println("✅ [SYSTEM INITIALIZATION]: Default Admin account created (admin@hirotix.com)");
        } else {
            System.out.println("ℹ️ [SYSTEM INITIALIZATION]: Admin account already exists.");
        }
    }
}
