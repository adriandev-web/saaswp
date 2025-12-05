import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nieprawidłowy email lub hasło');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Zaloguj się</h1>
          <p className="auth-subtitle">Witaj ponownie! Zaloguj się do swojego konta</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Twoje hasło"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>

          <p className="auth-footer">
            Nie masz konta?{' '}
            <Link to="/register" className="auth-link">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
