import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import { useCarteTouchLayout, useMobileLayout } from '../../hooks/useMediaQuery'
import L from 'leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import {
  Search,
  MapPin,
  Map as MapIcon,
  SlidersHorizontal,
  X,
  Check,
  ArrowRight,
  Users,
  Sparkles,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ProviderSectionPicker from '../../components/ProviderSectionPicker/ProviderSectionPicker'
import {
  DEFAULT_SECTION_ID,
  getProviderSection,
  resolveSectionId,
} from '../../data/providerSections'
import {
  formatPricePerSlice,
  getPricePerSlice,
} from '../../utils/patissiere'
import { filterProvidersForMap } from '../../utils/providerFilter'
import {
  findEuropeanCity,
  patissiereMatchesCity,
  resolveCityFromPatissiere,
  getPatissieresInCity,
} from '../../utils/europeanCitySearch'
import './Carte.css'

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function initiales(nom) {
  return nom
    .split(' ')
    .map((mot) => mot[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const goldIcon = L.divIcon({
  className: 'gold-marker-wrap',
  html: '<div class="gold-marker" role="button" aria-label="Voir les pâtissières de cette ville"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

/** Un marqueur doré par ville — les logos s'affichent dans le panneau au clic */
function groupFilteredByCity(list) {
  const groups = new Map()

  for (const p of list) {
    const city = resolveCityFromPatissiere(p)
    const key = `${city.name}|${city.country}`
    if (!groups.has(key)) {
      groups.set(key, { city, members: [] })
    }
    groups.get(key).members.push(p)
  }

  return [...groups.values()].map(({ city, members }) => ({
    city,
    position: [
      members.reduce((sum, m) => sum + m.lat, 0) / members.length,
      members.reduce((sum, m) => sum + m.lng, 0) / members.length,
    ],
    count: members.length,
  }))
}

function cityKey(city) {
  if (!city) return ''
  return `${city.name}|${city.country || 'France'}`
}

const redCityIcon = L.divIcon({
  className: 'search-city-marker-wrap',
  html: '<div class="search-city-marker" role="button" aria-label="Voir les pâtissières de cette ville"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const BUDGET_MIN = 3
const BUDGET_MAX = 10
const BUDGET_STEP = 0.5

/** Recalcule la taille tuiles après changement layout (drawer filtres, plein écran, etc.) */
function MapInvalidateSize({ active, immersive }) {
  const map = useMap()
  useEffect(() => {
    const t1 = requestAnimationFrame(() => map.invalidateSize())
    const t2 = window.setTimeout(() => map.invalidateSize(), 350)
    const t3 = window.setTimeout(() => map.invalidateSize(), 700)
    return () => {
      cancelAnimationFrame(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [active, immersive, map])
  return null
}

/** Centre la carte sur la ville validée (clic Go) */
function MapFlyToCity({ city, flyToken }) {
  const map = useMap()
  useEffect(() => {
    if (!city || !flyToken) return
    map.flyTo([city.lat, city.lng], 10, { duration: 0.75 })
  }, [city, flyToken, map])
  return null
}

/** Recentre la carte sur la France (effacer recherche ville) */
function MapFlyToFrance({ resetToken }) {
  const map = useMap()
  useEffect(() => {
    if (!resetToken) return
    map.flyTo([46.603354, 1.888334], 6, { duration: 0.75 })
  }, [resetToken, map])
  return null
}

/**
 * Desktop : interactions libres.
 * Mobile/tablette aperçu : carte verrouillée (scroll page sans accrocher la carte).
 * Mobile/tablette plein écran : pan 1 doigt + pinch + boutons +/-.
 */
function MapInteractionMode({ touchLayout, immersive }) {
  const map = useMap()
  useEffect(() => {
    if (!touchLayout) {
      map.gestureHandling?.disable()
      map.scrollWheelZoom.enable()
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.boxZoom.enable()
      return undefined
    }

    map.gestureHandling?.disable()
    map.scrollWheelZoom.disable()
    map.boxZoom.disable()

    if (immersive) {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.tap?.enable()
    } else {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.tap?.disable()
    }

    return undefined
  }, [touchLayout, immersive, map])
  return null
}

/** Boutons zoom grossis — mode carte plein écran mobile (portal body = au-dessus de Leaflet) */
function MapImmersiveZoomControls({ visible }) {
  const map = useMap()
  if (!visible) return null
  return createPortal(
    <div className="map-immersive-zoom" aria-label="Zoom carte">
      <button
        type="button"
        className="map-immersive-zoom__btn"
        onClick={() => map.zoomIn()}
        aria-label="Zoomer"
      >
        <Plus size={22} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="map-immersive-zoom__btn"
        onClick={() => map.zoomOut()}
        aria-label="Dézoomer"
      >
        <Minus size={22} strokeWidth={2.2} />
      </button>
    </div>,
    document.body
  )
}

function CitySearchClear({ pinnedCity, onClear }) {
  if (!pinnedCity) return null
  return (
    <button type="button" className="city-search-clear" onClick={onClear}>
      <RotateCcw size={14} strokeWidth={2} />
      Effacer la recherche ville
    </button>
  )
}

function SearchFieldWithGo({ value, onChange, onGo, className = '', placeholder }) {
  return (
    <div className={`field field--with-go ${className}`.trim()}>
      <Search className="field__icon" size={16} strokeWidth={2} />
      <input
        className="field__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onGo()
        }}
      />
      <button type="button" className="field__go" onClick={onGo}>
        Go
      </button>
    </div>
  )
}

function CitySearchStatus({
  pinnedCity,
  count,
  totalInCity,
  cityNotFound,
  providerSingular,
  providerPlural,
}) {
  if (cityNotFound) {
    return (
      <p className="city-search-status city-search-status--warn" role="status">
        Ville non reconnue — essayez Londres, Barcelone, Paris…
      </p>
    )
  }
  if (!pinnedCity) return null

  const plural = count > 1 ? providerPlural : providerSingular

  if (totalInCity === 0) {
    return (
      <p className="city-search-status city-search-status--empty" role="status">
        Aucun {providerSingular} répertorié à {pinnedCity.name}
      </p>
    )
  }

  if (count === 0) {
    return (
      <p className="city-search-status city-search-status--warn" role="status">
        {totalInCity} {totalInCity > 1 ? providerPlural : providerSingular} à{' '}
        {pinnedCity.name}, mais aucun ne correspond à vos filtres — cliquez un
        marqueur pour la liste
      </p>
    )
  }

  return (
    <p className="city-search-status city-search-status--ok" role="status">
      {count} {plural} affiché{count > 1 ? 's' : ''} à {pinnedCity.name}
      {' · cliquez un marqueur pour la liste'}
    </p>
  )
}

function Toggle({ label, on, onChange }) {
  return (
    <button
      type="button"
      className={`toggle ${on ? 'is-on' : ''}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className="toggle__switch">
        <span className="toggle__knob" />
      </span>
      <span className="toggle__label">{label}</span>
    </button>
  )
}

function PatissiereMiniCard({ p, sectionId }) {
  const navigate = useNavigate()
  const [photoOk, setPhotoOk] = useState(false)
  const profileUrl =
    sectionId === DEFAULT_SECTION_ID
      ? `/patissieres?id=${p.id}`
      : `/patissieres?section=${sectionId}&id=${p.id}`

  return (
    <li>
      <button
        type="button"
        className="city-mini-card"
        onClick={() => navigate(profileUrl)}
      >
        <div
          className={`city-mini-card__avatar ${p.image ? 'city-mini-card__avatar--photo' : ''} ${p.badge ? 'city-mini-card__avatar--sel' : ''}`}
        >
          {p.image ? (
            <>
              {!photoOk && (
                <span className="city-mini-card__avatar-fallback">
                  {initiales(p.nom)}
                </span>
              )}
              <img
                className={`city-mini-card__avatar-img ${photoOk ? 'is-visible' : ''}`}
                src={p.image}
                alt=""
                loading="lazy"
                onLoad={() => setPhotoOk(true)}
                onError={() => setPhotoOk(false)}
              />
            </>
          ) : (
            initiales(p.nom)
          )}
        </div>
        <div className="city-mini-card__body">
          <p className="city-mini-card__name">{p.nom}</p>
          <p className="city-mini-card__meta">
            {p.specialites.slice(0, 2).join(' · ')}
          </p>
          <p className="city-mini-card__price">
            {formatPricePerSlice(getPricePerSlice(p))}
            {p.offersInfluence && (
              <span className="city-mini-card__influence">Influence</span>
            )}
          </p>
        </div>
        <ArrowRight
          className="city-mini-card__arrow"
          size={15}
          strokeWidth={2}
        />
      </button>
    </li>
  )
}

function CityPatissieresPanel({
  city,
  list,
  filteredCount,
  onClose,
  touchLayout,
  pageLayout,
  showClose = true,
  closeLabel = 'Fermer la liste',
  fromSearch,
  sectionId,
  providerSingular,
  providerPlural,
}) {
  if (!city) return null

  return (
    <aside
      className={`city-panel ${touchLayout && !pageLayout ? 'city-panel--mobile' : ''} ${pageLayout ? 'city-panel--page' : ''}`}
      aria-label={`${providerPlural} à ${city.name}`}
    >
      <header className="city-panel__head">
        <div className="city-panel__title-wrap">
          <MapPin
            className={`city-panel__pin ${fromSearch ? 'city-panel__pin--search' : ''}`}
            size={16}
            strokeWidth={2}
          />
          <div>
            <h2 className="city-panel__title">{city.name}</h2>
            <p className="city-panel__sub">{city.country}</p>
          </div>
        </div>
        {showClose && (
          <button
            type="button"
            className="city-panel__close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </header>

      {list.length === 0 ? (
        <div className="city-panel__empty">
          <p>
            Aucun {providerSingular} répertorié à {city.name} pour le moment.
          </p>
        </div>
      ) : (
        <>
          <p className="city-panel__count">
            {list.length}{' '}
            {list.length > 1 ? providerPlural : providerSingular}
            {filteredCount < list.length &&
              ` · ${filteredCount} affiché${filteredCount > 1 ? 's' : ''} sur la carte`}
          </p>
          <ul className="city-panel__list">
            {list.map((p) => (
              <PatissiereMiniCard key={p.id} p={p} sectionId={sectionId} />
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}

function FiltersSidebar({
  filtersOpen,
  onClose,
  section,
  sectionId,
  onSectionChange,
  search,
  setSearch,
  onCityGo,
  onClearCity,
  pinnedCity,
  cityStatus,
  specs,
  toggleSpec,
  budget,
  setBudget,
  budgetPct,
  onlyInfluence,
  setOnlyInfluence,
  livraison,
  setLivraison,
  count,
}) {
  const { mapConfig, providers, providerSingular, providerPlural } = section
  const hasInfluence = mapConfig.toggles.some((t) => t.id === 'influence')
  const livraisonToggle = mapConfig.toggles.find((t) => t.id === 'livraison')

  return (
    <aside className={`sidebar ${filtersOpen ? 'is-open' : ''}`}>
      <div className="sidebar__handle" />

      <div className="sidebar__head">
        <h1 className="sidebar__title">{section.pageTitle}</h1>
        <button
          className="sidebar__close"
          type="button"
          onClick={onClose}
          aria-label="Fermer les filtres"
        >
          <X size={20} strokeWidth={1.8} />
        </button>
      </div>

      <ProviderSectionPicker
        activeId={sectionId}
        onChange={onSectionChange}
        className="sidebar__sections provider-sections--scroll"
      />

      <p className="sidebar__sub">
        {providers.length}{' '}
        {providers.length > 1 ? providerPlural : providerSingular} sur
        l&apos;annuaire
      </p>

      <SearchFieldWithGo
        value={search}
        onChange={setSearch}
        onGo={onCityGo}
        placeholder="Londres, Barcelone, Paris…"
      />

      <CitySearchClear pinnedCity={pinnedCity} onClear={onClearCity} />

      <CitySearchStatus
        {...cityStatus}
        pinnedCity={pinnedCity}
        providerSingular={providerSingular}
        providerPlural={providerPlural}
      />

      <div className="filter">
        <p className="filter__label">Spécialité</p>
        <div className="checks">
          {mapConfig.specialties.map((s) => (
            <label key={s} className="check">
              <input
                type="checkbox"
                checked={specs.includes(s)}
                onChange={() => toggleSpec(s)}
              />
              <span className="check__box">
                <Check size={12} strokeWidth={3.5} />
              </span>
              <span className="check__label">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {mapConfig.budget && (
        <div className="filter">
          <p className="filter__label">Prix max / part</p>
          <input
            type="range"
            className="slider"
            min={mapConfig.budget.min}
            max={mapConfig.budget.max}
            step={mapConfig.budget.step}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--color-gold) ${budgetPct}%, #D0CBC0 ${budgetPct}%)`,
            }}
          />
          <p className="slider__value">
            Jusqu&apos;à {budget.toString().replace('.', ',')}{' '}
            {mapConfig.budget.suffix}
          </p>
        </div>
      )}

      {(hasInfluence || livraisonToggle) && (
        <div className="filter">
          <p className="filter__label">Options</p>
          <div className="toggles">
            {hasInfluence && (
              <Toggle
                label="Influence"
                on={onlyInfluence}
                onChange={setOnlyInfluence}
              />
            )}
            {livraisonToggle && (
              <Toggle
                label={livraisonToggle.label}
                on={livraison}
                onChange={setLivraison}
              />
            )}
          </div>
        </div>
      )}

      <button className="search-btn" type="button" onClick={onClose}>
        Rechercher
      </button>

      <p className="count">
        {count} {count > 1 ? providerPlural : providerSingular} trouvé
        {count > 1 ? 's' : ''}
      </p>
    </aside>
  )
}

export default function Carte() {
  const touchLayout = useCarteTouchLayout()
  const mobileLayout = useMobileLayout()
  const [searchParams, setSearchParams] = useSearchParams()
  const sectionId = resolveSectionId(
    searchParams.get('section') || DEFAULT_SECTION_ID
  )
  const section = getProviderSection(sectionId)
  const providers = section.providers

  const [search, setSearch] = useState('')
  const [specs, setSpecs] = useState([])
  const [budget, setBudget] = useState(BUDGET_MAX)
  const [onlyInfluence, setOnlyInfluence] = useState(false)
  const [livraison, setLivraison] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [pinnedCity, setPinnedCity] = useState(null)
  const [flyToken, setFlyToken] = useState(0)
  const [cityNotFound, setCityNotFound] = useState(false)
  const [cityPanelOpen, setCityPanelOpen] = useState(false)
  const [panelCity, setPanelCity] = useState(null)
  const [panelFromSearch, setPanelFromSearch] = useState(false)
  const [resetMapToken, setResetMapToken] = useState(0)
  const [mapImmersive, setMapImmersive] = useState(false)

  function handleSectionChange(nextId) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextId === DEFAULT_SECTION_ID) next.delete('section')
      else next.set('section', nextId)
      return next
    })
  }

  useEffect(() => {
    setSpecs([])
    setBudget(section.mapConfig.budget?.max ?? BUDGET_MAX)
    setOnlyInfluence(false)
    setLivraison(false)
    setPanelCity(null)
    setCityPanelOpen(false)
    setPanelFromSearch(false)
    setPinnedCity(null)
    setCityNotFound(false)
    setSearch('')
  }, [sectionId, section.mapConfig.budget?.max])

  useEffect(() => {
    if (!touchLayout || !mapImmersive) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [touchLayout, mapImmersive])

  function openMapImmersive() {
    setMapImmersive(true)
  }

  function closeMapImmersive() {
    setMapImmersive(false)
  }

  function returnToInteractiveMapFromResults() {
    setCityPanelOpen(false)
    setMapImmersive(true)
  }

  function clearMarkerResults() {
    setPanelCity(null)
    setCityPanelOpen(false)
    setPanelFromSearch(false)
  }

  function openCityPanel(city, fromSearch = false) {
    setPanelCity(city)
    setPanelFromSearch(fromSearch)
    setCityPanelOpen(true)

    if (mobileLayout && mapImmersive) {
      setMapImmersive(false)
      window.requestAnimationFrame(() => {
        document
          .querySelector('.carte-mobile-results')
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  function handleCityGo() {
    const city = findEuropeanCity(search)
    setPinnedCity(city)
    setCityNotFound(!city && search.trim().length >= 2)
    if (city) setFlyToken((t) => t + 1)
  }

  function handleClearCitySearch() {
    setPinnedCity(null)
    setCityNotFound(false)
    setSearch('')
    setResetMapToken((t) => t + 1)
    clearMarkerResults()
  }

  function handleSearchChange(value) {
    setSearch(value)
    setCityNotFound(false)
  }

  const toggleSpec = (s) =>
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )

  const filtered = filterProvidersForMap(providers, {
    search,
    pinnedCity,
    specs,
    budget,
    onlyInfluence,
    livraison,
    mapConfig: section.mapConfig,
  })

  const cityPatissieresAll = pinnedCity
    ? getPatissieresInCity(pinnedCity, providers)
    : []

  const panelPatissieres = panelCity
    ? getPatissieresInCity(panelCity, providers)
    : []

  const panelFilteredCount = panelPatissieres.filter((p) =>
    filtered.some((f) => f.id === p.id)
  ).length

  const totalInPinnedCity = cityPatissieresAll.length

  const cityMarkers = useMemo(() => {
    const groups = groupFilteredByCity(filtered)
    const pinnedKey = cityKey(pinnedCity)
    return groups.filter((g) => cityKey(g.city) !== pinnedKey)
  }, [filtered, pinnedCity])

  const budgetMin = section.mapConfig.budget?.min ?? BUDGET_MIN
  const budgetMax = section.mapConfig.budget?.max ?? BUDGET_MAX
  const budgetPct = section.mapConfig.budget
    ? ((budget - budgetMin) / (budgetMax - budgetMin)) * 100
    : 0
  const count = filtered.length
  const influenceTotal = providers.filter((p) => p.offersInfluence).length
  const regionsTotal = new Set(providers.map((p) => p.region)).size
  const showInfluenceStat = section.mapConfig.toggles.some((t) => t.id === 'influence')
  const patissieresLink =
    sectionId === DEFAULT_SECTION_ID
      ? '/patissieres'
      : `/patissieres?section=${sectionId}`

  const closeFilters = () => setFiltersOpen(false)

  const openFilters = () => {
    setMapImmersive(false)
    setFiltersOpen(true)
  }

  const filterSidebarProps = {
    filtersOpen: touchLayout ? filtersOpen : true,
    onClose: closeFilters,
    section,
    sectionId,
    onSectionChange: handleSectionChange,
    search,
    setSearch: handleSearchChange,
    onCityGo: handleCityGo,
    onClearCity: handleClearCitySearch,
    pinnedCity,
    cityStatus: { count, totalInCity: totalInPinnedCity, cityNotFound },
    specs,
    toggleSpec,
    budget,
    setBudget,
    budgetPct,
    onlyInfluence,
    setOnlyInfluence,
    livraison,
    setLivraison,
    count,
  }

  const cityPanelProps = {
    sectionId,
    providerSingular: section.providerSingular,
    providerPlural: section.providerPlural,
  }

  const filtersPortal =
    touchLayout &&
    createPortal(
      <>
        {filtersOpen && (
          <div
            className="sidebar__overlay"
            onClick={closeFilters}
            aria-hidden="true"
          />
        )}
        <FiltersSidebar {...filterSidebarProps} />
      </>,
      document.body
    )

  const mapImmersivePortal =
    touchLayout &&
    mapImmersive &&
    createPortal(
      <button
        type="button"
        className="map-immersive-close"
        onClick={closeMapImmersive}
        aria-label="Fermer la carte et revenir"
      >
        <X size={24} strokeWidth={2.4} />
      </button>,
      document.body
    )

  return (
    <div
      className={`carte-page ${touchLayout ? 'carte-page--touch' : ''} ${mapImmersive ? 'carte-page--map-immersive' : ''}`}
    >
      <Navbar />

      <div className="carte-layout">
        {!touchLayout && <FiltersSidebar {...filterSidebarProps} />}

        {filtersPortal}

        {mapImmersivePortal}

        <div className="carte-main">
          <div className="carte-section-bar">
            <div className="carte-section-bar__inner">
              <ProviderSectionPicker
                activeId={sectionId}
                onChange={handleSectionChange}
                className="carte-section-bar__picker provider-sections--scroll provider-sections--compact"
              />
              <p className="carte-section-bar__count">
                {count}{' '}
                {count > 1 ? section.providerPlural : section.providerSingular}
              </p>
            </div>
          </div>

          {touchLayout && (
            <header className="carte-mobile-head">
              <div className="carte-mobile-head__top">
                <div>
                  <h1 className="carte-mobile-head__title">Carte France</h1>
                  <p className="carte-mobile-head__sub">
                    {count}{' '}
                    {count > 1 ? section.providerPlural : section.providerSingular}{' '}
                    · France entière
                  </p>
                </div>
                <button
                  type="button"
                  className="carte-mobile-head__filtres"
                  onClick={openFilters}
                >
                  <SlidersHorizontal size={16} strokeWidth={2} />
                  Filtres
                </button>
              </div>

              <SearchFieldWithGo
                className="field--mobile"
                value={search}
                onChange={handleSearchChange}
                onGo={handleCityGo}
                placeholder="Londres, Barcelone, Paris…"
              />

              <CitySearchClear
                pinnedCity={pinnedCity}
                onClear={handleClearCitySearch}
              />

              <CitySearchStatus
                pinnedCity={pinnedCity}
                count={count}
                totalInCity={totalInPinnedCity}
                cityNotFound={cityNotFound}
                providerSingular={section.providerSingular}
                providerPlural={section.providerPlural}
              />

              <div className="carte-mobile-pills">
                {section.mapConfig.specialties.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`carte-pill ${specs.includes(s) ? 'is-on' : ''}`}
                    onClick={() => toggleSpec(s)}
                  >
                    {s}
                  </button>
                ))}
                {showInfluenceStat && (
                  <button
                    type="button"
                    className={`carte-pill carte-pill--influence ${onlyInfluence ? 'is-on' : ''}`}
                    onClick={() => setOnlyInfluence((v) => !v)}
                  >
                    Influence
                  </button>
                )}
              </div>

              <p className="carte-mobile-tip">
                Ouvrez la carte · touchez un marqueur pour afficher les fiches
                ici · un autre marqueur ou « Effacer les résultats » les remplace
              </p>
            </header>
          )}

          <div
            className={`map-wrap ${mapImmersive ? 'map-wrap--immersive' : ''}`}
          >
            {touchLayout && !mapImmersive && (
              <div className="map-enter-gate" aria-hidden={false}>
                <button
                  type="button"
                  className="map-enter-gate__btn"
                  onClick={openMapImmersive}
                >
                  <MapIcon size={20} strokeWidth={2} />
                  Ouvrir la carte
                </button>
                <p className="map-enter-gate__hint">
                  Navigation volontaire · glissez et zoomez une fois ouverte
                </p>
              </div>
            )}

            <MapContainer
              center={[46.603354, 1.888334]}
              zoom={6}
              minZoom={5}
              maxZoom={17}
              zoomControl={false}
              scrollWheelZoom={!touchLayout}
              dragging={!touchLayout}
              touchZoom={!touchLayout}
              doubleClickZoom={!touchLayout}
              boxZoom={!touchLayout}
              style={{ height: '100%', width: '100%' }}
            >
              <MapInvalidateSize active={filtersOpen} immersive={mapImmersive} />
              <MapInteractionMode
                touchLayout={touchLayout}
                immersive={mapImmersive}
              />
              <MapImmersiveZoomControls
                visible={touchLayout && mapImmersive}
              />
              <MapFlyToCity city={pinnedCity} flyToken={flyToken} />
              <MapFlyToFrance resetToken={resetMapToken} />
              {!touchLayout && <ZoomControl position="bottomright" />}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
              />
              {pinnedCity && (
                <Marker
                  key={`city-${pinnedCity.name}`}
                  position={[pinnedCity.lat, pinnedCity.lng]}
                  icon={redCityIcon}
                  zIndexOffset={1000}
                  eventHandlers={{
                    click: () => openCityPanel(pinnedCity, true),
                  }}
                />
              )}
              {cityMarkers.map((group) => (
                <Marker
                  key={cityKey(group.city)}
                  position={group.position}
                  icon={goldIcon}
                  eventHandlers={{
                    click: () => openCityPanel(group.city, false),
                  }}
                />
              ))}
            </MapContainer>

            {!mobileLayout && cityPanelOpen && panelCity && (
              <CityPatissieresPanel
                city={panelCity}
                list={panelPatissieres}
                filteredCount={panelFilteredCount}
                onClose={() => setCityPanelOpen(false)}
                touchLayout={touchLayout}
                fromSearch={panelFromSearch}
                {...cityPanelProps}
              />
            )}
          </div>

          {mobileLayout && cityPanelOpen && panelCity && !mapImmersive && (
            <section
              className="carte-mobile-results"
              aria-label="Résultats du marqueur"
            >
              <CityPatissieresPanel
                city={panelCity}
                list={panelPatissieres}
                filteredCount={panelFilteredCount}
                onClose={returnToInteractiveMapFromResults}
                touchLayout={touchLayout}
                pageLayout
                showClose
                closeLabel="Retour à la carte interactive"
                fromSearch={panelFromSearch}
                {...cityPanelProps}
              />
              <button
                type="button"
                className="carte-mobile-results__reset"
                onClick={clearMarkerResults}
              >
                <RotateCcw size={16} strokeWidth={2} />
                Effacer les résultats
              </button>
            </section>
          )}

          {touchLayout && (
            <section className="carte-mobile-below" aria-label="Informations">
              <div className="carte-stats">
                <div className="carte-stat">
                  <Users size={18} strokeWidth={1.8} />
                  <strong>{count}</strong>
                  <span>
                    {count > 1 ? 'résultats' : 'résultat'}
                    {specs.length > 0 || search
                      ? count > 1
                        ? ' filtrés'
                        : ' filtré'
                      : ''}
                  </span>
                </div>
                <div className="carte-stat">
                  <MapPin size={18} strokeWidth={1.8} />
                  <strong>{regionsTotal}</strong>
                  <span>régions</span>
                </div>
                {showInfluenceStat && (
                  <div className="carte-stat">
                    <Sparkles size={18} strokeWidth={1.8} />
                    <strong>{influenceTotal}</strong>
                    <span>influence</span>
                  </div>
                )}
              </div>

              <div className="carte-steps">
                <p className="carte-steps__title">Comment ça marche</p>
                <ol className="carte-steps__list">
                  <li>
                    <span className="carte-steps__num">1</span>
                    <span>
                      <strong>Choisissez une section</strong>, puis filtrez par
                      ville et spécialité
                      {section.mapConfig.budget ? ' (prix à la part pour les pâtissières)' : ''}
                    </span>
                  </li>
                  <li>
                    <span className="carte-steps__num">2</span>
                    <span>
                      <strong>Touchez un marqueur</strong> sur la carte pour le
                      détail
                    </span>
                  </li>
                  <li>
                    <span className="carte-steps__num">3</span>
                    <span>
                      <strong>Contactez-la</strong> via WhatsApp, Instagram ou e-mail
                    </span>
                  </li>
                </ol>
              </div>

              <div className="carte-cta-band">
                <Sparkles size={20} className="carte-cta-band__icon" strokeWidth={1.6} />
                <p className="carte-cta-band__text">
                  {count > 0
                    ? `${count} ${count > 1 ? section.providerPlural : section.providerSingular} correspondent à votre recherche.`
                    : section.emptyMessage}
                </p>
                <Link to={patissieresLink} className="carte-cta-band__btn">
                  Voir toutes les fiches <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
