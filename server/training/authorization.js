import { trainingUserRepository } from './usersRepository.js'
import { readCookie, verifySessionToken } from './security.js'

export async function currentTrainingUser(req) {
  const token = readCookie(req)
  const session = verifySessionToken(token)
  if (!session) return null

  const user = await trainingUserRepository.findById(session.sub)
  if (!user || !user.isActive || user.username !== session.username) return null
  if (user.expiresAt && new Date(user.expiresAt).getTime() < Date.now()) return null
  return user
}
