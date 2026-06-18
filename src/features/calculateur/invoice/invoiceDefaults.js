export const ADHOC_COMPANY_ID = 'adhoc'

export function blankInvoiceLine() {
  return { id: Math.random().toString(36).slice(2, 9), label: '', qty: 1, unitPrice: 0 }
}

export function blankInvoice() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    companyId: 'annuaire-p-1',
    adhocCompany: blankCustomCompany(),
    number: '',
    date: today,
    clientName: '',
    clientAddress: '',
    lines: [blankInvoiceLine()],
    vatEnabled: false,
    vatRate: 20,
    notes: '',
  }
}

export function blankCustomCompany() {
  return {
    id: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: null,
  }
}

export function invoicePdfName(invoice, companyName) {
  const num = invoice.number?.trim()
  const client = invoice.clientName?.trim()
  if (num && client) return `Facture-${num}-${client}`
  if (num) return `Facture-${num}`
  if (client) return `Facture-${client}`
  if (companyName) return `Facture-${companyName}`
  return 'Facture'
}
