package com.hirotix.backend.controller;

import com.hirotix.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AIService aiService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> chatWithHiro(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> response = aiService.chat(message);
        return ResponseEntity.ok(response);
    }
}
