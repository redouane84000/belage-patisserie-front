async function request(path, options = {}) {
  const { headers: optionHeaders, ...rest } = options
  const headers = { ...(optionHeaders || {}) }
  if (rest.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const response = await fetch(`/api/training/${path}`, {
    ...rest,
    credentials: 'include',
    cache: 'no-store',
    headers,
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
  adminUsers: () => request('admin/users'),
  adminAction: (action, payload) => request(`admin/${action}`, { method: 'POST', body: JSON.stringify(payload) }),
}
