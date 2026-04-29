package com.hirotix.backend.controller;

import com.hirotix.backend.dto.AdminStatsDTO;
import com.hirotix.backend.entity.User;
import com.hirotix.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/onboarding")
    public ResponseEntity<List<User>> getOnboarding() {
        return ResponseEntity.ok(adminService.getRecentOnboarding());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<?>> getAllApplications() {
        return ResponseEntity.ok(adminService.getAllApplications());
    }
}
