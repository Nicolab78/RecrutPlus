package com.recrutplus.recrutplus.controller;
import com.recrutplus.recrutplus.dto.interview.*;
import com.recrutplus.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.recrutplus.service.impl.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/create")
    public ResponseEntity<?> createInterview(@Valid @RequestBody CreateInterviewDTO createInterviewDTO) {
        try {
            InterviewDTO interview = interviewService.createInterview(createInterviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(interview);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInterviewById(@PathVariable Long id) {
        try {
            InterviewDTO interview = interviewService.getInterviewById(id);
            return ResponseEntity.ok(interview);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("all")
    public ResponseEntity<?> getAllInterviews(@RequestParam(required = false) InterviewStatus status) {
        try {
            List<InterviewDTO> interviews = interviewService.getAllInterviews(status);
            return ResponseEntity.ok(interviews);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInterviews(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<InterviewDTO> interviews = interviewService.getMyInterviews(email);
            return ResponseEntity.ok(interviews);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInterviewDTO updateInterviewDTO) {
        try {
            InterviewDTO interview = interviewService.updateInterview(id, updateInterviewDTO);
            return ResponseEntity.ok(interview);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelInterview(@PathVariable Long id) {
        try {
            interviewService.cancelInterview(id);
            return ResponseEntity.ok("Entretien annulé avec succès");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}