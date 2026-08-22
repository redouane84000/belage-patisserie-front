import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Le paiement est en cours de configuration.' })

  const sessionId = String(req.query.session_id || '')
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return res.status(400).json({ error: 'Référence de paiement invalide.' })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return res.status(200).json({
      status: session.status,
      paymentStatus: session.payment_status,
    })
  } catch {
    return res.status(404).json({ error: 'Paiement introuvable.' })
  }
}
