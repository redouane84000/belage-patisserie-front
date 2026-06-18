export const MASS = { mg: 0.001, g: 1, kg: 1000 }
export const VOL = { ml: 1, cl: 10, dl: 100, L: 1000 }

export const UNIT_LIST = ['g', 'kg', 'ml', 'cl', 'L', 'u']

export function unitFamily(u) {
  if (u in MASS) return MASS
  if (u in VOL) return VOL
  return null
}

export function toBase(q, u) {
  if (u === 'u' || u === 'piece') return q
  if (MASS[u] != null) return q * MASS[u]
  if (VOL[u] != null) return q * VOL[u]
  return NaN
}

/** Coût d'une quantité utilisée à partir d'un conditionnement acheté */
export function ingCost(packQty, packUnit, packPrice, useQty, useUnit) {
  packQty = +packQty
  packPrice = +packPrice
  useQty = +useQty
  if (!packQty || !packPrice || !useQty) return null
  if (packUnit === 'u' && useUnit === 'u') {
    return (packPrice / packQty) * useQty
  }
  const fp = unitFamily(packUnit)
  const fu = unitFamily(useUnit)
  if (!fp || !fu || fp !== fu) return null
  const packBase = packQty * fp[packUnit]
  const useBase = useQty * fu[useUnit]
  return (packPrice / packBase) * useBase
}

/** kW × (minutes/60) × tarif kWh */
export function energyCost(power, minutes, kwhRate) {
  power = +power
  minutes = +minutes
  if (!power || !minutes) return 0
  return power * (minutes / 60) * kwhRate
}

/** Desktop: durée en min ou heures */
export function energyCostFlexible(kw, duration, durationUnit, kwhRate) {
  const h = durationUnit === 'min' ? duration / 60 : duration
  return kw * h * kwhRate
}

export function defaultUseUnit(packUnit) {
  if (packUnit === 'u') return 'u'
  const fam = unitFamily(packUnit)
  if (fam === VOL) return 'ml'
  if (fam === MASS) return 'g'
  return 'g'
}

export function unitsCompatible(packUnit, useUnit) {
  if (packUnit === 'u' || useUnit === 'u') return packUnit === useUnit
  const fp = unitFamily(packUnit)
  const fu = unitFamily(useUnit)
  return fp && fu && fp === fu
}
