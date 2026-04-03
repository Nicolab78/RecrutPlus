package com.recrutplus.interfaces;

import com.recrutplus.dto.interview.*;
import com.recrutplus.model.enums.InterviewStatus;
import java.util.List;

public interface IInterviewService {

    InterviewDTO createInterview(CreateInterviewDTO createInterviewDTO);

    InterviewDTO getInterviewById(Long id);

    List<InterviewDTO> getAllInterviews(InterviewStatus status);

    List<InterviewDTO> getMyInterviews(String email);

    InterviewDTO updateInterview(Long id, UpdateInterviewDTO updateInterviewDTO);


}