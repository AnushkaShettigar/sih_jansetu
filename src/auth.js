const DEMO_AUTH_KEY = 'jansetu-demo-auth'

export function setDemoAuth(role) {
  sessionStorage.setItem(DEMO_AUTH_KEY, role)
}

export function clearDemoAuth() {
  sessionStorage.removeItem(DEMO_AUTH_KEY)
}

export function isDemoAuthenticated() {
  return Boolean(sessionStorage.getItem(DEMO_AUTH_KEY))
}
