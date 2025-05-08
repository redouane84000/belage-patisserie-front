import React, { useState, useEffect } from 'react';
import './QuoteForm.css';

const QuoteForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guests: '',
    productType: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer le formulaire
    console.log('Formulaire soumis:', formData);
  };

  return (
    <div className="quote-form">
      {/* Hero Section */}
      <section className="form-hero parallax">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
            <h1 className="hero-title">
              <span className="hero-subtitle">DEMANDEZ</span>
              <span className="hero-main-title">Un Devis Personnalisé</span>
            </h1>
            <p className="hero-text">
              Remplissez ce formulaire pour recevoir un devis personnalisé pour votre événement
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section form-section">
        <div className="container">
          <form onSubmit={handleSubmit} className={`form glass ${isVisible ? 'slide-in' : ''}`}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventType">Type d'événement</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="wedding">Mariage</option>
                  <option value="birthday">Anniversaire</option>
                  <option value="corporate">Événement d'entreprise</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="eventDate">Date de l'événement</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="guests">Nombre d'invités</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  min="1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productType">Type de pâtisserie</label>
                <select
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="bento">Bento Cake</option>
                  <option value="layer">Layer Cake</option>
                  <option value="wedding">Wedding Cake</option>
                  <option value="number">Number Cake</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message (optionnel)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-gold hover-lift submit-button">
              Envoyer la demande
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default QuoteForm; 