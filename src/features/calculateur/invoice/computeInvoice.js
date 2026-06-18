export function computeInvoice(invoice) {
  const lines = (invoice.lines || []).map((l) => {
    const qty = +l.qty || 0
    const unitPrice = +l.unitPrice || 0
    const total = qty * unitPrice
    return { ...l, qty, unitPrice, total }
  })
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const vatRate = invoice.vatEnabled ? +invoice.vatRate || 0 : 0
  const vatAmount = subtotal * (vatRate / 100)
  const total = subtotal + vatAmount
  return { lines, subtotal, vatRate, vatAmount, total }
}
