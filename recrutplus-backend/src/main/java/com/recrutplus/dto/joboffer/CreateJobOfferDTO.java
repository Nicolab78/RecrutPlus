package com.recrutplus.dto.joboffer;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.model.enums.ContractType;
import com.recrutplus.model.enums.Specialty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobOfferDTO {

    private String title;
    private ContractType contractType;
    private Specialty specialty;
    private String content;
    private AddressDTO address;
    private Double salary;
}