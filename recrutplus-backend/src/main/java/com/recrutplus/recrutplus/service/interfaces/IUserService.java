package com.recrutplus.recrutplus.service.interfaces;

import com.recrutplus.recrutplus.dto.user.*;
import java.util.List;

public interface IUserService {

    UserDTO getProfile(String email);

    UserDTO updateProfile(UpdateUserDTO updateUserDTO, String email);

    List<UserDTO> getAllUsers(String role);

    UserDTO getUserById(Long id);

    UserDTO createUser(CreateUserDTO createUserDTO);

    UserDTO updateUser(Long id, UpdateUserDTO updateUserDTO);

    void deleteUser(Long id);

    UserDTO toggleUserStatus(Long id, Boolean isActive);
}