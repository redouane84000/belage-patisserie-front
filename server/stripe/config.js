// Supports the existing Vercel variable names while keeping standard Stripe names available.
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env['clé_bel_age']
export const stripeWebhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET || process.env['SECRET DU WEBHOOK STRIPE']
