import ProductCard from './ProductCard'

export default function ProductSection({ category, onSelect }) {
  return (
    <section className="shop-section" id={category.id}>
      <header className="shop-section__head">
        <span className="shop-kicker">Collection Bel Âge Pâtisserie</span>
        <h2>{category.title}</h2>
      </header>
      <div className="shop-grid">
        {category.products.map((product) => (
          <ProductCard product={product} onSelect={onSelect} key={product.id} />
        ))}
      </div>
    </section>
  )
}
