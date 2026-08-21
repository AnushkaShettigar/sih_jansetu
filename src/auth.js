const DEMO_AUTH_KEY = 'jansetu-demo-auth'

function normalizeRole(role) {
  const value = String(role || '').toLowerCase()
  return value === 'admin' ? 'Admin' : value === 'authority' ? 'Authority' : value === 'citizen' ? 'Citizen' : null
}

export function setDemoAuth(role) {
  const user = typeof role === 'string' ? { role } : role
  sessionStorage.setItem(DEMO_AUTH_KEY, JSON.stringify({ ...user, role: normalizeRole(user?.role) }))
}

export function clearDemoAuth() {
  sessionStorage.removeItem(DEMO_AUTH_KEY)
}

export function isDemoAuthenticated() {
  return Boolean(getDemoUser())
}

export function getDemoUser() {
  try {
    const value = JSON.parse(sessionStorage.getItem(DEMO_AUTH_KEY) || 'null')
    if (typeof value === 'string') return { role: normalizeRole(value) }
    return value?.role ? { ...value, role: normalizeRole(value.role) } : null
  } catch { return null }
}
