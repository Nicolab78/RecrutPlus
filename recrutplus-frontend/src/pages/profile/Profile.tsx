import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'CANDIDAT':
        return { emoji: '👤', class: 'role-candidat' };
      case 'RH':
        return { emoji: '👔', class: 'role-rh' };
      case 'ADMIN':
        return { emoji: '⚡', class: 'role-admin' };
      default:
        return { emoji: '👤', class: 'role-candidat' };
    }
  };

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-initials">
                {user.firstname.charAt(0)}{user.lastname.charAt(0)}
              </span>
            </div>
            <div className="profile-details">
              <h1 className="profile-name">
                {user.firstname} {user.lastname}
              </h1>
              <p className="profile-email">📧 {user.email}</p>
              <span className={`role-badge ${roleInfo.class}`}>
                {roleInfo.emoji} {user.role}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/change-password" className="btn-primary">
              🔐 Changer le mot de passe
            </Link>
            <button onClick={logout} className="btn-secondary">
              🚪 Déconnexion
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="info-card">
            <h2 className="card-title">
              👤 Informations personnelles
            </h2>
            
            <div className="info-list">
              <div className="info-item">
                <label>📧 Email</label>
                <p>{user.email}</p>
              </div>
              
              {user.phone && (
                <div className="info-item">
                  <label>📞 Téléphone</label>
                  <p>{user.phone}</p>
                </div>
              )}
              
              {user.birthdate && (
                <div className="info-item">
                  <label>🎂 Date de naissance</label>
                  <p>{formatDate(user.birthdate)}</p>
                </div>
              )}

              {user.address && (
                <div className="info-item">
                  <label>🏠 Adresse</label>
                  <div className="address">
                    {user.address.number} {user.address.street}<br />
                    {user.address.postalCode} {user.address.city}<br />
                    {user.address.country}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">
              ⚙️ Informations du compte
            </h2>
            
            <div className="info-list">
              <div className="info-item">
                <label>📊 Statut du compte</label>
                <div className="status-container">
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? '✅ Actif' : '❌ Désactivé'}
                  </span>
                </div>
              </div>
              
              <div className="info-item">
                <label>📅 Membre depuis</label>
                <p>{formatDate(user.createdAt)}</p>
              </div>

              {user.updatedAt && (
                <div className="info-item">
                  <label>🔄 Dernière mise à jour</label>
                  <p>{formatDate(user.updatedAt)}</p>
                </div>
              )}

              {user.mustChangePassword && (
                <div className="warning-alert">
                  <div className="alert-header">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-text">
                      Changement de mot de passe requis
                    </span>
                  </div>
                  <Link to="/change-password" className="alert-link">
                    🔐 Changer maintenant →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {user.role === 'CANDIDAT' && (
          <div className="quick-actions-card">
            <h2 className="card-title">
              🚀 Actions rapides
            </h2>
            
            <div className="actions-grid">
              <Link to="/job-offers" className="action-item action-browse">
                <div className="action-icon">💼</div>
                <div className="action-content">
                  <p className="action-title">Parcourir les offres</p>
                  <p className="action-description">Découvrir de nouvelles opportunités</p>
                </div>
              </Link>

              <Link to="/my-applications" className="action-item action-applications">
                <div className="action-icon">📄</div>
                <div className="action-content">
                  <p className="action-title">Mes candidatures</p>
                  <p className="action-description">Suivre l'état de mes demandes</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;