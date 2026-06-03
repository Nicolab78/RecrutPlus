package integration.service;

import static org.junit.jupiter.api.Assertions.*;

import com.recrutplus.dto.application.ApplicationDTO;
import com.recrutplus.dto.application.ProcessApplicationDTO;
import com.recrutplus.model.Application;
import com.recrutplus.model.Interview;
import com.recrutplus.model.JobOffer;
import com.recrutplus.model.User;
import com.recrutplus.model.enums.*;
import com.recrutplus.repository.ApplicationRepository;
import com.recrutplus.repository.InterviewRepository;
import com.recrutplus.repository.JobOfferRepository;
import com.recrutplus.repository.UserRepository;
import com.recrutplus.service.impl.ApplicationService;
import com.recrutplus.service.impl.EmailService;
import com.recrutplus.service.impl.GridFsService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.SneakyThrows;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(classes = com.recrutplus.RecrutplusApplication.class)
@ActiveProfiles("test")
@Transactional
class ApplicationServiceIntegrationTest {

  @Autowired private ApplicationService applicationService;

  @Autowired private ApplicationRepository applicationRepository;

  @Autowired private JobOfferRepository jobOfferRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private InterviewRepository interviewRepository;

  @MockitoBean private EmailService emailService;

  @MockitoBean private GridFsService gridFsService;

  private Application application;
  private ProcessApplicationDTO processDTO;

  @BeforeAll
  static void setup() {}

  @AfterAll
  static void tearDown() {}

  @BeforeEach
  @SneakyThrows
  void init() {
    User user =
        User.builder()
            .firstname("test")
            .lastname("test")
            .email("test@mail.com")
            .password("hashedPassword")
            .role(UserRole.CANDIDAT)
            .isActive(true)
            .mustChangePassword(false)
            .createdAt(LocalDateTime.now())
            .build();
    userRepository.save(user);

    JobOffer jobOffer =
        JobOffer.builder()
            .title("Dev Java")
            .content("Description du poste")
            .contractType(ContractType.CDI)
            .specialty(Specialty.IT)
            .isActive(true)
            .creationDate(LocalDateTime.now())
            .build();
    jobOfferRepository.save(jobOffer);

    application =
        Application.builder()
            .firstname("test")
            .lastname("test")
            .email("test@mail.com")
            .phone("0600000000")
            .coverLetter("Lettre de motivation")
            .status(ApplicationStatus.EN_ATTENTE)
            .applicationDate(LocalDateTime.now())
            .jobOffer(jobOffer)
            .user(user)
            .build();
    applicationRepository.save(application);

    processDTO =
        ProcessApplicationDTO.builder().status(ApplicationStatus.EN_COURS).comment(null).build();
  }

  @AfterEach
  void cleanup() {}

  @SneakyThrows
  @Test
  @DisplayName("Candidature inexistante → exception")
  void processApplication_shouldThrow_whenApplicationNotFound() {
    // GIVEN
    Long fakeId = 9999L;

    // WHEN / THEN
    assertThrows(
        RuntimeException.class, () -> applicationService.processApplication(fakeId, processDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("Candidature déjà refusée → exception")
  void processApplication_shouldThrow_whenAlreadyRefused() {
    // GIVEN
    application.setStatus(ApplicationStatus.REFUSE);
    applicationRepository.save(application);

    // WHEN / THEN
    assertThrows(
        RuntimeException.class,
        () -> applicationService.processApplication(application.getId(), processDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("Candidature déjà embauchée → exception")
  void processApplication_shouldThrow_whenAlreadyHired() {
    // GIVEN
    application.setStatus(ApplicationStatus.EMBAUCHE);
    applicationRepository.save(application);

    // WHEN / THEN
    assertThrows(
        RuntimeException.class,
        () -> applicationService.processApplication(application.getId(), processDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("EN_ATTENTE → autre que EN_COURS → exception")
  void processApplication_shouldThrow_whenEnAttenteToInvalidStatus() {
    // GIVEN
    processDTO =
        ProcessApplicationDTO.builder().status(ApplicationStatus.REFUSE).comment("Refus").build();

    // WHEN / THEN
    assertThrows(
        RuntimeException.class,
        () -> applicationService.processApplication(application.getId(), processDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("REFUSE sans commentaire → exception")
  void processApplication_shouldThrow_whenRefuseWithoutComment() {
    // GIVEN
    application.setStatus(ApplicationStatus.EN_COURS);
    applicationRepository.save(application);

    processDTO =
        ProcessApplicationDTO.builder().status(ApplicationStatus.REFUSE).comment(null).build();

    // WHEN / THEN
    assertThrows(
        RuntimeException.class,
        () -> applicationService.processApplication(application.getId(), processDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("ENTRETIEN_TERMINE sans entretien terminé → exception")
  void processApplication_shouldThrow_whenNoCompletedInterview() {
    // GIVEN
    application.setStatus(ApplicationStatus.ACCEPTE_ENTRETIEN);
    applicationRepository.save(application);

    processDTO =
        ProcessApplicationDTO.builder().status(ApplicationStatus.ENTRETIEN_TERMINE).build();

    // WHEN / THEN
    assertThrows(
        RuntimeException.class,
        () -> applicationService.processApplication(application.getId(), processDTO));
  }

  @SneakyThrows
  @Test
  @WithMockUser(authorities = "RH")
  @DisplayName("EN_ATTENTE → EN_COURS → statut mis à jour en BDD")
  void processApplication_shouldUpdateStatus_whenEnAttenteToEnCours() {
    // GIVEN
    // application déjà EN_ATTENTE dans init()

    // WHEN
    ApplicationDTO result = applicationService.processApplication(application.getId(), processDTO);

    // THEN
    assertEquals(ApplicationStatus.EN_COURS, result.getStatus());
    Application updated = applicationRepository.findById(application.getId()).orElseThrow();
    assertEquals(ApplicationStatus.EN_COURS, updated.getStatus());
  }

  @SneakyThrows
  @Test
  @WithMockUser(authorities = "RH")
  @DisplayName("ENTRETIEN_TERMINE avec entretien terminé → statut mis à jour en BDD")
  void processApplication_shouldUpdateStatus_whenEntretienTermineWithCompletedInterview() {
    // GIVEN
    application.setStatus(ApplicationStatus.ACCEPTE_ENTRETIEN);
    applicationRepository.save(application);

    Interview interview =
        Interview.builder()
            .application(application)
            .status(InterviewStatus.TERMINE)
            .createdAt(LocalDateTime.now())
            .interviewDate(LocalDateTime.now())
            .type(InterviewType.PRESENTIEL)
            .build();
    interviewRepository.save(interview);

    processDTO =
        ProcessApplicationDTO.builder().status(ApplicationStatus.ENTRETIEN_TERMINE).build();

    // WHEN
    ApplicationDTO result = applicationService.processApplication(application.getId(), processDTO);

    // THEN
    assertEquals(ApplicationStatus.ENTRETIEN_TERMINE, result.getStatus());
    Application updated = applicationRepository.findById(application.getId()).orElseThrow();
    assertEquals(ApplicationStatus.ENTRETIEN_TERMINE, updated.getStatus());
  }
}
