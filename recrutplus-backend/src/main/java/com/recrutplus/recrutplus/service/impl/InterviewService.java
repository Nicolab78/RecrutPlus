package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.dto.interview.*;
import com.recrutplus.recrutplus.dto.application.ApplicationDTO;
import com.recrutplus.recrutplus.dto.joboffer.JobOfferDTO;
import com.recrutplus.recrutplus.model.Address;
import com.recrutplus.recrutplus.model.Application;
import com.recrutplus.recrutplus.model.Interview;
import com.recrutplus.recrutplus.model.JobOffer;
import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import com.recrutplus.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.recrutplus.model.enums.InterviewType;
import com.recrutplus.recrutplus.repository.ApplicationRepository;
import com.recrutplus.recrutplus.repository.InterviewRepository;
import com.recrutplus.recrutplus.service.interfaces.IInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewService implements IInterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final EmailService emailService;

    @Override
    public InterviewDTO createInterview(CreateInterviewDTO dto) {
        Application application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        if (dto.getType() == InterviewType.VISIO) {
            if (dto.getVisioLink() == null || dto.getVisioLink().isEmpty()) {
                throw new RuntimeException("Le lien visio est requis pour un entretien en visio");
            }
            if (dto.getAddress() != null) {
                throw new RuntimeException("L'adresse n'est pas autorisée pour un entretien en visio");
            }
        }

        if (dto.getType() == InterviewType.PRESENTIEL) {
            if (dto.getVisioLink() != null && !dto.getVisioLink().isEmpty()) {
                throw new RuntimeException("Le lien visio n'est pas autorisé pour un entretien en présentiel");
            }
        }

        Address interviewAddress = null;
        if (dto.getType() == InterviewType.PRESENTIEL) {
            if (dto.getAddress() != null) {
                interviewAddress = mapToAddress(dto.getAddress());
            } else {
                Address jobOfferAddress = application.getJobOffer().getAddress();
                interviewAddress = Address.builder()
                        .street(jobOfferAddress.getStreet())
                        .number(jobOfferAddress.getNumber())
                        .postalCode(jobOfferAddress.getPostalCode())
                        .city(jobOfferAddress.getCity())
                        .country(jobOfferAddress.getCountry())
                        .build();
            }
        }

        Interview interview = Interview.builder()
                .interviewDate(dto.getInterviewDate())
                .type(dto.getType())
                .visioLink(dto.getVisioLink())
                .address(interviewAddress)
                .status(InterviewStatus.PLANIFIE)
                .notes(dto.getNotes())
                .createdAt(LocalDateTime.now())
                .application(application)
                .build();

        Interview saved = interviewRepository.save(interview);

        final Interview finalInterview = saved;
        final Application finalApplication = application;

        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(5000);
                String interviewDateFormatted = saved.getInterviewDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));

                emailService.sendInterviewInvitation(
                        finalApplication.getEmail(),
                        finalApplication.getFirstname() + " " + finalApplication.getLastname(),
                        finalApplication.getJobOffer().getTitle(),
                        interviewDateFormatted,
                        finalInterview.getType().toString(),
                        finalInterview.getVisioLink(),
                        finalInterview.getNotes()
                );

                System.out.println("Email invitation entretien envoyé en arrière-plan à : " + finalApplication.getEmail());
            } catch (Exception e) {
                System.err.println("Erreur envoi email invitation entretien: " + e.getMessage());
            }
        });

        return mapToInterviewDTO(saved);
    }

    @Override
    public InterviewDTO getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé"));
        return mapToInterviewDTO(interview);
    }

    @Override
    public List<InterviewDTO> getAllInterviews(InterviewStatus status) {
        List<Interview> interviews;

        if (status != null) {
            interviews = interviewRepository.findByStatus(status);
        } else {
            interviews = interviewRepository.findAll();
        }

        return interviews.stream()
                .map(this::mapToInterviewDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterviewDTO> getMyInterviews(String email) {
        return interviewRepository.findByUserId(email).stream()
                .map(this::mapToInterviewDTO)
                .collect(Collectors.toList());
    }


    @Override
    public InterviewDTO updateInterview(Long id, UpdateInterviewDTO dto) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé"));

        if (dto.getInterviewDate() != null) {
            interview.setInterviewDate(dto.getInterviewDate());
        }
        if (dto.getType() != null) {
            interview.setType(dto.getType());
        }
        if (dto.getVisioLink() != null) {
            interview.setVisioLink(dto.getVisioLink());
        }
        if (dto.getType() == InterviewType.PRESENTIEL) {
            interview.setVisioLink(null);
        }
        if (dto.getType() == InterviewType.VISIO) {
            interview.setAddress(null);
        }
        if (dto.getAddress() != null) {
            if (interview.getAddress() != null) {
                updateAddress(interview.getAddress(), dto.getAddress());
            } else {
                interview.setAddress(mapToAddress(dto.getAddress()));
            }
        }

        if (dto.getNotes() != null) {
            interview.setNotes(dto.getNotes());
        }

        if (dto.getStatus() != null) {
            InterviewStatus oldStatus = interview.getStatus();
            interview.setStatus(dto.getStatus());

            if (dto.getStatus() == InterviewStatus.TERMINE) {
                Application application = interview.getApplication();

                if (application.getStatus() == ApplicationStatus.ACCEPTE_ENTRETIEN) {
                    application.setStatus(ApplicationStatus.ENTRETIEN_TERMINE);
                    application.setComment("Entretien terminé - En attente de décision finale");
                    application.setUpdatedAt(LocalDateTime.now());
                    applicationRepository.save(application);
                }

                final Interview finalInterviewTermine = interview;
                final String customNotes = dto.getNotes();

                CompletableFuture.runAsync(() -> {
                    try {
                        Thread.sleep(10000);
                        String interviewDateFormatted = finalInterviewTermine.getInterviewDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));

                        String message = customNotes != null && !customNotes.trim().isEmpty()
                                ? customNotes
                                : "Votre entretien du " + interviewDateFormatted + " s'est bien déroulé. Nous reviendrons vers vous prochainement avec notre décision.";

                        emailService.sendStatusChange(
                                finalInterviewTermine.getApplication().getEmail(),
                                finalInterviewTermine.getApplication().getFirstname() + " " + finalInterviewTermine.getApplication().getLastname(),
                                finalInterviewTermine.getApplication().getJobOffer().getTitle(),
                                ApplicationStatus.ENTRETIEN_TERMINE,
                                message
                        );

                        System.out.println("Email entretien terminé envoyé à : " + finalInterviewTermine.getApplication().getEmail());
                    } catch (Exception e) {
                        System.err.println("Erreur envoi email entretien terminé: " + e.getMessage());
                    }
                });
            }

            if (dto.getStatus() == InterviewStatus.ANNULE && oldStatus != InterviewStatus.ANNULE) {
                final Interview finalInterview = interview;
                final String customReason = dto.getNotes();

                CompletableFuture.runAsync(() -> {
                    try {
                        Thread.sleep(10000);
                        String interviewDateFormatted = finalInterview.getInterviewDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));

                        String reason = customReason != null && !customReason.trim().isEmpty()
                                ? customReason
                                : "Nous nous excusons pour ce contretemps.";

                        emailService.sendInterviewCancellation(
                                finalInterview.getApplication().getEmail(),
                                finalInterview.getApplication().getFirstname() + " " + finalInterview.getApplication().getLastname(),
                                finalInterview.getApplication().getJobOffer().getTitle(),
                                interviewDateFormatted,
                                reason
                        );

                        System.out.println("Email annulation entretien envoyé via update à : " + finalInterview.getApplication().getEmail());
                    } catch (Exception e) {
                        System.err.println("Erreur envoi email annulation entretien: " + e.getMessage());
                    }
                });
            }
        }

        interview.setUpdatedAt(LocalDateTime.now());

        Interview updated = interviewRepository.save(interview);
        return mapToInterviewDTO(updated);
    }

    private InterviewDTO mapToInterviewDTO(Interview interview) {
        return InterviewDTO.builder()
                .id(interview.getId())
                .interviewDate(interview.getInterviewDate())
                .type(interview.getType())
                .visioLink(interview.getVisioLink())
                .address(mapToAddressDTO(interview.getAddress()))
                .status(interview.getStatus())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .cancelledAt(interview.getCancelledAt())
                .application(mapToApplicationDTO(interview.getApplication()))
                .build();
    }

    private ApplicationDTO mapToApplicationDTO(Application application) {
        return ApplicationDTO.builder()
                .id(application.getId())
                .firstname(application.getFirstname())
                .lastname(application.getLastname())
                .email(application.getEmail())
                .status(application.getStatus())
                .jobOffer(mapToJobOfferDTO(application.getJobOffer()))
                .build();
    }

    private JobOfferDTO mapToJobOfferDTO(JobOffer jobOffer) {
        return JobOfferDTO.builder()
                .id(jobOffer.getId())
                .title(jobOffer.getTitle())
                .specialty(jobOffer.getSpecialty())
                .contractType(jobOffer.getContractType())
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

    private void updateAddress(Address address, AddressDTO addressDTO) {
        if (addressDTO.getStreet() != null) {
            address.setStreet(addressDTO.getStreet());
        }
        if (addressDTO.getNumber() != null) {
            address.setNumber(addressDTO.getNumber());
        }
        if (addressDTO.getPostalCode() != null) {
            address.setPostalCode(addressDTO.getPostalCode());
        }
        if (addressDTO.getCity() != null) {
            address.setCity(addressDTO.getCity());
        }
        if (addressDTO.getCountry() != null) {
            address.setCountry(addressDTO.getCountry());
        }
    }
}