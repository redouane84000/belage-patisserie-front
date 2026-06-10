import { useEffect, useMemo, useState } from 'react'
import ProviderSectionPicker from '../../../components/ProviderSectionPicker/ProviderSectionPicker'
import { filterProvidersForMobile } from '../../../utils/providerFilter'
import PatissieresMobileCard from './PatissieresMobileCard'
import PatissieresMobileSheet from './PatissieresMobileSheet'

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
  section,
  sectionId,
  onSectionChange,
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

  const specialtyChips = useMemo(
    () => ['Toutes', ...section.quickFilters.filter((f) => f !== 'Tous')],
    [section]
  )

  const segments = useMemo(() => {
    const base = [{ key: 'all', label: 'Toutes' }]
    if (section.showInfluenceSegment) {
      base.push({ key: 'influence', label: 'Influence' })
    }
    if (section.id === 'patisserie') {
      base.push({ key: 'selection', label: 'Sélection' })
    }
    return base
  }, [section])

  useEffect(() => {
    setQuery('')
    setSegment('all')
    setSpecialty('Toutes')
    setCity('Toutes')
  }, [sectionId])

  const cities = useMemo(() => ['Toutes', ...uniqueCities(profiles)], [profiles])

  const filtered = useMemo(
    () =>
      filterProvidersForMobile(profiles, {
        query,
        segment,
        specialty,
        city,
        showInfluenceSegment: section.showInfluenceSegment,
      }),
    [profiles, query, segment, specialty, city, section.showInfluenceSegment]
  )

  return (
    <div className="mob-ios">
      <div className="mob-ios__sticky">
        <ProviderSectionPicker
          activeId={sectionId}
          onChange={onSectionChange}
          className="mob-ios__sections provider-sections--scroll"
        />

        <header className="mob-ios__head">
          <div>
            <h1 className="mob-ios__title">{section.pageTitle}</h1>
            <p className="mob-ios__count">
              {filtered.length} {section.creatorLabel}
              {filtered.length > 1 ? 's' : ''}
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
            aria-label={`Rechercher un ${section.providerSingular}`}
          />
        </div>

        <div className="mob-ios__seg" role="tablist" aria-label="Type de profil">
          {segments.map((s) => (
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
          {specialtyChips.map((s) => (
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
          <p className="mob-ios__empty">{section.emptyMessage}</p>
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
