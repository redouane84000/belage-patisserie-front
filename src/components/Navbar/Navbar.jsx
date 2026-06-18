import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LayoutGrid, Menu, X } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Trouver un prestataire', to: '/patissieres' },
  { label: 'Carte France', to: '/carte' },
  { label: 'Inspirations', to: '/inspirations' },
  { label: 'Nos formations', to: '/packs' },
  { label: 'Calculateur rentabilité', to: '/calculateur-rentabilite' },
  { label: 'Rejoindre le réseau', to: '/rejoindre' },
]

function NavItem({ to, label, className, onClick }) {
  if (to.startsWith('/')) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) => `${className} ${isActive ? 'is-active' : ''}`}
        onClick={onClick}
      >
        {label}
      </NavLink>
    )
  }
  return (
    <a href={to} className={className} onClick={onClick}>
      {label}
    </a>
  )
}

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="BEL’AGE Entreprise">
          <span className="navbar__logo-name">BEL’AGE</span>
          <span className="navbar__logo-sub">ENTREPRISE</span>
        </Link>

        <nav className="navbar__links" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.label}
              to={link.to}
              label={link.label}
              className="navbar__link"
            />
          ))}
        </nav>

        <div className="navbar__icons">
          <button className="navbar__icon-btn" aria-label="Menu des catégories">
            <LayoutGrid size={20} strokeWidth={1.6} />
          </button>
          <button
            className="navbar__burger"
            aria-label="Ouvrir le menu"
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={24} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <div
        className={`navbar__overlay ${isDrawerOpen ? 'is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`navbar__drawer ${isDrawerOpen ? 'is-open' : ''}`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="navbar__drawer-head">
          <span className="navbar__logo-name">BEL’AGE</span>
          <button
            className="navbar__icon-btn"
            aria-label="Fermer le menu"
            onClick={closeDrawer}
          >
            <X size={24} strokeWidth={1.6} />
          </button>
        </div>
        <nav className="navbar__drawer-links" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.label}
              to={link.to}
              label={link.label}
              className="navbar__drawer-link"
              onClick={closeDrawer}
            />
          ))}
        </nav>
      </aside>
    </header>
  )
}
