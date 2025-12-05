import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Rejestracja nie powiodła się');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Utwórz konto</h1>
          <p className="auth-subtitle">Rozpocznij generowanie landing pages z AI</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Imię i nazwisko
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jan Kowalski"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="twoj@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 znaków"
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName" className="form-label">
                Nazwa firmy (opcjonalnie)
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Twoja firma"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>
          </form>

          <p className="auth-footer">
            Masz już konto?{' '}
            <Link to="/login" className="auth-link">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
