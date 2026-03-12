package com.hirotix.backend.repository;

import com.hirotix.backend.entity.Profile;
import com.hirotix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserId(Long userId);
    Optional<Profile> findByUser(User user);
}
