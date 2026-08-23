import { currentTrainingUser } from '../../../server/training/authorization.js'
import { trainingUserRepository } from '../../../server/training/usersRepository.js'
import { supabaseAdmin } from '../../../server/supabase/admin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const admin = await currentTrainingUser(req)
  if (!admin || (admin.role !== 'admin' && admin.username !== 'redktm')) {
    return res.status(403).json({ error: 'Accès administrateur requis.' })
  }

  if (supabaseAdmin) {
    const { data: profiles, error } = await supabaseAdmin.from('profiles').select('id, first_name, username, email, role, created_at, is_active, course_access(course_id, active)').neq('role', 'admin')
    if (error) throw error
    return res.status(200).json({ users: profiles.map((profile) => ({ id: profile.id, firstName: profile.first_name, username: profile.username, email: profile.email, purchasedCourses: profile.course_access.filter((access) => access.active).map((access) => access.course_id), isActive: profile.is_active, createdAt: profile.created_at })) })
  }
  const users = await trainingUserRepository.list()
  return res.status(200).json({
    users: users
      .filter((user) => user.role !== 'admin')
      .map(({ id, firstName, username, purchasedCourses, isActive, createdAt, expiresAt }) => ({ id, firstName, username, purchasedCourses, isActive, createdAt, expiresAt })),
  })
}
