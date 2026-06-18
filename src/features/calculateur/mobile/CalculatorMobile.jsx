import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCalculatorStore } from '../CalculatorContext'
import { compute } from '../engine/compute'
import { eur, eur0, pct, uid } from '../engine/format'
import { defaultUseUnit, energyCost, ingCost, unitFamily, VOL } from '../engine/units'
import InvoiceBuilder from '../invoice/InvoiceBuilder'
import '../invoice/invoice.css'
import './calculator-mobile.css'

const STEPS = [
  { t: 'La création', n: 'Étape 1' },
  { t: 'Les ingrédients', n: 'Étape 2' },
  { t: "L'emballage", n: 'Étape 3' },
  { t: "L'énergie", n: 'Étape 4' },
  { t: 'Temps & prix', n: 'Étape 5' },
  { t: 'Le résultat', n: 'Étape 6' },
]

const TABS = [
  { k: 'calc', l: 'Calculateur' },
  { k: 'ingredients', l: 'Ingrédients' },
  { k: 'creations', l: 'Créations' },
  { k: 'invoice', l: 'Facture' },
  { k: 'settings', l: 'Réglages' },
]

const HDR = {
  calc: 'Calculateur',
  ingredients: 'Ingrédients',
  creations: 'Créations',
  settings: 'Réglages',
  invoice: 'Facture',
}

const UNITS = ['g', 'kg', 'ml', 'cl', 'L', 'u']

const ENERGY_PRESETS = [
  ['Four', 2.5],
  ['Batteur', 0.3],
  ['Réfrigérateur', 0.15],
  ['Plaque', 2],
]

const STATUS = {
  exc: { t: 'Excellente rentabilité', c: 'exc' },
  mod: { t: 'Rentabilité correcte', c: 'mod' },
  low: { t: 'Marge à surveiller', c: 'low' },
  neutral: { t: 'En attente de prix', c: 'neutral' },
}

function marginPct(c) {
  if (c.marginRate == null) return null
  return c.marginRate <= 1 ? c.marginRate * 100 : c.marginRate
}

function levelColor(level) {
  if (level === 'exc') return 'var(--sage)'
  if (level === 'low') return 'var(--clay)'
  return 'var(--honey)'
}

function perUnitLabel(item) {
  const fam = unitFamily(item.packUnit)
  if (!fam) return `${eur(item.packPrice / item.packQty)} / u`
  const per = item.packPrice / (item.packQty * fam[item.packUnit])
  return (
    (per * 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) +
    (fam === VOL ? ' €/L' : ' €/kg')
  )
}

function unitsIncompatible(pu, uu, pq, uq) {
  if (!pq || !uq) return false
  if (pu === 'u' || uu === 'u') return pu !== uu
  const fp = unitFamily(pu)
  const fu = unitFamily(uu)
  return fp && fu && fp !== fu
}

function IconCalc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="5" y="2" width="14" height="20" rx="3" strokeWidth="1.6" />
      <path d="M8 6h8M8 10h2M8 14h2M8 18h2M14 10h2v8h-2z" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconJar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M7 3h10M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zM6 7l1-3M18 7l-1-3"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 3v6h6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.5 9a9 9 0 1 1-.3 6" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 8v4l3 2" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" strokeWidth="1.6" />
      <path
        d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 7a3 3 0 0 1 6 0" strokeWidth="1.6" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 8l9 5 9-5M12 13v8" strokeWidth="1.6" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconArrowR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrowL() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M19 12H5M11 6l-6 6 6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 6 9 17l-5-5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconExcellent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.5 6 19.9l1.5-6.5-5-4.3L9 8.6 12 2z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconModerate() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3v18M3 8l9-5 9 5M5 8v9h14V8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 9v4M12 17h.01M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEuro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M16 6a7 7 0 1 0 0 12M4 10h9M4 14h7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconPct() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M19 5 5 19" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.5" cy="7.5" r="2.2" strokeWidth="1.6" />
      <circle cx="16.5" cy="16.5" r="2.2" strokeWidth="1.6" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M4 9h16l-1-5H5L4 9zM4 9v11h16V9M9 20v-6h6v6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconInvoice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TAB_ICONS = {
  calc: IconCalc,
  ingredients: IconJar,
  creations: IconHistory,
  invoice: IconInvoice,
  settings: IconGear,
}

const LEVEL_ICONS = {
  exc: IconExcellent,
  mod: IconModerate,
  low: IconLow,
  neutral: IconModerate,
}

function UnitPicker({ value, onChange }) {
  return (
    <div className="seg-unit">
      {UNITS.map((u) => (
        <button key={u} type="button" className={u === value ? 'on' : ''} onClick={() => onChange(u)}>
          {u}
        </button>
      ))}
    </div>
  )
}

export default function CalculatorMobile() {
  const { settings, setSettings, library, setLibrary, creations, setCreations, toast, toastMsg, newDraft } =
    useCalculatorStore()

  const [screen, setScreen] = useState('calc')
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(() => newDraft())
  const mainRef = useRef(null)
  const gaugeRef = useRef(null)

  const [ingForm, setIngForm] = useState({
    name: '',
    packQty: '',
    packPrice: '',
    useQty: '',
    packUnit: 'g',
    useUnit: 'g',
    acOpen: false,
  })

  const [pkForm, setPkForm] = useState({ name: '', unitPrice: '', qty: '1' })
  const [enForm, setEnForm] = useState({ name: '', power: '', minutes: '' })
  const [libForm, setLibForm] = useState({ name: '', packQty: '', packPrice: '', packUnit: 'g' })

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

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [screen, step])

  useEffect(() => {
    if (step !== 5) return
    const t = setTimeout(() => {
      if (gaugeRef.current) {
        const w = Math.max(0.02, Math.min(1, (result.marginRate || 0) / 60))
        gaugeRef.current.style.transform = `scaleX(${w})`
      }
    }, 60)
    return () => clearTimeout(t)
  }, [step, result.marginRate])

  const acHits = useMemo(() => {
    const q = ingForm.name.trim().toLowerCase()
    if (!q) return []
    return library.filter((x) => x.name.toLowerCase().includes(q)).slice(0, 5)
  }, [ingForm.name, library])

  const ingPreview = useMemo(() => {
    const { packQty, packPrice, useQty, packUnit, useUnit } = ingForm
    if (unitsIncompatible(packUnit, useUnit, packQty, useQty)) return { warn: true }
    const c = ingCost(packQty, packUnit, packPrice, useQty, useUnit)
    return { cost: c }
  }, [ingForm])

  const pkPreview = (+pkForm.unitPrice || 0) * (+pkForm.qty || 0)
  const enPreview = energyCost(enForm.power, enForm.minutes, settings.kwh)

  const go = (nextScreen) => setScreen(nextScreen)

  const next = () => {
    if (step === 0 && !draft.name?.trim()) {
      toast('Donnez un nom à votre création')
      return
    }
    setStep((s) => Math.min(5, s + 1))
  }

  const pickLibraryIng = (item) => {
    setIngForm({
      name: item.name,
      packQty: String(item.packQty),
      packPrice: String(item.packPrice),
      useQty: '',
      packUnit: item.packUnit,
      useUnit: defaultUseUnit(item.packUnit),
      acOpen: false,
    })
  }

  const addIngredient = () => {
    const { name, packQty, packPrice, useQty, packUnit, useUnit } = ingForm
    if (!name.trim()) {
      toast("Nom de l'ingrédient manquant")
      return
    }
    const c = ingCost(packQty, packUnit, packPrice, useQty, useUnit)
    if (c == null) {
      toast('Vérifiez les quantités et le prix')
      return
    }
    updateList('ingredients', (list) => [
      ...list,
      {
        id: uid(),
        name: name.trim(),
        packQty: +packQty,
        packUnit,
        packPrice: +packPrice,
        useQty: +useQty,
        useUnit,
      },
    ])
    if (!library.some((x) => x.name.toLowerCase() === name.trim().toLowerCase())) {
      setLibrary((prev) => [
        { id: uid(), name: name.trim(), packQty: +packQty, packUnit, packPrice: +packPrice, cat: 'Autre' },
        ...prev,
      ])
    }
    setIngForm({ name: '', packQty: '', packPrice: '', useQty: '', packUnit: 'g', useUnit: 'g', acOpen: false })
    toast('Ingrédient ajouté')
  }

  const addPackaging = () => {
    if (!pkForm.name.trim()) {
      toast("Nom de l'emballage manquant")
      return
    }
    if (!pkForm.unitPrice) {
      toast('Indiquez le prix')
      return
    }
    updateList('packaging', (list) => [
      ...list,
      {
        id: uid(),
        name: pkForm.name.trim(),
        unitPrice: +pkForm.unitPrice,
        qty: +pkForm.qty || 1,
      },
    ])
    setPkForm({ name: '', unitPrice: '', qty: '1' })
    toast('Emballage ajouté')
  }

  const addEnergy = () => {
    if (!enForm.name.trim()) {
      toast("Nom de l'appareil manquant")
      return
    }
    if (!enForm.power || !enForm.minutes) {
      toast('Puissance et durée requises')
      return
    }
    updateList('energy', (list) => [
      ...list,
      { id: uid(), name: enForm.name.trim(), power: +enForm.power, minutes: +enForm.minutes },
    ])
    setEnForm({ name: '', power: '', minutes: '' })
    toast('Appareil ajouté')
  }

  const saveCreation = () => {
    if (!draft.name?.trim()) {
      toast('Nommez votre création')
      return
    }
    const r = compute(draft, settings)
    const name = draft.name.trim()
    const record = {
      id: draft.id,
      name,
      type: draft.type,
      date: Date.now(),
      cost: r.cost,
      costFull: r.costFull,
      suggested: r.suggested,
      priceFull: r.priceFull,
      price: draft.currentPrice || 0,
      marginRate: r.marginDecimal ?? (r.marginRate != null ? r.marginRate / 100 : null),
      marginEur: r.marginEur,
      level: r.level,
      status: r.level,
      servings: r.servings,
      countHours: draft.countHours !== false,
      draft: { ...draft, name },
    }
    setCreations((prev) => {
      const i = prev.findIndex((c) => c.id === draft.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = record
        return next
      }
      return [record, ...prev]
    })
    toast('Création enregistrée ✦')
    setScreen('creations')
  }

  const newCalc = () => {
    setDraft(newDraft())
    setStep(0)
    toast('Nouveau calcul prêt')
  }

  const loadCreation = (id) => {
    const c = creations.find((x) => x.id === id)
    if (!c?.draft) return
    setDraft({ ...c.draft })
    setScreen('calc')
    setStep(5)
  }

  const deleteCreation = (id) => {
    setCreations((prev) => prev.filter((x) => x.id !== id))
    toast('Création supprimée')
  }

  const addLibItem = () => {
    const { name, packQty, packPrice, packUnit } = libForm
    if (!name.trim()) {
      toast('Nom manquant')
      return
    }
    if (!packQty || !packPrice) {
      toast('Quantité et prix requis')
      return
    }
    setLibrary((prev) => [
      { id: uid(), name: name.trim(), packQty: +packQty, packUnit, packPrice: +packPrice, cat: 'Autre' },
      ...prev,
    ])
    setLibForm({ name: '', packQty: '', packPrice: '', packUnit: 'g' })
    toast('Ajouté ✦')
  }

  const editLibPrice = (id) => {
    const item = library.find((i) => i.id === id)
    if (!item) return
    const v = prompt(`Nouveau prix payé pour ${item.name} (€) :`, item.packPrice)
    if (v == null) return
    const n = +String(v).replace(',', '.')
    if (!Number.isNaN(n) && n > 0) {
      setLibrary((prev) => prev.map((x) => (x.id === id ? { ...x, packPrice: n } : x)))
      toast('Prix mis à jour')
    }
  }

  const deleteLibItem = (id) => {
    setLibrary((prev) => prev.filter((x) => x.id !== id))
    toast('Supprimé')
  }

  const patchSetting = (key, value, numeric = true) => {
    setSettings({ [key]: numeric ? (value === '' ? 0 : +String(value).replace(',', '.')) : value })
  }

  const NavRow = () => {
    if (step === 0) {
      return (
        <div className="nav-actions">
          <button type="button" className="btn btn-primary" onClick={next}>
            Continuer <IconArrowR />
          </button>
        </div>
      )
    }
    if (step === 5) {
      return (
        <>
          <div className="nav-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(4)}>
              <IconArrowL /> Retour
            </button>
            <button type="button" className="btn btn-gold" onClick={saveCreation}>
              <IconCheck /> Enregistrer
            </button>
          </div>
          <button type="button" className="fab" style={{ marginTop: 12 }} onClick={newCalc}>
            <IconPlus /> Nouvelle création
          </button>
        </>
      )
    }
    return (
      <div className="nav-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
          <IconArrowL /> Retour
        </button>
        <button type="button" className="btn btn-primary" onClick={next}>
          {step === 4 ? 'Voir le résultat' : 'Continuer'} <IconArrowR />
        </button>
      </div>
    )
  }

  const StepProduct = () => (
    <>
      <div className="card">
        <div className="field">
          <label className="lbl">Nom de la création</label>
          <input
            className="inp big"
            placeholder="Layer cake vanille fraise"
            value={draft.name}
            onChange={(e) => patchDraft({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="lbl">Nombre de parts</label>
          <div className="inp-icon">
            <input
              className="inp"
              type="number"
              inputMode="numeric"
              placeholder="8"
              value={draft.servings || ''}
              onChange={(e) => patchDraft({ servings: +e.target.value || 1 })}
            />
            <span className="unit">parts</span>
          </div>
        </div>
      </div>
      <div className="hint">
        <IconSpark />
        <span>
          On va calculer le coût réel de cette création, puis le prix idéal pour bien gagner votre vie.
        </span>
      </div>
      <NavRow />
    </>
  )

  const StepIngredients = () => {
    const total = (draft.ingredients || []).reduce(
      (s, x) => s + (ingCost(x.packQty, x.packUnit, x.packPrice, x.useQty, x.useUnit) || 0),
      0,
    )
    return (
      <>
        <div className="card">
          <div className="field ac-wrap">
            <label className="lbl">Ingrédient</label>
            <input
              className="inp"
              placeholder="Mascarpone, beurre, farine…"
              autoComplete="off"
              value={ingForm.name}
              onChange={(e) => setIngForm((f) => ({ ...f, name: e.target.value, acOpen: true }))}
              onFocus={() => setIngForm((f) => ({ ...f, acOpen: true }))}
              onBlur={() => setTimeout(() => setIngForm((f) => ({ ...f, acOpen: false })), 150)}
            />
            {ingForm.acOpen && acHits.length > 0 && (
              <div className="ac-list">
                {acHits.map((h) => (
                  <button key={h.id} type="button" className="ac-item" onMouseDown={() => pickLibraryIng(h)}>
                    <span className="nm">{h.name}</span>
                    <span className="pr">
                      {eur(h.packPrice)} / {h.packQty}
                      {h.packUnit}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="lbl">
            Conditionnement acheté <span className="opt">— ce que vous payez en magasin</span>
          </label>
          <div className="row-amt mb12">
            <input
              className="inp"
              type="number"
              inputMode="decimal"
              placeholder="500"
              value={ingForm.packQty}
              onChange={(e) => setIngForm((f) => ({ ...f, packQty: e.target.value }))}
            />
            <UnitPicker
              value={ingForm.packUnit}
              onChange={(u) => setIngForm((f) => ({ ...f, packUnit: u, useUnit: defaultUseUnit(u) }))}
            />
          </div>
          <div className="field">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                inputMode="decimal"
                placeholder="2,99"
                value={ingForm.packPrice}
                onChange={(e) => setIngForm((f) => ({ ...f, packPrice: e.target.value }))}
              />
              <span className="unit">€</span>
            </div>
          </div>
          <label className="lbl">
            Quantité utilisée <span className="opt">— dans cette recette</span>
          </label>
          <div className="row-amt">
            <input
              className="inp"
              type="number"
              inputMode="decimal"
              placeholder="350"
              value={ingForm.useQty}
              onChange={(e) => setIngForm((f) => ({ ...f, useQty: e.target.value }))}
            />
            <UnitPicker value={ingForm.useUnit} onChange={(u) => setIngForm((f) => ({ ...f, useUnit: u }))} />
          </div>
          <div className={`cost-prev${ingPreview.warn ? ' warn' : ''}`}>
            {ingPreview.warn ? (
              <>
                <span className="t">
                  Unités incompatibles ({ingForm.packUnit} ≠ {ingForm.useUnit})
                </span>
                <span className="v">⚠</span>
              </>
            ) : (
              <>
                <span className="t">Coût dans la recette</span>
                <span className="v">{ingPreview.cost == null ? '—' : eur(ingPreview.cost)}</span>
              </>
            )}
          </div>
          <button type="button" className="fab" style={{ marginTop: 14 }} onClick={addIngredient}>
            <IconPlus /> Ajouter cet ingrédient
          </button>
        </div>
        {draft.ingredients?.length > 0 && (
          <>
            <div className="list">
              {draft.ingredients.map((x) => {
                const c = ingCost(x.packQty, x.packUnit, x.packPrice, x.useQty, x.useUnit)
                return (
                  <div key={x.id} className="row-item">
                    <div className="ic">
                      <IconBag />
                    </div>
                    <div className="meta">
                      <div className="nm">{x.name}</div>
                      <div className="ds">
                        {x.useQty}
                        {x.useUnit} · acheté {x.packQty}
                        {x.packUnit} à {eur(x.packPrice)}
                      </div>
                    </div>
                    <div className="amt">{eur(c)}</div>
                    <button
                      type="button"
                      className="del"
                      onClick={() => updateList('ingredients', (list) => list.filter((r) => r.id !== x.id))}
                    >
                      <IconTrash />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="subtotal">
              <span className="t">Total ingrédients</span>
              <span className="v">{eur(total)}</span>
            </div>
          </>
        )}
        <NavRow />
      </>
    )
  }

  const StepPackaging = () => {
    const total = (draft.packaging || []).reduce((s, x) => s + (+x.unitPrice || 0) * (+x.qty || 0), 0)
    return (
      <>
        <div className="card">
          <div className="field">
            <label className="lbl">Type d&apos;emballage</label>
            <input
              className="inp"
              placeholder="Boîte à gâteau, sac kraft, ruban…"
              autoComplete="off"
              value={pkForm.name}
              onChange={(e) => setPkForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="row2">
            <div className="field">
              <label className="lbl">Prix unitaire</label>
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="decimal"
                  placeholder="0,80"
                  value={pkForm.unitPrice}
                  onChange={(e) => setPkForm((f) => ({ ...f, unitPrice: e.target.value }))}
                />
                <span className="unit">€</span>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Quantité</label>
              <input
                className="inp"
                type="number"
                inputMode="numeric"
                placeholder="1"
                value={pkForm.qty}
                onChange={(e) => setPkForm((f) => ({ ...f, qty: e.target.value }))}
              />
            </div>
          </div>
          <div className="cost-prev">
            <span className="t">Coût emballage</span>
            <span className="v">{pkForm.unitPrice && pkForm.qty ? eur(pkPreview) : '—'}</span>
          </div>
          <button type="button" className="fab" style={{ marginTop: 14 }} onClick={addPackaging}>
            <IconPlus /> Ajouter
          </button>
        </div>
        {draft.packaging?.length > 0 ? (
          <>
            <div className="list">
              {draft.packaging.map((x) => (
                <div key={x.id} className="row-item">
                  <div className="ic">
                    <IconBox />
                  </div>
                  <div className="meta">
                    <div className="nm">{x.name}</div>
                    <div className="ds">
                      {x.qty} × {eur(x.unitPrice)}
                    </div>
                  </div>
                  <div className="amt">{eur(x.unitPrice * x.qty)}</div>
                  <button
                    type="button"
                    className="del"
                    onClick={() => updateList('packaging', (list) => list.filter((r) => r.id !== x.id))}
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="subtotal">
              <span className="t">Total emballage</span>
              <span className="v">{eur(total)}</span>
            </div>
          </>
        ) : (
          <div className="hint">
            <IconSpark />
            <span>
              Boîtes, sacs kraft, rubans, étiquettes, support carton… tout ce qui emballe le gâteau. Optionnel.
            </span>
          </div>
        )}
        <NavRow />
      </>
    )
  }

  const StepEnergy = () => {
    const total = (draft.energy || []).reduce((s, x) => s + energyCost(x.power, x.minutes, settings.kwh), 0)
    return (
      <>
        <div className="card">
          <div className="field">
            <label className="lbl">Appareil</label>
            <input
              className="inp"
              placeholder="Four, batteur…"
              autoComplete="off"
              value={enForm.name}
              onChange={(e) => setEnForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div className="preset-row">
              {ENERGY_PRESETS.map(([name, pw]) => (
                <button
                  key={name}
                  type="button"
                  className="btn btn-sm btn-soft"
                  onClick={() => setEnForm((f) => ({ ...f, name, power: String(pw) }))}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label className="lbl">Puissance</label>
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="decimal"
                  placeholder="2.5"
                  value={enForm.power}
                  onChange={(e) => setEnForm((f) => ({ ...f, power: e.target.value }))}
                />
                <span className="unit">kW</span>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Durée</label>
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="numeric"
                  placeholder="45"
                  value={enForm.minutes}
                  onChange={(e) => setEnForm((f) => ({ ...f, minutes: e.target.value }))}
                />
                <span className="unit">min</span>
              </div>
            </div>
          </div>
          <div className="cost-prev">
            <span className="t">Coût électricité</span>
            <span className="v">{enForm.power && enForm.minutes ? eur(enPreview) : '—'}</span>
          </div>
          <div className="hint" style={{ marginTop: 12 }}>
            <IconBolt />
            <span>
              Tarif appliqué :{' '}
              <b>
                {settings.kwh.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} €/kWh
              </b>{' '}
              (modifiable dans Réglages).
            </span>
          </div>
          <button type="button" className="fab" style={{ marginTop: 14 }} onClick={addEnergy}>
            <IconPlus /> Ajouter
          </button>
        </div>
        {draft.energy?.length > 0 && (
          <>
            <div className="list">
              {draft.energy.map((x) => (
                <div key={x.id} className="row-item">
                  <div className="ic">
                    <IconBolt />
                  </div>
                  <div className="meta">
                    <div className="nm">{x.name}</div>
                    <div className="ds">
                      {x.power} kW · {x.minutes} min
                    </div>
                  </div>
                  <div className="amt">{eur(energyCost(x.power, x.minutes, settings.kwh))}</div>
                  <button
                    type="button"
                    className="del"
                    onClick={() => updateList('energy', (list) => list.filter((r) => r.id !== x.id))}
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="subtotal">
              <span className="t">Total électricité</span>
              <span className="v">{eur(total)}</span>
            </div>
          </>
        )}
        <NavRow />
      </>
    )
  }

  const StepPrice = () => {
    const countHours = draft.countHours !== false
    return (
      <>
        <div
          className="toggle-card"
          role="button"
          tabIndex={0}
          onClick={() => patchDraft({ countHours: !countHours })}
          onKeyDown={(e) => e.key === 'Enter' && patchDraft({ countHours: !countHours })}
        >
          <div className="tx">
            <div className="tt">Compter mon temps de travail</div>
            <div className="td">
              {countHours
                ? 'Activé — votre main d\'œuvre est facturée'
                : 'Désactivé — vous ne facturez pas vos heures'}
            </div>
          </div>
          <div className={`sw${countHours ? ' on' : ''}`}>
            <i />
          </div>
        </div>
        {countHours && (
          <div className="card mt16">
            <label className="lbl">Temps passé sur la création</label>
            <div className="row2 mb12">
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={draft.hours || ''}
                  onChange={(e) => patchDraft({ hours: e.target.value })}
                />
                <span className="unit">h</span>
              </div>
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={draft.minutes || ''}
                  onChange={(e) => patchDraft({ minutes: e.target.value })}
                />
                <span className="unit">min</span>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Votre tarif horaire</label>
              <div className="inp-icon">
                <input
                  className="inp"
                  type="number"
                  inputMode="decimal"
                  placeholder="25"
                  value={draft.hourlyRate || ''}
                  onChange={(e) => patchDraft({ hourlyRate: e.target.value })}
                />
                <span className="unit">€ / h</span>
              </div>
            </div>
          </div>
        )}
        <div className="card mt16">
          <div className="field">
            <label className="lbl">
              Votre prix de vente actuel <span className="opt">— ce que vous facturez aujourd&apos;hui</span>
            </label>
            <div className="inp-icon">
              <input
                className="inp big"
                type="number"
                inputMode="decimal"
                placeholder="0,00"
                value={draft.currentPrice || ''}
                onChange={(e) => patchDraft({ currentPrice: e.target.value })}
              />
              <span className="unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="lbl">Marge souhaitée</label>
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                inputMode="numeric"
                placeholder="40"
                value={draft.margin ?? settings.margin}
                onChange={(e) => patchDraft({ margin: e.target.value })}
              />
              <span className="unit">%</span>
            </div>
          </div>
        </div>
        <div className="hint">
          <IconSpark />
          <span>
            On vous montrera le prix conseillé <b>avec</b> et <b>sans</b> compter vos heures — à vous de choisir.
          </span>
        </div>
        <NavRow />
      </>
    )
  }

  const StepResult = () => {
    const r = result
    const d = draft
    const M = STATUS[r.level] || STATUS.neutral
    const LevelIcon = LEVEL_ICONS[r.level] || IconModerate

    let cats = [
      { n: 'Ingrédients', v: r.ing, c: 'var(--gold)' },
      { n: 'Emballage', v: r.pack, c: 'var(--ink)' },
      { n: 'Électricité', v: r.energy, c: 'var(--honey)' },
    ]
    if (d.countHours !== false) cats.push({ n: "Main d'œuvre", v: r.labor, c: 'var(--sage)' })
    cats = cats.filter((c) => c.v > 0)
    const maxc = Math.max(...cats.map((c) => c.v), 0.0001)

    let rt
    let rd
    if (r.price <= 0) {
      rt = 'Renseignez votre prix de vente'
      rd = `Pour bien gagner votre vie sur cette création, visez au moins ${eur(r.priceFull)} (marge de ${d.margin || settings.margin}%).`
    } else if (r.level === 'low') {
      rt = 'Votre prix couvre à peine votre travail'
      rd = `Passez à ${eur(r.priceFull)}, soit +${eur(Math.max(0, r.priceFull - r.price))}, pour une marge confortable — ou allégez certains coûts.`
    } else if (r.level === 'mod') {
      rt = 'Marge correcte, mais améliorable'
      rd = `En vendant à ${eur(r.priceFull)}, vous gagneriez ${eur(Math.max(0, r.priceFull - r.price))} de plus à chaque fois.`
    } else {
      rt = 'Très belle rentabilité'
      rd = `Votre prix valorise bien votre travail : ${eur(r.marginEur)} de bénéfice par création.`
    }

    return (
      <>
        <div className={`hero-result ${M.c}`}>
          <span className="hero-badge">
            <LevelIcon /> {M.t}
          </span>
          <div className="big-num">{r.price > 0 ? pct(r.marginRate) : '—'}</div>
          <div className="big-lbl">{d.name || 'Votre création'} · taux de marge</div>
          <div className="gauge">
            <i ref={gaugeRef} />
          </div>
          <div className="gauge-scale">
            <span>0%</span>
            <span>{settings.modLo}%</span>
            <span>{settings.excHi}%</span>
            <span>60%+</span>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi accent">
            <div className="k">Bénéfice estimé</div>
            <div className="v">{r.price > 0 ? eur(r.marginEur) : '—'}</div>
          </div>
          <div className="kpi">
            <div className="k">Coût de revient</div>
            <div className="v">{eur(r.costFull)}</div>
          </div>
          <div className="kpi">
            <div className="k">Coût par part</div>
            <div className="v">{eur(r.costPerPart)}</div>
          </div>
          <div className="kpi">
            <div className="k">Rentabilité</div>
            <div className="v">{r.price > 0 ? pct(r.roi) : '—'}</div>
          </div>
        </div>
        <div className="bd-title">Où part votre argent</div>
        <div className="card">
          {cats.length ? (
            cats.map((c) => (
              <div key={c.n} className="bd-row">
                <span className="dot" style={{ background: c.c }} />
                <span className="nm">{c.n}</span>
                <span className="bar">
                  <i style={{ background: c.c, width: `${(c.v / maxc) * 100}%` }} />
                </span>
                <span className="vl">{eur(c.v)}</span>
              </div>
            ))
          ) : (
            <div className="screen-sub">Aucun coût saisi pour l&apos;instant.</div>
          )}
          <div className="subtotal">
            <span className="t">Coût total{d.countHours === false ? ' · hors temps' : ''}</span>
            <span className="v">{eur(r.costFull)}</span>
          </div>
        </div>
        <div className="bd-title">Prix de vente conseillé</div>
        <div className="price-compare">
          <div className="pc with">
            <div className="pcl">Avec vos heures comptées</div>
            <div className="pcv">{eur(r.priceFull)}</div>
            <div className="pcd">{eur(r.suggestedPerPart)} / part</div>
          </div>
          <div className="pc without">
            <div className="pcl">Sans compter les heures</div>
            <div className="pcv">{eur(r.priceNoHours)}</div>
            <div className="pcd">{eur(r.priceNoHours / r.servings)} / part</div>
          </div>
        </div>
        <div className={`reco ${M.c}`}>
          <div className="ic">
            <LevelIcon />
          </div>
          <div className="tx">
            <div className="rt">{rt}</div>
            <div className="rd">{rd}</div>
          </div>
        </div>
        <NavRow />
      </>
    )
  }

  const renderCalc = () => {
    const st = STEPS[step]
    const stepBodies = [StepProduct, StepIngredients, StepPackaging, StepEnergy, StepPrice, StepResult]
    const Body = stepBodies[step]
    return (
      <>
        <h1 className="screen-title">{st.t}</h1>
        <div className="steps">
          {STEPS.map((_, i) => (
            <div key={i} className={`seg${i < step ? ' done' : ''}${i === step ? ' cur' : ''}`}>
              <i />
            </div>
          ))}
        </div>
        <div className="step-label">
          {st.n} <b>· sur 6</b>
        </div>
        <div className="screen-anim">
          <Body />
        </div>
      </>
    )
  }

  const renderLibrary = () => (
    <>
      <div className="card mb12">
        <div className="field">
          <label className="lbl">Nouvel ingrédient</label>
          <input
            className="inp"
            placeholder="Mascarpone Elle & Vire"
            autoComplete="off"
            value={libForm.name}
            onChange={(e) => setLibForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <label className="lbl">Conditionnement acheté</label>
        <div className="row-amt mb12">
          <input
            className="inp"
            type="number"
            inputMode="decimal"
            placeholder="500"
            value={libForm.packQty}
            onChange={(e) => setLibForm((f) => ({ ...f, packQty: e.target.value }))}
          />
          <UnitPicker
            value={libForm.packUnit}
            onChange={(u) => setLibForm((f) => ({ ...f, packUnit: u }))}
          />
        </div>
        <div className="field">
          <label className="lbl">Prix payé</label>
          <div className="inp-icon">
            <input
              className="inp"
              type="number"
              inputMode="decimal"
              placeholder="2,99"
              value={libForm.packPrice}
              onChange={(e) => setLibForm((f) => ({ ...f, packPrice: e.target.value }))}
            />
            <span className="unit">€</span>
          </div>
        </div>
        <button type="button" className="fab" style={{ marginTop: 4 }} onClick={addLibItem}>
          <IconPlus /> Ajouter à mon garde-manger
        </button>
      </div>
      {!library.length ? (
        <div className="empty">
          <div className="ic">
            <IconJar />
          </div>
          <h3>Garde-manger vide</h3>
          <p>
            Enregistrez vos ingrédients habituels une fois — ils seront proposés automatiquement, avec leur prix,
            dans chaque calcul.
          </p>
        </div>
      ) : (
        <div className="list">
          {library.map((x) => (
            <div key={x.id} className="row-item">
              <div className="ic">
                <IconBag />
              </div>
              <div className="meta">
                <div className="nm">{x.name}</div>
                <div className="ds">
                  {x.packQty}
                  {x.packUnit} à {eur(x.packPrice)} · {perUnitLabel(x)}
                </div>
              </div>
              <button type="button" className="btn btn-sm btn-soft" style={{ padding: '8px 13px', borderRadius: 10 }} onClick={() => editLibPrice(x.id)}>
                Prix
              </button>
              <button type="button" className="del" onClick={() => deleteLibItem(x.id)}>
                <IconTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )

  const renderCreations = () => {
    if (!creations.length) {
      return (
        <div className="empty">
          <div className="ic">
            <IconHistory />
          </div>
          <h3>Aucune création pour l&apos;instant</h3>
          <p>Calculez la rentabilité d&apos;un gâteau, enregistrez-le, et il apparaîtra ici avec sa marge.</p>
          <button type="button" className="btn btn-primary" style={{ maxWidth: 240, margin: '0 auto' }} onClick={() => go('calc')}>
            <IconPlus /> Nouveau calcul
          </button>
        </div>
      )
    }

    const avg =
      creations.reduce((s, c) => s + (marginPct(c) || 0), 0) / creations.length
    const ca = creations.reduce((s, c) => s + (c.price || 0), 0)
    const best = [...creations].sort((a, b) => (marginPct(b) || -9) - (marginPct(a) || -9))[0]
    const bm = { exc: 'bm-exc', mod: 'bm-mod', low: 'bm-low' }

    return (
      <>
        <div className="kpi-grid mb12">
          <div className="kpi accent">
            <div className="k">Marge moyenne</div>
            <div className="v">{pct(avg)}</div>
          </div>
          <div className="kpi">
            <div className="k">CA potentiel</div>
            <div className="v">{eur0(ca)}</div>
          </div>
        </div>
        {best && (
          <div className="reco exc" style={{ marginBottom: 18 }}>
            <div className="ic">
              <IconExcellent />
            </div>
            <div className="tx">
              <div className="rt">Plus rentable · {best.name}</div>
              <div className="rd">
                {pct(marginPct(best))} de marge, {eur(best.marginEur ?? (best.price - (best.costFull ?? best.cost)))}{' '}
                de bénéfice.
              </div>
            </div>
          </div>
        )}
        <div className="list">
          {creations.map((c) => {
            const level = c.level || c.status || 'mod'
            const LevelIcon = LEVEL_ICONS[level] || IconModerate
            return (
              <div key={c.id} className="saved-card row-tap" onClick={() => loadCreation(c.id)} role="button" tabIndex={0}>
                <div className={`badge-mini ${bm[level] || 'bm-mod'}`}>
                  <LevelIcon />
                </div>
                <div className="info">
                  <div className="nm">{c.name}</div>
                  <div className="ds">
                    {c.servings || '—'} parts · revient {eur(c.costFull ?? c.cost)} ·{' '}
                    {new Date(c.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="pr">
                  <div className="pv">{eur(c.price)}</div>
                  <div className="pm" style={{ color: levelColor(level) }}>
                    {pct(marginPct(c))} marge
                  </div>
                </div>
                <button
                  type="button"
                  className="del"
                  style={{ marginLeft: 6 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCreation(c.id)
                  }}
                >
                  <IconTrash />
                </button>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderSettings = () => (
    <>
      <div className="set-group">
        <div className="set-item">
          <div className="si">
            <IconBolt />
          </div>
          <div className="sl">
            <div className="st">Tarif électricité</div>
            <div className="sd">Prix du kWh (EDF moyen France)</div>
          </div>
          <div className="sv">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                value={settings.kwh}
                onChange={(e) => patchSetting('kwh', e.target.value)}
              />
              <span className="unit">€</span>
            </div>
          </div>
        </div>
        <div className="set-item">
          <div className="si">
            <IconEuro />
          </div>
          <div className="sl">
            <div className="st">Tarif horaire</div>
            <div className="sd">Votre main d&apos;œuvre par défaut</div>
          </div>
          <div className="sv">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                value={settings.hourlyRate}
                onChange={(e) => patchSetting('hourlyRate', e.target.value)}
              />
              <span className="unit">€</span>
            </div>
          </div>
        </div>
        <div className="set-item">
          <div className="si">
            <IconPct />
          </div>
          <div className="sl">
            <div className="st">Marge cible</div>
            <div className="sd">Objectif de rentabilité</div>
          </div>
          <div className="sv">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                value={settings.margin}
                onChange={(e) => patchSetting('margin', e.target.value)}
              />
              <span className="unit">%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bd-title">Seuils des alertes</div>
      <div className="set-group">
        <div className="set-item">
          <div className="si">
            <IconModerate />
          </div>
          <div className="sl">
            <div className="st">Seuil « correct »</div>
            <div className="sd">En dessous : marge faible</div>
          </div>
          <div className="sv">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                value={settings.modLo}
                onChange={(e) => patchSetting('modLo', e.target.value)}
              />
              <span className="unit">%</span>
            </div>
          </div>
        </div>
        <div className="set-item">
          <div className="si">
            <IconExcellent />
          </div>
          <div className="sl">
            <div className="st">Seuil « excellent »</div>
            <div className="sd">Au dessus : très rentable</div>
          </div>
          <div className="sv">
            <div className="inp-icon">
              <input
                className="inp"
                type="number"
                value={settings.excHi}
                onChange={(e) => patchSetting('excHi', e.target.value)}
              />
              <span className="unit">%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bd-title">Boutique</div>
      <div className="set-group">
        <div className="set-item">
          <div className="si">
            <IconStore />
          </div>
          <div className="sl">
            <div className="st">Nom de la boutique</div>
            <div className="sd">Affiché sur vos fiches</div>
          </div>
          <div className="sv" style={{ width: 150 }}>
            <input
              className="inp"
              value={settings.shop}
              onChange={(e) => patchSetting('shop', e.target.value, false)}
              style={{ textAlign: 'right', padding: '10px 12px', fontSize: 14 }}
            />
          </div>
        </div>
      </div>
      <div className="invoice-settings-cta" style={{ marginTop: 28, marginBottom: 8 }}>
        <div className="invoice-settings-cta__inner">
          <div className="invoice-settings-cta__text">
            <h4>Créer une facture</h4>
            <p>Facture client avec logo, TVA et export PDF.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => go('invoice')}>
            Créer facture
          </button>
        </div>
      </div>
      <div className="hint" style={{ marginTop: 8 }}>
        <IconSpark />
        <span>Vos données restent privées, sur cet appareil uniquement. Rien n&apos;est envoyé en ligne.</span>
      </div>
    </>
  )

  const screenTitles = {
    ingredients: (
      <>
        <h1 className="screen-title">Mes ingrédients</h1>
        <p className="screen-sub">Votre garde-manger, prêt à réutiliser</p>
      </>
    ),
    creations: (
      <>
        <h1 className="screen-title">Mes créations</h1>
        <p className="screen-sub">Vos calculs sauvegardés</p>
      </>
    ),
    settings: (
      <>
        <h1 className="screen-title">Réglages</h1>
        <p className="screen-sub">Vos tarifs et préférences</p>
      </>
    ),
    invoice: (
      <>
        <h1 className="screen-title">Créer une facture</h1>
        <p className="screen-sub">Facture simplifiée pour vos clients</p>
      </>
    ),
  }

  return (
    <div className="calc-m">
      <div className="device">
        <header className="app-header">
          <div className="hdr-row">
            <div className="brand">
              <span className="b1">Bel Âge</span>
              <span className="b2">Pâtisserie</span>
            </div>
            <div className="hdr-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
                <path d="M12 7v5l3 2" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>{HDR[screen]}</span>
            </div>
          </div>
          {screen !== 'calc' && <div id="hdrTitle">{screenTitles[screen]}</div>}
        </header>

        <main className={`app-main${screen === 'invoice' ? ' app-main--invoice' : ''}`} ref={mainRef}>
          {screen === 'calc' && renderCalc()}
          {screen === 'ingredients' && renderLibrary()}
          {screen === 'creations' && renderCreations()}
          {screen === 'settings' && renderSettings()}
          {screen === 'invoice' && (
            <InvoiceBuilder draft={draft} onBack={() => go('calc')} />
          )}
        </main>

        <nav className="tab-bar">
          {TABS.map((t) => {
            const TabIcon = TAB_ICONS[t.k]
            return (
              <button
                key={t.k}
                type="button"
                className={`tab${t.k === 'invoice' ? ' tab--invoice' : ''}${screen === t.k ? ' on' : ''}`}
                onClick={() => go(t.k)}
              >
                <TabIcon />
                <span>{t.l}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className={`toast${toastMsg ? ' show' : ''}`}>
        <IconCheck />
        <span>{toastMsg}</span>
      </div>
    </div>
  )
}
