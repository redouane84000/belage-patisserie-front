import React, { useState } from 'react';
import './SaveurBanner.css';

const SaveurBanner = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`saveur-banner${open ? ' open' : ''}`}> 
      <button className="saveur-toggle" onClick={() => setOpen(!open)}>
        <span className="saveur-icon">🍰</span>
        <span className="saveur-title">Nos Saveurs</span>
        <span className="saveur-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="saveur-lists">
          <div className="saveur-list">
            <h5>Les Classiques</h5>
            <ul>
              <li>Café</li>
              <li>Kinder</li>
              <li>Chocolat</li>
              <li>Fraise</li>
              <li>Framboise</li>
              <li>Oreo</li>
              <li>Speculos</li>
              <li>Raffaelo</li>
              <li>Coco</li>
              <li>Mangue</li>
            </ul>
          </div>
          <div className="saveur-list">
            <h5>Les Spéciale Flavour</h5>
            <ul>
              <li>Mangue-Coco</li>
              <li>Framboise-Chocolat blanc</li>
              <li>Framboise-Pistache</li>
              <li>Kinder-Nutella</li>
              <li>Autre sur demande</li>
            </ul>
            <div className="saveur-note">Prix des Spéciale Flavour sur demande</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveurBanner; 