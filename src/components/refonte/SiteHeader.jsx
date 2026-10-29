import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Ico } from './IconSprite'

const NAV = [
  { to: '/packs', label: 'Nos formations' },
  { to: '/plateforme', label: 'Plateforme de formation' },
]

export default function SiteHeader({
  variant = 'overlay',
  loginTo = '/plateforme/connexion',
  loginLabel = 'Se connecter',
  showUser = true,
}) {
  const [open, setOpen] = useState(false)
  const bar = variant === 'bar' ? ' hdr--bar' : variant === 'light' ? ' hdr--light' : ''

  return (
    <>
      <header className={`hdr${bar}`}>
        <Link className="logo" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" />
        <nav className="nav only-d" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : '')} end={item.to === '/packs' ? false : undefined}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hdr-r">
          {showUser && (
            <Link className="circle-btn only-d" to="/plateforme" aria-label="Mon espace">
              <Ico name="i-user" />
            </Link>
          )}
          <Link className="btn btn--login only-d" to={loginTo}>
            {loginLabel} <Ico name="i-arrow" className="arr" />
          </Link>
          <button className="icon-btn only-m" type="button" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}>
            <Ico name="i-menu" />
          </button>
        </div>
      </header>
      {open && (
        <div className="bl-drawer" role="dialog" aria-label="Menu" onClick={() => setOpen(false)}>
          <div className="bl-drawer__panel" onClick={(event) => event.stopPropagation()}>
            <button className="bl-drawer__close" type="button" aria-label="Fermer" onClick={() => setOpen(false)}>✕</button>
            <Link className="logo logo--gold" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" onClick={() => setOpen(false)} />
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link className="btn btn--champ" to={loginTo} onClick={() => setOpen(false)}>
              {loginLabel} <Ico name="i-arrow" className="arr" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
