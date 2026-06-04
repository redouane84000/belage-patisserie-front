import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import ourson_bento from '../assets/logo/ourson_bento.png';
import confetie_cake from '../assets/logo/confetie.png';
import felicia_cake from '../assets/logo/felicia_cake.png';
import gun_png from '../assets/logo/gun.png';
import spider_png from '../assets/logo/spider_png.png';
import reine_cake from '../assets/logo/reine_cake.png';
import bento_cake4 from '../assets/logo/bento_cake4.PNG';
import royaume from '../assets/logo/royaume.PNG';
import box6 from '../assets/logo/box6.png';
import number from '../assets/logo/number.PNG';
import fleur_cake from '../assets/logo/fleur-cake.png';
import mariage_cake from '../assets/logo/mariage_cake.png';
import SaveurBanner from '../components/SaveurBanner';
import CategoryCarousel from '../components/CategoryCarousel';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('bento');
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef(null);
  const [weddingIndex, setWeddingIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'bento', name: 'Bento Cake', image: ourson_bento },
    { id: 'layer', name: 'Layer Cake', image: gun_png },
    { id: 'wedding', name: 'Wedding Cake', image: mariage_cake },
    { id: 'number', name: 'Number Cake', image: number },
    { id: 'plateaux', name: 'Box CupCake', image: box6 },
  ];

  const products = [
    {
      id: 1,
      name: 'Bento Cake Vanille',
      category: 'bento',
      description: 'Bento cake ',
      price: 'À partir de 20€',
      details: '2 parts - Parfait pour les occasions intimes',
      image: ourson_bento
    },
    {
      id: 5,
      name: 'Bento Cake fraise',
      category: 'bento',
      description: 'Bento cake ',
      price: 'À partir de 20€',
      details: '2 parts - Idéal pour un anniversaire',
      image: bento_cake4
    },
    {
      id: 6,
      name: 'Bento Cake Fruité',
      category: 'bento',
      description: 'Bento cake ',
      price: 'À partir de 20€',
      details: '2 parts - Frais et léger',
      image: felicia_cake
    },
    {
      id: 11,
      name: 'Vintage Cake',
      category: 'layer',
      description: 'Vintage Cake ',
      price: 'a partir de 30€',
      details: '6 parts - Pour toutes vos envies de majesté',
      image: royaume
    },
    {
      id: 2,
      name: 'Layer Cake ',
      category: 'layer',
      description: 'Layer cake ',
      price: 'a partir de 50€',
      details: '10 parts - Pour plus de parts, demander un devis',
      image: gun_png
    },
    {
      id: 7,
      name: 'Layer Cake ',
      category: 'layer',
      description: 'Layer cake ',
      price: 'a partir de 70€',
      details: '15 parts - Pour plus de parts, demander un devis',
      image: spider_png
    },
    {
      id: 8,
      name: 'Layer Cake ',
      category: 'layer',
      description: 'Layer cake ',
      price: 'a partir de 90€',
      details: '20 parts - Pour plus de parts, demander un devis',
      image: reine_cake
    },
    {
      id: 3,
      name: 'Wedding Cake Floral',
      category: 'wedding',
      description: 'Wedding cake décor floral, crème légère',
      price: '',
      details: 'Décor fleurs fraîches',
      image: fleur_cake
    },
    {
      id: 9,
      name: 'Wedding Cake Prestige',
      category: 'wedding',
      description: 'L\'excellence pour votre jour spécial',
      price: '',
      details: 'Création personnalisée',
      image: mariage_cake
    },
    {
      id: 4,
      name: 'Number Cake Élégance',
      category: 'number',
      description: 'Number Cake 6-8 parts : 30€ / 12-14 parts : 45€ / 16-18 parts : 60€',
      price: '',
      details: 'Personnalisation sur demande',
      image: number
    },
    {
      id: 12,
      name: 'Box CupCake',
      category: 'plateaux',
      description: 'Box CupCake',
      price: '15€ les 9 / 24€ les 16',
      details: 'Plateau gourmand, idéal pour vos événements',
      image: box6
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const scrollCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="products">
      {/* Hero Section */}
      <section className="products-hero parallax">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
            <h1 className="hero-title">
              <span className="hero-subtitle">NOS CRÉATIONS</span>
              <span className="hero-main-title">Pâtisseries d'Exception</span>
            </h1>
            <p className="hero-text">
              Découvrez notre collection de pâtisseries artisanales
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section-section">
        <div className="container">
          <div className="categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                id ='placeholder_champs'
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section products-section">
        <div className="container">
          {selectedCategory === 'layer' ? (
            <>
              <SaveurBanner />
              <div className="products-carousel-wrapper">
                <div className="products-carousel" ref={carouselRef}>
                  <div className="carousel-track">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className={`product-card${product.category === 'bento' ? ' bento' : ''} glass hover-lift ${isVisible ? 'scale-in' : ''}`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                          <div className="product-overlay">
                            <Link to="/devis" className="btn btn-gold">
                              Demander un devis
                            </Link>
                          </div>
                        </div>
                        <div className="product-content">
                          <h3 className="product-title">{product.name}</h3>
                          <p className="product-description">{product.description}</p>
                          <div className="product-details">
                            <span className="product-price">{product.price}</span>
                            <span className="product-info">{product.details}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="carousel-arrow" onClick={scrollCarousel} aria-label="Voir plus">
                  &#8594;
                </button>
              </div>
            </>
          ) : selectedCategory === 'wedding' ? (
            <>
              <SaveurBanner />
              <div className={`grid grid-cols-3${selectedCategory === 'wedding' && filteredProducts.length === 2 ? ' center-wedding' : ''}`}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`product-card${product.category === 'bento' ? ' bento' : ''} glass hover-lift ${isVisible ? 'scale-in' : ''}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay">
                        <Link to="/devis" className="btn btn-gold">
                          Demander un devis
                        </Link>
                      </div>
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-details">
                        <span className="product-price">{product.price}</span>
                        <span className="product-info">{product.details}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wedding-prices">
                <h4>Tarifs Wedding Cake</h4>
                <ul>
                  <li>50 parts : 190€ (2 étages)</li>
                  <li>80 parts : 290€ (3 étages)</li>
                  <li>100 parts : 370€ (3 étages)</li>
                  <li>140 parts : 450€ (4 étages)</li>
                  <li>200 parts : 750€ (5 étages)</li>
                </ul>
                <p className="wedding-note">Pour toute demande spéciale ou un nombre de parts différent, contactez-nous pour un devis personnalisé.</p>
              </div>
            </>
          ) : (
            <>
              <SaveurBanner />
              <div className={`grid grid-cols-3${selectedCategory === 'wedding' && filteredProducts.length === 2 ? ' center-wedding' : ''}`}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`product-card${product.category === 'bento' ? ' bento' : ''} glass hover-lift ${isVisible ? 'scale-in' : ''}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay">
                        <Link to="/devis" className="btn btn-gold">
                          Demander un devis
                        </Link>
                      </div>
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-details">
                        <span className="product-price">{product.price}</span>
                        <span className="product-info">{product.details}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section parallax cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className={`cta-content ${isVisible ? 'slide-in' : ''}`}>
            <h2>Une création sur mesure pour votre événement</h2>
            <p>Contactez-nous pour discuter de votre projet</p>
            <Link to="/devis" className="btn btn-gold hover-lift">
              Demander un devis personnalisé
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products; 