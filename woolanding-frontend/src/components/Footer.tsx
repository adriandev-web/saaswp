import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">WooLanding AI</h3>
            <p className="footer-description">
              Platforma SaaS do generowania landing pages z wykorzystaniem sztucznej inteligencji
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Produkt</h4>
            <ul className="footer-links">
              <li>
                <a href="/pricing">Cennik</a>
              </li>
              <li>
                <a href="/features">Funkcje</a>
              </li>
              <li>
                <a href="/docs">Dokumentacja</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Firma</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">O nas</a>
              </li>
              <li>
                <a href="/contact">Kontakt</a>
              </li>
              <li>
                <a href="/privacy">Polityka prywatności</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Kontakt</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:contact@woolanding.com">contact@woolanding.com</a>
              </li>
              <li>
                <a
                  href="https://github.com/adriandev-web/saaswp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 WooLanding AI Generator. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
