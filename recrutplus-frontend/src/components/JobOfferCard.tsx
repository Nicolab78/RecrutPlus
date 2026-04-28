import { Link } from "react-router-dom";
import type { JobOffer } from "../types/JobOffer";
import './JobOfferCard.css';

export const JobOfferCard: React.FC<{ offer: JobOffer }> = ({ offer }) => {
  return (
    <Link
      to={`/job-offers/${offer.id}`}
      className="job-offer-card"
    >
      <div className="card-content">
        <div className="card-main">
          <h3 className="offer-title">
            💼 {offer.title}
          </h3>

          <div className="offer-details">
            <span className="detail-item">📋 {offer.specialty}</span>
            <span className="detail-item">💼 {offer.contractType}</span>
            {offer.address && (
              <span className="detail-item">📍 {offer.address.city}, {offer.address.country}</span>
            )}
            {offer.salary && <span className="detail-item">💰 {offer.salary}€</span>}
          </div>
        </div>

        <div className="card-sidebar">
          <span className="status-badge">
            ✅ Actif
          </span>
          <p className="creation-date">
            {new Date(offer.creationDate).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </Link>
  );
};