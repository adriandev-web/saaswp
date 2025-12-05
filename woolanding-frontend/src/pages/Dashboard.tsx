import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Witaj, {user?.name}!</h1>
          <p>Zarządzaj swoimi landing pages i generuj nowe</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats?.totalGenerations || 0}</h3>
              <p>Łącznie wygenerowano</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-content">
              <h3>{stats?.generationsThisMonth || 0}</h3>
              <p>W tym miesiącu</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <h3>{stats?.subscriptionStatus || 'Free'}</h3>
              <p>Plan subskrypcji</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <h2>Generuj nową landing page</h2>
            <p>Stwórz profesjonalną stronę sprzedażową w kilka sekund</p>
            <Link to="/generate" className="btn btn-primary">
              Rozpocznij generowanie
            </Link>
          </div>

          <div className="action-card">
            <h2>Zobacz swoje landing pages</h2>
            <p>Przeglądaj i zarządzaj wygenerowanymi stronami</p>
            <Link to="/history" className="btn btn-outline">
              Historia generowań
            </Link>
          </div>
        </div>

        <div className="quick-info">
          <h3>Informacje o koncie</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Firma:</span>
              <span className="info-value">{user?.companyName || 'Nie podano'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status konta:</span>
              <span className="info-value status-active">{user?.status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data rejestracji:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
