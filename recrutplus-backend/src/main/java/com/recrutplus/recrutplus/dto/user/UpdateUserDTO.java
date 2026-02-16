package com.recrutplus.recrutplus.dto.user;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {

    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private UserRole role;
    private String password;
    private AddressDTO address;
    private Boolean isActive;
}