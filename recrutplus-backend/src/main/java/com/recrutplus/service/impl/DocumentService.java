package com.recrutplus.service.impl;

import com.recrutplus.model.Application;
import com.recrutplus.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final ApplicationRepository applicationRepository;
    private final GridFsService gridFsService;

    public Resource downloadCV(Long applicationId) throws IOException {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        if (application.getCvPath() == null) {
            throw new RuntimeException("Aucun CV trouvé pour cette candidature");
        }

        return new InputStreamResource(gridFsService.getCv(application.getCvPath()));
    }
}