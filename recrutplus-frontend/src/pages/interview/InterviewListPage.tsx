import React, { useEffect, useState } from 'react';
import interviewService from '../../services/InterviewService';
import type { Interview } from '../../types/Interview';
import { InterviewType } from '../../types/Interview';
import { InterviewStatus } from '../../types/Interview';
import './InterviewListPage.css';

const InterviewListPage: React.FC = () => {
  
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<InterviewType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [newStatus, setNewStatus] = useState<InterviewStatus>(InterviewStatus.PLANIFIE);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [interviews, statusFilter, typeFilter, searchTerm]);

  const fetchInterviews = async () => {
    try {
      const data = await interviewService.getAll();
      setInterviews(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des entretiens');
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterviews = () => {
    let filtered = [...interviews];
    
    if (statusFilter) {
      filtered = filtered.filter(interview => interview.status === statusFilter);
    }
    
    if (typeFilter) {
      filtered = filtered.filter(interview => interview.type === typeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(interview => 
        interview.application.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.application.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.application.jobOffer.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime());
    
    setFilteredInterviews(filtered);
  };

  const handleStatusChange = (interview: Interview) => {
    setSelectedInterview(interview);
    setNewStatus(interview.status);
    setNotes(interview.notes || '');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedInterview) return;

    setIsUpdating(true);
    try {
      await interviewService.update(selectedInterview.id, {
        status: newStatus,
        notes: notes || undefined
      });
      
      await fetchInterviews();
      setShowStatusModal(false);
      setSelectedInterview(null);
      setNotes('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: InterviewStatus) => {
    const statusClasses = {
      [InterviewStatus.PLANIFIE]: 'status-planned',
      [InterviewStatus.TERMINE]: 'status-completed',
      [InterviewStatus.ANNULE]: 'status-cancelled'
    };
    
    const labels = {
      [InterviewStatus.PLANIFIE]: 'Planifié',
      [InterviewStatus.TERMINE]: 'Terminé',
      [InterviewStatus.ANNULE]: 'Annulé'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: InterviewType) => {
    const typeClasses = {
      [InterviewType.VISIO]: 'type-visio',
      [InterviewType.PRESENTIEL]: 'type-onsite'
    };
    
    const labels = {
      [InterviewType.VISIO]: 'Visio',
      [InterviewType.PRESENTIEL]: 'Présentiel'
    };

    return (
      <span className={`type-badge ${typeClasses[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getStatusStats = () => {
    const stats = interviews.reduce((acc, interview) => {
      acc[interview.status] = (acc[interview.status] || 0) + 1;
      return acc;
    }, {} as Record<InterviewStatus, number>);

    return {
      total: interviews.length,
      planifie: stats[InterviewStatus.PLANIFIE] || 0,
      termine: stats[InterviewStatus.TERMINE] || 0,
      annule: stats[InterviewStatus.ANNULE] || 0
    };
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastInterview = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement des entretiens...</p>
        </div>
      </div>
    );
  }

  if (error && !showStatusModal) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchInterviews} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="interview-list-page">
      <div className="container">
        <div className="header">
          <h1>Gestion des entretiens</h1>
          <p>Planifiez et suivez tous les entretiens de recrutement</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Total</p>
                <p className="stat-number stat-number-gray">{stats.total}</p>
              </div>
              <div className="stat-icon stat-icon-gray">
                📅
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Planifiés</p>
                <p className="stat-number stat-number-blue">{stats.planifie}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                ⏰
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Terminés</p>
                <p className="stat-number stat-number-green">{stats.termine}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                ✅
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Annulés</p>
                <p className="stat-number stat-number-red">{stats.annule}</p>
              </div>
              <div className="stat-icon stat-icon-red">
                ❌
              </div>
            </div>
          </div>
        </div>

        <div className="filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="search">Rechercher</label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom candidat, poste..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status-filter">🏷️ Statut</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InterviewStatus | '')}
                className="form-select"
              >
                <option value="">Tous les statuts</option>
                <option value={InterviewStatus.PLANIFIE}>Planifié</option>
                <option value={InterviewStatus.TERMINE}>Terminé</option>
                <option value={InterviewStatus.ANNULE}>Annulé</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="type-filter">Type</label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as InterviewType | '')}
                className="form-select"
              >
                <option value="">Tous les types</option>
                <option value={InterviewType.VISIO}>Visioconférence</option>
                <option value={InterviewType.PRESENTIEL}>Présentiel</option>
              </select>
            </div>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucun entretien trouvé</p>
          </div>
        ) : (
          <div className="interviews-section">
            <div className="interview-section-header">
              <h3>
                📋 {filteredInterviews.length} entretien{filteredInterviews.length > 1 ? 's' : ''} trouvé{filteredInterviews.length > 1 ? 's' : ''}
              </h3>
            </div>
            
            <div className="interviews-list">
              {filteredInterviews.map((interview) => (
                <div 
                  key={interview.id} 
                  className={`interview-item ${isPastInterview(interview.interviewDate) && interview.status === InterviewStatus.PLANIFIE ? 'past-due' : ''}`}
                >
                  <div className="interview-header">
                    <div className="interview-content">
                      <div className="interview-title">
                        <h4>
                          👤 {interview.application.firstname} {interview.application.lastname}
                        </h4>
                        <div className="badges">
                          {getStatusBadge(interview.status)}
                          {getTypeBadge(interview.type)}
                          {isPastInterview(interview.interviewDate) && interview.status === InterviewStatus.PLANIFIE && (
                            <span className="past-due-badge">
                              Passé
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="interview-list-details">
                        <div className="detail-item">
                          <span className="detail-label">💼 Poste :</span>
                          <span>{interview.application.jobOffer.title}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📅 Date :</span>
                          <span>{formatDateTime(interview.interviewDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">🎥 Type :</span>
                          <span>{interview.type === InterviewType.VISIO ? 'Visioconférence' : 'Présentiel'}</span>
                        </div>

                        <div className="interview-actions">
                        <button
                          onClick={() => handleStatusChange(interview)}
                          className="btn-modify"
                          >
                          ⚙️ Modifier statut
                        </button>
                        </div>


                      </div>

                  

                      {interview.type === InterviewType.VISIO && interview.visioLink && (
                        <div className="visio-link-container">
                          <span className="detail-label">🔗 Lien :</span>
                          <span className="visio-link-text">
                            {interview.visioLink}
                          </span>
                        </div>
                      )}

                      {interview.notes && (
                        <div className="notes-container">
                          <span className="detail-label">📝 Notes :</span> {interview.notes}
                        </div>
                      )}
                    </div>
                    
            
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showStatusModal && selectedInterview && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Modifier le statut de l'entretien</h3>
                <p className="modal-subtitle">
                  {selectedInterview.application.firstname} {selectedInterview.application.lastname} - {selectedInterview.application.jobOffer.title}
                </p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="new-status">Nouveau statut</label>
                  <select
                    id="new-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as InterviewStatus)}
                    className="form-select"
                  >
                    <option value={InterviewStatus.PLANIFIE}>Planifié</option>
                    <option value={InterviewStatus.TERMINE}>Terminé</option>
                    <option value={InterviewStatus.ANNULE}>Annulé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="form-textarea"
                    placeholder="Notes sur l'entretien (optionnel)..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="btn-primary"
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedInterview(null);
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

export default InterviewListPage;