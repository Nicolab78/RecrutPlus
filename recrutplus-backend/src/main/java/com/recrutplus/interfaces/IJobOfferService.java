package com.recrutplus.interfaces;

import com.recrutplus.dto.joboffer.*;
import com.recrutplus.model.enums.ContractType;
import com.recrutplus.model.enums.Specialty;

import java.util.List;

public interface IJobOfferService {

    List<JobOfferDTO> getAllJobOffers();

    List<JobOfferDTO> getActiveJobOffers();

    JobOfferDTO getJobOfferById(Long id);

    List<JobOfferDTO> searchJobOffers(String keyword, Specialty specialty, ContractType contractType);

    List<JobOfferDTO> getJobOffersBySpecialty(Specialty specialty);

    List<Specialty> getAllSpecialties();

    List<ContractType> getAllContractTypes();

    JobOfferDTO createJobOffer(CreateJobOfferDTO createJobOfferDTO);

    JobOfferDTO updateJobOffer(Long id, UpdateJobOfferDTO updateJobOfferDTO);

    void deleteJobOffer(Long id);
}