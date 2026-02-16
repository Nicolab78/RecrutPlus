import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">RecrutePlus</h3>
            <p className="footer-description">
              Votre plateforme de recrutement moderne
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Liens rapides</h4>
            <ul className="footer-links">
              <li><a href="/job-offers">Offres d'emploi</a></li>
              <li><a href="/home">Accueil</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} RecrutePlus. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;