package com.hirotix.backend.repository;

import com.hirotix.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
