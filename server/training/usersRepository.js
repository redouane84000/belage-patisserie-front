import fs from 'node:fs/promises'

// Keep the JSON file statically discoverable by Vercel's serverless bundler.
const usersFile = new URL('./users.json', import.meta.url)

function assertUsers(value) {
  if (!Array.isArray(value)) throw new Error('Training users storage is invalid.')
  return value
}

/**
 * File-backed repository intentionally used only by serverless routes and local scripts.
 * Vercel's runtime filesystem is read-only: user management must happen locally, be
 * committed, then redeployed. Replace this module with a database adapter later.
 */
export const trainingUserRepository = {
  async list() {
    return assertUsers(JSON.parse(await fs.readFile(usersFile, 'utf8')))
  },

  async findByUsername(username) {
    const users = await this.list()
    return users.find((user) => user.username === username) ?? null
  },

  async findById(id) {
    const users = await this.list()
    return users.find((user) => user.id === id) ?? null
  },

  async write(users) {
    await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`, 'utf8')
  },
}
