/**
 * Galerie Inspirations
 * - Cartes : images locales public/inspirations/
 * - Bandeau : HD Unsplash
 */

const local = (filename) => `/inspirations/${filename}`

const hd = (id) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=88`

export const INSPIRATION_ASSETS = {
  weddingLaceFruits3Etages: 'wedding-lace-fruits-3-etages.png',
  weddingPruneFiguesAutomne: 'wedding-prune-figues-automne.png',
  weddingTourMacaronsFloral: 'wedding-tour-macarons-floral.png',
  weddingBotanique3Etages: 'wedding-botanique-3-etages.png',
  weddingLambethFramboises2Etages: 'wedding-lambeth-framboises-2-etages.png',
  weddingCoeurFramboisesNoeuds: 'wedding-coeur-framboises-noeuds.png',
  weddingCoeurFramboisesClassique: 'wedding-coeur-framboises-classique.png',
  weddingEleganceNuptiale: 'wedding-elegance-nuptiale.png',
  italianMillefoglieMariageBaies: 'italian-millefoglie-mariage-baies.png',
  italianLambethVintagePastel: 'italian-lambeth-vintage-pastel.png',
}

export const INSPIRATION_FALLBACK = local(
  INSPIRATION_ASSETS.weddingLaceFruits3Etages
)

export const INSPIRATION_SPOTLIGHT = {
  image: hd('1535254973040-607b474cb50d'),
  alt: 'Gâteau de mariage à étages — inspiration Bel Âge',
  tag: 'Inspirations Bel Âge',
  title: 'Trouvez le style qui fera vibrer votre événement',
  text: 'Wedding cakes, Italian cakes et créations d’exception : parcourez la galerie puis contactez une pâtissière du réseau.',
  cta: 'Explorer les inspirations',
}

export const INSPIRATION_ITEMS = [
  {
    id: 1,
    image: local(INSPIRATION_ASSETS.weddingLaceFruits3Etages),
    alt: 'Gâteau de mariage 3 étages, dentelle, fruits et fleurs',
    title: 'Couronne Nuptiale',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 2,
    image: local(INSPIRATION_ASSETS.weddingPruneFiguesAutomne),
    alt: 'Gâteau de mariage prune, figues et baies',
    title: 'Romance d\'Automne',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 3,
    image: local(INSPIRATION_ASSETS.weddingTourMacaronsFloral),
    alt: 'Tour de macarons fleurie — pièce de mariage',
    title: 'Tour Macaron Florale',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 4,
    image: local(INSPIRATION_ASSETS.weddingBotanique3Etages),
    alt: 'Wedding cake 3 étages, décor botanique peint',
    title: 'Herbier Nuptial',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 5,
    image: local(INSPIRATION_ASSETS.weddingLambethFramboises2Etages),
    alt: 'Gâteau de mariage 2 étages, framboises, style lambeth',
    title: 'Framboise Royale',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 6,
    image: local(INSPIRATION_ASSETS.weddingCoeurFramboisesNoeuds),
    alt: 'Gâteau cœur framboises et rubans — mariage',
    title: 'Cœur de Mariée',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 7,
    image: local(INSPIRATION_ASSETS.weddingCoeurFramboisesClassique),
    alt: 'Gâteau cœur framboises, finition classique',
    title: 'Cœur Framboise',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 8,
    image: local(INSPIRATION_ASSETS.weddingEleganceNuptiale),
    alt: 'Gâteau de mariage blanc à étages, finition élégante',
    title: 'Élégance Nuptiale',
    category: 'Wedding Cake',
    filter: 'Wedding Cake',
    size: 'normal',
  },
  {
    id: 9,
    image: local(INSPIRATION_ASSETS.italianMillefoglieMariageBaies),
    alt: 'Millefoglie de mariage italien, baies et sucre glace',
    title: 'Millefoglie Nuziale',
    category: 'Italian Cake',
    filter: 'Italian Cake',
    size: 'normal',
  },
  {
    id: 10,
    image: local(INSPIRATION_ASSETS.italianLambethVintagePastel),
    alt: 'Italian cake — pièce lambeth vintage, pastels',
    title: 'Dolce Lambeth',
    category: 'Italian Cake',
    filter: 'Italian Cake',
    size: 'normal',
  },
]

export default INSPIRATION_ITEMS
