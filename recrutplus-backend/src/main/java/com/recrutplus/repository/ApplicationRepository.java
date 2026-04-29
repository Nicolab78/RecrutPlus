package com.recrutplus.repository;

import com.recrutplus.model.Application;
import com.recrutplus.model.enums.ApplicationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

  boolean existsByEmailAndJobOfferId(String email, Long jobOfferId);

  List<Application> findByEmail(String email);

  List<Application> findByJobOfferId(Long jobOfferId);

  List<Application> findByStatus(ApplicationStatus status);
}
