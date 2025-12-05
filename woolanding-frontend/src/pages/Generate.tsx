import React, { useState } from 'react';
import { api } from '../services/api';
import type { GenerationResponse } from '../types';
import './Generate.css';

const Generate: React.FC = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    category: '',
    tone: 'professional' as 'professional' | 'casual' | 'enthusiastic',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await api.generateLandingPage({
        product: {
          id: `prod_${Date.now()}`,
          name: formData.productName,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
        },
        options: {
          tone: formData.tone,
          language: 'pl',
        },
      });

      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Generowanie nie powiodło się');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Skopiowano do schowka!');
  };

  return (
    <div className="generate">
      <div className="container">
        <div className="generate-header">
          <h1>Generuj Landing Page</h1>
          <p>Podaj informacje o swoim produkcie, a AI stworzy dla Ciebie landing page</p>
        </div>

        <div className="generate-content">
          <div className="generate-form-section">
            <form onSubmit={handleSubmit} className="generate-form">
              <div className="form-group">
                <label htmlFor="productName" className="form-label">
                  Nazwa produktu *
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  className="form-input"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="np. Premium WordPress Theme"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Cena *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="99.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Opis produktu *
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Opisz swój produkt..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Kategoria
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="np. Software, E-commerce"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tone" className="form-label">
                  Ton komunikacji
                </label>
                <select
                  id="tone"
                  name="tone"
                  className="form-input"
                  value={formData.tone}
                  onChange={handleChange}
                >
                  <option value="professional">Profesjonalny</option>
                  <option value="casual">Swobodny</option>
                  <option value="enthusiastic">Entuzjastyczny</option>
                </select>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Generowanie...' : 'Generuj Landing Page'}
              </button>
            </form>
          </div>

          {result && (
            <div className="result-section">
              <h2>Wynik generowania</h2>

              <div className="result-card">
                <h3>Nagłówek</h3>
                <p>{result.content.headline}</p>
                <button
                  onClick={() => copyToClipboard(result.content.headline)}
                  className="btn btn-secondary btn-sm"
                >
                  Kopiuj
                </button>
              </div>

              <div className="result-card">
                <h3>Podtytuł</h3>
                <p>{result.content.subheadline}</p>
                <button
                  onClick={() => copyToClipboard(result.content.subheadline)}
                  className="btn btn-secondary btn-sm"
                >
                  Kopiuj
                </button>
              </div>

              <div className="result-card">
                <h3>Korzyści</h3>
                <ul>
                  {result.content.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card">
                <h3>Call to Action</h3>
                <p>{result.content.ctaText}</p>
              </div>

              <div className="result-card">
                <h3>Szablon HTML</h3>
                <pre className="code-block">{result.content.htmlTemplate}</pre>
                <button
                  onClick={() => copyToClipboard(result.content.htmlTemplate)}
                  className="btn btn-primary btn-sm"
                >
                  Kopiuj HTML
                </button>
              </div>

              <div className="usage-info">
                <p>
                  <strong>Wykorzystano:</strong> {result.usage.generationsUsed} /{' '}
                  {result.usage.generationsUsed + result.usage.generationsRemaining}
                </p>
                <p>
                  <strong>Czas generowania:</strong> {result.metadata.processingTimeMs}ms
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
