package com.recrutplus.dto.joboffer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.model.enums.ContractType;
import com.recrutplus.model.enums.Specialty;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobOfferDTO {

  private Long id;
  private String title;
  private Specialty specialty;
  private ContractType contractType;
  private String content;
  private AddressDTO address;
  private Double salary;
  private Boolean isActive;
  private LocalDateTime creationDate;
  private LocalDateTime updatedAt;
  private Integer applicationsCount;
}
