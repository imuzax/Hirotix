package com.hirotix.backend.controller;

import com.hirotix.backend.entity.Profile;
import com.hirotix.backend.service.ProfileService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        if (profile != null) {
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long userId, @RequestBody Profile profile) {
        Profile updatedProfile = profileService.updateProfile(userId, profile);
        if (updatedProfile != null) {
            return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // User not found
        }
    }

    @PostMapping("/{userId}/resume")
    public ResponseEntity<Profile> uploadResume(@PathVariable Long userId, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        Profile updatedProfile = profileService.uploadResume(userId, file);
        if (updatedProfile != null) {
            return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{userId}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        if (profile != null && profile.getResumeFilePath() != null) {
            try {
                Path path = Paths.get(profile.getResumeFilePath());
                Resource resource = new UrlResource(path.toUri());
                if (resource.exists()) {
                    String contentType = "application/octet-stream";
                    if (profile.getResumeFilePath().endsWith(".pdf")) contentType = "application/pdf";
                    else if (profile.getResumeFilePath().endsWith(".txt")) contentType = "text/plain";

                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                            .body(resource);
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
