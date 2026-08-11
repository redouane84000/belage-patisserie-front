import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import CartDrawer from '../../features/shop/cart/CartDrawer'
import { ShopCartProvider } from '../../features/shop/cart/ShopCartContext'
import { useShopCart } from '../../features/shop/cart/cartContext'
import CategoryNavigation from '../../features/shop/components/CategoryNavigation'
import ProductConfigurator from '../../features/shop/components/ProductConfigurator'
import ProductSection from '../../features/shop/components/ProductSection'
import { SHOP_CATEGORIES } from '../../data/shop/catalog.generated'
import './Boutique.css'

function ShopContent() {
  const { itemCount } = useShopCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productClosing, setProductClosing] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (!productClosing) return undefined
    const timer = window.setTimeout(() => {
      setSelectedProduct(null)
      setProductClosing(false)
    }, 240)
    return () => window.clearTimeout(timer)
  }, [productClosing])

  const closeProduct = () => {
    if (selectedProduct && !productClosing) setProductClosing(true)
  }

  return (
    <div className="shop-page">
      <Navbar />
      <main>
        <section className="shop-hero">
          <div>
            <span className="shop-kicker">Bel Âge Pâtisserie</span>
            <h1>La boutique en ligne</h1>
            <p>Des créations pâtissières pensées pour les moments qui comptent, à personnaliser selon vos envies.</p>
          </div>
          <button className="shop-cart-trigger" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            <span>Panier</span>
            {itemCount > 0 && <b>{itemCount}</b>}
          </button>
        </section>
        <CategoryNavigation categories={SHOP_CATEGORIES} />
        <div className="shop-catalog">
          {SHOP_CATEGORIES.map((category) => (
            <ProductSection category={category} onSelect={(product) => {
              setProductClosing(false)
              setSelectedProduct(product)
            }} key={category.id} />
          ))}
        </div>
      </main>
      <Footer />
      {selectedProduct && (
        <ProductConfigurator
          key={selectedProduct.id}
          product={selectedProduct}
          closing={productClosing}
          onClose={closeProduct}
          onAdded={() => {
            setSelectedProduct(null)
            setCartOpen(true)
          }}
        />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default function Boutique() {
  return (
    <ShopCartProvider>
      <ShopContent />
    </ShopCartProvider>
  )
}
