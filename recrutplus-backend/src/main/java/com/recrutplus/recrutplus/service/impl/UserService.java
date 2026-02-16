package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.dto.address.AddressDTO;
import com.recrutplus.recrutplus.dto.user.CreateUserDTO;
import com.recrutplus.recrutplus.dto.user.UpdateUserDTO;
import com.recrutplus.recrutplus.dto.user.UserDTO;

import com.recrutplus.recrutplus.model.Address;
import com.recrutplus.recrutplus.model.User;
import com.recrutplus.recrutplus.model.enums.UserRole;
import com.recrutplus.recrutplus.repository.UserRepository;
import com.recrutplus.recrutplus.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements IUserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mapToUserDTO(user);
    }

    @Override
    public UserDTO updateProfile(UpdateUserDTO updateUserDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (updateUserDTO.getFirstname() != null) {
            user.setFirstname(updateUserDTO.getFirstname());
        }
        if (updateUserDTO.getLastname() != null) {
            user.setLastname(updateUserDTO.getLastname());
        }
        if (updateUserDTO.getEmail() != null) {
            user.setEmail(updateUserDTO.getEmail());
        }
        if (updateUserDTO.getPhone() != null) {
            user.setPhone(updateUserDTO.getPhone());
        }
        if (updateUserDTO.getBirthdate() != null) {
            user.setBirthdate(updateUserDTO.getBirthdate());
        }
        if (updateUserDTO.getAddress() != null) {
            if (user.getAddress() != null) {
                updateAddress(user.getAddress(), updateUserDTO.getAddress());
            } else {
                user.setAddress(mapToAddress(updateUserDTO.getAddress()));
            }
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return mapToUserDTO(updatedUser);
    }

    @Override
    public List<UserDTO> getAllUsers(String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
            UserRole userRole = UserRole.valueOf(role);
            users = userRepository.findByRole(userRole);
        } else {
            users = userRepository.findAll();
        }
        return users.stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mapToUserDTO(user);
    }

    @Override
    public UserDTO createUser(CreateUserDTO createUserDTO) {
        if (userRepository.existsByEmail(createUserDTO.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        User user = User.builder()
                .firstname(createUserDTO.getFirstname())
                .lastname(createUserDTO.getLastname())
                .email(createUserDTO.getEmail())
                .phone(createUserDTO.getPhone())
                .birthdate(createUserDTO.getBirthdate())
                .role(createUserDTO.getRole())
                .password((createUserDTO.getPassword()))
                .address(mapToAddress(createUserDTO.getAddress()))
                .isActive(createUserDTO.getIsActive() != null ? createUserDTO.getIsActive() : true)
                .mustChangePassword(false)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (updateUserDTO.getFirstname() != null) {
            user.setFirstname(updateUserDTO.getFirstname());
        }
        if (updateUserDTO.getLastname() != null) {
            user.setLastname(updateUserDTO.getLastname());
        }
        if (updateUserDTO.getEmail() != null) {
            user.setEmail(updateUserDTO.getEmail());
        }
        if (updateUserDTO.getPhone() != null) {
            user.setPhone(updateUserDTO.getPhone());
        }
        if (updateUserDTO.getBirthdate() != null) {
            user.setBirthdate(updateUserDTO.getBirthdate());
        }
        if (updateUserDTO.getRole() != null) {
            user.setRole(updateUserDTO.getRole());
        }
        if (updateUserDTO.getIsActive() != null) {
            user.setIsActive(updateUserDTO.getIsActive());
        }
        if (updateUserDTO.getPassword() != null && !updateUserDTO.getPassword().isEmpty()) {
            user.setPassword((updateUserDTO.getPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return mapToUserDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO toggleUserStatus(Long id, Boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setIsActive(isActive);
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return mapToUserDTO(updatedUser);
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
                .address(mapToAddressDTO(user.getAddress()))
                .isActive(user.getIsActive())
                .mustChangePassword(user.getMustChangePassword())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private Address mapToAddress(AddressDTO addressDTO) {
        if (addressDTO == null) {
            return null;
        }
        return Address.builder()
                .street(addressDTO.getStreet())
                .number(addressDTO.getNumber())
                .postalCode(addressDTO.getPostalCode())
                .city(addressDTO.getCity())
                .country(addressDTO.getCountry())
                .build();
    }

    private AddressDTO mapToAddressDTO(Address address) {
        if (address == null) {
            return null;
        }
        return AddressDTO.builder()
                .id(address.getId())
                .street(address.getStreet())
                .number(address.getNumber())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .country(address.getCountry())
                .build();
    }

    private void updateAddress(Address address, AddressDTO addressDTO) {
        if (addressDTO.getStreet() != null) {
            address.setStreet(addressDTO.getStreet());
        }
        if (addressDTO.getNumber() != null) {
            address.setNumber(addressDTO.getNumber());
        }
        if (addressDTO.getPostalCode() != null) {
            address.setPostalCode(addressDTO.getPostalCode());
        }
        if (addressDTO.getCity() != null) {
            address.setCity(addressDTO.getCity());
        }
        if (addressDTO.getCountry() != null) {
            address.setCountry(addressDTO.getCountry());
        }
    }
}