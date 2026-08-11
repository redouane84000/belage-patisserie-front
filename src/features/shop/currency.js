export const CURRENCY = 'EUR'
export const AED_TO_EUR = 0.2357

export function formatEuro(cents) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function productPriceCents(product, selectedOptions = {}) {
  const supplements = product.options.reduce((total, option) => {
    const valueId = selectedOptions[option.id]
    const value = option.values.find((item) => item.id === valueId)
    return total + (value?.priceCents ?? 0)
  }, 0)

  return product.basePriceCents + supplements
}

export function selectionSummary(product, selectedOptions) {
  return product.options.flatMap((option) => {
    const value = option.values.find((item) => item.id === selectedOptions[option.id])
    return value ? [{ option: option.label, value: value.label, priceCents: value.priceCents }] : []
  })
}
