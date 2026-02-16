import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobOfferService from '../services/JobOfferService';
import type { JobOffer } from '../types/JobOffer';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [recentOffers, setRecentOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentOffers = async () => {
      try {
        const offers = await jobOfferService.getActive();
        setRecentOffers(offers.slice(0, 6));
      } catch (err: any) {
        setError('Erreur lors du chargement des offres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Trouvez votre prochain emploi avec RecrutePlus
          </h1>
          <p className="hero-subtitle">
            Des milliers d'offres d'emploi vous attendent
          </p>
          <div className="hero-actions">
            <Link to="/job-offers" className="hero-cta-btn">
              Voir toutes les offres
            </Link>
          </div>
        </div>
      </div>

      <div className="recent-offers-section">
        <div className="section-container">
          <h2 className="section-title">
            📋 Offres récentes
          </h2>

          {recentOffers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Aucune offre disponible pour le moment</p>
            </div>
          ) : (
            <div className="offers-grid">
              {recentOffers.map((offer) => (
                <Link
                  key={offer.id}
                  to={`/job-offers/${offer.id}`}
                  className="offer-card"
                >
                  <h3 className="offer-card-title">
                    💼 {offer.title}
                  </h3>
                  <div className="offer-card-details">
                    <div className="detail-row">
                      <span className="detail-label">Spécialité :</span>
                      <span className="detail-value">{offer.specialty}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Contrat :</span>
                      <span className="detail-value">{offer.contractType}</span>
                    </div>
                    {offer.address && (
                      <div className="detail-row">
                        <span className="detail-label">Lieu :</span>
                        <span className="detail-value">{offer.address.city}, {offer.address.country}</span>
                      </div>
                    )}
                    {offer.salary && (
                      <div className="detail-row">
                        <span className="detail-label">Salaire :</span>
                        <span className="detail-value">{offer.salary}€</span>
                      </div>
                    )}
                  </div>
                  <div className="offer-card-footer">
                    <span className="publish-date">
                      📅 Publié le {new Date(offer.creationDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {recentOffers.length > 0 && (
            <div className="see-all-link">
              <Link to="/job-offers" className="see-all-btn">
                Voir toutes les offres →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;