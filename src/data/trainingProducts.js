import { LAYER_CAKE_CHAPTERS } from './layerCakeChapters'
import { WEDDING_CAKE_CHAPTERS } from './weddingCakeChapters'

const duration = (seconds) => `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, '0')} s`

export const TRAINING_PRODUCTS = [
  { id: 'layer-cake', slug: 'layer-cake', title: 'Layer Cake', price: 69.99, duration: '43 min 58 s', shortDescription: 'Construisez, garnissez et lissez un layer cake stable et élégant.', longDescription: 'Apprenez à réaliser un Layer Cake de la génoise jusqu’à la décoration Vintage Cake, avec les techniques de montage, de stabilité et de lissage.', outcomes: ['Réaliser une génoise haute et régulière', 'Préparer des crèmes stables', 'Monter un gâteau droit et gourmand', 'Obtenir un lissage net', 'Décorer un Vintage Cake'], modules: LAYER_CAKE_CHAPTERS.map((item) => ({ title: item.title, duration: duration(item.endTime - item.startTime), description: item.objective })) },
  { id: 'flower-cupcake', slug: 'flower-cupcake', title: 'Flower Cupcake', price: 69.99, duration: null, shortDescription: 'Pochage floral, harmonie des couleurs et composition d’un bouquet gourmand.', longDescription: 'Une formation dédiée au pochage floral et à la composition de bouquets de cupcakes.', outcomes: ['Travailler la pression de poche', 'Composer un bouquet gourmand', 'Harmoniser les couleurs'], modules: [] },
  { id: 'wedding-cake', slug: 'wedding-cake', title: 'Wedding Cake', price: 89.99, duration: '55 min 54 s', shortDescription: 'Préparez une pièce élégante, stable et prête pour le transport.', longDescription: 'Apprenez étape par étape à réaliser une véritable pièce montée à trois étages : génoises, crèmes, montage, supports, dowels, lissage et décoration Vintage Cake.', outcomes: ['Réaliser une pièce montée à trois étages', 'Préparer des crèmes adaptées à la stabilité', 'Renforcer chaque niveau avec des dowels', 'Obtenir un lissage professionnel', 'Assembler et décorer une pièce montée'], modules: WEDDING_CAKE_CHAPTERS.map((item) => ({ title: item.title, duration: duration(item.endTime - item.startTime), description: item.objective })) },
]

export const trainingProductBySlug = (slug) => TRAINING_PRODUCTS.find((product) => product.slug === slug)
