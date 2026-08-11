import { useEffect, useMemo, useState } from 'react'
import { ShopCartContext } from './cartContext'

const STORAGE_KEY = 'belage-shop-cart-v1'

function readCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function ShopCartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    totalCents: items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0),
    addItem: (item) => setItems((current) => [...current, {
      ...item,
      cartId: `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }]),
    updateQuantity: (cartId, quantity) => setItems((current) => current
      .map((item) => item.cartId === cartId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)),
    removeItem: (cartId) => setItems((current) => current.filter((item) => item.cartId !== cartId)),
    clearCart: () => setItems([]),
  }), [items])

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>
}
