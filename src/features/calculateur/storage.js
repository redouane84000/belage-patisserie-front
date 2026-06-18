const KEYS = {
  settings: 'belage_settings',
  library: 'belage_library',
  ingredientsLegacy: 'belage_ingredients',
  creations: 'belage_creations',
}

function get(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota */
  }
}

export function loadSettings() {
  const s = get(KEYS.settings, {})
  return {
    kwh: s.kwh ?? 0.2516,
    hourlyRate: s.hourlyRate ?? s.rate ?? 25,
    margin: s.margin ?? 40,
    shop: s.shop ?? 'Bel Âge Pâtisserie',
    modLo: s.modLo ?? 15,
    excHi: s.excHi ?? 35,
  }
}

export function saveSettings(settings) {
  set(KEYS.settings, {
    ...settings,
    rate: settings.hourlyRate,
  })
}

export function loadLibrary() {
  return get(KEYS.library, []) ?? []
}

export function saveLibrary(library) {
  set(KEYS.library, library)
  set(
    KEYS.ingredientsLegacy,
    library.map((i) => ({
      id: i.id,
      name: i.name,
      pq: i.packQty,
      pu: i.packUnit === 'u' ? 'piece' : i.packUnit,
      pp: i.packPrice,
      cat: i.cat ?? 'Autre',
    })),
  )
}

export function loadCreations() {
  return get(KEYS.creations, [])
}

export function saveCreations(creations) {
  set(KEYS.creations, creations)
}

export function blankDraft(settings) {
  return {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name: '',
    type: 'Layer cake',
    servings: 8,
    ingredients: [],
    packaging: [],
    energy: [],
    countHours: true,
    hours: 0,
    minutes: 0,
    hourlyRate: settings.hourlyRate,
    currentPrice: 0,
    margin: settings.margin,
    fixed: 0,
  }
}
