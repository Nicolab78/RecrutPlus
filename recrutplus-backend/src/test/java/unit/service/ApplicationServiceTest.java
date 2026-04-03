package unit.service;

import com.recrutplus.dto.address.AddressDTO;
import com.recrutplus.dto.application.CreateApplicationDTO;
import com.recrutplus.dto.application.ProcessApplicationDTO;
import com.recrutplus.model.Application;
import com.recrutplus.model.Interview;
import com.recrutplus.model.JobOffer;
import com.recrutplus.model.enums.ApplicationStatus;
import com.recrutplus.model.enums.InterviewStatus;
import com.recrutplus.repository.ApplicationRepository;
import com.recrutplus.repository.InterviewRepository;
import com.recrutplus.repository.JobOfferRepository;
import com.recrutplus.repository.UserRepository;
import com.recrutplus.service.impl.ApplicationService;
import com.recrutplus.service.impl.EmailService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;
import java.util.Optional;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock private ApplicationRepository applicationRepository;
    @Mock private JobOfferRepository jobOfferRepository;
    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;
    @Mock private InterviewRepository interviewRepository;

    @InjectMocks private ApplicationService applicationService;

    private CreateApplicationDTO validDTO;
    private MultipartFile validCv;
    private JobOffer activeJobOffer;
    private Application application;
    private ProcessApplicationDTO processDTO;

    @BeforeAll
    static void setup() {
    }

    @AfterAll
    static void tearDown() {
    }

    @BeforeEach
    void init() {
        AddressDTO address = AddressDTO.builder()
                .street("12 rue de la Tech")
                .city("Paris")
                .postalCode("12345")
                .country("France")
                .build();

        validDTO = CreateApplicationDTO.builder()
                .jobOfferId(1L)
                .firstname("test")
                .lastname("test")
                .email("test@mail.com")
                .phone("0600000000")
                .coverLetter("Lettre de motivation")
                .birthdate(LocalDate.of(1995, 6, 15))
                .address(address)
                .build();

        validCv = new MockMultipartFile("cv", "cv.pdf", "application/pdf", "%PDF-valid content".getBytes());

        activeJobOffer = JobOffer.builder()
                .id(1L)
                .title("Dev Java")
                .isActive(true)
                .build();

        application = Application.builder()
                .id(1L)
                .email("test@mail.com")
                .firstname("test")
                .lastname("test")
                .status(ApplicationStatus.EN_ATTENTE)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.EN_COURS)
                .comment(null)
                .build();
    }

    @AfterEach
    void cleanup() {
    }

    @Test
    @DisplayName("CV null → exception")
    void submitApplication_shouldThrow_whenCvIsNull() {
        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, null));
    }

    @Test
    @DisplayName("CV vide → exception")
    void submitApplication_shouldThrow_whenCvIsEmpty() {
        MultipartFile emptyCv = new MockMultipartFile("cv", "cv.pdf", "application/pdf", new byte[0]);

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, emptyCv));
    }

    @Test
    @DisplayName("Extension pas .pdf → exception")
    void submitApplication_shouldThrow_whenExtensionIsNotPdf() {
        MultipartFile wrongExtension = new MockMultipartFile("cv", "cv.docx", "application/pdf", "%PDF-content".getBytes());

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, wrongExtension));
    }

    @Test
    @DisplayName("Content-type pas application/pdf → exception")
    void submitApplication_shouldThrow_whenContentTypeIsWrong() {
        MultipartFile wrongContentType = new MockMultipartFile("cv", "cv.pdf", "application/octet-stream", "%PDF-content".getBytes());

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, wrongContentType));
    }

    @Test
    @DisplayName("Signature PDF invalide → exception")
    void submitApplication_shouldThrow_whenPdfSignatureIsInvalid() {
        MultipartFile invalidPdf = new MockMultipartFile("cv", "cv.pdf", "application/pdf", "NOTAPDF!!!".getBytes());

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, invalidPdf));
    }


    // Submit

    @Test
    @DisplayName("Offre inexistante → exception")
    void submitApplication_shouldThrow_whenJobOfferNotFound() {
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, validCv));
    }

    @Test
    @DisplayName("Offre inactive → exception")
    void submitApplication_shouldThrow_whenJobOfferIsInactive() {
        JobOffer inactiveOffer = JobOffer.builder()
                .id(1L)
                .title("Dev Java")
                .isActive(false)
                .build();
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.of(inactiveOffer));

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, validCv));
    }

    @Test
    @DisplayName("Déjà candidaté à cette offre → exception")
    void submitApplication_shouldThrow_whenAlreadyApplied() {
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.of(activeJobOffer));
        when(applicationRepository.existsByEmailAndJobOfferId("jean@mail.com", 1L)).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> applicationService.submitApplication(validDTO, validCv));
    }

    @Test
    @DisplayName("Candidature inexistante → exception")
    void processApplication_shouldThrow_whenApplicationNotFound() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("Candidature déjà refusée → exception")
    void processApplication_shouldThrow_whenAlreadyRefused() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.REFUSE)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("Candidature déjà embauchée → exception")
    void processApplication_shouldThrow_whenAlreadyHired() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.EMBAUCHE)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("EN_ATTENTE → autre que EN_COURS → exception")
    void processApplication_shouldThrow_whenEnAttenteToInvalidStatus() {
        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.REFUSE)
                .comment("Refus")
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("ENTRETIEN_TERMINE sans venir de ACCEPTE_ENTRETIEN → exception")
    void processApplication_shouldThrow_whenEntretienTermineFromWrongStatus() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.EN_COURS)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.ENTRETIEN_TERMINE)
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("ENTRETIEN_TERMINE sans entretien terminé → exception")
    void processApplication_shouldThrow_whenNoCompletedInterview() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.ACCEPTE_ENTRETIEN)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.ENTRETIEN_TERMINE)
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(interviewRepository.findByApplicationId(1L)).thenReturn(List.of());

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("EMBAUCHE sans venir de ENTRETIEN_TERMINE → exception")
    void processApplication_shouldThrow_whenEmbaucheFromWrongStatus() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.EN_COURS)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.EMBAUCHE)
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("REFUSE_APRES_ENTRETIEN sans venir de ENTRETIEN_TERMINE → exception")
    void processApplication_shouldThrow_whenRefuseApresEntretienFromWrongStatus() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.EN_COURS)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.REFUSE_APRES_ENTRETIEN)
                .comment("Refus après entretien")
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("REFUSE sans commentaire → exception")
    void processApplication_shouldThrow_whenRefuseWithoutComment() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.EN_COURS)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.REFUSE)
                .comment(null)
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("REFUSE_APRES_ENTRETIEN sans commentaire → exception")
    void processApplication_shouldThrow_whenRefuseApresEntretienWithoutComment() {
        application = Application.builder()
                .id(1L)
                .status(ApplicationStatus.ENTRETIEN_TERMINE)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.REFUSE_APRES_ENTRETIEN)
                .comment("")
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class,
                () -> applicationService.processApplication(1L, processDTO));
    }

    @Test
    @DisplayName("EN_ATTENTE → EN_COURS → statut mis à jour")
    void processApplication_shouldUpdateStatus_whenEnAttenteToEnCours() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any())).thenReturn(application);

        applicationService.processApplication(1L, processDTO);

        verify(applicationRepository).save(argThat((Application app) ->
                app.getStatus() == ApplicationStatus.EN_COURS
        ));
    }

    @Test
    @DisplayName("ENTRETIEN_TERMINE avec entretien terminé → statut mis à jour")
    void processApplication_shouldUpdateStatus_whenEntretienTermineWithCompletedInterview() {
        application = Application.builder()
                .id(1L)
                .email("test@mail.com")
                .firstname("test")
                .lastname("test")
                .status(ApplicationStatus.ACCEPTE_ENTRETIEN)
                .jobOffer(JobOffer.builder().title("Dev Java").build())
                .build();

        processDTO = ProcessApplicationDTO.builder()
                .status(ApplicationStatus.ENTRETIEN_TERMINE)
                .build();

        Interview completedInterview = Interview.builder()
                .status(InterviewStatus.TERMINE)
                .build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(interviewRepository.findByApplicationId(1L)).thenReturn(List.of(completedInterview));
        when(applicationRepository.save(any())).thenReturn(application);

        applicationService.processApplication(1L, processDTO);

        verify(applicationRepository).save(argThat((Application app) ->
                app.getStatus() == ApplicationStatus.ENTRETIEN_TERMINE
        ));
    }
}