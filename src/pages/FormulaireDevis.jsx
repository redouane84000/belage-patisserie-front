import React, { useState } from 'react';
import './FormulaireDevis.css';

const FormulaireDevis = () => {
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '',
    categorie_gateau: '', nombre_parts: '', Message: ''
  });

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const envoyerDevis = async () => {
    const response = await fetch('http://localhost:8000/belage/devis', {
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
    <form className="form-devis" onSubmit={handleSubmit}>
      <h2>Formulaire de demande de devis</h2>
      <input name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
      <select name="categorie_gateau" value={formData.categorie_gateau} onChange={handleChange} required>
        <option value="" disabled selected>Catégorie</option>
        <option>Bento Cake</option>
        <option>Layer Cake</option>
        <option>Wedding Cake</option>
        <option>Number Cake</option>
      </select>
      <input name="nombre_parts" placeholder="Nombre de parts" value={formData.nombre_parts} onChange={handleChange} />
      <textarea name="message" placeholder="Votre message" value={formData.Message} onChange={handleChange}></textarea>
      <button type="submit" onClick={envoyerDevis}>Envoyer</button>
    </form>
  );
};

export default FormulaireDevis;
