package com.recrutplus.dto.user;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.model.enums.UserRole;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String phone;
  private LocalDate birthdate;
  private UserRole role;
  private AddressDTO address;
  private Boolean isActive;
  private Boolean mustChangePassword;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
