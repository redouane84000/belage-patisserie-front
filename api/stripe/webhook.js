import Stripe from 'stripe'
import crypto from 'node:crypto'
import { checkoutItem } from '../../server/stripe/catalog.js'
import { stripeSecretKey, stripeWebhookSecret } from '../../server/stripe/config.js'
import { supabaseAdmin } from '../../server/supabase/admin.js'
import { sendTrainingPurchaseEmail } from '../../server/email/training.js'

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
    console.info('[Stripe Webhook] event received', { type: event.type })

    if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
      console.info('[Stripe Webhook] payment confirmed')
      if (!supabaseAdmin) {
        console.error('[Stripe Webhook] Supabase unavailable')
        return res.status(503).send('Supabase unavailable')
      }
      const session = event.data.object
      const courseIds = session.metadata?.courseIds?.split(',') || []
      const item = checkoutItem(courseIds)
      if (!item) return res.status(400).send('Invalid course selection')
      if (session.amount_total !== item.unitAmount || session.currency !== 'eur') {
        console.error('Stripe amount mismatch', { sessionId: session.id })
        return res.status(400).send('Amount validation failed')
      }
      const { data: existingPurchase } = await supabaseAdmin.from('purchases').select('id').eq('stripe_checkout_session_id', session.id).maybeSingle()
      if (existingPurchase) return res.status(200).json({ received: true, duplicate: true })

      const email = session.customer_details?.email || session.customer_email
      if (!email) return res.status(400).send('Customer email missing')
      console.info('[Stripe Webhook] customer email found')
      const firstName = session.metadata?.firstName || 'Cliente'
      const lastName = session.metadata?.lastName || null
      let { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('email', email.toLowerCase()).maybeSingle()
      let password
      let isNew = false
      if (!profile) {
        isNew = true
        let username
        do {
          username = `belage-${crypto.randomInt(10000, 100000)}`
          const { data } = await supabaseAdmin.from('profiles').select('id').eq('username', username).maybeSingle()
          if (!data) break
        } while (true)
        password = crypto.randomBytes(18).toString('base64url')
        const { data: auth, error: authError } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })
        if (authError) throw authError
        const { data, error } = await supabaseAdmin.from('profiles').insert({ auth_user_id: auth.user.id, email: email.toLowerCase(), username, first_name: firstName, last_name: lastName }).select('*').single()
        if (error) throw error
        profile = data
      }
      const { error: purchaseError } = await supabaseAdmin.from('purchases').insert({
        user_id: profile.id, stripe_checkout_session_id: session.id, stripe_payment_intent_id: session.payment_intent || null,
        course_id: item.courseIds.join(','), course_name: item.title, amount: item.unitAmount, currency: 'eur', status: 'paid',
      })
      if (purchaseError?.code === '23505') return res.status(200).json({ received: true, duplicate: true })
      if (purchaseError) throw purchaseError
      const { error: accessError } = await supabaseAdmin.from('course_access').upsert(item.courseIds.map((course_id) => ({ user_id: profile.id, course_id, active: true })), { onConflict: 'user_id,course_id' })
      if (accessError) throw accessError
      console.info('[Stripe Webhook] Supabase account processed')
      await sendTrainingPurchaseEmail({ email, firstName, lastName, courseName: item.title, amount: item.unitAmount, username: profile.username, password, isNew, orderReference: session.id })
      await supabaseAdmin.from('purchases').update({ email_sent_at: new Date().toISOString() }).eq('stripe_checkout_session_id', session.id)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error.message)
    return res.status(400).send('Webhook signature verification failed')
  }
}
