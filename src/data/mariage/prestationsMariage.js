/**
 * Prestations mariage Bel Âge — offres, grille de prix et décors.
 *
 * Règles de calcul (inchangées, usage interne — jamais affichées telles quelles) :
 *
 *   Prix de la création seule, pour n parts (minimum 60) :
 *     60 ≤ n ≤ 80   →  450 + 7,50 × (n − 60)
 *     81 ≤ n ≤ 120  →  600 + 6,50 × (n − 80)
 *     n ≥ 121       →  860 + 5,50 × (n − 120)
 *   Une nouvelle tranche ne recalcule jamais les parts déjà comptées.
 *
 *   Prix de l'offre hors livraison = prix de la création + supplément d'offre
 *     Basique + 0 €   ·   Premium + 149 €   ·   Luxe + 499 €
 *
 *   Livraison, facturée à part, sur la distance d :
 *     Basique  max(45 ; 2 × d)
 *     Premium  max(45 ; 1 × min(d ; 100) + 2 × max(d − 100 ; 0))
 *     Luxe     1 × max(d − 100 ; 0)
 *
 *   Les prestations offertes par une offre ne sont jamais refacturées.
 */

export const WEDDING_MIN_PARTS = 60
export const WEDDING_MAX_PARTS = 260
export const WEDDING_MAX_KM = 300

const DELIVERY_THRESHOLD_KM = 100

/** Tranches de la grille, exprimées en langage client. */
export const WEDDING_TIERS = [
  { id: 'tier-1', label: 'De 60 à 80 parts', step: 7.5 },
  { id: 'tier-2', label: 'De 81 à 120 parts', step: 6.5 },
  { id: 'tier-3', label: 'À partir de 121 parts', step: 5.5 },
]

export const WEDDING_CREATIONS = [
  {
    id: 'wedding-cake',
    name: 'Wedding Cake',
    image: '/mariage/creation-wedding-cake.jpg',
    alt: 'Wedding cake à trois étages orné de roses en sucre',
    text: 'Étages lissés à la main, roses en sucre et feuillages délicats.',
  },
  {
    id: 'italian-cake',
    name: 'Italian Cake',
    image: '/mariage/creation-italian-cake.jpg',
    alt: 'Italian cake garni de fruits rouges et de sucre glace',
    text: 'Crème mascarpone, fruits rouges frais et voile de sucre glace.',
  },
  {
    id: 'cupcakes-floraux',
    name: 'Cupcakes floraux',
    image: '/mariage/creation-cupcakes-floraux.jpg',
    alt: 'Bouquet de cupcakes décorés de roses et pivoines en crème',
    text: 'Un bouquet gourmand de roses, pivoines et dahlias pochés.',
  },
]

export const WEDDING_PACKS = [
  {
    id: 'basique',
    name: 'Basique',
    tagline: 'L’essentiel, magnifiquement exécuté',
    supplement: 0,
    brochure: '/mariage/offre-basique.jpg',
    brochureAlt: 'Brochure de l’offre Basique Bel Âge',
    includes: ['Une création au choix parmi les trois'],
    extras: ['Décors et jets d’étincelles en option', 'Livraison en supplément'],
    includedOptionIds: [],
    freeDecorCount: 0,
    deliveryLabel: '2 € par kilomètre, minimum 45 €',
    delivery: { nearRate: 2, farRate: 2, minimum: 45 },
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Le choix le plus demandé',
    supplement: 149,
    featured: true,
    brochure: '/mariage/offre-premium.jpg',
    brochureAlt: 'Brochure de l’offre Premium Bel Âge',
    includes: [
      'Une création au choix parmi les trois',
      'Jets d’étincelles offerts',
      'Livraison à tarif réduit jusqu’à 100 km',
    ],
    extras: ['Décors en option'],
    includedOptionIds: ['jets-etincelles'],
    freeDecorCount: 0,
    deliveryLabel: '1 € par kilomètre jusqu’à 100 km, puis 2 € · minimum 45 €',
    delivery: { nearRate: 1, farRate: 2, minimum: 45 },
  },
  {
    id: 'luxe',
    name: 'Luxe',
    tagline: 'La mise en scène complète',
    supplement: 499,
    brochure: '/mariage/offre-luxe.jpg',
    brochureAlt: 'Brochure de l’offre Luxe Bel Âge',
    includes: [
      'Une création au choix parmi les trois',
      'Jets d’étincelles offerts',
      'Un décor au choix offert',
      'Livraison offerte jusqu’à 100 km',
    ],
    extras: ['Décor supplémentaire en option'],
    includedOptionIds: ['jets-etincelles'],
    freeDecorCount: 1,
    deliveryLabel: 'Offerte jusqu’à 100 km, puis 1 € par kilomètre',
    delivery: { nearRate: 0, farRate: 1, minimum: 0 },
  },
]

export const WEDDING_OPTIONS = [
  {
    id: 'jets-etincelles',
    category: 'effet',
    name: 'Jets d’étincelles',
    tagline: 'Une entrée spectaculaire',
    price: 199,
    text: 'Deux fontaines froides encadrent l’arrivée du gâteau.',
    note: 'Gâteau présenté non inclus · transport en supplément',
    variants: [
      {
        id: 'signature',
        label: 'Signature',
        swatch: '#F4D58D',
        image: '/mariage/option-jets-etincelles.jpg',
        alt: 'Jets d’étincelles autour d’un wedding cake dans une salle de réception',
      },
    ],
  },
  {
    id: 'fond-scene-drape',
    category: 'decor',
    name: 'Fond de scène drapé',
    tagline: 'Voilages ivoire et champagne',
    price: 399,
    text: 'Un rideau majestueux noué d’un large nœud satiné.',
    note: 'Option seule · transport en supplément',
    variants: [
      {
        id: 'ivoire-champagne',
        label: 'Ivoire & champagne',
        swatch: '#E8D5AE',
        image: '/mariage/option-fond-scene-drape.jpg',
        alt: 'Fond de scène drapé ivoire et champagne avec nœud central',
      },
    ],
  },
  {
    id: 'drape-effet-vague',
    category: 'decor',
    name: 'Décor drapé effet vague',
    tagline: 'Structure courbe & voilages',
    price: 499,
    text: 'Des colonnes de tissu ondulantes qui sculptent l’espace.',
    note: 'Option seule · transport en supplément',
    variants: [
      {
        id: 'ivoire',
        label: 'Ivoire',
        swatch: '#F3EBDD',
        image: '/mariage/option-drape-vague-ivoire.jpg',
        alt: 'Décor drapé effet vague en voilages ivoire',
      },
      {
        id: 'bordeaux',
        label: 'Bordeaux',
        swatch: '#7B1226',
        image: '/mariage/option-drape-vague-bordeaux.jpg',
        alt: 'Décor drapé effet vague en voilages bordeaux',
      },
    ],
  },
  {
    id: 'arche-florale',
    category: 'decor',
    name: 'Arche florale',
    tagline: 'Décor fleuri pour votre mariage',
    price: 499,
    text: 'Une arche généreuse de roses et feuillages, en fond de table.',
    note: 'Option seule · transport en supplément',
    variants: [
      {
        id: 'blanche',
        label: 'Blanche',
        swatch: '#FBF7F0',
        image: '/mariage/option-arche-florale-blanche.jpg',
        alt: 'Arche florale blanche derrière un wedding cake',
      },
      {
        id: 'rouge',
        label: 'Rouge',
        swatch: '#C0182A',
        image: '/mariage/option-arche-florale-rouge.jpg',
        alt: 'Arche florale rouge derrière un wedding cake',
      },
    ],
  },
]

/** Brochures Bel Âge, consultables en complément. */
export const WEDDING_BROCHURES = [
  {
    id: 'recap',
    label: 'Les trois packs',
    src: '/mariage/trois-packs.jpg',
    alt: 'Récapitulatif des trois packs mariage Bel Âge',
  },
  ...WEDDING_PACKS.map((pack) => ({
    id: pack.id,
    label: `Offre ${pack.name}`,
    src: pack.brochure,
    alt: pack.brochureAlt,
  })),
]

/* -------------------------------------------------------------------------- */
/* Formatage                                                                   */
/* -------------------------------------------------------------------------- */

const euroCache = new Map()

function euroFormatter(decimals) {
  if (!euroCache.has(decimals)) {
    euroCache.set(
      decimals,
      new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    )
  }
  return euroCache.get(decimals)
}

/** Affiche 450 € et 1 014,50 € sans zéro décimal inutile. */
export function formatEuro(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100
  return euroFormatter(Number.isInteger(rounded) ? 0 : 2).format(rounded)
}

/* -------------------------------------------------------------------------- */
/* Moteur de prix                                                              */
/* -------------------------------------------------------------------------- */

export function clampParts(parts) {
  const value = Math.round(Number(parts) || WEDDING_MIN_PARTS)
  return Math.min(WEDDING_MAX_PARTS, Math.max(WEDDING_MIN_PARTS, value))
}

/** Prix de la création seule, hors offre et hors livraison. */
export function computeBasePrice(rawParts) {
  const n = clampParts(rawParts)
  if (n <= 80) return 450 + 7.5 * (n - 60)
  if (n <= 120) return 600 + 6.5 * (n - 80)
  return 860 + 5.5 * (n - 120)
}

export function findTier(rawParts) {
  const n = clampParts(rawParts)
  if (n <= 80) return WEDDING_TIERS[0]
  if (n <= 120) return WEDDING_TIERS[1]
  return WEDDING_TIERS[2]
}

/** Prix de l'offre hors livraison. */
export function computePackPrice(pack, rawParts) {
  return computeBasePrice(rawParts) + pack.supplement
}

/** Prix de départ affiché : 60 parts. */
export function packStartPrice(pack) {
  return computePackPrice(pack, WEDDING_MIN_PARTS)
}

export function computeDelivery(pack, rawKm) {
  const { delivery } = pack
  const d = Math.max(0, Math.round(Number(rawKm) || 0))
  if (d === 0) return 0

  const nearKm = Math.min(d, DELIVERY_THRESHOLD_KM)
  const farKm = Math.max(d - DELIVERY_THRESHOLD_KM, 0)
  const cost = delivery.nearRate * nearKm + delivery.farRate * farKm

  return delivery.minimum ? Math.max(delivery.minimum, cost) : cost
}

export function getOptionById(optionId) {
  return WEDDING_OPTIONS.find((option) => option.id === optionId) || null
}

export function getVariant(option, variantId) {
  return option.variants.find((variant) => variant.id === variantId) ?? option.variants[0]
}

/**
 * Devis complet.
 * Les prestations incluses dans l'offre apparaissent toujours dans le
 * détail, marquées « offert », et ne sont jamais facturées. En Luxe, le
 * décor offert s'applique au décor le plus cher retenu par le client.
 */
export function buildQuote({ pack, parts, km, selectedOptionIds = [] }) {
  const packPrice = computePackPrice(pack, parts)
  const delivery = computeDelivery(pack, km)

  // Les options incluses d'office figurent toujours au devis.
  const optionIds = [...new Set([...pack.includedOptionIds, ...selectedOptionIds])]
  const options = optionIds
    .map(getOptionById)
    .filter(Boolean)
    .sort((a, b) => b.price - a.price)

  let remainingFreeDecors = pack.freeDecorCount
  const lines = options.map((option) => {
    let offered = pack.includedOptionIds.includes(option.id)

    if (!offered && option.category === 'decor' && remainingFreeDecors > 0) {
      offered = true
      remainingFreeDecors -= 1
    }

    return { option, offered, price: offered ? 0 : option.price }
  })

  const optionsTotal = lines.reduce((sum, line) => sum + line.price, 0)
  const offeredValue = lines.reduce((sum, line) => sum + (line.offered ? line.option.price : 0), 0)

  return {
    packPrice,
    delivery,
    optionsTotal,
    offeredValue,
    lines,
    /** Décors offerts par l'offre et pas encore choisis par le client. */
    freeDecorsLeft: remainingFreeDecors,
    total: packPrice + delivery + optionsTotal,
    tier: findTier(parts),
  }
}

/* -------------------------------------------------------------------------- */
/* Demande de devis WhatsApp                                                   */
/* -------------------------------------------------------------------------- */

/** Message de demande de devis, prérempli depuis les choix du simulateur. */
export function buildWhatsAppQuoteMessage({ pack, creation, parts, km, quote, variantByOption }) {
  const optionLines = quote.lines.map((line) => {
    const variant = getVariant(line.option, variantByOption?.[line.option.id])
    const colour = line.option.variants.length > 1 ? ` (${variant.label})` : ''
    return `- ${line.option.name}${colour} : ${line.offered ? 'offert' : formatEuro(line.price)}`
  })

  return [
    'Bonjour Bel Âge Pâtisserie,',
    '',
    'Je souhaite un devis pour mon mariage :',
    `- Création : ${creation.name}`,
    `- Offre : ${pack.name}`,
    `- Nombre de parts : ${parts}`,
    km > 0 ? `- Distance de livraison : ${km} km` : '- Retrait à l’atelier',
    ...(optionLines.length ? ['- Décors et effets :', ...optionLines.map((l) => `  ${l}`)] : []),
    '',
    `Total estimé sur votre site : ${formatEuro(quote.total)}`,
    '',
    'Pouvez-vous me confirmer la disponibilité de ma date ? Merci.',
  ].join('\n')
}
