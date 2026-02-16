import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicationService from '../../services/ApplicationService';
import interviewService from '../../services/InterviewService';
import type { Application, ProcessApplicationDTO } from '../../types/Application';
import type { CreateInterviewDTO} from '../../types/Interview';

import { InterviewType, InterviewStatus } from '../../types/Interview';
import { ApplicationStatus } from '../../types/Application';
import './ApplicationDetailPage.css';

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(ApplicationStatus.ACCEPTE_ENTRETIEN);

  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewData, setInterviewData] = useState<Omit<CreateInterviewDTO, 'applicationId'>>({
    interviewDate: '',
    type: InterviewType.VISIO,
    visioLink: '',
    notes: ''
  });

  const [completedInterviews, setCompletedInterviews] = useState<number>(0);
  const [totalInterviews, setTotalInterviews] = useState<number>(0);
  const [pendingInterviews, setPendingInterviews] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchApplication();
      fetchInterviewsCount();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      if (!id) return;
      const data = await applicationService.getById(parseInt(id));
      setApplication(data);
    } catch (err: any) {
      setError('Erreur lors du chargement de la candidature');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInterviewsCount = async () => {
    try {
      if (!id) return;
      const allInterviews = await interviewService.getAll();
      const candidateInterviews = allInterviews.filter(interview => 
        interview.application.id === parseInt(id)
      );
      
      const completed = candidateInterviews.filter(interview => 
        interview.status === InterviewStatus.TERMINE
      ).length;
      
      const pending = candidateInterviews.filter(interview => 
        interview.status === InterviewStatus.PLANIFIE
      ).length;
      
      setTotalInterviews(candidateInterviews.length);
      setCompletedInterviews(completed);
      setPendingInterviews(pending);
    } catch (err) {

      console.error('Erreur lors du chargement des entretiens:', err);
    }
  };

  const handleProcessApplication = async () => {
    if (!application) return;

    setIsProcessing(true);
    try {
      const processData: ProcessApplicationDTO = {
        status: newStatus,
        comment: comment || undefined
      };

      await applicationService.process(application.id, processData);
      await fetchApplication();
      setShowProcessForm(false);
      setComment('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du traitement de la candidature');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateInterview = async () => {
    if (!application) return;

    if (!interviewData.interviewDate) {
      setError('La date et heure sont requises');
      return;
    }

    if (interviewData.type === InterviewType.VISIO && !interviewData.visioLink) {
      setError('Le lien visio est requis pour un entretien en visioconférence');
      return;
    }

    try {
      await applicationService.process(application.id, {
        status: ApplicationStatus.ACCEPTE_ENTRETIEN,
        comment: `Candidat convoqué en entretien - ${interviewData.type === InterviewType.VISIO ? 'Visioconférence' : 'Présentiel'}`
      });

      const createData: CreateInterviewDTO = {
        applicationId: application.id,
        ...interviewData
      };

      await interviewService.create(createData);
      
      setShowInterviewForm(false);
      setInterviewData({
        interviewDate: '',
        type: InterviewType.VISIO,
        visioLink: '',
        notes: ''
      });
      
      await fetchApplication();
      await fetchInterviewsCount();
      
      navigate('/interviews', { 
        state: { message: 'Entretien créé avec succès !' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Erreur lors de la création de l\'entretien');
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
      [ApplicationStatus.EN_ATTENTE]: 'En attente',
      [ApplicationStatus.EN_COURS]: 'En cours',
      [ApplicationStatus.ACCEPTE_ENTRETIEN]: 'Convoqué',
      [ApplicationStatus.ENTRETIEN_TERMINE]: 'Entretien effectué',
      [ApplicationStatus.REFUSE]: 'Refusé',
      [ApplicationStatus.EMBAUCHE]: 'Embauché',
      [ApplicationStatus.REFUSE_APRES_ENTRETIEN]: 'Refusé (entretien)'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canProcessApplication = () => {
    return ![ApplicationStatus.REFUSE, ApplicationStatus.EMBAUCHE].includes(application?.status as ApplicationStatus);
  };

  const canCreateInterview = () => {
    return application?.status === ApplicationStatus.ACCEPTE_ENTRETIEN || 
           application?.status === ApplicationStatus.ENTRETIEN_TERMINE;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement de la candidature...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error || 'Candidature non trouvée'}</p>
          <button onClick={() => navigate('/applications')} className="btn-back">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-detail-page">
      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <button onClick={() => navigate('/applications')} className="back-button">
              ← Retour à la liste
            </button>
            <h1 className="page-title">
              Candidature de {application.firstname} {application.lastname}
            </h1>
          </div>
          <div className="header-right">
            {getStatusBadge(application.status)}
          </div>
        </div>

        <div className="content-container">
          <div className="info-summary-card">
            <h3 className="summary-title">Résumé de la candidature</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <label>Candidature reçue</label>
                <p>{formatDate(application.applicationDate)}</p>
              </div>
              {application.processedAt && (
                <div className="summary-item">
                  <label>Traitée le</label>
                  <p>{formatDate(application.processedAt)}</p>
                </div>
              )}
              <div className="summary-item">
                <label>Statut actuel</label>
                <div className="status-container">{getStatusBadge(application.status)}</div>
              </div>
              {(application.status === ApplicationStatus.ACCEPTE_ENTRETIEN || 
                application.status === ApplicationStatus.ENTRETIEN_TERMINE) && (
                <div className="summary-item">
                  <label>Entretiens</label>
                  <p>
                    <span className="completed-count">{completedInterviews}</span> terminé{completedInterviews > 1 ? 's' : ''} 
                    {totalInterviews > completedInterviews && (
                      <span className="total-count"> / {totalInterviews} total</span>
                    )}
                  </p>
                  {application.status === ApplicationStatus.ACCEPTE_ENTRETIEN && completedInterviews === 0 && (
                    <p className="warning-text">
                      Au moins 1 entretien terminé requis pour la décision finale
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {(canProcessApplication() || canCreateInterview()) && (
            <div className="actions-card">
              <h3 className="actions-title">⚙️ Actions disponibles</h3>
              <div className="actions-grid">
                {canProcessApplication() && (
                  <>
                    {application.status === ApplicationStatus.EN_ATTENTE && (
                      <div className="action-group">
                        <button
                          onClick={() => {
                            setNewStatus(ApplicationStatus.EN_COURS);
                            setShowProcessForm(true);
                          }}
                          className="action-btn btn-blue"
                        >
                          <span className="btn-icon">⏰</span>
                          Mettre en cours d'évaluation
                        </button>
                        <p className="action-note">
                          La candidature doit d'abord être mise en cours avant toute autre action
                        </p>
                      </div>
                    )}

                    {application.status === ApplicationStatus.EN_COURS && (
                      <div className="action-group">
                        <button
                          onClick={() => {
                            setShowInterviewForm(true);
                          }}
                          className="action-btn btn-green"
                        >
                          <span className="btn-icon">📅</span>
                          Convoquer en entretien
                        </button>
                        
                        <button
                          onClick={() => {
                            setNewStatus(ApplicationStatus.REFUSE);
                            setShowProcessForm(true);
                          }}
                          className="action-btn btn-red"
                        >
                          <span className="btn-icon">❌</span>
                          Refuser la candidature
                        </button>
                      </div>
                    )}

                    {application.status === ApplicationStatus.ENTRETIEN_TERMINE && (
                      <div className="action-group">
                        <button
                          onClick={() => {
                            setNewStatus(ApplicationStatus.EMBAUCHE);
                            setShowProcessForm(true);
                          }}
                          className="action-btn btn-success"
                        >
                          <span className="btn-icon">✅</span>
                          Embaucher
                        </button>
                        
                        <button
                          onClick={() => {
                            setNewStatus(ApplicationStatus.REFUSE_APRES_ENTRETIEN);
                            setShowProcessForm(true);
                          }}
                          className="action-btn btn-orange"
                        >
                          <span className="btn-icon">❌</span>
                          Refuser après entretien
                        </button>
                      </div>
                    )}
                  </>
                )}

                {canCreateInterview() && (
                  <div className="action-group">
                    <h4 className="action-group-title">Gestion des entretiens</h4>
                    {pendingInterviews > 0 ? (
                      <div>
                        <button disabled className="action-btn btn-disabled">
                          <span className="btn-icon">⚠️</span>
                          Nouvel entretien impossible
                        </button>
                        <p className="warning-text">
                          Terminez d'abord les {pendingInterviews} entretien{pendingInterviews > 1 ? 's' : ''} en cours avant d'en planifier un nouveau
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowInterviewForm(true)}
                        className="action-btn btn-primary"
                      >
                        <span className="btn-icon">📅</span>
                        {totalInterviews === 0 ? 'Planifier un entretien' : 'Planifier un nouvel entretien'}
                      </button>
                    )}
                    
                    {totalInterviews > 0 && (
                      <div className="interview-summary">
                        <p>
                          {totalInterviews} entretien{totalInterviews > 1 ? 's' : ''} déjà planifié{totalInterviews > 1 ? 's' : ''}
                        </p>
                        <div className="interview-counts">
                          <span className="pending-count">{pendingInterviews} en cours</span>
                          {pendingInterviews > 0 && completedInterviews > 0 && <span> • </span>}
                          {completedInterviews > 0 && <span className="completed-count">{completedInterviews} terminé{completedInterviews > 1 ? 's' : ''}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="main-content">
            <div className="info-card">
              <h2 className="card-title">
                <span className="card-icon">👤</span>
                Informations du candidat
              </h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <label>Nom complet</label>
                  <p>{application.firstname} {application.lastname}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>
                    <a href={`mailto:${application.email}`} className="contact-link">
                      {application.email}
                    </a>
                  </p>
                </div>
                <div className="info-item">
                  <label>Téléphone</label>
                  <p>
                    <a href={`tel:${application.phone}`} className="contact-link">
                      {application.phone}
                    </a>
                  </p>
                </div>
                {application.birthdate && (
                  <div className="info-item">
                    <label>Date de naissance</label>
                    <p>{new Date(application.birthdate).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>

              {application.address && (
                <div className="info-item full-width">
                  <label>Adresse</label>
                  <p className="address">
                    {application.address.number} {application.address.street}<br />
                    {application.address.postalCode} {application.address.city}<br />
                    {application.address.country}
                  </p>
                </div>
              )}
            </div>

            <div className="info-card">
              <h2 className="card-title">
                <span className="card-icon">💼</span>
                Offre d'emploi
              </h2>
              
              <div className="job-offer-info">
                <div className="info-item">
                  <label>Poste</label>
                  <p className="job-title">{application.jobOffer.title}</p>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Spécialité</label>
                    <p>{application.jobOffer.specialty}</p>
                  </div>
                  <div className="info-item">
                    <label>Type de contrat</label>
                    <p>{application.jobOffer.contractType}</p>
                  </div>
                </div>
                {application.jobOffer.salary && (
                  <div className="info-item">
                    <label>Salaire</label>
                    <p>{application.jobOffer.salary}€</p>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h2 className="card-title">
                <span className="card-icon">📄</span>
                Lettre de motivation
              </h2>
              <div className="cover-letter">
                <p>{application.coverLetter}</p>
              </div>
            </div>

            {application.comment && (
              <div className="info-card">
                <h2 className="card-title">
                  <span className="card-icon">💬</span>
                  Commentaire RH
                </h2>
                <div className="hr-comment">
                  <p>{application.comment}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showProcessForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {newStatus === ApplicationStatus.ACCEPTE_ENTRETIEN ? 'Convoquer en entretien' : 
                   newStatus === ApplicationStatus.ENTRETIEN_TERMINE ? 'Marquer entretien terminé' :
                   newStatus === ApplicationStatus.REFUSE ? 'Refuser la candidature' : 
                   newStatus === ApplicationStatus.REFUSE_APRES_ENTRETIEN ? 'Refuser après entretien' :
                   newStatus === ApplicationStatus.EMBAUCHE ? 'Embaucher le candidat' :
                   'Mettre en cours'} 
                </h3>
              </div>
              
              <div className="modal-form">
                <div className="form-group">
                  <label>
                    Commentaire {[ApplicationStatus.REFUSE, ApplicationStatus.REFUSE_APRES_ENTRETIEN].includes(newStatus) ? '(requis)' : '(optionnel)'}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required={[ApplicationStatus.REFUSE, ApplicationStatus.REFUSE_APRES_ENTRETIEN].includes(newStatus)}
                    className="form-textarea"
                    placeholder={
                      [ApplicationStatus.REFUSE, ApplicationStatus.REFUSE_APRES_ENTRETIEN].includes(newStatus)
                        ? "Expliquez les raisons du refus..." 
                        : "Commentaire optionnel..."
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleProcessApplication}
                  disabled={isProcessing || ([ApplicationStatus.REFUSE, ApplicationStatus.REFUSE_APRES_ENTRETIEN].includes(newStatus) && !comment)}
                  className={`btn-primary ${
                    newStatus === ApplicationStatus.ACCEPTE_ENTRETIEN ? 'btn-green' :
                    newStatus === ApplicationStatus.ENTRETIEN_TERMINE ? 'btn-purple' :
                    newStatus === ApplicationStatus.REFUSE ? 'btn-red' :
                    newStatus === ApplicationStatus.REFUSE_APRES_ENTRETIEN ? 'btn-orange' :
                    newStatus === ApplicationStatus.EMBAUCHE ? 'btn-success' :
                    'btn-blue'
                  }`}
                >
                  {isProcessing ? 'Traitement...' : 'Confirmer'}
                </button>
                <button
                  onClick={() => {
                    setShowProcessForm(false);
                    setComment('');
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {showInterviewForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Planifier un entretien</h3>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <div className="form-group">
                  <label>Date et heure *</label>
                  <input
                    type="datetime-local"
                    value={interviewData.interviewDate}
                    onChange={(e) => {
                      setInterviewData(prev => ({ ...prev, interviewDate: e.target.value }));
                      setError('');
                    }}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type d'entretien</label>
                  <select
                    value={interviewData.type}
                    onChange={(e) => {
                      setInterviewData(prev => ({ ...prev, type: e.target.value as InterviewType }));
                      setError('');
                    }}
                    className="form-select"
                  >
                    <option value={InterviewType.VISIO}>Visioconférence</option>
                    <option value={InterviewType.PRESENTIEL}>Présentiel</option>
                  </select>
                </div>

                {interviewData.type === InterviewType.VISIO && (
                  <div className="form-group">
                    <label>Lien visio *</label>
                    <input
                      type="url"
                      value={interviewData.visioLink}
                      onChange={(e) => {
                        setInterviewData(prev => ({ ...prev, visioLink: e.target.value }));
                        setError('');
                      }}
                      className="form-input"
                      placeholder="https://meet.google.com/..."
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Notes (optionnel)</label>
                  <textarea
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="form-textarea"
                    placeholder="Instructions pour le candidat..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleCreateInterview}
                  disabled={!interviewData.interviewDate || (interviewData.type === InterviewType.VISIO && !interviewData.visioLink)}
                  className="btn-primary"
                >
                  Créer l'entretien
                </button>
                <button
                  onClick={() => {
                    setShowInterviewForm(false);
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;