package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.dto.auth.*;
import com.recrutplus.recrutplus.dto.user.UserDTO;
import com.recrutplus.recrutplus.model.User;
import com.recrutplus.recrutplus.repository.UserRepository;
import com.recrutplus.recrutplus.security.JwtService;
import com.recrutplus.recrutplus.security.UserDetailsImpl;
import com.recrutplus.recrutplus.service.interfaces.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Compte désactivé");
        }

        boolean isAuthenticated = false;

        if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            isAuthenticated = true;
        }

        else if (user.getAccessCode() != null && user.getAccessCode().equals(loginDTO.getPassword())) {
            if (user.getCodeExpiration() != null && user.getCodeExpiration().isAfter(LocalDateTime.now())) {
                isAuthenticated = true;
            } else {
                throw new RuntimeException("Code d'accès expiré");
            }
        }

        if (!isAuthenticated) {
            throw new RuntimeException("Email ou mot de passe/code d'accès incorrect");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String jwtToken = jwtService.generateToken(userDetails);

        UserDTO userDto = mapToUserDTO(user);

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    @Override
    public void changePassword(ChangePasswordDTO changePasswordDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String newPassword = changePasswordDTO.getNewPassword();

        if (newPassword == null || newPassword.length() < 12) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 12 caractères");
        }

        if (!isPasswordStrong(newPassword)) {
            throw new RuntimeException("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial");
        }

        if (!user.getMustChangePassword()) {
            if (changePasswordDTO.getOldPassword() == null || changePasswordDTO.getOldPassword().isEmpty()) {
                throw new RuntimeException("L'ancien mot de passe est requis");
            }

            if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
                throw new RuntimeException("Ancien mot de passe incorrect");
            }
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    private boolean isPasswordStrong(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$";
        return password.matches(regex);
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .birthdate(user.getBirthdate())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .mustChangePassword(user.getMustChangePassword())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

    /*  Trigger Netoyage Code d'accès :

    DELIMITER $$

CREATE TRIGGER cleanup_access_codes
    BEFORE UPDATE ON user
    FOR EACH ROW
BEGIN
    -- Nettoyage automatique quand mustChangePassword passe à false
    IF OLD.mustChangePassword = TRUE AND NEW.mustChangePassword = FALSE THEN
        SET NEW.accessCode = NULL;
        SET NEW.codeExpiration = NULL;
    END IF;

    -- Nettoyage des codes expirés
    IF NEW.accessCode IS NOT NULL
       AND NEW.codeExpiration IS NOT NULL
       AND NEW.codeExpiration < NOW() THEN
        SET NEW.accessCode = NULL;
        SET NEW.codeExpiration = NULL;
    END IF;
END$$

DELIMITER ;

    */