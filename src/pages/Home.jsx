import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import winnie_cake from '../assets/logo/winnie_cake.png';
import mariage_cake from '../assets/logo/mariage_cake.png';
import bento_cake4 from '../assets/logo/bento_cake4.PNG';
import patisserie1 from '../assets/logo/patisserie1.png';
import patisserie_principale from '../assets/logo/patisserie_principale.png';
import patisserie_principale2 from '../assets/logo/patisserie_principale2.png';
import patisserie_principale3 from '../assets/logo/patisserie_principale3.png';
import patisserie_principale4 from '../assets/logo/patisserie_principale4.png';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'Bento Cake',
      description: 'Une création individuelle unique et personnalisée, parfaite pour célébrer vos moments précieux',
      image: bento_cake4,
      link: '/produits#bento'
    },
    {
      id: 2,
      name: 'Layer Cake',
      description: 'Un gâteau majestueux à plusieurs étages, symbole d\'élégance et de raffinement',
      image: winnie_cake,
      link: '/produits#layer'
    },
    {
      id: 3,
      name: 'Wedding Cake',
      description: 'L\'excellence pour votre jour spécial, une pièce maîtresse qui émerveillera vos invités',
      image: mariage_cake,
      link: '/produits#wedding'
    }
  ];

  const valeursImages = [
    {
      id: 1,
      image: patisserie_principale,
      accroche: "L'Art de la Pâtisserie Française"
    },
    {
      id: 2,
      image: patisserie_principale2,
      accroche: "Créations Uniques & Personnalisées"
    },
    {
      id: 3,
      image: patisserie_principale3,
      accroche: "Excellence & Savoir-Faire Artisanal"
    },
    {
      id: 4,
      image: patisserie_principale4,
      accroche: "Moment d'Exception & Émotions Gourmandes"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section - Ultra moderne */}
      <section className="hero">
        <img src={patisserie1} alt="BEL AGE Pâtisserie - Créations d'exception" className="hero-image" />
        <div className="hero-content">
          <div className="hero-title">
            <p className="hero-subtitle">PÂTISSERIE DE LUXE</p>
            <h1 className="hero-main-title">BEL AGE</h1>
          </div>
          <p className="hero-text">
            Créations artisanales de pâtisseries d'exception, où chaque gâteau raconte une histoire unique
          </p>
          <Link to="/devis" className="btn btn-gold">
            Découvrir nos créations
          </Link>
        </div>
      </section>

      {/* Section Valeurs avec nouvelles images */}
      <section className="section valeurs-section">
        <div className="container">
          <div className="section-title">
            <p>NOS VALEURS</p>
            <h2>L'Excellence BEL AGE</h2>
          </div>
          <div className="valeurs-grid">
            {valeursImages.map((valeur, index) => (
              <div
                key={valeur.id}
                className={`valeur-card ${isVisible ? 'scale-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img src={valeur.image} alt={valeur.accroche} className="valeur-image" />
                <p className="valeur-accroche">{valeur.accroche}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Produits - Design moderne */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <p>NOS CRÉATIONS</p>
            <h2>L'Art de la Pâtisserie</h2>
          </div>
          <div className="grid grid-cols-3">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`product-card ${isVisible ? 'scale-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <Link to={product.link} className="btn btn-outline">
                    <span>En savoir plus</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA - Ultra moderne */}
      <section className="section cta-section">
        <div className="container">
          <div className={`cta-content ${isVisible ? 'slide-in' : ''}`}>
            <h2>Prêt à créer votre moment d'exception ?</h2>
            <p>Contactez-nous pour une expérience pâtissière unique et personnalisée</p>
            <Link to="/devis" className="btn btn-gold">
              Commencer mon projet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 