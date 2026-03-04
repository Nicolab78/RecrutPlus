package com.recrutplus.recrutplus.controller;

import com.recrutplus.recrutplus.model.Application;
import com.recrutplus.recrutplus.service.impl.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/download/{applicationId}")
    public ResponseEntity<?> downloadCV(@PathVariable Long applicationId) {
        try {
            Resource resource = documentService.downloadCV(applicationId);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=cv_candidature_" + applicationId + ".pdf");
            headers.setContentType(MediaType.APPLICATION_PDF);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Erreur lors du téléchargement", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}