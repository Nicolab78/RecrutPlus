package integration.service;

import static org.junit.jupiter.api.Assertions.*;

import com.recrutplus.dto.auth.AuthResponseDTO;
import com.recrutplus.dto.auth.LoginDTO;
import com.recrutplus.model.User;
import com.recrutplus.model.enums.UserRole;
import com.recrutplus.repository.UserRepository;
import com.recrutplus.service.impl.AuthService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.SneakyThrows;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = com.recrutplus.RecrutplusApplication.class)
@ActiveProfiles("test")
@Transactional
class AuthServiceIntegrationTest {

  @Autowired private AuthService authService;

  @Autowired private UserRepository userRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  private User user;
  private LoginDTO loginDTO;

  @BeforeAll
  static void setup() {}

  @AfterAll
  static void tearDown() {}

  @BeforeEach
  @SneakyThrows
  void init() {
    user =
        User.builder()
            .firstname("test")
            .lastname("test")
            .email("test@mail.com")
            .password(passwordEncoder.encode("MonMotDePasse1!"))
            .role(UserRole.CANDIDAT)
            .isActive(true)
            .mustChangePassword(false)
            .createdAt(LocalDateTime.now())
            .build();

    userRepository.save(user);

    loginDTO = LoginDTO.builder().email("test@mail.com").password("MonMotDePasse1!").build();
  }

  @AfterEach
  void cleanup() {}

  @SneakyThrows
  @Test
  @DisplayName("Login avec credentials valides → token retourné")
  void login_shouldReturnToken_whenCredentialsAreValid() {
    // GIVEN
    // user déjà sauvegardé dans init()

    // WHEN
    AuthResponseDTO response = authService.login(loginDTO);

    // THEN
    assertNotNull(response.getToken());
    assertEquals("test@mail.com", response.getUser().getEmail());
  }

  @SneakyThrows
  @Test
  @DisplayName("Login avec email inexistant → exception")
  void login_shouldThrow_whenEmailNotFound() {
    // GIVEN
    LoginDTO unknownEmail =
        LoginDTO.builder().email("inconnu@mail.com").password("MonMotDePasse1!").build();

    // WHEN / THEN
    assertThrows(RuntimeException.class, () -> authService.login(unknownEmail));
  }

  @SneakyThrows
  @Test
  @DisplayName("Login avec mauvais mot de passe → exception")
  void login_shouldThrow_whenPasswordIsWrong() {
    // GIVEN
    LoginDTO wrongPassword =
        LoginDTO.builder().email("test@mail.com").password("MauvaisMotDePasse!").build();

    // WHEN / THEN
    assertThrows(RuntimeException.class, () -> authService.login(wrongPassword));
  }

  @SneakyThrows
  @Test
  @DisplayName("Login avec compte désactivé → exception")
  void login_shouldThrow_whenAccountIsInactive() {
    // GIVEN
    user.setIsActive(false);
    userRepository.save(user);

    // WHEN / THEN
    assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
  }

  @SneakyThrows
  @Test
  @DisplayName("Login avec code d'accès valide → token retourné")
  void login_shouldReturnToken_whenAccessCodeIsValid() {
    // GIVEN
    String accessCode = "ABC12345";
    user.setAccessCode(accessCode);
    user.setPassword(passwordEncoder.encode(accessCode));
    user.setCodeExpiration(LocalDateTime.now().plusDays(10));
    userRepository.save(user);

    LoginDTO dtoWithCode = LoginDTO.builder().email("test@mail.com").password(accessCode).build();

    // WHEN
    AuthResponseDTO response = authService.login(dtoWithCode);

    // THEN
    assertNotNull(response.getToken());
  }

  @SneakyThrows
  @Test
  @DisplayName("Login avec code d'accès expiré → exception")
  void login_shouldThrow_whenAccessCodeIsExpired() {
    // GIVEN
    String accessCode = "ABC12345";
    user.setAccessCode(accessCode);
    user.setCodeExpiration(LocalDateTime.now().minusDays(1));
    userRepository.save(user);

    LoginDTO dtoWithCode = LoginDTO.builder().email("jean@mail.com").password(accessCode).build();

    // WHEN / THEN
    assertThrows(RuntimeException.class, () -> authService.login(dtoWithCode));
  }
}
