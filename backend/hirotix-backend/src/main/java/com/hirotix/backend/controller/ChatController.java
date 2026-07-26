package com.hirotix.backend.controller;

import com.hirotix.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hirotix.backend.dto.ChatRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AIService aiService;

    @PostMapping
    public ResponseEntity<?> chatWithHiro(@RequestBody ChatRequest request) {
        System.out.println("Received chat request: " + request.getMessage());
        
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        try {
            Map<String, Object> response = aiService.chat(
                request.getMessage(), 
                request.getHistory() != null ? request.getHistory() : Collections.emptyList()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in chatWithHiro: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
