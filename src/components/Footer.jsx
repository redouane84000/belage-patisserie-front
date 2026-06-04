import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-mobile-delivery">Livraison sur Avignon et ses alentours</div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Bel age Pâtisserie</h3>
            <p className="footer-text">
              Créations artisanales de pâtisseries d'exception
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1EcH7ELCMR/?mibextid=wwXIfr" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/belage_patisserie?igsh=MWN4dmJodmJhY3F0cg%3D%3D&utm_source=qr" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@belage_patisserie?_t=ZN-8w758A1tmiM&_r=1" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://www.snapchat.com/t/itTs8tdw" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-snapchat"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Accueil</Link></li>
              <li><Link to="/produits" className="footer-link">Nos Créations</Link></li>
              <li><Link to="/a-propos" className="footer-link">À Propos</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-contact">
              <li>Email: Patisseriebelage@gmail.com</li>
              <li>Téléphone: +33 6 64 72 38 45</li>
              <li>Adresse: 10 Rue de L'Armenie</li>
              <li>84000 AVIGNON</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bel âge Pâtisserie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
