import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Devis from './pages/Devis';
import SimulationTarif from './pages/SimulationTarif';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/simulation-tarif" element={<SimulationTarif />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 
