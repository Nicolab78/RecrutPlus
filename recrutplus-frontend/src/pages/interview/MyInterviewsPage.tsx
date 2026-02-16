import React, { useEffect, useState } from 'react';
import interviewService from '../../services/InterviewService';
import type { Interview } from '../../types/Interview';
import { InterviewStatus, InterviewType } from '../../types/Interview';
import './MyInterviewsPage.css';

const MyInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyInterviews();
  }, []);

  const fetchMyInterviews = async () => {
    try {
      const data = await interviewService.getMyInterviews();
      setInterviews(data);
    } catch (err: any) {
      setError('Erreur lors du chargement de vos entretiens');
    } finally {
      setIsLoading(false);
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
      [InterviewType.VISIO]: 'Visioconférence',
      [InterviewType.PRESENTIEL]: 'Présentiel'
    };

    return (
      <span className={`type-badge ${typeClasses[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const interviewDate = new Date(dateString);
    return interviewDate.toDateString() === today.toDateString();
  };

  const getUpcomingInterviews = () => {
    return interviews.filter(interview => 
      isUpcoming(interview.interviewDate) && interview.status === InterviewStatus.PLANIFIE
    );
  };

  const getPastInterviews = () => {
    return interviews.filter(interview => 
      isPast(interview.interviewDate) || interview.status === InterviewStatus.TERMINE
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement de vos entretiens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchMyInterviews} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const upcomingInterviews = getUpcomingInterviews();
  const pastInterviews = getPastInterviews();

  return (
    <div className="my-interviews-page">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <div className="header-icon">
              📅
            </div>
            <div className="header-text">
              <h1>Mes entretiens</h1>
              <p>Consultez vos entretiens programmés et passés</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                📋
              </div>
              <div className="stat-content">
                <p className="stat-number">{interviews.length}</p>
                <p className="stat-label">Entretien{interviews.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-blue">
                ⏰
              </div>
              <div className="stat-content">
                <p className="stat-number stat-number-blue">{upcomingInterviews.length}</p>
                <p className="stat-label">À venir</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                ✅
              </div>
              <div className="stat-content">
                <p className="stat-number stat-number-green">{pastInterviews.length}</p>
                <p className="stat-label">Terminé{pastInterviews.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              📅
            </div>
            <h3>Aucun entretien planifié</h3>
            <p>Vous n'avez pas encore d'entretiens programmés.</p>
            <a href="/my-applications" className="cta-button">
              Voir mes candidatures
            </a>
          </div>
        ) : (
          <div className="interviews-sections">
            {upcomingInterviews.length > 0 && (
              <div className="interviews-section">
                <h2 className="section-title">
                  <span className="section-icon">⏰</span>
                  Entretiens à venir ({upcomingInterviews.length})
                </h2>
                <div className="interviews-list">
                  {upcomingInterviews.map((interview) => {
                    const { date, time } = formatDateTime(interview.interviewDate);
                    return (
                      <div key={interview.id} className="interview-card upcoming">
                        {isToday(interview.interviewDate) && (
                          <div className="today-alert">
                            <span className="alert-icon">⚠️</span>
                            <p>Entretien aujourd'hui !</p>
                          </div>
                        )}
                        
                        <div className="interview-content">
                          <div className="interview-header">
                            <h3>{interview.application.jobOffer.title}</h3>
                            <div className="badges">
                              {getStatusBadge(interview.status)}
                              {getTypeBadge(interview.type)}
                            </div>
                          </div>

                          <div className="interview-details">
                            <div className="detail-item">
                              <span className="detail-icon">📅</span>
                              <div>
                                <p className="detail-primary">{date}</p>
                                <p className="detail-secondary">à {time}</p>
                              </div>
                            </div>

                            <div className="detail-item">
                              <span className="detail-icon">📍</span>
                              <div>
                                <p className="detail-primary">
                                  {interview.type === InterviewType.VISIO ? 'Visioconférence' : 'Sur site'}
                                </p>
                                {interview.type === InterviewType.VISIO && interview.visioLink && (
                                  <p className="visio-link">{interview.visioLink}</p>
                                )}
                                {interview.type === InterviewType.PRESENTIEL && interview.address && (
                                  <p className="detail-secondary">
                                    {interview.address.number} {interview.address.street}, {interview.address.city}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {interview.notes && (
                            <div className="interview-notes">
                              <p><strong>📝 Instructions :</strong> {interview.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pastInterviews.length > 0 && (
              <div className="interviews-section">
                <h2 className="section-title">
                  <span className="section-icon">✅</span>
                  Entretiens passés ({pastInterviews.length})
                </h2>
                <div className="interviews-list">
                  {pastInterviews.map((interview) => {
                    const { date, time } = formatDateTime(interview.interviewDate);
                    return (
                      <div key={interview.id} className="interview-card past">
                        <div className="interview-content">
                          <div className="interview-header">
                            <h3>{interview.application.jobOffer.title}</h3>
                            <div className="badges">
                              {getStatusBadge(interview.status)}
                              {getTypeBadge(interview.type)}
                            </div>
                          </div>

                          <div className="interview-details">
                            <div className="detail-item">
                              <span className="detail-icon">📅</span>
                              <p className="detail-primary">{date} à {time}</p>
                            </div>
                          </div>

                          {interview.status === InterviewStatus.TERMINE && (
                            <div className="interview-result completed">
                              <p>Entretien terminé. Merci pour votre participation !</p>
                            </div>
                          )}

                          {interview.status === InterviewStatus.ANNULE && (
                            <div className="interview-result cancelled">
                              <p>Entretien annulé.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviewsPage;