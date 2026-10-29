import { TRAINING_PRODUCTS } from '../data/trainingProducts'
import { LAYER_CAKE_CHAPTERS } from '../data/layerCakeChapters'
import { FLOWER_CUPCAKE_CHAPTERS } from '../data/flowerCupcakeChapters'
import { WEDDING_CAKE_CHAPTERS } from '../data/weddingCakeChapters'

const CHAPTERS = {
  'layer-cake': { items: LAYER_CAKE_CHAPTERS, unit: 'chapitres', unitOne: 'chapitre' },
  'flower-cupcake': { items: FLOWER_CUPCAKE_CHAPTERS, unit: 'leçons', unitOne: 'leçon' },
  'wedding-cake': { items: WEDDING_CAKE_CHAPTERS, unit: 'modules', unitOne: 'module' },
}

export const euro = (value) =>
  Number(value).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export function courseMeta(productId) {
  const product = TRAINING_PRODUCTS.find((item) => item.id === productId)
  const chapters = CHAPTERS[productId]
  if (!product || !chapters) return null
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    priceLabel: euro(product.price),
    duration: product.duration.replace(' +', ''),
    shortDescription: product.shortDescription,
    chapterCount: chapters.items.length,
    chapterUnit: chapters.unit,
    chapterUnitOne: chapters.unitOne,
    chapterLabel: `${chapters.items.length} ${chapters.unit}`,
  }
}

export const CATALOG_COURSES = TRAINING_PRODUCTS.map((product) => courseMeta(product.id))

const packPrice = 179.99
const packCrossed = TRAINING_PRODUCTS.reduce((sum, product) => sum + product.price, 0)
const packDiscount = Math.round((1 - packPrice / packCrossed) * 100)

export const PACK_OFFER = {
  title: 'Le Pack Complet',
  ids: TRAINING_PRODUCTS.map((product) => product.id),
  price: packPrice,
  priceLabel: euro(packPrice),
  crossed: packCrossed,
  crossedLabel: euro(packCrossed),
  discountLabel: `−${packDiscount} %`,
}
