import { createClient } from '@supabase/supabase-js'
import { normalizeUsername } from '../training/security.js'

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
const publishable = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.Publishable_key
const authOptions = { auth: { autoRefreshToken: false, persistSession: false } }

export const hasSupabase = Boolean(url && secret)
export const supabaseAdmin = hasSupabase
  ? createClient(url, secret, authOptions)
  : null

// Password login must use the publishable/anon key. The service-role client
// can look up profiles, but GoTrue password grant is unreliable with it.
const supabaseAuth = url && publishable
  ? createClient(url, publishable, authOptions)
  : null

function loginKey(value) {
  return normalizeUsername(value)
}

function profileLoginKeys(profile) {
  const first = loginKey(profile.first_name)
  const last = loginKey(profile.last_name)
  const keys = new Set([
    loginKey(profile.username),
    first,
    last,
    loginKey(`${profile.first_name || ''}${profile.last_name || ''}`),
    loginKey(`${profile.last_name || ''}${profile.first_name || ''}`),
  ].filter(Boolean))
  if (first === 'sarah') {
    keys.add('sarrah')
    keys.add(loginKey(`${profile.last_name || ''}sarrah`))
    keys.add(loginKey(`sarrah${profile.last_name || ''}`))
  }
  return keys
}

export async function findProfileByLogin(identifier) {
  if (!supabaseAdmin) return null
  const raw = String(identifier || '').trim()
  if (!raw) return null

  if (raw.includes('@')) {
    const { data } = await supabaseAdmin.from('profiles').select('*').eq('email', raw.toLowerCase()).maybeSingle()
    return data
  }

  const username = loginKey(raw)
  if (!username) return null
  const { data: byUsername } = await supabaseAdmin.from('profiles').select('*').eq('username', username).maybeSingle()
  if (byUsername) return byUsername

  const { data: profiles = [] } = await supabaseAdmin.from('profiles').select('*').eq('is_active', true)
  const matches = profiles.filter((profile) => profileLoginKeys(profile).has(username))
  return matches.length === 1 ? matches[0] : null
}

export async function supabaseTrainingUserById(id) {
  if (!supabaseAdmin) return null
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('auth_user_id', id).maybeSingle()
  if (!profile) return null
  const { data: access = [] } = await supabaseAdmin.from('course_access').select('course_id').eq('user_id', profile.id).eq('active', true)
  return { id: profile.auth_user_id, firstName: profile.first_name, username: profile.username, purchasedCourses: access.map((item) => item.course_id), isActive: profile.is_active, role: profile.role, email: profile.email }
}

export async function authenticateSupabaseUser(identifier, password) {
  const authClient = supabaseAuth || supabaseAdmin
  if (!supabaseAdmin || !authClient) return null
  const profile = await findProfileByLogin(identifier)
  if (!profile?.is_active || !profile.email) return null
  const { data, error } = await authClient.auth.signInWithPassword({ email: profile.email, password })
  if (error || !data.user || data.user.id !== profile.auth_user_id) return null
  return supabaseTrainingUserById(data.user.id)
}
