import { currentTrainingUser } from '../../../server/training/authorization.js'
import { trainingUserRepository } from '../../../server/training/usersRepository.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const admin = await currentTrainingUser(req)
  if (!admin || (admin.role !== 'admin' && admin.username !== 'redktm')) {
    return res.status(403).json({ error: 'Accès administrateur requis.' })
  }

  const users = await trainingUserRepository.list()
  return res.status(200).json({
    users: users
      .filter((user) => user.role !== 'admin')
      .map(({ id, firstName, username, purchasedCourses, isActive, createdAt, expiresAt }) => ({ id, firstName, username, purchasedCourses, isActive, createdAt, expiresAt })),
  })
}
