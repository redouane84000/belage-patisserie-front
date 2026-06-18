import { patissieres } from '../../../data/patissieres'
import { photographes } from '../../../data/photographes'

const BELAGE_FULL_ADDRESS = "10 Rue de l'Arménie\n84000 Avignon, France"

function formatPhone(raw) {
  if (!raw) return ''
  const digits = String(raw).replace(/\D/g, '')
  if (digits.length < 10) return raw
  const local = digits.startsWith('33') ? `0${digits.slice(2)}` : digits.startsWith('0') ? digits : `0${digits}`
  return local.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

function patissiereToCompany(p) {
  return {
    id: `annuaire-p-${p.id}`,
    name: p.nom,
    address: p.id === 1 ? BELAGE_FULL_ADDRESS : [p.ville, p.region].filter(Boolean).join(', '),
    email: p.email || '',
    phone: formatPhone(p.whatsapp),
    logo: p.image || null,
    preset: true,
    annuaire: true,
    category: 'Pâtissière',
    ville: p.ville,
    region: p.region,
  }
}

function photographeToCompany(p) {
  return {
    id: `annuaire-ph-${p.id}`,
    name: p.nom,
    address: [p.ville, p.region].filter(Boolean).join(', '),
    email: p.email || '',
    phone: formatPhone(p.whatsapp),
    logo: p.image || null,
    preset: true,
    annuaire: true,
    category: 'Photo / Vidéo',
    ville: p.ville,
    region: p.region,
  }
}

/** Toutes les fiches contact de l'annuaire Bel Âge */
export function getAnnuaireCompanies() {
  return [...patissieres.map(patissiereToCompany), ...photographes.map(photographeToCompany)]
}

export function filterAnnuaireCompanies(list, query) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.ville?.toLowerCase().includes(q) ||
      c.region?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q),
  )
}
