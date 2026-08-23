import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY

export const hasSupabase = Boolean(url && secret)
export const supabaseAdmin = hasSupabase
  ? createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } })
  : null

export async function supabaseTrainingUserById(id) {
  if (!supabaseAdmin) return null
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('auth_user_id', id).maybeSingle()
  if (!profile) return null
  const { data: access = [] } = await supabaseAdmin.from('course_access').select('course_id').eq('user_id', profile.id).eq('active', true)
  return { id: profile.auth_user_id, firstName: profile.first_name, username: profile.username, purchasedCourses: access.map((item) => item.course_id), isActive: profile.is_active, role: profile.role, email: profile.email }
}

export async function authenticateSupabaseUser(username, password) {
  if (!supabaseAdmin) return null
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('username', username).maybeSingle()
  if (!profile) return null
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email: profile.email, password })
  if (error || !data.user || data.user.id !== profile.auth_user_id) return null
  return supabaseTrainingUserById(data.user.id)
}
