package com.hirotix.backend.service;

import com.hirotix.backend.entity.Profile;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.ProfileRepository;
import com.hirotix.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId).orElse(null);
    }

    public Profile updateProfile(Long userId, Profile profileDetails) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            Profile profile = profileRepository.findByUserId(userId).orElse(new Profile());
            profile.setUser(userOptional.get());
            profile.setHeadline(profileDetails.getHeadline());
            profile.setSkills(profileDetails.getSkills());
            profile.setEducation(profileDetails.getEducation());
            profile.setExperience(profileDetails.getExperience());
            profile.setLocation(profileDetails.getLocation());
            profile.setGithubLink(profileDetails.getGithubLink());
            return profileRepository.save(profile);
        }
        return null;
    }
}
