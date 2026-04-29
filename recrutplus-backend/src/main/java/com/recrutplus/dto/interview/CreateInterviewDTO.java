package com.recrutplus.dto.interview;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.model.enums.InterviewType;
import java.time.LocalDateTime;
import lombok.*;

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
