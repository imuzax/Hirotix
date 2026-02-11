package com.hirotix.backend.controller;


import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.service.JobService;
import com.hirotix.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserService userService;

    public JobController(JobService jobService, UserService userService) {
        this.jobService = jobService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, @RequestParam Long recruiterId) {
        User recruiter = userService.getUserById(recruiterId);
        if (recruiter == null) {
            return new ResponseEntity<>("Recruiter not found", HttpStatus.BAD_REQUEST);
        }
        // Ideally verify role is RECRUITER
        job.setRecruiter(recruiter);
        Job savedJob = jobService.saveJob(job);
        return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs(@RequestParam Long recruiterId) {
        User recruiter = userService.getUserById(recruiterId);
        if (recruiter == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(jobService.getJobsByRecruiter(recruiter), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam(required = false) String query,
                                                @RequestParam(required = false) String location) {
        return new ResponseEntity<>(jobService.searchJobs(query, location), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job != null) {
            return new ResponseEntity<>(job, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
