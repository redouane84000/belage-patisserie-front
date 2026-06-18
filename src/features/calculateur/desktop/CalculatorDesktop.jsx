import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCalculatorStore } from '../CalculatorContext'
import { compute } from '../engine/compute'
import { eur, pct, uid } from '../engine/format'
import {
  defaultUseUnit,
  energyCost,
  energyCostFlexible,
  ingCost,
  toBase,
  unitFamily,
} from '../engine/units'
import InvoiceBuilder from '../invoice/InvoiceBuilder'
import './calculator-desktop.css'

const CREATION_TYPES = [
  'Layer cake',
  'Wedding cake',
  'Cupcakes',
  'Entremets',
  'Number cake',
  'Pièce montée',
  'Autre',
]

const VIEWS = {
  calc: { crumb: 'Atelier des Prix', title: 'Calculateur de rentabilité' },
  ingredients: { crumb: 'Bibliothèque', title: 'Mes ingrédients' },
  creations: { crumb: 'Historique', title: 'Mes créations' },
  dashboard: { crumb: 'Vue d’ensemble', title: 'Tableau de bord' },
  settings: { crumb: 'Configuration', title: 'Paramètres' },
  invoice: { crumb: 'Facturation', title: 'Créer une facture' },
}

const STATUS = {
  exc: {
    cls: 's-exc',
    label: 'Très belle rentabilité',
    color: 'var(--sage)',
    icon: <path d="M5 13l4 4L19 7" />,
    big: 'Votre marge est confortable.',
    sm: 'Ce prix valorise vraiment votre travail. Continuez ainsi.',
  },
  mod: {
    cls: 's-mod',
    label: 'Marge correcte, mais améliorable',
    color: 'var(--honey)',
    icon: (
      <>
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.9L2 18a2 2 0 002 3h16a2 2 0 002-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </>
    ),
    big: 'Vous gagnez correctement votre vie.',
    sm: 'Un petit ajustement de prix ou de coûts la rendrait excellente.',
  },
  low: {
    cls: 's-low',
    label: 'Marge trop faible',
    color: 'var(--terra)',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
    big: 'Votre prix couvre à peine votre travail.',
    sm: "Au prix actuel, l'effort fourni n'est pas récompensé. Pensez à le relever.",
  },
  neutral: {
    cls: 's-neutral',
    label: 'En attente de votre prix',
    color: 'var(--taupe)',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
    big: 'Voici votre prix conseillé.',
    sm: 'Entrez votre prix de vente prévu pour mesurer votre marge réelle.',
  },
}

const ST_MAP = {
  exc: ['s-exc', 'Excellente'],
  mod: ['s-mod', 'Correcte'],
  low: ['s-low', 'Faible'],
  neutral: ['s-neutral', '—'],
}

function unitLabel(u) {
  return u === 'u' ? 'pièce' : u
}

function lineEnergyCost(item, kwh) {
  if (item.durationUnit) {
    return energyCostFlexible(
      +item.power || +item.kw || 0,
      +item.duration || 0,
      item.durationUnit,
      kwh,
    )
  }
  return energyCost(item.power, item.minutes, kwh)
}

function recommendations(result, draft) {
  const out = []
  const { level, gap, ing, pack, energy, labor, cost, costFull, suggested, priceNoHours, priceFull, marginRate } =
    result
  const countHours = draft.countHours !== false

  if (level === 'low' || level === 'mod') {
    if (gap != null && gap > 0.5) {
      out.push(
        `Votre prix est inférieur de <b>${eur(gap)}</b> au prix conseillé. Le porter à <b>${eur(suggested)}</b> sécurise votre marge.`,
      )
    }
    const big = [
      ['les ingrédients', ing],
      ["l'emballage", pack],
      ["l'énergie", energy],
    ].sort((a, b) => b[1] - a[1])[0]
    if (big[1] > 0 && cost > 0 && big[1] / cost > 0.35) {
      out.push(
        `Le poste <b>${big[0]}</b> pèse ${pct((big[1] / cost) * 100)} de votre coût. Un fournisseur ou un format plus grand peut l'alléger.`,
      )
    }
    if (countHours && labor / Math.max(1, costFull) > 0.5) {
      out.push(
        'Votre temps représente plus de la moitié du coût : un tarif horaire un peu plus élevé est justifié pour ce niveau de finition.',
      )
    }
  }

  if (level === 'exc') {
    out.push(
      `À <b>${pct(marginRate)}</b> de marge, vous pourriez proposer une <b>version premium</b> (cake topper, parts supplémentaires) et monter encore en gamme.`,
    )
    if (gap != null && gap > 0) {
      out.push(`Vous vendez même <b>${eur(gap)}</b> au-dessus du prix conseillé : votre positionnement est solide.`)
    }
  }

  if (level === 'neutral') {
    out.push(
      `Sans compter vos heures, le prix conseillé serait <b>${eur(priceNoHours)}</b>. En les comptant, <b>${eur(priceFull)}</b>.`,
    )
    out.push(`Le coût par part s'élève à <b>${eur(result.costPerPart)}</b> — utile pour fixer un prix « à la part ».`)
  }

  return out
}

function useUnitsForPack(packUnit) {
  if (packUnit === 'u') return ['u']
  const fam = unitFamily(packUnit)
  if (fam === unitFamily('g')) return ['g', 'kg', 'mg']
  if (fam === unitFamily('ml')) return ['ml', 'cl', 'dl', 'L']
  return ['g']
}

const PACK_UNIT_OPTIONS = ['g', 'kg', 'ml', 'cl', 'L', 'u']

function MoneyInput({ value, onChange, placeholder = '0,00' }) {
  return (
    <div className="calc-inp-money">
      <input
        className="inp calc-inp-money__field"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
      />
      <span className="calc-inp-money__sfx" aria-hidden>
        €
      </span>
    </div>
  )
}

function NumInput({ value, onChange, placeholder, step = 'any', suffix }) {
  return (
    <div className={`calc-inp-suffix${suffix ? '' : ' calc-inp-suffix--plain'}`}>
      <input
        className="inp calc-inp-num"
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
      />
      {suffix ? <span className="calc-inp-suffix__sfx">{suffix}</span> : null}
    </div>
  )
}

function UnitPicker({ value, onChange, options }) {
  return (
    <div className="calc-unit-seg" role="group">
      {options.map((u) => (
        <button
          key={u}
          type="button"
          className={value === u ? 'on' : ''}
          aria-pressed={value === u}
          onClick={() => onChange(u)}
        >
          {u === 'u' ? 'pce' : u}
        </button>
      ))}
    </div>
  )
}

function UnitSelect({ value, onChange, className = 'sel' }) {
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      <optgroup label="Masse">
        {['g', 'kg', 'mg'].map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </optgroup>
      <optgroup label="Volume">
        {['ml', 'cl', 'dl', 'L'].map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </optgroup>
      <optgroup label="Unité">
        <option value="u">pièce</option>
      </optgroup>
    </select>
  )
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7" />
      </svg>
      <div className="et">{title}</div>
      <div className="es">{subtitle}</div>
    </div>
  )
}

function IconRemove() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function CalculatorDesktop() {
  const {
    settings,
    setSettings,
    library,
    setLibrary,
    creations,
    setCreations,
    toast,
    toastMsg,
    newDraft,
  } = useCalculatorStore()

  const [view, setView] = useState('calc')
  const [draft, setDraft] = useState(() => newDraft())
  const [advOpen, setAdvOpen] = useState(false)
  const [ingFilter, setIngFilter] = useState('Toutes')
  const [ingQuery, setIngQuery] = useState('')
  const [ingEditor, setIngEditor] = useState(null)
  const [settingsForm, setSettingsForm] = useState({
    kwh: settings.kwh,
    hourlyRate: settings.hourlyRate,
    margin: settings.margin,
    shop: settings.shop,
  })

  const result = useMemo(() => compute(draft, settings), [draft, settings])

  const patchDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateList = useCallback((key, updater) => {
    setDraft((prev) => ({
      ...prev,
      [key]: typeof updater === 'function' ? updater(prev[key] || []) : updater,
    }))
  }, [])

  const libraryNames = useMemo(() => library.map((i) => i.name), [library])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(library.map((i) => i.cat || 'Autre')))
    return ['Toutes', ...cats]
  }, [library])

  const filteredLibrary = useMemo(() => {
    return library.filter(
      (i) =>
        (ingFilter === 'Toutes' || i.cat === ingFilter) &&
        i.name.toLowerCase().includes(ingQuery.toLowerCase()),
    )
  }, [library, ingFilter, ingQuery])

  const autofillIngredient = (index, name) => {
    const match = library.find((i) => i.name.toLowerCase() === name.trim().toLowerCase())
    if (!match) return
    updateList('ingredients', (list) =>
      list.map((row, i) =>
        i === index
          ? {
              ...row,
              name: match.name,
              packQty: match.packQty,
              packUnit: match.packUnit,
              packPrice: match.packPrice,
              useUnit: defaultUseUnit(match.packUnit),
            }
          : row,
      ),
    )
  }

  const syncUseUnit = (packUnit, currentUseUnit) => {
    if (packUnit === 'u') return 'u'
    const next = defaultUseUnit(packUnit)
    if (packUnit === currentUseUnit) return currentUseUnit
    return next
  }

  const resetCalc = () => {
    setDraft(newDraft())
    toast('Nouvelle création prête')
  }

  const saveCreation = () => {
    const name = draft.name?.trim() || 'Création sans nom'
    setCreations((prev) => [
      {
        id: uid(),
        name,
        type: draft.type,
        date: Date.now(),
        cost: result.cost,
        suggested: result.suggested,
        price: draft.currentPrice || 0,
        marginRate: result.marginDecimal,
        status: result.level,
        countHours: draft.countHours !== false,
      },
      ...prev,
    ])
    toast(`« ${name} » enregistrée`)
  }

  const copyResume = () => {
    const txt =
      `✦ ${settings.shop} — ${draft.name || 'Création'}\n` +
      `Coût de revient : ${eur(result.cost)} (${eur(result.costPerPart)}/part)\n` +
      `Prix conseillé : ${eur(result.suggested)}\n` +
      (result.price > 0
        ? `Prix prévu : ${eur(result.price)} — marge ${pct(result.marginRate)} (${eur(result.marginEur)})\n`
        : '') +
      `Avec heures ${eur(result.priceFull)} · Sans heures ${eur(result.priceNoHours)}`
    navigator.clipboard?.writeText(txt).then(() => toast('Résumé copié'))
  }

  const saveSettingsForm = () => {
    setSettings({
      kwh: +settingsForm.kwh || 0.2516,
      hourlyRate: +settingsForm.hourlyRate || 25,
      margin: +settingsForm.margin || 40,
      shop: settingsForm.shop.trim() || 'Bel Âge Pâtisserie',
    })
    toast('Réglages enregistrés')
  }

  const openIngEditor = (id) => {
    if (id) {
      const item = library.find((x) => x.id === id)
      if (item) setIngEditor({ ...item })
    } else {
      setIngEditor({ name: '', cat: 'Produits laitiers', packQty: '', packUnit: 'g', packPrice: '' })
    }
  }

  const saveIngEditor = () => {
    if (!ingEditor?.name?.trim()) return
    const payload = {
      name: ingEditor.name.trim(),
      cat: ingEditor.cat?.trim() || 'Autre',
      packQty: +ingEditor.packQty || 0,
      packUnit: ingEditor.packUnit || 'g',
      packPrice: +ingEditor.packPrice || 0,
    }
    if (ingEditor.id) {
      setLibrary((prev) => prev.map((x) => (x.id === ingEditor.id ? { ...x, ...payload } : x)))
      toast('Ingrédient mis à jour')
    } else {
      setLibrary((prev) => [{ id: uid(), ...payload }, ...prev])
      toast('Ingrédient ajouté')
    }
    setIngEditor(null)
  }

  const deleteLibraryItem = (id) => {
    setLibrary((prev) => prev.filter((x) => x.id !== id))
    toast('Ingrédient supprimé')
  }

  const deleteCreation = (id) => {
    setCreations((prev) => prev.filter((x) => x.id !== id))
    toast('Création supprimée')
  }

  const gaugeProg = Math.max(0, Math.min(1, (result.marginRate || 0) / 100))
  const gaugeDash = 339.292
  const S = STATUS[result.level] || STATUS.neutral

  const bdParts = [
    ['var(--champagne)', result.ing],
    ['var(--sage)', result.pack],
    ['var(--honey)', result.energy],
    ['var(--terra)', draft.countHours !== false ? result.labor : 0],
    ['var(--taupe-light)', result.fixed],
  ].filter((p) => p[1] > 0)
  const bdTotal = bdParts.reduce((s, p) => s + p[1], 0) || 1

  const recos = recommendations(result, draft)
  const countHours = draft.countHours !== false
  const marginPct = (+draft.margin || settings.margin || 0)

  const withPrice = creations.filter((c) => c.price > 0)
  const ca = withPrice.reduce((s, c) => s + c.price, 0)
  const avgMargin = withPrice.length
    ? withPrice.reduce((s, c) => s + (c.marginRate || 0), 0) / withPrice.length
    : 0
  const best = [...creations].sort((a, b) => (b.marginRate ?? -9) - (a.marginRate ?? -9))[0]
  const risky = creations.filter((c) => c.status === 'low')

  const viewMeta = VIEWS[view]

  return (
    <div className="calc-d">
      <div className="calc-d__curtain" aria-hidden="true" />
      <div className="calc-d__spark" aria-hidden="true" />
      <header className="calc-d-site-bar">
        <Link to="/" className="calc-d-site-bar__home">
          <span className="calc-d-site-bar__mark">
            BEL <span>ÂGE</span>
          </span>
          <span className="calc-d-site-bar__sub">Retour au site</span>
        </Link>
        <Link to="/patissieres" className="calc-d-site-bar__annuaire">
          Annuaire prestataires
        </Link>
      </header>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <Link to="/" className="brand-home">
              <div className="mark">
                BEL <span>ÂGE</span>
              </div>
              <div className="sub">Pâtisserie</div>
            </Link>
            <div className="tool">
              <span className="dot" /> Atelier des Prix
            </div>
          </div>
          <Link to="/" className="calc-sidebar-exit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour au site
          </Link>
          <nav className="calc-sidebar-nav" aria-label="Navigation calculateur">
            {[
              ['calc', 'Calculateur', null],
              ['ingredients', 'Mes ingrédients', library.length],
              ['creations', 'Mes créations', creations.length],
              ['dashboard', 'Tableau de bord', null],
              ['settings', 'Paramètres', null],
            ].map(([id, label, badge]) => (
              <button
                key={id}
                type="button"
                className={`calc-sidebar-nav__item${view === id ? ' is-active' : ''}${badge != null ? ' has-badge' : ''}`}
                onClick={() => {
                  setView(id)
                  if (id === 'settings') {
                    setSettingsForm({
                      kwh: settings.kwh,
                      hourlyRate: settings.hourlyRate,
                      margin: settings.margin,
                      shop: settings.shop,
                    })
                  }
                }}
              >
                <span className="calc-sidebar-nav__lead">
                  {id === 'calc' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 18h8" />
                    </svg>
                  )}
                  {id === 'ingredients' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M3 7l9-4 9 4-9 4-9-4z" />
                      <path d="M3 7v6l9 4 9-4V7" />
                    </svg>
                  )}
                  {id === 'creations' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M12 21c-4-3-8-6-8-11a4 4 0 018-1 4 4 0 018 1c0 5-4 8-8 11z" />
                    </svg>
                  )}
                  {id === 'dashboard' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
                    </svg>
                  )}
                  {id === 'settings' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
                    </svg>
                  )}
                  <span className="calc-sidebar-nav__label">{label}</span>
                </span>
                {badge != null && (
                  <span className="calc-sidebar-nav__badge" aria-hidden>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="calc-sidebar-invoice">
            <button
              type="button"
              className={`calc-sidebar-nav__item calc-sidebar-invoice__btn${view === 'invoice' ? ' is-active' : ''}`}
              onClick={() => setView('invoice')}
            >
              <span className="calc-sidebar-nav__lead">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                <span className="calc-sidebar-nav__label">Créer facture</span>
              </span>
            </button>
          </div>
          <div className="side-foot">
            <div className="who">{settings.shop}</div>
            <div className="meta">Atelier des Prix · v1.0</div>
          </div>
        </aside>

        <main className="main">
          <header className="page-head">
            <div className="page-head__text" key={view}>
              <p className="page-head__crumb">{viewMeta.crumb}</p>
              <h1 className="page-head__title">{viewMeta.title}</h1>
            </div>
            <div className="page-head__actions">
              <Link to="/" className="btn btn-ghost btn-sm calc-head-exit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Site Bel Âge
              </Link>
              {view === 'calc' && (
                <>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={resetCalc}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4v6h6M20 20v-6h-6" />
                      <path d="M20 9a8 8 0 00-15-2M4 15a8 8 0 0015 2" />
                    </svg>
                    Nouveau
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={saveCreation}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 3h14a2 2 0 012 2v14l-9-4-9 4V5a2 2 0 012-2z" />
                    </svg>
                    Enregistrer
                  </button>
                </>
              )}
              {view === 'ingredients' && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openIngEditor()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Nouvel ingrédient
                </button>
              )}
            </div>
          </header>

          <div className="content">
            {/* CALCULATOR */}
            <section className={`view${view === 'calc' ? ' active' : ''}`}>
              <div className="calc">
                <div className="form-col">
                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 3l2 4 4 .5-3 3 .8 4.5L12 17l-3.8 2 .8-4.5-3-3 4-.5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">La création</div>
                        <div className="ds">Donnez un nom et le nombre de parts</div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <div className="field">
                        <label>Nom de la création</label>
                        <input
                          className="inp"
                          placeholder="Layer cake vanille fraise"
                          value={draft.name}
                          onChange={(e) => patchDraft({ name: e.target.value })}
                        />
                      </div>
                      <div className="row2">
                        <div className="field">
                          <label>Nombre de parts</label>
                          <input
                            className="inp"
                            type="number"
                            min="1"
                            value={draft.servings}
                            onChange={(e) => patchDraft({ servings: +e.target.value || 1 })}
                          />
                        </div>
                        <div className="field">
                          <label>Type</label>
                          <select
                            className="sel"
                            style={{ padding: '11px 14px' }}
                            value={draft.type}
                            onChange={(e) => patchDraft({ type: e.target.value })}
                          >
                            {CREATION_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M5 8h14l-1 12H6L5 8z" />
                          <path d="M9 8V6a3 3 0 016 0v2" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">Ingrédients & matières</div>
                        <div className="ds">Le coût se calcule au gramme / au ml selon le pack</div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <datalist id="ingDL">
                        {libraryNames.map((n) => (
                          <option key={n} value={n} />
                        ))}
                      </datalist>
                      {(draft.ingredients || []).map((row, idx) => {
                        const useUnit = row.useUnit || defaultUseUnit(row.packUnit || 'g')
                        const cost = ingCost(
                          row.packQty,
                          row.packUnit,
                          row.packPrice,
                          row.useQty,
                          useUnit,
                        )
                        const hasValues = row.packQty && row.useQty && row.packPrice
                        const incompat = hasValues && cost === null
                        return (
                          <div key={row.id || idx} className="ing-card">
                            <div className="ing-card__head">
                              <div className="ing-card__field ing-card__field--name">
                                <label className="ing-card__lab">Ingrédient</label>
                                <input
                                  className="inp ing-card__name-inp"
                                  list="ingDL"
                                  placeholder="Mascarpone, beurre, farine…"
                                  value={row.name || ''}
                                  onChange={(e) =>
                                    updateList('ingredients', (list) =>
                                      list.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)),
                                    )
                                  }
                                  onBlur={(e) => autofillIngredient(idx, e.target.value)}
                                />
                              </div>
                              <button
                                type="button"
                                className="ing-card__rm"
                                title="Retirer"
                                onClick={() =>
                                  updateList('ingredients', (list) => list.filter((_, i) => i !== idx))
                                }
                              >
                                <IconRemove />
                              </button>
                            </div>

                            <div className="ing-card__block">
                              <p className="ing-card__block-title">Conditionnement acheté en magasin</p>
                              <div className="ing-card__grid ing-card__grid--pack">
                                <div className="ing-card__field">
                                  <label className="ing-card__lab">Quantité du pack</label>
                                  <NumInput
                                    placeholder="500"
                                    value={row.packQty ?? ''}
                                    onChange={(e) =>
                                      updateList('ingredients', (list) =>
                                        list.map((r, i) =>
                                          i === idx ? { ...r, packQty: e.target.value } : r,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                                <div className="ing-card__field ing-card__field--price">
                                  <label className="ing-card__lab">Prix du pack</label>
                                  <MoneyInput
                                    placeholder="2,99"
                                    value={row.packPrice ?? ''}
                                    onChange={(e) =>
                                      updateList('ingredients', (list) =>
                                        list.map((r, i) =>
                                          i === idx ? { ...r, packPrice: e.target.value } : r,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                                <div className="ing-card__field ing-card__field--units-wide">
                                  <label className="ing-card__lab">Unité du conditionnement</label>
                                  <UnitPicker
                                    value={row.packUnit || 'g'}
                                    options={PACK_UNIT_OPTIONS}
                                    onChange={(pu) =>
                                      updateList('ingredients', (list) =>
                                        list.map((r, i) =>
                                          i === idx
                                            ? { ...r, packUnit: pu, useUnit: syncUseUnit(pu, r.useUnit) }
                                            : r,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="ing-card__block">
                              <p className="ing-card__block-title">Quantité utilisée dans la recette</p>
                              <div className="ing-card__grid ing-card__grid--use">
                                <div className="ing-card__field">
                                  <label className="ing-card__lab">Utilisé</label>
                                  <NumInput
                                    placeholder="350"
                                    value={row.useQty ?? ''}
                                    onChange={(e) =>
                                      updateList('ingredients', (list) =>
                                        list.map((r, i) =>
                                          i === idx ? { ...r, useQty: e.target.value } : r,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                                <div className="ing-card__field">
                                  <label className="ing-card__lab">Unité utilisée</label>
                                  <UnitPicker
                                    value={useUnit}
                                    options={useUnitsForPack(row.packUnit || 'g')}
                                    onChange={(uu) =>
                                      updateList('ingredients', (list) =>
                                        list.map((r, i) => (i === idx ? { ...r, useUnit: uu } : r)),
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={`ing-card__foot${incompat ? ' ing-card__foot--warn' : ''}`}>
                              <span className="ing-card__foot-lbl">
                                {incompat ? 'Unités incompatibles — vérifiez pack et recette' : 'Coût dans la recette'}
                              </span>
                              <span className="ing-card__foot-val">{cost == null ? '—' : eur(cost)}</span>
                            </div>
                          </div>
                        )
                      })}
                      <button
                        type="button"
                        className="add-line"
                        onClick={() =>
                          updateList('ingredients', (list) => [
                            ...list,
                            {
                              id: uid(),
                              name: '',
                              packQty: '',
                              packUnit: 'g',
                              packPrice: '',
                              useQty: '',
                              useUnit: 'g',
                            },
                          ])
                        }
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Ajouter un ingrédient
                      </button>
                      <div className="subtotal">
                        <span className="l">Sous-total ingrédients</span>
                        <span className="v">{eur(result.ing)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" />
                          <path d="M3 8l9 5 9-5M12 13v8" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">Emballage & présentation</div>
                        <div className="ds">Boîte, sac kraft, ruban, étiquette…</div>
                      </div>
                      <div className="opt">facultatif</div>
                    </div>
                    <div className="panel-body">
                      {(draft.packaging || []).map((row, idx) => {
                        const cost = (+row.unitPrice || 0) * (+row.qty || 0)
                        return (
                          <div key={row.id || idx} className="item-card">
                            <div className="item-card__row">
                              <div className="ing-card__field ing-card__field--grow">
                                <label className="ing-card__lab">Emballage</label>
                                <input
                                  className="inp"
                                  placeholder="Boîte à gâteau, sac kraft…"
                                  value={row.name || ''}
                                  onChange={(e) =>
                                    updateList('packaging', (list) =>
                                      list.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)),
                                    )
                                  }
                                />
                              </div>
                              <div className="ing-card__field ing-card__field--price">
                                <label className="ing-card__lab">Prix unitaire</label>
                                <MoneyInput
                                  placeholder="0,80"
                                  value={row.unitPrice ?? ''}
                                  onChange={(e) =>
                                    updateList('packaging', (list) =>
                                      list.map((r, i) =>
                                        i === idx ? { ...r, unitPrice: e.target.value } : r,
                                      ),
                                    )
                                  }
                                />
                              </div>
                              <div className="ing-card__field ing-card__field--qty">
                                <label className="ing-card__lab">Qté</label>
                                <NumInput
                                  placeholder="1"
                                  value={row.qty ?? 1}
                                  onChange={(e) =>
                                    updateList('packaging', (list) =>
                                      list.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r)),
                                    )
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                className="ing-card__rm"
                                onClick={() =>
                                  updateList('packaging', (list) => list.filter((_, i) => i !== idx))
                                }
                              >
                                <IconRemove />
                              </button>
                            </div>
                            <div className="ing-card__foot">
                              <span className="ing-card__foot-lbl">Coût emballage</span>
                              <span className="ing-card__foot-val">{eur(cost)}</span>
                            </div>
                          </div>
                        )
                      })}
                      <button
                        type="button"
                        className="add-line"
                        onClick={() =>
                          updateList('packaging', (list) => [
                            ...list,
                            { id: uid(), name: '', unitPrice: '', qty: 1 },
                          ])
                        }
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Ajouter un emballage
                      </button>
                      <div className="subtotal">
                        <span className="l">Sous-total emballage</span>
                        <span className="v">{eur(result.pack)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">Énergie électrique</div>
                        <div className="ds">Four, batteur… puissance × durée × tarif kWh</div>
                      </div>
                      <div className="opt">facultatif</div>
                    </div>
                    <div className="panel-body">
                      {(draft.energy || []).map((row, idx) => {
                        const cost = lineEnergyCost(row, settings.kwh)
                        const durUnit = row.durationUnit || 'min'
                        return (
                          <div key={row.id || idx} className="item-card">
                            <div className="item-card__row item-card__row--nrj">
                              <div className="ing-card__field ing-card__field--grow">
                                <label className="ing-card__lab">Appareil</label>
                                <input
                                  className="inp"
                                  placeholder="Four, batteur…"
                                  value={row.name || ''}
                                  onChange={(e) =>
                                    updateList('energy', (list) =>
                                      list.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)),
                                    )
                                  }
                                />
                              </div>
                              <div className="ing-card__field">
                                <label className="ing-card__lab">Puissance</label>
                                <NumInput
                                  placeholder="2,5"
                                  suffix="kW"
                                  step="0.1"
                                  value={row.power ?? row.kw ?? ''}
                                  onChange={(e) =>
                                    updateList('energy', (list) =>
                                      list.map((r, i) =>
                                        i === idx ? { ...r, power: e.target.value, kw: e.target.value } : r,
                                      ),
                                    )
                                  }
                                />
                              </div>
                              <div className="ing-card__field">
                                <label className="ing-card__lab">Durée</label>
                                <NumInput
                                  placeholder="45"
                                  suffix={durUnit}
                                  value={row.duration ?? row.minutes ?? ''}
                                  onChange={(e) =>
                                    updateList('energy', (list) =>
                                      list.map((r, i) =>
                                        i === idx
                                          ? {
                                              ...r,
                                              duration: e.target.value,
                                              minutes: row.durationUnit ? undefined : e.target.value,
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                />
                              </div>
                              <div className="ing-card__field">
                                <label className="ing-card__lab">Unité temps</label>
                                <UnitPicker
                                  value={durUnit}
                                  options={['min', 'h']}
                                  onChange={(du) =>
                                    updateList('energy', (list) =>
                                      list.map((r, i) => (i === idx ? { ...r, durationUnit: du } : r)),
                                    )
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                className="ing-card__rm"
                                onClick={() => updateList('energy', (list) => list.filter((_, i) => i !== idx))}
                              >
                                <IconRemove />
                              </button>
                            </div>
                            <div className="ing-card__foot">
                              <span className="ing-card__foot-lbl">
                                Coût électricité · {settings.kwh.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} €/kWh
                              </span>
                              <span className="ing-card__foot-val">{eur(cost)}</span>
                            </div>
                          </div>
                        )
                      })}
                      <button
                        type="button"
                        className="add-line"
                        onClick={() =>
                          updateList('energy', (list) => [
                            ...list,
                            { id: uid(), name: '', power: '', duration: '', durationUnit: 'min' },
                          ])
                        }
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Ajouter un appareil
                      </button>
                      <div className="subtotal">
                        <span className="l">
                          Sous-total énergie · tarif{' '}
                          <b>{settings.kwh.toLocaleString('fr-FR', { maximumFractionDigits: 4 })}</b> €/kWh
                        </span>
                        <span className="v">{eur(result.energy)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">Temps de travail</div>
                        <div className="ds">À vous de choisir si vous facturez vos heures</div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <div className="toggle-row" style={{ marginBottom: 16 }}>
                        <button
                          type="button"
                          className={`sw${countHours ? ' on' : ''}`}
                          aria-pressed={countHours}
                          onClick={() => patchDraft({ countHours: !countHours })}
                        />
                        <div className="tx">
                          <div className="h">Compter mes heures de travail</div>
                          <div className="s">
                            Certaines pâtissières intègrent leur temps, d'autres non. Votre choix change le
                            prix conseillé.
                          </div>
                        </div>
                      </div>
                      <div className={`labor-fields${countHours ? '' : ' dim'}`}>
                        <div className="row3">
                          <div className="field">
                            <label>Heures</label>
                            <input
                              className="inp"
                              type="number"
                              min="0"
                              value={draft.hours}
                              onChange={(e) => patchDraft({ hours: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Minutes</label>
                            <input
                              className="inp"
                              type="number"
                              min="0"
                              max="59"
                              value={draft.minutes}
                              onChange={(e) => patchDraft({ minutes: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Tarif horaire</label>
                            <div className="with-suffix">
                              <input
                                className="inp"
                                type="number"
                                min="0"
                                value={draft.hourlyRate}
                                onChange={(e) => patchDraft({ hourlyRate: e.target.value })}
                              />
                              <span className="sfx">€/h</span>
                            </div>
                          </div>
                        </div>
                        <div className="subtotal">
                          <span className="l">Valeur de votre travail</span>
                          <span className="v">{eur(result.labor)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M20 12V8H6a2 2 0 010-4h12v4M4 6v12a2 2 0 002 2h14v-4" />
                          <circle cx="16" cy="14" r="1.5" />
                        </svg>
                      </div>
                      <div>
                        <div className="tt">Votre prix de vente</div>
                        <div className="ds">Entrez le prix prévu pour comparer au conseillé</div>
                      </div>
                      <div className="opt">facultatif</div>
                    </div>
                    <div className="panel-body">
                      <div className="field">
                        <label>Prix de vente prévu</label>
                        <MoneyInput
                          placeholder="48,00"
                          value={draft.currentPrice || ''}
                          onChange={(e) => patchDraft({ currentPrice: e.target.value })}
                        />
                      </div>
                      <button
                        type="button"
                        className={`collapse-head${advOpen ? ' open' : ''}`}
                        onClick={() => setAdvOpen((o) => !o)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                        Options avancées — charges fixes & marge cible
                      </button>
                      <div className={`collapse-body${advOpen ? ' open' : ''}`}>
                        <div className="row2">
                          <div className="field">
                            <label>Charges fixes / création</label>
                            <MoneyInput
                              placeholder="0,00"
                              value={draft.fixed || ''}
                              onChange={(e) => patchDraft({ fixed: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Marge cible</label>
                            <div className="with-suffix">
                              <input
                                className="inp"
                                type="number"
                                min="0"
                                max="95"
                                value={draft.margin ?? settings.margin}
                                onChange={(e) => patchDraft({ margin: e.target.value })}
                              />
                              <span className="sfx">%</span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--taupe-light)',
                            lineHeight: 1.5,
                            marginTop: 4,
                          }}
                        >
                          Les charges fixes (loyer, abonnements, assurance…) ramenées à une création. La marge
                          cible définit votre prix conseillé.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="result-col">
                  <div className="verdict">
                    <div className="vtop">
                      <span className={`status-pill ${S.cls}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {S.icon}
                        </svg>
                        {S.label}
                      </span>
                    </div>
                    <div className="gauge-wrap">
                      <div className="gauge">
                        <svg viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="var(--almond)"
                            strokeWidth="9"
                            opacity="0.5"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke={S.color}
                            strokeWidth="9"
                            strokeLinecap="round"
                            strokeDasharray={gaugeDash}
                            strokeDashoffset={gaugeDash * (1 - gaugeProg)}
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div className="pct">
                          <div className="n">{result.marginRate != null ? pct(result.marginRate) : '—'}</div>
                          <div className="u">Marge</div>
                        </div>
                      </div>
                      <div className="msg">
                        <div className="big">{S.big}</div>
                        <div className="sm">{S.sm}</div>
                      </div>
                    </div>
                  </div>

                  <div className="kpi-grid">
                    <div className="kpi feature">
                      <div className="lab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M20 12V8H6a2 2 0 010-4h12v4M4 6v12a2 2 0 002 2h14v-4" />
                        </svg>
                        Prix conseillé
                      </div>
                      <div className="val">{eur(result.suggested)}</div>
                      <div className="hint">
                        {countHours ? 'heures de travail incluses' : 'hors heures de travail'} · marge{' '}
                        {pct(marginPct)}
                      </div>
                    </div>
                    <div className="kpi">
                      <div className="lab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M9 7h6M9 11h6M9 15h4" />
                          <rect x="4" y="3" width="16" height="18" rx="2" />
                        </svg>
                        Coût de revient
                      </div>
                      <div className="val">{eur(result.cost)}</div>
                      <div className="hint">{eur(result.costPerPart)} / part</div>
                    </div>
                    <div className="kpi">
                      <div className="lab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 2v20M5 9h9a3 3 0 010 6H7" />
                        </svg>
                        Bénéfice estimé
                      </div>
                      <div
                        className="val"
                        style={{
                          color:
                            result.marginEur != null
                              ? result.marginEur >= 0
                                ? 'var(--sage-deep)'
                                : 'var(--terra-deep)'
                              : 'var(--cocoa)',
                        }}
                      >
                        {result.marginEur != null ? eur(result.marginEur) : '—'}
                      </div>
                      <div className="hint">{result.price > 0 ? 'sur le prix prévu' : 'entrez un prix'}</div>
                    </div>
                  </div>

                  <div className="price-duo">
                    <div className={`price-card${countHours ? ' hl' : ''}`}>
                      {countHours && <span className="tag">actif</span>}
                      <div className="pc-lab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        Avec heures
                      </div>
                      <div className="pc-val">{eur(result.priceFull)}</div>
                      <div className="pc-sub">votre travail valorisé</div>
                    </div>
                    <div className={`price-card${!countHours ? ' hl' : ''}`}>
                      {!countHours && <span className="tag">actif</span>}
                      <div className="pc-lab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Sans heures
                      </div>
                      <div className="pc-val">{eur(result.priceNoHours)}</div>
                      <div className="pc-sub">matières & frais seuls</div>
                    </div>
                  </div>

                  <div className="breakdown">
                    <div className="bd-head">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M9 17V9M15 17v-4M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                      </svg>
                      Détail du coût de revient
                    </div>
                    <div className="bd-row">
                      <div className="bl">
                        <span className="swatch" style={{ background: 'var(--champagne)' }} />
                        Ingrédients & matières
                      </div>
                      <div className="bv">{eur(result.ing)}</div>
                    </div>
                    {result.pack > 0 && (
                      <div className="bd-row">
                        <div className="bl">
                          <span className="swatch" style={{ background: 'var(--sage)' }} />
                          Emballage
                        </div>
                        <div className="bv">{eur(result.pack)}</div>
                      </div>
                    )}
                    {result.energy > 0 && (
                      <div className="bd-row">
                        <div className="bl">
                          <span className="swatch" style={{ background: 'var(--honey)' }} />
                          Énergie électrique
                        </div>
                        <div className="bv">{eur(result.energy)}</div>
                      </div>
                    )}
                    {countHours && result.labor > 0 && (
                      <div className="bd-row">
                        <div className="bl">
                          <span className="swatch" style={{ background: 'var(--terra)' }} />
                          Temps de travail
                        </div>
                        <div className="bv">{eur(result.labor)}</div>
                      </div>
                    )}
                    {result.fixed > 0 && (
                      <div className="bd-row">
                        <div className="bl">
                          <span className="swatch" style={{ background: 'var(--taupe-light)' }} />
                          Charges fixes
                        </div>
                        <div className="bv">{eur(result.fixed)}</div>
                      </div>
                    )}
                    <div className="bd-bar">
                      {bdParts.map(([color, val], i) => (
                        <i key={i} style={{ width: `${(val / bdTotal) * 100}%`, background: color }} />
                      ))}
                    </div>
                    <div className="bd-row grand">
                      <div className="bl">Coût total</div>
                      <div className="bv">{eur(result.cost)}</div>
                    </div>
                  </div>

                  <div className="reco">
                    <div className="rh">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2zM9 21h6M10 19h4" />
                      </svg>
                      Nos conseils
                    </div>
                    <ul>
                      {recos.length ? (
                        recos.map((text, i) => (
                          <li key={i}>
                            <span className="b" />
                            <span dangerouslySetInnerHTML={{ __html: text }} />
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="b" />
                          <span>Renseignez vos coûts pour recevoir des conseils personnalisés.</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="result-actions">
                    <button type="button" className="btn btn-ghost" onClick={copyResume}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 012-2h10" />
                      </svg>
                      Copier le résumé
                    </button>
                    <button type="button" className="btn btn-gold" onClick={() => window.print()}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-3a2 2 0 012-2h16a2 2 0 012 2v3a2 2 0 01-2 2h-2M6 14h12v7H6z" />
                      </svg>
                      Fiche PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* INGREDIENTS */}
            <section className={`view${view === 'ingredients' ? ' active' : ''}`}>
              <div className="toolbar">
                <div className="search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4-4" />
                  </svg>
                  <input
                    placeholder="Rechercher un ingrédient…"
                    value={ingQuery}
                    onChange={(e) => setIngQuery(e.target.value)}
                  />
                </div>
                <div className="chips">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`chip${ingFilter === c ? ' on' : ''}`}
                      onClick={() => setIngFilter(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tablecard">
                {!filteredLibrary.length ? (
                  <EmptyState
                    title="Aucun ingrédient"
                    subtitle="Ajoutez vos produits pour les réutiliser dans chaque calcul."
                  />
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Ingrédient</th>
                        <th>Catégorie</th>
                        <th>Conditionnement</th>
                        <th>Prix pack</th>
                        <th>Prix unitaire</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLibrary.map((item) => {
                        const base = toBase(item.packQty, item.packUnit)
                        const per = base > 0 ? item.packPrice / base : 0
                        const unitTxt =
                          item.packUnit === 'u'
                            ? '/ pièce'
                            : ['g', 'kg', 'mg'].includes(item.packUnit)
                              ? '/ g'
                              : '/ ml'
                        return (
                          <tr key={item.id}>
                            <td className="td-name">{item.name}</td>
                            <td>
                              <span className="cat-tag">{item.cat || 'Autre'}</span>
                            </td>
                            <td>
                              {item.packQty} {unitLabel(item.packUnit)}
                            </td>
                            <td className="td-mono">{eur(item.packPrice)}</td>
                            <td className="td-mono">
                              {per < 0.01
                                ? `${(per * 100).toLocaleString('fr-FR', { maximumFractionDigits: 3 })} ¢`
                                : eur(per)}{' '}
                              <span style={{ fontSize: 10, color: 'var(--taupe-light)' }}>{unitTxt}</span>
                            </td>
                            <td>
                              <div className="tbl-act">
                                <button
                                  type="button"
                                  className="icon-btn edit"
                                  onClick={() => openIngEditor(item.id)}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="icon-btn danger"
                                  onClick={() => deleteLibraryItem(item.id)}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* CREATIONS */}
            <section className={`view${view === 'creations' ? ' active' : ''}`}>
              <div className="tablecard">
                {!creations.length ? (
                  <EmptyState
                    title="Aucune création enregistrée"
                    subtitle="Calculez un gâteau puis cliquez sur « Enregistrer » pour le retrouver ici."
                  />
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Création</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Coût</th>
                        <th>Prix conseillé</th>
                        <th>Marge</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {creations.map((c) => {
                        const st = ST_MAP[c.status || 'neutral']
                        return (
                          <tr key={c.id}>
                            <td className="td-name">{c.name}</td>
                            <td>
                              <span className="cat-tag">{c.type || '—'}</span>
                            </td>
                            <td style={{ color: 'var(--taupe)' }}>
                              {new Date(c.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="td-mono">{eur(c.cost)}</td>
                            <td className="td-mono">{eur(c.suggested)}</td>
                            <td>
                              <span className={`mini-status ${st[0]}`}>
                                {c.marginRate != null ? pct(c.marginRate * 100) : '—'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="icon-btn danger"
                                onClick={() => deleteCreation(c.id)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* DASHBOARD */}
            <section className={`view${view === 'dashboard' ? ' active' : ''}`}>
              {!creations.length ? (
                <EmptyState
                  title="Pas encore de données"
                  subtitle="Vos statistiques apparaîtront ici dès vos premières créations enregistrées."
                />
              ) : (
                <>
                  <div className="dash-grid">
                    <div className="stat">
                      <div className="si">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 2v20M5 9h9a3 3 0 010 6H7" />
                        </svg>
                      </div>
                      <div className="sl">CA potentiel</div>
                      <div className="sv">{eur(ca)}</div>
                      <div className="sd">si toutes vos créations se vendent</div>
                    </div>
                    <div className="stat">
                      <div className="si">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="sl">Marge moyenne</div>
                      <div className="sv">{pct(avgMargin * 100)}</div>
                      <div className="sd">
                        sur {withPrice.length} création{withPrice.length > 1 ? 's' : ''} avec prix
                      </div>
                    </div>
                    <div className="stat">
                      <div className="si">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M4 3h16v18l-8-4-8 4V3z" />
                        </svg>
                      </div>
                      <div className="sl">Créations</div>
                      <div className="sv">{creations.length}</div>
                      <div className="sd">{library.length} ingrédients en bibliothèque</div>
                    </div>
                  </div>
                  <div className="dash-grid two">
                    <div className="stat">
                      <div className="si" style={{ background: 'var(--sage-bg)', color: 'var(--sage-deep)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1L12 16.7 5.7 21l2.3-7.1-6-4.5h7.6z" />
                        </svg>
                      </div>
                      <div className="sl">Création la plus rentable</div>
                      <div className="sv" style={{ fontSize: 23 }}>
                        {best?.name || '—'}
                      </div>
                      <div className="sd">
                        {best?.marginRate != null
                          ? `marge de ${pct(best.marginRate * 100)}`
                          : '—'}{' '}
                        · {eur(best?.suggested)} conseillé
                      </div>
                    </div>
                    <div className="stat">
                      <div
                        className="si"
                        style={{
                          background: risky.length ? 'var(--terra-bg)' : 'var(--sage-bg)',
                          color: risky.length ? 'var(--terra-deep)' : 'var(--sage-deep)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                      </div>
                      <div className="sl">Alertes prix</div>
                      <div className="sv" style={{ fontSize: 23 }}>
                        {risky.length ? `${risky.length} à revoir` : 'Tout est sain'}
                      </div>
                      <div className="sd">
                        {risky.length
                          ? risky
                              .map((c) => c.name)
                              .slice(0, 3)
                              .join(', ')
                          : 'aucune création vendue à perte'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* SETTINGS */}
            <section className={`view${view === 'settings' ? ' active' : ''}`}>
              <div className="settings-grid">
                <div className="set-card">
                  <h3>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
                    </svg>
                    Tarif de l'électricité
                  </h3>
                  <p>
                    Pré-rempli au tarif réglementé moyen en France. Ajustez selon votre contrat (visible sur
                    votre facture).
                  </p>
                  <div className="field">
                    <label>Prix du kWh</label>
                    <div className="with-suffix">
                      <input
                        className="inp"
                        type="number"
                        step="0.0001"
                        value={settingsForm.kwh}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, kwh: e.target.value }))}
                      />
                      <span className="sfx">€/kWh</span>
                    </div>
                  </div>
                </div>
                <div className="set-card">
                  <h3>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    Tarif horaire par défaut
                  </h3>
                  <p>Appliqué automatiquement à chaque nouvelle création quand vous comptez vos heures.</p>
                  <div className="field">
                    <label>Votre taux horaire</label>
                    <div className="with-suffix">
                      <input
                        className="inp"
                        type="number"
                        value={settingsForm.hourlyRate}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, hourlyRate: e.target.value }))}
                      />
                      <span className="sfx">€/h</span>
                    </div>
                  </div>
                </div>
                <div className="set-card">
                  <h3>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 19L19 5M7 7h.01M17 17h.01" />
                      <circle cx="7" cy="7" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                    Marge cible
                  </h3>
                  <p>
                    L'objectif de rentabilité utilisé pour calculer votre prix conseillé. 40 % est confortable
                    en cake design.
                  </p>
                  <div className="field">
                    <label>Marge souhaitée</label>
                    <div className="with-suffix">
                      <input
                        className="inp"
                        type="number"
                        value={settingsForm.margin}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, margin: e.target.value }))}
                      />
                      <span className="sfx">%</span>
                    </div>
                  </div>
                </div>
                <div className="set-card">
                  <h3>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                    Profil & boutique
                  </h3>
                  <p>Le nom affiché dans l'application et sur vos fiches de prix.</p>
                  <div className="field">
                    <label>Nom de la boutique</label>
                    <input
                      className="inp"
                      value={settingsForm.shop}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, shop: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <button type="button" className="btn btn-primary" onClick={saveSettingsForm}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer mes réglages
                </button>
              </div>

              <div className="invoice-settings-cta">
                <div className="invoice-settings-cta__inner">
                  <div className="invoice-settings-cta__text">
                    <h4>Créer une facture</h4>
                    <p>
                      Facture simplifiée avec votre logo, vos coordonnées et celles du client. Imprimez ou
                      enregistrez en PDF en un clic.
                    </p>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => setView('invoice')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                    Créer facture
                  </button>
                </div>
              </div>
            </section>

            <section className={`view${view === 'invoice' ? ' active' : ''}`}>
              {view === 'invoice' && (
                <InvoiceBuilder
                  draft={draft}
                  onBack={() => setView('settings')}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      {ingEditor && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIngEditor(null)}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div className="title serif">
                {ingEditor.id ? "Modifier l'ingrédient" : 'Nouvel ingrédient'}
              </div>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Nom</label>
                <input
                  className="inp"
                  value={ingEditor.name}
                  onChange={(e) => setIngEditor((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Catégorie</label>
                <input
                  className="inp"
                  list="catDL"
                  value={ingEditor.cat}
                  onChange={(e) => setIngEditor((s) => ({ ...s, cat: e.target.value }))}
                />
                <datalist id="catDL">
                  {categories
                    .filter((c) => c !== 'Toutes')
                    .map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>
              </div>
              <div className="row3">
                <div className="field">
                  <label>Prix pack</label>
                  <input
                    className="inp"
                    type="number"
                    step="0.01"
                    value={ingEditor.packPrice}
                    onChange={(e) => setIngEditor((s) => ({ ...s, packPrice: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Contenance</label>
                  <input
                    className="inp"
                    type="number"
                    value={ingEditor.packQty}
                    onChange={(e) => setIngEditor((s) => ({ ...s, packQty: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Unité</label>
                  <UnitSelect
                    className="sel"
                    value={ingEditor.packUnit || 'g'}
                    onChange={(pu) => setIngEditor((s) => ({ ...s, packUnit: pu }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIngEditor(null)}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={saveIngEditor}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toastMsg ? ' show' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span>{toastMsg}</span>
      </div>
    </div>
  )
}
