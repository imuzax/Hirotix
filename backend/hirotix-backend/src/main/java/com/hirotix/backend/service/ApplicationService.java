package com.hirotix.backend.service;

import com.hirotix.backend.model.Application;
import com.hirotix.backend.model.Job;
import com.hirotix.backend.model.Profile;
import com.hirotix.backend.model.User;
import com.hirotix.backend.repository.ApplicationRepository;
import com.hirotix.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileRepository profileRepository;

    public Application applyToJob(Long jobId, Long userId) {
        Job job = jobService.getJobById(jobId);
        User user = userService.getUserById(userId);

        // Check if profile exists and has a resume
        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile == null || profile.getResumeFilePath() == null || profile.getResumeFilePath().isEmpty()) {
            throw new RuntimeException("Resume required: Please upload your resume in the profile section before applying.");
        }

        // Check if already applied
        if (applicationRepository.findByJobIdAndUserId(jobId, userId).isPresent()) {
            throw new RuntimeException("You have already applied for this job.");
        }

        Application application = new Application();
        application.setJob(job);
        application.setUser(user);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
