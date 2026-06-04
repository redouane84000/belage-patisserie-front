import React, { useState } from 'react';
import './Devis.css';

const Devis = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    categorie_gateau: '',
    nombre_parts: '',
    Message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    alert('Votre demande de devis a été envoyée avec succès !');
  };

  const envoyerDevis = async () => {
    const response = await fetch('https://backend-patisserie-production.up.railway.app/belage/devis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  }


  return (
    <div className="devis-page">
      <div className="devis-wrapper">
        <div className="devis-card">
          <h1 className="devis-heading">Demande de Devis</h1>

          <form onSubmit={handleSubmit} className="devis-formulaire">
            <div className="devis-field">
              <label className="devis-label">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Votre nom"
                className="devis-champ"
              />
            </div>

            <div className="devis-field">
              <label className="devis-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Votre email"
                className="devis-champ"
              />
            </div>

            <div className="devis-field">
              <label className="devis-label">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Votre numéro de téléphone"
                className="devis-champ"
              />
            </div>

            <div className="devis-field">
              <label className="devis-label">Type de gâteau</label>
              <select
                name="categorie_gateau"
                value={formData.categorie_gateau}
                onChange={handleChange}
                required
                className="devis-champ"
              >
                <option value="">Sélectionnez un type</option>
                <option value="bento">Bento Cake</option>
                <option value="layer">Layer Cake</option>
                <option value="wedding">Wedding Cake</option>
                <option value="number">Number Cake</option>
              </select>
            </div>

            <div className="devis-field">
              <label className="devis-label">Nombre de parts</label>
              <input
                type="number"
                name="nombre_parts"
                value={formData.nombre_parts}
                onChange={handleChange}
                min="1"
                placeholder="Nombre de parts souhaitées"
                className="devis-champ"
              />
            </div>

            <div className="devis-field">
              <label className="devis-label">Message</label>
              <textarea
                name="Message"
                value={formData.Message}
                onChange={handleChange}
                rows="4"
                placeholder="Votre Message"
                className="devis-champ devis-texte"
              />
            </div>

            <button type="submit" className="devis-bouton" onClick={envoyerDevis}>
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Devis; 