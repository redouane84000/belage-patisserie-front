import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header id="header" className={isScrolled ? 'scrolled' : ''}>
      <div className="gold-sparkles">
        {Array.from({ length: 70 }).map((_, i) => (
          <span key={i} className={`sparkle sparkle${i+1}`}></span>
        ))}
      </div>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-subtext">BEL AGE</span>
            <span className="logo-subtext">PÂTISSERIE</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>Accueil</Link>
            <Link to="/produits" className="nav-link" onClick={closeMenu}>Nos Créations</Link>
            <Link to="/devis" className="nav-link" onClick={closeMenu}>Demander un Devis</Link>
            <Link to="/simulation-tarif" className="nav-link" onClick={closeMenu}>Simulation Tarif</Link>
          </nav>

          <button 
            className={`menu-button ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="menu-icon"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

