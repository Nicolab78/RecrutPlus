package com.recrutplus.recrutplus.dto.joboffer;
import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.model.enums.ContractType;
import com.recrutplus.recrutplus.model.enums.Specialty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobOfferDTO {
    private String title;

    private Specialty specialty;
    private ContractType contractType;
    private String content;
    private AddressDTO address;
    private Double salary;
    private Boolean isActive;
}
