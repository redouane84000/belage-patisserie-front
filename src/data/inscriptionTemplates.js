/**
 * Modèles d'inscription Bel Âge — un message par section prestataire.
 * Même texte à envoyer sur WhatsApp (+ Instagram / TikTok si souhaité).
 */

export const INSCRIPTION_SECTIONS = [
  {
    id: 'patisserie',
    label: 'Pâtissière / Cake design',
    shortLabel: 'Pâtissière',
    accent: '#c9a84c',
    hint:
      'Prix affiché sur la fiche : à partir de 3 €/part. Service influence : précisez vos tarifs pour les 3 formats si vous proposez ce service.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section Pâtissière.

Nom / marque : [ ]
Ville : [ ]
Région : [ ]
Livraison : [ Oui / Non ]

Spécialités : [ ex. Wedding cake, layer cake, number cake, cupcakes, pâtisserie fine… ]
Prix à la part : [ à partir de 3 €/part — indiquez votre tarif ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]

Service influence : [ Oui / Non ]
Si Oui, vos tarifs :
- Reel rapide : [ ] €
- Vidéo courte (1 min max avec avis) : [ ] €
- Vidéo long format (plus de 2 min) : [ ] €`,
  },
  {
    id: 'photographe-videaste',
    label: 'Photographe / Vidéaste',
    shortLabel: 'Photo & Vidéo',
    accent: '#4a6670',
    hint:
      'Indiquez une fourchette ou un tarif « à partir de » (forfait mariage, demi-journée, journée complète). Pas de prix à la part sur cette section.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section Photographe / Vidéaste.

Nom / marque : [ ]
Ville : [ ]
Région : [ ]
Déplacement : [ Oui — rayon en km / Non — studio uniquement ]

Prestations : [ ex. Mariage, Corporate, Baptême, Portrait, Clip / Vidéo, Drone… ]
Fourchette tarifaire : [ ex. À partir de 800 € — forfait mariage / demi-journée / journée ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]
Site / portfolio : [ lien ou Non ]

Matériel & options : [ ex. Second shooter, drone, album photo, retouches incluses… ]`,
  },
  {
    id: 'traiteur',
    label: 'Traiteur',
    shortLabel: 'Traiteur',
    accent: '#8b6914',
    hint:
      'Précisez un budget par personne ou un forfait minimum (cocktail, buffet, repas assis). Pas de prix à la part.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section Traiteur.

Nom / marque : [ ]
Ville : [ ]
Région : [ ]
Service sur place : [ Oui / Non ]

Prestations : [ ex. Mariage, Cocktail, Buffet, Brunch, Événement privé, Corporate… ]
Tarification : [ ex. À partir de 35 €/personne — cocktail / buffet / repas assis ]
Convives minimum : [ ex. 30 personnes ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]

Options : [ ex. Service en salle, vaisselle incluse, options végétariennes / halal… ]`,
  },
  {
    id: 'dj',
    label: 'DJ',
    shortLabel: 'DJ',
    accent: '#5c4d7a',
    hint:
      'Forfait soirée ou tarif horaire — indiquez ce qui correspond à votre activité.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section DJ.

Nom / marque : [ ]
Ville : [ ]
Région : [ ]
Déplacement : [ Oui / Non ]

Prestations : [ ex. Mariage, Soirée privée, Corporate, Anniversaire, Animation micro… ]
Tarif : [ ex. À partir de 600 € la soirée — ou tarif horaire ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]

Matériel : [ ex. Son, lumières, micro, playlist personnalisée… ]`,
  },
  {
    id: 'decorateur',
    label: "Décorateur d'événement",
    shortLabel: 'Décorateur',
    accent: '#a65d57',
    hint:
      'Forfait décoration ou prestation sur devis — précisez votre zone d\'intervention.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section Décorateur d'événement.

Nom / marque : [ ]
Ville : [ ]
Région : [ ]
Installation sur site : [ Oui / Non ]

Prestations : [ ex. Mariage, Baptême, Corporate, Décoration florale, Scénographie… ]
Tarification : [ ex. À partir de 500 € — forfait ou sur devis selon événement ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]

Spécialités déco : [ ex. Arche florale, centre de table, mise en lumière… ]`,
  },
  {
    id: 'location-voiture',
    label: 'Location voiture événement',
    shortLabel: 'Location auto',
    accent: '#3d3d3d',
    hint:
      'Tarif à la journée, demi-journée ou avec chauffeur — précisez les modèles proposés.',
    template: `Bonjour, je souhaite m'inscrire sur Bel Âge — section Location voiture événement.

Nom / agence : [ ]
Ville : [ ]
Région : [ ]
Avec chauffeur : [ Oui / Non / Les deux ]

Véhicules : [ ex. Vintage, Limousine, Voiture de luxe, Collection… ]
Tarification : [ ex. À partir de 400 €/jour — avec ou sans chauffeur ]

WhatsApp : [ 33XXXXXXXXX ]
Instagram : [ lien ou Non ] — Abonnés : [ ]
TikTok : [ lien ou Non ] — Abonnés : [ ]
E-mail : [ ou Non ]

Zone de service : [ ex. Département, région, France entière… ]`,
  },
]

/** @deprecated Utiliser INSCRIPTION_SECTIONS — conservé pour compatibilité */
export const INSCRIPTION_MESSAGE_TEMPLATE = INSCRIPTION_SECTIONS[0].template

export function getInscriptionSection(id) {
  return INSCRIPTION_SECTIONS.find((s) => s.id === id) ?? INSCRIPTION_SECTIONS[0]
}
