package com.recrutplus.service.interfaces;

import com.recrutplus.dto.auth.AuthResponseDTO;
import com.recrutplus.dto.auth.ChangePasswordDTO;
import com.recrutplus.dto.auth.LoginDTO;

public interface IAuthService {
  AuthResponseDTO login(LoginDTO loginDTO);

  void changePassword(ChangePasswordDTO changePasswordDTO, String email);
}
