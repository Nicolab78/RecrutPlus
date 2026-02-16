package com.recrutplus.recrutplus.dto.application;

import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessApplicationDTO {

    private ApplicationStatus status;
    private String comment;
}