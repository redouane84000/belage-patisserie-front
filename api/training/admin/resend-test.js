import { Resend } from 'resend'
import { currentTrainingUser } from '../../../server/training/authorization.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const user = await currentTrainingUser(req)
  if (!user || (user.role !== 'admin' && user.username !== 'redktm')) {
    return res.status(403).json({ error: 'Accès administrateur requis.' })
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'RESEND_API_KEY absente.' })

  const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'Belage Formation <formation@belagepatisserie.com>',
    to: 'redouanektm@hotmail.fr',
    subject: 'Test Resend Belage',
    html: '<p>Resend fonctionne correctement.</p>',
  })
  if (error) {
    console.error('[Resend test] send failed:', error.message)
    return res.status(502).json({ error: error.message })
  }
  console.info('[Resend test] send success', { id: data?.id })
  return res.status(200).json({ success: true, id: data?.id })
}
