import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/User';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar" data-user-role={user?.role}>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              RecrutePlus
            </Link>
            
            {isAuthenticated && (
              <div className="navbar-menu">
                <Link to="/dashboard" className="navbar-link">
                  Accueil
                </Link>

                {(user?.role === UserRole.RH || user?.role === UserRole.ADMIN) && (
                  <>
                    <Link to="/job-offers" className="navbar-link">
                      Offres d'emploi
                    </Link>
                    <Link to="/applications" className="navbar-link">
                      Candidatures
                    </Link>
                    <Link to="/interviews" className="navbar-link">
                      Entretiens
                    </Link>
                  </>
                )}

                {user?.role === UserRole.ADMIN && (
                  <Link to="/users" className="navbar-link">
                    Utilisateurs
                  </Link>
                )}

                {user?.role === UserRole.CANDIDAT && (
                  <>
                    <Link to="/job-offers" className="navbar-link">
                      Rechercher
                    </Link>
                    <Link to="/my-applications" className="navbar-link">
                      Mes candidatures
                    </Link>
                    <Link to="/my-interviews" className="navbar-link">
                      Mes entretiens
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="navbar-right">
            {(!isAuthenticated || user?.role === UserRole.CANDIDAT) && (
              <button 
                className="mobile-menu-button"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            )}

            <div className="navbar-user-menu">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="navbar-profile">
                    {user?.firstname} {user?.lastname}
                  </Link>
                  <button onClick={handleLogout} className="navbar-logout-btn">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/login" className="navbar-login">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>

        {(!isAuthenticated || user?.role === UserRole.CANDIDAT) && (
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {isAuthenticated && user?.role === UserRole.CANDIDAT ? (
              <>
                <Link to="/dashboard" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to="/job-offers" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Rechercher
                </Link>
                <Link to="/my-applications" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Mes candidatures
                </Link>
                <Link to="/my-interviews" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Mes entretiens
                </Link>
              </>
            ) : (
              <>
                <Link to="/job-offers" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Offres d'emploi
                </Link>
                <Link to="/login" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Connexion
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;