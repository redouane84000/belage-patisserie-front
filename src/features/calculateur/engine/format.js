export const eur = (n) =>
  n == null || Number.isNaN(n)
    ? '—'
    : n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

export const eur0 = (n) =>
  n == null || Number.isNaN(n)
    ? '—'
    : n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €'

export const pct = (n) =>
  n == null || Number.isNaN(n) ? '—' : Math.round(n) + ' %'

export const pctDec = (n) =>
  n == null || Number.isNaN(n)
    ? '—'
    : (n * 100).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' %'

export const uid = () => Math.random().toString(36).slice(2, 9)

export function esc(s) {
  return String(s || '').replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  )
}
