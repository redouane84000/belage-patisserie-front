/** Prix à la part (€) — source unique pour affichage et filtres */
export function getPricePerSlice(p) {
  if (p.pricePerSlice != null) return Number(p.pricePerSlice)
  if (p.prix_part != null) return Number(p.prix_part)
  return null
}

/** Ex. « À partir de 6,50 €/part » */
export function formatPricePerSlice(price) {
  const n = Number(price)
  if (Number.isNaN(n)) return '—'
  const value =
    n % 1 === 0 ? String(n) : n.toFixed(2).replace('.', ',')
  return `À partir de ${value} €/part`
}

/** Tarif fiche annuaire — prix à la part ou libellé sur devis */
export function formatProviderPrice(p) {
  if (p.priceLabel) return p.priceLabel
  const slice = getPricePerSlice(p)
  if (slice == null) return 'Sur devis'
  return formatPricePerSlice(slice)
}

export function providerPriceCaption(sectionId) {
  return sectionId === 'patisserie' ? 'Prix à la part' : 'Tarif'
}
