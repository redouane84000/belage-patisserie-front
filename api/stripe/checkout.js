import Stripe from 'stripe'
import { checkoutItem } from '../../server/stripe/catalog.js'
import { stripeSecretKey } from '../../server/stripe/config.js'

function readBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body
  try { return JSON.parse(req.body || '{}') } catch { return {} }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
  if (!stripeSecretKey) return res.status(503).json({ error: 'Le paiement est en cours de configuration.' })

  const { courseIds, firstName, lastName, email, phone } = readBody(req)
  const item = Array.isArray(courseIds) ? checkoutItem(courseIds) : null
  if (!item || !firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'Vérifiez les formations et vos coordonnées.' })
  }

  const stripe = new Stripe(stripeSecretKey)
  const origin = req.headers.origin || 'https://www.belagepatisserie.com'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    phone_number_collection: { enabled: true },
    line_items: [{ price_data: { currency: 'eur', product_data: { name: item.title }, unit_amount: item.unitAmount }, quantity: 1 }],
    metadata: { courseIds: item.courseIds.join(','), firstName, lastName, phone },
    success_url: `${origin}/formations/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/formations/annule`,
  })

  return res.status(200).json({ url: session.url })
}
