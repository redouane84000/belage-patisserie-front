import React, { useState, useMemo } from 'react';
import './SimulationTarif.css';
import ourson_bento from '../assets/logo/ourson_bento.png';
import bento_cake4 from '../assets/logo/bento_cake4.PNG';
import felicia_cake from '../assets/logo/felicia_cake.png';
import gun_png from '../assets/logo/gun.png';
import spider_png from '../assets/logo/spider_png.png';
import reine_cake from '../assets/logo/reine_cake.png';
import royaume from '../assets/logo/royaume.PNG';
import box6 from '../assets/logo/box6.png';
import number from '../assets/logo/number.PNG';
import fleur_cake from '../assets/logo/fleur-cake.png';
import mariage_cake from '../assets/logo/mariage_cake.png';
import confetie_cake from '../assets/logo/confetie.png';

const produits = [
  {
    id: 1,
    name: 'Bento Cake Vanille',
    price: 20,
    image: ourson_bento,
    details: '2 parts - Parfait pour les occasions intimes',
  },
  {
    id: 5,
    name: 'Bento Cake Fraise',
    price: 20,
    image: bento_cake4,
    details: '2 parts - Idéal pour un anniversaire',
  },
  {
    id: 6,
    name: 'Bento Cake Fruité',
    price: 20,
    image: felicia_cake,
    details: '2 parts - Frais et léger',
  },
  {
    id: 11,
    name: 'Vintage Cake',
    price: 30,
    image: royaume,
    details: '6 parts - Pour toutes vos envies de majesté',
  },
  {
    id: 2,
    name: 'Layer Cake 10 parts',
    price: 50,
    image: gun_png,
    details: '10 parts - Pour plus de parts, demander un devis',
  },
  {
    id: 7,
    name: 'Layer Cake 15 parts',
    price: 70,
    image: spider_png,
    details: '15 parts - Pour plus de parts, demander un devis',
  },
  {
    id: 8,
    name: 'Layer Cake 20 parts',
    price: 90,
    image: reine_cake,
    details: '20 parts - Pour plus de parts, demander un devis',
  },
  {
    id: 4,
    name: 'Number Cake Élégance (6-8 parts)',
    price: 30,
    image: number,
    details: '6-8 parts',
  },
  {
    id: 13,
    name: 'Number Cake Élégance (12-14 parts)',
    price: 45,
    image: number,
    details: '12-14 parts',
  },
  {
    id: 14,
    name: 'Number Cake Élégance (16-18 parts)',
    price: 60,
    image: number,
    details: '16-18 parts',
  },
  {
    id: 12,
    name: 'Box CupCake (9 pièces)',
    price: 15,
    image: box6,
    details: '9 pièces',
  },
  {
    id: 15,
    name: 'Box CupCake (16 pièces)',
    price: 24,
    image: box6,
    details: '16 pièces',
  },
  {
    id: 21,
    name: 'Wedding Cake 50 parts (2 étages)',
    price: 190,
    image: mariage_cake,
    details: '50 parts - 2 étages',
  },
  {
    id: 22,
    name: 'Wedding Cake 80 parts (2 étages)',
    price: 290,
    image: mariage_cake,
    details: '80 parts - 3 étages',
  },
  {
    id: 23,
    name: 'Wedding Cake 100 parts (3 étages)',
    price: 370,
    image: mariage_cake,
    details: '100 parts - 3 étages',
  },
  {
    id: 24,
    name: 'Wedding Cake 140 parts (4 étages)',
    price: 450,
    image: mariage_cake,
    details: '140 parts - 4 étages',
  },
  {
    id: 25,
    name: 'Wedding Cake 200 parts (5 étages)',
    price: 750,
    image: mariage_cake,
    details: '200 parts - 5 étages',
  },
];

const fraisLivraison = {
  avignon: 10,
  hors: (km) => 10 + Math.max(0, (parseInt(km, 10) || 0) - 10) * 1.5,
};

const SimulationTarif = () => {
  const [panier, setPanier] = useState({});
  const [livraison, setLivraison] = useState('avignon');
  const [km, setKm] = useState('');

  const ajouterProduit = (id) => {
    setPanier((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };
  const retirerProduit = (id) => {
    setPanier((p) => {
      const n = (p[id] || 0) - 1;
      if (n <= 0) {
        const { [id]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [id]: n };
    });
  };
  const reset = () => {
    setPanier({});
    setLivraison('avignon');
    setKm('');
  };

  const totalProduits = useMemo(() =>
    Object.entries(panier).reduce((acc, [id, qty]) => {
      const prod = produits.find((p) => p.id === parseInt(id, 10));
      return acc + (prod ? prod.price * qty : 0);
    }, 0), [panier]);

  const totalLivraison = useMemo(() => {
    if (livraison === 'avignon') return fraisLivraison.avignon;
    return fraisLivraison.hors(km);
  }, [livraison, km]);

  const total = totalProduits + (Object.keys(panier).length > 0 ? totalLivraison : 0);

  return (
    <div className="simulation-tarif-page">
      <h1 className="simulation-title">Simulation Tarif</h1>
      <p className="simulation-desc">Ajoutez vos produits et simulez votre tarif en temps réel, livraison incluse !</p>
      <div className="simulation-content">
        <div className="simulation-products">
          <h2 className="simu-section-title">Nos produits</h2>
          <div className="simu-products-grid">
            {produits.map((prod) => (
              <div key={prod.id} className="simu-product-card">
                <img src={prod.image} alt={prod.name} className="simu-product-img" />
                <div className="simu-product-info">
                  <h3>{prod.name}</h3>
                  <p className="simu-details">{prod.details}</p>
                  <div className="simu-product-actions">
                    <button className="simu-btn" onClick={() => retirerProduit(prod.id)} disabled={!panier[prod.id]}>-</button>
                    <span className="simu-qty">{panier[prod.id] || 0}</span>
                    <button className="simu-btn" onClick={() => ajouterProduit(prod.id)}>+</button>
                  </div>
                  <div className="simu-product-price">{prod.price} €</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="simulation-summary">
          <h2 className="simu-section-title">Votre panier</h2>
          <div className="simu-cart-list">
            {Object.keys(panier).length === 0 ? (
              <div className="simu-cart-empty">Aucun produit sélectionné.</div>
            ) : (
              produits.filter((p) => panier[p.id]).map((prod) => (
                <div key={prod.id} className="simu-cart-item">
                  <span>{prod.name} x {panier[prod.id]}</span>
                  <span>{prod.price * panier[prod.id]} €</span>
                </div>
              ))
            )}
          </div>
          <div className="simu-livraison-block">
            <h3>Livraison</h3>
            <div className="simu-livraison-options">
              <label>
                <input type="radio" name="livraison" value="avignon" checked={livraison === 'avignon'} onChange={() => setLivraison('avignon')} />
                Avignon (10 €)
              </label>
              <label>
                <input type="radio" name="livraison" value="hors" checked={livraison === 'hors'} onChange={() => setLivraison('hors')} />
                Hors Avignon
              </label>
              {livraison === 'hors' && (
                <input
                  type="number"
                  min="10"
                  max="100"
                  placeholder="km distance"
                  className="simu-km-input"
                  value={km}
                  onChange={e => setKm(e.target.value)}
                />
              )}
            </div>
            <div className="simu-livraison-prix">Frais de livraison : <span>{Object.keys(panier).length > 0 ? totalLivraison : 0} €</span></div>
          </div>
          <div className="simu-total-block">
            <div className="simu-total-label">Total TTC</div>
            <div className="simu-total-value glow-anim">{total} €</div>
          </div>
          <button className="simu-reset-btn" onClick={reset}>Réinitialiser</button>
        </div>
      </div>
    </div>
  );
};

export default SimulationTarif; 