import crypto from 'node:crypto'
import { normalizeUsername } from './security.js'

const PASSWORD_WORDS = ['Rose', 'Fleur', 'Ivoire', 'Creme', 'Vanille', 'Doree', 'Miel', 'Cacao', 'Nacre', 'Jasmin']
const RESERVED = new Set(['admin', 'redktm', 'miriam', 'cliente'])

export function generateReadablePassword() {
  const first = PASSWORD_WORDS[crypto.randomInt(PASSWORD_WORDS.length)]
  const second = PASSWORD_WORDS[crypto.randomInt(PASSWORD_WORDS.length)]
  return `${first}${second}${crypto.randomInt(10, 100)}!`
}

export async function allocateUsername(supabase, { firstName, lastName } = {}) {
  const first = normalizeUsername(firstName)
  const last = normalizeUsername(lastName)
  const candidates = [first && last ? `${first}${last}` : null, first, last].filter(Boolean)

  for (const candidate of candidates) {
    if (candidate.length < 3 || RESERVED.has(candidate)) continue
    const { data } = await supabase.from('profiles').select('id').eq('username', candidate).maybeSingle()
    if (!data) return candidate
  }

  while (true) {
    const username = `belage-${crypto.randomInt(10000, 100000)}`
    const { data } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle()
    if (!data) return username
  }
}
