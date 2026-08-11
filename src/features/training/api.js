async function request(path, options = {}) {
  const response = await fetch(`/api/training/${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(body?.error || 'Une erreur est survenue.')
    error.status = response.status
    throw error
  }
  return body
}

export const trainingApi = {
  login: (username, password) => request('login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  logout: () => request('logout', { method: 'POST' }),
  session: () => request('session'),
  courses: () => request('courses'),
  course: (courseId) => request(`course/${encodeURIComponent(courseId)}`),
}
