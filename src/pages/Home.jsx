import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import winnie_cake from '../assets/logo/winnie_cake.png';
import mariage_cake from '../assets/logo/mariage_cake.png';
import confetti_cake from '../assets/logo/confetie.png';
import fleur_cake from '../assets/logo/fleur-cake.png';
import bento_cake4 from '../assets/logo/bento_cake4.PNG';
import CategoryCarousel from '../components/CategoryCarousel';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowDelivery(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'Bento Cake',
      description: 'Une création individuelle unique et personnalisée',
      image: bento_cake4,
      link: '/produits#bento'
    },
    {
      id: 2,
      name: 'Layer Cake',
      description: 'Un gâteau majestueux à plusieurs étages',
      image: winnie_cake,
      link: '/produits#layer'
    },
    {
      id: 3,
      name: 'Wedding Cake',
      description: 'L\'excellence pour votre jour spécial',
      image: mariage_cake,
      link: '/produits#wedding'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section avec effet parallaxe */}
      <section className="hero parallax">
        <div className="hero-overlay"></div>
        <div className="container">
          {/* Badge livraison dynamique */}
          <div className={`delivery-badge${showDelivery ? ' show' : ''} hide-mobile-delivery`}>
            <span className="delivery-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <rect x="5" y="14" width="22" height="7" rx="2" fill="#d4a373"/>
                  <rect x="8" y="11" width="16" height="4" rx="2" fill="#d4a373"/>
                  <circle cx="10" cy="24" r="2.2" fill="#d4a373"/>
                  <circle cx="22" cy="24" r="2.2" fill="#d4a373"/>
                </g>
              </svg>
            </span>
            <span className="delivery-text">Livraison disponible Avignon et ses environs</span>
          </div>
          <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
            <h1 className="hero-title">
              <span className="hero-subtitle">PÂTISSERIE DE LUXE</span>
              <span className="hero-main-title">BEL AGE</span>
            </h1>
            <p className="hero-text">
              Créations artisanales de pâtisseries d'exception
            </p>
            <Link to="/devis" className="btn btn-gold hover-lift">
              Demander un Devis
            </Link>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <p>DÉCOUVREZ</p>
            <h2>Nos Créations d'Exception</h2>
          </div>
          <div className="grid grid-cols-3">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`product-card glass hover-lift ${isVisible ? 'scale-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <Link to={product.link} className="btn btn-outline hover-glow">
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section parallax cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className={`cta-content ${isVisible ? 'slide-in' : ''}`}>
            <h2>Prêt à créer votre moment d'exception ?</h2>
            <p>Contactez-nous pour une expérience pâtissière unique</p>
            <Link to="/devis" className="btn btn-gold hover-lift">
              Commencer mon projet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 