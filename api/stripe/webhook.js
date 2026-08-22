import Stripe from 'stripe'
import { checkoutItem } from '../../server/stripe/catalog.js'
import { stripeSecretKey, stripeWebhookSecret } from '../../server/stripe/config.js'

export const config = { api: { bodyParser: false } }

async function rawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')
  if (!stripeSecretKey || !stripeWebhookSecret) return res.status(503).send('Webhook unavailable')

  try {
    const stripe = new Stripe(stripeSecretKey)
    const signature = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(await rawBody(req), signature, stripeWebhookSecret)

    if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
      const session = event.data.object
      const courseIds = session.metadata?.courseIds?.split(',') || []
      const item = checkoutItem(courseIds)
      if (!item) return res.status(400).send('Invalid course selection')
      // Accès volontairement géré manuellement pendant le lancement : retrouvez cette commande dans Stripe.
      console.info('Formation payment confirmed', { sessionId: session.id, email: session.customer_details?.email, courseIds: item.courseIds })
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error.message)
    return res.status(400).send('Webhook signature verification failed')
  }
}
