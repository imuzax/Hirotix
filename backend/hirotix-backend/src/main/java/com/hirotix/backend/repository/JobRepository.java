package com.hirotix.backend.repository;

import com.hirotix.backend.entity.Job;

import com.hirotix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(User recruiter);
}
