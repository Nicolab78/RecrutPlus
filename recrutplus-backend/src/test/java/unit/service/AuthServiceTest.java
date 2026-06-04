package unit.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.recrutplus.dto.auth.LoginDTO;
import com.recrutplus.model.User;
import com.recrutplus.repository.ApplicationRepository;
import com.recrutplus.repository.UserRepository;
import com.recrutplus.security.JwtService;
import com.recrutplus.service.impl.AuthService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private ApplicationRepository applicationRepository;
  @Mock private PasswordEncoder passwordEncoder;
  @Mock private JwtService jwtService;

  @InjectMocks private AuthService authService;

  private LoginDTO loginDTO;
  private User activeUser;

  @BeforeAll
  static void setup() {}

  @AfterAll
  static void tearDown() {}

  @BeforeEach
  void init() {
    loginDTO = LoginDTO.builder().email("test@mail.com").password("MonMotDePasse1!").build();

    activeUser =
        User.builder().email("test@mail.com").password("$2a$hashedPassword").isActive(true).build();
  }

  @AfterEach
  void cleanup() {}

  @Test
  @DisplayName("Email inexistant → exception")
  void login_shouldThrow_whenEmailNotFound() {
    when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
  }

  @Test
  @DisplayName("Compte désactivé → exception")
  void login_shouldThrow_whenAccountIsInactive() {
    User inactiveUser =
        User.builder()
            .email("test@mail.com")
            .password("$2a$hashedPassword")
            .isActive(false)
            .build();
    when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(inactiveUser));

    assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
  }

  @Test
  @DisplayName("Mauvais mot de passe et pas de code d'accès → exception")
  void login_shouldThrow_whenPasswordIsWrongAndNoAccessCode() {
    when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(activeUser));
    when(passwordEncoder.matches(any(), any())).thenReturn(false);

    assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
  }

  @Test
  @DisplayName("Code d'accès expiré → exception")
  void login_shouldThrow_whenAccessCodeIsExpired() {
    User userWithExpiredCode =
        User.builder()
            .email("jean@mail.com")
            .password("$2a$hashedPassword")
            .isActive(true)
            .accessCode("$2a$hashedABC12345")
            .codeExpiration(LocalDateTime.now().minusDays(1))
            .build();

    LoginDTO dtoWithCode = LoginDTO.builder().email("jean@mail.com").password("ABC12345").build();

    when(userRepository.findByEmail("jean@mail.com")).thenReturn(Optional.of(userWithExpiredCode));
    when(passwordEncoder.matches("ABC12345", "$2a$hashedPassword")).thenReturn(false);
    when(passwordEncoder.matches("ABC12345", "$2a$hashedABC12345")).thenReturn(true);

    assertThrows(RuntimeException.class, () -> authService.login(dtoWithCode));
  }
}
