package com.recrutplus.repository;

import com.recrutplus.model.Interview;
import com.recrutplus.model.enums.InterviewStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

  List<Interview> findByStatus(InterviewStatus status);

  @Query("SELECT i FROM Interview i WHERE i.application.user.email = :email")
  List<Interview> findByUserId(@Param("email") String email);

  @Query("SELECT i FROM Interview i WHERE i.application.id = :applicationId")
  List<Interview> findByApplicationId(@Param("applicationId") Long applicationId);
}
