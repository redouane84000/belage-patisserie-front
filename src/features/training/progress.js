const storageKey = (username) => `belage-training-progress:${username}`

function read(username) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(username)) || '{"completed":[],"lastLesson":null}')
  } catch {
    return { completed: [], lastLesson: null }
  }
}

export function getTrainingProgress(username) {
  return read(username)
}

export function saveTrainingProgress(username, progress) {
  localStorage.setItem(storageKey(username), JSON.stringify(progress))
}

export function completeLesson(username, lessonId) {
  const progress = read(username)
  const completed = [...new Set([...progress.completed, lessonId])]
  const next = { ...progress, completed, lastLesson: lessonId }
  saveTrainingProgress(username, next)
  return next
}

export function setLastLesson(username, lessonId) {
  const progress = { ...read(username), lastLesson: lessonId }
  saveTrainingProgress(username, progress)
  return progress
}

export function clearTrainingProgress(username) {
  localStorage.removeItem(storageKey(username))
}
