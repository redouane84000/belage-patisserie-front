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

export function setSessionCookie(res, token) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`,
  )
}

export function clearSessionCookie(res) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  )
}

export function publicUser(user) {
  return {
    firstName: user.firstName,
    username: user.username,
    purchasedCourses: user.purchasedCourses,
  }
}
