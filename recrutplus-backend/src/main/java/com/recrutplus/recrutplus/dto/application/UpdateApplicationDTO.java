package com.recrutplus.recrutplus.dto.application;

import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationDTO {

    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String coverLetter;
    private ApplicationStatus status;
    private String comment;
}