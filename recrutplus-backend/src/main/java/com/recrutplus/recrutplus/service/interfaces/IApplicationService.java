package com.recrutplus.recrutplus.service.interfaces;

import com.recrutplus.recrutplus.dto.application.*;
import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IApplicationService {

    ApplicationDTO submitApplication(CreateApplicationDTO createApplicationDTO, MultipartFile cv);

    ApplicationDTO getApplicationById(Long id);

    List<ApplicationDTO> getMyApplications(String email);

    List<ApplicationDTO> getAllApplications(String status, Long jobOfferId, String email);

    List<ApplicationDTO> getApplicationsByJobOffer(Long jobOfferId);

    List<ApplicationDTO> getApplicationsByStatus(ApplicationStatus status);

    ApplicationDTO processApplication(Long id, ProcessApplicationDTO processApplicationDTO);

    ApplicationDTO updateApplication(Long id, UpdateApplicationDTO updateApplicationDTO);


}