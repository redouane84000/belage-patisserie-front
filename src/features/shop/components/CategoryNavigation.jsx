import { useState } from 'react'

export default function CategoryNavigation({ categories }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id)

  const scrollToCategory = (id) => {
    setActiveCategory(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="shop-category-nav" aria-label="Catégories de la boutique">
      <div className="shop-category-nav__inner">
        {categories.map((category) => (
          <button
            className={activeCategory === category.id ? 'is-active' : ''}
            key={category.id}
            onClick={() => scrollToCategory(category.id)}
            aria-current={activeCategory === category.id ? 'true' : undefined}
          >
            {category.title}
          </button>
        ))}
      </div>
    </nav>
  )
}
