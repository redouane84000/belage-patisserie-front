import React, { useEffect, useState } from 'react';
import './Produits.css';

const Produits = () => {
  const [produits, setProduits] = useState([]);

 

  return (
    <div className="produits-page">
      <h2>Nos Gâteaux</h2>
      <div className="produits-grid">
        {produits.map(p => (
          <div key={p.id} className="produit-card">
            <img src={p.image_url || "https://via.placeholder.com/200"} alt={p.nom} />
            <h3>{p.nom}</h3>
            <p>{p.parts} parts</p>
            <p>{p.prix} €</p>
            <span className="categorie">{p.categorie}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produits;
