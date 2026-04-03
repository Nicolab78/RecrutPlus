package com.recrutplus.dto.interview;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.model.enums.InterviewType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInterviewDTO {
    private LocalDateTime interviewDate;
    private InterviewType type;
    private String visioLink;
    private AddressDTO address;
    private InterviewStatus status;
    private String notes;
}