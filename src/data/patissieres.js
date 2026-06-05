// Pâtissières du réseau Bel Âge — annuaire (fiches réelles uniquement).
// badge: true + badgeLetter → médaillon « Sélection Bel Âge » sur la fiche

export const INFLUENCE_SERVICES_DEFAULT = [
  { type: 'Reel rapide', price: 'Prix à définir' },
  { type: 'Vidéo courte (1 min max avec avis)', price: 'Prix à définir' },
  { type: 'Vidéo long format (+ de 2 min)', price: 'Prix à définir' },
]

export const patissieres = [
  {
    id: 1,
    nom: 'Bel Âge Pâtisserie',
    ville: 'Avignon',
    region: 'Provence',
    lat: 43.9493,
    lng: 4.8055,
    specialites: [
      'Wedding Cake',
      'Number Cake',
      'Baby Shower',
      'Anniversaire',
      'Sweet Table',
      'Cake Design',
    ],
    pricePerSlice: 6,
    offersInfluence: true,
    influenceServices: INFLUENCE_SERVICES_DEFAULT,
    note: null,
    avis: 0,
    badge: true,
    badgeLetter: 'B',
    livraison: true,
    image: '/entreprise.belage.png',
    instagram: 'https://instagram.com/belage_patisserie',
    instagram_followers: '1 605',
    tiktok: 'https://tiktok.com/@belage_patisserie',
    tiktok_followers: '13K',
    whatsapp: '33663962540',
    email: 'contact@belage-patisserie.fr',
  },
]

export default patissieres
