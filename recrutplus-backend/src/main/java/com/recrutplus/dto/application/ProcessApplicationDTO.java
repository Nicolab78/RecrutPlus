package com.recrutplus.dto.application;

import com.recrutplus.model.enums.ApplicationStatus;
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