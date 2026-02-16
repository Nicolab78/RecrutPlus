import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import applicationService from '../../services/ApplicationService';
import type { Application} from '../../types/Application';
import { ApplicationStatus } from '../../types/Application';
import './ApplicationListPage.css';

const ApplicationListPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter, searchTerm]);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des candidatures');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobOffer.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    
    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusClasses = {
      [ApplicationStatus.EN_ATTENTE]: 'status-en-attente',
      [ApplicationStatus.EN_COURS]: 'status-en-cours',
      [ApplicationStatus.ACCEPTE_ENTRETIEN]: 'status-accepte-entretien',
      [ApplicationStatus.ENTRETIEN_TERMINE]: 'status-entretien-termine',
      [ApplicationStatus.REFUSE]: 'status-refuse',
      [ApplicationStatus.EMBAUCHE]: 'status-embauche',
      [ApplicationStatus.REFUSE_APRES_ENTRETIEN]: 'status-refuse-apres-entretien'
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

  const getStatusStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    return {
      total: applications.length,
      enAttente: stats[ApplicationStatus.EN_ATTENTE] || 0,
      enCours: stats[ApplicationStatus.EN_COURS] || 0,
      embauche: stats[ApplicationStatus.EMBAUCHE] || 0,
      refuse: (stats[ApplicationStatus.REFUSE] || 0) + (stats[ApplicationStatus.REFUSE_APRES_ENTRETIEN] || 0)
    };
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
          <p>Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchApplications} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="application-list-page">
      <div className="container">
        <div className="header">
          <h1>Gestion des candidatures</h1>
          <p>Gérez toutes les candidatures reçues pour vos offres d'emploi</p>
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
                <p>En attente</p>
                <p className="stat-number stat-number-blue">{stats.enAttente}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                ⏰
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>En cours</p>
                <p className="stat-number stat-number-green">{stats.enCours}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                ✅
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Embauché</p>
                <p className="stat-number stat-number-red">{stats.embauche}</p>
              </div>
              <div className="stat-icon stat-icon-red">
                🎉
              </div>
            </div>
          </div>
        </div>

        <div className="filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="search">🔍 Rechercher</label>
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
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
                className="form-select"
              >
                <option value="">Tous les statuts</option>
                <option value={ApplicationStatus.EN_ATTENTE}>En attente</option>
                <option value={ApplicationStatus.EN_COURS}>En cours</option>
                <option value={ApplicationStatus.ACCEPTE_ENTRETIEN}>Convoqué</option>
                <option value={ApplicationStatus.ENTRETIEN_TERMINE}>Entretien effectué</option>
                <option value={ApplicationStatus.REFUSE}>Refusé</option>
                <option value={ApplicationStatus.EMBAUCHE}>Embauché</option>
                <option value={ApplicationStatus.REFUSE_APRES_ENTRETIEN}>Refusé (entretien)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucune candidature trouvée</p>
          </div>
        ) : (
          <div className="applications-section">
            <div className="application-section-header">
              <h3>
                📋 {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} trouvée{filteredApplications.length > 1 ? 's' : ''}
              </h3>
            </div>
            
            <div className="applications-list">
              {filteredApplications.map((application) => (
                <div key={application.id} className="application-item">
                  <div className="application-header">
                    <div className="application-content">
                      <div className="application-title">
                        <h4>
                          👤 {application.firstname} {application.lastname}
                        </h4>
                        <div className="badges">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>
                      
                      <div className="application-list-details">
                        <div className="detail-item">
                          <span className="detail-label">💼 Poste :</span>
                          <span>{application.jobOffer.title}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📅 Date :</span>
                          <span>{formatDate(application.applicationDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">✉️ Email :</span>
                          <span>{application.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="application-actions">
                      <Link
                        to={`/application/${application.id}`}
                        className="btn-modify"
                      >
                        👁️ Voir détail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationListPage;