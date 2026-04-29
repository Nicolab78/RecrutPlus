package com.recrutplus.dto.application;

import com.recrutplus.dto.address.AddressDTO;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
