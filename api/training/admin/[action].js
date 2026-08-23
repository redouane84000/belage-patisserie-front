import crypto from 'node:crypto'
import { currentTrainingUser } from '../../../server/training/authorization.js'
import { supabaseAdmin } from '../../../server/supabase/admin.js'
import { COURSE_IDS } from '../../../server/training/constants.js'

const password = () => crypto.randomBytes(18).toString('base64url')
const username = () => `belage-${crypto.randomInt(10000, 100000)}`
const body = (req) => typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}')
async function admin(req) {
  const user = await currentTrainingUser(req)
  return user && (user.role === 'admin' || user.username === 'redktm') ? user : null
}
function courses(value) {
  const ids = [...new Set(Array.isArray(value) ? value : [])]
  if (ids.some((id) => !COURSE_IDS.includes(id))) throw new Error('Formation invalide.')
  return ids
}

export default async function handler(req, res) {
  const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action
  if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase indisponible.' })
  if (!await admin(req)) return res.status(403).json({ error: 'Accès administrateur requis.' })
  try {
    const data = body(req)
    if (action === 'add' && req.method === 'POST') {
      const firstName = String(data.firstName || '').trim(); const email = String(data.email || '').trim().toLowerCase(); const selectedCourses = courses(data.courseIds)
      if (!firstName || !email) return res.status(400).json({ error: 'Prénom et e-mail obligatoires.' })
      let generatedUsername; do { generatedUsername = username(); const { data: found } = await supabaseAdmin.from('profiles').select('id').eq('username', generatedUsername).maybeSingle(); if (!found) break } while (true)
      const generatedPassword = password()
      const { data: auth, error: authError } = await supabaseAdmin.auth.admin.createUser({ email, password: generatedPassword, email_confirm: true })
      if (authError) throw authError
      const { data: profile, error } = await supabaseAdmin.from('profiles').insert({ auth_user_id: auth.user.id, email, username: generatedUsername, first_name: firstName, last_name: data.lastName || null }).select('*').single()
      if (error) throw error
      if (selectedCourses.length) await supabaseAdmin.from('course_access').insert(selectedCourses.map((course_id) => ({ user_id: profile.id, course_id })))
      return res.status(201).json({ user: { ...profile, purchasedCourses: selectedCourses }, username: generatedUsername, password: generatedPassword })
    }
    const id = String(data.id || '')
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).maybeSingle()
    if (!profile) return res.status(404).json({ error: 'Cliente introuvable.' })
    if (action === 'reset-password' && req.method === 'POST') {
      const generatedPassword = password(); const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.auth_user_id, { password: generatedPassword }); if (error) throw error
      return res.status(200).json({ password: generatedPassword })
    }
    if (action === 'toggle' && req.method === 'POST') {
      const { error } = await supabaseAdmin.from('profiles').update({ is_active: !profile.is_active }).eq('id', id); if (error) throw error
      return res.status(200).json({ isActive: !profile.is_active })
    }
    if (action === 'delete' && req.method === 'POST') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(profile.auth_user_id); if (error) throw error
      return res.status(204).end()
    }
    if (action === 'update-courses' && req.method === 'POST') {
      const selectedCourses = courses(data.courseIds); await supabaseAdmin.from('course_access').delete().eq('user_id', id)
      if (selectedCourses.length) { const { error } = await supabaseAdmin.from('course_access').insert(selectedCourses.map((course_id) => ({ user_id: id, course_id }))); if (error) throw error }
      return res.status(200).json({ purchasedCourses: selectedCourses })
    }
    return res.status(404).json({ error: 'Action inconnue.' })
  } catch (error) { return res.status(400).json({ error: error.message || 'Action impossible.' }) }
}
