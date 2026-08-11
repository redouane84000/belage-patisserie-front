import { ArrowUpRight } from 'lucide-react'
import { formatEuro } from '../currency'

export default function ProductCard({ product, onSelect }) {
  return (
    <button className="shop-product-card" onClick={() => onSelect(product)}>
      <span className="shop-product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" width="828" height="828" />
        <span className="shop-product-card__open" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </span>
      <span className="shop-product-card__details">
        <span>
          <strong>{product.name}</strong>
        </span>
        <em>À partir de {formatEuro(product.basePriceCents)}</em>
      </span>
    </button>
  )
}
