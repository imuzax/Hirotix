package com.hirotix.backend.service;

import com.hirotix.backend.entity.Job;
import com.hirotix.backend.entity.Profile;
import com.hirotix.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    private final JobRepository jobRepository;
    
    @Value("${ai.service.url:http://127.0.0.1:5000}")
    private String PYTHON_SERVICE_URL;
    
    private RestTemplate getRestTemplate() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000); // 3s connect
        factory.setReadTimeout(20000);   // 20s read
        return new RestTemplate(factory);
    }

    public Map<String, Object> parseResume(String filePath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(new File(filePath)));
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = getRestTemplate().postForEntity(
                    PYTHON_SERVICE_URL + "/parse",
                    requestEntity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
             System.err.println("AI Parse Error: " + e.getMessage());
            throw new RuntimeException("AI Parsing Error: Ensure Python AI service is running on Port 5000.");
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
            ResponseEntity<List> response = getRestTemplate().postForEntity(
                    PYTHON_SERVICE_URL + "/match",
                    entity,
                    List.class
            );
            return (List<Map<String, Object>>) response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Match Error: " + e.getMessage());
        }
    }

    public Map<String, Object> chat(String message, List<Map<String, String>> history) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<Job> allJobs = jobRepository.findAll();
        String jobContext = allJobs.stream()
                .map(j -> String.format("- %s at %s (%s)", j.getTitle(), j.getCompany(), j.getLocation()))
                .collect(Collectors.joining("\n"));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("message", message);
        requestBody.put("context", jobContext);
        requestBody.put("history", history);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = getRestTemplate().postForEntity(
                    PYTHON_SERVICE_URL + "/chat",
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (org.springframework.web.client.ResourceAccessException e) {
            System.err.println("CRITICAL: AI Service Communication Failure!");
            if (e.getMessage().contains("Connection refused")) {
                throw new RuntimeException("AI Service is NOT running. Please start START_HIROTIX.bat and ensure port 5000 is green.");
            } else {
                throw new RuntimeException("AI Service is responding too slowly. Please check your internet or Groq API limits.");
            }
        } catch (Exception e) {
            System.err.println("AI Chat Error: " + e.getMessage());
            throw new RuntimeException("Hiro AI is currently exhausted. Try again in 10 seconds.");
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
            ResponseEntity<Map> response = getRestTemplate().postForEntity(
                    PYTHON_SERVICE_URL + "/mock-interview",
                    entity,
                    Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("AI Interview Generation Error: " + e.getMessage());
            throw new RuntimeException("AI Mock Interview Error: Ensure Python AI service is active.");
        }
    }
}
