import { getPricePerSlice } from './patissiere'
import { patissiereMatchesCity } from './europeanCitySearch'
import { FILTRE_INFLUENCE } from '../data/providerSections'

/**
 * Filtre liste annuaire (page prestataires).
 * @param {import('../data/patissieres').patissieres} providers
 */
export function filterProvidersForDirectory(providers, { filtre, showInfluenceFilter }) {
  return providers.filter((p) => {
    if (filtre === FILTRE_INFLUENCE && showInfluenceFilter) {
      return p.offersInfluence === true
    }
    if (filtre === 'Tous') return true
    return p.specialites?.includes(filtre)
  })
}

/**
 * Filtre liste annuaire mobile (recherche + segments + chips).
 */
export function filterProvidersForMobile(
  providers,
  { query, segment, specialty, city, showInfluenceSegment }
) {
  const q = query.trim().toLowerCase()
  return providers.filter((p) => {
    const okQuery =
      !q ||
      p.nom.toLowerCase().includes(q) ||
      p.ville.toLowerCase().includes(q) ||
      (p.specialites || []).some((s) => s.toLowerCase().includes(q))

    const okSegment =
      segment === 'all' ||
      (segment === 'influence' && showInfluenceSegment && p.offersInfluence) ||
      (segment === 'selection' && p.badge)

    const okSpecialty =
      specialty === 'Toutes' || (p.specialites || []).includes(specialty)

    const okCity = city === 'Toutes' || p.ville === city

    return okQuery && okSegment && okSpecialty && okCity
  })
}

/**
 * Filtre carte interactive.
 */
export function filterProvidersForMap(
  providers,
  {
    search,
    pinnedCity,
    specs,
    budget,
    onlyInfluence,
    livraison,
    mapConfig,
  }
) {
  return providers.filter((p) => {
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
      specs.length === 0 ||
      specs.some((s) => (p.specialites || []).includes(s))

    let matchBudget = true
    if (mapConfig.budget) {
      const slice = getPricePerSlice(p)
      matchBudget = slice == null || slice <= budget
    }

    const hasInfluenceToggle = mapConfig.toggles.some((t) => t.id === 'influence')
    const matchInfluence = !hasInfluenceToggle || !onlyInfluence || p.offersInfluence === true

    const hasLivraisonToggle = mapConfig.toggles.some((t) => t.id === 'livraison')
    const matchLivraison = !hasLivraisonToggle || !livraison || p.livraison

    return (
      matchLocation && matchSpec && matchBudget && matchInfluence && matchLivraison
    )
  })
}
