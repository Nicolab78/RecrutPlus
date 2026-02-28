package com.recrutplus.recrutplus.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recrutplus.recrutplus.dto.application.*;
import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import com.recrutplus.recrutplus.service.impl.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ObjectMapper objectMapper;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(
            @RequestParam("data") String applicationData,
            @RequestParam("cv") MultipartFile cv) {

        try {
            CreateApplicationDTO createApplicationDTO = objectMapper.readValue(applicationData, CreateApplicationDTO.class);
            ApplicationDTO application = applicationService.submitApplication(createApplicationDTO, cv);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);

        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Erreur format JSON: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Erreur interne", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        try {
            ApplicationDTO application = applicationService.getApplicationById(id);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<ApplicationDTO> applications = applicationService.getMyApplications(email);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long jobOfferId,
            @RequestParam(required = false) String email) {
        try {
            List<ApplicationDTO> applications = applicationService.getAllApplications(status, jobOfferId, email);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/job-offer/{jobOfferId}")
    public ResponseEntity<?> getApplicationsByJobOffer(@PathVariable Long jobOfferId) {
        try {
            List<ApplicationDTO> applications = applicationService.getApplicationsByJobOffer(jobOfferId);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        try {
            List<ApplicationDTO> applications = applicationService.getApplicationsByStatus(status);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<?> processApplication(
            @PathVariable Long id,
            @Valid @RequestBody ProcessApplicationDTO processApplicationDTO) {
        try {
            ApplicationDTO application = applicationService.processApplication(id, processApplicationDTO);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationDTO updateApplicationDTO) {
        try {
            ApplicationDTO application = applicationService.updateApplication(id, updateApplicationDTO);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}