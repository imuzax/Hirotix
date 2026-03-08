package com.hirotix.backend.controller;

import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.Profile;
import com.hirotix.backend.service.AIService;
import com.hirotix.backend.service.JobService;
import com.hirotix.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final ProfileService profileService;
    private final JobService jobService;

    @PostMapping("/parse-resume/{userId}")
    public ResponseEntity<Profile> parseResume(@PathVariable Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        if (profile == null || profile.getResumeFilePath() == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> aiResponse = aiService.parseResume(profile.getResumeFilePath());
        List<String> skills = (List<String>) aiResponse.get("skills");

        if (skills != null && !skills.isEmpty()) {
            String skillsString = String.join(", ", skills);
            profile.setSkills(skillsString);
            profileService.saveProfile(profile);
        }

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/match-jobs/{userId}")
    public ResponseEntity<List<Map<String, Object>>> matchJobs(@PathVariable Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        List<Job> allJobs = jobService.getAllJobs();
        List<String> jobDescriptions = allJobs.stream()
                .map(job -> job.getTitle() + " " + job.getDescription())
                .collect(Collectors.toList());

        String resumeText = profile.getHeadline() + " " + profile.getSkills(); // Simplified fallback
        List<Map<String, Object>> matchResults = aiService.matchJobs(resumeText, jobDescriptions);

        // Merge scores into results
        for (int i = 0; i < allJobs.size(); i++) {
            matchResults.get(i).put("jobId", allJobs.get(i).getId());
            matchResults.get(i).put("jobTitle", allJobs.get(i).getTitle());
        }

        return ResponseEntity.ok(matchResults);
    }

    @GetMapping("/mock-interview/{userId}/{jobId}")
    public ResponseEntity<Map<String, Object>> generateMockInterview(@PathVariable Long userId, @PathVariable Long jobId) {
        Profile profile = profileService.getProfileByUserId(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        Job job = jobService.getJobById(jobId);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        String skills = profile.getSkills() != null ? profile.getSkills() : "General skills";
        Map<String, Object> aiResponse = aiService.generateMockInterview(job.getTitle(), skills);
        
        return ResponseEntity.ok(aiResponse);
    }
}

