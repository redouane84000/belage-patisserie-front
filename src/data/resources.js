/**
 * Ressources Bel Âge — enregistrées pour usage site / CTAs / téléchargements.
 * Mis à jour : juin 2026
 */

/** Prise de rendez-vous (Calendly) */
export const CALENDLY_NOUVELLE_REUNION =
  'https://calendly.com/redouanektm/nouvelle-reunion'

/** Ebook premium Bel Âge (PDF servi depuis /public) */
export const EBOOK_PREMIUM = {
  title: 'Ebook Bel Âge Pâtisserie — Premium',
  url: '/documents/ebook-bel-age-patisserie-premium.pdf',
  sourceFile: 'Ebook_Bel_Age_Patisserie_PREMIUM (1).pdf',
}

/** WhatsApp Bel Âge Pâtisserie (fiche profil id 1) */
export const BEL_AGE_WHATSAPP = '33663962540'
export const BEL_AGE_WHATSAPP_DISPLAY = '06 63 96 25 40'
export const BEL_AGE_WHATSAPP_URL = `https://wa.me/${BEL_AGE_WHATSAPP}`

/** Comptes officiels Bel Âge */
export const BEL_AGE_SOCIAL = {
  instagram: 'https://instagram.com/belage_patisserie',
  instagramHandle: '@belage_patisserie',
  tiktok: 'https://tiktok.com/@belage_patisserie',
  tiktokHandle: '@belage_patisserie',
}

/** Modèle pâtissière — voir inscriptionTemplates.js pour toutes les sections */
export { INSCRIPTION_MESSAGE_TEMPLATE } from './inscriptionTemplates'

/** Critères qualité — Bel Âge peut refuser une inscription */
export const INSCRIPTION_ACCEPTANCE_INTRO =
  'Bel Âge Pâtisserie se réserve le droit de refuser une inscription afin de garantir une bonne expérience aux clients. Aucun minimum d’abonnés : une pâtissière avec 300 abonnés et de très belles créations peut tout à fait être acceptée — l’annuaire est fait pour vous donner de la visibilité.'

export const INSCRIPTION_ACCEPTANCE_CRITERIA = [
  'Au moins 6 à 10 vraies photos de vos créations sur votre profil',
  'Au moins 10 vidéos de créations différentes sur Instagram et/ou TikTok',
  'Une ville ou zone d’activité claire',
  'Un Instagram ou TikTok réel et actif (si vous souhaitez l’afficher sur la fiche)',
  'Des spécialités claires : wedding cake, layer cake, number cake, cupcakes, pâtisserie fine, etc.',
  'Un prix à la part cohérent (à partir de 3 €/part)',
  'Pas de photos volées, pas de compte vide, pas de profil douteux',
]

export default {
  calendly: CALENDLY_NOUVELLE_REUNION,
  ebook: EBOOK_PREMIUM,
  whatsapp: BEL_AGE_WHATSAPP,
  social: BEL_AGE_SOCIAL,
}
