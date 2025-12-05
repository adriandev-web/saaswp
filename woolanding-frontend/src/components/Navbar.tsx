import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🚀</span>
            WooLanding AI
          </Link>

          <div className="navbar-menu">
            <Link to="/pricing" className="navbar-link">
              Cennik
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
                <Link to="/generate" className="navbar-link">
                  Generuj
                </Link>
                <div className="navbar-user">
                  <span className="user-name">{user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Wyloguj
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  Zaloguj się
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
