const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options)
  } catch {
    throw new Error('Cannot reach the task server. Check that the backend is running.')
  }

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'The request could not be completed.')
  }

  return data
}

export function getTasks(status = 'all') {
  return request(`/tasks?status=${encodeURIComponent(status)}`)
}

export function createTask(taskDetails) {
  return request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskDetails),
  })
}

export function updateTask(id, changes) {
  return request(`/tasks/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })
}

export function deleteTask(id) {
  return request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function getDailyProgress() {
  return request('/tasks/progress/daily')
}