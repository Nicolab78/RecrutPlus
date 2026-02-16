import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginDTO } from '../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials: LoginDTO = {
        email,
        password
      };

      await login(credentials);
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">
            Connexion
          </h2>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <span className="error-icon">❌</span>
              <p>{error}</p>
            </div>
          )}

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input form-input-top"
                placeholder="Votre adresse email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input form-input-bottom"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Connexion...
              </>
            ) : (
              <>
                Se connecter
              </>
            )}
          </button>

          <div className="login-footer">
            <p>
              Pas encore de compte ?{' '}
              <a href="/job-offers" className="signup-link">
                Postulez à une offre pour en créer un
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;