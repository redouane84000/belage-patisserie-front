import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link } from 'react-router-dom'
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
  Map,
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
import patissieres from '../../data/patissieres'
import {
  formatPricePerSlice,
  getPricePerSlice,
} from '../../utils/patissiere'
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

const goldIcon = L.divIcon({
  className: 'gold-marker-wrap',
  html: '<div class="gold-marker" role="button" aria-label="Voir les pâtissières de cette ville"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const redCityIcon = L.divIcon({
  className: 'search-city-marker-wrap',
  html: '<div class="search-city-marker" role="button" aria-label="Voir les pâtissières de cette ville"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const SPECIALITES = [
  'Wedding Cake',
  'Number Cake',
  'Baby Shower',
  'Anniversaire',
  'Sweet Table',
  'Cake Design',
]

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

function CitySearchStatus({ pinnedCity, count, totalInCity, cityNotFound }) {
  if (cityNotFound) {
    return (
      <p className="city-search-status city-search-status--warn" role="status">
        Ville non reconnue — essayez Londres, Barcelone, Paris…
      </p>
    )
  }
  if (!pinnedCity) return null

  if (totalInCity === 0) {
    return (
      <p className="city-search-status city-search-status--empty" role="status">
        Aucune pâtissière répertoriée à {pinnedCity.name}
      </p>
    )
  }

  if (count === 0) {
    return (
      <p className="city-search-status city-search-status--warn" role="status">
        {totalInCity} pâtissière{totalInCity > 1 ? 's' : ''} à {pinnedCity.name}, mais
        aucune ne correspond à vos filtres — cliquez un marqueur pour la liste
      </p>
    )
  }

  return (
    <p className="city-search-status city-search-status--ok" role="status">
      {count} pâtissière{count > 1 ? 's' : ''} affichée{count > 1 ? 's' : ''} à{' '}
      {pinnedCity.name}
      {' · cliquez un marqueur pour la liste'}
    </p>
  )
}

function initiales(nom) {
  return nom
    .split(' ')
    .map((mot) => mot[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
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

function PatissiereMiniCard({ p }) {
  const navigate = useNavigate()
  return (
    <li>
      <button
        type="button"
        className="city-mini-card"
        onClick={() => navigate(`/patissieres?id=${p.id}`)}
      >
        <div className="city-mini-card__avatar">{initiales(p.nom)}</div>
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
}) {
  if (!city) return null

  return (
    <aside
      className={`city-panel ${touchLayout && !pageLayout ? 'city-panel--mobile' : ''} ${pageLayout ? 'city-panel--page' : ''}`}
      aria-label={`Pâtissières à ${city.name}`}
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
          <p>Aucune pâtissière répertoriée à {city.name} pour le moment.</p>
        </div>
      ) : (
        <>
          <p className="city-panel__count">
            {list.length} pâtissière{list.length > 1 ? 's' : ''}
            {filteredCount < list.length &&
              ` · ${filteredCount} affichée${filteredCount > 1 ? 's' : ''} sur la carte`}
          </p>
          <ul className="city-panel__list">
            {list.map((p) => (
              <PatissiereMiniCard key={p.id} p={p} />
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
  return (
    <aside className={`sidebar ${filtersOpen ? 'is-open' : ''}`}>
      <div className="sidebar__handle" />

      <div className="sidebar__head">
        <h1 className="sidebar__title">Trouver une pâtissière</h1>
        <button
          className="sidebar__close"
          type="button"
          onClick={onClose}
          aria-label="Fermer les filtres"
        >
          <X size={20} strokeWidth={1.8} />
        </button>
      </div>
      <p className="sidebar__sub">125 créatrices dans toute la France</p>

      <SearchFieldWithGo
        value={search}
        onChange={setSearch}
        onGo={onCityGo}
        placeholder="Londres, Barcelone, Paris…"
      />

      <CitySearchClear pinnedCity={pinnedCity} onClear={onClearCity} />

      <CitySearchStatus {...cityStatus} pinnedCity={pinnedCity} />

      <div className="filter">
        <p className="filter__label">Spécialité</p>
        <div className="checks">
          {SPECIALITES.map((s) => (
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

      <div className="filter">
        <p className="filter__label">Prix max / part</p>
        <input
          type="range"
          className="slider"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--color-gold) ${budgetPct}%, #D0CBC0 ${budgetPct}%)`,
          }}
        />
        <p className="slider__value">
          Jusqu&apos;à {budget.toString().replace('.', ',')} €/part
        </p>
      </div>

      <div className="filter">
        <p className="filter__label">Options</p>
        <div className="toggles">
          <Toggle
            label="Influence"
            on={onlyInfluence}
            onChange={setOnlyInfluence}
          />
          <Toggle
            label="Livraison disponible"
            on={livraison}
            onChange={setLivraison}
          />
        </div>
      </div>

      <button className="search-btn" type="button" onClick={onClose}>
        Rechercher
      </button>

      <p className="count">
        {count} pâtissière{count > 1 ? 's' : ''} trouvée
        {count > 1 ? 's' : ''}
      </p>
    </aside>
  )
}

export default function Carte() {
  const touchLayout = useCarteTouchLayout()
  const mobileLayout = useMobileLayout()
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

  function handleGoldMarkerClick(p) {
    openCityPanel(resolveCityFromPatissiere(p), false)
  }

  function handleSearchChange(value) {
    setSearch(value)
    setCityNotFound(false)
  }

  const toggleSpec = (s) =>
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )

  const filtered = patissieres.filter((p) => {
    let matchLocation = true
    if (pinnedCity) {
      matchLocation = patissiereMatchesCity(p, pinnedCity)
    } else {
      const q = search.trim().toLowerCase()
      matchLocation =
        !q ||
        p.ville.toLowerCase().includes(q) ||
        p.nom.toLowerCase().includes(q)
    }
    const matchSpec =
      specs.length === 0 || specs.some((s) => p.specialites.includes(s))
    const slice = getPricePerSlice(p)
    const matchBudget = slice == null || slice <= budget
    const matchInfluence = !onlyInfluence || p.offersInfluence === true
    const matchLivraison = !livraison || p.livraison
    return (
      matchLocation &&
      matchSpec &&
      matchBudget &&
      matchInfluence &&
      matchLivraison
    )
  })

  const cityPatissieresAll = pinnedCity
    ? getPatissieresInCity(pinnedCity, patissieres)
    : []

  const panelPatissieres = panelCity
    ? getPatissieresInCity(panelCity, patissieres)
    : []

  const panelFilteredCount = panelPatissieres.filter((p) =>
    filtered.some((f) => f.id === p.id)
  ).length

  const totalInPinnedCity = cityPatissieresAll.length

  const budgetPct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100
  const count = filtered.length
  const influenceTotal = patissieres.filter((p) => p.offersInfluence).length
  const regionsTotal = new Set(patissieres.map((p) => p.region)).size

  const closeFilters = () => setFiltersOpen(false)

  const openFilters = () => {
    setMapImmersive(false)
    setFiltersOpen(true)
  }

  const filterSidebarProps = {
    filtersOpen: touchLayout ? filtersOpen : true,
    onClose: closeFilters,
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
          {touchLayout && (
            <header className="carte-mobile-head">
              <div className="carte-mobile-head__top">
                <div>
                  <h1 className="carte-mobile-head__title">Carte France</h1>
                  <p className="carte-mobile-head__sub">
                    {count} pâtissière{count > 1 ? 's' : ''} · France entière
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
              />

              <div className="carte-mobile-pills">
                {SPECIALITES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`carte-pill ${specs.includes(s) ? 'is-on' : ''}`}
                    onClick={() => toggleSpec(s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  className={`carte-pill carte-pill--influence ${onlyInfluence ? 'is-on' : ''}`}
                  onClick={() => setOnlyInfluence((v) => !v)}
                >
                  Influence
                </button>
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
                  <Map size={20} strokeWidth={2} />
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
              {filtered.map((p) => (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  icon={goldIcon}
                  eventHandlers={{
                    click: () => handleGoldMarkerClick(p),
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
                <div className="carte-stat">
                  <Sparkles size={18} strokeWidth={1.8} />
                  <strong>{influenceTotal}</strong>
                  <span>influence</span>
                </div>
              </div>

              <div className="carte-steps">
                <p className="carte-steps__title">Comment ça marche</p>
                <ol className="carte-steps__list">
                  <li>
                    <span className="carte-steps__num">1</span>
                    <span>
                      <strong>Filtrez</strong> par ville, spécialité ou prix à la part
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
                      <strong>Demandez un devis</strong> à la pâtissière choisie
                    </span>
                  </li>
                </ol>
              </div>

              <div className="carte-cta-band">
                <Sparkles size={20} className="carte-cta-band__icon" strokeWidth={1.6} />
                <p className="carte-cta-band__text">
                  {count > 0
                    ? `${count} créatrice${count > 1 ? 's' : ''} correspondent à votre recherche.`
                    : 'Aucun résultat — élargissez vos filtres.'}
                </p>
                <Link to="/patissieres" className="carte-cta-band__btn">
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
