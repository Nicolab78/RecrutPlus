import React, { useEffect, useState } from 'react';
import jobOfferService from '../../services/JobOfferService';
import type { JobOffer} from '../../types/JobOffer';
import { Specialty, ContractType } from '../../types/JobOffer';
import './JobOffersManagementPage.css';

const JobOffersManagementPage: React.FC = () => {
  
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [filteredJobOffers, setFilteredJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<Specialty | ''>('');
  const [contractTypeFilter, setContractTypeFilter] = useState<ContractType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(null);
  const [newStatus, setNewStatus] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createData, setCreateData] = useState({
    title: '',
    specialty: Specialty.IT,
    contractType: ContractType.CDI,
    content: '',
    salary: '',
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: 'France'
    }
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    title: '',
    specialty: Specialty.IT,
    contractType: ContractType.CDI,
    content: '',
    salary: '',
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: ''
    }
  });

  useEffect(() => {
    fetchJobOffers();
  }, []);

  useEffect(() => {
    filterJobOffers();
  }, [jobOffers, statusFilter, specialtyFilter, contractTypeFilter, searchTerm]);

  const fetchJobOffers = async () => {
    try {
      const data = await jobOfferService.getAll();
      setJobOffers(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des offres d\'emploi');
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobOffers = () => {
    let filtered = [...jobOffers];
    
    if (statusFilter === 'active') {
      filtered = filtered.filter(offer => offer.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(offer => !offer.isActive);
    }
    
    if (specialtyFilter) {
      filtered = filtered.filter(offer => offer.specialty === specialtyFilter);
    }
    
    if (contractTypeFilter) {
      filtered = filtered.filter(offer => offer.contractType === contractTypeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offer.address?.city && offer.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    filtered.sort((a, b) => new Date(b.updatedAt || b.creationDate).getTime() - new Date(a.updatedAt || a.creationDate).getTime());
    
    setFilteredJobOffers(filtered);
  };

  const handleStatusChange = (jobOffer: JobOffer) => {
    setSelectedJobOffer(jobOffer);
    setNewStatus(jobOffer.isActive);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedJobOffer) return;

    setIsUpdating(true);
    try {
      await jobOfferService.update(selectedJobOffer.id, { isActive: newStatus });
      await fetchJobOffers();
      setShowStatusModal(false);
      setSelectedJobOffer(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateOffer = async () => {
    if (!createData.title.trim() || !createData.content.trim() || !createData.address.city.trim()) {
      setError('Le titre, la description et la ville sont obligatoires');
      return;
    }

    setIsCreating(true);
    try {
      const newOffer = {
        title: createData.title,
        specialty: createData.specialty,
        contractType: createData.contractType,
        content: createData.content,
        salary: createData.salary ? parseInt(createData.salary) : undefined,
        address: createData.address
      };

      await jobOfferService.create(newOffer);
      await fetchJobOffers();
      setShowCreateModal(false);
      setCreateData({
        title: '',
        specialty: Specialty.IT,
        contractType: ContractType.CDI,
        content: '',
        salary: '',
        address: {
          street: '',
          number: '',
          postalCode: '',
          city: '',
          country: 'France'
        }
      });
    } catch (err: any) {
      setError('Erreur lors de la création de l\'offre');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditClick = (jobOffer: JobOffer) => {
    setEditData({
      id: jobOffer.id,
      title: jobOffer.title,
      specialty: jobOffer.specialty,
      contractType: jobOffer.contractType,
      content: jobOffer.content,
      salary: jobOffer.salary?.toString() || '',
      address: {
        street: jobOffer.address?.street || '',
        number: jobOffer.address?.number || '',
        postalCode: jobOffer.address?.postalCode || '',
        city: jobOffer.address?.city || '',
        country: jobOffer.address?.country || ''
      }
    });
    setShowEditModal(true);
  };

  const handleUpdateOffer = async () => {
    if (!editData.title.trim() || !editData.content.trim() || !editData.address.city.trim()) {
      setError('Le titre, la description et la ville sont obligatoires');
      return;
    }

    setIsEditing(true);
    try {
      const updateData = {
        title: editData.title,
        specialty: editData.specialty,
        contractType: editData.contractType,
        content: editData.content,
        salary: editData.salary ? parseInt(editData.salary) : undefined,
        address: editData.address
      };

      await jobOfferService.update(editData.id, updateData);
      await fetchJobOffers();
      setShowEditModal(false);
    } catch (err: any) {
      setError('Erreur lors de la modification');
    } finally {
      setIsEditing(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getSpecialtyBadge = (specialty: Specialty) => {
    const specialtyLabels = {
      [Specialty.IT]: 'IT',
      [Specialty.FINANCE]: 'Finance',
      [Specialty.MARKETING]: 'Marketing', 
      [Specialty.RH]: 'RH',
      [Specialty.COMMERCIAL]: 'Commercial',
      [Specialty.LOGISTIQUE]: 'Logistique',
      [Specialty.SANTE]: 'Santé',
      [Specialty.EDUCATION]: 'Éducation'
    };

    return (
      <span className="specialty-badge">
        {specialtyLabels[specialty]}
      </span>
    );
  };

  const getContractTypeBadge = (contractType: ContractType) => {
    return (
      <span className="contract-badge">
        {contractType}
      </span>
    );
  };

  const getStatusStats = () => {
    const activeOffers = jobOffers.filter(offer => offer.isActive).length;
    const inactiveOffers = jobOffers.length - activeOffers;
    const itOffers = jobOffers.filter(offer => offer.specialty === Specialty.IT).length;
    const cdiOffers = jobOffers.filter(offer => offer.contractType === ContractType.CDI).length;

    return {
      total: jobOffers.length,
      active: activeOffers,
      inactive: inactiveOffers,
      it: itOffers,
      cdi: cdiOffers
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getLocationString = (offer: JobOffer) => {
    if (offer.address) {
      return `${offer.address.city || ''} ${offer.address.postalCode || ''}`.trim();
    }
    return 'Lieu non spécifié';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement des offres d'emploi...</p>
        </div>
      </div>
    );
  }

  if (error && !showStatusModal && !showCreateModal && !showEditModal) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchJobOffers} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="job-offers-management-page">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1>Gestion des offres d'emploi</h1>
            <p>Créez, modifiez et gérez vos offres d'emploi</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Total</p>
                <p className="stat-number stat-number-gray">{stats.total}</p>
              </div>
              <div className="stat-icon stat-icon-gray">
                💼
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Actives</p>
                <p className="stat-number stat-number-green">{stats.active}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                ✅
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Inactives</p>
                <p className="stat-number stat-number-blue">{stats.inactive}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                ❌
              </div>
            </div>
          </div>

        </div>

        <div className="filters-card">
          <div className="filters-header">
            <div className="filters-grid">
              <div className="form-group">
                <label htmlFor="search">🔍 Rechercher</label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Titre, spécialité, lieu..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status-filter">🏷️ Statut</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | '')}
                  className="form-select"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="specialty-filter">🏢 Spécialité</label>
                <select
                  id="specialty-filter"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value as Specialty | '')}
                  className="form-select"
                >
                  <option value="">Toutes les spécialités</option>
                  <option value={Specialty.IT}>IT</option>
                  <option value={Specialty.FINANCE}>Finance</option>
                  <option value={Specialty.MARKETING}>Marketing</option>
                  <option value={Specialty.RH}>RH</option>
                  <option value={Specialty.COMMERCIAL}>Commercial</option>
                  <option value={Specialty.LOGISTIQUE}>Logistique</option>
                  <option value={Specialty.SANTE}>Santé</option>
                  <option value={Specialty.EDUCATION}>Éducation</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contract-filter">📋 Type de contrat</label>
                <select
                  id="contract-filter"
                  value={contractTypeFilter}
                  onChange={(e) => setContractTypeFilter(e.target.value as ContractType | '')}
                  className="form-select"
                >
                  <option value="">Tous les types</option>
                  <option value={ContractType.CDI}>CDI</option>
                  <option value={ContractType.CDD}>CDD</option>
                  <option value={ContractType.STAGE}>Stage</option>
                  <option value={ContractType.ALTERNANCE}>Alternance</option>
                </select>
              </div>
            </div>
            <div className="create-offer-section">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                ➕ Créer une offre
              </button>
            </div>
          </div>
        </div>

        {filteredJobOffers.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucune offre d'emploi trouvée</p>
          </div>
        ) : (
          <div className="job-offers-section">
            <div className="job-offer-section-header">
              <h3>
                📋 {filteredJobOffers.length} offre{filteredJobOffers.length > 1 ? 's' : ''} trouvée{filteredJobOffers.length > 1 ? 's' : ''}
              </h3>
            </div>
            
            <div className="job-offers-list">
              {filteredJobOffers.map((jobOffer) => (
                <div key={jobOffer.id} className="job-offer-item">
                  <div className="job-offer-header">
                    <div className="job-offer-content">
                      <div className="job-offer-title">
                        <h4>
                          💼 {jobOffer.title}
                        </h4>
                        <div className="badges">
                          {getStatusBadge(jobOffer.isActive)}
                          {getSpecialtyBadge(jobOffer.specialty)}
                          {getContractTypeBadge(jobOffer.contractType)}
                        </div>
                      </div>
                      
                      <div className="job-offer-list-details">
                        <div className="detail-item">
                          <span className="detail-label">📍 Lieu :</span>
                          <span>{getLocationString(jobOffer)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">💰 Salaire :</span>
                          <span>{formatSalary(jobOffer.salary)}</span>
                        </div>
                        <div className="job-offer-actions">
                          <div className="actions-group">
                            <button
                              onClick={() => handleEditClick(jobOffer)}
                              className="btn-secondary btn-small"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => handleStatusChange(jobOffer)}
                              className="btn-modify btn-small"
                            >
                              {jobOffer.isActive ? '❌ Désactiver' : '✅ Activer'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="job-offer-meta">
                        <span className="meta-text">
                          📅 Créée le {formatDate(jobOffer.creationDate)}
                          {jobOffer.updatedAt && ` • Mise à jour le ${formatDate(jobOffer.updatedAt)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h3>Créer une nouvelle offre d'emploi</h3>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="create-title">Titre *</label>
                  <input
                    id="create-title"
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({...prev, title: e.target.value}))}
                    className="form-input"
                    placeholder="Ex: Développeur React Senior"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-specialty">Spécialité *</label>
                    <select
                      id="create-specialty"
                      value={createData.specialty}
                      onChange={(e) => setCreateData(prev => ({...prev, specialty: e.target.value as Specialty}))}
                      className="form-select"
                    >
                      <option value={Specialty.IT}>IT</option>
                      <option value={Specialty.FINANCE}>Finance</option>
                      <option value={Specialty.MARKETING}>Marketing</option>
                      <option value={Specialty.RH}>RH</option>
                      <option value={Specialty.COMMERCIAL}>Commercial</option>
                      <option value={Specialty.LOGISTIQUE}>Logistique</option>
                      <option value={Specialty.SANTE}>Santé</option>
                      <option value={Specialty.EDUCATION}>Éducation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-contract">Type de contrat *</label>
                    <select
                      id="create-contract"
                      value={createData.contractType}
                      onChange={(e) => setCreateData(prev => ({...prev, contractType: e.target.value as ContractType}))}
                      className="form-select"
                    >
                      <option value={ContractType.CDI}>CDI</option>
                      <option value={ContractType.CDD}>CDD</option>
                      <option value={ContractType.STAGE}>Stage</option>
                      <option value={ContractType.ALTERNANCE}>Alternance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="create-salary">Salaire</label>
                  <input
                    id="create-salary"
                    type="number"
                    value={createData.salary}
                    onChange={(e) => setCreateData(prev => ({...prev, salary: e.target.value}))}
                    className="form-input"
                    placeholder="Ex: 45000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-content">Description *</label>
                  <textarea
                    id="create-content"
                    value={createData.content}
                    onChange={(e) => setCreateData(prev => ({...prev, content: e.target.value}))}
                    rows={5}
                    className="form-textarea"
                    placeholder="Décrivez le poste, les missions, les compétences requises..."
                  />
                </div>

                <h4>Adresse *</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-street">Rue *</label>
                    <input
                      id="create-street"
                      type="text"
                      value={createData.address.street}
                      onChange={(e) => setCreateData(prev => ({
                        ...prev, 
                        address: {...prev.address, street: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="Rue de Rivoli"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-number">Numéro *</label>
                    <input
                      id="create-number"
                      type="text"
                      value={createData.address.number}
                      onChange={(e) => setCreateData(prev => ({
                        ...prev, 
                        address: {...prev.address, number: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-city">Ville *</label>
                    <input
                      id="create-city"
                      type="text"
                      value={createData.address.city}
                      onChange={(e) => setCreateData(prev => ({
                        ...prev, 
                        address: {...prev.address, city: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="Paris"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-postal">Code postal *</label>
                    <input
                      id="create-postal"
                      type="text"
                      value={createData.address.postalCode}
                      onChange={(e) => setCreateData(prev => ({
                        ...prev, 
                        address: {...prev.address, postalCode: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="create-country">Pays *</label>
                  <input
                    id="create-country"
                    type="text"
                    value={createData.address.country}
                    onChange={(e) => setCreateData(prev => ({
                      ...prev, 
                      address: {...prev.address, country: e.target.value}
                    }))}
                    className="form-input"
                    placeholder="France"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleCreateOffer}
                  disabled={isCreating || !createData.title.trim() || !createData.content.trim() || !createData.address.city.trim()}
                  className="btn-primary"
                >
                  {isCreating ? 'Création...' : 'Créer l\'offre'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
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

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h3>Modifier l'offre d'emploi</h3>
                <p className="modal-subtitle">ID: {editData.id}</p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="edit-title">Titre *</label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({...prev, title: e.target.value}))}
                    className="form-input"
                    placeholder="Ex: Développeur React Senior"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-specialty">Spécialité *</label>
                    <select
                      id="edit-specialty"
                      value={editData.specialty}
                      onChange={(e) => setEditData(prev => ({...prev, specialty: e.target.value as Specialty}))}
                      className="form-select"
                    >
                      <option value={Specialty.IT}>IT</option>
                      <option value={Specialty.FINANCE}>Finance</option>
                      <option value={Specialty.MARKETING}>Marketing</option>
                      <option value={Specialty.RH}>RH</option>
                      <option value={Specialty.COMMERCIAL}>Commercial</option>
                      <option value={Specialty.LOGISTIQUE}>Logistique</option>
                      <option value={Specialty.SANTE}>Santé</option>
                      <option value={Specialty.EDUCATION}>Éducation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-contract">Type de contrat *</label>
                    <select
                      id="edit-contract"
                      value={editData.contractType}
                      onChange={(e) => setEditData(prev => ({...prev, contractType: e.target.value as ContractType}))}
                      className="form-select"
                    >
                      <option value={ContractType.CDI}>CDI</option>
                      <option value={ContractType.CDD}>CDD</option>
                      <option value={ContractType.STAGE}>Stage</option>
                      <option value={ContractType.ALTERNANCE}>Alternance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-salary">Salaire (optionnel)</label>
                  <input
                    id="edit-salary"
                    type="number"
                    value={editData.salary}
                    onChange={(e) => setEditData(prev => ({...prev, salary: e.target.value}))}
                    className="form-input"
                    placeholder="Ex: 45000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-content">Description *</label>
                  <textarea
                    id="edit-content"
                    value={editData.content}
                    onChange={(e) => setEditData(prev => ({...prev, content: e.target.value}))}
                    rows={5}
                    className="form-textarea"
                    placeholder="Décrivez le poste, les missions, les compétences requises..."
                  />
                </div>

                <h4>Adresse *</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-street">Rue *</label>
                    <input
                      id="edit-street"
                      type="text"
                      value={editData.address.street}
                      onChange={(e) => setEditData(prev => ({
                        ...prev, 
                        address: {...prev.address, street: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="Rue de Rivoli"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-number">Numéro *</label>
                    <input
                      id="edit-number"
                      type="text"
                      value={editData.address.number}
                      onChange={(e) => setEditData(prev => ({
                        ...prev, 
                        address: {...prev.address, number: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-city">Ville *</label>
                    <input
                      id="edit-city"
                      type="text"
                      value={editData.address.city}
                      onChange={(e) => setEditData(prev => ({
                        ...prev, 
                        address: {...prev.address, city: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="Paris"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-postal">Code postal *</label>
                    <input
                      id="edit-postal"
                      type="text"
                      value={editData.address.postalCode}
                      onChange={(e) => setEditData(prev => ({
                        ...prev, 
                        address: {...prev.address, postalCode: e.target.value}
                      }))}
                      className="form-input"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-country">Pays *</label>
                  <input
                    id="edit-country"
                    type="text"
                    value={editData.address.country}
                    onChange={(e) => setEditData(prev => ({
                      ...prev, 
                      address: {...prev.address, country: e.target.value}
                    }))}
                    className="form-input"
                    placeholder="France"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleUpdateOffer}
                  disabled={isEditing || !editData.title.trim() || !editData.content.trim() || !editData.address.city.trim()}
                  className="btn-primary"
                >
                  {isEditing ? 'Modification...' : 'Modifier l\'offre'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
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

        {/* Modal de modification de statut */}
        {showStatusModal && selectedJobOffer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedJobOffer.isActive ? 'Désactiver' : 'Activer'} l'offre</h3>
                <p className="modal-subtitle">
                  {selectedJobOffer.title} - {selectedJobOffer.specialty}
                </p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <p>
                  {selectedJobOffer.isActive 
                    ? '⚠️ Êtes-vous sûr de vouloir désactiver cette offre ? Elle ne sera plus visible par les candidats.'
                    : '✅ Êtes-vous sûr de vouloir activer cette offre ? Elle sera visible par les candidats.'
                  }
                </p>
                <div className="form-group">
                  <label htmlFor="new-status">Nouveau statut</label>
                  <select
                    id="new-status"
                    value={newStatus.toString()}
                    onChange={(e) => setNewStatus(e.target.value === 'true')}
                    className="form-select"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="btn-primary"
                >
                  {isUpdating ? 'Mise à jour...' : 'Confirmer'}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedJobOffer(null);
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

export default JobOffersManagementPage;