import { ADHOC_COMPANY_ID } from './invoiceDefaults'
import { getAnnuaireCompanies } from './invoiceAnnuaire'

const COMPANIES_KEY = 'belage_invoice_companies'
const INVOICES_KEY = 'belage_saved_invoices'

function get(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota */
  }
}

export function loadCustomCompanies() {
  return get(COMPANIES_KEY, []) ?? []
}

export function saveCustomCompanies(list) {
  set(COMPANIES_KEY, list)
}

/** Annuaire site + entreprises enregistrées par l'utilisateur */
export function getCompanyLists() {
  const annuaire = getAnnuaireCompanies()
  const custom = loadCustomCompanies().filter((c) => !c.annuaire && c.id !== 'settings-shop')
  return { annuaire, custom }
}

export function findCompanyById(id) {
  if (id === ADHOC_COMPANY_ID) return null
  const { annuaire, custom } = getCompanyLists()
  return [...annuaire, ...custom].find((c) => c.id === id) || annuaire[0] || null
}

export function upsertCustomCompany(company) {
  const list = loadCustomCompanies().filter((c) => c.id !== company.id)
  list.unshift(company)
  saveCustomCompanies(list)
  return list
}

export function deleteCustomCompany(id) {
  if (String(id).startsWith('annuaire-')) return loadCustomCompanies()
  const list = loadCustomCompanies().filter((c) => c.id !== id)
  saveCustomCompanies(list)
  return list
}

/* ── Factures enregistrées ── */

export function loadSavedInvoices() {
  return get(INVOICES_KEY, []) ?? []
}

export function saveInvoiceRecord(invoice) {
  const list = loadSavedInvoices()
  const savedId = invoice.savedId || `inv-${Date.now()}`
  const record = {
    ...invoice,
    savedId,
    updatedAt: new Date().toISOString(),
  }
  const idx = list.findIndex((i) => i.savedId === savedId)
  if (idx >= 0) list[idx] = record
  else list.unshift(record)
  set(INVOICES_KEY, list.slice(0, 40))
  return record
}

export function deleteSavedInvoice(savedId) {
  set(
    INVOICES_KEY,
    loadSavedInvoices().filter((i) => i.savedId !== savedId),
  )
}

/** @deprecated */
export function listAllCompanies(settings) {
  const { annuaire, custom } = getCompanyLists()
  return [...annuaire, ...custom]
}