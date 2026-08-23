export const TRAINING_PRODUCTS = {
  'layer-cake': { title: 'Formation Layer Cake', unitAmount: 100 },
  'flower-cupcake': { title: 'Formation Flower Cupcake', unitAmount: 6999 },
  'wedding-cake': { title: 'Formation Wedding Cake', unitAmount: 8999 },
}

const PACKS = {
  duo: { ids: ['layer-cake', 'flower-cupcake'], title: 'Pack Douceurs Signature', unitAmount: 11999 },
  trio: { ids: ['layer-cake', 'flower-cupcake', 'wedding-cake'], title: 'Pack Cake Designer', unitAmount: 17999 },
}

export function checkoutItem(courseIds) {
  const uniqueIds = [...new Set(courseIds)]
  if (!uniqueIds.length || uniqueIds.some((id) => !TRAINING_PRODUCTS[id])) return null

  const matchingPack = Object.values(PACKS).find(
    (pack) => pack.ids.length === uniqueIds.length && pack.ids.every((id) => uniqueIds.includes(id)),
  )

  if (matchingPack) {
    return { title: matchingPack.title, unitAmount: matchingPack.unitAmount, courseIds: matchingPack.ids }
  }

  return {
    title: uniqueIds.map((id) => TRAINING_PRODUCTS[id].title).join(' + '),
    unitAmount: uniqueIds.reduce((total, id) => total + TRAINING_PRODUCTS[id].unitAmount, 0),
    courseIds: uniqueIds,
  }
}
