package com.hirotix.backend.repository;

import com.hirotix.backend.entity.Application;
import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeeker(User seeker);
    List<Application> findByJob(Job job);
}
