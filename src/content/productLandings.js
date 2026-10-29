import { TRAINING_PRODUCTS } from '../data/trainingProducts'
import { CATALOG_COURSES, PACK_OFFER, courseMeta } from './courseMeta'
import { COURSE_ASSETS } from './courseAssets'

const WHY = {
  'layer-cake': [
    { icon: 'i-chapters', title: 'Suivre les 5 chapitres', text: 'Génoise, crèmes, montage, lissage puis décoration Vintage Cake, dans l’ordre de la vidéo.' },
    { icon: 'i-pro', title: 'Reproduire les gestes', text: 'Chaque chapitre détaille l’objectif, le matériel et les points de vigilance déjà présents dans le cours.' },
    { icon: 'i-clock', title: 'Revoir à votre rythme', text: 'La formation dure 43 min 58 s. Vous avancez chapitre par chapitre depuis votre espace.' },
    { icon: 'i-check', title: 'Stabiliser le gâteau', text: 'Le programme insiste sur le centrage, les boudins de sécurité, le froid et un lissage net.' },
  ],
  'flower-cupcake': [
    { icon: 'i-chapters', title: '10 leçons guidées', text: 'De la pâte jusqu’au bouquet : crème, couleurs, hortensia, dahlia, roses et tulipes.' },
    { icon: 'i-pro', title: 'Pochage floral', text: 'Les leçons séparent matériel, ingrédients, conseils et erreurs à éviter pour chaque fleur.' },
    { icon: 'i-clock', title: 'Environ 45 minutes', text: 'Vous consultez chaque passage vidéo depuis votre espace, à votre rythme.' },
    { icon: 'i-check', title: 'Composer le bouquet', text: 'La fin du programme assemble les cupcakes, les feuilles de soie et la présentation.' },
  ],
  'wedding-cake': [
    { icon: 'i-chapters', title: '12 modules structurés', text: 'Génoises, crèmes, supports, dowels, lissage et décoration d’une pièce à trois étages.' },
    { icon: 'i-pro', title: 'Tenue et transport', text: 'Le cours traite les cake boards, la tige centrale et l’assemblage des niveaux.' },
    { icon: 'i-clock', title: '55 min 54 s', text: 'Les 12 modules suivent la vidéo, du premier étage aux finitions Vintage Cake.' },
    { icon: 'i-check', title: 'Finitions de pièce montée', text: 'Lissage, angles, pochage entre étages et recette bonus de la crème BBC.' },
  ],
}

const FAQ = {
  'layer-cake': [
    { q: 'Que contient la formation Layer Cake ?', a: 'Cinq chapitres : génoise, crèmes BBC et chantilly mascarpone, garnissage, lissage, puis décoration Vintage Cake.' },
    { q: 'Combien de temps dure la vidéo ?', a: '43 minutes et 58 secondes, découpées selon les horodatages de chaque chapitre.' },
    { q: 'Comment consulter les chapitres ?', a: 'Après le paiement, connectez-vous à la plateforme de formation. Le lecteur reprend le passage correspondant au chapitre choisi.' },
  ],
  'flower-cupcake': [
    { q: 'Que contient la formation Flower Cupcake ?', a: 'Dix leçons : introduction, pâte, cuisson, crème, couleurs, hortensia, dahlia, roses et tulipes, composition, puis bouquet final.' },
    { q: 'Combien de temps dure la vidéo ?', a: 'Environ 45 minutes, avec un passage indiqué pour chaque leçon.' },
    { q: 'Comment consulter les leçons ?', a: 'Depuis votre espace, après achat. Chaque leçon affiche objectif, matériel, ingrédients, conseils et points à éviter.' },
  ],
  'wedding-cake': [
    { q: 'Que contient la formation Wedding Cake ?', a: 'Douze modules, de la préparation des génoises jusqu’à la décoration Vintage Cake, plus un bonus crème BBC.' },
    { q: 'Combien de temps dure la vidéo ?', a: '55 minutes et 54 secondes, découpées selon les horodatages de chaque module.' },
    { q: 'Comment consulter les modules ?', a: 'Après le paiement, ouvrez la formation dans la plateforme. Le lecteur se cale sur le module sélectionné.' },
  ],
}

export function productLanding(slug) {
  if (slug === 'pack-complet' || slug === 'pack') {
    return {
      kind: 'pack',
      title: PACK_OFFER.title,
      priceLabel: PACK_OFFER.priceLabel,
      crossedLabel: PACK_OFFER.crossedLabel,
      discountLabel: PACK_OFFER.discountLabel,
      price: PACK_OFFER.price,
      checkout: '/packs?acheter=trio',
      eyebrow: 'Les 3 formations',
      lead: 'Layer Cake, Flower Cupcake et Wedding Cake dans une seule commande, au tarif pack.',
      duration: '3 formations',
      chapterLabel: `${CATALOG_COURSES.reduce((sum, course) => sum + course.chapterCount, 0)} chapitres au total`,
      outcomes: CATALOG_COURSES.map((course) => course.title),
      why: [
        { icon: 'i-books', title: 'Les trois programmes', text: 'Vous recevez l’accès aux trois formations déjà proposées à l’unité.' },
        { icon: 'i-check', title: 'Un seul paiement', text: `Le pack est à ${PACK_OFFER.priceLabel} au lieu de ${PACK_OFFER.crossedLabel}.` },
        { icon: 'i-clock', title: 'À votre rythme', text: 'Chaque formation reste consultable séparément dans votre espace.' },
      ],
      faq: [
        { q: 'Que contient le pack ?', a: 'Les trois formations en ligne : Layer Cake, Flower Cupcake et Wedding Cake.' },
        { q: 'Comment se passe le paiement ?', a: 'Le bouton d’achat ouvre le tunnel Stripe déjà utilisé pour les formations à l’unité.' },
        { q: 'Où retrouver les cours ?', a: 'Après validation, ils apparaissent dans votre tableau de bord, formation par formation.' },
      ],
      photo: COURSE_ASSETS['layer-cake'].product,
      alt: 'Layer cake, Flower Cupcake et Wedding Cake',
      gallery: CATALOG_COURSES.map((course) => ({
        src: COURSE_ASSETS[course.id].product,
        alt: COURSE_ASSETS[course.id].alt,
      })),
      courses: CATALOG_COURSES,
    }
  }

  const product = TRAINING_PRODUCTS.find((item) => item.slug === slug)
  const meta = product ? courseMeta(product.id) : null
  if (!product || !meta) return null
  const assets = COURSE_ASSETS[product.id]
  return {
    kind: 'course',
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    priceLabel: meta.priceLabel,
    duration: meta.duration,
    chapterLabel: meta.chapterLabel,
    chapterCount: meta.chapterCount,
    chapterUnit: meta.chapterUnit,
    eyebrow: 'Formation en ligne',
    lead: product.longDescription,
    shortDescription: product.shortDescription,
    outcomes: product.outcomes,
    modules: product.modules,
    why: WHY[product.id],
    faq: [
      ...FAQ[product.id],
      { q: 'Comment se passe le paiement ?', a: 'Le bouton d’achat ouvre le paiement sécurisé Stripe déjà en place sur le site.' },
    ],
    gallery: assets.gallery,
    photo: assets.product,
    alt: assets.alt,
    checkout: `/packs?acheter=${product.id}`,
  }
}
