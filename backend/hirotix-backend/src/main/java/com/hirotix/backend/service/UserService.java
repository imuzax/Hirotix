package com.hirotix.backend.service;

import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User loginUser(String email, String password) {
        // ideally we should add findByEmail to repository, but for now filtering is okay or we can add it.
        // Let's stick to stream for now as I can't guarantee repository modification success in one go without reading it again.
        // Actually, let's modify Repository first to be proper.
        return userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email) && u.getPassword().equals(password))
                .findFirst()
                .orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            if (userDetails.getFullName() != null) user.setFullName(userDetails.getFullName());
            if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
            if (userDetails.getPassword() != null) user.setPassword(userDetails.getPassword());
            return userRepository.save(user);
        }).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
