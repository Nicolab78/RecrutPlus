package com.recrutplus.recrutplus.dto.application;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.dto.joboffer.JobOfferDTO;
import com.recrutplus.recrutplus.dto.user.UserDTO;
import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationDTO {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private AddressDTO address;
    private String cvPath;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime applicationDate;
    private LocalDateTime processedAt;
    private String comment;
    private LocalDateTime updatedAt;
    private JobOfferDTO jobOffer;
    private UserDTO user;
}