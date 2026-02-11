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
}
