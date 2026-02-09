package com.hirotix.backend.service;

import com.hirotix.backend.entity.Application;
import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.ApplicationRepository;
import com.hirotix.backend.repository.JobRepository;
import com.hirotix.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Application applyToJob(Long userId, Long jobId) {
        User seeker = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setSeeker(seeker);
        application.setJob(job);
        application.setStatus("APPLIED");
        application.setAppliedDate(LocalDateTime.now());

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
