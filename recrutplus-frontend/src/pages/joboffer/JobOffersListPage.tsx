import React, { useEffect, useState } from 'react';
import jobOfferService from '../../services/JobOfferService';
import type { JobOffer, Specialty, ContractType } from '../../types/JobOffer';

import { JobOfferCard } from '../../components/JobOfferCard';
import './JobOffersListPage.css';

const JobOffersListPage: React.FC = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | ''>('');
  const [selectedContractType, setSelectedContractType] = useState<ContractType | ''>('');

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersData, specialtiesData, contractTypesData] = await Promise.all([
          jobOfferService.getActive(),
          jobOfferService.getAllSpecialties(),
          jobOfferService.getAllContractTypes()
        ]);

        setOffers(offersData);
        setFilteredOffers(offersData);
        setSpecialties(specialtiesData);
        setContractTypes(contractTypesData);
      } catch (err: any) {
        setError('Erreur lors du chargement des offres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const results = await jobOfferService.search(
        keyword || undefined,
        selectedSpecialty || undefined,
        selectedContractType || undefined
      );
      setFilteredOffers(results);
    } catch (err: any) {
      setError('Erreur lors de la recherche');
    }
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedSpecialty('');
    setSelectedContractType('');
    setFilteredOffers(offers);
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
    <div className="job-offers-list-page">
      <div className="container">
        <div className="header">
          <h1>💼 Offres d'emploi</h1>
        </div>

        {/* Filtres */}
        <div className="filters-card">
          <h2 className="filters-title">🔍 Rechercher</h2>
          
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="keyword">Mot-clé</label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Titre, ville..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Spécialité</label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value as Specialty | '')}
                className="form-select"
              >
                <option value="">Toutes</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contract-type">Type de contrat</label>
              <select
                id="contract-type"
                value={selectedContractType}
                onChange={(e) => setSelectedContractType(e.target.value as ContractType | '')}
                className="form-select"
              >
                <option value="">Tous</option>
                {contractTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button
              onClick={handleSearch}
              className="btn-search"
            >
              🔍 Rechercher
            </button>
            <button
              onClick={handleReset}
              className="btn-reset"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        <div className="results-info">
          <p>
            📊 {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''} trouvée{filteredOffers.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              📭
            </div>
            <h3>Aucune offre trouvée</h3>
            <p>Aucune offre ne correspond à vos critères de recherche</p>
          </div>
        ) : (
          <div className="offers-list">
            {filteredOffers.map((offer) => (
              <JobOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOffersListPage;