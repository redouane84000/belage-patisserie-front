import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { COURSE_IDS } from '../server/training/constants.js'
import { normalizeUsername } from '../server/training/security.js'
import { trainingUserRepository } from '../server/training/usersRepository.js'

const action = process.argv[2]
const rl = createInterface({ input, output })

function option(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function printCourses(courses) {
  return courses.length ? courses.join(', ') : 'Aucune'
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?'
  return Array.from(crypto.randomBytes(18), (byte) => chars[byte % chars.length]).join('')
}

function uniqueUsername(firstName, users, desired) {
  const base = normalizeUsername(desired || firstName)
  if (!base) throw new Error('Le prénom ou identifiant est invalide.')
  if (!users.some((user) => user.username === base)) return base
  let suffix = 2
  while (users.some((user) => user.username === `${base}${suffix}`)) suffix += 1
  return `${base}${suffix}`
}

function parseCourses(value) {
  const selected = value.split(',').map((item) => item.trim()).filter(Boolean)
  const invalid = selected.filter((item) => !COURSE_IDS.includes(item))
  if (invalid.length) throw new Error(`Formation(s) inconnue(s) : ${invalid.join(', ')}`)
  return [...new Set(selected)]
}

async function askUsername(users) {
  const supplied = process.argv[3] || await rl.question('Identifiant du client : ')
  const normalized = normalizeUsername(supplied)
  const user = users.find((item) => item.username === normalized)
  if (!user) throw new Error('Client introuvable.')
  return { users, user, normalized }
}

async function add() {
  const users = await trainingUserRepository.list()
  const nonInteractive = Boolean(option('--first-name'))
  const firstName = (option('--first-name') ?? await rl.question('Prénom : ')).trim()
  const requestedUsername = option('--username') ?? (nonInteractive ? '' : await rl.question('Identifiant souhaité (Entrée = généré) : '))
  const courses = parseCourses(option('--courses') ?? await rl.question(`Formations (${COURSE_IDS.join(', ')}) : `))
  const active = (option('--active') ?? (nonInteractive ? 'o' : await rl.question('Compte actif ? (o/n, défaut o) : '))).trim().toLowerCase() !== 'n'
  const expiresAtRaw = (option('--expires-at') ?? (nonInteractive ? '' : await rl.question('Expiration ISO optionnelle (YYYY-MM-DD, Entrée = aucune) : '))).trim()
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw).toISOString() : undefined
  if (!firstName) throw new Error('Le prénom est obligatoire.')

  const username = uniqueUsername(firstName, users, requestedUsername)
  const password = generatePassword()
  const user = {
    id: `client_${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`,
    firstName,
    username,
    passwordHash: await bcrypt.hash(password, 12),
    purchasedCourses: courses,
    isActive: active,
    createdAt: new Date().toISOString(),
    ...(expiresAt ? { expiresAt } : {}),
  }
  await trainingUserRepository.write([...users, user])

  console.log('\nClient créé avec succès.\n')
  console.log(`Prénom : ${user.firstName}`)
  console.log(`Identifiant : ${user.username}`)
  console.log(`Mot de passe : ${password}`)
  console.log('\nFormations autorisées :')
  user.purchasedCourses.forEach((course) => console.log(`- ${course}`))
  console.log('\nImportant : copiez ce mot de passe maintenant. Il ne sera jamais enregistré en clair.')
}

async function list() {
  const users = await trainingUserRepository.list()
  if (!users.length) return console.log('Aucun client enregistré.')
  console.table(users.map((user) => ({
    prénom: user.firstName,
    identifiant: user.username,
    formations: printCourses(user.purchasedCourses),
    statut: user.isActive ? 'actif' : 'désactivé',
    créé_le: user.createdAt.slice(0, 10),
    expire_le: user.expiresAt?.slice(0, 10) ?? '—',
  })))
}

async function updateStatus(isActive) {
  const users = await trainingUserRepository.list()
  const { user, normalized } = await askUsername(users)
  await trainingUserRepository.write(users.map((item) => item.username === normalized ? { ...item, isActive } : item))
  console.log(`${user.firstName} est maintenant ${isActive ? 'actif·ve' : 'désactivé·e'}.`)
}

async function updateCourses() {
  const users = await trainingUserRepository.list()
  const { user, normalized } = await askUsername(users)
  const courses = parseCourses(await rl.question(`Nouvelles formations (${COURSE_IDS.join(', ')}) : `))
  await trainingUserRepository.write(users.map((item) => item.username === normalized ? { ...item, purchasedCourses: courses } : item))
  console.log(`Formations mises à jour : ${printCourses(courses)}.`)
}

async function resetPassword() {
  const users = await trainingUserRepository.list()
  const { user, normalized } = await askUsername(users)
  const password = generatePassword()
  await trainingUserRepository.write(users.map((item) => item.username === normalized
    ? { ...item, passwordHash: bcrypt.hashSync(password, 12) }
    : item))
  console.log(`\nMot de passe temporaire de ${user.firstName} : ${password}`)
  console.log('Copiez-le maintenant : il ne sera pas enregistré en clair.')
}

async function remove() {
  const users = await trainingUserRepository.list()
  const { user, normalized } = await askUsername(users)
  const confirmation = (await rl.question(`Supprimer définitivement ${user.firstName} ? (oui/non) : `)).trim()
  if (confirmation !== 'oui') return console.log('Suppression annulée.')
  await trainingUserRepository.write(users.filter((item) => item.username !== normalized))
  console.log('Client supprimé.')
}

async function main() {
  try {
    switch (action) {
      case 'add': await add(); break
      case 'list': await list(); break
      case 'disable': await updateStatus(false); break
      case 'enable': await updateStatus(true); break
      case 'update-courses': await updateCourses(); break
      case 'reset-password': await resetPassword(); break
      case 'delete': await remove(); break
      default:
        console.log('Usage : node scripts/training-users.mjs [add|list|disable|enable|update-courses|reset-password|delete]')
        process.exitCode = 1
    }
  } catch (error) {
    console.error(`Erreur : ${error.message}`)
    process.exitCode = 1
  } finally {
    rl.close()
  }
}

main()
