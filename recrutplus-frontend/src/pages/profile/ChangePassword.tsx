import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './ChangePassword.css';

interface ChangePasswordDTO {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit: boolean;
  special: boolean;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  
  const [formData, setFormData] = useState<ChangePasswordDTO>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isFirstTime = user?.mustChangePassword;

  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  };

  const isPasswordStrong = (): boolean => {
    return Object.values(passwordStrength).every(value => value === true);
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];
    
    if (!isFirstTime && !formData.oldPassword) {
      validationErrors.push('L\'ancien mot de passe est requis');
    }
    
    if (!formData.newPassword) {
      validationErrors.push('Le nouveau mot de passe est requis');
    } else if (formData.newPassword.length < 12) {
      validationErrors.push('Le mot de passe doit contenir au moins 12 caractères');
    } else if (!isPasswordStrong()) {
      validationErrors.push('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.push('Les mots de passe ne correspondent pas');
    }
    
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await authService.changePassword({
        oldPassword: isFirstTime ? undefined : formData.oldPassword,
        newPassword: formData.newPassword
      });
      
      if (user) {
        const updatedUser = { ...user, mustChangePassword: false };
        updateUser(updatedUser);
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        if (isFirstTime) {
          navigate('/home');
        } else {
          navigate('/profile');
        }
      }, 2000);
      
    } catch (error: any) {
      setErrors([error.response?.data?.message || error.response?.data || 'Erreur lors du changement de mot de passe']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      validatePassword(value);
    }
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <div className="change-password-card">
          <div className="card-header">
            <h1 className="card-title">
              {isFirstTime ? 'Sécurisez votre compte' : 'Modifier le mot de passe'}
            </h1>
            <p className="card-subtitle">
              {isFirstTime 
                ? 'Définissez un mot de passe personnel pour sécuriser votre compte'
                : 'Changez votre mot de passe actuel pour un nouveau'
              }
            </p>
          </div>

          {success && (
            <div className="success-alert">
              <p>Mot de passe modifié avec succès ! Redirection en cours...</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="errors-container">
              {errors.map((error, index) => (
                <div key={index} className="error-alert">
                  <p>{error}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="change-password-form">
            {!isFirstTime && (
              <div className="form-group">
                <label htmlFor="oldPassword" className="form-label">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  required={!isFirstTime}
                  className="form-input"
                  placeholder="Entrez votre mot de passe actuel"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                minLength={12}
                className="form-input"
                placeholder="Au moins 12 caractères"
              />
              
              <div className="password-requirements">
                <p className={passwordStrength.length ? 'requirement-valid' : 'requirement-invalid'}>
                  {passwordStrength.length ? '✓' : '○'} Au moins 12 caractères
                </p>
                <p className={passwordStrength.lowercase ? 'requirement-valid' : 'requirement-invalid'}>
                  {passwordStrength.lowercase ? '✓' : '○'} Une lettre minuscule (a-z)
                </p>
                <p className={passwordStrength.uppercase ? 'requirement-valid' : 'requirement-invalid'}>
                  {passwordStrength.uppercase ? '✓' : '○'} Une lettre majuscule (A-Z)
                </p>
                <p className={passwordStrength.digit ? 'requirement-valid' : 'requirement-invalid'}>
                  {passwordStrength.digit ? '✓' : '○'} Un chiffre (0-9)
                </p>
                <p className={passwordStrength.special ? 'requirement-valid' : 'requirement-invalid'}>
                  {passwordStrength.special ? '✓' : '○'} Un caractère spécial (!@#$%...)
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={12}
                className="form-input"
                placeholder="Répétez le nouveau mot de passe"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit"
              >
                {isSubmitting ? (
                  <div className="btn-loading">
                    <div className="spinner"></div>
                    Modification en cours...
                  </div>
                ) : (
                  'Modifier le mot de passe'
                )}
              </button>

              {!isFirstTime && (
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="btn-cancel"
                >
                  Annuler
                </button>
              )}
            </div>

            {isFirstTime && (
              <div className="logout-section">
                <button
                  type="button"
                  onClick={logout}
                  className="logout-link"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;