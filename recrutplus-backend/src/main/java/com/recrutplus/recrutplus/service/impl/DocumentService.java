package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.model.Application;
import com.recrutplus.recrutplus.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final ApplicationRepository applicationRepository;

    public Resource downloadCV(Long applicationId) throws IOException {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        if (application.getCvPath() == null) {
            throw new RuntimeException("Aucun CV trouvé pour cette candidature");
        }

        Path filePath = Paths.get(application.getCvPath());
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Fichier introuvable");
        }
    }
}