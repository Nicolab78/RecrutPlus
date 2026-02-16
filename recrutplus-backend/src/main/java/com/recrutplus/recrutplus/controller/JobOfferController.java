package com.recrutplus.recrutplus.controller;

import com.recrutplus.recrutplus.dto.joboffer.CreateJobOfferDTO;
import com.recrutplus.recrutplus.dto.joboffer.JobOfferDTO;
import com.recrutplus.recrutplus.dto.joboffer.UpdateJobOfferDTO;
import com.recrutplus.recrutplus.model.enums.ContractType;
import com.recrutplus.recrutplus.model.enums.Specialty;
import com.recrutplus.recrutplus.service.impl.JobOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllJobOffers() {
        try {
            List<JobOfferDTO> jobOffers = jobOfferService.getAllJobOffers();
            return ResponseEntity.ok(jobOffers);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveJobOffers() {
        try {
            List<JobOfferDTO> jobOffers = jobOfferService.getActiveJobOffers();
            return ResponseEntity.ok(jobOffers);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobOfferById(@PathVariable Long id) {
        try {
            JobOfferDTO jobOffer = jobOfferService.getJobOfferById(id);
            return ResponseEntity.ok(jobOffer);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobOffers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Specialty specialty,
            @RequestParam(required = false) ContractType contractType) {
        try {
            List<JobOfferDTO> jobOffers = jobOfferService.searchJobOffers(keyword, specialty, contractType);
            return ResponseEntity.ok(jobOffers);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<?> getJobOffersBySpecialty(@PathVariable Specialty specialty) {
        try {
            List<JobOfferDTO> jobOffers = jobOfferService.getJobOffersBySpecialty(specialty);
            return ResponseEntity.ok(jobOffers);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/specialties")
    public ResponseEntity<?> getAllSpecialties() {
        try {
            List<Specialty> specialties = jobOfferService.getAllSpecialties();
            return ResponseEntity.ok(specialties);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/contract-types")
    public ResponseEntity<?> getAllContractTypes() {
        try {
            List<ContractType> contractTypes = jobOfferService.getAllContractTypes();
            return ResponseEntity.ok(contractTypes);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJobOffer(@Valid @RequestBody CreateJobOfferDTO createJobOfferDTO) {
        try {
            JobOfferDTO createdJobOffer = jobOfferService.createJobOffer(createJobOfferDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdJobOffer);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobOffer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobOfferDTO updateJobOfferDTO) {
        try {
            JobOfferDTO updatedJobOffer = jobOfferService.updateJobOffer(id, updateJobOfferDTO);
            return ResponseEntity.ok(updatedJobOffer);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobOffer(@PathVariable Long id) {
        try {
            jobOfferService.deleteJobOffer(id);
            return ResponseEntity.ok("Offre supprimée avec succès");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}