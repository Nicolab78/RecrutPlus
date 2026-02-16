package com.recrutplus.recrutplus.dto.application;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApplicationDTO {

    private Long jobOfferId;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private AddressDTO address;
    private String coverLetter;
}
