import patissieres from './patissieres'
import photographes from './photographes'
import traiteurs from './traiteurs'
import djs from './djs'
import decorateurs from './decorateurs'
import locationVoitures from './locationVoitures'

export const DEFAULT_SECTION_ID = 'patisserie'

export const FILTRE_INFLUENCE = 'Influence'

const PATISSERIE_SPECIALITES = [
  'Wedding Cake',
  'Number Cake',
  'Baby Shower',
  'Anniversaire',
  'Sweet Table',
  'Cake Design',
]

/** @typedef {import('./patissieres').patissieres[number]} Provider */

/**
 * @typedef {Object} ProviderSection
 * @property {string} id
 * @property {string} shortLabel
 * @property {string} pageTitle
 * @property {string} pageDesc
 * @property {string} providerSingular
 * @property {string} providerPlural
 * @property {string} creatorLabel
 * @property {Provider[]} providers
 * @property {string[]} quickFilters
 * @property {boolean} showInfluenceFilter
 * @property {boolean} showInfluenceSegment
 * @property {{ specialties: string[], budget: object|null, toggles: { id: string, label: string }[] }} mapConfig
 * @property {string} emptyMessage
 */

/** @type {ProviderSection[]} */
export const PROVIDER_SECTIONS = [
  {
    id: 'patisserie',
    shortLabel: 'Pâtissière',
    pageTitle: 'Nos Pâtissières',
    pageDesc:
      "Première plateforme française d'annuaire de pâtissier(e)s. Filtrez par spécialité ou par service influence, puis contactez la créatrice de votre choix.",
    providerSingular: 'pâtissière',
    providerPlural: 'pâtissières',
    creatorLabel: 'créatrice',
    providers: patissieres,
    quickFilters: ['Tous', ...PATISSERIE_SPECIALITES],
    showInfluenceFilter: true,
    showInfluenceSegment: true,
    mapConfig: {
      specialties: PATISSERIE_SPECIALITES,
      budget: { min: 3, max: 10, step: 0.5, suffix: '€/part' },
      toggles: [
        { id: 'influence', label: 'Influence' },
        { id: 'livraison', label: 'Livraison disponible' },
      ],
    },
    emptyMessage: 'Aucune pâtissière trouvée',
  },
  {
    id: 'photographe-videaste',
    shortLabel: 'Photo / Vidéo',
    pageTitle: 'Photographes & Vidéastes',
    pageDesc:
      'Trouvez un photographe ou vidéaste pour immortaliser votre mariage, événement corporate ou célébration privée.',
    providerSingular: 'photographe / vidéaste',
    providerPlural: 'photographes & vidéastes',
    creatorLabel: 'prestataire',
    providers: photographes,
    quickFilters: [
      'Tous',
      'Mariage',
      'Corporate',
      'Baptême',
      'Anniversaire',
      'Portrait',
      'Clip / Vidéo',
      'Drone',
    ],
    showInfluenceFilter: false,
    showInfluenceSegment: false,
    mapConfig: {
      specialties: [
        'Mariage',
        'Corporate',
        'Baptême',
        'Anniversaire',
        'Portrait',
        'Clip / Vidéo',
        'Drone',
      ],
      budget: null,
      toggles: [{ id: 'livraison', label: 'Déplacement inclus' }],
    },
    emptyMessage: 'Aucun photographe ou vidéaste pour le moment',
  },
  {
    id: 'traiteur',
    shortLabel: 'Traiteur',
    pageTitle: 'Traiteurs',
    pageDesc:
      'Cocktail, buffet, brunch ou repas assis — trouvez le traiteur adapté à votre événement.',
    providerSingular: 'traiteur',
    providerPlural: 'traiteurs',
    creatorLabel: 'prestataire',
    providers: traiteurs,
    quickFilters: [
      'Tous',
      'Mariage',
      'Cocktail',
      'Buffet',
      'Brunch',
      'Événement privé',
      'Corporate',
    ],
    showInfluenceFilter: false,
    showInfluenceSegment: false,
    mapConfig: {
      specialties: [
        'Mariage',
        'Cocktail',
        'Buffet',
        'Brunch',
        'Événement privé',
        'Corporate',
      ],
      budget: null,
      toggles: [{ id: 'livraison', label: 'Service sur place' }],
    },
    emptyMessage: 'Aucun traiteur pour le moment',
  },
  {
    id: 'dj',
    shortLabel: 'DJ',
    pageTitle: 'DJ',
    pageDesc:
      'Animation musicale pour mariage, soirée privée ou événement professionnel.',
    providerSingular: 'DJ',
    providerPlural: 'DJ',
    creatorLabel: 'prestataire',
    providers: djs,
    quickFilters: [
      'Tous',
      'Mariage',
      'Soirée privée',
      'Corporate',
      'Anniversaire',
      'Animation micro',
    ],
    showInfluenceFilter: false,
    showInfluenceSegment: false,
    mapConfig: {
      specialties: [
        'Mariage',
        'Soirée privée',
        'Corporate',
        'Anniversaire',
        'Animation micro',
      ],
      budget: null,
      toggles: [],
    },
    emptyMessage: 'Aucun DJ pour le moment',
  },
  {
    id: 'decorateur',
    shortLabel: 'Décorateur',
    pageTitle: "Décorateurs d'événement",
    pageDesc:
      'Décoration florale, scénographie et mise en scène pour sublimer votre événement.',
    providerSingular: 'décorateur',
    providerPlural: 'décorateurs',
    creatorLabel: 'prestataire',
    providers: decorateurs,
    quickFilters: [
      'Tous',
      'Mariage',
      'Baptême',
      'Anniversaire',
      'Corporate',
      'Décoration florale',
      'Scénographie',
    ],
    showInfluenceFilter: false,
    showInfluenceSegment: false,
    mapConfig: {
      specialties: [
        'Mariage',
        'Baptême',
        'Anniversaire',
        'Corporate',
        'Décoration florale',
        'Scénographie',
      ],
      budget: null,
      toggles: [{ id: 'livraison', label: 'Installation sur site' }],
    },
    emptyMessage: 'Aucun décorateur pour le moment',
  },
  {
    id: 'location-voiture',
    shortLabel: 'Location auto',
    pageTitle: 'Location voiture événement',
    pageDesc:
      'Voitures de luxe, vintage ou avec chauffeur pour mariages et événements.',
    providerSingular: 'agence',
    providerPlural: 'agences',
    creatorLabel: 'prestataire',
    providers: locationVoitures,
    quickFilters: [
      'Tous',
      'Mariage',
      'Vintage',
      'Limousine',
      'Voiture de luxe',
      'Avec chauffeur',
    ],
    showInfluenceFilter: false,
    showInfluenceSegment: false,
    mapConfig: {
      specialties: [
        'Mariage',
        'Vintage',
        'Limousine',
        'Voiture de luxe',
        'Avec chauffeur',
      ],
      budget: null,
      toggles: [{ id: 'livraison', label: 'Avec chauffeur' }],
    },
    emptyMessage: 'Aucune agence pour le moment',
  },
]

export function getProviderSection(sectionId) {
  return (
    PROVIDER_SECTIONS.find((s) => s.id === sectionId) ??
    PROVIDER_SECTIONS.find((s) => s.id === DEFAULT_SECTION_ID)
  )
}

export function resolveSectionId(sectionId) {
  if (PROVIDER_SECTIONS.some((s) => s.id === sectionId)) return sectionId
  return DEFAULT_SECTION_ID
}
