import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { formatEuro } from '../currency'
import { useShopCart } from './cartContext'

export default function CartDrawer({ open, onClose }) {
  const { items, totalCents, updateQuantity, removeItem, clearCart } = useShopCart()

  if (!open) return null

  return (
    <div className="shop-cart-layer" role="presentation">
      <button className="shop-cart-backdrop" onClick={onClose} aria-label="Fermer le panier" />
      <aside className="shop-cart" role="dialog" aria-modal="true" aria-label="Votre panier">
        <header className="shop-cart__head">
          <div>
            <span className="shop-kicker">Votre sélection</span>
            <h2>Panier</h2>
          </div>
          <button className="shop-icon-button" onClick={onClose} aria-label="Fermer le panier">
            <X size={21} />
          </button>
        </header>

        {!items.length ? (
          <div className="shop-cart__empty">
            <ShoppingBag size={34} strokeWidth={1.3} />
            <p>Votre panier est encore vide.</p>
            <button className="shop-text-button" onClick={onClose}>Découvrir les créations</button>
          </div>
        ) : (
          <>
            <div className="shop-cart__items">
              {items.map((item) => (
                <article className="shop-cart-item" key={item.cartId}>
                  <img src={item.image} alt="" width="92" height="92" />
                  <div className="shop-cart-item__content">
                    <div className="shop-cart-item__top">
                      <h3>{item.name}</h3>
                      <button onClick={() => removeItem(item.cartId)} aria-label={`Retirer ${item.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <ul>
                      {item.selections.map((selection) => (
                        <li key={`${selection.option}-${selection.value}`}>{selection.option} : {selection.value}</li>
                      ))}
                      {item.customText && <li>Inscription : {item.customText}</li>}
                      {item.note && <li>Note : {item.note}</li>}
                    </ul>
                    <div className="shop-cart-item__bottom">
                      <div className="shop-stepper" aria-label={`Quantité de ${item.name}`}>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} aria-label="Réduire la quantité"><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} aria-label="Augmenter la quantité"><Plus size={14} /></button>
                      </div>
                      <strong>{formatEuro(item.unitPriceCents * item.quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="shop-cart__foot">
              <div><span>Total</span><strong>{formatEuro(totalCents)}</strong></div>
              <p>Le paiement en ligne sera bientôt disponible.</p>
              <button className="shop-button shop-button--disabled" disabled>Finaliser bientôt</button>
              <button className="shop-text-button" onClick={clearCart}>Vider le panier</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
