package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.dto.joboffer.*;
import com.recrutplus.recrutplus.model.Address;
import com.recrutplus.recrutplus.model.JobOffer;
import com.recrutplus.recrutplus.model.enums.ContractType;
import com.recrutplus.recrutplus.model.enums.Specialty;
import com.recrutplus.recrutplus.repository.JobOfferRepository;
import com.recrutplus.recrutplus.service.interfaces.IJobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobOfferService implements IJobOfferService {

    private final JobOfferRepository jobOfferRepository;

    @Override
    public List<JobOfferDTO> getAllJobOffers() {
        return jobOfferRepository.findAll().stream()
                .map(this::mapToJobOfferDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobOfferDTO> getActiveJobOffers() {
        return jobOfferRepository.findByIsActiveTrue().stream()
                .map(this::mapToJobOfferDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobOfferDTO getJobOfferById(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        return mapToJobOfferDTO(jobOffer);
    }

    @Override
    public List<JobOfferDTO> searchJobOffers(String keyword, Specialty specialty, ContractType contractType) {
        List<JobOffer> jobOffers = jobOfferRepository.findByIsActiveTrue().stream()
                .filter(jobOffer -> {
                    boolean matches = true;

                    if (keyword != null && !keyword.isEmpty()) {
                        String lowerKeyword = keyword.toLowerCase();
                        matches = jobOffer.getTitle().toLowerCase().contains(lowerKeyword) ||
                                jobOffer.getContent().toLowerCase().contains(lowerKeyword) ||
                                (jobOffer.getAddress() != null &&
                                        jobOffer.getAddress().getCity() != null &&
                                        jobOffer.getAddress().getCity().toLowerCase().contains(lowerKeyword));
                    }

                    if (specialty != null) {
                        matches = matches && jobOffer.getSpecialty() == specialty;
                    }

                    if (contractType != null) {
                        matches = matches && jobOffer.getContractType() == contractType;
                    }

                    return matches;
                })
                .collect(Collectors.toList());

        return jobOffers.stream()
                .map(this::mapToJobOfferDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobOfferDTO> getJobOffersBySpecialty(Specialty specialty) {
        List<JobOffer> jobOffers = jobOfferRepository.findAll().stream()
                .filter(jobOffer -> jobOffer.getSpecialty() == specialty && jobOffer.getIsActive())
                .collect(Collectors.toList());

        return jobOffers.stream()
                .map(this::mapToJobOfferDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Specialty> getAllSpecialties() {
        return Arrays.asList(Specialty.values());
    }

    @Override
    public List<ContractType> getAllContractTypes() {
        return Arrays.asList(ContractType.values());
    }

    @Override
    public JobOfferDTO createJobOffer(CreateJobOfferDTO createJobOfferDTO) {
        JobOffer jobOffer = JobOffer.builder()
                .title(createJobOfferDTO.getTitle())
                .contractType(createJobOfferDTO.getContractType())
                .specialty(createJobOfferDTO.getSpecialty())
                .address(mapToAddress(createJobOfferDTO.getAddress()))
                .salary(createJobOfferDTO.getSalary())
                .content(createJobOfferDTO.getContent())
                .isActive(true)
                .creationDate(LocalDateTime.now())
                .build();

        JobOffer savedJobOffer = jobOfferRepository.save(jobOffer);
        return mapToJobOfferDTO(savedJobOffer);
    }

    @Override
    public JobOfferDTO updateJobOffer(Long id, UpdateJobOfferDTO updateJobOfferDTO) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        if (updateJobOfferDTO.getTitle() != null) {
            jobOffer.setTitle(updateJobOfferDTO.getTitle());
        }
        if (updateJobOfferDTO.getContractType() != null) {
            jobOffer.setContractType(updateJobOfferDTO.getContractType());
        }
        if (updateJobOfferDTO.getSpecialty() != null) {
            jobOffer.setSpecialty(updateJobOfferDTO.getSpecialty());
        }
        if (updateJobOfferDTO.getAddress() != null) {
            if (jobOffer.getAddress() != null) {
                updateAddress(jobOffer.getAddress(), updateJobOfferDTO.getAddress());
            } else {
                jobOffer.setAddress(mapToAddress(updateJobOfferDTO.getAddress()));
            }
        }
        if (updateJobOfferDTO.getSalary() != null) {
            jobOffer.setSalary(updateJobOfferDTO.getSalary());
        }
        if (updateJobOfferDTO.getContent() != null) {
            jobOffer.setContent(updateJobOfferDTO.getContent());
        }

        if (updateJobOfferDTO.getIsActive() != null) {
            jobOffer.setIsActive(updateJobOfferDTO.getIsActive());
        }

        jobOffer.setUpdatedAt(LocalDateTime.now());

        JobOffer updatedJobOffer = jobOfferRepository.save(jobOffer);
        return mapToJobOfferDTO(updatedJobOffer);
    }

    @Override
    public void deleteJobOffer(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        jobOffer.setIsActive(false);
        jobOffer.setUpdatedAt(LocalDateTime.now());
        jobOfferRepository.save(jobOffer);
    }

    private JobOfferDTO mapToJobOfferDTO(JobOffer jobOffer) {
        return JobOfferDTO.builder()
                .id(jobOffer.getId())
                .title(jobOffer.getTitle())
                .contractType(jobOffer.getContractType())
                .specialty(jobOffer.getSpecialty())
                .content(jobOffer.getContent())
                .address(mapToAddressDTO(jobOffer.getAddress()))
                .salary(jobOffer.getSalary())
                .creationDate(jobOffer.getCreationDate())
                .updatedAt(jobOffer.getUpdatedAt())
                .isActive(jobOffer.getIsActive())
                .applicationsCount(jobOffer.getApplications() != null ? jobOffer.getApplications().size() : 0)
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