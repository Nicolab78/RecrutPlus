package com.recrutplus.recrutplus.dto.interview;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.model.enums.InterviewType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInterviewDTO {

    private Long applicationId;
    private LocalDateTime interviewDate;
    private InterviewType type;
    private String visioLink;
    private AddressDTO address;
    private String notes;
}