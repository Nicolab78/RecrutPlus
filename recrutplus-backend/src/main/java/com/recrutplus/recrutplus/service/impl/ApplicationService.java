package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.dto.application.*;
import com.recrutplus.recrutplus.dto.joboffer.JobOfferDTO;
import com.recrutplus.recrutplus.dto.user.UserDTO;
import com.recrutplus.recrutplus.model.Address;
import com.recrutplus.recrutplus.model.Application;
import com.recrutplus.recrutplus.model.JobOffer;
import com.recrutplus.recrutplus.model.User;
import com.recrutplus.recrutplus.model.Interview;
import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import com.recrutplus.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.recrutplus.model.enums.UserRole;
import com.recrutplus.recrutplus.repository.ApplicationRepository;
import com.recrutplus.recrutplus.repository.InterviewRepository;
import com.recrutplus.recrutplus.repository.JobOfferRepository;
import com.recrutplus.recrutplus.repository.UserRepository;
import com.recrutplus.recrutplus.service.interfaces.IApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService implements IApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ApplicationDTO submitApplication(CreateApplicationDTO createApplicationDTO, MultipartFile cv) {
        JobOffer jobOffer = jobOfferRepository.findById(createApplicationDTO.getJobOfferId())
                .orElseThrow(() -> new RuntimeException("Offre d'emploi non trouvée"));

        if (!jobOffer.getIsActive()) {
            throw new RuntimeException("Cette offre n'est plus disponible");
        }

        if (applicationRepository.existsByEmailAndJobOfferId(
                createApplicationDTO.getEmail(),
                createApplicationDTO.getJobOfferId())) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }

        User user;
        String accessCode = null;
        boolean isNewUser = false;

        Optional<User> existingUser = userRepository.findByEmail(createApplicationDTO.getEmail());

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            isNewUser = true;
            accessCode = generateAccessCode();

            user = User.builder()
                    .firstname(createApplicationDTO.getFirstname())
                    .lastname(createApplicationDTO.getLastname())
                    .email(createApplicationDTO.getEmail())
                    .phone(createApplicationDTO.getPhone())
                    .birthdate(createApplicationDTO.getBirthdate())
                    .address(mapToAddress(createApplicationDTO.getAddress()))
                    .role(UserRole.CANDIDAT)
                    .password(passwordEncoder.encode(accessCode))
                    .accessCode(accessCode)
                    .codeExpiration(LocalDateTime.now().plusDays(30))
                    .mustChangePassword(true)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            user = userRepository.save(user);
        }

        Application application = Application.builder()
                .firstname(createApplicationDTO.getFirstname())
                .lastname(createApplicationDTO.getLastname())
                .email(createApplicationDTO.getEmail())
                .phone(createApplicationDTO.getPhone())
                .coverLetter(createApplicationDTO.getCoverLetter())
                .status(ApplicationStatus.EN_ATTENTE)
                .applicationDate(LocalDateTime.now())
                .jobOffer(jobOffer)
                .user(user)
                .build();

        Application savedApplication = applicationRepository.save(application);

        return mapToApplicationDTO(savedApplication);
    }

    @Override
    public ApplicationDTO getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
        return mapToApplicationDTO(application);
    }

    @Override
    public List<ApplicationDTO> getMyApplications(String email) {
        return applicationRepository.findByEmail(email).stream()
                .map(this::mapToApplicationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getAllApplications(String status, Long jobOfferId, String email) {
        List<Application> applications;

        if (status != null && !status.isEmpty()) {
            ApplicationStatus applicationStatus = ApplicationStatus.valueOf(status);
            applications = applicationRepository.findByStatus(applicationStatus);
        } else if (jobOfferId != null) {
            applications = applicationRepository.findByJobOfferId(jobOfferId);
        } else if (email != null && !email.isEmpty()) {
            applications = applicationRepository.findByEmail(email);
        } else {
            applications = applicationRepository.findAll();
        }

        return applications.stream()
                .map(this::mapToApplicationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getApplicationsByJobOffer(Long jobOfferId) {
        return applicationRepository.findByJobOfferId(jobOfferId).stream()
                .map(this::mapToApplicationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status).stream()
                .map(this::mapToApplicationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDTO processApplication(Long id, ProcessApplicationDTO processApplicationDTO) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        ApplicationStatus currentStatus = application.getStatus();
        ApplicationStatus newStatus = processApplicationDTO.getStatus();

        if (currentStatus == ApplicationStatus.REFUSE || currentStatus == ApplicationStatus.EMBAUCHE) {
            throw new RuntimeException("Cette candidature ne peut plus être modifiée");
        }

        if (currentStatus == ApplicationStatus.EN_ATTENTE && newStatus != ApplicationStatus.EN_COURS) {
            throw new RuntimeException("Une candidature en attente doit d'abord être mise en cours d'évaluation");
        }

        if (newStatus == ApplicationStatus.ENTRETIEN_TERMINE) {
            if (currentStatus != ApplicationStatus.ACCEPTE_ENTRETIEN) {
                throw new RuntimeException("Seules les candidatures convoquées peuvent passer à 'Entretien terminé'");
            }
            List<Interview> interviews = interviewRepository.findByApplicationId(id);
            long completedInterviews = interviews.stream()
                    .filter(interview -> interview.getStatus() == InterviewStatus.TERMINE)
                    .count();

            if (completedInterviews == 0) {
                throw new RuntimeException("Au moins un entretien terminé est requis pour ce statut");
            }
        }

        if (newStatus == ApplicationStatus.EMBAUCHE || newStatus == ApplicationStatus.REFUSE_APRES_ENTRETIEN) {
            if (currentStatus != ApplicationStatus.ENTRETIEN_TERMINE) {
                throw new RuntimeException("La candidature doit avoir le statut 'Entretien terminé' pour cette décision");
            }
        }

        if ((newStatus == ApplicationStatus.REFUSE || newStatus == ApplicationStatus.REFUSE_APRES_ENTRETIEN)
                && (processApplicationDTO.getComment() == null || processApplicationDTO.getComment().trim().isEmpty())) {
            throw new RuntimeException("Un commentaire est requis pour justifier le refus");
        }

        application.setStatus(newStatus);
        application.setComment(processApplicationDTO.getComment());
        application.setProcessedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Application updatedApplication = applicationRepository.save(application);
        return mapToApplicationDTO(updatedApplication);
    }

    @Override
    public ApplicationDTO updateApplication(Long id, UpdateApplicationDTO updateApplicationDTO) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        if (updateApplicationDTO.getFirstname() != null) {
            application.setFirstname(updateApplicationDTO.getFirstname());
        }
        if (updateApplicationDTO.getLastname() != null) {
            application.setLastname(updateApplicationDTO.getLastname());
        }
        if (updateApplicationDTO.getEmail() != null) {
            application.setEmail(updateApplicationDTO.getEmail());
        }
        if (updateApplicationDTO.getPhone() != null) {
            application.setPhone(updateApplicationDTO.getPhone());
        }
        if (updateApplicationDTO.getCoverLetter() != null) {
            application.setCoverLetter(updateApplicationDTO.getCoverLetter());
        }
        if (updateApplicationDTO.getStatus() != null) {
            application.setStatus(updateApplicationDTO.getStatus());
        }
        if (updateApplicationDTO.getComment() != null) {
            application.setComment(updateApplicationDTO.getComment());
        }

        application.setUpdatedAt(LocalDateTime.now());

        Application updatedApplication = applicationRepository.save(application);
        return mapToApplicationDTO(updatedApplication);
    }

    private String generateAccessCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }

        return code.toString();
    }

    private ApplicationDTO mapToApplicationDTO(Application application) {
        return ApplicationDTO.builder()
                .id(application.getId())
                .firstname(application.getFirstname())
                .lastname(application.getLastname())
                .email(application.getEmail())
                .phone(application.getPhone())
                .birthdate(application.getUser() != null ? application.getUser().getBirthdate() : null)
                .address(application.getUser() != null ? mapToAddressDTO(application.getUser().getAddress()) : null)
                .cvPath(application.getCvPath())
                .coverLetter(application.getCoverLetter())
                .applicationDate(application.getApplicationDate())
                .status(application.getStatus())
                .processedAt(application.getProcessedAt())
                .comment(application.getComment())
                .updatedAt(application.getUpdatedAt())
                .jobOffer(mapToJobOfferDTO(application.getJobOffer()))
                .user(application.getUser() != null ? mapToUserDTO(application.getUser()) : null)
                .build();
    }

    private JobOfferDTO mapToJobOfferDTO(JobOffer jobOffer) {
        return JobOfferDTO.builder()
                .id(jobOffer.getId())
                .title(jobOffer.getTitle())
                .contractType(jobOffer.getContractType())
                .specialty(jobOffer.getSpecialty())
                .content(jobOffer.getContent())
                .creationDate(jobOffer.getCreationDate())
                .isActive(jobOffer.getIsActive())
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .birthdate(user.getBirthdate())
                .role(user.getRole())
                .address(mapToAddressDTO(user.getAddress()))
                .isActive(user.getIsActive())
                .mustChangePassword(user.getMustChangePassword())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private Address mapToAddress(AddressDTO addressDTO) {
        if (addressDTO == null) {
            return null;
        }
        return Address.builder()
                .street(addressDTO.getStreet())
                .number(addressDTO.getNumber())
                .postalCode(addressDTO.getPostalCode())
                .city(addressDTO.getCity())
                .country(addressDTO.getCountry())
                .build();
    }

    private AddressDTO mapToAddressDTO(Address address) {
        if (address == null) {
            return null;
        }
        return AddressDTO.builder()
                .id(address.getId())
                .street(address.getStreet())
                .number(address.getNumber())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .country(address.getCountry())
                .build();
    }
}