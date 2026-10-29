import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from './constants.js'

const encode = (value) => Buffer.from(value).toString('base64url')
const decode = (value) => Buffer.from(value, 'base64url').toString('utf8')
const localEnvFile = fileURLToPath(new URL('../../.env.local', import.meta.url))

function sessionSecret() {
  // `vercel dev` runs API functions in a separate process and does not always
  // inherit custom values from .env.local. Node 20+ can load it explicitly.
  if (!process.env.TRAINING_SESSION_SECRET) {
    try {
      process.loadEnvFile?.(localEnvFile)
    } catch {
      // The production deployment never relies on a local env file.
    }
  }

  const secret = process.env.TRAINING_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('TRAINING_SESSION_SECRET must be set to a value of at least 32 characters.')
  }
  return secret
}

function sign(payload) {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

export function normalizeUsername(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9_-]/g, '')
}

export function createSessionToken(user) {
  const payload = encode(JSON.stringify({
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }))
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) return null
  const [payload, signature] = token.split('.')
  const expected = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) return null

  try {
    const session = JSON.parse(decode(payload))
    if (!session.sub || !session.username || session.exp <= Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export function readCookie(req, name = SESSION_COOKIE) {
  const raw = req.headers.cookie || ''
  const match = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function cookieFlags() {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `Path=/; HttpOnly; SameSite=Lax${secure}`
}

export function disableAuthCache(res) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Vary', 'Cookie')
}

export function setSessionCookie(res, token) {
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toUTCString()
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieFlags()}; Max-Age=${SESSION_MAX_AGE_SECONDS}; Expires=${expires}`,
  )
}

export function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; ${cookieFlags()}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  )
}

export function publicUser(user) {
  const isAdmin = user.role === 'admin' || user.username === 'redktm' || user.username === 'miriam' || user.username === 'belage-57056'
  return {
    firstName: user.firstName,
    username: user.username,
    purchasedCourses: user.purchasedCourses,
    isAdmin,
  }
}
