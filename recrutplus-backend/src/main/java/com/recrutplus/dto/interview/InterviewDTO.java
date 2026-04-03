package com.recrutplus.dto.interview;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.dto.application.ApplicationDTO;
import com.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.model.enums.InterviewType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewDTO {
    private Long id;
    private LocalDateTime interviewDate;
    private InterviewType type;
    private String visioLink;
    private AddressDTO address;
    private InterviewStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime cancelledAt;
    private ApplicationDTO application;
}