import React, { useEffect, useState } from 'react';
import userService from '../../services/UserService';
import type { User} from '../../types/User';
import { UserRole } from '../../types/User';
import './UserAdministrationPage.css';

const UserAdministrationPage: React.FC = () => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>(UserRole.CANDIDAT);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createData, setCreateData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    birthdate: '',
    role: UserRole.CANDIDAT,
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: 'France'
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter === 'active') {
      filtered = filtered.filter(user => user.isActive !== false); 
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(user => user.isActive === false);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return dateB - dateA;
    });
    
    setFilteredUsers(filtered);
  };

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleStatusToggle = (user: User) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      await userService.update(selectedUser.id, { role: newRole });
      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour du rôle');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const newStatus = !(selectedUser.isActive !== false);
      await userService.toggleStatus(selectedUser.id, newStatus);
      await fetchUsers();
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async () => {
    if (!createData.firstname.trim() || !createData.lastname.trim() || !createData.email.trim()) {
      setError('Le prénom, nom et email sont obligatoires');
      return;
    }

    setIsCreating(true);
    try {
      const newUser = {
        firstname: createData.firstname,
        lastname: createData.lastname,
        email: createData.email,
        phone: createData.phone,
        birthdate: createData.birthdate || undefined,
        role: createData.role,
        address: createData.address.city ? createData.address : undefined
      };

      await userService.create(newUser);
      await fetchUsers();
      setShowCreateModal(false);
      setCreateData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        role: UserRole.CANDIDAT,
        address: {
          street: '',
          number: '',
          postalCode: '',
          city: '',
          country: 'France'
        }
      });
    } catch (err: any) {
      setError('Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsCreating(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleClasses = {
      [UserRole.ADMIN]: 'role-admin',
      [UserRole.RH]: 'role-rh',
      [UserRole.CANDIDAT]: 'role-candidat'
    };
    
    const labels = {
      [UserRole.ADMIN]: 'Admin',
      [UserRole.RH]: 'RH',
      [UserRole.CANDIDAT]: 'Candidat'
    };

    return (
      <span className={`role-badge ${roleClasses[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (isActive?: boolean) => {
    const active = isActive !== false;
    return (
      <span className={`status-badge ${active ? 'status-active' : 'status-inactive'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const getUserStats = () => {
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    const activeUsers = users.filter(user => user.isActive !== false).length;
    const inactiveUsers = users.length - activeUsers;

    return {
      total: users.length,
      admin: roleStats[UserRole.ADMIN] || 0,
      rh: roleStats[UserRole.RH] || 0,
      candidat: roleStats[UserRole.CANDIDAT] || 0,
      active: activeUsers,
      inactive: inactiveUsers
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLocationString = (user: User) => {
    if (user.address) {
      return `${user.address.city || ''} ${user.address.postalCode || ''}`.trim() || 'Non spécifié';
    }
    return 'Non spécifié';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error && !showRoleModal && !showStatusModal && !showCreateModal) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchUsers} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = getUserStats();

  return (
    <div className="user-administration-page">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1>Administration des utilisateurs</h1>
            <p>Gérez les utilisateurs, leurs rôles et leurs permissions</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Total utilisateurs</p>
                <p className="stat-number stat-number-gray">{stats.total}</p>
              </div>
              <div className="stat-icon stat-icon-gray">
                👥
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Actifs</p>
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
                <p>RH</p>
                <p className="stat-number stat-number-blue">{stats.rh}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                🏢
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-text">
                <p>Candidats</p>
                <p className="stat-number stat-number-red">{stats.candidat}</p>
              </div>
              <div className="stat-icon stat-icon-red">
                🎯
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
                  placeholder="Nom, prénom, email..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role-filter">👤 Rôle</label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
                  className="form-select"
                >
                  <option value="">Tous les rôles</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.RH}>RH</option>
                  <option value={UserRole.CANDIDAT}>Candidat</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status-filter">🔄 Statut</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | '')}
                  className="form-select"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
            </div>
            <div className="create-user-section">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                ➕ Créer un utilisateur
              </button>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="users-section">
            <div className="user-section-header">
              <h3>
                👥 {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </h3>
            </div>
            
            <div className="users-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-header">
                    <div className="user-content">
                      <div className="user-title">
                        <h4>
                          👤 {user.firstname} {user.lastname}
                        </h4>
                        <div className="badges">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.isActive)}
                        </div>
                      </div>
                      
                      <div className="user-list-details">
                        <div className="detail-item">
                          <span className="detail-label">📧 Email :</span>
                          <span>{user.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📍 Localisation :</span>
                          <span>{getLocationString(user)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📅 Inscription :</span>
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                        <div className="user-actions">
                          <div className="actions-group">
                            <button
                              onClick={() => handleRoleChange(user)}
                              className="btn-secondary btn-small"
                            >
                              👤 Rôle
                            </button>
                            <button
                              onClick={() => handleStatusToggle(user)}
                              className={`btn-small ${(user.isActive !== false) ? 'btn-danger' : 'btn-success'}`}
                            >
                              {(user.isActive !== false) ? '❌ Désactiver' : '✅ Activer'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {user.phone && (
                        <div className="user-meta">
                          <span className="meta-text">
                            📞 {user.phone}
                            {user.birthdate && ` • 🎂 Né(e) le ${formatDate(user.birthdate)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de création d'utilisateur */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h3>Créer un nouvel utilisateur</h3>
                <p className="modal-subtitle">Un code d'accès temporaire sera généré automatiquement</p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <h4>Informations personnelles *</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-firstname">Prénom *</label>
                    <input
                      id="create-firstname"
                      type="text"
                      value={createData.firstname}
                      onChange={(e) => setCreateData(prev => ({...prev, firstname: e.target.value}))}
                      className="form-input"
                      placeholder="Jean"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-lastname">Nom *</label>
                    <input
                      id="create-lastname"
                      type="text"
                      value={createData.lastname}
                      onChange={(e) => setCreateData(prev => ({...prev, lastname: e.target.value}))}
                      className="form-input"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="create-email">Email *</label>
                  <input
                    id="create-email"
                    type="email"
                    value={createData.email}
                    onChange={(e) => setCreateData(prev => ({...prev, email: e.target.value}))}
                    className="form-input"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-phone">Téléphone</label>
                    <input
                      id="create-phone"
                      type="tel"
                      value={createData.phone}
                      onChange={(e) => setCreateData(prev => ({...prev, phone: e.target.value}))}
                      className="form-input"
                      placeholder="0123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-birthdate">Date de naissance</label>
                    <input
                      id="create-birthdate"
                      type="date"
                      value={createData.birthdate}
                      onChange={(e) => setCreateData(prev => ({...prev, birthdate: e.target.value}))}
                      className="form-input"
                    />
                  </div>
                </div>

                <h4>Rôle et permissions</h4>
                <div className="form-group">
                  <label htmlFor="create-role">Rôle *</label>
                  <select
                    id="create-role"
                    value={createData.role}
                    onChange={(e) => setCreateData(prev => ({...prev, role: e.target.value as UserRole}))}
                    className="form-select"
                  >
                    <option value={UserRole.CANDIDAT}>Candidat</option>
                    <option value={UserRole.RH}>RH</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>

                <h4>Adresse (optionnelle)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-street">Rue</label>
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
                    <label htmlFor="create-number">Numéro</label>
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
                    <label htmlFor="create-city">Ville</label>
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
                    <label htmlFor="create-postal">Code postal</label>
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
                  <label htmlFor="create-country">Pays</label>
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

                <div className="access-code-info">
                  <p className="info-text">
                    Un code d'accès temporaire sera généré automatiquement. L'utilisateur devra définir un mot de passe lors de sa première connexion.
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleCreateUser}
                  disabled={isCreating || !createData.firstname.trim() || !createData.lastname.trim() || !createData.email.trim()}
                  className="btn-primary"
                >
                  {isCreating ? 'Création...' : 'Créer l\'utilisateur'}
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

        {showRoleModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Modifier le rôle de l'utilisateur</h3>
                <p className="modal-subtitle">
                  {selectedUser.firstname} {selectedUser.lastname} - {selectedUser.email}
                </p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="new-role">Nouveau rôle</label>
                  <select
                    id="new-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="form-select"
                  >
                    <option value={UserRole.CANDIDAT}>Candidat</option>
                    <option value={UserRole.RH}>RH</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
                
                <div className="role-info">
                  {newRole === UserRole.ADMIN && (
                    <p className="info-text">L'admin aura accès à toutes les fonctionnalités d'administration</p>
                  )}
                  {newRole === UserRole.RH && (
                    <p className="info-text">Le RH pourra créer et gérer des offres d'emploi et voir les candidatures</p>
                  )}
                  {newRole === UserRole.CANDIDAT && (
                    <p className="info-text">Le candidat pourra postuler aux offres d'emploi</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleUpdateRole}
                  disabled={isUpdating}
                  className="btn-primary"
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
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

        {showStatusModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{(selectedUser.isActive !== false) ? 'Désactiver' : 'Activer'} l'utilisateur</h3>
                <p className="modal-subtitle">
                  {selectedUser.firstname} {selectedUser.lastname} - {selectedUser.email}
                </p>
              </div>

              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="modal-form">
                <p>
                  {(selectedUser.isActive !== false)
                    ? 'Êtes-vous sûr de vouloir désactiver cet utilisateur ? Il ne pourra plus se connecter.'
                    : 'Êtes-vous sûr de vouloir activer cet utilisateur ? Il pourra se reconnecter.'
                  }
                </p>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleToggleStatus}
                  disabled={isUpdating}
                  className={(selectedUser.isActive !== false) ? 'btn-danger' : 'btn-success'}
                >
                  {isUpdating 
                    ? 'Mise à jour...' 
                    : (selectedUser.isActive !== false) ? 'Désactiver' : 'Activer'
                  }
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedUser(null);
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

export default UserAdministrationPage;