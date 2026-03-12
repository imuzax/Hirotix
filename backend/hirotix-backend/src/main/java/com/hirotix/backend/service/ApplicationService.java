package com.hirotix.backend.service;

import com.hirotix.backend.entity.Application;
import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.ApplicationRepository;
import com.hirotix.backend.repository.JobRepository;
import com.hirotix.backend.repository.UserRepository;
import com.hirotix.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final AIService aiService;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository, 
                              UserRepository userRepository, ProfileRepository profileRepository, 
                              AIService aiService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.aiService = aiService;
    }

    public Application applyToJob(Long userId, Long jobId) {
        User seeker = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setSeeker(seeker);
        application.setJob(job);
        application.setStatus("APPLIED");
        application.setAppliedDate(LocalDateTime.now());

        // Calculate AI Match Score
        try {
            com.hirotix.backend.entity.Profile profile = profileRepository.findByUser(seeker).orElse(null);
            if (profile != null) {
                String resumeText = profile.getHeadline() + " " + profile.getSkills();
                String jobDesc = job.getTitle() + " " + job.getDescription();
                List<Map<String, Object>> results = aiService.matchJobs(resumeText, Collections.singletonList(jobDesc));
                if (results != null && !results.isEmpty()) {
                    Double score = (Double) results.get(0).get("score");
                    application.setMatchScore(score * 100); // Store as percentage
                }
            } else {
                application.setMatchScore(0.0);
            }
        } catch (Exception e) {
            application.setMatchScore(0.0);
        }

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job);
    }

    public List<Application> getMyApplications(Long userId) {
        User seeker = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findBySeeker(seeker);
    }
}
