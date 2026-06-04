import React, { useRef } from 'react';
import './CategoryCarousel.css';

const CategoryCarousel = ({ categories, onSelect, selectedId }) => {
  const carouselRef = useRef(null);

  const scroll = (dir) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: dir * width * 0.7, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-carousel-wrapper">
      <button className="carousel-arrow left" onClick={() => scroll(-1)} aria-label="Précédent">&#8592;</button>
      <div className="category-carousel" ref={carouselRef}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-carousel-item${selectedId === cat.id ? ' active' : ''}`}
            onClick={() => onSelect && onSelect(cat.id)}
          >
            {cat.image && <img src={cat.image} alt={cat.name} />}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={() => scroll(1)} aria-label="Suivant">&#8594;</button>
    </div>
  );
};

export default CategoryCarousel; 