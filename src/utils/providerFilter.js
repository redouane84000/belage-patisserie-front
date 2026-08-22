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

