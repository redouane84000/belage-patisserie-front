import { useMemo, useState } from 'react'
import PatissieresMobileCard from './PatissieresMobileCard'
import PatissieresMobileSheet from './PatissieresMobileSheet'

const SPECIALTY_CHIPS = [
  'Toutes',
  'Wedding Cake',
  'Number Cake',
  'Baby Shower',
  'Anniversaire',
  'Sweet Table',
  'Cake Design',
]

const SEGMENTS = [
  { key: 'all', label: 'Toutes' },
  { key: 'influence', label: 'Influence' },
  { key: 'selection', label: 'Sélection' },
]

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function uniqueCities(profiles) {
  return [...new Set(profiles.map((p) => p.ville))].sort((a, b) =>
    a.localeCompare(b, 'fr')
  )
}

export default function PatissieresMobilePage({
  profiles,
  selectedProfile,
  onOpenProfile,
  onCloseProfile,
  idParam,
  highlightRef,
}) {
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState('all')
  const [specialty, setSpecialty] = useState('Toutes')
  const [city, setCity] = useState('Toutes')

  const cities = useMemo(() => ['Toutes', ...uniqueCities(profiles)], [profiles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return profiles.filter((p) => {
      const okQuery =
        !q ||
        p.nom.toLowerCase().includes(q) ||
        p.ville.toLowerCase().includes(q) ||
        p.specialites.some((s) => s.toLowerCase().includes(q))

      const okSegment =
        segment === 'all' ||
        (segment === 'influence' && p.offersInfluence) ||
        (segment === 'selection' && p.badge)

      const okSpecialty =
        specialty === 'Toutes' || p.specialites.includes(specialty)

      const okCity = city === 'Toutes' || p.ville === city

      return okQuery && okSegment && okSpecialty && okCity
    })
  }, [profiles, query, segment, specialty, city])

  return (
    <div className="mob-ios">
      <div className="mob-ios__sticky">
        <header className="mob-ios__head">
          <div>
            <h1 className="mob-ios__title">Nos Pâtissières</h1>
            <p className="mob-ios__count">
              {filtered.length} créatrice{filtered.length > 1 ? 's' : ''}
            </p>
          </div>
        </header>

        <div className="mob-ios__search">
          <IconSearch />
          <input
            type="search"
            className="mob-ios__search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un nom, une ville…"
            aria-label="Rechercher une pâtissière"
          />
        </div>

        <div className="mob-ios__seg" role="tablist" aria-label="Type de profil">
          {SEGMENTS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={segment === s.key}
              className={`mob-ios__seg-btn ${segment === s.key ? 'is-active' : ''}`}
              onClick={() => setSegment(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mob-ios__chips mob-ios__scroll-x" aria-label="Spécialités">
          {SPECIALTY_CHIPS.map((s) => (
            <button
              key={s}
              type="button"
              className={`mob-ios__chip ${specialty === s ? 'is-active' : ''}`}
              onClick={() => setSpecialty(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mob-ios__chips mob-ios__scroll-x mob-ios__chips--city" aria-label="Villes">
          {cities.map((v) => (
            <button
              key={v}
              type="button"
              className={`mob-ios__chip mob-ios__chip--city ${city === v ? 'is-active' : ''}`}
              onClick={() => setCity(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="mob-ios__list">
        {filtered.length === 0 ? (
          <p className="mob-ios__empty">Aucune pâtissière trouvée</p>
        ) : (
          filtered.map((p, i) => (
            <PatissieresMobileCard
              key={p.id}
              profile={p}
              index={i}
              highlight={p.id === idParam}
              cardRef={p.id === idParam ? highlightRef : null}
              onOpen={() => onOpenProfile(p)}
            />
          ))
        )}
      </div>

      {selectedProfile && (
        <PatissieresMobileSheet profile={selectedProfile} onClose={onCloseProfile} />
      )}
    </div>
  )
}
