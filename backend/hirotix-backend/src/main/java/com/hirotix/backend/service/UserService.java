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

    public User getUserByEmail(String email) {
        return userRepository.findFirstByEmail(email).orElse(null);
    }

    public User loginUser(String email, String password) {
        return userRepository.findFirstByEmail(email)
                .filter(u -> u.getPassword().equals(password))
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
