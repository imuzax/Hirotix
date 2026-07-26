package com.hirotix.backend.service;

import com.hirotix.backend.entity.Job;
import com.hirotix.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }


    public Job saveJob(Job job) {
        if (job.getPostedDate() == null) {
            job.setPostedDate(java.time.LocalDateTime.now());
        }
        return jobRepository.save(job);
    }

    public List<Job> getJobsByRecruiter(com.hirotix.backend.entity.User recruiter) {
        return jobRepository.findByRecruiter(recruiter);
    }

    public List<Job> searchJobs(String query, String location) {
        return jobRepository.searchJobs(query, location);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public Job updateJob(Long id, Job details) {
        Job existing = getJobById(id);
        if (existing != null) {
            if (details.getTitle() != null) existing.setTitle(details.getTitle());
            if (details.getCompany() != null) existing.setCompany(details.getCompany());
            if (details.getLocation() != null) existing.setLocation(details.getLocation());
            if (details.getDescription() != null) existing.setDescription(details.getDescription());
            if (details.getResponsibilities() != null) existing.setResponsibilities(details.getResponsibilities());
            if (details.getRequirements() != null) existing.setRequirements(details.getRequirements());
            if (details.getQualifications() != null) existing.setQualifications(details.getQualifications());
            if (details.getSalary() != null) existing.setSalary(details.getSalary());
            if (details.getJobType() != null) existing.setJobType(details.getJobType());
            if (details.getExperienceLevel() != null) existing.setExperienceLevel(details.getExperienceLevel());
            return jobRepository.save(existing);
        }
        return null;
    }
}
