import { currentTrainingUser } from '../../../../server/training/authorization.js'
import { courseById } from '../../../../server/training/courses.js'

/**
 * Authorization gate reserved for protected video storage.
 * No paid video URL is exposed yet: connect a signed private storage provider here later.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })

  try {
    const user = await currentTrainingUser(req)
    if (!user) return res.status(401).json({ error: 'Session expirée.' })
    const courseId = Array.isArray(req.query.courseId) ? req.query.courseId[0] : req.query.courseId
    const lessonId = Array.isArray(req.query.lessonId) ? req.query.lessonId[0] : req.query.lessonId
    const course = courseById(courseId)
    const lessonExists = course?.modules.some((module) => module.lessons.some((lesson) => lesson.id === lessonId))
    if (
      !user ||
      (!user.isAdmin && user.role !== 'admin' && !user.purchasedCourses.includes(courseId)) ||
      !lessonExists
    ) {
      return res.status(403).json({ error: 'Accès non autorisé.' })
    }

    return res.status(501).json({
      error: 'Vidéo indisponible.',
      detail: 'Connectez un stockage vidéo privé à cette route avant de publier les contenus payants.',
    })
  } catch {
    return res.status(500).json({ error: 'Une erreur est survenue.' })
  }
}
