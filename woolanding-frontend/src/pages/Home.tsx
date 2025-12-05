import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Generuj <span className="gradient-text">Landing Pages</span> z pomocą AI
            </h1>
            <p className="hero-subtitle">
              Stwórz profesjonalne strony sprzedażowe w kilka sekund dzięki sztucznej
              inteligencji. Oszczędź czas i zwiększ konwersję.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Wypróbuj za darmo
              </Link>
              <Link to="/pricing" className="btn btn-outline btn-lg">
                Zobacz cennik
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Dlaczego WooLanding AI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Błyskawicznie szybko</h3>
              <p>Wygeneruj kompletną landing page w mniej niż 30 sekund</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Profesjonalny design</h3>
              <p>Każda strona jest zoptymalizowana pod kątem konwersji</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>AI Content</h3>
              <p>Treści pisane przez AI dostosowane do Twojego produktu</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsywne</h3>
              <p>Strony wyglądają świetnie na każdym urządzeniu</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Pełna kontrola</h3>
              <p>Edytuj i dostosuj wygenerowane strony według potrzeb</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Opłacalne</h3>
              <p>Płać tylko za to, czego potrzebujesz</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Gotowy, aby zacząć?</h2>
            <p className="cta-text">
              Dołącz do tysięcy zadowolonych użytkowników, którzy generują landing pages z AI
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Rozpocznij za darmo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
