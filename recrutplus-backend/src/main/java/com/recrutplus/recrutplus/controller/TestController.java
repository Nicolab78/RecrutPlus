package com.recrutplus.recrutplus.controller;

import com.recrutplus.recrutplus.service.impl.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String email) {
        System.out.println("=== DEBUT TEST EMAIL ===");
        try {
            emailService.sendTestEmail(email);
            return ResponseEntity.ok("Email de test envoyé à " + email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}