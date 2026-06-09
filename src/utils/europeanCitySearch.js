import { europeanCities } from '../data/europeanCities'

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/['']/g, '')
}

/**
 * Trouve la ville européenne la plus pertinente pour une requête de recherche.
 * Retourne null si aucune correspondance suffisante (min. 2 caractères).
 */
export function findEuropeanCity(query) {
  const q = normalize(query)
  if (q.length < 2) return null

  let best = null
  let bestScore = 0

  for (const city of europeanCities) {
    const labels = [city.name, ...(city.aliases || [])]
    for (const label of labels) {
      const n = normalize(label)
      let score = 0

      if (n === q) score = 100
      else if (n.startsWith(q)) score = 85 - Math.min(n.length - q.length, 20)
      else if (q.startsWith(n) && n.length >= 3) score = 75
      else if (n.includes(q) && q.length >= 3) score = 60
      else continue

      if (score > bestScore) {
        bestScore = score
        best = city
      }
    }
  }

  return bestScore >= 60 ? best : null
}

/** Une pâtissière est rattachée à la ville validée (Go) */
export function patissiereMatchesCity(patissiere, city) {
  if (!city) return false
  const ville = normalize(patissiere.ville)
  const labels = [city.name, ...(city.aliases || [])].map(normalize)
  return labels.some((l) => l === ville)
}

export function countPatissieresInCity(city, list) {
  if (!city) return 0
  return getPatissieresInCity(city, list).length
}

/** Ville associée à une pâtissière (référentiel ou fallback coordonnées) */
export function resolveCityFromPatissiere(patissiere) {
  return (
    findEuropeanCity(patissiere.ville) ?? {
      name: patissiere.ville,
      country: patissiere.region?.includes('Belgique') ? 'Belgique' : 'France',
      lat: patissiere.lat,
      lng: patissiere.lng,
    }
  )
}

/** Toutes les pâtissières rattachées à une ville */
export function getPatissieresInCity(city, list) {
  if (!city) return []
  return list.filter((p) => patissiereMatchesCity(p, city))
}
