import { NavLink } from 'react-router-dom'
import { Ico } from './IconSprite'

export default function MobileTabBar({ active = 'home' }) {
  const items = [
    { id: 'home', to: '/', label: 'Accueil', icon: 'i-home' },
    { id: 'formations', to: '/packs', label: 'Formations', icon: 'i-book' },
    { id: 'compte', to: '/plateforme', label: 'Compte', icon: 'i-user' },
  ]

  return (
    <nav className="tabbar" aria-label="Navigation mobile">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          className={() => (active === item.id ? 'is-active' : '')}
          aria-current={active === item.id ? 'page' : undefined}
          end={item.to === '/'}
        >
          <Ico name={item.icon} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
