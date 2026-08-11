import { currentTrainingUser } from '../../../server/training/authorization.js'
import { courseById } from '../../../server/training/courses.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })

  try {
    const user = await currentTrainingUser(req)
    if (!user) return res.status(401).json({ error: 'Session expirée.' })

    const courseId = Array.isArray(req.query.courseId) ? req.query.courseId[0] : req.query.courseId
    const course = courseById(courseId)
    if (!course) return res.status(404).json({ error: 'Formation introuvable.' })
    if (!user.purchasedCourses.includes(courseId)) return res.status(403).json({ error: 'Accès non autorisé.' })

    return res.status(200).json({ course })
  } catch {
    return res.status(500).json({ error: 'Une erreur est survenue. Réessayez plus tard.' })
  }
}
