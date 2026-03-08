package com.hirotix.backend.service;

import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.Profile;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    private final String PYTHON_SERVICE_URL = "http://localhost:5000";
    private final RestTemplate restTemplate = new RestTemplate(); // For simplicity, can be a Bean

    public Map<String, Object> parseResume(String filePath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(new File(filePath)));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_SERVICE_URL + "/parse",
                    requestEntity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Service Error: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> matchJobs(String resumeText, List<String> jobDescriptions) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("resume_text", resumeText);
        requestBody.put("job_descriptions", jobDescriptions);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<List> response = restTemplate.postForEntity(
                    PYTHON_SERVICE_URL + "/match",
                    entity,
                    List.class
            );
            return (List<Map<String, Object>>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Service Error: " + e.getMessage());
        }
    }

    public Map<String, Object> chat(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("message", message);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_SERVICE_URL + "/chat",
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Chat Error: " + e.getMessage());
        }
    }

    public Map<String, Object> generateMockInterview(String jobTitle, String skills) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("job_title", jobTitle);
        requestBody.put("skills", skills);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_SERVICE_URL + "/mock-interview",
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Mock Interview Error: " + e.getMessage());
        }
    }
}
