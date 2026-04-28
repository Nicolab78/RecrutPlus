package com.recrutplus.service.interfaces;

import com.recrutplus.dto.interview.CreateInterviewDTO;
import com.recrutplus.dto.interview.InterviewDTO;
import com.recrutplus.dto.interview.UpdateInterviewDTO;
import com.recrutplus.model.enums.InterviewStatus;

import java.util.List;

public interface IInterviewService {

    InterviewDTO createInterview(CreateInterviewDTO createInterviewDTO);

    InterviewDTO getInterviewById(Long id);

    List<InterviewDTO> getAllInterviews(InterviewStatus status);

    List<InterviewDTO> getMyInterviews(String email);

    InterviewDTO updateInterview(Long id, UpdateInterviewDTO updateInterviewDTO);


}