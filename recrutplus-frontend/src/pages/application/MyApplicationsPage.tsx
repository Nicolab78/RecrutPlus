import React, { useEffect, useState } from 'react';
import applicationService from '../../services/ApplicationService';
import type { Application } from '../../types/Application';
import { ApplicationStatus } from '../../types/Application';
import './MyApplicationsPage.css';

const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      setError('Erreur lors du chargement de vos candidatures');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusClasses = {
      [ApplicationStatus.EN_ATTENTE]: 'status-pending',
      [ApplicationStatus.EN_COURS]: 'status-progress',
      [ApplicationStatus.ACCEPTE_ENTRETIEN]: 'status-interview',
      [ApplicationStatus.ENTRETIEN_TERMINE]: 'status-interview-done',
      [ApplicationStatus.REFUSE]: 'status-rejected',
      [ApplicationStatus.EMBAUCHE]: 'status-hired',
      [ApplicationStatus.REFUSE_APRES_ENTRETIEN]: 'status-rejected-after'
    };
    
    const labels = {
      [ApplicationStatus.EN_ATTENTE]: 'En cours d\'examen',
      [ApplicationStatus.EN_COURS]: 'En cours d\'évaluation',
      [ApplicationStatus.ACCEPTE_ENTRETIEN]: 'Convoqué en entretien',
      [ApplicationStatus.ENTRETIEN_TERMINE]: 'Entretien effectué',
      [ApplicationStatus.REFUSE]: 'Non retenu',
      [ApplicationStatus.EMBAUCHE]: 'Félicitations ! Embauché',
      [ApplicationStatus.REFUSE_APRES_ENTRETIEN]: 'Non retenu après entretien'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStatusMessage = (status: ApplicationStatus) => {
    const messages = {
      [ApplicationStatus.EN_ATTENTE]: 'Votre candidature a été reçue et sera examinée prochainement.',
      [ApplicationStatus.EN_COURS]: 'Votre candidature est actuellement en cours d\'évaluation par notre équipe.',
      [ApplicationStatus.ACCEPTE_ENTRETIEN]: 'Félicitations ! Vous avez été sélectionné(e) pour un entretien.',
      [ApplicationStatus.ENTRETIEN_TERMINE]: 'Votre entretien s\'est déroulé. Nous vous contacterons bientôt.',
      [ApplicationStatus.REFUSE]: 'Nous vous remercions pour votre candidature.',
      [ApplicationStatus.EMBAUCHE]: 'Félicitations ! Nous sommes ravis de vous accueillir dans notre équipe.',
      [ApplicationStatus.REFUSE_APRES_ENTRETIEN]: 'Nous vous remercions pour le temps accordé lors de l\'entretien.'
    };

    return messages[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchMyApplications} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <div className="header-icon">
              📄
            </div>
            <div className="header-text">
              <h1>Mes candidatures</h1>
              <p>Suivez l'évolution de vos candidatures</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                📋
              </div>
              <div className="stat-content">
                <p className="stat-number">{applications.length}</p>
                <p className="stat-label">Candidature{applications.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                📅
              </div>
              <div className="stat-content">
                <p className="stat-number stat-number-green">
                  {applications.filter(app => 
                    [ApplicationStatus.ACCEPTE_ENTRETIEN, ApplicationStatus.ENTRETIEN_TERMINE].includes(app.status)
                  ).length}
                </p>
                <p className="stat-label">Entretien{applications.filter(app => 
                  [ApplicationStatus.ACCEPTE_ENTRETIEN, ApplicationStatus.ENTRETIEN_TERMINE].includes(app.status)
                ).length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                ✅
              </div>
              <div className="stat-content">
                <p className="stat-number stat-number-success">
                  {applications.filter(app => app.status === ApplicationStatus.EMBAUCHE).length}
                </p>
                <p className="stat-label">Embauche{applications.filter(app => app.status === ApplicationStatus.EMBAUCHE).length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              📄
            </div>
            <h3>Aucune candidature</h3>
            <p>Vous n'avez pas encore postulé à des offres d'emploi.</p>
            <a href="/job-offers" className="cta-button">
              Voir les offres d'emploi
            </a>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{application.jobOffer.title}</h3>
                    <div className="job-details">
                      <div className="job-detail">
                        <span className="job-icon">💼</span>
                        {application.jobOffer.specialty}
                      </div>
                      <div className="job-detail">
                        <span className="job-icon">⏰</span>
                        {application.jobOffer.contractType}
                      </div>
                      <div className="job-detail">
                        <span className="job-icon">📅</span>
                        Candidature envoyée le {formatDate(application.applicationDate)}
                      </div>
                    </div>
                  </div>
                  <div className="card-status">
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="status-message">
                  <p>{getStatusMessage(application.status)}</p>
                  {application.comment && (
                    <div className="hr-comment">
                      <p><strong>Message de l'équipe RH :</strong> {application.comment}</p>
                    </div>
                  )}
                </div>

                {application.status === ApplicationStatus.ACCEPTE_ENTRETIEN && (
                  <div className="interview-alert">
                    <div className="alert-content">
                      <span className="alert-icon">✅</span>
                      <p className="alert-title">Vous avez été sélectionné(e) pour un entretien !</p>
                    </div>
                    <p className="alert-subtitle">
                      Consultez vos entretiens pour voir les détails de planification.
                    </p>
                  </div>
                )}

                {application.status === ApplicationStatus.EMBAUCHE && (
                  <div className="success-alert">
                    <div className="alert-content">
                      <span className="alert-icon">🎉</span>
                      <p className="alert-title">Félicitations ! Vous avez été embauché(e) !</p>
                    </div>
                    <p className="alert-subtitle">
                      Notre équipe vous contactera prochainement pour les prochaines étapes.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;