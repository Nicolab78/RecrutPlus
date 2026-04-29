package com.recrutplus.service.interfaces;

import com.recrutplus.dto.application.ApplicationDTO;
import com.recrutplus.dto.application.CreateApplicationDTO;
import com.recrutplus.dto.application.ProcessApplicationDTO;
import com.recrutplus.dto.application.UpdateApplicationDTO;
import com.recrutplus.model.enums.ApplicationStatus;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

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
