package com.hirotix.backend.service;

import com.hirotix.backend.dto.AdminStatsDTO;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.repository.ApplicationRepository;
import com.hirotix.backend.repository.JobRepository;
import com.hirotix.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(UserRepository userRepository, JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public AdminStatsDTO getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalSeekers = userRepository.countByRole("SEEKER");
        long totalRecruiters = userRepository.countByRole("RECRUITER");
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        return new AdminStatsDTO(totalUsers, totalSeekers, totalRecruiters, totalJobs, totalApplications);
    }

    public List<User> getRecentOnboarding() {
        return userRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id"))).getContent();
    }

    public List<?> getAllApplications() {
        return applicationRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }
}
