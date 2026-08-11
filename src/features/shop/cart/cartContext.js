import { createContext, useContext } from 'react'

export const ShopCartContext = createContext(null)

export function useShopCart() {
  const context = useContext(ShopCartContext)
  if (!context) throw new Error('useShopCart doit être utilisé dans ShopCartProvider.')
  return context
}
