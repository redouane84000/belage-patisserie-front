import bcrypt from 'bcryptjs'
import { trainingUserRepository } from '../../server/training/usersRepository.js'
import { currentTrainingUser } from '../../server/training/authorization.js'
import {
  clearSessionCookie,
  createSessionToken,
  normalizeUsername,
  publicUser,
  setSessionCookie,
} from '../../server/training/security.js'
import { authenticateSupabaseUser } from '../../server/supabase/admin.js'

const GENERIC_LOGIN_ERROR = 'Identifiant ou mot de passe incorrect.'

async function readBody(req) {
  let body
  try {
    body = req.body
  } catch (error) {
    console.error('Training login body getter failed:', error.message)
    return {}
  }

  if (Buffer.isBuffer(body)) {
    const raw = body.toString('utf8').trim()
    if (!raw) return {}
    try { return JSON.parse(raw) } catch { return {} }
  }

  if (typeof body === 'string') {
    const raw = body.trim()
    if (!raw) return {}
    try { return JSON.parse(raw) } catch { return {} }
  }

  if (body && typeof body === 'object' && !Array.isArray(body)) return body
  return {}
}

export default async function handler(req, res) {
  const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action

  try {
    if (action === 'login') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
      const { username, password } = await readBody(req)
      const identifier = String(username || '').trim()
      const secret = typeof password === 'string' ? password : ''
      const normalized = normalizeUsername(identifier)
      let supabaseUser = null
      try {
        supabaseUser = identifier && secret ? await authenticateSupabaseUser(identifier, secret) : null
      } catch (error) {
        console.error('Supabase login path failed, falling back to legacy:', error.message)
      }
      const legacyUser = supabaseUser ? null : (normalized ? await trainingUserRepository.findByUsername(normalized) : null)
      const validLegacy = Boolean(legacyUser && legacyUser.isActive && (!legacyUser.expiresAt || new Date(legacyUser.expiresAt).getTime() >= Date.now()) && secret && await bcrypt.compare(secret, legacyUser.passwordHash))
      const user = supabaseUser ?? legacyUser
      const valid = Boolean(supabaseUser || validLegacy)

      console.info('training login', { hasIdentifier: Boolean(identifier), hasPassword: Boolean(secret), supabase: Boolean(supabaseUser), legacy: Boolean(validLegacy) })
      if (!valid) return res.status(401).json({ error: GENERIC_LOGIN_ERROR })
      setSessionCookie(res, createSessionToken(user))
      return res.status(200).json({ authenticated: true, user: publicUser(user) })
    }

    if (action === 'logout') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
      clearSessionCookie(res)
      return res.status(204).end()
    }

    if (action === 'session') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })
      const user = await currentTrainingUser(req)
      if (!user) return res.status(401).json({ authenticated: false })
      return res.status(200).json({ authenticated: true, user: publicUser(user) })
    }

    if (action === 'courses') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })
      const user = await currentTrainingUser(req)
      if (!user) return res.status(401).json({ error: 'Session expirée.' })
      return res.status(200).json({ courses: user.purchasedCourses })
    }

    return res.status(404).json({ error: 'Route introuvable.' })
  } catch (error) {
    console.error('Training API request failed:', error)
    const response = { error: 'Une erreur est survenue. Réessayez plus tard.' }
    if (process.env.NODE_ENV !== 'production') response.detail = error.message
    return res.status(500).json(response)
  }
}
