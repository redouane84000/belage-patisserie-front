import { ingCost, energyCost } from './units'

/**
 * Calcul unifié mobile + desktop.
 * @param {object} draft
 * @param {object} settings
 */
export function compute(draft, settings) {
  const ing = (draft.ingredients || []).reduce(
    (s, x) => s + (ingCost(x.packQty, x.packUnit, x.packPrice, x.useQty, x.useUnit) || 0),
    0,
  )
  const pack = (draft.packaging || []).reduce(
    (s, x) => s + ((+x.unitPrice || 0) * (+x.qty || 0)),
    0,
  )
  const energy = (draft.energy || []).reduce((s, x) => {
    if (x.durationUnit) {
      const h = x.durationUnit === 'min' ? (+x.minutes || +x.duration || 0) / 60 : (+x.duration || 0)
      return s + (+x.power || +x.kw || 0) * h * settings.kwh
    }
    return s + energyCost(x.power, x.minutes, settings.kwh)
  }, 0)

  const countHours = draft.countHours !== false
  const labor = countHours
    ? ((+draft.hours || 0) + (+draft.minutes || 0) / 60) * (+draft.hourlyRate || settings.hourlyRate || 0)
    : 0
  const fixed = +draft.fixed || 0

  const costNoHours = ing + pack + energy + fixed
  const costFull = costNoHours + labor
  const cost = countHours ? costFull : costNoHours

  const m = (+draft.margin || settings.margin || 0) / 100
  const priceFull = m < 1 ? costFull / (1 - m) : costFull
  const priceNoHours = m < 1 ? costNoHours / (1 - m) : costNoHours
  const suggested = countHours ? priceFull : priceNoHours

  const price = +draft.currentPrice || +draft.price || 0
  const marginEur = price > 0 ? price - cost : null
  const marginRate = price > 0 ? (marginEur / price) * 100 : null
  const roi = costFull > 0 && price > 0 ? (marginEur / costFull) * 100 : null

  const servings = Math.max(1, +draft.servings || 1)
  const modLo = settings.modLo ?? 15
  const excHi = settings.excHi ?? 35

  let level = 'low'
  if (marginRate == null) level = 'neutral'
  else if (marginRate >= excHi) level = 'exc'
  else if (marginRate >= modLo) level = 'mod'

  return {
    ing,
    pack,
    energy,
    labor,
    fixed,
    costNoHours,
    costFull,
    cost,
    priceFull,
    priceNoHours,
    suggested,
    price,
    marginEur,
    marginRate,
    roi,
    servings,
    costPerPart: cost / servings,
    pricePerPart: price > 0 ? price / servings : 0,
    suggestedPerPart: suggested / servings,
    level,
    gap: price > 0 ? price - suggested : null,
    marginDecimal: marginRate != null ? marginRate / 100 : null,
  }
}
