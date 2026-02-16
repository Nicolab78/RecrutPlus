package com.recrutplus.recrutplus.repository;


import com.recrutplus.recrutplus.model.Interview;
import com.recrutplus.recrutplus.model.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    boolean existsByApplicationIdAndStatus(Long applicationId, InterviewStatus status);
    List<Interview> findByStatus(InterviewStatus status);
    @Query("SELECT i FROM Interview i WHERE i.application.user.email = :email")
    List<Interview> findByUserId(@Param("email") String email);


    @Query("SELECT i FROM Interview i WHERE i.application.id = :applicationId")
    List<Interview> findByApplicationId(@Param("applicationId") Long applicationId);
}
