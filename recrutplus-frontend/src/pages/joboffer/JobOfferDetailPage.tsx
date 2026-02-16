import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobOfferService from '../../services/JobOfferService';
import applicationService from '../../services/ApplicationService';
import type { JobOffer} from '../../types/JobOffer';
import type { CreateApplicationDTO } from '../../types/Application';
import { useAuth } from '../../context/AuthContext';
import './JobOfferDetailPage.css';

const JobOfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    birthdate: '',
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: ''
    },
    coverLetter: ''
  });

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        if (!id) return;
        const data = await jobOfferService.getById(parseInt(id));
        setOffer(data);

        if (user) {
          setFormData(prev => ({
            ...prev,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            email: user.email || '',
            phone: user.phone || '',
            birthdate: user.birthdate || '',
            address: user.address ? {
              street: user.address.street || '',
              number: user.address.number || '',
              postalCode: user.address.postalCode || '',
              city: user.address.city || '',
              country: user.address.country || ''
            } : prev.address
          }));
        }
      } catch (err: any) {
        setError('Erreur lors du chargement de l\'offre');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [id, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (!offer) return;

      const applicationData: CreateApplicationDTO = {
        jobOfferId: offer.id,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        birthdate: formData.birthdate || undefined,
        address: formData.address.city ? formData.address : undefined,
        coverLetter: formData.coverLetter
      };

      await applicationService.submit(applicationData);

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/job-offers');
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (error || !offer) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error || 'Offre non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-offer-detail-page">
      <div className="container">
        <div className="offer-card">
          <h1 className="offer-title">
            {offer.title}
          </h1>

          <div className="offer-info-grid">
            <div className="offer-info-section">
              <div className="info-item">
                <span className="info-label">Spécialité :</span> 
                <span className="info-value">{offer.specialty}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type de contrat :</span> 
                <span className="info-value">{offer.contractType}</span>
              </div>
              {offer.salary && (
                <div className="info-item">
                  <span className="info-label">Salaire :</span> 
                  <span className="info-value">{offer.salary}€</span>
                </div>
              )}
            </div>

            {offer.address && (
              <div className="offer-info-section">
                <div className="info-item">
                  <span className="info-label"> Localisation :</span>
                </div>
                <div className="address-details">
                  {offer.address.number} {offer.address.street}<br />
                  {offer.address.postalCode} {offer.address.city}<br />
                  {offer.address.country}
                </div>
              </div>
            )}
          </div>

          <div className="offer-description">
            <h2 className="section-title">Description</h2>
            <p className="description-content">{offer.content}</p>
          </div>

          <div className="offer-actions">
            {!showApplicationForm && (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="btn-apply"
              >
                Postuler
              </button>
            )}
            <button
              onClick={() => navigate('/job-offers')}
              className="btn-back"
            >
              ← Retour
            </button>
          </div>
        </div>

        {showApplicationForm && (
          <div className="application-form-card">
            <h2 className="form-title">
              Postuler à cette offre
            </h2>

            {submitSuccess && (
              <div className="success-alert">
                Candidature envoyée avec succès ! Redirection...
              </div>
            )}

            {submitError && (
              <div className="error-alert">
                ❌ {submitError}
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="application-form">
              <div className="form-section">
                <h3 className="form-section-title">👤 Informations personnelles</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstname">Prénom *</label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      required
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastname">Nom *</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      required
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="birthdate">Date de naissance</label>
                    <input
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Adresse</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="number">Numéro</label>
                    <input
                      type="text"
                      id="number"
                      name="number"
                      value={formData.address.number}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="street">Rue</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Code postal</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.address.postalCode}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Ville</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Pays</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.address.country}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Lettre de motivation</h3>
                <div className="form-group">
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    required
                    rows={6}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="form-textarea"
                  
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer ma candidature'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="btn-cancel"
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOfferDetailPage;