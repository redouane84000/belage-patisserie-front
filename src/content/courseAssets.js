/**
 * Visuels par formation.
 * Desktop et mobile : photos produit (même série que l’accueil desktop).
 *
 * Limites de netteté (à remplacer plus tard par de vraies prises HD) :
 * - Layer Cake : 721×879 — suffisant jusqu’à ~360 px de large en 2x
 * - Flower Cupcake : 1320×1531 — net jusqu’à ~660 px de large en 2x
 * - Wedding Cake : 1440×1920 — net jusqu’à ~720 px de large en 2x
 * Les fichiers mk-* (≈ 188–708 px) ne doivent plus être agrandis sur desktop.
 */
export const COURSE_ASSETS = {
  'layer-cake': {
    card: '/assets/formations/mk-card-layer.jpg',
    cardDesktop: '/training/products/layer-cake.jpeg',
    row: '/assets/formations/mk-f-layer.jpg',
    rowDesktop: '/training/products/layer-cake.jpeg',
    product: '/training/products/layer-cake.jpeg',
    mobile: '/training/products/layer-cake.jpeg',
    alt: 'Layer cake aux fruits rouges',
    gallery: [
      { src: '/training/products/layer-cake.jpeg', alt: 'Layer cake aux fruits rouges, rendu final' },
      { src: '/assets/formations/real-layer-cake.jpg', alt: 'Layer cake tranché, couches de génoise et crème' },
      { src: '/assets/formations/mk-video-genoise.jpg', alt: 'Génoise utilisée pour le montage du layer cake' },
    ],
    maxDisplayPx: 360,
    sourceSize: '721×879',
  },
  'flower-cupcake': {
    card: '/assets/formations/mk-card-flower.jpg',
    cardDesktop: '/training/products/flower-cupcake.jpeg',
    row: '/assets/formations/mk-f-flower.jpg',
    rowDesktop: '/training/products/flower-cupcake.jpeg',
    product: '/training/products/flower-cupcake.jpeg',
    mobile: '/training/products/flower-cupcake.jpeg',
    alt: 'Bouquet de cupcakes floraux',
    gallery: [
      { src: '/training/products/flower-cupcake.jpeg', alt: 'Bouquet de cupcakes floraux, roses et pivoines en crème' },
      { src: '/assets/formations/real-flower-cupcake.jpg', alt: 'Composition florale de cupcakes' },
    ],
    maxDisplayPx: 660,
    sourceSize: '1320×1531',
  },
  'wedding-cake': {
    card: '/assets/formations/mk-card-wedding.jpg',
    cardDesktop: '/training/products/wedding-cake.jpeg',
    row: '/assets/formations/mk-f-wedding.jpg',
    rowDesktop: '/training/products/wedding-cake.jpeg',
    product: '/training/products/wedding-cake.jpeg',
    mobile: '/training/products/wedding-cake.jpeg',
    alt: 'Wedding cake blanc décoré de roses',
    gallery: [
      { src: '/training/products/wedding-cake.jpeg', alt: 'Pièce montée blanche décorée de roses' },
      { src: '/assets/formations/real-wedding-cake.jpg', alt: 'Wedding cake, vue d’ensemble' },
    ],
    maxDisplayPx: 720,
    sourceSize: '1440×1920',
  },
  home: {
    hero: '/assets/formations/mk-hero-desktop.jpg',
    heroMobile: '/assets/formations/mk-hero-mobile-floral.jpg',
    heroMobileWebp: '/assets/formations/mk-hero-mobile-floral.webp',
    hdNeeded: false,
  },
  pack: {
    banner: '/training/products/layer-cake.jpeg',
    bannerMobile: '/training/products/layer-cake.jpeg',
    decor: '/training/products/flower-cupcake.jpeg',
    mobile: '/training/products/layer-cake.jpeg',
    tiles: [
      '/training/products/layer-cake.jpeg',
      '/training/products/wedding-cake.jpeg',
      '/training/products/flower-cupcake.jpeg',
    ],
    tilesMobile: [
      '/assets/formations/mk-f-pack-layer.jpg',
      '/assets/formations/mk-f-pack-t2.jpg',
      '/assets/formations/mk-f-pack-t3.jpg',
    ],
  },
  decor: {
    silk: '/assets/formations/mk-f-decor-tr.jpg',
    roses: '/assets/formations/mk-f-roses-bl.jpg',
    side: '/training/products/layer-cake.jpeg',
  },
}
