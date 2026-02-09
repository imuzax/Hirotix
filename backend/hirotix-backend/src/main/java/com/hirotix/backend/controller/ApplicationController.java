package com.hirotix.backend.controller;

import com.hirotix.backend.entity.Application;
import com.hirotix.backend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<Application> applyToJob(@PathVariable Long jobId, @RequestParam Long userId) {
        Application application = applicationService.applyToJob(userId, jobId);
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return new ResponseEntity<>(applicationService.getApplicationsForJob(jobId), HttpStatus.OK);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getMyApplications(@RequestParam Long userId) {
        return new ResponseEntity<>(applicationService.getMyApplications(userId), HttpStatus.OK);
    }
}
